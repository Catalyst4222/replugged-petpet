export interface FileItem {
  file: File;
  platform: number;
}

// getBySource(/requesting upload/i)
export interface DiscordFile {
  channelId: string;
  classification: string;
  currentSize: number;
  description: string | undefined;
  filename: string;
  id: string;
  isImage: boolean;
  isVideo: boolean;
  item: FileItem;
  loaded: number;
  mimeType: string;
  preCompressionSize: number;
  reactNativeFileIndex: number;
  reactNativeFilePrepped: boolean;
  responseUrl: string;
  showLargeMessageDialog: boolean;
  spoiler: boolean;
  status: string;
  uploadedFilename: string;
  _abortController: AbortSignal;
  _aborted: false;
  _events: unknown;
  _eventsCount: number;
  _maxListeners: unknown;

  cancel(): undefined;
  delete(): undefined;
  getSize(): undefined;
  handleComplete(e: unknown): undefined;
  handleError(e: unknown): undefined;
  reactNativeCompressAndExtractData(): unknown;
  resetState(): undefined;
  retryOpts(): {
    backoff: unknown;
    retries: number;
    timeout: number;
  };
  setFilename(name: string): undefined;
  setResponseUrl(responseUrl: string): undefined;
  setStatus(status: string): undefined;
  setUploadedFilename(uploadedFilename: string): undefined;
  upload(): unknown;
  uploadFileToCloud(): unknown;

  // eslint-disable-next-line @typescript-eslint/no-misused-new
  constructor(
    item: { file: File; platorm: number },
    channelId: string,
    showLargeMessageDialog: boolean,
    reactNativeFileIndex: number,
  ): DiscordFile;
}

export interface UploadData {
  file: FileItem;
  channelId: string;
  showLargeMessageDialog: boolean;
  draftType: number;
}

export interface MultiUploadData {
  files: FileItem[];
  channelId: string;
  showLargeMessageDialog: boolean;
  draftType: number;
}

// getBySource("UPLOAD_ATTACHMENT_ADD_FILES")
export interface FileUploadMod {
  addFile(data: UploadData): void;
  addFiles(data: MultiUploadData): void;
  clearAll(channelId: string, draftType: number): void;
  popFirstFile(channelId: string): void;
  remove(channelId: string, id: unknown, draftType: number): void;
  removeFiles(channelId: string, attachmentIds: unknown, draftType: number): void;
  setFile(e: unknown): void;
  setUploads(e: unknown): void;
  update(e: unknown, t: unknown, n: unknown, o: unknown): void;
}

// getBySource("UploadAttachmentStore")
export interface UploadAttachmentStore {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __getLocalVars(): {
    _uploads: Map<
      string, // channel id
      Map<
        number, // draft type?
        File[]
      >
    >;
    handleAddFiles(e: MultiUploadData): undefined;
    EMPTY: unknown[]
  };
  // eslint-disable-next-line @typescript-eslint/ban-types
  findUpload(channelId: string, draftType: number, callback: Function): DiscordFile;
  getFirstUpload(channelId: string, draftType: number): number;
  getUpload(channelId: string, id: number, draftType: number): DiscordFile;
  getUploadCount(channelId: string, draftType: number): number;
  getUploads(channelId: string, draftType: number): DiscordFile[];
  hasAdditionalUploads(channelId: string, draftType: number): boolean; // If the channel has 2+ uploads prepped
}

// Guild Nitro Levels
export interface NitroLevel {
  features: string[];
  limits: {
    bitrate: number;
    emoji: number;
    fileSize: number;
    maxConcurrentActivities: number;
    screenshareQualityFramerate: number;
    screenshareQualityResolution: string;
    soundboardSounds: number;
  };
}
