# SafeRide 🏍️

A smartphone-based accident detection and emergency response system.

## How it works
Detect → Confirm → Alert

- Monitors speed and accelerometer in real-time
- Triggers only when 3+ signals fire together (speed drop, impact spike, orientation change)
- Shows 90-second confirmation screen before alerting
- Sends SMS with Google Maps location to emergency contacts
- Works without internet via SMS fallback

## Built with
- React Native (Expo)
- TypeScript
- expo-location, expo-sensors
- AsyncStorage
- expo-sms

## Status
v1 complete — tested on iOS. v2 in progress.
