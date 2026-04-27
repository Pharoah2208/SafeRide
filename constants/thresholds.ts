export const THRESHOLDS = {
    MIN_SPEED_KMH: 20,          // Start monitoring above this speed
    CRASH_SPEED_FROM: 40,       // Speed before crash (km/h)
    CRASH_SPEED_TO: 10,         // Speed after crash (km/h)
    IMPACT_FORCE: 25,           // Accelerometer spike (m/s²)
    ORIENTATION_CHANGE: 45,     // Degrees of tilt
    INACTIVITY_SECONDS: 15,     // No movement after impact
    DETECTION_WINDOW_MS: 3000,  // All signals must fire within 3 seconds
    CONFIRMATION_SECONDS: 90,   // Countdown before alert fires
    CONFIDENCE_THRESHOLD: 75,   // Minimum score to trigger
};

export const WEIGHTS = {
    speedDrop: 30,
    impactSpike: 40,
    orientationChange: 20,
    inactivity: 10,
};