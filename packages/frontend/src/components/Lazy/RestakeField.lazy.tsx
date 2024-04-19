import dynamic from 'next/dynamic';
import Skeleton from 'react-loading-skeleton';
import { type RestakeFieldProps } from '@/components/Restake/RestakeField';

export const RestakeFieldSkeleton = () => (
  <div className="relative w-full">
    <div className="flex flex-row justify-between gap-4">
      <label className="mb-1 font-medium">
        <Skeleton width={50} height={14} />
      </label>
      <Skeleton width={50} />
    </div>
    <div className="relative z-10 bg-input text-foreground p-4 rounded-[4px] border-border border">
      <div className="relative z-10 flex flex-row gap-2 md:gap-4 items-center">
        <div className="relative flex flex-col gap-1 w-full flex-1 max-h-[42px] -translate-y-1">
          <Skeleton width={50} height={29} className="max-h-[29px] p-0" />
          <div className="max-h-[12px] [&_span]:inline-block [&_span]:max-h-[12px] -translate-y-1">
            <Skeleton width={20} />
          </div>
        </div>
        <button
          id="withdraw-max"
          disabled
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-[4px] px-4 py-2 font-medium relative top-0 bottom-0 bg-opacity-25"
        >
          <Skeleton width={30} height={14} />
        </button>
      </div>
    </div>
  </div>
);

export const RestakeField = dynamic<RestakeFieldProps>(
  import('@/components/Restake/RestakeField').then(
    (mod: { RestakeField: React.FC<RestakeFieldProps> }) => mod.RestakeField
  ),
  { loading: RestakeFieldSkeleton }
);
