'use client';

import { useLocale } from 'next-intl';
import { ArrowRight, Star, Heart, Crown, Flower2, Sprout, Frame, Timer, Sparkles, ShoppingCart, Percent, Gift } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

/* ── BANNER SLIDES ─────────────────────────────────── */
const SLIDES = [
  {
    tag_en: 'SUMMER COLLECTION', tag_bn: 'সামার কালেকশন',
    title_en: 'Up to 50% Off', title_bn: 'সর্বোচ্চ ৫০% ছাড়',
    sub_en: 'Curated deals on our finest premium pieces', sub_bn: 'সবচেয়ে জনপ্রিয় প্রিমিয়াম পণ্যের ওপর সেরা অফার',
    cta_en: 'Shop the Edit', cta_bn: 'এখনই কিনুন',
    image: '/Banner1.png',
    bg: 'from-[#0B5D5C] via-[#0A4443] to-[#14201D]',
  },
  {
    tag_en: 'NEW ARRIVALS', tag_bn: 'নতুন কালেকশন',
    title_en: 'Floral Stands', title_bn: 'ফ্লাওয়ার স্ট্যান্ড',
    sub_en: 'Preserved dry flowers & handcrafted mahogany frames', sub_bn: 'হাতে তৈরি মেহগনি ফ্রেম ও ফুলের শোপিস',
    cta_en: 'Explore Now', cta_bn: 'সব দেখুন',
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&q=85&w=700',
    bg: 'from-[#5C1730] via-[#421021] to-[#14201D]',
  },
  {
    tag_en: 'EXCLUSIVE OFFER', tag_bn: 'বিশেষ অফার',
    title_en: 'Premium Planters', title_bn: 'প্রিমিয়াম প্ল্যান্টার',
    sub_en: 'Ceramic & metal pots crafted for indoor living', sub_bn: 'ইনডোর গাছের জন্য মেটাল ও সিরামিক পট',
    cta_en: 'View Deals', cta_bn: 'অফার দেখুন',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=85&w=700',
    bg: 'from-[#14201D] via-[#1B2925] to-[#0B5D5C]',
  },
];

/* ── SHOP BY CATEGORIES DATA ── */
const CAT_ICONS = [
  { en: 'All Categories', bn: 'সব ক্যাটাগরি', icon: Crown, bg: 'bg-brand-surface text-[#C6A15B]' },
  { en: 'Flower Tub',  bn: 'ফ্লাওয়ার টাব',  icon: Flower2, bg: 'bg-brand-surface text-brand-secondary' },
  { en: 'Tree Plant',  bn: 'ট্রি প্ল্যান্ট', icon: Sprout, bg: 'bg-brand-surface text-brand-primary' },
  { en: 'Wall Stand',  bn: 'ওয়াল স্ট্যান্ড', icon: Frame, bg: 'bg-brand-surface text-[#8A6A2E]' },
];

/* ── PRODUCTS ── */
const PRODUCTS = [
  { id:'1', name_en:'Premium Metal Flower Hanger', name_bn:'প্রিমিয়াম মেটাল ফ্লাওয়ার হ্যাঙ্গার', price:1250, sale_price:990,  image:'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=500', rating:4.8, reviews:24, discount:'-21%' },
  { id:'2', name_en:'Pastel Tulip Bouquet',        name_bn:'পেস্টেল টিউলিপ তোড়া',               price:850,  sale_price:null,  image:'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&q=80&w=500', rating:4.9, reviews:18, discount:null },
  { id:'3', name_en:'Vintage Wooden Wall Frame',   name_bn:'ভিন্টেজ কাঠের ওয়াল ফ্রেম',          price:1500, sale_price:1200,  image:'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=500', rating:4.7, reviews:32, discount:'-20%' },
  { id:'4', name_en:'Rose Gold Candle Set',        name_bn:'রোজ গোল্ড ক্যান্ডেল সেট',           price:680,  sale_price:540,   image:'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&q=80&w=500', rating:5.0, reviews:9,  discount:'-21%' },
  { id:'5', name_en:'Ceramic Flower Vase',         name_bn:'সিরামিক ফ্লাওয়ার ভেজ',              price:920,  sale_price:750,   image:'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&q=80&w=500', rating:4.6, reviews:14, discount:'-18%' },
  { id:'6', name_en:'Macrame Wall Hanging',        name_bn:'ম্যাক্রামে ওয়াল হ্যাঙ্গিং',         price:1100, sale_price:null,  image:'https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?auto=format&fit=crop&q=80&w=500', rating:4.8, reviews:21, discount:null },
];

/* ── HERO SLIDER ────────────────────────────────────── */
function HeroSlider({ locale }: { locale: string }) {
  const [active, setActive] = useState(0);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const reset = (i: number) => {
    setActive(i);
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => setActive(p => (p + 1) % SLIDES.length), 5000);
  };

  useEffect(() => {
    reset(0);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-none sm:rounded-2xl h-[240px] sm:h-[320px] md:h-[360px] shadow-sm">
      {/* Background gradients */}
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 bg-gradient-to-br ${slide.bg} transition-opacity duration-800 flex items-center justify-between px-6 sm:px-12 md:px-16`}
          style={{ opacity: active === i ? 1 : 0 }}
        >
          {/* Fine hairline border accent */}
          <div className="absolute inset-3 border border-white/10 rounded-xl pointer-events-none hidden sm:block" />

          {/* Left Text details */}
          <div className="space-y-3 sm:space-y-4 z-10 max-w-[62%] text-left text-white" style={{ animation: active === i ? 'fadeSlideUp 0.5s ease-out both' : '' }}>
            <span className="inline-flex items-center gap-2 text-[9px] sm:text-[11px] font-semibold tracking-[0.25em] text-[#C6A15B] uppercase">
              <span className="h-px w-4 bg-[#C6A15B]" />
              {locale === 'bn' ? slide.tag_bn : slide.tag_en}
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1]">
              {locale === 'bn' ? slide.title_bn : slide.title_en}
            </h2>
            <p className="text-[11px] sm:text-xs text-white/60 font-medium leading-relaxed max-w-sm hidden sm:block">
              {locale === 'bn' ? slide.sub_bn : slide.sub_en}
            </p>
            <div className="pt-1.5">
              <Link
                href={`/${locale}/shop`}
                className="inline-flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 rounded-full border border-[#C6A15B] text-[#C6A15B] font-semibold text-[10px] sm:text-xs uppercase tracking-widest hover:bg-[#C6A15B] hover:text-[#14201D] transition-all duration-300"
              >
                <span>{locale === 'bn' ? slide.cta_bn : slide.cta_en}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Right product visual */}
          <div className="relative h-full w-[38%] flex items-center justify-center select-none">
            <div className="relative w-32 h-32 sm:w-44 sm:h-44 md:w-52 md:h-52">
              <div className="absolute inset-0 rounded-full bg-[#C6A15B]/10 blur-2xl" />
              <img
                src={slide.image}
                alt=""
                className="h-full w-full object-contain relative z-10 drop-shadow-2xl transition-transform duration-[6000ms]"
                style={{ transform: active === i ? 'scale(1.02)' : 'scale(0.96)' }}
              />
            </div>
          </div>
        </div>
      ))}

      {/* Pagination Dot Indicators (Bottom center) */}
      <div className="absolute bottom-4 left-6 sm:left-12 flex gap-1.5 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => reset(i)}
            className="h-1 rounded-full transition-all duration-300"
            style={{
              width: active === i ? 22 : 6,
              background: active === i ? '#C6A15B' : 'rgba(255,255,255,0.35)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── PRODUCT CARD ───────────────────────────────────── */
function ProductCard({ p, locale }: { p: typeof PRODUCTS[0]; locale: string }) {
  const [liked, setLiked] = useState(false);
  const name = locale === 'bn' ? p.name_bn : p.name_en;
  const price = p.sale_price ?? p.price;

  return (
    <div className="group bg-white rounded-xl border border-brand-border hover:border-[#C6A15B]/40 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
      {/* Product Image Wrapper */}
      <div className="relative aspect-square bg-brand-surface overflow-hidden">
        <Link href={`/${locale}/p/${p.id}`} className="block h-full w-full">
          <img src={p.image} alt={name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </Link>

        {/* Discount Badge (Top-left corner) */}
        {p.discount && (
          <span className="absolute top-2 left-2 bg-[#14201D] text-[#C6A15B] text-[9px] font-bold px-2 py-0.5 rounded-md tracking-wide">
            {p.discount}
          </span>
        )}

        {/* Wishlist Heart Icon (Top-right corner) */}
        <button
          onClick={() => setLiked(l => !l)}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 shadow-sm hover:scale-110 transition-transform"
        >
          <Heart className={`h-3.5 w-3.5 ${liked ? 'fill-brand-secondary text-brand-secondary' : 'text-brand-muted'}`} strokeWidth={1.75} />
        </button>
      </div>

      {/* Product Details Section */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-1.5">
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-brand-text leading-snug line-clamp-2 hover:text-brand-primary transition-colors">
            <Link href={`/${locale}/p/${p.id}`}>{name}</Link>
          </h3>

          {/* Star rating info */}
          <div className="flex items-center gap-0.5 text-[#C6A15B] mt-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-2.5 w-2.5 fill-current" />
            ))}
            <span className="text-[9px] text-brand-muted font-semibold ml-1">({p.reviews})</span>
          </div>
        </div>

        {/* Price & Cart button row */}
        <div className="flex items-center justify-between gap-1 pt-1">
          <div>
            <span className="text-xs sm:text-sm font-bold text-brand-text block">৳{price}</span>
            {p.sale_price && (
              <span className="text-[10px] text-brand-muted line-through block mt-0.5">৳{p.price}</span>
            )}
          </div>

          {/* Circular Shopping Cart Button */}
          <Link
            href={`/${locale}/p/${p.id}`}
            className="h-8.5 w-8.5 rounded-full bg-brand-primary text-white hover:bg-brand-primary-alt shadow-sm flex items-center justify-center hover:-translate-y-0.5 transition-transform flex-shrink-0"
          >
            <ShoppingCart className="h-4 w-4" strokeWidth={1.75} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── MAIN PAGE ──────────────────────────────────────── */
export default function HomePage() {
  const locale = useLocale();

  return (
    <div className="bg-white min-h-screen pb-16">

      {/* ══════════════════════════════════════════
          1. HERO AREA: Banner slider
      ══════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
        <HeroSlider locale={locale} />
      </div>

      {/* ══════════════════════════════════════════
          2. SHOP BY CATEGORY — Icon row with scroll
      ══════════════════════════════════════════ */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-base sm:text-lg font-semibold text-brand-text tracking-tight">
            {locale === 'bn' ? 'ক্যাটাগরি অনুযায়ী শপ করুন' : 'Shop by Category'}
          </h2>
          <Link href={`/${locale}/shop`} className="text-[11px] font-semibold text-brand-primary hover:text-[#C6A15B] transition-colors uppercase tracking-wide">
            {locale === 'bn' ? 'সব দেখুন' : 'View all'}
          </Link>
        </div>

        {/* Categories Row scrollable on mobile */}
        <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-4">
          {CAT_ICONS.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <Link key={i} href={`/${locale}/shop`}
                className="flex-shrink-0 flex flex-col items-center gap-2 p-3.5 bg-white rounded-xl border border-brand-border hover:border-[#C6A15B]/40 hover:shadow-sm transition-all duration-200 w-[100px] sm:w-auto"
              >
                {/* Rounded Icon tint background */}
                <div className={`h-11 w-11 rounded-full flex items-center justify-center ${cat.bg} border border-brand-border`}>
                  <Icon className="h-5 w-5" strokeWidth={1.6} />
                </div>
                <span className="text-[10px] font-semibold text-brand-muted text-center leading-tight">
                  {locale === 'bn' ? cat.bn : cat.en}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          4. FLASH DEALS WITH COUNTDOWN TIMER
      ══════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <h2 className="font-serif text-base sm:text-lg font-semibold text-brand-text tracking-tight flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#C6A15B]" strokeWidth={1.75} />
              <span>{locale === 'bn' ? 'ফ্ল্যাশ ডিলস' : 'Flash Deals'}</span>
            </h2>

            {/* Countdown timer widget */}
            <div className="flex items-center gap-1.5 bg-[#14201D] px-2.5 py-1 rounded-full text-[10px] font-bold text-[#C6A15B] tracking-wide">
              <Timer className="h-3 w-3" />
              <span>02 : 45 : 30</span>
            </div>
          </div>

          <Link href={`/${locale}/shop`} className="text-[11px] font-semibold text-brand-primary hover:text-[#C6A15B] transition-colors uppercase tracking-wide">
            {locale === 'bn' ? 'সব দেখুন' : 'View all'}
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {PRODUCTS.slice(0, 3).map((p, i) => <ProductCard key={i} p={p} locale={locale} />)}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          5. PROMO BANNERS DOUBLE ROW
      ══════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Left card Promo */}
        <div className="relative rounded-xl p-6 overflow-hidden bg-[#0B5D5C] text-white flex flex-col justify-between min-h-[120px] border border-white/10">
          <div className="absolute right-4 bottom-2 opacity-10">
            <Percent className="h-20 w-20" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-serif text-lg font-semibold tracking-tight">{locale === 'bn' ? 'অতিরিক্ত ১০% ছাড়!' : 'Get Extra 10% Off'}</h3>
            <p className="text-[10px] text-white/60 font-medium">{locale === 'bn' ? 'আপনার প্রথম অর্ডারে পাবেন' : 'Applicable on your first order'}</p>
          </div>
          <div className="pt-3">
            <span className="inline-block border border-[#C6A15B]/50 text-[#C6A15B] px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider">
              {locale === 'bn' ? 'কোড: WELCOME10' : 'Use Code: WELCOME10'}
            </span>
          </div>
        </div>

        {/* Right card Promo */}
        <div className="relative rounded-xl p-6 overflow-hidden bg-brand-surface text-brand-text flex flex-col justify-between min-h-[120px] border border-brand-border">
          <div className="absolute right-4 bottom-2 opacity-[0.08]">
            <Gift className="h-20 w-20 text-[#C6A15B]" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-serif text-lg font-semibold tracking-tight">{locale === 'bn' ? 'ফ্রি ডেলিভারি পাবেন' : 'Complimentary Shipping'}</h3>
            <p className="text-[10px] text-brand-muted font-medium">{locale === 'bn' ? '৳১৯৯৯+ মূল্যের সকল অর্ডারে' : 'On all orders above ৳1999'}</p>
          </div>
          <div className="pt-3">
            <Link href={`/${locale}/shop`} className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-brand-primary hover:text-[#C6A15B] transition-colors">
              <span>{locale === 'bn' ? 'এখনই কিনুন' : 'Shop Now'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          6. FEATURED PRODUCTS
      ══════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-base sm:text-lg font-semibold text-brand-text tracking-tight">
            {locale === 'bn' ? 'ফিচার্ড প্রোডাক্টস' : 'Featured Products'}
          </h2>
          <Link href={`/${locale}/shop`} className="text-[11px] font-semibold text-brand-primary hover:text-[#C6A15B] transition-colors uppercase tracking-wide">
            {locale === 'bn' ? 'সব দেখুন' : 'View all'}
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {PRODUCTS.slice(3, 6).map((p, i) => <ProductCard key={i} p={p} locale={locale} />)}
        </div>
      </section>

    </div>
  );
}
