'use server';
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from '@/lib/constants';
import { z } from 'zod';

const checkUsername = (username: string) => {
  return !username.includes('potato');
};

const checkPasswords = ({ password, confirm_password }: { password: string; confirm_password: string }) => {
  return password === confirm_password;
};

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: 'username must be a string!',
        required_error: 'where is my username?',
      })
      .toLowerCase()
      .trim()
      .transform(username => `🔥 ${username}`)
      .refine(username => checkUsername(username), 'no potatos allowed'),
    email: z.string().email().trim().toLowerCase(),
    password: z.string().min(PASSWORD_MIN_LENGTH).regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirm_password: z.string().min(10),
  })
  .refine(({ password, confirm_password }) => checkPasswords({ password, confirm_password }), {
    message: 'Both passwords should be same',
    path: ['confirm_password'],
  });

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirm_password: formData.get('confirm_password'),
  };
  const result = formSchema.safeParse(data);
  console.log(result);
  if (!result.success) {
    return result.error.flatten();
  } else {
    console.log(result.data);
  }
}
