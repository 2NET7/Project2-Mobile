import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList // Using FlatList for efficient list rendering
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NotificationScreen() {
  const router = useRouter();

  // Dummy notification data for demonstration
  // In a real app, you would fetch these from a backend or local storage
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Peringatan Bencana',
      message: 'Potensi terjadi longsor di Kecamatan Cikole. Mohon waspada.',
      timestamp: '2025-06-03 09:30',
      read: false,
    },
    {
      id: '2',
      title: 'Info Gempa Bumi',
      message: 'Gempa magnitudo 5.2 terasa di wilayah Subang. Tidak berpotensi tsunami.',
      timestamp: '2025-06-02 18:00',
      read: false,
    },
    {
        id: '3',
        title: 'Laporan Anda Diterima',
        message: 'Laporan bencana Anda telah diterima dan sedang dalam peninjauan.',
        timestamp: '2025-06-01 14:15',
        read: true,
    },
    {
        id: '4',
        title: 'Kegiatan Siaga Bencana',
        message: 'Akan ada sosialisasi kesiapsiagaan bencana di balai desa minggu depan.',
        timestamp: '2025-05-30 08:00',
        read: false,
    },
  ]);

  // Function to clear all notifications
  const clearAllNotifications = () => {
    Alert.alert(
      'Hapus Semua Notifikasi',
      'Apakah Anda yakin ingin menghapus semua notifikasi?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Hapus',
          onPress: () => {
            setNotifications([]); // Clear the state
            Alert.alert('Berhasil', 'Semua notifikasi telah dihapus.');
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Render function for each notification item
  const renderNotificationItem = ({ item }) => (
    <View style={[styles.notificationItem, item.read ? styles.readNotification : styles.unreadNotification]}>
      <Text style={styles.notificationTitle}>{item.title}</Text>
      <Text style={styles.notificationMessage}>{item.message}</Text>
      <Text style={styles.notificationTimestamp}>{item.timestamp}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.topShape}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/Homepage')}> {/* Changed to router.push('/Homepage') */}
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Notifikasi</Text>
      </View>

      {/* Main Content */}
      <View style={styles.contentContainer}>
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Tidak ada notifikasi saat ini.</Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderNotificationItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.notificationList}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Clear All Button */}
        {notifications.length > 0 && ( // Only show if there are notifications
          <TouchableOpacity
            style={styles.clearAllButton}
            onPress={clearAllNotifications}
          >
            <Text style={styles.clearAllButtonText}>Hapus Semua Notifikasi</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF1E1',
  },
  topShape: {
    position: 'absolute',
    width: '100%',
    height: 100,
    backgroundColor: '#D2601A',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: 'center',
    paddingTop: 20,
    zIndex: 5,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 40,
    zIndex: 11,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  contentContainer: {
    flex: 1,
    marginTop: 100, // To place content below the header
    padding: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  notificationList: {
    width: '100%',
    paddingBottom: 20, // Add some padding at the bottom
  },
  notificationItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  readNotification: {
    opacity: 0.7, // Slightly dim read notifications
  },
  unreadNotification: {
    borderLeftWidth: 5,
    borderLeftColor: '#D2601A', // Highlight unread notifications
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  notificationTimestamp: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  clearAllButton: {
    backgroundColor: '#FF0000', // Red color for "Clear All"
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: '90%',
    marginTop: 20,
    marginBottom: 20, // Add bottom margin for spacing
  },
  clearAllButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
