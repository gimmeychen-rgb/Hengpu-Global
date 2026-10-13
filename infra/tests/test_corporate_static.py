#!/usr/bin/env python3
"""Read-only HTTP/HTML checks for an isolated corporate Nginx deployment."""
import argparse
from html.parser import HTMLParser
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import urlsplit, unquote, quote
from urllib.request import Request, build_opener, HTTPRedirectHandler


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.lang = None
        self.links = []
        self.description = None
        self.assets = set()
        self.title = ""
        self.in_title = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "html":
            self.lang = attrs.get("lang")
        if tag == "title":
            self.in_title = True
        if tag == "meta" and attrs.get("name") == "description":
            self.description = attrs.get("content")
        if tag == "link":
            self.links.append(attrs)
        for key in ("src", "href"):
            value = attrs.get(key, "")
            if value.startswith("/_next/static/"):
                self.assets.add(value)

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base-url", default="http://127.0.0.1:8080")
    parser.add_argument("--site-origin", default="https://hengpuglobal.com")
    parser.add_argument("--export-dir", help="optional matching exported directory for filesystem checks")
    args = parser.parse_args()
    base = args.base_url.rstrip("/")
    origin = args.site_origin.rstrip("/")
    opener = build_opener(NoRedirect())

    def request(path, method="GET"):
        data = b"{}" if method == "POST" else None
        try:
            response = opener.open(Request(base + path, data=data, method=method), timeout=10)
        except HTTPError as error:
            response = error
        with response:
            return response.status, response.headers, response.read()

    status, headers, _ = request("/")
    assert status == 307 and headers.get("Location") == "/en", "root redirect"
    all_assets = set()
    for locale, expected_title, text in [
        ("en", "Hengpu Global Supply Chain", "Connecting Global Demand"),
        ("zh", "恒普全球供应链", "连接全球需求"),
    ]:
        status, headers, body = request("/" + locale)
        assert status == 200 and text.encode() in body, locale
        assert headers.get("X-Content-Type-Options") == "nosniff"
        assert headers.get("X-Frame-Options") == "DENY"
        assert "noindex" in headers.get("X-Robots-Tag", ""), "preview indexing guard"
        page = Page()
        page.feed(body.decode("utf-8"))
        assert page.lang == locale and page.title == expected_title and page.description
        assert [x["href"] for x in page.links if x.get("rel") == "canonical"] == [origin + "/" + locale]
        assert {x["hreflang"]: x["href"] for x in page.links if x.get("rel") == "alternate" and "hreflang" in x} == {"en": origin + "/en", "zh": origin + "/zh"}
        if args.export_dir:
            assert Path(args.export_dir, locale + ".html").is_file()
        assert request("/" + locale, "HEAD")[0] == 200
        all_assets.update(page.assets)
        print(f"/{locale}: content, language, SEO, headers and HEAD passed")

    assert all_assets, "no framework assets found"
    if args.export_dir:
        export_root = Path(args.export_dir)
        for asset_file in (export_root / "_next/static").rglob("*"):
            if asset_file.is_file() and asset_file.suffix in {".css", ".js", ".woff", ".woff2", ".ttf", ".otf", ".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif", ".ico", ".svg"}:
                all_assets.add("/" + asset_file.relative_to(export_root).as_posix())
    all_assets = {quote(unquote(asset), safe="/") for asset in all_assets}
    for asset in sorted(all_assets):
        status, headers, body = request(asset)
        assert status == 200 and body, asset
        assert "max-age=31536000" in headers.get("Cache-Control", ""), asset
        assert headers.get("X-Content-Type-Options") == "nosniff", asset
        if args.export_dir:
            assert Path(args.export_dir, unquote(urlsplit(asset).path).lstrip("/")).is_file(), asset
    print(f"All {len(all_assets)} referenced/exported CSS/JS/static assets loaded")

    forbidden = [
        "/fr", "/EN", "/en/", "/en.html", "/en.txt", "/404.html",
        "/en/unknown", "/zh/unknown", "/login", "/register", "/dashboard",
        "/requests", "/requests/create", "/requests/test/matches", "/suppliers",
        "/admin", "/admin/users", "/api", "/api/auth/login", "/auth/register",
        "/users", "/projects", "/health", "/_next/image?url=/en&w=64&q=75",
        "/_next/static/", "/_next/static/chunks/", "/_next/static/missing.js",
        "/_next/static/secret.map", "/.env", "/.git/config",
        "/%6cogin", "/api%2fauth/login", "/requests/../admin/users",
    ]
    for path in forbidden:
        assert request(path)[0] == 404, path
    assert request("/api/auth/login", "POST")[0] == 404
    assert request("/en?utm_source=local-review")[0] == 200
    print(f"All {len(forbidden)} forbidden/unknown paths and API POST returned 404")
    print("Corporate static HTTP checks passed")


if __name__ == "__main__":
    main()
