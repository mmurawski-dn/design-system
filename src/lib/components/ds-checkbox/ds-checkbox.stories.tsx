import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import DsCheckbox from './ds-checkbox';

const meta: Meta<typeof DsCheckbox> = {
  title: 'Design System/Checkbox',
  component: DsCheckbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label for the checkbox',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class names',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DsCheckbox>;

const label = 'Accept terms and conditions';

export const Default: Story = {
  args: {
    label,
    className: 'custom-checkbox',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Locate the checkbox by its label
    const checkbox = await canvas.findByLabelText(label);

    // Assert that the checkbox is initially unchecked
    await expect(checkbox).not.toBeChecked();

    // Click to check the checkbox
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();

    // Click again to uncheck the checkbox
    await userEvent.click(checkbox);
    await expect(checkbox).not.toBeChecked();
  },
};

export const Indeterminate: Story = {
  render: () => {
    const [checked, setChecked] = useState<boolean | 'indeterminate'>('indeterminate');

    return (
      <DsCheckbox label={label} checked={checked} onCheckedChange={newState => setChecked(newState)} />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Locate the checkbox by its label
    const checkbox = await canvas.findByLabelText(label);

    // Assert that the checkbox is initially indeterminate
    await expect(checkbox).toHaveAttribute('data-state', 'indeterminate');
  },
};

export const Disabled: Story = {
  args: {
    label,
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Locate the checkbox by its label
    const checkbox = await canvas.findByLabelText(label);

    // Assert that the checkbox is disabled
    await expect(checkbox).toBeDisabled();

    // Attempt to click the disabled checkbox
    await userEvent.click(checkbox, { pointerEventsCheck: 0 });

    // Assert that the checkbox remains unchecked
    await expect(checkbox).not.toBeChecked();
  },
};
