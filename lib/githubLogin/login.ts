export async function getAccessToken(code: string) {
  const acesssTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString();
  const accessTokenUrl = `https://github.com/login/oauth/access_token?${acesssTokenParams}`;
  const accessTokenResponse = await fetch(accessTokenUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  });
  return await accessTokenResponse.json();
}

export async function getUserProfile(accessToken: string) {
  const userProfileResponse = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-cache',
  });
  return await userProfileResponse.json();
}

export async function getUseEmail(accessToken: string) {
  const userEmailResponse = await fetch('https://api.github.com/user/emails', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-cache',
  });
  const emailList = await userEmailResponse.json();
  let email = '';
  for (let mail of emailList) {
    if (mail.primary && mail.verified && mail.visibility === 'public') {
      email = mail.email;
      break;
    }
  }
  return email;
}
