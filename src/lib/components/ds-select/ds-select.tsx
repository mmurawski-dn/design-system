import React from 'react';
import * as Select from '@radix-ui/react-select';
import classNames from 'classnames';
import styles from './ds-select.module.scss';
import { DsSelectProps } from './ds-select.types';
import { DsIcon } from '../ds-icon';

const DsSelect: React.FC<DsSelectProps> = ({
  id,
  options,
  value,
  style,
  onValueChange,
  onBlur,
  placeholder = 'Click to select a value',
  ...props
}) => {
  return (
    <div className={styles.container} style={style}>
      <Select.Root value={value} onValueChange={onValueChange} {...props}>
        <Select.Trigger id={id} className={styles.trigger} onBlur={onBlur}>
          <div className={styles.itemValue}>
            <Select.Value placeholder={placeholder} />
          </div>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content className={styles.content} position="popper" sideOffset={4}>
            <Select.Viewport className={styles.viewport}>
              {options.map(option => (
                <Select.Item
                  key={option.value}
                  className={classNames(styles.item, {
                    [styles.withIcon]: option.icon,
                  })}
                  value={option.value}
                >
                  <Select.ItemIndicator className={styles.indicator}>
                    <DsIcon icon="check" />
                  </Select.ItemIndicator>
                  <div className={styles.itemValue}>
                    <div className={styles.itemIcon}>{option.icon && <DsIcon icon={option.icon} />}</div>
                    <Select.ItemText>{option.label}</Select.ItemText>
                  </div>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
};

export default DsSelect;
