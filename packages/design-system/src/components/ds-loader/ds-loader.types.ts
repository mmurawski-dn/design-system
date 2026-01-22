import type React from 'react';

export interface DsLoaderProps {
	/**
	 * Loader variant
	 * @default 'spinner'
	 */
	variant?: 'spinner' | 'pulsing';
	/**
	 * Additional CSS class names
	 */
	className?: string;
	/**
	 * Additional styles to apply to the component
	 */
	style?: React.CSSProperties;
	/**
	 * Ref to the loader container element
	 */
	ref?: React.Ref<HTMLDivElement>;
}
