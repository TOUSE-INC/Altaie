import type { Metadata, Viewport } from "next";
import { Manrope, Newsreader } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import { Footer, Header } from "./components/SiteChrome";
import "./globals.css";
import "./mobile-safari.css";

const sans = Manrope({ variable: "--font-sans", subsets: ["latin"] });
const serif = Newsreader({ variable: "--font-serif", subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-visual",
  themeColor: "#050505",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Altaie | Washington, handled.", template: "%s | Altaie" },
  description: "Washington, DC executive chauffeur coordination for airport transfers, hourly assignments, roadshows, and corporate travel.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    type: "website",
    title: "Altaie — Washington, handled.",
    description: "A discreet executive mobility desk for Washington, DC, DCA, IAD, and BWI.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Altaie — Washington, handled." }],
  },
  twitter: { card: "summary_large_image", title: "Altaie — Washington, handled.", description: "Washington's executive mobility desk.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${serif.variable}`}>
        <a className="skip-link" href="#main">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
