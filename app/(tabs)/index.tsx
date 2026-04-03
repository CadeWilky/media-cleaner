import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { usePermission } from '@/hooks/usePermission';
import { useMediaLibrary } from '@/hooks/useMediaLibrary';
import PermissionGate from '@/app/permission';

export default function ReviewScreen() {
  const insets = useSafeAreaInsets();
  const { status, requestPermission } = usePermission();
  const { assets, fetchPage } = useMediaLibrary(status);

  useEffect(() => {
    if (status === 'granted' || status === 'limited') {
      fetchPage(undefined);
    }
  }, [status]);

  if (status === 'loading') return null;

  if (status === 'undetermined' || status === 'denied') {
    return <PermissionGate status={status} onRequest={requestPermission} />;
  }

  const unreviewed = assets.filter((a) => a.bucket === 'uncertain').length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>Review</Text>
      <Text style={styles.sub}>
        {unreviewed > 0
          ? `${unreviewed} item${unreviewed === 1 ? '' : 's'} waiting for review.`
          : 'All items reviewed.'}
      </Text>
      <Text style={styles.hint}>Swipe cards coming in Phase 2.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 8 },
  sub: { fontSize: 15, color: '#374151', marginBottom: 4 },
  hint: { fontSize: 13, color: '#9ca3af' },
});
