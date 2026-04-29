import './globals.css';
import QueryProvider from '@/providers/QueryProvider';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Next Finance CRUD',
  description: 'Next.js 기반 금융 CRUD 프로젝트'
};

export default function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}