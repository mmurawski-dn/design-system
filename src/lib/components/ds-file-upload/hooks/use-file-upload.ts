import { useState } from 'react';
import {
	FileUploadFileAcceptDetails,
	FileUploadFileRejectDetails,
	FileUploadFileRejection,
} from '@ark-ui/react';
import { isFileEqual } from '../utils';
import { FileUploadAdapter, FileUploadResult } from '../adapters/file-upload-adapter.types';
import { FileError, FileUploadProps } from '../components/file-upload';

export interface FileWithErrors {
	file: File;
	errors: FileError[];
}

export type UploadFileStatus = 'pending' | 'uploading' | 'interrupted' | 'completed' | 'error' | 'cancelled';
export type FileMeta = Pick<File, 'name' | 'type' | 'size'>;

export interface UploadFileMeta extends FileMeta {
	id: string;
	progress: number;
	status: UploadFileStatus;
	errors?: FileError[];
}

export interface UploadFile extends File {
	id: string;
}

export interface FileUploadState {
	id: string;
	file: File;
	progress: number;
	status: 'pending' | 'uploading' | 'completed' | 'error';
	errors?: FileError[];
}

export interface UseFileUploadConfig {
	adapter: FileUploadAdapter;
	autoUpload?: boolean;
	maxConcurrent?: number;
	metadata?: Record<string, string>;
	onUploadComplete?: (fileId: string, result: FileUploadResult) => void;
	onUploadError?: (fileId: string, error: string) => void;
	onAllUploadsComplete?: () => void;
}

export interface UseFileUploadUserCallbacks {
	onFilesAdded?: (files: File[]) => void;
	onFileRemoved?: (fileId: string) => void;
}

export interface UseFileUploadReturn {
	files: UploadFileMeta[];
	acceptedFiles: UploadFile[];
	addFiles: (newFiles: File[]) => UploadFile[];
	addRejectedFiles: (files: FileWithErrors[]) => void;
	removeFile: (fileId: string) => void;
	uploadFile: (fileId: string) => Promise<void>;
	uploadAll: () => Promise<void>;
	cancelUpload: (fileId: string) => Promise<void>;
	retryUpload: (fileId: string) => Promise<void>;
	clearFiles: () => void;
	/**
	 * Get props for FileUpload component with callback composition
	 * @param userCallbacks Optional user callbacks to compose with internal logic
	 * @returns Props ready to spread onto FileUpload component
	 */
	getProps: (
		userCallbacks?: UseFileUploadUserCallbacks,
	) => Pick<
		FileUploadProps,
		| 'files'
		| 'acceptedFiles'
		| 'onFileAccept'
		| 'onFileReject'
		| 'onFileRemove'
		| 'onFileDelete'
		| 'onFileCancel'
		| 'onFileRetry'
	>;
}

/**
 * File upload state management hook
 */
export function useFileUpload({
	adapter,
	autoUpload = true,
	maxConcurrent = 3,
	metadata,
	onUploadComplete,
	onUploadError,
	onAllUploadsComplete,
}: UseFileUploadConfig): UseFileUploadReturn {
	const [abortControllers] = useState(() => new Map<string, AbortController>());
	const [files, setFiles] = useState<UploadFileMeta[]>([]);
	const acceptedFiles = files.filter((file) => file.status !== 'error');

	if (files.length && !files.some((f) => f.status === 'uploading')) {
		onAllUploadsComplete?.();
	}

	const addFiles = (newFiles: UploadFile[]): UploadFile[] => {
		const newFilesOnly = newFiles.filter(
			(file) => !acceptedFiles.some((existing) => isFileEqual(existing, file)),
		);

		const duplicateFiles = newFiles.filter(
			(file) => !file.id && files.find((otherFile) => isFileEqual(file, otherFile)),
		);

		if (duplicateFiles.length > 0) {
			const duplicateFilesWithErrors = duplicateFiles.map((file) => ({
				file,
				errors: ['FILE_EXISTS'],
			}));
			addRejectedFiles(duplicateFilesWithErrors);
		}

		const newUploadFiles: UploadFileMeta[] = newFilesOnly.map((file) => ({
			id: `${file.name}-${Date.now()}-${Math.random()}`,
			name: file.name,
			size: file.size,
			type: file.type,
			progress: 0,
			status: 'pending',
		}));

		setFiles((prev) => [...prev, ...newUploadFiles]);

		if (autoUpload) {
			newUploadFiles.forEach((file) => {
				uploadSingleFile(file);
			});
		}

		return newUploadFiles;
	};

	const addRejectedFiles = (filesWithErrors: FileWithErrors[]) => {
		const newFileStates: UploadFileMeta[] = filesWithErrors.map(({ file, errors }) => ({
			id: `${file.name}-${Date.now()}-${Math.random()}`,
			progress: 0,
			status: 'error',
			errors,
			name: file.name,
			size: file.size,
			type: file.type,
		}));

		setFiles((prev) => [...prev, ...newFileStates]);
	};

	const updateFileProgress = (fileId: string, progress: number) => {
		setFiles((prev) => prev.map((file) => (file.id === fileId ? { ...file, progress } : file)));
	};

	const updateFileStatus = (fileId: string, status: UploadFileStatus, error?: string) => {
		setFiles((prev) =>
			prev.map((file) =>
				file.id === fileId
					? {
							...file,
							status,
							errors: error ? [...(file.errors || []), error] : file.errors,
						}
					: file,
			),
		);
	};

	const uploadFile = async (fileId: string) => {
		const file = acceptedFiles.find((f) => f.id === fileId);
		if (file) {
			await uploadSingleFile(file);
		}
	};

	const uploadSingleFile = async (file: UploadFile) => {
		const fileId = file.id;
		const abortController = new AbortController();
		abortControllers.set(fileId, abortController);

		updateFileStatus(file.id, 'uploading');

		try {
			const result = await adapter.upload({
				file,
				fileId,
				metadata,
				signal: abortController.signal,
				onProgress: (progress) => {
					updateFileProgress(fileId, progress);
				},
			});

			if (result.success) {
				updateFileStatus(fileId, 'completed');
				updateFileProgress(fileId, 100);
				onUploadComplete?.(fileId, result);
			} else {
				// Determine status based on retryability
				const status = result.isRetryable ? 'interrupted' : 'error';
				updateFileStatus(fileId, status, result.error);
				onUploadError?.(fileId, result.error || 'Upload failed');
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Upload failed';
			// Network/unexpected errors are retryable
			updateFileStatus(fileId, 'interrupted', errorMessage);
			onUploadError?.(fileId, errorMessage);
		} finally {
			abortControllers.delete(fileId);
		}
	};

	const uploadAll = async () => {
		const pendingFiles = files.filter((f) => f.status === 'pending');

		for (let i = 0; i < pendingFiles.length; i += maxConcurrent) {
			const batch = pendingFiles.slice(i, i + maxConcurrent);
			await Promise.allSettled(batch.map((f) => uploadFile(f.id)));
		}
	};

	const cancelUpload = async (fileId: string) => {
		abortControllers.get(fileId)?.abort();
		abortControllers.delete(fileId);

		if (adapter.cancel) {
			await adapter.cancel(fileId);
		}

		updateFileStatus(fileId, 'cancelled');
	};

	const retryUpload = async (fileId: string) => {
		updateFileStatus(fileId, 'pending');
		updateFileProgress(fileId, 0);
		await uploadFile(fileId);
	};

	const removeFile = (fileId: string) => {
		abortControllers.get(fileId)?.abort();
		abortControllers.delete(fileId);

		setFiles((prev) => prev.filter((file) => file.id !== fileId));
	};

	const clearFiles = () => {
		abortControllers.forEach((controller) => controller.abort());
		abortControllers.clear();

		setFiles([]);
	};

	const getProps = (userCallbacks?: UseFileUploadUserCallbacks) => {
		const handleFileAccept = (details: FileUploadFileAcceptDetails) => {
			const addedFiles = addFiles(details.files);
			userCallbacks?.onFilesAdded?.(addedFiles);
		};

		const handleFileReject = (details: FileUploadFileRejectDetails) => {
			addRejectedFiles(
				details.files.map((f: FileUploadFileRejection) => ({
					file: f.file,
					errors: f.errors,
				})),
			);
		};

		const handleFileRemove = (fileId: string) => {
			removeFile(fileId);
			userCallbacks?.onFileRemoved?.(fileId);
		};

		return {
			files,
			acceptedFiles,
			onFileAccept: handleFileAccept,
			onFileReject: handleFileReject,
			onFileRemove: handleFileRemove,
			onFileDelete: handleFileRemove,
			onFileCancel: cancelUpload,
			onFileRetry: retryUpload,
		};
	};

	return {
		files,
		acceptedFiles,
		addFiles,
		addRejectedFiles,
		removeFile,
		uploadFile,
		uploadAll,
		cancelUpload,
		retryUpload,
		clearFiles,
		getProps,
	};
}
