require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const uploadRoutes = require('./routes/upload');

const app = express();

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    // Allow localhost and any vercel/render/netlify domain
    const allowed = [
      /localhost/,
      /\.vercel\.app$/,
      /\.onrender\.com$/,
      /\.netlify\.app$/,
      /biralstore/,
      /biral\.shop/,
    ];
    if (allowed.some(pattern => pattern.test(origin))) {
      return callback(null, true);
    }
    callback(null, true); // Allow all for now
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', time: new Date().toISOString() });
});

// Dynamic Sitemap Generator for SEO
app.get('/sitemap.xml', async (req, res) => {
  try {
    const Product = require('./models/Product');
    const Category = require('./models/Category');
    
    const [products, categories] = await Promise.all([
      Product.find({ active: true }).select('slug updatedAt'),
      Category.find({ isActive: true }).select('slug updatedAt')
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

    xml += `\n</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    console.error('Sitemap Error:', err);
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
