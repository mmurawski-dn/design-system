import React from 'react';
import { IconPrefix, materialIcons } from './material-icons';

export const iconSizes = ['tiny', 'small', 'medium', 'large', 'extra-large'] as const;
export type IconSize = (typeof iconSizes)[number];
export const iconVariants = ['filled', 'outlined', 'rounded', 'sharp', 'two-tone'] as const;
export type IconVariant = (typeof iconVariants)[number];

export type IconName = {
  [K in keyof typeof materialIcons]: K extends `${IconPrefix}::${infer Name}` ? Name : never;
}[keyof typeof materialIcons];

export interface DsIconProps {
  /**
   * The name of the Material Icon to display
   */
  name: IconName;

  /**
   * The size of the icon
   * @default 'medium'
   */
  size?: IconSize;

  /**
   * The variant of the Material Icon
   * @default 'filled'
   */
  variant?: IconVariant;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Additional styles to apply to the icon
   */
  style?: React.CSSProperties;

  /**
   * Optional click handler
   */
  onClick?: (event: React.MouseEvent<HTMLSpanElement>) => void;
}
