import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AccidentEvent } from '../../constants/types';
import { getEvents } from '../../utils/storage';

export default function LogsScreen() {
    const router = useRouter();
    const [events, setEvents] = useState<AccidentEvent[]>([]);

    useEffect(() => {
        getEvents().then(setEvents);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={styles.back}>
                <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Incident Logs</Text>

            {events.length === 0 ? (
                <Text style={styles.empty}>No incidents recorded yet.</Text>
            ) : (
                <FlatList
                    data={events}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.time}>{new Date(item.timestamp).toLocaleString()}</Text>
                            <Text style={styles.detail}>📍 {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}</Text>
                            <Text style={styles.detail}>Confidence: {item.confidence}%</Text>
                            <Text style={[styles.badge, item.alertSent ? styles.sent : styles.cancelled]}>
                                {item.alertSent ? '🚨 Alert Sent' : '✅ Cancelled'}
                            </Text>
                        </View>
                    )}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0f0f0f', padding: 20 },
    back: { marginBottom: 10 },
    backText: { color: '#00e676', fontSize: 16 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
    empty: { color: '#aaa', fontSize: 16, textAlign: 'center', marginTop: 40 },
    card: { backgroundColor: '#1e1e1e', padding: 16, borderRadius: 10, marginBottom: 12 },
    time: { color: '#fff', fontSize: 15, marginBottom: 6 },
    detail: { color: '#aaa', fontSize: 14 },
    badge: { marginTop: 8, fontSize: 13, fontWeight: 'bold' },
    sent: { color: '#ff5252' },
    cancelled: { color: '#00e676' },
});