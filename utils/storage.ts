import AsyncStorage from '@react-native-async-storage/async-storage';
import { AccidentEvent, EmergencyContact } from '../constants/types';

const CONTACTS_KEY = 'emergency_contacts';
const EVENTS_KEY = 'accident_events';

export const saveContacts = async (contacts: EmergencyContact[]) => {
    await AsyncStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
};

export const getContacts = async (): Promise<EmergencyContact[]> => {
    const data = await AsyncStorage.getItem(CONTACTS_KEY);
    return data ? JSON.parse(data) : [];
};

export const saveEvent = async (event: AccidentEvent) => {
    const existing = await getEvents();
    existing.unshift(event);
    const trimmed = existing.slice(0, 20); // keep last 20
    await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(trimmed));
};

export const getEvents = async (): Promise<AccidentEvent[]> => {
    const data = await AsyncStorage.getItem(EVENTS_KEY);
    return data ? JSON.parse(data) : [];
};