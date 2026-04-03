/** Dropbox API base URLs */
export const DROPBOX_API_BASE = 'https://api.dropboxapi.com/2';
export const DROPBOX_CONTENT_BASE = 'https://content.dropboxapi.com/2';

/** OAuth endpoints */
export const DROPBOX_AUTH_URL = 'https://www.dropbox.com/oauth2/authorize';
export const DROPBOX_TOKEN_URL = 'https://api.dropboxapi.com/oauth2/token';

/**
 * Build the Dropbox upload path for an explicit asset.
 * Uses App Folder scope — paths are relative to /Apps/media-cleaner/
 * so the actual Dropbox path is /Apps/media-cleaner/Explicit/YYYY/MM/filename
 */
export function buildDropboxPath(
  creationTime: number,
  filename: string,
  folder: 'Explicit' | 'Review' = 'Explicit'
): string {
  const date = new Date(creationTime);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `/Explicit/${yyyy}/${mm}/${filename}`;
}

/** Trash buffer duration in milliseconds (30 days) */
export const TRASH_TTL_MS = 30 * 24 * 60 * 60 * 1000;
