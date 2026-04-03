export type Bucket = 'safe' | 'suggestive_but_safe' | 'explicit' | 'uncertain';

export type UploadStatus = 'pending' | 'uploading' | 'uploaded' | 'failed';

export type TrashStatus = 'active' | 'trashed' | 'purged';

export interface MediaAsset {
  id: string;                        // MediaLibrary asset ID
  uri: string;                       // local URI
  mediaType: 'photo' | 'video';
  creationTime: number;              // epoch ms
  width: number;
  height: number;
  filename: string;
  bucket: Bucket;
  confidence: number | null;         // 0–1, null if not classified
  uploadStatus: UploadStatus;
  uploadedAt: number | null;         // epoch ms
  dropboxPath: string | null;
  hash: string | null;               // SHA-256 base64 of file bytes, null until computed
  pHash: string | null;              // perceptual hash hex string, null until computed
  trashStatus: TrashStatus;
  trashedAt: number | null;          // epoch ms
  reviewedAt: number | null;         // epoch ms, last time user manually set the bucket
}

export interface TrashRecord {
  assetId: string;
  trashedAt: number;
  purgeAfter: number;                // trashedAt + 30 days in ms
}

export interface UploadRecord {
  assetId: string;
  dropboxPath: string;
  uploadedAt: number;
  contentHash: string | null;        // Dropbox content hash from upload response
}
