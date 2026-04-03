import { FlatList, ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { useMemo } from 'react';
import { MediaAsset } from '@/types/media';
import { GalleryItem, ITEM_SIZE, NUM_COLUMNS, ITEM_MARGIN } from '@/components/gallery/GalleryItem';
import { FilterValue } from '@/components/gallery/BucketFilter';

interface Props {
  assets: MediaAsset[];
  loading: boolean;
  hasMore: boolean;
  activeFilter: FilterValue;
  onLoadMore: () => void;
  onRefresh: () => void;
  onPressItem?: (asset: MediaAsset) => void;
}

export function GalleryGrid({
  assets,
  loading,
  hasMore,
  activeFilter,
  onLoadMore,
  onRefresh,
  onPressItem,
}: Props) {
  const filtered = useMemo(() => {
    if (activeFilter === 'all') return assets;
    return assets.filter((a) => a.bucket === activeFilter);
  }, [assets, activeFilter]);

  const footer = loading ? (
    <View style={styles.footer}>
      <ActivityIndicator />
    </View>
  ) : !hasMore && filtered.length === 0 ? (
    <View style={styles.footer}>
      <Text style={styles.emptyText}>No items in this bucket yet.</Text>
    </View>
  ) : null;

  return (
    <FlatList
      data={filtered}
      keyExtractor={(item) => item.id}
      numColumns={NUM_COLUMNS}
      renderItem={({ item }) => <GalleryItem asset={item} onPress={onPressItem} />}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.4}
      onRefresh={onRefresh}
      refreshing={loading && filtered.length === 0}
      ListFooterComponent={footer}
      contentContainerStyle={styles.content}
      style={styles.list}
    />
  );
}

// Re-export for consumers that want the layout constants
export { ITEM_SIZE, NUM_COLUMNS, ITEM_MARGIN };

const styles = StyleSheet.create({
  list: { flex: 1 },
  content: { padding: ITEM_MARGIN },
  footer: { alignItems: 'center', padding: 16 },
  emptyText: { color: '#6b7280', fontSize: 14 },
});
