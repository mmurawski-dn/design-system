import {
	FileUploadAdapter,
	FileUploadOptions,
	FileUploadResult,
} from '../../adapters/file-upload-adapter.types';

interface SimpleFileUploadAdapterConfig {
	presignedUrl: string;
}

export function getSimpleFileUploadAdapter(config: SimpleFileUploadAdapterConfig): FileUploadAdapter {
	return {
		async upload(options: FileUploadOptions): Promise<FileUploadResult> {
			const xhr = new XMLHttpRequest();

			return new Promise((resolve, reject) => {
				xhr.upload.addEventListener('progress', (e) => {
					if (e.lengthComputable && options.onProgress) {
						options.onProgress((e.loaded / e.total) * 100);
					}
				});

				xhr.addEventListener('load', () => {
					if (xhr.status >= 200 && xhr.status < 300) {
						resolve({ success: true, url: config.presignedUrl });
					} else {
						reject(new Error(`Upload failed: ${xhr.statusText}`));
					}
				});

				xhr.addEventListener('error', () => {
					reject(new Error('Network error'));
				});

				options.signal?.addEventListener('abort', () => {
					xhr.abort();
					resolve({ success: false, error: 'Upload cancelled' });
				});

				xhr.open('PUT', config.presignedUrl);
				xhr.setRequestHeader('Content-Type', options.file.type || 'application/octet-stream');
				xhr.send(options.file);
			});
		},
	};
}
