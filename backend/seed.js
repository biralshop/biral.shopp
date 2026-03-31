require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');

const products = [
  {
    title: 'Silikon Mətbəx Alətləri Dəsti',
    description: 'İstiyə davamlı, yapışmayan 12 parça mətbəx dəsti. Hər mətbəx üçün əvəzolunmaz.',
    price: 29.99,
    oldPrice: 39.99,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600',
    category: 'Mətbəx',
    categorySlug: 'metbex',
    badge: 'viral',
    rating: 4.8,
    reviewCount: 342,
    variants: ['Qara', 'Boz', 'Yaşıl'],
    features: ['İstiyə davamlı 230°C', 'BPA-free silikon', '12 parça', 'Maşında yuyulur'],
  },
  {
    title: 'Avtomatik Bitki Sulama Sistemi',
    description: 'Tətilə gedərkən bitkiləriniz susuz qalmaz. 30 günə qədər avto-sulama.',
    price: 18.50,
    oldPrice: 24.00,
    discount: 23,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600',
    category: 'Baxça',
    categorySlug: 'baxca',
    badge: 'trend',
    rating: 4.5,
    reviewCount: 189,
    variants: ['4 ədəd', '8 ədəd', '12 ədəd'],
    features: ['30 günə qədər işləyir', 'Hər qaba uyğun', 'Quraşdırması asan', 'PVC material'],
  },
  {
    title: 'Multifunksional Həyət Rəfi',
    description: 'Paslanmaz polad, 5 mərtəbəli həyət rəfi. Alətlər, güllər və dekor üçün ideal.',
    price: 54.90,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600',
    category: 'Həyət',
    categorySlug: 'heyet',
    badge: null,
    rating: 4.3,
    reviewCount: 87,
    variants: ['3 mərtəbə', '5 mərtəbə'],
    features: ['Paslanmaz polad', '5 mərtəbə', 'Yığılabilən', '50kq yük tutumu'],
  },
  {
    title: 'Universal Maşın Telefon Tutucusu',
    description: '360° dönən, ventilyasiya üzərində bərkidilən premium tutucusu.',
    price: 12.99,
    oldPrice: 19.99,
    discount: 35,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600',
    category: 'Maşın',
    categorySlug: 'masin',
    badge: 'campaign',
    rating: 4.7,
    reviewCount: 521,
    variants: ['Qara', 'Gümüşü'],
    features: ['360° fırlanma', 'Bir əl ilə quraşdırma', 'Anti-vibrasiya', 'Bütün modellərə uyğun'],
  },
  {
    title: 'LED Mətbəx Tərəzisi',
    description: 'Dəqiq ölçüm, 1g - 10kg arası. USB-C şarj, paslanmaz platforma.',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1574269909862-7e3d7bc83024?w=600',
    category: 'Mətbəx',
    categorySlug: 'metbex',
    badge: 'new',
    rating: 4.6,
    reviewCount: 156,
    variants: ['Ağ', 'Qara'],
    features: ['1g dəqiqlik', 'USB-C şarj', '10kg maks', 'Paslanmaz polad'],
  },
  {
    title: 'Solar Baxça Işıqları (10-lu paket)',
    description: 'Günəş enerjisi ilə işləyən, su keçirməyən LED baxça işıqları.',
    price: 22.99,
    oldPrice: 29.99,
    discount: 23,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600',
    category: 'Baxça',
    categorySlug: 'baxca',
    badge: 'viral',
    rating: 4.4,
    reviewCount: 278,
    variants: ['Sarı işıq', 'Ağ işıq', 'RGB'],
    features: ['Solar enerji', 'IP65 su keçirməz', '8 saat iş müddəti', '10 ədəd'],
  },
  {
    title: 'Maşın İçi Organizer',
    description: 'Dəri görünüşlü, çoxcibli maşın oturacaq arası organizer.',
    price: 16.50,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0e6c?w=600',
    category: 'Maşın',
    categorySlug: 'masin',
    badge: null,
    rating: 4.2,
    reviewCount: 94,
    variants: ['Qara', 'Qəhvəyi'],
    features: ['Premium dəri', '6 cib', 'Universal ölçü', 'Asan quraşdırma'],
  },
  {
    title: 'Qatlanan Saxlama Qutuları (3-lü)',
    description: 'Bambuk qapaqlı, rəng kodlu, qatlanan saxlama qutuları dəsti.',
    price: 24.99,
    oldPrice: 34.99,
    discount: 29,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600',
    category: 'Həyət',
    categorySlug: 'heyet',
    badge: 'trend',
    rating: 4.5,
    reviewCount: 203,
    variants: ['Pastel', 'Neon', 'Natural'],
    features: ['Bambuk qapaq', 'Qatlanan dizayn', '3 fərqli ölçü', 'Rəng kodlu'],
  },
  {
    title: 'Elektrikli Üzlü Bibər Dəyirmanı',
    description: 'Bir düymə ilə təzə üyüdülmüş bibər. LED işıqlı, keramik mexanizm.',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600',
    category: 'Mətbəx',
    categorySlug: 'metbex',
    badge: 'viral',
    rating: 4.9,
    reviewCount: 412,
    variants: ['Qara', 'Ağ', 'Rozə qızıl'],
    features: ['Keramik mexanizm', 'LED işıq', 'Batareya ilə', '5 üyütmə səviyyəsi'],
  },
  {
    title: 'Maqnitli Bıçaq Tutucusu',
    description: '40cm meşə ağacı maqnitli bıçaq tutucusu. Divardan asma, həm dekordur.',
    price: 11.99,
    oldPrice: 16.99,
    discount: 29,
    image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600',
    category: 'Mətbəx',
    categorySlug: 'metbex',
    badge: 'trend',
    rating: 4.4,
    reviewCount: 145,
    variants: [],
    features: ['Güclü maqnit', 'Meşə ağacı', '40cm uzunluq', 'Asan montaj'],
  },
  {
    title: 'Yığıla Bilən Bahçe Xortumu (15m)',
    description: 'Sıxılan 15 metr xortum, 7 rejimli başlıq daxil.',
    price: 27.50,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600',
    category: 'Baxça',
    categorySlug: 'baxca',
    badge: 'new',
    rating: 4.6,
    reviewCount: 167,
    variants: ['15m', '30m'],
    features: ['Yığıla bilən', '7 rejimli başlıq', 'Davamlı material', 'Yüngül'],
  },
  {
    title: 'Smart Ev Buxarlandırıcı',
    description: 'Ultrasəs texnologiyası, 7 rəng LED, app ilə idarə.',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600',
    category: 'Həyət',
    categorySlug: 'heyet',
    badge: 'viral',
    rating: 4.7,
    reviewCount: 289,
    variants: ['Ağ', 'Qara'],
    features: ['Ultrasəs', '7 rəng LED', '300ml tank', '6-8 saat iş'],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB bağlantısı uğurlu');

    // Clear existing data
    await Product.deleteMany({});
    console.log('🗑️  Köhnə məhsullar silindi');

    // Insert products
    const created = await Product.insertMany(products);
    console.log(`📦 ${created.length} məhsul əlavə edildi`);

    // Create admin user
    const existingAdmin = await User.findOne({ email: 'admin@biralstore.az' });
    if (!existingAdmin) {
      await User.create({
        firstName: 'Admin',
        lastName: 'BiralStore',
        email: 'admin@biralstore.az',
        phone: '+994501234567',
        password: 'admin123',
        role: 'admin',
      });
      console.log('👤 Admin hesab yaradıldı: admin@biralstore.az / admin123');
    } else {
      console.log('👤 Admin hesab artıq mövcuddur');
    }

    console.log('\n✅ Seed uğurla tamamlandı!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed xətası:', err.message);
    process.exit(1);
  }
}

seed();
