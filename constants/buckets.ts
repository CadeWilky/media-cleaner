import { Bucket } from '@/types/media';

export const BUCKET_LABELS: Record<Bucket, string> = {
  safe: 'Safe',
  suggestive_but_safe: 'Suggestive',
  explicit: 'Explicit',
  uncertain: 'Uncertain',
};

export const BUCKET_COLORS: Record<Bucket, string> = {
  safe: '#22c55e',
  suggestive_but_safe: '#f59e0b',
  explicit: '#ef4444',
  uncertain: '#6b7280',
};

export const ALL_BUCKETS: Bucket[] = ['safe', 'suggestive_but_safe', 'explicit', 'uncertain'];

/** Default bucket for any newly seen asset */
export const DEFAULT_BUCKET: Bucket = 'uncertain';

/** Buckets that may be uploaded to Dropbox */
export const UPLOADABLE_BUCKETS: Bucket[] = ['explicit'];

/** Buckets that stay in the camera roll and are never auto-deleted */
export const CAMERA_ROLL_BUCKETS: Bucket[] = ['safe', 'suggestive_but_safe'];
