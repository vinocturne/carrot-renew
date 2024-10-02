import { notFound } from 'next/navigation';
import Image from 'next/image';

import BackButton from './back-button';
import { getIsOwner, getProduct } from '@/lib/product-detail';
import { UserIcon } from '@heroicons/react/24/solid';
import { formatToWon } from '@/lib/utils';
import DeleteButton from '@/app/products/[id]/delete-button/delete-button';
import Link from 'next/link';

export default async function Modal({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getProduct(id);
  if (!product) {
    return notFound();
  }
  const isOwner = await getIsOwner(product.userId);

  return (
    <div className="absolute w-full h-full z-50 flex justify-center items-center bg-opacity-60 bg-black left-0 top-0">
      <BackButton />
      <div className="max-w-screen-lg h-1/2 flex gap-5 justify-center w-full">
        <div className="relative aspect-square bg-neutral-700 text-neutral-200 rounded-md flex justify-center items-center">
          <Image fill src={`${product.photo}/public`} className="object-cover" alt={product.title} />
        </div>
        <div className=" min-w-[230px] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
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
          </div>
          <div className="flex items-end gap-3">
            <span className="font-semibold text-xl leading-6 align-bottom">{formatToWon(product.price)}원</span>
            {isOwner ? null : (
              <Link href={``} className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold">
                채팅하기
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
