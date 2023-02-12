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
  _events: any;
  _eventsCount: number;
  _maxListeners: any;

  cancel(): undefined;
  delete(): undefined;
  getSize(): undefined;
  handleComplete(e: any): undefined;
  handleError(e: any): undefined;
  reactNativeCompressAndExtractData(): any;
  resetState(): undefined;
  retryOpts(): {
    backoff: any;
    retries: number;
    timeout: number;
  };
  setFilename(name: string): undefined;
  setResponseUrl(responseUrl: string): undefined;
  setStatus(status: string): undefined;
  setUploadedFilename(uploadedFilename: string): undefined;
  upload(): any;
  uploadFileToCloud(): any;

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
  addFile(data: UploadData);
  addFiles(data: MultiUploadData);
  clearAll(channelId: string, draftType: number);
  popFirstFile(channelId: string);
  remove(channelId: string, id: any, draftType: number);
  removeFiles(channelId: string, attachmentIds: any, draftType: number);
  setFile(e);
  setUploads(e);
  update(e, t, n, o);
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
  };
  findUpload(channelId: string, draftType: number, callback: function): DiscordFile;
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
