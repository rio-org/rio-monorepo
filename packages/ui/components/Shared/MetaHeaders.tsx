import Head from 'next/head';
import { APP_ENV } from '../../config';
import { AppEnv } from '../../lib/typings';

export interface MetaHeadersProps {
  title: string;
  description: string;
  image: string;
}

export function MetaHeaders({ title, description, image }: MetaHeadersProps) {
  const host = global.location?.host;

  const PROTOCOL = {
    [AppEnv.DEVELOPMENT]: 'http://',
    [AppEnv.PREVIEW]: 'https://',
    [AppEnv.PRODUCTION]: 'https://'
  };

  const URL = {
    [AppEnv.DEVELOPMENT]: host ?? 'localhost:3000',
    [AppEnv.PREVIEW]:
      process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL ?? host ?? 'goerli.rio.network',
    [AppEnv.PRODUCTION]:
      process.env.NEXT_PUBLIC_VERCEL_URL ?? host ?? 'goerli.rio.network'
  };

  const domain = URL[APP_ENV];
  const url = `${PROTOCOL[APP_ENV]}${domain}`;

  return (
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#efefef" />
      <meta name="title" content={title} />
      <meta name="description" content={description} />

      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />

      <link rel="icon" href="/favicon.ico" />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-16x16.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link rel="icon" sizes="192x192" href="/android-chrome-192x192.png" />
      <link rel="icon" sizes="512x512" href="/android-chrome-512x512.png" />
      <link rel="manifest" href="/site.webmanifest" />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={title} />
      <meta property="og:image" content={`${url}${image}`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content={domain} />
      <meta property="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:creator" content="@RioRestaking" />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${url}${image}`} />

      <title>{title}</title>
    </Head>
  );
}
