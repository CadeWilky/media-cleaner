import { View, Text, StyleSheet, TouchableOpacity, Linking, SafeAreaView } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PermissionStatus } from '@/hooks/usePermission';

interface Props {
  status: PermissionStatus;
  onRequest: () => void;
}

export default function PermissionGate({ status, onRequest }: Props) {
  const isDenied = status === 'denied';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.iconWrapper}>
          <IconSymbol name="photo.on.rectangle" size={64} color="#3b82f6" />
        </View>
        <Text style={styles.title}>Your photos, your control</Text>
        <Text style={styles.body}>
          Media Cleaner reads your photo library so you can review each item, keep what you want, and
          upload others to Dropbox. Nothing leaves your phone without your approval.
        </Text>
        {isDenied ? (
          <>
            <Text style={styles.deniedNote}>
              Access was denied. Open Settings to allow access to your photo library.
            </Text>
            <TouchableOpacity style={styles.button} onPress={() => Linking.openSettings()}>
              <Text style={styles.buttonText}>Open Settings</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.button} onPress={onRequest}>
            <Text style={styles.buttonText}>Allow Access</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  iconWrapper: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 12 },
  body: { fontSize: 15, color: '#374151', textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  deniedNote: { fontSize: 13, color: '#ef4444', textAlign: 'center', marginBottom: 16 },
  button: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
