import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native'; // Tambahkan Alert
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { dummyUsers } from '../api/dummyUsers';
import { Modal } from 'react-native';
import { useState } from 'react';

export default function ProfileScreen() {
    const navigation = useNavigation();

    const [modalVisible, setModalVisible] = useState(false);

    const user = dummyUsers[3];

    const router = useRouter();

    const handleLogout = () => {
    Alert.alert(
        "Konfirmasi Logout",
        "Apakah Anda yakin ingin logout?",
        [
        { text: "Batal", style: "cancel" },
        {
            text: "Logout",
            style: "destructive",
            onPress: () => router.replace('/LoginScreen'), 
        }
        ]
    );
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <View style={styles.topShape}>
                <TouchableOpacity  style={styles.backButton} onPress={() => router.push('/Homepage')}>
                    <AntDesign name="arrowleft" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <View style={styles.topShape}>
                <Text style={styles.profileText}>Profile</Text>
            </View>

            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Image source={require('@/assets/images/IMG_1259.jpg')} style={styles.profileImage} />
            </TouchableOpacity>


            <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
            <AntDesign name="user" size={20} color="#333" />
            <Text style={styles.infoText}>{user.name}</Text>
            </View>
            <View style={styles.infoItem}>
            <FontAwesome name="at" size={20} color="#333" />
            <Text style={styles.infoText}>{user.email}</Text>
            </View>
            <View style={styles.infoItem}>
            <FontAwesome name="phone" size={20} color="#333" />
            <Text style={styles.infoText}>{user.phone}</Text>
            </View>

            <View style={styles.infoItem}>
            <FontAwesome name="history" size={20} color="#333" />
            <TouchableOpacity onPress={() => router.push('/HistoryLaporan')}>
                <Text style={styles.infoText}>Lihat Riwayat Laporan</Text>
            </TouchableOpacity>
            </View>

                
                {/* Tombol Logout dengan konfirmasi */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <FontAwesome name="sign-out" size={20} color="red" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>

            <Modal visible={modalVisible} transparent={true} animationType="fade">
            <View style={styles.modalBackground}>
                <TouchableOpacity style={styles.modalContainer} onPress={() => setModalVisible(false)}>
                <Image
                    source={require('@/assets/images/IMG_1259.jpg')}
                    style={styles.fullImage}
                    resizeMode="contain"
                />
                </TouchableOpacity>
            </View>
            </Modal>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFF1E1',
    },
    topShape: {
        position: 'absolute',
        width: '100%',
        height: '30%',
        backgroundColor: '#D2601A',
        borderBottomLeftRadius: 100,
        borderBottomRightRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        top: 0,
    },
    profileText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 50,
    },
    profileContainer: {
        marginTop: '35%', 
        alignItems: 'center',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 55,
        backgroundColor: 'white',
    },
    infoContainer: {
        width: '90%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
        marginTop: 20,
        elevation: 5,
    },
    backButton: {
        position: 'absolute',
        left: 20,
        top: 40,
        zIndex: 1,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    infoText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 10,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        marginTop: 10,
    },
    logoutText: {
        fontSize: 16,
        color: 'red',
        marginLeft: 10,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullImage: {
        width: '90%',
        height: '80%',
        borderRadius: 12,
    },

});
