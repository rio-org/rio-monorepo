import { Html, Head, Main, NextScript } from 'next/document';
import { twJoin } from 'tailwind-merge';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body
        className={twJoin(
          'relative w-full max-w-full',
          'min-h-screen',
          'overflow-auto',
          'bg-appBackground',
          'font-sans'
        )}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
