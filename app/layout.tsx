import type { Metadata, Viewport } from "next";
import { Figtree, Inter, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import "./sj24.css";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
// Noto's Bengali-script fonts cover Assamese, including ৰ and ৱ.
const assamese = Noto_Sans_Bengali({ subsets: ["bengali"], variable: "--font-as", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sj24.in"),
  title: { default: "SATYAMEV JAYATE 24 | The truth is rising.", template: "%s | SJ24" },
  description: "News from Assam, the Northeast, India and the world, in Assamese and English.",
  openGraph: { siteName: "SATYAMEV JAYATE 24", images: ["/sj24-icon.png"] },
  icons: { icon: "/sj24-icon-96.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

// Applies the saved reading mode before the first paint, so dark mode doesn't flash.
const themeScript = `try{var t=localStorage.getItem("sj24-theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${figtree.variable} ${inter.variable} ${assamese.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
