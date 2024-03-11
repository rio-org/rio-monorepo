'use client';

import { useTheme } from 'next-themes';

import { IconMoon } from '../Icons/IconMoon';
import { IconSun } from '../Icons/IconSun';
import { Button } from '../shadcn/button';

import { Theme } from '../../lib/typings';

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const nextTheme = theme === Theme.DARK ? Theme.LIGHT : Theme.DARK;
  return (
    <Button
      variant="outline"
      size="sm"
      className="w-8 h-8 px-0 bg-background border-border"
      onClick={() => setTheme(nextTheme)}
    >
      <IconMoon
        height={16}
        width={16}
        className="dark:zoom-in-100 zoom-in-0 hidden transition-transform duration-100 dark:block"
      />
      <IconSun
        height={16}
        width={16}
        className="zoom-in-100 dark:zoom-in-0 block transition-transform dark:hidden"
      />
    </Button>
  );
}
