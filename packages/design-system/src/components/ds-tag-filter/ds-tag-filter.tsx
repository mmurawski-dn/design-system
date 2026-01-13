import { useState, useRef } from 'react';
import classNames from 'classnames';
import styles from './ds-tag-filter.module.scss';
import type { DsTagFilterProps } from './ds-tag-filter.types';
import { useTagRowCalculation } from './hooks/use-tag-row-calculation';
import { DsTypography } from '../ds-typography';
import { DsTag } from '../ds-tag';
import { DsButton } from '../ds-button';
import { DsIcon } from '../ds-icon';

/**
 * Design system TagFilter component
 *
 * A component for displaying active filters as tags with overflow handling.
 * Shows visible tags in up to 2 rows, with the Expand button to show hidden items.
 */
const DsTagFilter = ({
	items,
	locale = {},
	onClearAll,
	onItemDelete,
	onItemSelect,
	className,
	style,
}: DsTagFilterProps) => {
	const [expanded, setExpanded] = useState(false);
	const tagsWrapperRef = useRef<HTMLDivElement>(null);
	const { firstRowLastVisibleIndex, secondRowLastVisibleIndex, hasOverflow } = useTagRowCalculation({
		tagsWrapperRef,
		totalItems: items.length,
		expanded,
	});
	const { label = 'Filtered by', clearButton = 'Clear all filters' } = locale;

	if (items.length === 0) {
		return null;
	}
	const hiddenCount = items.length - secondRowLastVisibleIndex - 1;
	const firstRowItems = items.slice(0, firstRowLastVisibleIndex + 1);
	const allRemainingItems = items.slice(firstRowLastVisibleIndex + 1);

	return (
		<div className={classNames(styles.container, expanded && styles.expanded, className)} style={style}>
			<div ref={tagsWrapperRef} className={styles.tagsWrapper}>
				<div className={styles.row}>
					{label && (
						<DsTypography variant="body-sm-reg" className={styles.label} data-label-item>
							{label}
						</DsTypography>
					)}
					{firstRowItems.map((item) => (
						<span key={item.id} data-tag-item>
							<DsTag
								label={item.label}
								selected={item.selected}
								onClick={onItemSelect ? () => onItemSelect(item) : undefined}
								onDelete={onItemDelete ? () => onItemDelete(item) : undefined}
							/>
						</span>
					))}
					{onClearAll && (
						<DsButton
							design="v1.2"
							buttonType="tertiary"
							variant="ghost"
							className={styles.clearButton}
							contentClassName={styles.clearContent}
							size="small"
							onClick={onClearAll}
							data-clear-button
						>
							<DsIcon icon="close" />
							{clearButton}
						</DsButton>
					)}
				</div>

				{allRemainingItems.map((item, index) => {
					console.log(item.label, index + firstRowLastVisibleIndex > secondRowLastVisibleIndex);
					return (
						<span
							key={item.id}
							data-tag-item
							className={classNames({
								[styles.hidden]: index + firstRowLastVisibleIndex > secondRowLastVisibleIndex,
							})}
						>
							<DsTag
								label={item.label}
								selected={item.selected}
								onClick={onItemSelect ? () => onItemSelect(item) : undefined}
								onDelete={onItemDelete ? () => onItemDelete(item) : undefined}
							/>
						</span>
					);
				})}
				{(hasOverflow || expanded) && (
					<DsTag
						label={
							expanded ? 'Collapse' : `+${String(hiddenCount)} ${hiddenCount === 1 ? 'filter' : 'filters'}`
						}
						selected={expanded}
						className={styles.expandTag}
						onClick={() => setExpanded((prev) => !prev)}
						data-expand-tag
					/>
				)}
			</div>
		</div>
	);
};

export default DsTagFilter;
