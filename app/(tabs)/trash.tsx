import { View, Text, StyleSheet } from 'react-native';

export default function TrashScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trash</Text>
      <Text style={styles.sub}>Soft-deleted items (30-day recovery) will appear here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 8 },
  sub: { fontSize: 14, color: '#6b7280' },
});
