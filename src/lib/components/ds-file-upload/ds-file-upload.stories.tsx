import type { Meta, StoryObj } from '@storybook/react';
import DsButton from '../ds-button/ds-button';
import DsFileUpload from './ds-file-upload';
import { useFileUpload } from './hooks/use-file-upload';
import { createTestPlayFunction } from './ds-file-upload.stories.util';
import { MockAdapterPresets } from './stories/adapters/mock-file-upload-adapter';
import { FileUpload } from './components/file-upload';
// @ts-expect-error mdx file (needed for story)
import DocsPage from './stories/adapters/MyCustomFileUploadAdapter.docs.mdx';

const meta: Meta<typeof DsFileUpload> = {
	title: 'Design System/FileUpload',
	component: DsFileUpload,
	parameters: {
		layout: 'centered',
		docs: {
			page: DocsPage,
			source: {
				code: `
const adapter = new MyCustomFileUploadAdapter({
	bucket: 'my-bucket',
	region: 'us-east-1',
	getPresignedUrl: async (fileName) => \`https://example-bucket.s3.amazonaws.com/\${fileName}?signature=mocked\`
});

return (
	<DsFileUpload
		adapter={adapter}
		onFilesAdded={(files) => console.log('📁 Files added:', files.map((f) => f.name))}
		onUploadComplete={(fileId, result) => console.log('✅ Upload complete:', fileId, result.url)}
		onUploadError={(fileId, error) => console.error('❌ Upload failed:', fileId, error)}
		onFileRemoved={(fileId) => console.log('🗑️ File removed:', fileId)}
		onAllUploadsComplete={() => console.log('🎉 All uploads complete!')}
	/>
);`,
			},
		},
	},
	tags: ['autodocs'],
	argTypes: {
		errorText: { control: 'text' },
		dropzoneText: { control: 'text' },
		triggerText: { control: 'text' },
		hideProgress: { control: 'boolean' },
		allowDrop: { control: 'boolean' },
		maxFiles: { control: 'number' },
		accept: { control: 'object' },
		disabled: { control: 'boolean' },
		compact: { control: 'boolean' },
	},
};

export default meta;
type Story = StoryObj<typeof DsFileUpload>;

/**
 * Default auto-upload behavior
 * Files automatically upload when dropped or selected
 */
export const Default: Story = {
	args: {
		adapter: MockAdapterPresets.normal(),
		style: { width: '500px' },
		onFilesAdded: (files) => {
			console.log(
				'📁 Files added:',
				files.map((f) => f.name),
			);
		},
		onUploadComplete: (fileId, result) => {
			if (result.success) {
				console.log('✅ Upload complete:', fileId, result.url);
			} else {
				console.error('❌ Upload failed:', fileId, result.error);
			}
		},
		onUploadError: (fileId, error) => {
			console.error('❌ Upload failed:', fileId, error);
		},
		onFileRemoved: (fileId) => {
			console.log('🗑️ File removed:', fileId);
		},
		onAllUploadsComplete: () => {
			console.log('🎉 All uploads complete!');
		},
	},
};

/**
 * Manual upload mode - files must be uploaded manually
 * Good for review workflows or batch operations
 * Advance use case which demonstrates use of (base) FileUpload with useFileUpload
 */
export const Manual: Story = {
	args: {
		adapter: MockAdapterPresets.normal(),
		autoUpload: false,
		hideProgress: false,
		style: { width: '500px' },
	},
	render: function Render(args) {
		const { getProps, files, uploadAll, clearFiles } = useFileUpload({
			adapter: MockAdapterPresets.normal(),
			autoUpload: false, // Manual upload
		});

		const isUploading = files.some((file) => file.status === 'uploading');
		const hasFiles = files.length > 0;

		return (
			<div style={{ width: '500px' }}>
				<FileUpload {...getProps()} {...args} />

				{hasFiles && (
					<div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
						<DsButton design="v1.2" size="small" onClick={() => uploadAll()} disabled={isUploading}>
							{isUploading ? 'Uploading...' : 'Upload All'}
						</DsButton>
						<DsButton
							design="v1.2"
							variant="ghost"
							size="small"
							onClick={() => clearFiles()}
							disabled={isUploading}
						>
							Clear All
						</DsButton>
					</div>
				)}
			</div>
		);
	},
};

/**
 * Compact mode for inline or constrained layouts
 */
export const Compact: Story = {
	args: {
		adapter: MockAdapterPresets.fast(),
		compact: true,
		maxFiles: 1,
		dropzoneText: 'Drag and drop your document here or',
		triggerText: 'Choose document',
		style: { width: '400px' },
	},
};

/**
 * Disabled state
 */
export const Disabled: Story = {
	args: {
		adapter: MockAdapterPresets.normal(),
		disabled: true,
		style: { width: '500px' },
	},
};

/**
 * Upload error scenario - file fails validation immediately
 */
export const UploadError: Story = {
	args: {
		adapter: MockAdapterPresets.error('Unsupported file type'),
		style: { width: '500px' },
	},
	play: createTestPlayFunction('error'),
};

/**
 * Upload interrupted scenario - network fails mid-upload
 * Demonstrates retry functionality
 */
export const UploadInterrupted: Story = {
	args: {
		adapter: MockAdapterPresets.interrupted(30),
		style: { width: '500px' },
	},
	play: createTestPlayFunction('interrupted'),
};
