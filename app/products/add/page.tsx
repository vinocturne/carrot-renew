'use client';

import FormButton from '@/components/button';
import Input from '@/components/input';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { getUploadUrl, uploadProduct } from './action';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductType, productSchema } from './schema';

export default function AddProduct() {
  const [preview, setPreview] = useState('');
  const [photoId, setPhotoId] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProductType>({
    resolver: zodResolver(productSchema),
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
  const onSubmit = handleSubmit(async (data: ProductType) => {
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
    formData.append('title', data.title);
    formData.append('price', data.price + '');
    formData.append('description', data.description);
    formData.append('photo', data.photo);
    return uploadProduct(formData);
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
