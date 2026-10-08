import './globals.css';
import { Providers } from './providers';
import { AppShell } from '@/components/AppShell';

export const metadata = {
  title: 'KR Ladies World - Management Portal',
  description: 'Billing, Receipts, and Management System',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
