import type { Metadata } from "next";
import { headers } from "next/headers";
import { Manrope, Newsreader } from "next/font/google";
import { Footer, Header } from "./components/SiteChrome";
import "./globals.css";

const sans = Manrope({ variable: "--font-sans", subsets: ["latin"] });
const serif = Newsreader({ variable: "--font-serif", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "altaie.app";
  const protocol = requestHeaders.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);

  return {
    metadataBase: base,
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
}

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
