import type { DsSelectOption } from './ds-select.types';

export function getTextValue(item: DsSelectOption): string {
	return item.textValue ?? (typeof item.label === 'string' ? item.label : '');
}
