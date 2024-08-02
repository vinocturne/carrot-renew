'use server';

import db from '@/lib/db';
import { updateSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: 'username must be a string!',
        required_error: 'where is my username?',
      })
      .toLowerCase()
      .trim(),
  })
  .superRefine(async ({ username }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: 'custom',
        message: 'This username is already taken',
        path: ['username'],
        fatal: true,
      });
      return z.NEVER;
    }
  });

export async function createNewUsernameAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get('username'),
    github_id: formData.get('github_id'),
    avatar: formData.get('avatar'),
  };
  const result = await formSchema.spa(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const user = await db.user.create({
      data: {
        username: result.data.username,
        github_id: data.github_id as string,
        avatar: data.avatar as string,
      },
      select: {
        id: true,
      },
    });
    await updateSession(user.id);
    redirect('/profile');
  }
}
