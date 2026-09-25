import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hengpu Global Supply Chain',
  description:
    'Hengpu connects global demand with trusted Chinese resources, technology, manufacturers and long-term partners.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}