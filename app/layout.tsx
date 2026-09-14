import type { Metadata, Viewport } from "next";
import { Caveat, Nunito } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ServiceWorkerRegister } from "@/components/sw-register";
import "./globals.css";

const hand = Caveat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-hand",
});

const body = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Scribble Notes",
  description: "A fun, colorful sticky-notes app for jotting things down.",
  applicationName: "Scribble Notes",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Scribble Notes",
  },
};

export const viewport: Viewport = {
  themeColor: "#FBF3E3",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const captureInstallPromptScript = `
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    window.__deferredInstallPrompt = e;
    window.dispatchEvent(new Event('bip-ready'));
  });
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${hand.variable} ${body.variable} font-[var(--font-body)]`}
        suppressHydrationWarning
      >
        <script dangerouslySetInnerHTML={{ __html: captureInstallPromptScript }} />
        <ThemeProvider>{children}</ThemeProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
