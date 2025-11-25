import classNames from 'classnames';
import { Tabs } from '@ark-ui/react/tabs';
import { DsTypography } from '@design-system/ui';
import { DsVerticalTabsProps } from './ds-vertical-tabs.types';
import styles from './ds-vertical-tabs.module.scss';

/**
 * Design system vertical tabs component displays vertical navigation menu with count badges and states
 * Commonly used in sidebars, filter panels, settings, and multisection UIs
 */
const DsVerticalTabs = ({ items, selectedItem, onSelect, className, style }: DsVerticalTabsProps) => {
	const handleValueChange = (details: { value: string | null }) => {
		if (details.value && onSelect) {
			const item = items.find((i) => i.id === details.value);
			if (item) {
				onSelect(item);
			}
		}
	};

	return (
		<Tabs.Root
			orientation="vertical"
			style={style}
			className={className}
			value={selectedItem?.id}
			onValueChange={handleValueChange}
		>
			<Tabs.List className={styles.tabList}>
				{items.map((item) => (
					<Tabs.Trigger
						key={item.id}
						value={item.id}
						disabled={item.disabled}
						className={classNames(styles.tabItem, {
							[styles.selected]: item.id === selectedItem?.id,
						})}
					>
						<DsTypography variant="body-sm-md" className={styles.tabItemLabel}>
							{item.label}
						</DsTypography>
						{item.count !== undefined && item.count > 0 && (
							<div className={styles.tabItemCount}>
								<span className={styles.tabItemDot} />
								<DsTypography variant="body-sm-reg" className={styles.tabItemCountText}>
									{item.count}
								</DsTypography>
							</div>
						)}
					</Tabs.Trigger>
				))}
			</Tabs.List>
		</Tabs.Root>
	);
};

export default DsVerticalTabs;
