import { useState, useEffect, useCallback } from 'react';
import * as MediaLibrary from 'expo-media-library';

export type PermissionStatus = 'loading' | 'granted' | 'limited' | 'denied' | 'undetermined';

export function usePermission() {
  const [status, setStatus] = useState<PermissionStatus>('loading');

  useEffect(() => {
    MediaLibrary.getPermissionsAsync().then((result) => {
      mapAndSet(result);
    });
  }, []);

  function mapAndSet(result: MediaLibrary.PermissionResponse) {
    if (result.status === 'granted') {
      setStatus(result.accessPrivileges === 'limited' ? 'limited' : 'granted');
    } else if (result.status === 'denied') {
      setStatus('denied');
    } else {
      setStatus('undetermined');
    }
  }

  const requestPermission = useCallback(async () => {
    const result = await MediaLibrary.requestPermissionsAsync();
    mapAndSet(result);
  }, []);

  return { status, requestPermission };
}
