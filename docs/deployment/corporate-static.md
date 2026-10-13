# 恒普企业官网静态发布操作手册

## 范围和状态

本方案只发布 `apps/web` 的 `/en`、`/zh`。Next.js 在构建时运行，生产运行镜像只有
Nginx、基础操作系统、静态产物及配置，不运行 Node.js。
平台、admin、后端、PostgreSQL、Redis 均不启动。禁止复用根目录的全栈 `docker-compose.yml`。
官网已移除 `next start` 脚本：静态导出必须由 Nginx 等静态服务器提供，不能使用 `next start`。
`npm run dev:web` 仍用于本地开发；它的 `/` 为 404，发布入口的 307 属于 Nginx，需在容器验收。

本阶段只在本地/隔离环境验证，没有配置真实 DNS、TLS 证书或腾讯云服务器。
以下正式发布、备份与恢复步骤仅作为待审批操作手册，不表示已执行。

## 文件与边界

- `apps/web/next.config.mjs`：`output: 'export'`，生成 `apps/web/out/`。
- `infra/docker/Dockerfile.corporate`：Node 24 构建、Nginx 运行；基础镜像固定摘要。
- `infra/docker/Dockerfile.corporate.dockerignore`：仅允许官网、必要 manifests 和配置进入构建上下文。
- `infra/nginx/corporate.conf`：根入口 307，精确允许语言页面及必要静态资源，其他请求 404。
- `compose.corporate.yml`：独立的单服务栈；默认只有回环端口映射。
- `infra/tests/test_corporate_static.py`：HTTP、SEO、资源及路径隔离验收。

公开路径定义：

| 路径 | 结果 |
|---|---|
| `/` | 307，Location 为 `/en` |
| `/en`、`/zh`，含查询参数 | 静态页面 200 |
| `/_next/static/` 下实际存在的允许类型资源 | 静态资源 200，长缓存 |
| `/en/`、`/en.html`、`/en.txt`、无效语言、平台/admin/API 路径 | 404 |
| 源码映射、环境文件、Git 文件和其他未知路径 | 404 |

当前语言链接使用普通 HTML 锚点，不依赖 RSC 文本请求。导出目录内的 `.txt` 文件保留为
框架产物，但不会通过 Nginx 公开。未来增加客户端路由预取或公共资源时，必须重新审查 allowlist。

Nginx 不配置真实域名或证书；正式 HTTPS 与规范主机跳转由后续经批准的入口层配置承担。
`absolute_redirect off` 保证相对 Location，不把上游 HTTPS 误改为 HTTP。

## 本地构建与验收

要求：受支持的 Node.js 24、npm、Docker Engine、支持 Dockerfile 专用 ignore 文件的现代 BuildKit、
Docker Compose v2；HTTP 验收脚本只依赖 Python 3 标准库。
从仓库根目录执行：

```bash
npm ci
npm run build:web
npm --workspace apps/web exec -- tsc --noEmit --incremental false
npm audit --workspace apps/web

docker compose -p hengpu-corporate-review -f compose.corporate.yml config --quiet
docker compose -p hengpu-corporate-review -f compose.corporate.yml build
docker compose -p hengpu-corporate-review -f compose.corporate.yml up -d --no-build
python3 infra/tests/test_corporate_static.py --base-url http://127.0.0.1:8080
docker compose -p hengpu-corporate-review -f compose.corporate.yml ps
docker compose -p hengpu-corporate-review -f compose.corporate.yml down
```

官网 Docker 构建只执行 web workspace 的 frozen `npm ci`，忽略安装脚本，依赖包仍进行
npm integrity/TLS 校验。Next.js 所需的预编译组件由锁文件依赖提供。
构建阶段没有其他应用源码，不执行平台/服务生命周期脚本。

如果工作环境禁止写入用户 Docker 配置目录，可以为本地构建指定可写的独立目录，
例如 `DOCKER_CONFIG=/tmp/hengpu-corporate-docker`，不要覆盖原来的配置。
如果构建网络需要代理，通过 Docker 的标准临时 build-arg 传递 `HTTP_PROXY`、`HTTPS_PROXY`；
不要把代理凭据写入 Dockerfile、Compose、镜像或日志。
若环境代理使用平台提供的受信 CA，通过临时 BuildKit secret 提供，不能关闭 TLS 校验：

```bash
# 仅在已确认的构建网络需要时使用；CA 文件必须来自受信来源，不能包含私钥。
docker build --network host \
  --build-arg HTTP_PROXY --build-arg HTTPS_PROXY --build-arg NO_PROXY \
  --secret id=corporate_build_ca,src=/path/to/trusted-public-ca-bundle.pem \
  -f infra/docker/Dockerfile.corporate -t hengpu-corporate:local .
```

这只改变构建网络；运行 Compose 仍使用隔离网络与回环端口。
标准 Docker 代理 build-arg 不需要在 Dockerfile 中声明，也不应转成持久 ENV。
CA secret 挂载不会进入镜像层。默认无代理的标准构建不需要该 secret。
若 BuildKit 不认识环境的代理主机别名，先在受信主机解析并核验代理地址，
仅为本次构建增加 `--add-host PROXY_HOST:VERIFIED_PROXY_IP`；不要把环境特有地址写入 Dockerfile。
本地验收可能需要这个环境修正，生产构建应使用其自身经批准的网络配置。

## 可配置项

| 项目 | 含义 |
|---|---|
| `CORPORATE_SITE_URL` | 构建时 canonical/hreflang origin；默认已批准的 `https://hengpuglobal.com`，不是配置真实 DNS |
| `CORPORATE_IMAGE_TAG` | 本地/正式发布镜像标签，默认 `local`；正式发布使用不可混淆的版本标签 |
| `CORPORATE_REVISION` | 镜像标签中的源码版本；未提交构建默认 `uncommitted`，不能伪装为干净提交 |
| `CORPORATE_HTTP_PORT` | 主机回环端口，默认 8080 |

官网不需要数据库 URL、JWT secret 或任何业务 API 凭据。不要向官网构建注入这些变量。
`CORPORATE_SITE_URL` 必须在构建阶段设置；运行时修改不会重写静态 HTML 的 SEO。

## 运行安全和正式发布前置条件

- 容器以 `nginx` 非 root 用户运行、根文件系统只读、仅 `/tmp` 可写、删除 capabilities，
  启用 no-new-privileges、内存/PID/日志限制。
- 主机只允许经批准的入口层暴露 80/443；SSH 限定管理员来源。
- 不公开 8080、3000–3006、3010、3020、5432、6379；同时检查 IPv4、IPv6、Docker 端口与防火墙。
- 检查服务器原有进程和容器，不能假定“不在本 Compose 中”就意味着已经停止。
- 核验 Lighthouse 的 OS、CPU 架构、内存、磁盘、带宽及现有业务。本次运行验证不等于实机验收。
- 核验 apex/www DNS、HTTPS 证书签发与自动续期、HTTP 到 HTTPS 和规范主机跳转。
- 本配置默认发送 `X-Robots-Tag: noindex, nofollow`，保护本地/预览。
  正式允许索引必须经批准后移除该配置行并重新生成镜像；不要把预览镜像直接作为可索引正式站。
- 未添加 robots.txt、sitemap 或新公共资源；未来添加时需明确批准并调整精确路径规则。
- 正式上线前运行可信镜像漏洞扫描器；固定摘要确保版本可识别，但不保证基础镜像没有 CVE。
- 记录两种语言的桌面/移动端截图，并核对 lang、SEO、语言链接及所有拒绝路径。
- HTTPS 入口的主机限制、访问日志和安全响应头需在最终拓扑上复核。本 HTTP 镜像不设置 HSTS。

## 发布记录与最小备份

每次经批准发布保存一份版本记录：源码 commit、工作区是否干净、镜像 ID/基础镜像摘要、
镜像标签、CPU 架构、构建 origin、镜像 archive 校验值、测试结果和时间。

至少备份到服务器之外：

1. 经确认的 Git commit 或源码归档、锁文件和上述配置文件；
2. 完整运行镜像 `docker image save` 的 archive 与 SHA-256 校验值；
3. 单独的静态 `out/` 归档，便于迁往 Nginx、对象存储或 CDN；
4. DNS 与入口配置、证书续期恢复说明；TLS 私钥如需备份，应独立加密存放，绝不进入 Git 或镜像；
5. 上一版可运行镜像、配置和验收记录。

官网没有业务数据库；其访问日志不应当成为恢复页面的依赖。
备份目录必须在仓库外且具备合适权限。例：

```bash
# 将占位目录替换为经批准的安全备份位置；以下不是本阶段已执行的生产操作。
backup_dir=/path/outside/repository/hengpu-release
mkdir -p "$backup_dir"
docker image save hengpu-corporate:APPROVED_TAG -o "$backup_dir/corporate-image.tar"
(cd "$backup_dir" && sha256sum corporate-image.tar > corporate-image.tar.sha256)
tar -C apps/web/out -czf "$backup_dir/corporate-static.tar.gz" .
(cd "$backup_dir" && sha256sum corporate-static.tar.gz > corporate-static.tar.gz.sha256)
```

复制 archive 与校验清单后，在备份目录内运行 `sha256sum -c corporate-image.tar.sha256`，
以及 `sha256sum -c corporate-static.tar.gz.sha256`。清单使用相对文件名，便于异机验证；不能改变预期哈希。
GitHub 源码备份不能替代证书/入口配置和已验证的发布产物。

## 回滚

1. 选择上一版已验证镜像和对应的 Nginx/Compose 配置，不重新构建旧版本。
2. 确认备份校验值，必要时 `docker image load -i ...`。
3. 设置上一版 `CORPORATE_IMAGE_TAG`，仅替换本服务：

```bash
CORPORATE_IMAGE_TAG=PREVIOUS_APPROVED_TAG docker compose -f compose.corporate.yml up -d --no-build --pull never
```

4. 等待健康检查通过，再验证 `/`、语言页面、SEO、资源和拒绝路径。
5. 保持旧版 hashed assets 的缓存策略，观察日志；不要执行全局 `docker system prune` 或影响其他服务。

单容器更换可能造成短暂中断；本阶段不增加负载均衡或蓝绿系统。
若以后需要无中断发布，再单独批准双容器切换方案。

## 异机恢复与迁移

1. 准备受支持的 Linux、Docker/Compose、受控管理员入口；核对 CPU 架构。
2. 从独立备份取回配置、版本记录和镜像 archive，验证 SHA-256 后加载镜像。
3. 以回环端口启动，执行 HTTP/浏览器验收和镜像内容检查。
4. 按经批准的入口拓扑恢复证书/续期配置并检查 HTTPS；最后才变更 DNS。
5. 切换期间保留原服务器和上一版镜像，验证后再撤除旧入口。
6. 最终复核所有非官网端口不可从外网访问。

当前镜像实际验证的 CPU 架构必须记录；恢复到不同架构时，需从同一源码和锁文件重新构建并测试。
固定基础镜像的多架构摘要不等于所有架构均已验收。

部署到对象存储/CDN 时可使用静态归档，但必须重新实现精确路径、根入口 307、404、缓存和 HTTPS 策略。
恢复演练成功后才能宣称可恢复，不能仅凭存在备份文件作出该结论。
