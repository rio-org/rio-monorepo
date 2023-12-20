import React from 'react';
import classes from './icons.module.scss';
import cx from 'classnames';

type Props = {
  isExpanded: boolean;
};

const IconExpand = ({ isExpanded }: Props) => {
  return (
    <div className={cx(classes.iconExpand, isExpanded && classes.active)}></div>
  );
};

export default IconExpand;
