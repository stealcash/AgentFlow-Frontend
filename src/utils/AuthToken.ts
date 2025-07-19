import jwt from 'jsonwebtoken';

const TOKEN_KEY = 'authToken';

export function getAuthToken(throwIfInvalid: boolean) {
  let token = '';
  try {
    token = localStorage.getItem(TOKEN_KEY) || '';
    if (token) {
      const decoded = jwt.decode(token, { complete: true });
      if (!decoded) token = '';
    }
  } catch {
    token = '';
  }

  if (!token && throwIfInvalid) {
    throw new Error('Unauthorized! Please login.');
  }

  return token;
}

export function updateAuthToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}
