'use server';

import { z } from 'zod';
import fs from 'fs/promises';
import db from '@/lib/db';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

const productSchema = z.object({
  photo: z.string({
    required_error: '사진은 필수입니다.',
  }),
  title: z.string({
    required_error: '제목은 필수입니다.',
  }),
  description: z.string({
    required_error: '설명은 필수입니다.',
  }),
  price: z.coerce.number({
    required_error: '가격은 필수입니다.',
  }),
});

export async function uploadProudct(_: any, formData: FormData) {
  const data = {
    photo: formData.get('photo'),
    title: formData.get('title'),
    price: formData.get('price'),
    description: formData.get('description'),
  };
  if (data.photo instanceof File) {
    const photoData = await data.photo.arrayBuffer();
    await fs.appendFile(`./public/${data.photo.name}`, Buffer.from(photoData));
    data.photo = `/${data.photo.name}`;
  }
  const results = productSchema.safeParse(data);
  if (!results.success) {
    return results.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const product = await db.product.create({
        data: {
          title: results.data.title,
          description: results.data.description,
          price: results.data.price,
          photo: results.data.photo,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
        select: {
          id: true,
        },
      });
      redirect(`/products/${product.id}`);
    }
  }
  //   console.log(results);
}
