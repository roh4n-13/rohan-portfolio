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
  metadataBase: new URL("https://rohanmakwana.vercel.app"),
  alternates: { canonical: "/" },
  verification: {
    google: "EScX6zVF5IeFqGzva0ZPbc0AER3wquQHlg3YP6YqS1w",
  },
  title: "Rohan Makwana — Building What's Next",
  description:
    "Rohan Makwana is a BCA student in Ahmedabad, India, exploring software, AI, and the art of building useful things. Projects, experiments, and a learning journey in public.",
  openGraph: {
    title: "Rohan Makwana — Building What's Next",
    description:
      "BCA student in Ahmedabad exploring software, AI, and the art of building useful things.",
    url: "https://rohanmakwana.vercel.app",
    type: "website",
    siteName: "Rohan Makwana",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Rohan Makwana — Building What's Next. BCA student in Ahmedabad, India.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rohan Makwana — Building What's Next",
    description:
      "BCA student in Ahmedabad exploring software, AI, and the art of building useful things.",
    images: ["/og.png"],
  },
};

export const viewport = {
  themeColor: "#0c0c09",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Rohan Makwana",
    url: "https://rohanmakwana.vercel.app",
    jobTitle: "Aspiring Computer Scientist",
    description:
      "BCA student in Ahmedabad, India, exploring software, AI, and the art of building useful things.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ahmedabad",
      addressRegion: "Gujarat",
      addressCountry: "IN",
    },
    sameAs: [
      "https://github.com/roh4n-13",
      "https://www.instagram.com/roh4n_11/",
    ],
  };
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${accent.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
