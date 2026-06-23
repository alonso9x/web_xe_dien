import fs from 'fs';
import path from 'path';

function generateSitemap() {
  const baseUrl = 'https://xedienminhanh.vn';
  const dbPath = path.join(process.cwd(), 'src', 'data', 'newsData.json');
  
  let newsList: any[] = [];
  if (fs.existsSync(dbPath)) {
    newsList = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  }

  // Tạo các URL từ bài viết (giả sử id là timestamp của bài viết)
  const newsUrls = newsList.map(item => `
    <url>
      <loc>${baseUrl}/tin-tuc/${item.id}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.8</priority>
    </url>
  `).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${newsUrls}
</urlset>`;

  fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), sitemap);
  console.log("✅ Sitemap đã được cập nhật!");
}

generateSitemap();