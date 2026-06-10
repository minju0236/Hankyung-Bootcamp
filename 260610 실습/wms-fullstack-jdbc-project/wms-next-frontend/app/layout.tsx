
import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'WMS Control Center',
  description: 'Next.js + Spring Boot + MariaDB WMS project',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
