import { Html, Head, Main, NextScript } from 'next/document';
import { twJoin } from 'tailwind-merge';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body
        className={twJoin(
          'relative w-full max-w-full',
          'min-h-full max-h-full',
          'overflow-hidden',
          'bg-[var(--color-app-bg)]',
          'font-sans'
        )}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
