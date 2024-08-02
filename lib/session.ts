import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

interface SessionContent {
  id?: number;
}
export function getSession() {
  return getIronSession<SessionContent>(cookies(), {
    cookieName: 'delicious-karrot',
    password: process.env.COOKIE_PASSWORD!,
  });
}

export async function updateSession(id: number) {
  const session = await getSession();
  session.id = id;
  await session.save();
}
