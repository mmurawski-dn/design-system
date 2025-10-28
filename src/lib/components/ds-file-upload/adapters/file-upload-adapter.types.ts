export interface FileUploadOptions {
	file: File;
	fileId: string;
	metadata?: Record<string, string>;
	onProgress?: (progress: number) => void;
	signal?: AbortSignal;
}

export interface FileUploadResult {
	success: boolean;
	url?: string;
	error?: string;
	isRetryable?: boolean;
	metadata?: Record<string, string | number>;
}

export interface FileUploadAdapter {
	name: string;
	upload: (options: FileUploadOptions) => Promise<FileUploadResult>;
	cancel?: (fileId: string) => Promise<void>;
	supportsResumable?: boolean;
	supportsChunking?: boolean;
}
