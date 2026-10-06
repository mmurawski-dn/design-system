import type {
	DsFiltersBarFiltersDialogEntry,
	DsFiltersBarFiltersDialogValue,
} from './components/ds-filters-bar-filters-dialog';
import {
	enumFilterOperators,
	filtersBarViews,
	type DsFilterCondition,
	type DsFilterEnumField,
	type DsFilterEnumOperator,
	type DsFilterField,
	type DsFilterFieldCondition,
	type DsFilterOption,
	type DsFilterPin,
	type DsFilterRange,
	type DsFilterScalarField,
	type DsFilterSearchCondition,
	type DsFilterValue,
	type DsFiltersBarView,
} from './ds-filters-bar.types';

const ID_RANDOM_WORDS = 2;
const HEX_RADIX = 16;

const QUERY_LOCKED_VIEWS: ReadonlyArray<DsFiltersBarView> = Object.freeze(['filters', 'builder']);
const NO_LOCKED_VIEWS: ReadonlyArray<DsFiltersBarView> = Object.freeze([]);

export const isFiltersBarView = (value: string | null): value is DsFiltersBarView =>
	filtersBarViews.some((view) => view === value);

/**
 * Blank query text is not an edited query: it hands control back to the conditions.
 */
export const normalizeQuery = (query: string | null): string | null => (query?.trim() ? query : null);

export const lockedViewsFor = (query: string | null): ReadonlyArray<DsFiltersBarView> =>
	query === null ? NO_LOCKED_VIEWS : QUERY_LOCKED_VIEWS;

/**
 * Random, so ids stay unique across reloads and conditions restored from a **Saved filter**.
 * `crypto.randomUUID` is avoided because it needs a secure context.
 */
export const createConditionId = (): string => {
	const words = crypto.getRandomValues(new Uint32Array(ID_RANDOM_WORDS));

	return `condition-${Array.from(words, (word) => word.toString(HEX_RADIX)).join('')}`;
};

export const createSearchCondition = (text: string): DsFilterSearchCondition | null => {
	const trimmed = text.trim();

	if (!trimmed) {
		return null;
	}

	return { kind: 'search', id: createConditionId(), text: trimmed };
};

export const appendCondition = (
	conditions: ReadonlyArray<DsFilterCondition>,
	condition: DsFilterCondition,
): ReadonlyArray<DsFilterCondition> => [...conditions, condition];

export const replaceCondition = (
	conditions: ReadonlyArray<DsFilterCondition>,
	condition: DsFilterCondition,
): ReadonlyArray<DsFilterCondition> =>
	conditions.map((item) => (item.id === condition.id ? condition : item));

export const removeConditionById = (
	conditions: ReadonlyArray<DsFilterCondition>,
	id: string,
): ReadonlyArray<DsFilterCondition> => conditions.filter((item) => item.id !== id);

/**
 * Shared by the summary line and the chips, so every view words a condition the same way
 */
export interface DsFilterConditionDescription {
	/**
	 * Field then subfield labels, for example `['Input', 'Name']`. Empty for search conditions.
	 */
	fieldPath: ReadonlyArray<string>;
	/**
	 * Operator in words, for example `not equals`
	 */
	operator?: string;
	/**
	 * Operator in compact form for chips, for example `≠`
	 */
	operatorSymbol?: string;
	value: string;
}

const RANGE_SEPARATOR = ' – ';

const labelFor = (options: ReadonlyArray<DsFilterOption>, value: string) =>
	options.find((option) => option.value === value)?.label ?? value;

const isRange = (value: DsFilterValue): value is DsFilterRange<number> | DsFilterRange<string> =>
	typeof value === 'object' && 'from' in value;

const formatValue = (value: DsFilterValue, field: DsFilterScalarField | undefined): string => {
	if (isRange(value)) {
		return [value.from ?? '', value.to ?? ''].map(String).join(RANGE_SEPARATOR).trim();
	}

	if (typeof value === 'object') {
		const options = field?.type === 'enum' ? field.options : [];

		return value.map((item) => labelFor(options, item)).join(', ');
	}

	if (typeof value === 'string' && field?.type === 'date') {
		return labelFor(field.presets ?? [], value);
	}

	return String(value);
};

/**
 * Falls back to raw ids when a field, subfield, operator or option is missing from `fields`, so a
 * **Saved filter** that references a removed field still shows instead of breaking the bar.
 */
export const describeCondition = (
	condition: DsFilterCondition,
	fields: ReadonlyArray<DsFilterField>,
): DsFilterConditionDescription => {
	if (condition.kind === 'search') {
		return { fieldPath: [], value: condition.text };
	}

	const field = fields.find((item) => item.id === condition.field);
	const subfield =
		field?.type === 'compound' ? field.subfields.find((item) => item.id === condition.subfield) : undefined;
	const scalarField = field?.type === 'compound' ? subfield : field;
	const operator = scalarField?.operators.find((item) => item.value === condition.operator);

	const fieldPath = [field?.label ?? condition.field];

	if (condition.subfield) {
		fieldPath.push(subfield?.label ?? condition.subfield);
	}

	return {
		fieldPath,
		operator: operator?.label ?? condition.operator,
		operatorSymbol: operator?.symbol ?? operator?.label ?? condition.operator,
		value: formatValue(condition.value, scalarField),
	};
};

/**
 * One part of the collapsed summary line. Each ends with `;`, except a saved filter that other
 * items follow.
 */
export type DsFiltersBarSummaryItem =
	| { kind: 'empty' }
	| { kind: 'advancedQuery' }
	| { kind: 'savedFilter'; name: string }
	| { kind: 'search'; id: string; value: string }
	| {
			kind: 'condition';
			id: string;
			label: string;
			/**
			 * Operator in words. Absent for `=`, which reads as `Field: value`.
			 */
			operator?: string;
			value: string;
	  };

export interface DsFiltersBarSummarySource {
	conditions: ReadonlyArray<DsFilterCondition>;
	query: string | null;
	fields: ReadonlyArray<DsFilterField>;
	activeSavedFilterName?: string;
}

const EQUALS_OPERATOR = '=';
const FIELD_PATH_SEPARATOR = ' › ';

const toSummaryCondition = (
	condition: DsFilterCondition,
	fields: ReadonlyArray<DsFilterField>,
): DsFiltersBarSummaryItem => {
	const { fieldPath, operator, value } = describeCondition(condition, fields);

	if (condition.kind === 'search') {
		return { kind: 'search', id: condition.id, value };
	}

	const shownOperator = condition.operator === EQUALS_OPERATOR ? undefined : operator;

	return {
		kind: 'condition',
		id: condition.id,
		label: fieldPath.join(FIELD_PATH_SEPARATOR),
		...(shownOperator && { operator: shownOperator }),
		value,
	};
};

/**
 * Orders the collapsed summary: the **Active saved filter** first, then the Advanced query label or
 * the conditions. `View: All` only shows when there is neither a saved filter nor anything to list.
 */
export const toSummaryItems = ({
	conditions,
	query,
	fields,
	activeSavedFilterName,
}: DsFiltersBarSummarySource): DsFiltersBarSummaryItem[] => {
	const items: DsFiltersBarSummaryItem[] =
		query === null
			? conditions.map((condition) => toSummaryCondition(condition, fields))
			: [{ kind: 'advancedQuery' }];

	if (activeSavedFilterName) {
		return [{ kind: 'savedFilter', name: activeSavedFilterName }, ...items];
	}

	return items.length ? items : [{ kind: 'empty' }];
};

export const filtersDialogFields = (fields: ReadonlyArray<DsFilterField>): ReadonlyArray<DsFilterEnumField> =>
	fields.filter((field): field is DsFilterEnumField => field.type === 'enum' && field.options.length > 0);

const NO_VALUES: ReadonlyArray<string> = Object.freeze([]);

type DsFilterEnumCondition = DsFilterFieldCondition & {
	operator: DsFilterEnumOperator;
	value: ReadonlyArray<string>;
};

const isEnumOperator = (operator: string): operator is DsFilterEnumOperator =>
	(enumFilterOperators as ReadonlyArray<string>).includes(operator);

const isEnumConditionOf = (
	condition: DsFilterCondition,
	fieldId: string,
): condition is DsFilterEnumCondition =>
	condition.kind === 'field' &&
	condition.field === fieldId &&
	!condition.subfield &&
	isEnumOperator(condition.operator) &&
	Array.isArray(condition.value);

export const toFiltersDialogValue = (
	fields: ReadonlyArray<DsFilterField>,
	conditions: ReadonlyArray<DsFilterCondition>,
	pins: ReadonlyArray<DsFilterPin>,
): DsFiltersBarFiltersDialogValue =>
	filtersDialogFields(fields).flatMap((field): DsFiltersBarFiltersDialogEntry[] => {
		const condition = conditions.find((item) => isEnumConditionOf(item, field.id));
		const pinned = pins.filter((pin) => pin.field === field.id).map((pin) => pin.value);

		if (!condition && !pinned.length) {
			return [];
		}

		return [
			{
				field: field.id,
				operator: condition?.operator ?? field.operators[0]?.value ?? '=',
				selected: condition?.value ?? NO_VALUES,
				pinned,
			},
		];
	});

const toEnumCondition = (entry: DsFiltersBarFiltersDialogEntry, id: string): DsFilterFieldCondition => ({
	kind: 'field',
	id,
	field: entry.field,
	operator: entry.operator,
	value: entry.selected,
});

/**
 * Save replaces every enum condition of a dialog field: the new one keeps the id and position of
 * the first, the rest are dropped. Conditions the dialog can't show are kept as they are.
 * Pins keep their order: unpinned dialog pins are removed in place and new ones are appended.
 */
export const fromFiltersDialogValue = (
	fields: ReadonlyArray<DsFilterField>,
	conditions: ReadonlyArray<DsFilterCondition>,
	pins: ReadonlyArray<DsFilterPin>,
	value: DsFiltersBarFiltersDialogValue,
): { conditions: ReadonlyArray<DsFilterCondition>; pins: ReadonlyArray<DsFilterPin> } => {
	const dialogFields = filtersDialogFields(fields);
	const entries = dialogFields.flatMap((field) => value.find((item) => item.field === field.id) ?? []);
	const committed = new Map(
		entries.filter((entry) => entry.selected.length).map((entry) => [entry.field, entry] as const),
	);
	const placed = new Set<string>();

	const kept = conditions.flatMap((condition): DsFilterCondition[] => {
		const field = dialogFields.find((item) => isEnumConditionOf(condition, item.id));

		if (!field) {
			return [condition];
		}

		const entry = committed.get(field.id);

		if (!entry || placed.has(field.id)) {
			return [];
		}

		placed.add(field.id);

		return [toEnumCondition(entry, condition.id)];
	});

	const added = [...committed.values()]
		.filter((entry) => !placed.has(entry.field))
		.map((entry) => toEnumCondition(entry, createConditionId()));

	const pinnedByField = new Map(entries.map((entry) => [entry.field, entry.pinned] as const));
	const isDialogField = (fieldId: string) => dialogFields.some((field) => field.id === fieldId);
	const isKept = (pin: DsFilterPin) =>
		!isDialogField(pin.field) || !!pinnedByField.get(pin.field)?.includes(pin.value);

	const keptPins = pins.filter(isKept);
	const addedPins = entries.flatMap((entry) =>
		entry.pinned
			.filter((pinned) => !keptPins.some((pin) => pin.field === entry.field && pin.value === pinned))
			.map((pinned) => ({ field: entry.field, value: pinned })),
	);

	return { conditions: [...kept, ...added], pins: [...keptPins, ...addedPins] };
};
