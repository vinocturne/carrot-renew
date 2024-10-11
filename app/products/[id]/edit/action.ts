'use server';

import db from '@/lib/db';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

import { revalidatePath, revalidateTag } from 'next/cache';
import { productEditSchema } from './schema';

export async function updateProduct(formData: FormData) {
  const data = {
    id: formData.get('id'),
    photo: formData.get('photo'),
    title: formData.get('title'),
    price: formData.get('price'),
    description: formData.get('description'),
  };
  // if (data.photo instanceof File) {
  //   const photoData = await data.photo.arrayBuffer();
  //   await fs.appendFile(`./public/${data.photo.name}`, Buffer.from(photoData));
  //   data.photo = `/${data.photo.name}`;
  // }
  const results = productEditSchema.safeParse(data);
  if (!results.success) {
    return results.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const product = await db.product.update({
        where: {
          id: results.data.id,
        },
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

      revalidatePath('/home');
      revalidateTag('product-detail');
      redirect(`/products/${product.id}`);
    }
  }
}

export async function getUploadUrl() {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      },
    }
  );
  const data = await response.json();
  return data;
}