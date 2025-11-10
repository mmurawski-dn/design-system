import React from 'react';
import { DsFileUploadProps } from './ds-file-upload.types';
import { FileUpload } from './components/file-upload';
import { useFileUpload } from './hooks';

/**
 * Design system File Upload component (with state management)
 */
const DsFileUpload: React.FC<DsFileUploadProps> = ({
	adapter,
	autoUpload = true,
	maxConcurrent = 3,
	metadata,
	onUploadComplete,
	onUploadError,
	onFilesAdded,
	onFileRemoved,
	onAllUploadsComplete,
	...props
}) => {
	const { getProps } = useFileUpload({
		adapter,
		autoUpload,
		maxConcurrent,
		metadata,
		onUploadComplete,
		onUploadError,
		onAllUploadsComplete,
	});

	const fileUploadProps = getProps({
		onFilesAdded,
		onFileRemoved,
	});

	return <FileUpload {...fileUploadProps} {...props} />;
};

export default DsFileUpload;
