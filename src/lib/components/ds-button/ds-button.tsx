import classNames from 'classnames';
import React from 'react';
import styles from './ds-button.module.scss';
import { DsButtonProps } from './ds-button.types';

/**
 * Design system Button component
 */
const DsButton: React.FC<DsButtonProps> = ({
  schema = 'primary',
  variant = 'filled',
  size = 'medium',
  disabled = false,
  className,
  contentClassName,
  children,
  ...props
}) => {
  const buttonClass = classNames(
    styles.button,
    styles[`${schema}-${variant}`],
    styles[size],
    { [styles.disabled]: disabled },
    className,
  );

  return (
    <button className={buttonClass} disabled={disabled} {...props}>
      <span className={classNames(styles.content, contentClassName)}>{children}</span>
    </button>
  );
};

export default DsButton;
