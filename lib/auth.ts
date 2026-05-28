import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'session';

export async function createSession(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

// Simple demo authentication - replace with real auth in production
export function validateCredentials(email: string, password: string): boolean {
  // For demo purposes, accept any non-empty email and password
  return email.length > 0 && password.length > 0;
}
