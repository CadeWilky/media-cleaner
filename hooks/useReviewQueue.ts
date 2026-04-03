import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { MediaAsset, Bucket } from '@/types/media';
import { getAllAssets, updateAsset } from '@/lib/storage';

export function useReviewQueue() {
  const [queue, setQueue] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const all = await getAllAssets();
      const uncertain = all.filter(
        (a) => a.bucket === 'uncertain' && a.trashStatus === 'active'
      );
      setQueue(uncertain);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const assignBucket = useCallback(async (id: string, bucket: Bucket) => {
    await updateAsset(id, { bucket, reviewedAt: Date.now() });
    setQueue((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const skip = useCallback((id: string) => {
    setQueue((prev) => {
      const idx = prev.findIndex((a) => a.id === id);
      if (idx === -1) return prev;
      const next = [...prev];
      const [item] = next.splice(idx, 1);
      next.push(item);
      return next;
    });
  }, []);

  return { queue, loading, assignBucket, skip, reload: load };
}
