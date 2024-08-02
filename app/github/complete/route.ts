import db from '@/lib/db';
import { getAccessToken, getUserProfile } from '@/lib/githubLogin/login';
import { getSession, updateSession } from '@/lib/session';
import { notFound, redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  if (!code) {
    return notFound();
  }

  const { error, access_token } = await getAccessToken(code);

  if (error) {
    return new Response(null, {
      status: 400,
    });
  }

  const { id, avatar_url, login } = await getUserProfile(access_token);
  const user = await db.user.findUnique({
    where: {
      github_id: id + '',
    },
    select: {
      id: true,
    },
  });
  if (user) {
    await updateSession(user.id);
    return redirect('/profile');
  }

  // 유저가 없을 경우 새 아이디 생성하기 전 닉네임 중복 여부 확인 진행
  const duplicatedUsername = await db.user.findUnique({
    where: {
      username: login,
    },
    select: {
      id: true,
    },
  });
  // 유저 이름 중복일 경우 닉네임 설정 페이지로 이동
  if (duplicatedUsername) {
    console.log('닉네임 중복!!!!');
    const params = {
      id,
      avatar_url,
    };
    const formattedParams = new URLSearchParams(params).toString();
    return redirect(`/create-account/duplicatedUsername?${formattedParams}`);
  }

  const newUser = await db.user.create({
    data: {
      github_id: id + '',
      avatar: avatar_url,
      username: login + '_gh',
    },
    select: {
      id: true,
    },
  });
  await updateSession(newUser.id);
  return redirect('/profile');
}
