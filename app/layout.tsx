import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Figtree, Inter, Newsreader, Noto_Sans_Bengali, Noto_Serif_Bengali } from "next/font/google";
import "./globals.css";
import "./sj24.css";

// Inter for interface text, Newsreader (a serif drawn for news) for headlines.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-news", display: "swap" });
// Noto's Bengali-script fonts cover Assamese, including ৰ and ৱ. Not preloaded,
// so English readers don't download them.
const assamese = Noto_Sans_Bengali({ subsets: ["bengali"], variable: "--font-as", display: "swap", preload: false });
const assameseSerif = Noto_Serif_Bengali({
  subsets: ["bengali"],
  variable: "--font-as-news",
  display: "swap",
  preload: false,
});
// The newsroom screens still use Figtree.
const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sj24.in"),
  title: { default: "SATYAMEV JAYATE 24 | The truth is rising.", template: "%s | SJ24" },
  description: "News from Assam, the Northeast, India and the world, in Assamese and English.",
  openGraph: { siteName: "SATYAMEV JAYATE 24", images: ["/sj24-icon.png"] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0c0f" },
  ],
};

// Applies the saved reading mode before the first paint, so dark mode doesn't flash.
const themeScript = `try{var t=localStorage.getItem("sj24-theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t}catch(e){}`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Set by middleware from ?lang=as, so screen readers and search engines get the right language.
  const lang = (await headers()).get("x-sj-lang") === "as" ? "as" : "en";
  return (
    <html
      lang={lang}
      className={`${inter.variable} ${newsreader.variable} ${assamese.variable} ${assameseSerif.variable} ${figtree.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
