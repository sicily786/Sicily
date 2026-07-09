import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { fetchProductDetailServer, fetchProductsServer, fetchSettingsServer } from '@/lib/products-db-server';
import { generateProductMeta, generateProductJsonLd } from '@/lib/seo';
import ProductPageClient from './ProductPageClient';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { slug: string; locale: string } }): Promise<Metadata> {
  const product = await fetchProductDetailServer(params.slug);
  if (!product) return {};
  return generateProductMeta(product, params.locale);
}

export default async function ProductPage({ params }: { params: { slug: string; locale: string } }) {
  const product = await fetchProductDetailServer(params.slug);
  if (!product) notFound();

  // Fetch related products & shipping rates on the server (in parallel with
  // rendering) so the client never has to make its own round trips for them.
  const [allProducts, deliverySettings] = await Promise.all([
    fetchProductsServer(),
    fetchSettingsServer(['delivery_inside', 'delivery_outside']),
  ]);
  const otherProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 3);
  const deliveryInside = deliverySettings.delivery_inside ? Number(deliverySettings.delivery_inside) : 80;
  const deliveryOutside = deliverySettings.delivery_outside ? Number(deliverySettings.delivery_outside) : 150;

  const jsonLd = generateProductJsonLd(product, params.locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductPageClient
        product={product}
        otherProducts={otherProducts}
        deliveryInside={deliveryInside}
        deliveryOutside={deliveryOutside}
      />
    </>
  );
}
