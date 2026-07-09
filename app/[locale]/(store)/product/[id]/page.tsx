import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { fetchProductDetailServer, fetchProductsServer } from '@/lib/products-db-server';
import { generateProductMeta } from '@/lib/seo';
import ProductViewClient from './ProductViewClient';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { id: string; locale: string } }): Promise<Metadata> {
  const product = await fetchProductDetailServer(params.id);
  if (!product || product.landingPageActive) return {};

  // Reuse the /p/[slug] metadata builder but point canonical/OG at this route.
  const meta = generateProductMeta(product, params.locale);
  const url = `${BASE_URL}/product/${product.id}`;
  return {
    ...meta,
    alternates: { canonical: url },
    openGraph: { ...meta.openGraph, url },
  };
}

export default async function ProductViewPage({ params }: { params: { id: string; locale: string } }) {
  const product = await fetchProductDetailServer(params.id);
  if (!product) notFound();

  // Products with the landing page toggle ON use the full sales page at
  // /p/[slug] instead of this plain browsing view — redirect server-side so
  // there's no client-side fetch-then-redirect flash.
  if (product.landingPageActive) redirect(`/p/${params.id}`);

  const allProducts = await fetchProductsServer();
  const otherProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 3);

  return <ProductViewClient product={product} otherProducts={otherProducts} />;
}
