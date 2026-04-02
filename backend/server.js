require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const uploadRoutes = require('./routes/upload');
const articleRoutes = require('./routes/articles');

const app = express();

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    const allowed = [
      /localhost/,
      /\.vercel\.app$/,
      /\.onrender\.com$/,
      /\.netlify\.app$/,
      /biralstore/,
      /biral\.shop/,
      /biral\.store/
    ];
    if (allowed.some(pattern => pattern.test(origin))) {
      return callback(null, true);
    }
    callback(null, true);
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/articles', articleRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', time: new Date().toISOString() });
});

// Dynamic Sitemap Generator for SEO
app.get('/sitemap.xml', async (req, res) => {
  try {
    const Product = require('./models/Product');
    const Category = require('./models/Category');
    const Article = require('./models/Article');
    
    const [products, categories, articles] = await Promise.all([
      Product.find({ active: true }).select('slug updatedAt'),
      Category.find({ isActive: true }).select('slug updatedAt'),
      Article.find({ status: 'active' }).select('slug updatedAt')
    ]);

    const baseUrl = 'https://biral.store';
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/kateqoriyalar</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;

    categories.forEach(cat => {
      xml += `
  <url>
    <loc>${baseUrl}/kateqoriya/${cat.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    products.forEach(prod => {
      xml += `
  <url>
    <loc>${baseUrl}/mehsul/${prod.slug}</loc>
    <lastmod>${new Date(prod.updatedAt).toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;
    });

    articles.forEach(art => {
      xml += `
  <url>
    <loc>${baseUrl}/blog/${art.slug}</loc>
    <lastmod>${new Date(art.updatedAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`;
    });

    xml += `\n</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    console.error('Sitemap Error:', err);
    res.status(500).end();
  }
});

// Google Merchant Center (Shopping) Feed Generator
app.get('/google-shopping-feed.xml', async (req, res) => {
  try {
    const Product = require('./models/Product');
    const products = await Product.find({ active: true });
    
    const baseUrl = 'https://biral.store';
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>BiralStore Az</title>
    <link>${baseUrl}</link>
    <description>BiralStore - Praktik aça, ev, maşın məhsulları</description>`;

    products.forEach(prod => {
      const title = (prod.title || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const desc = (prod.description || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').substring(0, 4900);
      
      xml += `
    <item>
      <g:id>${prod.slug}</g:id>
      <g:title>${title}</g:title>
      <g:description>${desc}</g:description>
      <g:link>${baseUrl}/mehsul/${prod.slug}</g:link>
      <g:image_link>${prod.image}</g:image_link>
      <g:availability>${prod.inStock ? 'in_stock' : 'out_of_stock'}</g:availability>
      <g:price>${prod.price} AZN</g:price>
      <g:condition>new</g:condition>
      <g:brand>BiralStore</g:brand>
    </item>`;
    });

    xml += `
  </channel>
</rss>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    console.error('Google Feed Error:', err);
    res.status(500).end();
  }
});

// Error handler
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB bağlantısı uğurlu');
    app.listen(PORT, () => {
      console.log(`🚀 Server ${PORT} portunda işləyir`);
      console.log(`📡 API: http://localhost:${PORT}/api`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB bağlantı xətası:', err.message);
    process.exit(1);
  });
