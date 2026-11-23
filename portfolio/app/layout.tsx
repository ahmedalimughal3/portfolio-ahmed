import type { Metadata } from "next";
import { siteUrl } from "@/lib/site-metadata";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Ahmed — Designer & Developer",
  description:
    "I design and build thoughtful digital experiences, from the first sketch to the final pixel.",
  icons: {
    icon: "/ahmed-profile.jfif",
    shortcut: "/ahmed-profile.jfif",
    apple: "/ahmed-profile.jfif",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
