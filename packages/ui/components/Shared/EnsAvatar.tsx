import { AvatarProps } from '@radix-ui/react-avatar';
import { AvatarIcon } from '@radix-ui/react-icons';
import Skeleton from 'react-loading-skeleton';
import { useAccount } from 'wagmi';

import { useMainnetEnsAvatar } from '../../hooks/useMainnetEnsAvatar';
import { useMainnetEnsName } from '../../hooks/useMainnetEnsName';

import { Avatar, AvatarFallback, AvatarImage } from '../shadcn/avatar';
import { cn } from '../../lib/utilities';

export interface EnsAvatarProps extends AvatarProps {
  address?: `0x${string}`;
  ensName?: string;
  avatarSrc?: string;
  imageProps?: React.ComponentPropsWithoutRef<typeof AvatarImage>;
  fallback?: React.ReactNode;
  size?: number;
}

export function EnsAvatar({
  address: _address,
  ensName: _ensName,
  avatarSrc: _avatarSrc,
  fallback,
  className,
  imageProps,
  size = 15,
  ...props
}: EnsAvatarProps) {
  const { address: activeAddress } = useAccount();
  const address = _address ?? activeAddress;

  const { data: fetchedEnsName, isLoading: ensNameLoading } = useMainnetEnsName(
    {
      address,
      chainId: 1,
      query: { enabled: !_ensName && !_avatarSrc }
    }
  );

  const ensName = _ensName ?? fetchedEnsName;

  const { data: fetchedAvatarSrc, isLoading: ensAvatarLoading } =
    useMainnetEnsAvatar({
      name: ensName ?? undefined,
      chainId: 1,
      query: { enabled: !_avatarSrc }
    });

  const avatarSrc = fetchedAvatarSrc ?? _avatarSrc;

  return (
    <Avatar
      className={cn('relative', className)}
      {...props}
      style={{ width: size, height: size }}
    >
      {ensNameLoading || ensAvatarLoading ? (
        <Skeleton
          width={size}
          height={size}
          style={{ width: size, height: size }}
          className="!absolute inset-0"
        />
      ) : avatarSrc ? (
        <AvatarImage
          src={avatarSrc}
          height={size}
          width={size}
          alt={`${ensName ?? address ?? ''} ENS Avatar`}
          {...imageProps}
        />
      ) : (
        <AvatarIcon style={{ width: size, height: size }} />
      )}
      {fallback && <AvatarFallback>{fallback}</AvatarFallback>}
    </Avatar>
  );
}
