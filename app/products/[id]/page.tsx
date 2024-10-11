import { formatToWon } from '@/lib/utils';
import { UserIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import DeleteButton from './delete-button/delete-button';
import { getIsOwner, getProduct, getProductTitle } from '@/lib/product-detail';
import { unstable_cache as nextCache, revalidateTag } from 'next/cache';
import db from '@/lib/db';

const getCachedProducts = nextCache(getProduct, ['product-detail'], {
  tags: ['product-detail'],
});

const getCachedProductTitle = nextCache(getProductTitle, ['product-title'], {
  tags: ['product-title'],
});

export async function generateMetadata({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const product = await getCachedProductTitle(id);

  return {
    title: product?.title,
  };
}

export default async function ProductDetail({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getCachedProducts(id);
  if (!product) {
    return notFound();
  }
  const isOwner = await getIsOwner(product.userId);

  const revalidate = async () => {
    'use server';
    revalidateTag('product-title');
  };
  return (
    <div>
      <div className="relative aspect-square">
        <Image fill src={`${product.photo}/public`} className="object-cover" alt={product.title} />
      </div>
      <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
        <div className="size-10 overflow-hidden rounded-full">
          {product.user.avatar !== null ? (
            <Image src={product.user.avatar} alt={product.user.username} width={40} height={40} />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <h3>{product.user.username}</h3>
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p>{product.description}</p>
      </div>
      <div className="fixed w-full bottom-0 left-0 p-5 pb-10 bg-neutral-800 flex justify-between items-center">
        <span className="font-semibold text-lg">{formatToWon(product.price)}원</span>
        {isOwner ? (
          <>
            <DeleteButton productId={product.id} />{' '}
            <Link
              href={`/products/${id}/edit`}
              className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold"
            >
              수정하기
            </Link>
          </>
        ) : (
          <Link href={``} className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold">
            채팅하기
          </Link>
        )}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const products = await db.product.findMany({
    select: {
      id: true,
    },
  });

  return products.map(product => ({ id: product.id + '' }));
}
