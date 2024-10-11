'use client';

import FormButton from '@/components/button';
import Input from '@/components/input';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductEditType, productEditSchema } from './schema';
import { getUploadUrl, updateProduct } from './action';
import { unstable_cache as nextCache } from 'next/cache';
import { getProduct } from '@/lib/product-detail';

const getCachedProducts = nextCache(getProduct, ['product-detail'], {
  tags: ['product-detail'],
});

// 이 부분 문제
// client와 default async는 같이 사용 불가능.
// 기본값 받아오기 위해 데이터를 불러와야하는데 이 부분 필요
export async function EditProduct({ params }: { params: { id: string } }) {
  const id = params.id;
  const product = await getCachedProducts(Number(id));
  const [preview, setPreview] = useState('');
  const [photoId, setPhotoId] = useState('');
  const [uploadUrl, setUploadUrl] = useState(product!.photo);
  const [file, setFile] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProductEditType>({
    resolver: zodResolver(productEditSchema),
    defaultValues: {
      title: product?.title,
      price: product?.price,
      description: product?.description,
      photo: product?.photo,
    },
  });

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const maxSized = 4 * 1024 * 1024;
    const {
      target: { files },
    } = event;
    if (!files) {
      return;
    }
    const file = files[0];
    if (file.size > maxSized) {
      alert('파일 사이즈가 초과되었습니다.');
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    setFile(file);
    const { success, result } = await getUploadUrl();
    if (success) {
      const { id, uploadURL } = result;
      setUploadUrl(uploadURL);
      setPhotoId(id);

      setValue('photo', `https://imagedelivery.net/IfkIh2vCOXio26cf7UQYpw/${id}`);
    }
  };
  const onSubmit = handleSubmit(async (data: ProductEditType) => {
    if (!file) {
      return;
    }
    // upload Image to Cloud
    // replace photo in formData
    // call upload product
    const cloudflareForm = new FormData();
    cloudflareForm.append('file', file);
    const response = await fetch(uploadUrl, {
      method: 'post',
      body: cloudflareForm,
    });
    if (response.status !== 200) {
      return;
    }
    const formData = new FormData();
    formData.append('id', id);
    formData.append('title', data.title);
    formData.append('price', data.price + '');
    formData.append('description', data.description);
    formData.append('photo', data.photo ?? uploadUrl);
    return updateProduct(formData);
  });

  const onValid = async () => {
    await onSubmit();
  };
  return (
    <div>
      <form action={onValid} onSubmit={handleSubmit(onValid)} className="p-5 flex flex-col gap-5">
        <label
          htmlFor="photo"
          className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
          style={{ backgroundImage: `url(${preview})` }}
        >
          {preview === '' ? (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-neutral-400 text-sm">사진을 추가해주세요.{errors.photo?.message}</div>
            </>
          ) : null}
        </label>
        <input
          onChange={onImageChange}
          accept=".jpg, .jpeg, .png"
          type="file"
          id="photo"
          name="photo"
          className="hidden"
        />
        <Input required placeholder="제목" type="text" errors={[errors.title?.message ?? '']} {...register('title')} />
        <Input
          required
          placeholder="가격"
          type="number"
          errors={[errors.price?.message ?? '']}
          {...register('price')}
        />
        <Input
          {...register('description')}
          required
          placeholder="자세한 설명"
          type="string"
          errors={[errors.description?.message ?? '']}
        />
        <FormButton text="작성 완료" />
      </form>
    </div>
  );
}
