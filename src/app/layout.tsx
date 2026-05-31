import type {Metadata} from "next";
import {DM_Sans, Fraunces} from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["700"],
  style: ["italic"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Senior Backend & Cloud Engineer Portfolio",
  description: "Personal portfolio for a senior backend and cloud engineer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${fraunces.variable}`}>
        {children}
      </body>
    </html>
  );
}
