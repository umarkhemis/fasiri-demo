import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fasiri — African Language AI",
  description:
    "Translate to 19+ African languages and chat with an AI that responds in your language. Powered by Fasiri API.",
  openGraph: {
    title: "Fasiri — African Language AI",
    description: "Translate and chat in 19+ African languages. Powered by Sunbird AI, Khaya AI, and HuggingFace.",
    siteName: "Fasiri",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fasiri — African Language AI",
    description: "Translate and chat in 19+ African languages.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
