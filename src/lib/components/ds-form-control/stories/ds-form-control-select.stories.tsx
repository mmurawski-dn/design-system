import type { Meta, StoryObj } from '@storybook/react';
import DsFormControl from '../ds-form-control';
import { DefaultDescription } from './ds-form-control-stories-shared';
import { controlStatuses } from '@design-system/ui';

const meta: Meta<typeof DsFormControl> = {
	title: 'Design System/FormControl/Select',
	component: DsFormControl,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		status: {
			control: { type: 'select' },
			options: controlStatuses,
			description: 'Form control color status',
			table: {
				defaultValue: {
					summary: controlStatuses[0],
				},
			},
		},
		label: {
			control: 'text',
			description: 'Label for the form control',
		},
		required: {
			control: 'boolean',
			description: 'Indicates if the field is required',
		},
		showHelpIcon: {
			control: 'boolean',
			description: 'Show help icon next to the label',
		},
		message: {
			control: 'text',
			description: 'Message to display below the form control',
		},
		messageIcon: {
			control: 'text',
			description: 'Icon to display in the message',
		},
		className: {
			control: 'text',
			description: 'Additional CSS class names',
		},
		style: {
			control: 'object',
			description: 'Additional styles to apply to the component',
		},
	},
};

export default meta;
type Story = StoryObj<typeof DsFormControl>;

export const Default: Story = {
	args: {
		label: 'Select Option',
		required: true,
		message: 'This is a message',
		children: (
			<DsFormControl.Select
				placeholder="Input"
				options={[
					{ label: 'Option 1', value: 'option1', icon: 'download' },
					{ label: 'Option 2', value: 'option2', icon: 'save' },
					{ label: 'Option 3', value: 'option3', icon: 'description' },
				]}
			/>
		),
	},
	play: async ({ canvasElement }) => {},
};

export const WithCustomWidth: Story = {
	args: {
		label: 'Select Option',
		required: true,
		style: { width: '300px' },
		children: (
			<DsFormControl.Select
				placeholder="Input"
				options={[
					{ label: 'Option 1', value: 'option1', icon: 'download' },
					{ label: 'Option 2', value: 'option2', icon: 'save' },
					{ label: 'Option 3', value: 'option3', icon: 'description' },
				]}
			/>
		),
	},
	play: async ({ canvasElement }) => {},
};

export const WithCustomStyles: Story = {
	args: {
		label: 'Select Option',
		required: true,
		style: {
			width: '400px',
			padding: '16px',
			border: '2px solid #e0e0e0',
			borderRadius: '8px',
			backgroundColor: '#f9f9f9',
		},
		children: (
			<DsFormControl.Select
				placeholder="Input"
				options={[
					{ label: 'Option 1', value: 'option1', icon: 'download' },
					{ label: 'Option 2', value: 'option2', icon: 'save' },
					{ label: 'Option 3', value: 'option3', icon: 'description' },
				]}
			/>
		),
	},
	play: async ({ canvasElement }) => {},
};

export const WithDescription: Story = {
	args: {
		label: 'Select Option',
		required: true,
		style: {
			width: '300px',
		},
		children: (
			<>
				<DsFormControl.Description>
					<DefaultDescription />
				</DsFormControl.Description>
				<DsFormControl.Select
					placeholder="Input"
					options={[
						{ label: 'Option 1', value: 'option1', icon: 'download' },
						{ label: 'Option 2', value: 'option2', icon: 'save' },
						{ label: 'Option 3', value: 'option3', icon: 'description' },
					]}
				/>
			</>
		),
	},
	play: async ({ canvasElement }) => {},
};

export const WithHelpIcon: Story = {
	args: {
		label: 'Select Option',
		required: true,
		showHelpIcon: true,
		onHelpClick: () => alert('Help clicked!'),
		children: (
			<>
				<DsFormControl.Description>
					<DefaultDescription />
				</DsFormControl.Description>
				<DsFormControl.Select
					placeholder="Input"
					options={[
						{ label: 'Option 1', value: 'option1', icon: 'download' },
						{ label: 'Option 2', value: 'option2', icon: 'save' },
						{ label: 'Option 3', value: 'option3', icon: 'description' },
					]}
				/>
			</>
		),
	},
	play: async ({ canvasElement }) => {},
};

export const Success: Story = {
	args: {
		status: 'success',
		label: 'Select Option',
		message: 'This is a success caption under a select input.',
		messageIcon: 'check_circle',
		children: (
			<>
				<DsFormControl.Description>
					<DefaultDescription />
				</DsFormControl.Description>
				<DsFormControl.Select
					placeholder="Input"
					options={[
						{ label: 'Option 1', value: 'option1', icon: 'download' },
						{ label: 'Option 2', value: 'option2', icon: 'save' },
						{ label: 'Option 3', value: 'option3', icon: 'description' },
					]}
				/>
			</>
		),
	},
	play: async ({ canvasElement }) => {},
};

export const Error: Story = {
	args: {
		status: 'error',
		label: 'Select Option',
		message: 'This is an error caption under a select input.',
		messageIcon: 'error',
		children: (
			<>
				<DsFormControl.Description>
					<DefaultDescription />
				</DsFormControl.Description>
				<DsFormControl.Select
					placeholder="Input"
					options={[
						{ label: 'Option 1', value: 'option1', icon: 'download' },
						{ label: 'Option 2', value: 'option2', icon: 'save' },
						{ label: 'Option 3', value: 'option3', icon: 'description' },
					]}
				/>
			</>
		),
	},
	play: async ({ canvasElement }) => {},
};

export const Warning: Story = {
	args: {
		status: 'warning',
		label: 'Select Option',
		message: 'This is a warning caption under a select input.',
		messageIcon: 'info',
		children: (
			<>
				<DsFormControl.Description>
					<DefaultDescription />
				</DsFormControl.Description>
				<DsFormControl.Select
					placeholder="Input"
					options={[
						{ label: 'Option 1', value: 'option1', icon: 'download' },
						{ label: 'Option 2', value: 'option2', icon: 'save' },
						{ label: 'Option 3', value: 'option3', icon: 'description' },
					]}
				/>
			</>
		),
	},
	play: async ({ canvasElement }) => {},
};

export const Disabled: Story = {
	args: {
		label: 'Select Option',
		children: (
			<>
				<DsFormControl.Description>
					<DefaultDescription />
				</DsFormControl.Description>
				<DsFormControl.Select
					placeholder="Input"
					options={[
						{ label: 'Option 1', value: 'option1', icon: 'download' },
						{ label: 'Option 2', value: 'option2', icon: 'save' },
						{ label: 'Option 3', value: 'option3', icon: 'description' },
					]}
					disabled
				/>
			</>
		),
	},
	play: async ({ canvasElement }) => {},
};
