import type { Metadata } from "next";
import Script from "next/script";
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
      <body>
        {/* Runs before hydration so a reload never briefly shows a
            browser-restored mid-page scroll position - every visit should
            start at the cover. */}
        <Script id="disable-scroll-restoration" strategy="beforeInteractive">
          {`if ("scrollRestoration" in history) { history.scrollRestoration = "manual"; } window.scrollTo(0, 0);`}
        </Script>
        {children}
      </body>
    </html>
  );
}
