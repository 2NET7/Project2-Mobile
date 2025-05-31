import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView, StatusBar } from 'react-native';
import React, { useState } from 'react';
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons'; // Tambahkan MaterialIcons jika diperlukan
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Import useSafeAreaInsets
import { Modal } from 'react-native';

// Dummy data pengguna
const dummyUser = {
  // Ganti dengan path gambar profil default Anda, jika ada
  profileImage: require('@/assets/images/IMG_1259.jpg'), // Menggunakan gambar dari kode Anda
  name: 'Raid Javier J',
  email: 'raid@gmail.com',
  phone: '085134313142',
};

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets(); // Dapatkan insets untuk area aman

  const [modalVisible, setModalVisible] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      "Konfirmasi Logout",
      "Apakah Anda yakin ingin logout?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => router.replace('/LoginScreen'), // Pastikan ini adalah route yang benar
        }
      ]
    );
  };

  const handleLihatRiwayatPress = () => {
    router.push('/HistoryLaporan'); // Navigasi ke halaman Riwayat Laporan
  };

  return (
    <View style={styles.fullContainer}>
      {/* StatusBar untuk konsistensi warna */}
      <StatusBar barStyle="light-content" backgroundColor="#D48442" />

      {/* Header Utama */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.headerLeft} onPress={() => router.push('/Homepage')}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil</Text> {/* Mengubah teks header menjadi "Profil" */}
        {/* View kosong sebagai penyeimbang di kanan */}
        <View style={styles.headerRight} />
      </View>

      {/* Konten Utama yang bisa di-scroll */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Kartu Profil Utama */}
        <View style={styles.profileCard}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image source={dummyUser.profileImage} style={styles.profileImage} />
          </TouchableOpacity>
          <Text style={styles.userName}>{dummyUser.name}</Text>

          {/* Informasi Pengguna */}
          <View style={styles.infoRow}>
            <AntDesign name="user" size={20} color="#66320F" />
            <Text style={styles.infoText}>{dummyUser.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome name="at" size={20} color="#66320F" />
            <Text style={styles.infoText}>{dummyUser.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome name="phone" size={20} color="#66320F" />
            <Text style={styles.infoText}>{dummyUser.phone}</Text>
          </View>
        </View>

        {/* Tombol Aksi */}
        <TouchableOpacity style={styles.actionButton} onPress={handleLihatRiwayatPress}>
          <FontAwesome name="history" size={20} color="#D2601A" style={styles.actionIcon} />
          <Text style={styles.actionButtonText}>Lihat Riwayat Laporan</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={handleLogout}>
          <FontAwesome name="sign-out" size={20} color="#E74C3C" style={styles.actionIcon} />
          <Text style={[styles.actionButtonText, styles.logoutText]}>Logout</Text>
        </TouchableOpacity>

        {/* Bagian Bawah yang Dipercantik */}
        <View style={styles.bottomSection}>
          <Text style={styles.appVersion}>Aplikasi SIGANAS MADU</Text>
          <Text style={styles.appMotto}>"Sistem Informasi Tanggap Bencana Berbasis Masyarakat Terpadu"</Text>
          <Image
            source={require('@/assets/images/IMG_1259.jpg')} // Pastikan gambar ini ada
            style={styles.bottomLogo}
          />
        </View>
      </ScrollView>

      {/* Modal untuk tampilan gambar full-screen */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalBackground}>
          <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
            <AntDesign name="closecircle" size={30} color="white" />
          </TouchableOpacity>
          <Image
            source={dummyUser.profileImage} // Menggunakan gambar profil yang sama untuk modal
            style={styles.fullImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: '#FFF1E1', // Warna latar belakang keseluruhan
  },
  header: {
    backgroundColor: '#D48442', // Warna header konsisten
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    height: 80, // Tinggi tetap
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  headerLeft: {
    flex: 1, // Memberikan ruang untuk tombol kembali
    alignItems: 'flex-start',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 2, // Memberikan ruang lebih untuk judul
  },
  headerRight: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1, // Memungkinkan ScrollView mengisi sisa ruang
    paddingHorizontal: 16, // Padding horizontal untuk konten
    paddingBottom: 20, // Ruang di bagian bawah ScrollView
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginTop: 20, 
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#D4844230',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50, // Bentuk lingkaran
    marginBottom: 15,
    borderWidth: 3, // Border pada gambar profil
    borderColor: '#D48442',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
    paddingHorizontal: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 15, // Jarak teks dari ikon
    flexShrink: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#D2601A30',
  },
  actionIcon: {
    marginRight: 15,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D2601A',
  },
  logoutButton: {
    borderColor: '#E74C3C30',
  },
  logoutText: {
    color: '#E74C3C',
  },
  bottomSection: {
    marginTop: 40, // Jarak dari tombol Logout
    alignItems: 'center',
    paddingVertical: 20,
  },
  appVersion: {
    fontSize: 12,
    color: '#777',
    marginBottom: 5,
  },
  appMotto: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 15,
    textAlign: 'center',
  },
  bottomLogo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    opacity: 0.2, // Lebih samar dari sebelumnya
    marginTop: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 60, // Sesuaikan posisi tombol close
    right: 20,
    zIndex: 1, // Pastikan di atas gambar
  },
  fullImage: {
    width: '90%',
    height: '80%',
    borderRadius: 12,
  },
});
