import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://xedienminhanh.vn"),
  title: {
    default: "Xe Điện Long Biên | Xe Điện Minh Anh – Đại Lý Chính Hãng",
    template: "%s | Xe Điện Minh Anh",
  },
  description:
    "Đại lý phân phối xe máy điện, xe đạp điện chính hãng tại Long Biên, Hà Nội. Trải nghiệm các dòng xe Powelldd, Vinfast, TMT uy tín với giá tốt nhất.",
  applicationName: "Xe Điện Minh Anh",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://xedienminhanh.vn/",
    siteName: "Xe Điện Minh Anh",
    title: "Xe Điện Long Biên | Xe Điện Minh Anh – Đại Lý Chính Hãng",
    description:
      "Đại lý phân phối xe máy điện, xe đạp điện chính hãng tại Long Biên, Hà Nội. Trải nghiệm các mẫu xe điện thời thượng, chất lượng cao tại 547 Nguyễn Văn Cừ.",
    images: [
      {
        url: "/images/banner/banner-3.png",
        width: 1200,
        height: 630,
        alt: "Xe Điện Minh Anh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Xe Điện Long Biên | Xe Điện Minh Anh – Đại Lý Chính Hãng",
    description:
      "Đại lý phân phối xe máy điện, xe đạp điện chính hãng tại Long Biên, Hà Nội.",
    images: ["/images/banner/banner-3.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://xedienminhanh.vn/#website",
      "url": "https://xedienminhanh.vn/",
      "name": "Xe Điện Minh Anh",
      "alternateName": [
        "Xe Điện Long Biên",
        "Minh Anh E-Scooter",
        "xedienminhanh.vn"
      ],
      "publisher": {
        "@id": "https://xedienminhanh.vn/#store"
      }
    },
    {
      "@type": "AutoDealer",
      "@id": "https://xedienminhanh.vn/#store",
      "name": "Xe Điện Minh Anh",
      "url": "https://xedienminhanh.vn/",
      "telephone": "0917747777",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "547 Nguyễn Văn Cừ, Bồ Đề",
        "addressLocality": "Long Biên",
        "addressRegion": "Hà Nội",
        "addressCountry": "VN"
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "08:00",
        "closes": "21:00"
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className={montserrat.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-11WYGY4N4Z"
        />
        <Script
          id="google-tags"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              
              gtag('config', 'G-11WYGY4N4Z');
              gtag('config', 'AW-18262483267');
            `,
          }}
        />

        {children}
      </body>
    </html>
  );
}