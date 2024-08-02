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
