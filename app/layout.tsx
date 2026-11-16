import type { Metadata } from "next";
import { Inter, Instrument_Serif, Space_Grotesk } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const accent = Instrument_Serif({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Rohan Makwana — Building What's Next",
  description:
    "Rohan Makwana is a BCA student in Ahmedabad, India, exploring software, AI, and the art of building useful things. Projects, experiments, and a learning journey in public.",
  openGraph: {
    title: "Rohan Makwana — Building What's Next",
    description:
      "BCA student in Ahmedabad exploring software, AI, and the art of building useful things.",
    type: "website",
    siteName: "Rohan Makwana",
  },
  twitter: {
    card: "summary",
    title: "Rohan Makwana — Building What's Next",
    description:
      "BCA student in Ahmedabad exploring software, AI, and the art of building useful things.",
  },
};

export const viewport = {
  themeColor: "#0c0c09",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${accent.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
