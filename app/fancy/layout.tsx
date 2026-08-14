import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Xe Điện Fancy | Xe Điện Minh Anh",
  description: "Khám phá xe máy điện Powelldd Fancy với thiết kế thời thượng, đậm chất Ý. Trải nghiệm ngay tại Xe Điện Long Biên - Minh Anh.",
  alternates: {
    canonical: "https://xedienminhanh.vn/fancy",
  },
};

export default function FancyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // BỘ KHUNG SCHEMA CHUẨN SEO DÀNH RIÊNG CHO DÒNG FANCY
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Xe máy điện Powelldd Fancy",
    "image": "https://xedienminhanh.vn/images/powelldd/fancy/xam-magic.png",
    "description": "Khám phá xe máy điện Powelldd Fancy với thiết kế thời thượng, đậm chất Ý. Trải nghiệm ngay tại Xe Điện Long Biên - Minh Anh.",
    "sku": "POWELLDD-FANCY",
    "brand": {
      "@type": "Brand",
      "name": "Powelldd"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://xedienminhanh.vn/fancy",
      "priceCurrency": "VND",
      "price": "17990000",
      "priceValidUntil": "2026-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Xe Điện Minh Anh"
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {children}
    </>
  );
}