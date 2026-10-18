import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter, Sora } from "next/font/google";
import { DemoBanner } from "@/components/layout/demo-banner";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ThemeScript } from "@/components/theme/theme-script";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const sora = Sora({ variable: "--font-sora", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Fictional forex broker demo`,
    template: `%s | ${siteConfig.name} (demo)`,
  },
  description: siteConfig.description,
  applicationName: `${siteConfig.name} (demo)`,
  authors: [{ name: siteConfig.author, url: siteConfig.portfolioUrl }],
  creator: siteConfig.author,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${siteConfig.name} | Fictional forex broker demo`,
    description: siteConfig.description,
    url: "/",
    siteName: `${siteConfig.name} (fictional demo)`,
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Fictional forex broker demo`,
    description: siteConfig.description,
  },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1222" },
  ],
  colorScheme: "light dark",
};

// Truthful structured data only: this is a website, not a real financial service or company.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: `${siteConfig.name} (fictional demo)`,
  url: siteConfig.url,
  description: siteConfig.description,
  inLanguage: "en",
  creator: { "@type": "Person", name: siteConfig.author, url: siteConfig.portfolioUrl },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${sora.variable} ${geistMono.variable}`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-[60] rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <DemoBanner />
        <Header />
        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
