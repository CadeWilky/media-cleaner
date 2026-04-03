import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolation,
  clamp,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { MediaAsset, Bucket } from '@/types/media';
import { BUCKET_COLORS } from '@/constants/buckets';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32;
const CARD_HEIGHT = CARD_WIDTH * 1.35;
const SWIPE_THRESHOLD = 90;
const VERTICAL_THRESHOLD = 80;

function directionToBucket(dx: number, dy: number): Bucket | 'skip' {
  const absX = Math.abs(dx);
  const absY = Math.abs(dy);
  if (absY > VERTICAL_THRESHOLD && absY > absX) {
    return dy < 0 ? 'suggestive_but_safe' : 'skip';
  }
  if (absX > SWIPE_THRESHOLD) {
    return dx > 0 ? 'safe' : 'explicit';
  }
  return 'skip';
}

interface Props {
  asset: MediaAsset;
  onAssign: (bucket: Bucket) => void;
  onSkip: () => void;
}

export function SwipeCard({ asset, onAssign, onSkip }: Props) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  function handleSettled(dx: number, dy: number) {
    const action = directionToBucket(dx, dy);
    if (action === 'skip') {
      onSkip();
    } else {
      onAssign(action);
    }
  }

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    })
    .onEnd((e) => {
      const action = directionToBucket(e.translationX, e.translationY);
      if (action === 'safe') {
        translateX.value = withSpring(SCREEN_WIDTH * 1.5, { damping: 14 });
      } else if (action === 'explicit') {
        translateX.value = withSpring(-SCREEN_WIDTH * 1.5, { damping: 14 });
      } else if (action === 'suggestive_but_safe') {
        translateY.value = withSpring(-SCREEN_WIDTH * 1.5, { damping: 14 });
      } else {
        // skip — snap back
        translateX.value = withSpring(0, { damping: 18 });
        translateY.value = withSpring(0, { damping: 18 });
      }
      runOnJS(handleSettled)(e.translationX, e.translationY);
    });

  const cardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-12, 0, 12],
      Extrapolation.CLAMP
    );
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  // Per-direction hint opacities
  const safeOpacity = useAnimatedStyle(() => ({
    opacity: clamp(translateX.value / SWIPE_THRESHOLD, 0, 1),
  }));
  const explicitOpacity = useAnimatedStyle(() => ({
    opacity: clamp(-translateX.value / SWIPE_THRESHOLD, 0, 1),
  }));
  const suggestiveOpacity = useAnimatedStyle(() => ({
    opacity: clamp(
      Math.abs(translateY.value) > Math.abs(translateX.value)
        ? -translateY.value / VERTICAL_THRESHOLD
        : 0,
      0,
      1
    ),
  }));

  const dateLabel = new Date(asset.creationTime).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.card, cardStyle]}>
        <Image
          source={{ uri: asset.uri }}
          style={styles.image}
          contentFit="cover"
          recyclingKey={asset.id}
        />

        {/* Direction hint badges */}
        <Animated.View style={[styles.hintBadge, styles.hintRight, safeOpacity, { borderColor: BUCKET_COLORS.safe }]}>
          <Text style={[styles.hintText, { color: BUCKET_COLORS.safe }]}>SAFE</Text>
        </Animated.View>
        <Animated.View style={[styles.hintBadge, styles.hintLeft, explicitOpacity, { borderColor: BUCKET_COLORS.explicit }]}>
          <Text style={[styles.hintText, { color: BUCKET_COLORS.explicit }]}>EXPLICIT</Text>
        </Animated.View>
        <Animated.View style={[styles.hintBadge, styles.hintTop, suggestiveOpacity, { borderColor: BUCKET_COLORS.suggestive_but_safe }]}>
          <Text style={[styles.hintText, { color: BUCKET_COLORS.suggestive_but_safe }]}>SUGGESTIVE</Text>
        </Animated.View>

        {/* Metadata strip */}
        <View style={styles.meta}>
          <Text style={styles.filename} numberOfLines={1}>{asset.filename}</Text>
          <Text style={styles.date}>{dateLabel}</Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1f2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  hintBadge: {
    position: 'absolute',
    borderWidth: 3,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.88)',
  },
  hintRight: { top: 24, left: 20 },
  hintLeft: { top: 24, right: 20 },
  hintTop: { top: 24, alignSelf: 'center', left: CARD_WIDTH / 2 - 70 },
  hintText: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 2,
  },
  meta: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  filename: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  date: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    marginTop: 2,
  },
});
