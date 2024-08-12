'use client';

import { useRouter } from 'next/navigation';
import DeleteAction from './action';

export default function DeleteButton({ productId }: { productId: number }) {
  const router = useRouter();
  async function handleDelete() {
    const res = await DeleteAction(productId);
    if (res) {
      alert('삭제되었습니다.');
      router.replace('/products');
    } else {
      alert('삭제에 실패하였습니다.');
    }
  }
  return (
    <button onClick={handleDelete} className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold">
      Delete Product
    </button>
  );
}
