import React, { useRef, useState } from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { Root as VisuallyHidden } from '@radix-ui/react-visually-hidden';
import classNames from 'classnames';
import { DsButton, DsCheckbox, DsChip, DsIcon, DsTypography } from '@design-system/ui';
import styles from './chip-filter-panel.module.scss';
import { ChipFilterPanelProps } from './chip-filter-panel.types';
import { useChipRowCalculation } from './hooks/use-chip-row-calculation';

/**
 * Chip filter widget
 */
const ChipFilterPanel: React.FC<ChipFilterPanelProps> = ({
	filters,
	onClearAll,
	onFilterDelete,
	onFilterSelect,
	className,
	style,
}) => {
	const [dialogOpen, setDialogOpen] = useState(false);
	const showAllFiltersRef = useRef<HTMLDivElement>(null);
	const chipsWrapperRef = useRef<HTMLDivElement>(null);
	const visibleCount = useChipRowCalculation({
		chipsWrapperRef,
		totalFilters: filters.length,
	});

	if (filters.length === 0) {
		return null;
	}

	const hiddenCount = filters.length - visibleCount;
	const showExpandButton = hiddenCount > 0;

	const handleOpenDialog = () => {
		setDialogOpen(true);
	};

	let dialogStyle: React.CSSProperties = {};
	if (showExpandButton && showAllFiltersRef.current) {
		const rect = showAllFiltersRef.current.getBoundingClientRect();
		dialogStyle = {
			position: 'fixed',
			top: rect.bottom + 4,
			left: rect.left,
		};
	}

	return (
		<div className={classNames(styles.container, className)} style={style}>
			<DsTypography variant="body-sm-reg" className={styles.label}>
				Filtered by:
			</DsTypography>

			<div ref={chipsWrapperRef} className={styles.chipsWrapper}>
				{filters.map((filter, index) => (
					<DsChip
						key={filter.id}
						label={filter.label}
						selected={filter.selected}
						onClick={() => onFilterSelect?.(filter)}
						onDelete={() => onFilterDelete?.(filter)}
						className={classNames({
							[styles.hidden]: index >= visibleCount,
						})}
					/>
				))}
				{showExpandButton && (
					<DsChip
						ref={showAllFiltersRef}
						label={`+${hiddenCount} filters show all`}
						onClick={handleOpenDialog}
						className={styles.expandChip}
					/>
				)}
			</div>

			<DsButton design="v1.2" buttonType="tertiary" variant="ghost" size="small" onClick={onClearAll}>
				<DsIcon icon="close" />
				Clear all filters
			</DsButton>

			<RadixDialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
				<VisuallyHidden>
					<RadixDialog.Title />
				</VisuallyHidden>
				<RadixDialog.Portal>
					<RadixDialog.Content style={dialogStyle} className={styles.dialog}>
						<div className={styles.dialogContent}>
							{filters
								.filter((filter, index) => index >= visibleCount)
								.map((filter) => (
									<div key={filter.id} className={styles.filterCheckbox}>
										<DsCheckbox
											id={`filter-${filter.id}`}
											checked={filter.selected}
											onCheckedChange={() => onFilterSelect?.(filter)}
											label={filter.label}
										/>
									</div>
								))}
						</div>
					</RadixDialog.Content>
				</RadixDialog.Portal>
			</RadixDialog.Root>
		</div>
	);
};

export default ChipFilterPanel;
