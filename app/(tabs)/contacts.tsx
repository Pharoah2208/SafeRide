import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text, TextInput, TouchableOpacity,
    View
} from 'react-native';
import { EmergencyContact } from '../../constants/types';
import { getContacts, saveContacts } from '../../utils/storage';

export default function ContactsScreen() {
    const router = useRouter();
    const [contacts, setContacts] = useState<EmergencyContact[]>([]);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        getContacts().then(setContacts);
    }, []);

    const addContact = async () => {
        if (!name || !phone) return Alert.alert('Fill both fields');
        const newContact: EmergencyContact = { id: Date.now().toString(), name, phone };
        const updated = [...contacts, newContact];
        setContacts(updated);
        await saveContacts(updated);
        setName('');
        setPhone('');
    };

    const removeContact = async (id: string) => {
        const updated = contacts.filter(c => c.id !== id);
        setContacts(updated);
        await saveContacts(updated);
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={styles.back}>
                <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Emergency Contacts</Text>

            <TextInput style={styles.input} placeholder="Name" placeholderTextColor="#aaa"
                value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Phone (+91...)" placeholderTextColor="#aaa"
                value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

            <TouchableOpacity style={styles.addBtn} onPress={addContact}>
                <Text style={styles.addText}>+ Add Contact</Text>
            </TouchableOpacity>

            <FlatList
                data={contacts}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.contactRow}>
                        <View>
                            <Text style={styles.contactName}>{item.name}</Text>
                            <Text style={styles.contactPhone}>{item.phone}</Text>
                        </View>
                        <TouchableOpacity onPress={() => removeContact(item.id)}>
                            <Text style={styles.remove}>✕</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0f0f0f', padding: 20 },
    back: { marginBottom: 10 },
    backText: { color: '#00e676', fontSize: 16 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
    input: { backgroundColor: '#1e1e1e', color: '#fff', padding: 14, borderRadius: 10, marginBottom: 12, fontSize: 16 },
    addBtn: { backgroundColor: '#00e676', padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
    addText: { fontWeight: 'bold', fontSize: 16, color: '#000' },
    contactRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e1e1e', padding: 14, borderRadius: 10, marginBottom: 10 },
    contactName: { color: '#fff', fontSize: 16 },
    contactPhone: { color: '#aaa', fontSize: 14 },
    remove: { color: '#ff5252', fontSize: 20 },
});