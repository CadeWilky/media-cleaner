import { TouchableOpacity, View, Text, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { MediaAsset } from '@/types/media';
import { BUCKET_COLORS } from '@/constants/buckets';

const ITEM_MARGIN = 1;
const NUM_COLUMNS = 3;
const ITEM_SIZE = (Dimensions.get('window').width - ITEM_MARGIN * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

interface Props {
  asset: MediaAsset;
  onPress?: (asset: MediaAsset) => void;
}

export function GalleryItem({ asset, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={() => onPress?.(asset)}
      style={styles.container}
      activeOpacity={0.85}>
      <Image
        source={{ uri: asset.uri }}
        style={styles.image}
        contentFit="cover"
        recyclingKey={asset.id}
        transition={150}
      />
      {/* Bucket dot */}
      <View style={[styles.dot, { backgroundColor: BUCKET_COLORS[asset.bucket] }]} />
      {/* Video badge */}
      {asset.mediaType === 'video' && (
        <View style={styles.videoBadge}>
          <Text style={styles.videoText}>&#9654;</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export { ITEM_SIZE, NUM_COLUMNS, ITEM_MARGIN };

const styles = StyleSheet.create({
  container: { width: ITEM_SIZE, height: ITEM_SIZE, margin: ITEM_MARGIN },
  image: { width: '100%', height: '100%' },
  dot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  videoBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  videoText: { color: '#fff', fontSize: 10 },
});
