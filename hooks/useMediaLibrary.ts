import { useState, useCallback, useRef } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { MediaAsset } from '@/types/media';
import { normalizeAsset } from '@/lib/assetNormalizer';
import { getAsset, setAsset } from '@/lib/storage';
import { PermissionStatus } from '@/hooks/usePermission';

const PAGE_SIZE = 50;

export function useMediaLibrary(permissionStatus: PermissionStatus) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const cursorRef = useRef<string | undefined>(undefined);
  const loadingRef = useRef(false);

  const fetchPage = useCallback(
    async (after?: string) => {
      if (loadingRef.current) return;
      if (!['granted', 'limited'].includes(permissionStatus)) return;

      loadingRef.current = true;
      setLoading(true);

      try {
        const result = await MediaLibrary.getAssetsAsync({
          first: PAGE_SIZE,
          after,
          mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
          sortBy: [[MediaLibrary.SortBy.creationTime, false]],
        });

        const merged: MediaAsset[] = [];
        for (const raw of result.assets) {
          const existing = await getAsset(raw.id);
          if (existing) {
            merged.push(existing);
          } else {
            const normalized = normalizeAsset(raw);
            await setAsset(normalized);
            merged.push(normalized);
          }
        }

        cursorRef.current = result.endCursor;
        setHasMore(result.hasNextPage);
        setAssets((prev) => (after ? [...prev, ...merged] : merged));
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [permissionStatus]
  );

  const loadMore = useCallback(() => {
    if (hasMore && !loadingRef.current) {
      fetchPage(cursorRef.current);
    }
  }, [hasMore, fetchPage]);

  const refresh = useCallback(() => {
    cursorRef.current = undefined;
    setAssets([]);
    setHasMore(true);
    fetchPage(undefined);
  }, [fetchPage]);

  return { assets, loading, hasMore, loadMore, refresh, fetchPage };
}
