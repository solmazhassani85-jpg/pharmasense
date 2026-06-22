import type { Metadata } from "next";
import { Vazirmatn, DM_Serif_Display, DM_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DemoBanner from "@/components/DemoBanner";
import FloatingBookButton from "@/components/FloatingBookButton";

// فونت اصلی فارسی برای کل سایت (متن بدنه و تیترها)
const vazir = Vazirmatn({
  variable: "--font-vazir",
  subsets: ["arabic", "latin"],
  display: "swap",
});

// تیتر/واژه‌نشان لاتین برند — DM Serif Display
const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

// داده‌های دارویی — DM Mono
const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PharmaSense — مشاوره دارویی تخصصی",
    template: "%s | PharmaSense",
  },
  description:
    "PharmaSense؛ مشاوره دارویی کاملاً شخصی برای فارسی‌زبانان. بررسی تداخلات دارویی، دوزبندی و عوارض — با تخصص بالینی، نه گوگل. دانش دارویی، دلسوزی انسانی.",
  keywords: [
    "مشاوره دارویی",
    "تداخل دارویی",
    "متخصص دارو",
    "PharmaSense",
    "مشاوره آنلاین دارو",
  ],
  openGraph: {
    title: "PharmaSense — مشاوره دارویی تخصصی",
    description: "دانش دارویی، دلسوزی انسانی.",
    type: "website",
    locale: "fa_IR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      data-scroll-behavior="smooth"
      className={`${vazir.variable} ${dmSerif.variable} ${dmMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <DemoBanner />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingBookButton />
      </body>
    </html>
  );
}
