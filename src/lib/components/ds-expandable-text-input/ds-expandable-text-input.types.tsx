import { DsTextInputProps, IconType } from '@design-system/ui';

export interface DsExpandableTextInputProps
	extends Omit<DsTextInputProps, 'startAdornment' | 'endAdornment' | 'tabIndex'> {
	icon: IconType;
	onClear?: () => void;
	onExpandChange?: (expanded: boolean) => void;
}
