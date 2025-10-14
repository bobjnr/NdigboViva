import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: "Ndigbo Viva - Know Your Roots, Build Solidarity, Invest at Home",
  description: "Join our community as we celebrate Igbo culture and build a stronger future together. Umuigbo Kunienu!",
  keywords: "Igbo, culture, community, Nigeria, diaspora, investment, solidarity, Ndigbo, Umuigbo, Igbo heritage, cultural preservation",
  authors: [{ name: "Ndigbo Viva" }],
  openGraph: {
    title: "Ndigbo Viva - Know Your Roots, Build Solidarity, Invest at Home",
    description: "Join our community as we celebrate Igbo culture and build a stronger future together.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/Ndigbo Viva Logo.jpg",
        width: 1200,
        height: 630,
        alt: "Ndigbo Viva Logo",
      },
    ],
  },
  // TikTok doesn't have card metadata like Twitter, so we'll keep this for other platforms
  twitter: {
    card: "summary_large_image",
    title: "Ndigbo Viva - Know Your Roots, Build Solidarity, Invest at Home",
    description: "Join our community as we celebrate Igbo culture and build a stronger future together.",
    images: ["/Ndigbo Viva Logo.jpg"],
  },
  icons: {
    icon: "/Ndigbo Viva Logo.jpg",
    shortcut: "/Ndigbo Viva Logo.jpg",
    apple: "/Ndigbo Viva Logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <Providers>
          <ErrorBoundary>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
