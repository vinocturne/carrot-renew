'use server';
import twilio from 'twilio';
import { z } from 'zod';
import validator from 'validator';
import { redirect } from 'next/navigation';
import db from '@/lib/db';
import crypto from 'crypto';
import { updateSession } from '@/lib/session';
const phoneSchema = z
  .string()
  .trim()
  .refine(phone => validator.isMobilePhone(phone, 'ko-KR'), 'Wrong phone format!');

const tokenSchema = z.coerce.number().min(100000).max(999999).refine(tokenExists, 'This token does not exist.');

async function tokenExists(token: number) {
  const exists = await db.sMSToken.findUnique({
    where: {
      token: token.toString(),
    },
    select: {
      id: true,
    },
  });
  return Boolean(exists);
}

interface ActionState {
  token: boolean;
  phone?: string;
}

async function getToken() {
  const token = crypto.randomInt(100000, 999999).toString();
  const exists = await db.sMSToken.findUnique({
    where: {
      token,
    },
    select: {
      id: true,
    },
  });
  if (exists) {
    return getToken();
  } else {
    return token;
  }
}
export async function smsLogin(prevState: ActionState, formData: FormData) {
  const phone = formData.get('phone') as string | undefined;
  const token = formData.get('token');
  // phone number validation
  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      return {
        token: false,
        error: result.error.flatten(),
      };
    } else {
      await db.sMSToken.deleteMany({
        where: {
          user: {
            phone: result.data,
          },
        },
      });
      const token = await getToken();
      await db.sMSToken.create({
        data: {
          token,
          user: {
            connectOrCreate: {
              where: {
                phone: result.data,
              },
              create: {
                username: crypto.randomBytes(10).toString('hex'),
                phone: result.data,
              },
            },
          },
        },
      });
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      await client.messages.create({
        body: `Your karrot verification code is: ${token}`,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: process.env.MY_PHONE_NUMBER!,
      });
      return {
        token: true,
        phone,
      };
    }
  } else {
    // verification validation
    const result = await tokenSchema.spa(token);
    if (!result.success) {
      return {
        ...prevState,
        error: result.error.flatten(),
      };
    } else {
      const token = await db.sMSToken.findUnique({
        where: {
          token: result.data.toString(),
        },
        select: {
          id: true,
          userId: true,
          user: true,
        },
      });
      if (prevState.phone !== token?.user.phone) return { ...prevState, error: { formErrors: ['Invalid Token'] } };
      if (token) {
        updateSession(token.userId);
      }
      await db.sMSToken.delete({
        where: {
          id: token!.id,
        },
      });
      redirect('/profile');
    }
  }
}
