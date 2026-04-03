import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import { usePermission } from '@/hooks/usePermission';
import { useMediaLibrary } from '@/hooks/useMediaLibrary';
import { useReviewQueue } from '@/hooks/useReviewQueue';
import PermissionGate from '@/app/permission';
import { SwipeCard } from '@/components/review/SwipeCard';
import { BucketActions } from '@/components/review/BucketActions';
import { Bucket } from '@/types/media';

export default function ReviewScreen() {
  const insets = useSafeAreaInsets();
  const { status, requestPermission } = usePermission();
  // Seed AsyncStorage from the device library so the queue has assets.
  const { fetchPage } = useMediaLibrary(status);
  const { queue, loading, assignBucket, skip } = useReviewQueue();

  useEffect(() => {
    if (status === 'granted' || status === 'limited') {
      fetchPage(undefined);
    }
  }, [status]);

  if (status === 'loading') return null;

  if (status === 'undetermined' || status === 'denied') {
    return <PermissionGate status={status} onRequest={requestPermission} />;
  }

  const current = queue[0] ?? null;
  const remaining = queue.length;

  function handleAssign(bucket: Bucket) {
    if (!current) return;
    assignBucket(current.id, bucket);
  }

  function handleSkip() {
    if (!current) return;
    skip(current.id);
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Review</Text>
          {!loading && (
            <Text style={styles.count}>
              {remaining > 0 ? `${remaining} to review` : 'All done'}
            </Text>
          )}
        </View>

        {/* Card stack area */}
        <View style={styles.cardArea}>
          {loading ? (
            <ActivityIndicator size="large" color="#6b7280" />
          ) : current ? (
            <>
              {/* Stacked peek cards behind the active card */}
              {queue[2] && <View style={[styles.peekCard, styles.peekBack]} />}
              {queue[1] && <View style={[styles.peekCard, styles.peekMid]} />}
              <SwipeCard
                key={current.id}
                asset={current}
                onAssign={handleAssign}
                onSkip={handleSkip}
              />
            </>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>✓</Text>
              <Text style={styles.emptyTitle}>All caught up</Text>
              <Text style={styles.emptyBody}>
                No uncertain items left. New media will appear here after the Library tab loads.
              </Text>
            </View>
          )}
        </View>

        {/* Swipe hint + action buttons */}
        {current && !loading && (
          <>
            <Text style={styles.swipeHint}>← Explicit  ↑ Suggestive  Safe →  ↓ Skip</Text>
            <BucketActions onAssign={handleAssign} onSkip={handleSkip} />
          </>
        )}

        <View style={{ height: insets.bottom }} />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  title: { fontSize: 22, fontWeight: '700', color: '#111827' },
  count: { fontSize: 13, color: '#6b7280' },
  cardArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  peekCard: {
    position: 'absolute',
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
  },
  peekBack: {
    width: '82%',
    aspectRatio: 1 / 1.35,
    bottom: -16,
    transform: [{ rotate: '-3deg' }],
  },
  peekMid: {
    width: '87%',
    aspectRatio: 1 / 1.35,
    bottom: -8,
    transform: [{ rotate: '1.5deg' }],
  },
  swipeHint: {
    textAlign: 'center',
    fontSize: 11,
    color: '#9ca3af',
    letterSpacing: 0.3,
    paddingBottom: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: '#111827', marginBottom: 8 },
  emptyBody: { fontSize: 14, color: '#6b7280', textAlign: 'center', lineHeight: 20 },
});
