import * as MediaLibrary from 'expo-media-library';
import { MediaAsset } from '@/types/media';
import { DEFAULT_BUCKET } from '@/constants/buckets';

export function normalizeAsset(asset: MediaLibrary.Asset): MediaAsset {
  return {
    id: asset.id,
    uri: asset.uri,
    mediaType: asset.mediaType === MediaLibrary.MediaType.video ? 'video' : 'photo',
    creationTime: asset.creationTime,
    width: asset.width,
    height: asset.height,
    filename: asset.filename,
    bucket: DEFAULT_BUCKET,
    confidence: null,
    uploadStatus: 'pending',
    uploadedAt: null,
    dropboxPath: null,
    hash: null,
    pHash: null,
    trashStatus: 'active',
    trashedAt: null,
    reviewedAt: null,
  };
}
