import { type RadioGroupItemProps, type RadioGroupRootProps } from '@ark-ui/react/radio-group';

/**
 * Props for the DsRadioGroup Root component
 */
export interface DsRadioGroupRootProps extends Pick<
	RadioGroupRootProps,
	'id' | 'value' | 'defaultValue' | 'disabled' | 'name' | 'className' | 'style' | 'orientation' | 'children'
> {
	/**
	 * Event handler called when the selected value changes
	 */
	onValueChange?: (value: string | null) => void;
}

/**
 * Props for the DsRadioGroup Item component
 */
export interface DsRadioGroupItemProps extends Pick<
	RadioGroupItemProps,
	'value' | 'disabled' | 'className' | 'style' | 'children'
> {
	/**
	 * Optional label text for the radio item
	 */
	label?: string;
	/**
	 * Optional additional info text displayed below the label
	 */
	labelInfo?: string;
}
