import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import AppChrome from "./components/AppChrome";
import AuthProvider from "./components/AuthProvider";

const siteUrl = "https://winnersfoundationschool.com";
const schoolName = "Winners' Foundation School";
const schoolDescription =
  "Winners' Foundation School in Benin City provides faith-based nursery, primary, and secondary education focused on academic excellence, character, discipline, and student development.";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: schoolName,
  title: {
    default: `${schoolName} | Faith-Based School in Benin City`,
    template: `%s | ${schoolName}`,
  },
  description: schoolDescription,
  keywords: [
    "Winners' Foundation School",
    "Winners Foundation School",
    "Winners' Foundation School Benin City",
    "faith based school in Benin City",
    "private school in Benin City",
    "nursery school in Benin City",
    "primary school in Benin City",
    "secondary school in Benin City",
    "school admissions Benin City",
  ],
  authors: [{ name: schoolName }],
  creator: schoolName,
  publisher: schoolName,
  category: "Education",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "/",
    siteName: schoolName,
    title: `${schoolName} | Faith-Based School in Benin City`,
    description: schoolDescription,
    images: [
      {
        url: "/images/Hero.jpeg",
        width: 1200,
        height: 630,
        alt: "Winners' Foundation School campus and students",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${schoolName} | Faith-Based School in Benin City`,
    description: schoolDescription,
    images: ["/images/Hero.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

const schoolStructuredData = {
  "@context": "https://schema.org",
  "@type": "School",
  name: schoolName,
  alternateName: "Winners Foundation School",
  url: siteUrl,
  logo: `${siteUrl}/logo.PNG`,
  image: `${siteUrl}/images/Hero.jpeg`,
  description: schoolDescription,
  email: "wfsonline1999@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "2, Airhueghiomon Street, Osazuwa, Off Etete Road, Enogie",
    addressLocality: "Benin City",
    addressRegion: "Edo State",
    addressCountry: "NG",
  },
  areaServed: {
    "@type": "City",
    name: "Benin City",
  },
  sameAs: [siteUrl],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-white overflow-x-hidden">
        <script type="application/ld+json">
          {JSON.stringify(schoolStructuredData)}
        </script>
        <Toaster position="top-right" reverseOrder={false} />

        <AuthProvider>
          <AppChrome>{children}</AppChrome>
        </AuthProvider>
      </body>
    </html>
  );
}
