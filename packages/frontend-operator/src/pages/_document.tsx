import { Html, Head, Main, NextScript } from 'next/document';
import { twJoin } from 'tailwind-merge';

export default function Document() {
  return (
    <Html
      lang="en"
      className="bg-[var(--color-app-bg)] lg:bg-white w-screen h-screen lg:p-3"
    >
      <Head />
      <body
        className={twJoin(
          'relative w-full max-w-full',
          'min-h-full max-h-full',
          'overflow-hidden',
          'bg-[var(--color-app-bg)]',
          'rounded-[12px] font-sans'
        )}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
