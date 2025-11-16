export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/',
    '/courses/:path*',
    '/lessons/:path*',
    '/api/me',
    '/api/courses/:path*',
    '/api/lessons/:path*',
    '/api/progress/:path*',
  ],
};
