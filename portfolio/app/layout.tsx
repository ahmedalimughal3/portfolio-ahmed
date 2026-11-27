import type { Metadata } from "next";
import { siteUrl } from "@/lib/site-metadata";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "AAM | Full Stack Developer | Mern Stack Developer | Junior Developer at BawdicSoft LLC Pvt. Ltd",
  description:
    "I’m AAM, a Full Stack Developer who enjoys turning ideas into real, working web applications.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
