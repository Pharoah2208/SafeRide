import * as Location from 'expo-location';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import { useCallback, useEffect, useRef, useState } from 'react';
import { THRESHOLDS, WEIGHTS } from '../constants/thresholds';
import { DetectionSignals } from '../constants/types';

export const useDetectionEngine = (onAccidentDetected: () => void) => {
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [currentSpeed, setCurrentSpeed] = useState(0);

    const signals = useRef<DetectionSignals>({
        speedDrop: false,
        impactSpike: false,
        orientationChange: false,
        inactivity: false,
        timestamp: 0,
    });

    const lastSpeed = useRef(0);
    const lastMovement = useRef(Date.now());
    const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const locationSub = useRef<any>(null);
    const accelSub = useRef<any>(null);
    const gyroSub = useRef<any>(null);

    const checkConfidence = useCallback(() => {
        const s = signals.current;
        const now = Date.now();

        if (now - s.timestamp > THRESHOLDS.DETECTION_WINDOW_MS) {
            signals.current = {
                speedDrop: false,
                impactSpike: false,
                orientationChange: false,
                inactivity: false,
                timestamp: now,
            };
            return;
        }

        let score = 0;
        if (s.speedDrop) score += WEIGHTS.speedDrop;
        if (s.impactSpike) score += WEIGHTS.impactSpike;
        if (s.orientationChange) score += WEIGHTS.orientationChange;
        if (s.inactivity) score += WEIGHTS.inactivity;

        if (score >= THRESHOLDS.CONFIDENCE_THRESHOLD) {
            onAccidentDetected();
        }
    }, [onAccidentDetected]);

    const startMonitoring = useCallback(async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            alert('Location permission is required for accident detection.');
            return;
        }

        locationSub.current = await Location.watchPositionAsync(
            { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 1 },
            (loc) => {
                const speedKmh = (loc.coords.speed ?? 0) * 3.6;
                setCurrentSpeed(speedKmh);

                if (speedKmh > 5) lastMovement.current = Date.now();

                if (
                    lastSpeed.current >= THRESHOLDS.CRASH_SPEED_FROM &&
                    speedKmh <= THRESHOLDS.CRASH_SPEED_TO
                ) {
                    signals.current.speedDrop = true;
                    signals.current.timestamp = Date.now();
                    checkConfidence();
                }
                lastSpeed.current = speedKmh;
            }
        );

        Accelerometer.setUpdateInterval(50);
        accelSub.current = Accelerometer.addListener(({ x, y, z }) => {
            const force = Math.sqrt(x * x + y * y + z * z);
            if (force > THRESHOLDS.IMPACT_FORCE) {
                signals.current.impactSpike = true;
                signals.current.timestamp = Date.now();

                if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
                inactivityTimer.current = setTimeout(() => {
                    const timeSinceMove = Date.now() - lastMovement.current;
                    if (timeSinceMove > THRESHOLDS.INACTIVITY_SECONDS * 1000) {
                        signals.current.inactivity = true;
                        checkConfidence();
                    }
                }, THRESHOLDS.INACTIVITY_SECONDS * 1000);

                checkConfidence();
            }
        });

        Gyroscope.setUpdateInterval(50);
        gyroSub.current = Gyroscope.addListener(({ x, y, z }) => {
            const rotation = Math.sqrt(x * x + y * y + z * z);
            if (rotation > THRESHOLDS.ORIENTATION_CHANGE * (Math.PI / 180)) {
                signals.current.orientationChange = true;
                signals.current.timestamp = Date.now();
                checkConfidence();
            }
        });

        setIsMonitoring(true);
    }, [checkConfidence]);

    const stopMonitoring = useCallback(() => {
        locationSub.current?.remove();
        accelSub.current?.remove();
        gyroSub.current?.remove();
        if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
        setIsMonitoring(false);
    }, []);

    useEffect(() => {
        return () => stopMonitoring();
    }, [stopMonitoring]);

    return { isMonitoring, currentSpeed, startMonitoring, stopMonitoring };
};