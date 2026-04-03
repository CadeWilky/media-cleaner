import AsyncStorage from '@react-native-async-storage/async-storage';
import { MediaAsset } from '@/types/media';

const ASSET_KEY_PREFIX = 'asset:';
const ASSET_INDEX_KEY = 'asset_index';

/** Load all persisted asset IDs */
async function getAssetIndex(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(ASSET_INDEX_KEY);
  return raw ? JSON.parse(raw) : [];
}

/** Save the full list of known asset IDs */
async function setAssetIndex(ids: string[]): Promise<void> {
  await AsyncStorage.setItem(ASSET_INDEX_KEY, JSON.stringify(ids));
}

/** Get a single asset record by ID. Returns null if not found. */
export async function getAsset(id: string): Promise<MediaAsset | null> {
  const raw = await AsyncStorage.getItem(ASSET_KEY_PREFIX + id);
  return raw ? (JSON.parse(raw) as MediaAsset) : null;
}

/** Persist a single asset record. Adds to index if new. */
export async function setAsset(asset: MediaAsset): Promise<void> {
  await AsyncStorage.setItem(ASSET_KEY_PREFIX + asset.id, JSON.stringify(asset));
  const index = await getAssetIndex();
  if (!index.includes(asset.id)) {
    index.push(asset.id);
    await setAssetIndex(index);
  }
}

/** Load all persisted asset records. */
export async function getAllAssets(): Promise<MediaAsset[]> {
  const index = await getAssetIndex();
  const results: MediaAsset[] = [];
  for (const id of index) {
    const asset = await getAsset(id);
    if (asset) results.push(asset);
  }
  return results;
}

/** Patch specific fields on an existing asset. No-op if asset not found. */
export async function updateAsset(
  id: string,
  patch: Partial<MediaAsset>
): Promise<void> {
  const existing = await getAsset(id);
  if (!existing) return;
  await setAsset({ ...existing, ...patch });
}

/** Remove a single asset record and its index entry. */
export async function deleteAssetRecord(id: string): Promise<void> {
  await AsyncStorage.removeItem(ASSET_KEY_PREFIX + id);
  const index = await getAssetIndex();
  await setAssetIndex(index.filter((i) => i !== id));
}

/** Clear all asset records and the index. Use with caution. */
export async function clearAllAssets(): Promise<void> {
  const index = await getAssetIndex();
  const keys = index.map((id) => ASSET_KEY_PREFIX + id);
  keys.push(ASSET_INDEX_KEY);
  await AsyncStorage.multiRemove(keys);
}
