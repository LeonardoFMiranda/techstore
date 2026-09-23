import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "TechStore — Eletrônicos Premium",
    template: "%s | TechStore",
  },
  description:
    "Loja de eletrônicos premium: fones, teclados, monitores, mouses e muito mais. Compre com segurança e receba em casa.",
  keywords: ["eletrônicos", "fones de ouvido", "teclado mecânico", "monitor", "mouse", "tech"],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "TechStore",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="pt-BR" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
        <body className={`${inter.className} antialiased`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
