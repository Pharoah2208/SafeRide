import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native';
import { THRESHOLDS } from '../constants/thresholds';
import { sendEmergencySMS } from '../utils/sms';
import { getContacts, saveEvent } from '../utils/storage';

export default function ConfirmationScreen() {
    const router = useRouter();
    const [countdown, setCountdown] = useState(THRESHOLDS.CONFIRMATION_SECONDS);
    const [alertSent, setAlertSent] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        Vibration.vibrate([500, 500, 500, 500, 500], true);

        timerRef.current = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    fireAlert();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(timerRef.current!);
            Vibration.cancel();
        };
    }, []);

    const fireAlert = async () => {
        if (alertSent) return;
        setAlertSent(true);
        Vibration.cancel();

        const loc = await Location.getCurrentPositionAsync({});
        const contacts = await getContacts();

        if (contacts.length === 0) {
            Alert.alert('No contacts', 'Please add emergency contacts first.');
            router.replace('/(tabs)');
            return;
        }

        await sendEmergencySMS(contacts, loc.coords.latitude, loc.coords.longitude, 'Rider');

        await saveEvent({
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            confidence: 80,
            alertSent: true,
        });

        Alert.alert('Alert Sent', 'Emergency contacts have been notified.');
        router.replace('/(tabs)');
    };

    const handleImOk = () => {
        clearInterval(timerRef.current!);
        Vibration.cancel();
        router.replace('/(tabs)');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.warning}>⚠️ ACCIDENT DETECTED</Text>
            <Text style={styles.question}>Are you okay?</Text>
            <Text style={styles.countdown}>{countdown}s</Text>
            <Text style={styles.sub}>Alert will fire automatically if no response</Text>

            <TouchableOpacity style={styles.okButton} onPress={handleImOk}>
                <Text style={styles.okText}>✅ I'm OK</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.alertNow} onPress={fireAlert}>
                <Text style={styles.alertNowText}>🚨 Send Alert Now</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#c62828', alignItems: 'center', justifyContent: 'center', padding: 24 },
    warning: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
    question: { fontSize: 24, color: '#fff', marginBottom: 20 },
    countdown: { fontSize: 80, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
    sub: { fontSize: 14, color: '#ffcdd2', marginBottom: 50, textAlign: 'center' },
    okButton: { backgroundColor: '#fff', paddingHorizontal: 48, paddingVertical: 18, borderRadius: 14, marginBottom: 20 },
    okText: { fontSize: 22, fontWeight: 'bold', color: '#c62828' },
    alertNow: { borderWidth: 2, borderColor: '#fff', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 14 },
    alertNowText: { fontSize: 16, color: '#fff' },
});