import { cookies } from 'next/headers';
import { SEED_USERS, type User } from './seed-data';

const AUTH_COOKIE_NAME = 'ace-lms-role';
const AUTH_COOKIE_OPTIONS = {
  maxAge: 7 * 24 * 60 * 60, // 7 days
  path: '/',
};

/**
 * Get the current user based on the role stored in a cookie.
 * This is a simple demo auth system - not for production use.
 *
 * @returns The current user (student, admin, or default student)
 */
export async function getCurrentUser(): Promise<User> {
  try {
    const cookieStore = await cookies();
    const roleCookie = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (roleCookie === 'admin') {
      return SEED_USERS.admin;
    }

    if (roleCookie === 'student') {
      return SEED_USERS.student;
    }

    // Default to student if no role is set
    return SEED_USERS.student;
  } catch {
    // Fallback to student if cookie reading fails
    return SEED_USERS.student;
  }
}

/**
 * Set the user role in a cookie.
 * This is a simple demo auth system - not for production use.
 *
 * @param role - The role to set ('student' or 'admin')
 */
export async function setUserRole(role: 'student' | 'admin'): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, role, AUTH_COOKIE_OPTIONS);
}

/**
 * Clear the user role cookie (logout).
 * This is a simple demo auth system - not for production use.
 */
export async function clearUserRole(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

/**
 * Get the current user's role from the cookie.
 * This is a simple demo auth system - not for production use.
 *
 * @returns The current role ('student' or 'admin', defaulting to 'student')
 */
export async function getUserRole(): Promise<'student' | 'admin'> {
  try {
    const cookieStore = await cookies();
    const roleCookie = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (roleCookie === 'admin' || roleCookie === 'student') {
      return roleCookie;
    }

    return 'student';
  } catch {
    return 'student';
  }
}
