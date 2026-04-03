import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Bucket } from '@/types/media';
import { BUCKET_LABELS, BUCKET_COLORS } from '@/constants/buckets';

interface Action {
  bucket: Bucket | 'skip';
  label: string;
  color: string;
  short: string;
}

const ACTIONS: Action[] = [
  { bucket: 'safe', label: BUCKET_LABELS.safe, color: BUCKET_COLORS.safe, short: '→' },
  { bucket: 'suggestive_but_safe', label: BUCKET_LABELS.suggestive_but_safe, color: BUCKET_COLORS.suggestive_but_safe, short: '↑' },
  { bucket: 'explicit', label: BUCKET_LABELS.explicit, color: BUCKET_COLORS.explicit, short: '←' },
  { bucket: 'skip', label: 'Skip', color: '#6b7280', short: '↓' },
];

interface Props {
  onAssign: (bucket: Bucket) => void;
  onSkip: () => void;
}

export function BucketActions({ onAssign, onSkip }: Props) {
  return (
    <View style={styles.row}>
      {ACTIONS.map((action) => (
        <TouchableOpacity
          key={action.bucket}
          style={[styles.button, { borderColor: action.color }]}
          activeOpacity={0.75}
          onPress={() => {
            if (action.bucket === 'skip') {
              onSkip();
            } else {
              onAssign(action.bucket);
            }
          }}>
          <Text style={[styles.arrow, { color: action.color }]}>{action.short}</Text>
          <Text style={[styles.label, { color: action.color }]}>{action.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: 2,
  },
  arrow: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
});
