import { fetchProductsServer } from '@/lib/products-db-server';
import HomePageClient from './HomePageClient';

export const revalidate = 3600;

export default async function HomePage() {
  const products = await fetchProductsServer();
  return <HomePageClient initialProducts={products} />;
}
