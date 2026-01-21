import type { Meta, StoryObj } from '@storybook/react-vite';
import { DsSkeleton } from './index';

const meta: Meta<typeof DsSkeleton> = {
	title: 'Design System/Skeleton',
	component: DsSkeleton,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded',
	},
};

export default meta;
type Story = StoryObj<typeof DsSkeleton>;

/**
 * Default skeleton - renders a 3-line paragraph skeleton
 */
export const Default: Story = {
	args: {},
};

/**
 * Loading wrapper pattern - shows skeleton when loading, content when loaded
 */
export const LoadingWrapper: Story = {
	args: {
		loading: true,
		children: (
			<div style={{ padding: '16px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h2>User Profile</h2>
				<p>This is the actual content that appears when loading is complete.</p>
			</div>
		),
	},
	render: (args) => <DsSkeleton {...args} />,
};

/**
 * Color variants - grey (default) and blue
 */
export const ColorVariants: Story = {
	render: () => (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
			<div>
				<h4 style={{ marginBottom: '8px' }}>Grey (default)</h4>
				<DsSkeleton variant="grey" />
			</div>
			<div>
				<h4 style={{ marginBottom: '8px' }}>Blue</h4>
				<DsSkeleton variant="blue" />
			</div>
		</div>
	),
};

/**
 * Text skeleton - typography variants, multiple lines, width, and radius options
 */
export const TextVariants: Story = {
	render: () => (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
			<div>
				<h4 style={{ marginBottom: '8px' }}>Typography Variants</h4>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
					<DsSkeleton.Text typographyVariant="heading1" />
					<DsSkeleton.Text typographyVariant="heading3" />
					<DsSkeleton.Text typographyVariant="body-md-reg" />
					<DsSkeleton.Text typographyVariant="body-sm-reg" />
				</div>
			</div>
			<div>
				<h4 style={{ marginBottom: '8px' }}>Multiple Lines</h4>
				<DsSkeleton.Text typographyVariant="body-md-reg" lines={3} />
			</div>
			<div>
				<h4 style={{ marginBottom: '8px' }}>Custom Width</h4>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
					<DsSkeleton.Text typographyVariant="body-md-reg" width="80%" />
					<DsSkeleton.Text typographyVariant="body-md-reg" width={200} />
				</div>
			</div>
			<div>
				<h4 style={{ marginBottom: '8px' }}>Border Radius</h4>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
					<DsSkeleton.Text typographyVariant="body-md-reg" radius="round" />
					<DsSkeleton.Text typographyVariant="body-md-reg" radius="default" />
					<DsSkeleton.Text typographyVariant="body-md-reg" radius={12} />
				</div>
			</div>
		</div>
	),
};

/**
 * Circle skeleton with avatar sizes
 */
export const CircleSizes: Story = {
	render: () => (
		<div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
			<div style={{ textAlign: 'center' }}>
				<DsSkeleton.Circle size="xsm" />
				<p style={{ marginTop: '8px', fontSize: '12px' }}>xsm (24px)</p>
			</div>
			<div style={{ textAlign: 'center' }}>
				<DsSkeleton.Circle size="sm" />
				<p style={{ marginTop: '8px', fontSize: '12px' }}>sm (32px)</p>
			</div>
			<div style={{ textAlign: 'center' }}>
				<DsSkeleton.Circle size="regular" />
				<p style={{ marginTop: '8px', fontSize: '12px' }}>regular (40px)</p>
			</div>
			<div style={{ textAlign: 'center' }}>
				<DsSkeleton.Circle size="md" />
				<p style={{ marginTop: '8px', fontSize: '12px' }}>md (48px)</p>
			</div>
			<div style={{ textAlign: 'center' }}>
				<DsSkeleton.Circle size="lg" />
				<p style={{ marginTop: '8px', fontSize: '12px' }}>lg (64px)</p>
			</div>
			<div style={{ textAlign: 'center' }}>
				<DsSkeleton.Circle size="xl" />
				<p style={{ marginTop: '8px', fontSize: '12px' }}>xl (80px)</p>
			</div>
			<div style={{ textAlign: 'center' }}>
				<DsSkeleton.Circle size={100} />
				<p style={{ marginTop: '8px', fontSize: '12px' }}>custom (100px)</p>
			</div>
		</div>
	),
};

/**
 * Rectangle skeleton - buttons, badges, images
 */
export const RectangleShapes: Story = {
	render: () => (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
			<div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
				<DsSkeleton.Rect width={120} height={40} />
				<span style={{ fontSize: '12px', color: '#666' }}>Button</span>
			</div>
			<div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
				<DsSkeleton.Rect width={80} height={24} radius="round" />
				<span style={{ fontSize: '12px', color: '#666' }}>Badge</span>
			</div>
			<div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
				<DsSkeleton.Rect width={200} height={150} radius={8} />
				<span style={{ fontSize: '12px', color: '#666' }}>Image</span>
			</div>
		</div>
	),
};

/**
 * Card skeleton composition example
 */
export const CardSkeleton: Story = {
	render: () => (
		<div
			style={{
				border: '1px solid #e5e8ed',
				borderRadius: '8px',
				padding: '24px',
				maxWidth: '400px',
			}}
		>
			<div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
				<DsSkeleton.Circle size="lg" />
				<div style={{ flex: 1 }}>
					<DsSkeleton.Text typographyVariant="heading4" width="60%" />
					<div style={{ marginTop: '8px' }}>
						<DsSkeleton.Text typographyVariant="body-sm-reg" width="80%" />
					</div>
				</div>
			</div>
			<DsSkeleton.Text typographyVariant="body-md-reg" lines={3} />
			<div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
				<DsSkeleton.Rect width={100} height={36} radius={4} />
				<DsSkeleton.Rect width={100} height={36} radius={4} />
			</div>
		</div>
	),
};
