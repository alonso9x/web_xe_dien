import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Xe Điện Eiko | Xe Điện Minh Anh",
  description: "Powelldd Eiko mang đến giải pháp di chuyển đô thị hoàn hảo với thiết kế nhỏ gọn, linh hoạt. Tích hợp hệ điều hành iMA AI và Smartkey Pro tiện lợi.",
  alternates: {
    canonical: "https://xedienminhanh.vn/eiko",
  },
};

export default function EikoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // BỘ KHUNG SCHEMA CHUẨN SEO DÀNH RIÊNG CHO TÂN BINH EIKO
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Xe máy điện Powelldd Eiko",
    "image": "https://xedienminhanh.vn/images/powelldd/eiko/do-fire.png",
    "description": "Powelldd Eiko mang đến giải pháp di chuyển đô thị hoàn hảo với thiết kế nhỏ gọn, linh hoạt. Tích hợp hệ điều hành thông minh iMA AI, Smartkey Pro và ắc quy Graphene bền bỉ, Eiko không chỉ an toàn tuyệt đối mà còn mang lại trải nghiệm lái êm ái, tiện lợi tối đa cho mọi nhu cầu hằng ngày.",
    "sku": "POWELLDD-EIKO",
    "brand": {
      "@type": "Brand",
      "name": "Powelldd"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://xedienminhanh.vn/eiko",
      "priceCurrency": "VND",
      "price": "11990000",
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