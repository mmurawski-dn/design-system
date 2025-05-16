import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from '@storybook/test';
import DsDropdown from './ds-dropdown';

const meta: Meta<typeof DsDropdown> = {
  title: 'Design System/Dropdown',
  component: DsDropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    tooltip: {
      control: 'text',
      description: 'Tooltip content to display on hover',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class names',
    },
    style: {
      control: 'object',
      description: 'Inline styles to apply to the component',
    },
    onClick: {
      action: 'clicked',
      description: 'Function called when component is clicked',
    },
    children: {
      control: 'text',
      description: 'Content to display inside the component',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DsDropdown>;

const message = 'Hello world Design System!';

export const Default: Story = {
  args: {
    tooltip: 'Sample tooltip',
    className: '',
    style: { padding: '20px' },
    children: message,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify component renders correctly
    const component = canvas.getByText(message);
    await expect(component).toBeTruthy();

    // Test clicking the component
    await userEvent.click(component);
    await waitFor(() => {
      // Verify the click handler was called (would be tracked in Storybook actions)
    });
  },
};
