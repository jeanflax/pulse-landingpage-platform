import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Premium Product Landing Page | DTC Template",
  description: "High-converting landing page template for ecommerce products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
