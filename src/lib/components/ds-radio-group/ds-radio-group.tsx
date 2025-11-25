import React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import classNames from 'classnames';
import styles from './ds-radio-group.module.scss';
import {
	DsRadioGroupItemProps,
	DsRadioGroupLegacyProps,
	DsRadioGroupRootProps,
} from './ds-radio-group.types';

/**
 * Root component - provides radio group context
 */
const Root: React.FC<DsRadioGroupRootProps> = ({
	value,
	defaultValue,
	onValueChange,
	className,
	children,
	...props
}) => (
	<RadioGroupPrimitive.Root
		className={classNames(styles.radioGroupRoot, className)}
		value={value}
		defaultValue={defaultValue}
		onValueChange={onValueChange}
		{...props}
	>
		{children}
	</RadioGroupPrimitive.Root>
);

const ItemPrimitive: React.FC<DsRadioGroupItemProps> = ({ className, ...props }) => {
	return (
		<RadioGroupPrimitive.Item className={classNames(styles.radioItem, className)} {...props}>
			<div className={styles.radioItemWrapper}>
				<RadioGroupPrimitive.Indicator className={styles.radioIndicator} />
			</div>
		</RadioGroupPrimitive.Item>
	);
};

/**
 * Item component - renders a single radio button with optional label
 */
const Item: React.FC<DsRadioGroupItemProps> = ({
	value,
	label,
	labelInfo,
	className,
	id,
	style,
	...props
}) => {
	const itemId = id || value;

	if (label) {
		return (
			<div className={classNames(styles.radioItemContainer, className)} style={style}>
				<ItemPrimitive id={itemId} value={value} {...props} />
				<label className={styles.radioLabel} htmlFor={itemId}>
					{label}
					{labelInfo && <div className={styles.labelInfo}>{labelInfo}</div>}
				</label>
			</div>
		);
	}

	return <ItemPrimitive id={itemId} style={style} className={className} value={value} {...props} />;
};

/**
 * DEPRECATED: Legacy DsRadioGroup component with options array
 * Use compound component pattern instead: DsRadioGroup.Root + DsRadioGroup.Item
 * @deprecated
 */
export const DsRadioGroupLegacy: React.FC<DsRadioGroupLegacyProps> = ({
	options,
	value,
	defaultValue,
	onValueChange,
	className,
	...props
}) => (
	<RadioGroupPrimitive.Root
		className={classNames(styles.radioGroupRoot, className)}
		value={value}
		defaultValue={defaultValue}
		onValueChange={onValueChange}
		{...props}
	>
		{options.map((option) => (
			<div key={option.value} className={styles.radioItemContainer}>
				<RadioGroupPrimitive.Item
					className={styles.radioItem}
					value={option.value}
					disabled={option.disabled}
					id={option.value}
				>
					<div className={styles.radioItemWrapper}>
						<RadioGroupPrimitive.Indicator className={styles.radioIndicator} />
					</div>
				</RadioGroupPrimitive.Item>
				<label className={styles.radioLabel} htmlFor={option.value}>
					{option.label}
					{option.labelInfo && <div className={styles.labelInfo}>{option.labelInfo}</div>}
				</label>
			</div>
		))}
	</RadioGroupPrimitive.Root>
);

/**
 * Design system RadioGroup component (Compound Component Pattern)
 *
 * @example
 * <DsRadioGroup.Root value={value} onValueChange={setValue}>
 *   <div>
 *     <DsRadioGroup.Item value="option1" id="option1" />
 *     <label htmlFor="option1">Option 1</label>
 *   </div>
 *   <div>
 *     <DsRadioGroup.Item value="option2" id="option2" />
 *     <label htmlFor="option2">Option 2</label>
 *   </div>
 * </DsRadioGroup.Root>
 */
export const DsRadioGroup = {
	Root,
	Item,
};

export default DsRadioGroup;
