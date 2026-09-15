import type { Metadata, ResolvingMetadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import { Clock, ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import fs from 'fs';
import path from 'path';
import FallbackImage from './FallbackImage';
import ReactMarkdown from 'react-markdown';

export const dynamic = 'force-dynamic';

const elegantFont = Plus_Jakarta_Sans({ 
  subsets: ["latin", "vietnamese"], 
  weight: ["300", "400", "500", "600", "700"],
  display: "swap"
});

async function getArticleById(id: string) {
  try {
    const filePath = '/var/www/shop-xe-dien/public/newsData.json';
    if (!fs.existsSync(filePath)) return null;
    
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    const newsList = Array.isArray(data) ? data : [data];

    const decodedId = decodeURIComponent(id);
    
    return newsList.find((news: any) => {
        if (!news.id) return false;
        const currentId = news.id.toString();
        return currentId === id || currentId === decodedId;
    });
  } catch (error) {
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: any },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const article = await getArticleById(resolvedParams.id);

  if (!article) {
    return {
      title: "Không tìm thấy bài viết | Xe Điện Minh Anh",
    };
  }

  const url = `https://xedienminhanh.vn/tin-tuc/${resolvedParams.id}`;
  let imgUrl = article.imageUrl || article.image || "/images/default-news.jpg";
  if (imgUrl && !imgUrl.startsWith('http') && !imgUrl.startsWith('/')) {
    imgUrl = '/' + imgUrl;
  }
  
  const fullImgUrl = imgUrl.startsWith('http') ? imgUrl : `https://xedienminhanh.vn${imgUrl}`;

  return {
    title: `${article.title} | Xe Điện Minh Anh`,
    description: article.excerpt || "Đọc bài viết chi tiết tại website Xe Điện Minh Anh - Long Biên.",
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: url,
      images: [{ url: fullImgUrl }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [fullImgUrl],
    }
  };
}

export default async function NewsDetail({ params }: { params: any }) {
  const resolvedParams = await Promise.resolve(params);
  const articleId = resolvedParams.id;
  
  const article = await getArticleById(articleId);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F4F6] px-6 text-center">
        <h1 className="text-3xl font-bold mb-2 text-black">Không tìm thấy bài viết!</h1>
        <p className="text-red-500 mb-8 font-mono text-sm bg-red-50 px-4 py-2 rounded">Log kiểm tra ID: {articleId}</p>
        <Link href="/tin-tuc" className="bg-black text-white px-6 py-3 rounded-full hover:scale-105 transition-transform flex items-center gap-2">
          <ArrowLeft size={16}/> Quay lại danh sách
        </Link>
      </div>
    );
  }

  const rawContent = article.content || article.fullContent || "";

  let imgUrl = article.imageUrl || article.image || "/images/default-news.jpg";
  if (imgUrl && !imgUrl.startsWith('http') && !imgUrl.startsWith('/')) {
    imgUrl = '/' + imgUrl;
  }

  const dateStr = article.createdAt ? new Date(article.createdAt).toLocaleDateString('vi-VN') : (article.date || "Vừa cập nhật");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "image": [
      imgUrl.startsWith('http') ? imgUrl : `https://xedienminhanh.vn${imgUrl}`
    ],
    "datePublished": article.createdAt || new Date().toISOString(),
    "description": article.excerpt,
    "author": [{
        "@type": "Organization",
        "name": "Xe Điện Minh Anh",
        "url": "https://xedienminhanh.vn"
      }]
  };

  return (
    <main className={`min-h-screen bg-white text-neutral-800 ${elegantFont.className} font-light`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="w-full bg-white/80 backdrop-blur-2xl z-50 border-b border-neutral-100">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center">
          <Link href="/tin-tuc" className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-neutral-400 hover:text-black transition-colors">
            <ArrowLeft size={14} /> Quay lại
          </Link>
        </div>
      </header>

      <div className="w-full h-[40vh] md:h-[60vh] relative bg-neutral-100">
        <FallbackImage 
          src={imgUrl} 
          alt={article.title} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      <article className="max-w-3xl mx-auto px-6 py-16 -mt-32 relative z-10 bg-white rounded-t-[3rem] shadow-2xl shadow-black/5">
        <div className="flex items-center gap-4 text-neutral-500 text-xs font-medium uppercase tracking-widest mb-6">
          <span className="bg-neutral-100 px-3 py-1 rounded-full text-black">{article.category || "Tin Tức"}</span>
          <span className="flex items-center gap-1"><Calendar size={14}/> {dateStr}</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-semibold leading-tight mb-8">
          {article.title}
        </h1>

        <div className="text-lg font-medium text-neutral-600 italic border-l-4 border-red-500 pl-6 mb-10 leading-relaxed">
          {article.excerpt}
        </div>

        <div className="text-neutral-700 leading-loose text-[17px]">
          <ReactMarkdown
            components={{
              // ÉP CĂN ĐỀU 2 LỀ (text-justify) VÀO TẬN CỔ TẤT CẢ CÁC THẺ
              p: ({node, ...props}) => <p className="mb-6 last:mb-0 text-justify w-full" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-6 text-justify w-full" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-6 text-justify w-full" {...props} />,
              blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-neutral-300 pl-4 italic text-neutral-500 mb-6 text-justify w-full" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-2xl font-semibold mt-8 mb-4 text-black text-left w-full" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-xl font-semibold mt-6 mb-3 text-black text-left w-full" {...props} />,
              a: ({node, ...props}) => (
                <a 
                  {...props} 
                  className="text-blue-600 font-semibold hover:text-blue-800 underline transition-colors" 
                  target={props.href?.startsWith('http') ? "_blank" : "_self"} 
                  rel="noopener noreferrer"
                />
              ),
              strong: ({node, ...props}) => <strong className="font-semibold text-black" {...props} />
            }}
          >
            {rawContent}
          </ReactMarkdown>
        </div>

        <div className="mt-16 p-8 bg-neutral-50 rounded-3xl text-center border border-neutral-100">
          <h3 className="text-xl font-semibold mb-3">Bạn quan tâm đến các dòng xe điện tại Minh Anh?</h3>
          <p className="text-neutral-500 mb-6">Liên hệ ngay để nhận báo giá và ưu đãi mới nhất hôm nay.</p>
          <a href="https://zalo.me/0917747777" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full text-sm font-semibold hover:bg-red-600 transition-colors">
            Chat qua Zalo <ArrowRight size={16} />
          </a>
        </div>
      </article>
    </main>
  );
}