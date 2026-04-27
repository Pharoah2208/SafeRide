import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text, TouchableOpacity,
  View
} from 'react-native';
import { useDetectionEngine } from '../../hooks/useDetectionEngine';

export default function HomeScreen() {
  const router = useRouter();

  const handleAccident = useCallback(async () => {
    router.push('/confirmation');
  }, [router]);

  const { isMonitoring, currentSpeed, startMonitoring, stopMonitoring } =
    useDetectionEngine(handleAccident);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>SafeRide</Text>

      <View style={styles.speedBox}>
        <Text style={styles.speedText}>{Math.round(currentSpeed)}</Text>
        <Text style={styles.speedUnit}>km/h</Text>
      </View>

      <View style={[styles.statusBadge, isMonitoring ? styles.active : styles.inactive]}>
        <Text style={styles.statusText}>
          {isMonitoring ? '🟢 Monitoring Active' : '🔴 Monitoring Off'}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, isMonitoring ? styles.stopBtn : styles.startBtn]}
        onPress={isMonitoring ? stopMonitoring : startMonitoring}
      >
        <Text style={styles.buttonText}>
          {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
        </Text>
      </TouchableOpacity>

      <View style={styles.navRow}>
        <TouchableOpacity style={styles.navBtn} onPress={() => router.push('/(tabs)/contacts')}>
          <Text style={styles.navText}>👥 Contacts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={() => router.push('/(tabs)/logs')}>
          <Text style={styles.navText}>📋 Logs</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 40 },
  speedBox: { alignItems: 'center', marginBottom: 30 },
  speedText: { fontSize: 80, fontWeight: 'bold', color: '#00e676' },
  speedUnit: { fontSize: 20, color: '#aaa' },
  statusBadge: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, marginBottom: 40 },
  active: { backgroundColor: '#1a3a1a' },
  inactive: { backgroundColor: '#3a1a1a' },
  statusText: { color: '#fff', fontSize: 16 },
  button: { width: 220, paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 40 },
  startBtn: { backgroundColor: '#00e676' },
  stopBtn: { backgroundColor: '#ff5252' },
  buttonText: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  navRow: { flexDirection: 'row', gap: 16 },
  navBtn: { backgroundColor: '#1e1e1e', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
  navText: { color: '#fff', fontSize: 15 },
});