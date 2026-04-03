import { View, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { usePermission } from '@/hooks/usePermission';
import { useMediaLibrary } from '@/hooks/useMediaLibrary';
import PermissionGate from '@/app/permission';
import { BucketFilter, FilterValue } from '@/components/gallery/BucketFilter';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import { ALL_BUCKETS } from '@/constants/buckets';
import { Bucket } from '@/types/media';

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const { status, requestPermission } = usePermission();
  const { assets, loading, hasMore, loadMore, refresh, fetchPage } = useMediaLibrary(status);
  const [filter, setFilter] = useState<FilterValue>('all');

  // Load first page when permission is granted
  useEffect(() => {
    if (status === 'granted' || status === 'limited') {
      fetchPage(undefined);
    }
  }, [status]);

  // Compute counts per bucket for the filter bar
  const counts: Partial<Record<FilterValue, number>> = { all: assets.length };
  for (const bucket of ALL_BUCKETS) {
    counts[bucket as Bucket] = assets.filter((a) => a.bucket === bucket).length;
  }

  if (status === 'loading') {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (status === 'undetermined' || status === 'denied') {
    return <PermissionGate status={status} onRequest={requestPermission} />;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {status === 'limited' && (
        <View style={styles.limitedBanner}>
          <Text style={styles.limitedText}>
            Limited access — only selected photos are shown. Go to Settings to expand access.
          </Text>
        </View>
      )}
      <BucketFilter active={filter} onChange={setFilter} counts={counts} />
      <GalleryGrid
        assets={assets}
        loading={loading}
        hasMore={hasMore}
        activeFilter={filter}
        onLoadMore={loadMore}
        onRefresh={refresh}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: '#6b7280' },
  limitedBanner: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  limitedText: { fontSize: 12, color: '#92400e' },
});
