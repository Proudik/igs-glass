import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/account', '/checkout', '/sign-in', '/register', '/forgot-password'],
      },
    ],
    sitemap: 'https://www.igs-glass.co.uk/sitemap.xml',
    host: 'https://www.igs-glass.co.uk',
  };
}
