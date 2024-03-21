import React from 'react';
import classes from './icons.module.scss';
import { cn } from '../../lib/utilities';

type Props = {
  isExpanded: boolean;
  className?: string;
};

const IconExpand = ({ isExpanded, className }: Props) => {
  return (
    <div
      className={cn(
        classes.iconExpand,
        isExpanded && classes.active,
        className
      )}
    ></div>
  );
};

export default IconExpand;
