'use client';

import { twJoin } from 'tailwind-merge';
import { useTheme } from 'next-themes';

import { IconMoon } from '../Icons/IconMoon';
import { IconSun } from '../Icons/IconSun';
import { Button } from '../shadcn/button';

import { Theme } from '../../lib/typings';

const ThemeButton = ({ dark }: { dark?: boolean }) => {
  const { setTheme } = useTheme();
  const Icon = dark ? IconMoon : IconSun;
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => setTheme(dark ? Theme.LIGHT : Theme.DARK)}
      className={twJoin(
        'items-center justify-center w-8 h-8 px-0 bg-background border-border',
        dark ? 'hidden dark:flex' : 'flex dark:hidden'
      )}
    >
      <Icon
        height={16}
        width={16}
        className={twJoin(
          'transition-transform duration-100',
          dark
            ? 'hidden dark:block zoom-in-0 dark:zoom-in-100'
            : 'block dark:hidden zoom-in-100 dark:zoom-in-0'
        )}
      />
    </Button>
  );
};

export function ThemeSelector() {
  return (
    <div className="w-8 h-8">
      <ThemeButton dark />
      <ThemeButton />
    </div>
  );
}
