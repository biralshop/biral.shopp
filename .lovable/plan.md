

## E-Commerce Website for Practical Everyday Products

A clean, modern Azerbaijani-language e-commerce store for kitchen, garden, car, and viral practical products. Brand primary #2196F3, light background #F5F9FF, white cards, with blue used sparingly for header, CTAs, and active states.

### Pages & Features

**1. Homepage**
- Blue top announcement bar (free shipping, payment options, live support)
- Blue header with white logo, search bar, nav links (Kampaniyalar, Seçilənlər, Sifarişlər, Səbət)
- Category pill navigation (Hamısı, Mətbəx, Baxça, Həyət, Maşın, Viral tapıntılar, etc.)
- Hero section with bold headline, social proof stats, and CTA buttons
- 4 category blocks (Mətbəx, Baxça, Həyət, Maşın) with icons
- Featured product cards grid (4 columns) with badges, ratings, prices, "Səbətə at" CTA
- Trust strip (1-2 gün çatdırılma, Böyük CTA, Təmiz + güvənli)
- Footer with logo, categories, shopping info, brand guidelines

**2. Category Listing Page**
- Category hero banner with title and quick filter tags
- Left sidebar filters: price range slider, product type checkboxes with counts, rating filter
- Sort dropdown (Populyarlıq üzrə)
- Filter tabs (Hamısı, Ən yeni, Ən çox satılan, Endirimda)
- 3-column product card grid

**3. Product Detail Page**
- Large product image with thumbnail gallery
- Stock/shipping badge, product title, rating + review count
- Price with discount, variant selector tabs
- Feature checklist with checkmarks
- Quantity selector + "Səbətə at" blue CTA
- Wishlist + gift option buttons
- Delivery & return info cards
- Tabs: Təsvir, Xüsusiyyətlər, Rəylər, Çatdırılma
- Cross-sell product cards section

**4. Product Card Component System**
- Standard card: image area with badge + category + rating, title, description, price with strikethrough, "Səbətə at" link
- States: Default, Campaign (-25%), Quick add (Tez al), New, Viral, Trend
- Compact/mini cards for cross-sell and mobile
- Hover: card lifts with shadow increase

**5. Search Results Page**
- Query display with result count
- Related keyword chips
- Top result highlight card
- 3-column product grid with compact cards and quick-add buttons

**6. Campaign/Viral Deals Page**
- Full-width blue gradient hero with countdown timer and discount percentage
- CTA buttons: "Kampaniyaya bax" (outlined) + "Kuponu götür" (solid)
- Bundle product cards (3 columns) with "Paketi al" CTA
- Coupon code block

**7. Cart Page**
- 3-step progress indicator (Səbət → Ödəniş → Təsdiq)
- Free shipping progress bar
- Cart items with product image, details, quantity controls, price
- Sticky order summary panel (subtotal, shipping, discount, total)
- "Ödənişə keç" blue CTA + "Alış-verişə davam et" link
- Upsell strip below cart

**8. Checkout Page**
- Step 2 active in stepper
- Delivery form: name, phone, city, postal code, address, notes
- Delivery method selector (Standart/Ekspres)
- Payment method cards (Kartla ödəniş, Qapıda ödəniş, Bank köçürməsi)
- Sticky order summary with trust badges (SSL, Təhlükəsiz ödəniş, Qaytarma)
- "Sifarişi tamamla" CTA

**9. Order Success Page**
- Confirmation hero with checkmark and order number
- Order timeline/status tracker
- Order summary recap
- Next action buttons (track order, continue shopping)

**10. Account/Orders Page**
- Left sidebar navigation (Profil, Sifarişlər, Seçilənlər, Ünvanlar, Ödəniş üsulları, Dəstək)
- Welcome section with stats cards (total orders, active, bonus, wishlist count)
- Recent orders list with status badges (Çatdırılıb, Yoldadır), reorder/review buttons
- Default address and payment method cards

### Shared Components
- Announcement bar, header with search, category nav — consistent across all pages
- Footer with 4-column layout
- Product card component reused everywhere
- Mobile: stacked layout, bottom nav (Ana, Kateqoriya, Səbət, Hesab), sticky cart CTA

### Technical Approach
- All data will be hardcoded mock data (no backend needed initially)
- React Router for page navigation
- React Context for cart state management
- Responsive with Tailwind (desktop-first, mobile breakpoint)
- All UI labels in Azerbaijani

