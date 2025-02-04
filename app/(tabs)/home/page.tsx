import ListProduct from '@/components/list-products';
import ProductList from '@/components/product-list';
import db from '@/lib/db';
import { PlusIcon } from '@heroicons/react/24/solid';
import { Prisma } from '@prisma/client';
import { unstable_cache as nextCache } from 'next/cache';
import Link from 'next/link';

const getChachedProducts = nextCache(getInitialProducts, ['home-products'], {
  tags: ['home'],
});
async function getInitialProducts() {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    // take: 1,
    orderBy: {
      created_at: 'desc',
    },
  });
  return products;
}

export type InitialProducts = Prisma.PromiseReturnType<typeof getInitialProducts>;

export const metadata = {
  title: 'Home',
};

export default async function Products() {
  const initialProduct = await getChachedProducts();
  return (
    <div>
      <ProductList initialProducts={initialProduct} />
      <Link
        href="/add"
        className="bg-orange-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8 text-white transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}
