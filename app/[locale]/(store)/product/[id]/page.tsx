'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useCart } from '@/lib/cart';
import { Star, ShoppingCart, ArrowLeft, Plus, Minus, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  name_en: string;
  name_bn: string;
  price: number;
  sale_price: number | null;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  desc_en: string;
  desc_bn: string;
  colors: { en: string; bn: string; hex: string }[];
  sizes?: { en: string; bn: string }[];
  stock?: number;
}

const mockProducts: Record<string, Product> = {
  '1': {
    id: '1',
    name_en: 'Premium Metal Flower Hanger',
    name_bn: 'প্রিমিয়াম মেটাল ফ্লাওয়ার হ্যাঙ্গার',
    price: 1250,
    sale_price: 990,
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=600',
    category: 'hangers',
    rating: 4.8,
    reviews: 24,
    desc_en: 'Enhance your wall aesthetics with this handcrafted premium metal flower hanger. Sourced from high-grade anti-rust painted iron. Extremely durable and modern geometric design.',
    desc_bn: 'আপনার দেয়ালের সৌন্দর্য বাড়াতে আমাদের হাতে তৈরি এই প্রিমিয়াম মেটাল ফ্লাওয়ার হ্যাঙ্গারটি অনন্য। মরিচা-প্রতিরোধক পেইন্ট করা উচ্চ মানের লোহা দ্বারা তৈরি। দীর্ঘস্থায়ী এবং আধুনিক জ্যামিতিক নকশা।',
    colors: [
      { en: 'Matte Black', bn: 'ম্যাট ব্ল্যাক', hex: '#111827' },
      { en: 'Classic Gold', bn: 'ক্লাসিক গোল্ড', hex: '#D97706' },
      { en: 'Rose Gold', bn: 'রোজ গোল্ড', hex: '#F43F5E' }
    ],
    sizes: [
      { en: 'Small (12")', bn: 'ছোট (১২ ইঞ্চি)' },
      { en: 'Medium (18")', bn: 'মাঝারি (১৮ ইঞ্চি)' }
    ],
    stock: 8
  },
  '2': {
    id: '2',
    name_en: 'Handcrafted Pastel Tulip Bouquet',
    name_bn: 'হ্যান্ডক্রাফটেড পেস্টেল টিউলিপ তোড়া',
    price: 850,
    sale_price: null,
    image: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&q=80&w=600',
    category: 'flowers',
    rating: 4.9,
    reviews: 18,
    desc_en: 'Beautifully wrapped handcrafted pastel paper tulips. Perfect for dining tables, study desks, or gifting on special occasions. Includes high-durability wrapping sheets.',
    desc_bn: 'চমৎকারভাবে মোড়ানো হাতে তৈরি পেস্টেল কাগজের টিউলিপের তোড়া। ডাইনিং টেবিল, স্টাডি ডেস্ক বা বিশেষ অনুষ্ঠানে উপহার দেয়ার জন্য আদর্শ। এর সাথে রয়েছে দীর্ঘস্থায়ী র‍্যাপিং শিট।',
    colors: [
      { en: 'Pastel Pink', bn: 'পেস্টেল পিঙ্ক', hex: '#F472B6' },
      { en: 'Soft Yellow', bn: 'সফট ইয়েলো', hex: '#FDE047' },
      { en: 'Pure White', bn: 'হোয়াইট', hex: '#FFFFFF' }
    ],
    stock: 20
  },
  '3': {
    id: '3',
    name_en: 'Vintage Wooden Wall Flower Frame',
    name_bn: 'ভিন্টেজ কাঠের ওয়াল ফ্লাওয়ার ফ্রেম',
    price: 1500,
    sale_price: 1200,
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600',
    category: 'frames',
    rating: 4.7,
    reviews: 32,
    desc_en: 'Hand-polished solid mahogany wood frames carrying preserved dry flowers. Gives an organic vintage country look to any home interior decoration.',
    desc_bn: 'প্রাকৃতিক শুকানো ফুল ধরে রাখা হাতে পালিশ করা সলিড মেহগনি কাঠের তৈরি ফ্রেম। যেকোনো বাড়ির ঘরের ভেতরে চমৎকার ভিন্টেজ লুক এনে দেয়।',
    colors: [
      { en: 'Rustic Oak', bn: 'রাস্টিক ওক', hex: '#78350F' },
      { en: 'Dark Mahogany', bn: 'ডার্ক মেহগনি', hex: '#451A03' }
    ],
    stock: 4
  }
};

export default function ProductViewPage({ params }: { params: { id: string } }) {
  const locale = useLocale();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<{ en: string; bn: string; hex: string } | null>(null);
  const [selectedSize, setSelectedSize] = useState<{ en: string; bn: string } | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const stored = localStorage.getItem('sicily_products_list');
    let loadedProducts: Record<string, Product> = {};

    if (stored) {
      try {
        const list: any[] = JSON.parse(stored);
        list.forEach((p) => {
          loadedProducts[p.id] = {
            id: p.id,
            name_en: p.name_en,
            name_bn: p.name_bn,
            price: p.price,
            sale_price: p.sale_price,
            image: p.image,
            category: p.category,
            rating: p.rating || 4.8,
            reviews: p.reviews || 22,
            desc_en: p.desc_en || p.name_en,
            desc_bn: p.desc_bn || p.name_bn,
            colors: p.colors || [{ en: 'Classic Gold', bn: 'ক্লাসিক গোল্ড', hex: '#D97706' }],
            sizes: p.sizes,
            stock: p.stock !== undefined ? p.stock : 10,
          };
        });
      } catch (e) {
        console.error(e);
      }
    }

    const merged = { ...mockProducts, ...loadedProducts };
    const matched = merged[params.id] || merged['1'];

    setProduct(matched);
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

  const activePrice = product.sale_price !== null ? product.sale_price : product.price;
  const nameLabel = locale === 'bn' ? product.name_bn : product.name_en;
  const desc = locale === 'bn' ? product.desc_bn : product.desc_en;
  const stockCount = product.stock !== undefined ? product.stock : 5;

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        name_en: product.name_en,
        name_bn: product.name_bn,
        image: product.image,
        price: product.price,
        sale_price: product.sale_price,
        variant: {
          color_en: selectedColor?.en,
          color_bn: selectedColor?.bn,
          size_en: selectedSize?.en,
          size_bn: selectedSize?.bn,
        },
      },
      quantity
    );
  };

  return (
    <div className="space-y-10 font-sans pb-16">
      {/* Back Link */}
      <Link
        href={`/${locale}/shop`}
        className="inline-flex items-center gap-2 text-sm font-bold text-brand-muted hover:text-brand-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>{locale === 'bn' ? 'শপে ফিরে যান' : 'Back to Shop'}</span>
      </Link>

      {/* Grid: Image and Main Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image */}
        <div className="aspect-square rounded-2xl overflow-hidden bg-brand-surface border border-brand-border">
          <img src={product.image} alt={nameLabel} className="h-full w-full object-cover" />
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div className="space-y-2">
            {product.sale_price !== null && (
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white bg-gradient-to-r from-brand-secondary to-brand-secondary-dark uppercase tracking-wider">
                {locale === 'bn' ? 'সেল' : 'Sale'}
              </span>
            )}
            <h1 className="font-serif text-2xl md:text-3xl font-semibold text-brand-text leading-tight">
              {nameLabel}
            </h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center text-[#C6A15B]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(product.rating) ? 'fill-current' : 'fill-none text-brand-border'}`} strokeWidth={1.5} />
                ))}
              </div>
              <span className="text-xs font-bold text-brand-text">{product.rating}</span>
              <span className="text-xs text-brand-muted">({product.reviews} {locale === 'bn' ? 'রিভিউ' : 'reviews'})</span>
            </div>
          </div>

          {/* Price + Stock */}
          <div className="flex items-center gap-2 p-4 rounded-xl bg-brand-surface border border-brand-border">
            <span className="text-2xl font-bold text-brand-secondary">৳{activePrice}</span>
            {product.sale_price !== null && (
              <span className="text-sm text-brand-muted line-through">৳{product.price}</span>
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

          {/* Description */}
          <div className="space-y-1.5">
            <h3 className="font-serif font-semibold text-sm text-brand-text">
              {locale === 'bn' ? 'পণ্য বিবরণী' : 'Product Description'}
            </h3>
            <p className="text-xs md:text-sm text-brand-muted leading-relaxed">{desc}</p>
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
                <span className="text-xs font-bold text-brand-muted">{locale === 'bn' ? 'সাইজ:' : 'Size:'}</span>
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

          {/* Quantity + Add to Cart */}
          <div className="space-y-3 pt-4 border-t border-brand-border">
            <div className="flex gap-3 items-stretch">
              <div className="flex items-center justify-between rounded-lg border border-brand-border bg-white p-2 w-28 flex-shrink-0">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-2 text-brand-muted hover:text-brand-primary transition-colors">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="font-bold text-sm text-brand-text">{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)} className="p-2 text-brand-muted hover:text-brand-primary transition-colors">
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={stockCount === 0}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg bg-gradient-to-br from-brand-primary to-brand-primary-alt text-white font-bold text-sm shadow-sm hover:shadow-lg hover:shadow-brand-primary/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="h-4 w-4" strokeWidth={1.75} />
                <span>{locale === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart'}</span>
              </button>
            </div>

            <Link
              href={`/${locale}/p/${product.id}`}
              className="block text-center text-xs font-bold text-brand-secondary hover:text-brand-secondary-dark transition-colors"
            >
              {locale === 'bn' ? 'সরাসরি অর্ডার করতে চান? এখানে ক্লিক করুন' : 'Want to order directly? Click here'}
            </Link>
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
    </div>
  );
}
