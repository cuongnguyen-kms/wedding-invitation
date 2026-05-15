import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quoc Cuong & Bao Quyen Wedding Invitation",
  description: "A romantic floral wedding invitation experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
