import Link, { LinkProps } from 'next/link';

export function LinkIcon({
  icon,
  href,
  ...props
}: Omit<React.ComponentProps<'a'> & LinkProps, 'ref' | 'children' | 'href'> & {
  href?: LinkProps['href'] | null;
  icon: React.ReactNode;
}) {
  if (!href) {
    return null;
  }

  if (typeof href === 'string' && href.startsWith('http')) {
    return (
      <a
        href={href}
        className={props.className}
        target={props.target ?? '_blank'}
        rel={props.rel ?? 'noreferrer noopener'}
        style={props.style}
      >
        {icon}
      </a>
    );
  }

  return (
    <Link href={href} {...props}>
      {icon}
    </Link>
  );
}
