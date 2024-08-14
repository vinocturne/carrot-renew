'use client';

import FormButton from '@/components/button';
import FormInput from '@/components/input';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { uploadProudct } from './action';
import { useFormState } from 'react-dom';

export default function AddProduct() {
  const [preview, setPreview] = useState('');
  const [state, action] = useFormState(uploadProudct, null);
  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
  };
  return (
    <div>
      <form action={action} className="p-5 flex flex-col gap-5">
        <label
          htmlFor="photo"
          className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
          style={{ backgroundImage: `url(${preview})` }}
        >
          {preview === '' ? (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-neutral-400 text-sm">사진을 추가해주세요.{state?.fieldErrors.photo}</div>
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
        <FormInput name="title" required placeholder="제목" type="text" errors={state?.fieldErrors.title} />
        <FormInput name="price" required placeholder="가격" type="number" errors={state?.fieldErrors.price} />
        <FormInput
          name="description"
          required
          placeholder="자세한 설명"
          type="string"
          errors={state?.fieldErrors.description}
        />
        <FormButton text="작성 완료" />
      </form>
    </div>
  );
}
