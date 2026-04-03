import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Bucket } from '@/types/media';
import { ALL_BUCKETS, BUCKET_LABELS, BUCKET_COLORS } from '@/constants/buckets';

export type FilterValue = Bucket | 'all';

interface Props {
  active: FilterValue;
  onChange: (value: FilterValue) => void;
  counts: Partial<Record<FilterValue, number>>;
}

export function BucketFilter({ active, onChange, counts }: Props) {
  const filters: { value: FilterValue; label: string; color: string }[] = [
    { value: 'all', label: 'All', color: '#3b82f6' },
    ...ALL_BUCKETS.map((b) => ({
      value: b as FilterValue,
      label: BUCKET_LABELS[b],
      color: BUCKET_COLORS[b],
    })),
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {filters.map(({ value, label, color }) => {
        const isActive = active === value;
        const count = counts[value];
        return (
          <TouchableOpacity
            key={value}
            onPress={() => onChange(value)}
            style={[styles.chip, { borderColor: color }, isActive && { backgroundColor: color }]}>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {label}{count !== undefined ? ` ${count}` : ''}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 12, paddingVertical: 8, gap: 8, flexDirection: 'row' },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  label: { fontSize: 13, fontWeight: '500', color: '#374151' },
  labelActive: { color: '#fff' },
});
