import * as SMS from 'expo-sms';
import { EmergencyContact } from '../constants/types';

export const sendEmergencySMS = async (
    contacts: EmergencyContact[],
    latitude: number,
    longitude: number,
    userName: string
) => {
    const isAvailable = await SMS.isAvailableAsync();
    if (!isAvailable) return false;

    const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
    const time = new Date().toLocaleTimeString();
    const message = `Emergency Alert: Possible accident detected for ${userName}. Location: ${mapsLink} Time: ${time}`;

    const numbers = contacts.map(c => c.phone);

    await SMS.sendSMSAsync(numbers, message);
    return true;
};