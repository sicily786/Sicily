'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart';
import { ShoppingCart, Zap, ArrowLeft, Plus, Minus, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface SizeOption { en: string; bn: string; price: number; sale_price: number | null; }

interface Product {
  id: string;
  name_en: string;
  name_bn: string;
  price: number;
  sale_price: number | null;
  images: string[];
  category: string;
  short_desc_en: string;
  short_desc_bn: string;
  desc_en: string;
  desc_bn: string;
  colors: { en: string; bn: string; hex: string }[];
  sizes?: SizeOption[];
  stock?: number;
}

const mockProducts: Record<string, Product> = {
  '1': {
    id: '1',
    name_en: 'Premium Metal Flower Hanger',
    name_bn: 'প্রিমিয়াম মেটাল ফ্লাওয়ার হ্যাঙ্গার',
    price: 1250,
    sale_price: 990,
    images: [
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=700',
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=700',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=700',
    ],
    category: 'hangers',
    short_desc_en: 'Handcrafted anti-rust metal hanger with a modern geometric silhouette.',
    short_desc_bn: 'হাতে তৈরি মরিচা-প্রতিরোধক মেটাল হ্যাঙ্গার, আধুনিক জ্যামিতিক ডিজাইনে।',
    desc_en: 'Enhance your wall aesthetics with this handcrafted premium metal flower hanger. Sourced from high-grade anti-rust painted iron, it is extremely durable and built to withstand Bangladesh\'s humid climate. The modern geometric design blends effortlessly with both minimalist and classic home interiors. Each unit is finished by hand and comes with a complete wall-mounting kit, so setup takes under a minute — no extra tools needed.',
    desc_bn: 'আপনার দেয়ালের সৌন্দর্য বাড়াতে আমাদের হাতে তৈরি এই প্রিমিয়াম মেটাল ফ্লাওয়ার হ্যাঙ্গারটি অনন্য। মরিচা-প্রতিরোধক পেইন্ট করা উচ্চ মানের লোহা দ্বারা তৈরি, যা বাংলাদেশের আর্দ্র আবহাওয়াতেও দীর্ঘস্থায়ী থাকে। আধুনিক জ্যামিতিক নকশা যেকোনো ঘরের সাজে সহজেই মানিয়ে যায়। প্রতিটি ইউনিট হাতে ফিনিশ করা এবং সম্পূর্ণ ওয়াল-মাউন্টিং কিট সহ আসে, তাই বসাতে ১ মিনিটেরও কম সময় লাগে।',
    colors: [
      { en: 'Matte Black', bn: 'ম্যাট ব্ল্যাক', hex: '#111827' },
      { en: 'Classic Gold', bn: 'ক্লাসিক গোল্ড', hex: '#D97706' },
      { en: 'Rose Gold', bn: 'রোজ গোল্ড', hex: '#F43F5E' },
    ],
    sizes: [
      { en: '12"', bn: '১২ ইঞ্চি', price: 1250, sale_price: 990 },
      { en: '18"', bn: '১৮ ইঞ্চি', price: 1550, sale_price: 1250 },
      { en: '24"', bn: '২৪ ইঞ্চি', price: 1850, sale_price: 1500 },
    ],
    stock: 8,
  },
  '2': {
    id: '2',
    name_en: 'Handcrafted Pastel Tulip Bouquet',
    name_bn: 'হ্যান্ডক্রাফটেড পেস্টেল টিউলিপ তোড়া',
    price: 850,
    sale_price: null,
    images: [
      'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&q=80&w=700',
      'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&q=80&w=700',
    ],
    category: 'flowers',
    short_desc_en: 'Handcrafted pastel paper tulips, perfect for tables and gifting.',
    short_desc_bn: 'হাতে তৈরি পেস্টেল কাগজের টিউলিপ, টেবিল সাজানো ও উপহারের জন্য উপযুক্ত।',
    desc_en: 'Beautifully wrapped handcrafted pastel paper tulips. Perfect for dining tables, study desks, or gifting on special occasions. Includes high-durability wrapping sheets that keep their shape and color for years — no watering or sunlight needed, so it stays fresh-looking indefinitely.',
    desc_bn: 'চমৎকারভাবে মোড়ানো হাতে তৈরি পেস্টেল কাগজের টিউলিপের তোড়া। ডাইনিং টেবিল, স্টাডি ডেস্ক বা বিশেষ অনুষ্ঠানে উপহার দেয়ার জন্য আদর্শ। এতে দীর্ঘস্থায়ী র‍্যাপিং শিট রয়েছে যা বছরের পর বছর রঙ ও আকৃতি ধরে রাখে — পানি বা রোদের প্রয়োজন নেই।',
    colors: [
      { en: 'Pastel Pink', bn: 'পেস্টেল পিঙ্ক', hex: '#F472B6' },
      { en: 'Soft Yellow', bn: 'সফট ইয়েলো', hex: '#FDE047' },
      { en: 'Pure White', bn: 'হোয়াইট', hex: '#FFFFFF' },
    ],
    stock: 20,
  },
  '3': {
    id: '3',
    name_en: 'Vintage Wooden Wall Flower Frame',
    name_bn: 'ভিন্টেজ কাঠের ওয়াল ফ্লাওয়ার ফ্রেম',
    price: 1500,
    sale_price: 1200,
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=700',
    ],
    category: 'frames',
    short_desc_en: 'Solid mahogany frame with preserved dry flowers, vintage country look.',
    short_desc_bn: 'সলিড মেহগনি ফ্রেমে শুকানো ফুল, ভিন্টেজ কান্ট্রি লুক।',
    desc_en: 'Hand-polished solid mahogany wood frames carrying preserved dry flowers. Gives an organic vintage country look to any home interior decoration. Each frame is sealed to prevent moisture damage, keeping the dried florals intact for years without fading.',
    desc_bn: 'প্রাকৃতিক শুকানো ফুল ধরে রাখা হাতে পালিশ করা সলিড মেহগনি কাঠের তৈরি ফ্রেম। যেকোনো বাড়ির ঘরের ভেতরে চমৎকার ভিন্টেজ লুক এনে দেয়। প্রতিটি ফ্রেম আর্দ্রতা প্রতিরোধী সিল করা, যা বছরের পর বছর ফুলের রঙ অক্ষুণ্ণ রাখে।',
    colors: [
      { en: 'Rustic Oak', bn: 'রাস্টিক ওক', hex: '#78350F' },
      { en: 'Dark Mahogany', bn: 'ডার্ক মেহগনি', hex: '#451A03' },
    ],
    stock: 4,
  },
};

const ALL_PRODUCTS = Object.values(mockProducts);

export default function ProductViewPage({ params }: { params: { id: string } }) {
  const locale = useLocale();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<{ en: string; bn: string; hex: string } | null>(null);
  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const matched = mockProducts[params.id] || mockProducts['1'];
    setProduct(matched);
    setActiveImage(0);
    if (matched) {
      setSelectedColor(matched.colors[0]);
      if (matched.sizes) setSelectedSize(matched.sizes[0]);
    }
  }, [params.id]);

  if (!product) {
    return (
      <div className="py-20 text-center font-sans text-brand-muted font-bold">
        {locale === 'bn' ? 'লোড হচ্ছে...' : 'Loading product details...'}
      </div>
    );
  }

  const price = selectedSize ? selectedSize.price : product.price;
  const salePrice = selectedSize ? selectedSize.sale_price : product.sale_price;
  const activePrice = salePrice ?? price;
  const nameLabel = locale === 'bn' ? product.name_bn : product.name_en;
  const shortDesc = locale === 'bn' ? product.short_desc_bn : product.short_desc_en;
  const fullDesc = locale === 'bn' ? product.desc_bn : product.desc_en;
  const stockCount = product.stock !== undefined ? product.stock : 5;

  const buildCartItem = () => ({
    id: product.id,
    name_en: product.name_en,
    name_bn: product.name_bn,
    image: product.images[0],
    price,
    sale_price: salePrice,
    variant: {
      color_en: selectedColor?.en,
      color_bn: selectedColor?.bn,
      size_en: selectedSize?.en,
      size_bn: selectedSize?.bn,
    },
  });

  const handleAddToCart = () => addToCart(buildCartItem(), quantity);

  const handleDirectOrder = () => {
    addToCart(buildCartItem(), quantity);
    router.push(`/${locale}/checkout`);
  };

  const relatedProducts = ALL_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="space-y-10 font-sans pb-16 px-4 sm:px-0">
      {/* Back Link */}
      <Link
        href={`/${locale}/shop`}
        className="inline-flex items-center gap-2 text-sm font-bold text-brand-muted hover:text-brand-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>{locale === 'bn' ? 'শপে ফিরে যান' : 'Back to Shop'}</span>
      </Link>

      {/* Grid: Gallery and Main Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="aspect-square rounded-2xl overflow-hidden bg-brand-surface border border-brand-border">
            <img src={product.images[activeImage]} alt={nameLabel} className="h-full w-full object-cover" />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2.5">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 sm:h-20 sm:w-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                    activeImage === i ? 'border-brand-primary' : 'border-brand-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div className="space-y-2">
            {salePrice !== null && (
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white bg-gradient-to-r from-brand-secondary to-brand-secondary-dark uppercase tracking-wider">
                {locale === 'bn' ? 'সেল' : 'Sale'}
              </span>
            )}
            <h1 className="font-serif text-2xl md:text-3xl font-semibold text-brand-text leading-tight">
              {nameLabel}
            </h1>
            <p className="text-xs md:text-sm text-brand-muted leading-relaxed">{shortDesc}</p>
          </div>

          {/* Price + Stock */}
          <div className="flex items-center gap-2 p-4 rounded-xl bg-brand-surface border border-brand-border">
            <span className="text-2xl font-bold text-brand-secondary">৳{activePrice}</span>
            {salePrice !== null && (
              <span className="text-sm text-brand-muted line-through">৳{price}</span>
            )}
            <span className="text-brand-border">|</span>
            {stockCount === 0 ? (
              <span className="text-xs font-bold text-brand-muted">{locale === 'bn' ? 'স্টকে নেই' : 'Out of Stock'}</span>
            ) : stockCount <= 5 ? (
              <span className="flex items-center gap-1 text-xs font-bold text-brand-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
                {locale === 'bn' ? `${stockCount}টি বাকি` : `${stockCount} left`}
              </span>
            ) : (
              <span className="text-xs font-bold text-brand-primary">{locale === 'bn' ? 'স্টকে আছে' : 'In Stock'}</span>
            )}
          </div>

          {/* Options */}
          <div className="space-y-4 pt-4 border-t border-brand-border">
            {selectedColor && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-brand-muted">
                  {locale === 'bn' ? `কালার: ${selectedColor.bn}` : `Color: ${selectedColor.en}`}
                </span>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.en}
                      onClick={() => setSelectedColor(color)}
                      className={`h-8 w-8 rounded-full border-2 transition-all duration-150 flex items-center justify-center ${
                        selectedColor.en === color.en ? 'border-brand-primary scale-110 shadow-sm' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={locale === 'bn' ? color.bn : color.en}
                    >
                      {selectedColor.en === color.en && (
                        <span className={`h-2 w-2 rounded-full ${color.hex === '#FFFFFF' ? 'bg-black' : 'bg-white'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-brand-muted">{locale === 'bn' ? 'সাইজ (দাম পরিবর্তন হবে):' : 'Size (price varies):'}</span>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size.en}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all duration-150 ${
                        selectedSize?.en === size.en
                          ? 'bg-brand-primary border-brand-primary text-white'
                          : 'bg-white border-brand-border text-brand-text hover:border-brand-primary/40'
                      }`}
                    >
                      {locale === 'bn' ? size.bn : size.en}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-3 pt-4 border-t border-brand-border">
            <span className="text-xs font-bold text-brand-muted">{locale === 'bn' ? 'পরিমাণ:' : 'Quantity:'}</span>
            <div className="flex items-center justify-between rounded-lg border border-brand-border bg-white p-2 w-28 flex-shrink-0">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-2 text-brand-muted hover:text-brand-primary transition-colors">
                <Minus className="h-4 w-4" />
              </button>
              <span className="font-bold text-sm text-brand-text">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} className="p-2 text-brand-muted hover:text-brand-primary transition-colors">
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Two CTA buttons: Direct Order + Add to Cart */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleDirectOrder}
              disabled={stockCount === 0}
              className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-lg bg-gradient-to-br from-brand-secondary to-brand-secondary-dark text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-lg hover:shadow-brand-secondary/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap className="h-4 w-4" strokeWidth={1.75} />
              <span>{locale === 'bn' ? 'সরাসরি অর্ডার করুন' : 'Order Now'}</span>
            </button>

            <button
              onClick={handleAddToCart}
              disabled={stockCount === 0}
              className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-lg bg-gradient-to-br from-brand-primary to-brand-primary-alt text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-lg hover:shadow-brand-primary/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="h-4 w-4" strokeWidth={1.75} />
              <span>{locale === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Return policy strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-brand-border">
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-brand-surface border border-brand-border">
          <ShieldCheck className="h-5 w-5 text-brand-primary flex-shrink-0" strokeWidth={1.75} />
          <span className="text-[10px] font-bold text-brand-text leading-tight">
            {locale === 'bn' ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'}
          </span>
        </div>
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-brand-surface border border-brand-border">
          <Truck className="h-5 w-5 text-brand-primary flex-shrink-0" strokeWidth={1.75} />
          <span className="text-[10px] font-bold text-brand-text leading-tight">
            {locale === 'bn' ? 'দ্রুত ডেলিভারি' : 'Super Fast Delivery'}
          </span>
        </div>
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-brand-surface border border-brand-border">
          <RefreshCw className="h-5 w-5 text-brand-primary flex-shrink-0" strokeWidth={1.75} />
          <span className="text-[10px] font-bold text-brand-text leading-tight">
            {locale === 'bn' ? 'সহজ রিটার্ন সুবিধা' : '7 Days Easy Return'}
          </span>
        </div>
      </div>

      {/* Detailed Description */}
      <div className="space-y-2 pt-2">
        <h3 className="font-serif font-semibold text-base text-brand-text">
          {locale === 'bn' ? 'বিস্তারিত বিবরণ' : 'Detailed Description'}
        </h3>
        <p className="text-xs md:text-sm text-brand-muted leading-relaxed">{fullDesc}</p>
      </div>

      {/* Suggested Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-brand-border">
          <h3 className="font-serif font-semibold text-base text-brand-text">
            {locale === 'bn' ? 'সম্পর্কিত প্রোডাক্ট' : 'Suggested Products'}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {relatedProducts.map((rp) => {
              const rpName = locale === 'bn' ? rp.name_bn : rp.name_en;
              return (
                <Link
                  key={rp.id}
                  href={`/${locale}/product/${rp.id}`}
                  className="group bg-white rounded-xl border border-brand-border overflow-hidden hover:border-[#C6A15B]/50 transition-colors"
                >
                  <div className="aspect-square bg-brand-surface overflow-hidden">
                    <img src={rp.images[0]} alt={rpName} className="h-full w-full object-cover [@media(hover:hover)]:group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs font-semibold text-brand-text line-clamp-2 leading-snug">{rpName}</p>
                    <p className="text-sm font-bold text-brand-secondary mt-1">৳{rp.sale_price ?? rp.price}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
