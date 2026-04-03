import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "co-gdzie-kiedy",
  description: "Shopping list with opportunities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
