import { InfoTooltip } from '@rio-monorepo/ui/components/Shared/InfoTooltip';
import React from 'react';

type Props = {
  label: string;
  infoTooltipContent?: React.ReactNode | React.ReactNode[];
};

const StatLabel = ({ label, infoTooltipContent }: Props) => {
  return (
    <span className="text-foreground rounded-[4px] py-[4px] px-3 border border-border flex items-center gap-1 w-fit">
      <span className="text-[12px]">{label}</span>
      {infoTooltipContent && (
        <InfoTooltip align="center" contentClassName="max-w-[300px]">
          {infoTooltipContent}
        </InfoTooltip>
      )}
    </span>
  );
};

export default StatLabel;
