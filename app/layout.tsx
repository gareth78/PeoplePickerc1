import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PeoplePickerc1 - Internal People Directory',
  description: 'Search and find colleagues using Okta integration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
