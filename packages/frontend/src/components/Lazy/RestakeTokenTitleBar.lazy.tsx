import Skeleton from 'react-loading-skeleton';
import { type RestakeTokenTitleBarProps } from '@/components/Restake/RestakeTokenTitleBar';
import dynamic from 'next/dynamic';

export const RestakeTokenTitleBar = dynamic<RestakeTokenTitleBarProps>(
  import('@/components/Restake/RestakeTokenTitleBar').then(
    (mod: { RestakeTokenTitleBar: React.FC<RestakeTokenTitleBarProps> }) =>
      mod.RestakeTokenTitleBar
  ),
  { loading: RestakeTokenTitleBarSkeleton }
);

export function RestakeTokenTitleBarSkeleton() {
  return (
    <div className="flex items-center justify-between pb-4">
      <h2 className="flex gap-2 items-center flex-start text-foreground text-base font-medium">
        <span className="leading-snug">
          <Skeleton height={16} width={111} />
        </span>
        <span className="font-mono leading-none opacity-20">
          <Skeleton height={16} width={55} />
        </span>
      </h2>

      <div className="border border-border rounded-[4px] bg-background hover:bg-accent hover:text-accent-foreground flex items-center justify-center aspect-square w-7 h-7 p-0" />
    </div>
  );
}
