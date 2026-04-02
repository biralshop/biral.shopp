export interface Product {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  categorySlug: string;
  badge?: 'new' | 'viral' | 'trend' | 'campaign' | string;
  discount?: number;
  rating: number;
  reviewCount: number;
  inStock?: boolean;
  features?: string[];
  variants?: string[];
  weight?: number;
  width?: number;
  length?: number;
  height?: number;
}

export const getProductId = (p: Product): string => p._id || p.id || '';

export const products: Product[] = [
  {
    id: '1',
    title: 'Silikon Mətbəx Alətləri Dəsti',
    description: 'İstiyə davamlı, yapışmayan 12 parça mətbəx dəsti. Hər mətbəx üçün əvəzolunmaz.',
    price: 29.99,
    oldPrice: 39.99,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
    category: 'Mətbəx',
    categorySlug: 'metbex',
    badge: 'viral',
    discount: 25,
    rating: 4.8,
    reviewCount: 342,
    inStock: true,
    features: ['İstiyə davamlı 230°C', 'BPA-free silikon', '12 parça', 'Maşında yuyulur'],
    variants: ['Qara', 'Boz', 'Yaşıl'],
  },
  {
    id: '2',
    title: 'Avtomatik Bitki Sulama Sistemi',
    description: 'Tətilə gedərkən bitkiləriniz susuz qalmaz. 30 günə qədər avto-sulama.',
    price: 18.50,
    oldPrice: 24.00,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop',
    category: 'Baxça',
    categorySlug: 'baxca',
    badge: 'trend',
    discount: 23,
    rating: 4.5,
    reviewCount: 189,
    inStock: true,
    features: ['30 gün sulama', 'USB şarj', 'Taymer funksiyası', '12 dropper'],
  },
  {
    id: '3',
    title: 'Multifunksional Həyət Rəfi',
    description: 'Paslanmaz polad, 5 mərtəbəli həyət rəfi. Alətlər, güllər və dekor üçün ideal.',
    price: 54.90,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop',
    category: 'Həyət',
    categorySlug: 'heyet',
    rating: 4.3,
    reviewCount: 87,
    inStock: true,
    features: ['Paslanmaz polad', '5 mərtəbə', 'Yağışa davamlı', 'Asan quraşdırma'],
  },
  {
    id: '4',
    title: 'Universal Maşın Telefon Tutucusu',
    description: '360° dönən, ventilyasiya üzərində bərkidilən premium tutucusu.',
    price: 12.99,
    oldPrice: 19.99,
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=400&fit=crop',
    category: 'Maşın',
    categorySlug: 'masin',
    badge: 'campaign',
    discount: 35,
    rating: 4.7,
    reviewCount: 521,
    inStock: true,
    features: ['360° dönmə', 'Tək əllə istifadə', 'Universal uyğunluq', 'Anti-slip pad'],
  },
  {
    id: '5',
    title: 'LED Mətbəx Tərəzisi',
    description: 'Dəqiq ölçüm, 1g - 10kg arası. USB-C şarj, paslanmaz platforma.',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop',
    category: 'Mətbəx',
    categorySlug: 'metbex',
    badge: 'new',
    rating: 4.6,
    reviewCount: 156,
    inStock: true,
  },
  {
    id: '6',
    title: 'Solar Baxça İşıqları (10-lu paket)',
    description: 'Günəş enerjisi ilə işləyən, su keçirməyən LED baxça işıqları.',
    price: 22.99,
    oldPrice: 29.99,
    image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=400&fit=crop',
    category: 'Baxça',
    categorySlug: 'baxca',
    badge: 'viral',
    discount: 23,
    rating: 4.4,
    reviewCount: 278,
    inStock: true,
  },
  {
    id: '7',
    title: 'Maşın İçi Organizer',
    description: 'Dəri görünüşlü, çoxcibli maşın oturacaq arası organizer.',
    price: 16.50,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=400&fit=crop',
    category: 'Maşın',
    categorySlug: 'masin',
    rating: 4.2,
    reviewCount: 94,
    inStock: true,
  },
  {
    id: '8',
    title: 'Qatlanan Saxlama Qutuları (3-lü)',
    description: 'Bambuk qapaqli, rəng kodlu, qatlanan saxlama qutuları dəsti.',
    price: 24.99,
    oldPrice: 34.99,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    category: 'Həyət',
    categorySlug: 'heyet',
    badge: 'trend',
    discount: 29,
    rating: 4.5,
    reviewCount: 203,
    inStock: true,
  },
  {
    id: '9',
    title: 'Elektrikli Üzlü Bibər Dəyirmanı',
    description: 'Bir düymə ilə təzə bibər. USB şarj, keramik mexanizm.',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop',
    category: 'Mətbəx',
    categorySlug: 'metbex',
    badge: 'viral',
    rating: 4.9,
    reviewCount: 412,
    inStock: true,
  },
  {
    id: '10',
    title: 'Simsiz Maşın Tozsoran',
    description: 'Güclü sorma, kompakt dizayn. Maşın üçün ideal mini tozsoran.',
    price: 34.99,
    oldPrice: 49.99,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=400&fit=crop',
    category: 'Maşın',
    categorySlug: 'masin',
    badge: 'campaign',
    discount: 30,
    rating: 4.6,
    reviewCount: 334,
    inStock: true,
  },
  {
    id: '11',
    title: 'Asma Baxça Sistemi',
    description: 'Balkon və kiçik həyətlər üçün vertikal əkin sistemi. 6 ciblə.',
    price: 27.50,
    image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&h=400&fit=crop',
    category: 'Baxça',
    categorySlug: 'baxca',
    badge: 'new',
    rating: 4.3,
    reviewCount: 67,
    inStock: true,
  },
  {
    id: '12',
    title: 'Maqnitli Bıçaq Tutucusu',
    description: 'Divar montajlı, güclü maqnitlə bıçaqlarınızı əlçatan saxlayın.',
    price: 11.99,
    oldPrice: 16.99,
    image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=400&h=400&fit=crop',
    category: 'Mətbəx',
    categorySlug: 'metbex',
    discount: 29,
    rating: 4.4,
    reviewCount: 145,
    inStock: true,
  },
];

export const categories = [
  { slug: 'metbex', title: 'Mətbəx', icon: '🍳', description: 'Mətbəx alətləri və aksesuarlar', productCount: 128 },
  { slug: 'baxca', title: 'Baxça', icon: '🌱', description: 'Baxça alətləri və dekorasiya', productCount: 95 },
  { slug: 'heyet', title: 'Həyət', icon: '🏡', description: 'Həyət mebeli və saxlama', productCount: 73 },
  { slug: 'masin', title: 'Maşın', icon: '🚗', description: 'Maşın aksesuarları', productCount: 64 },
  { slug: 'viral', title: 'Viral tapıntılar', icon: '🔥', description: 'Ən populyar məhsullar', productCount: 42 },
];

export const getProductsByCategory = (slug: string) =>
  products.filter((p) => p.categorySlug === slug);

export const getProductById = (id: string) =>
  products.find((p) => p.id === id || p._id === id);

export const getFeaturedProducts = () => products.slice(0, 8);

export const getViralProducts = () =>
  products.filter((p) => p.badge === 'viral' || p.badge === 'trend');

export const searchProducts = (query: string) => {
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  );
};
