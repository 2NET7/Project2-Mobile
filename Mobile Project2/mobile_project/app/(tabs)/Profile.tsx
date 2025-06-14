import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView, StatusBar } from 'react-native';
import React, { useState } from 'react';
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';


const initialUser = {
  profileImage: require('@/assets/images/IMG_1259.jpg'),
  name: 'Raid Javier J',
  email: 'raid@gmail.com',
  phone: '085134313142',
};

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [modalVisible, setModalVisible] = useState(false);
  // Gunakan state untuk menyimpan data pengguna yang bisa berubah
  const [user, setUser] = useState(initialUser);

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

  const handleLihatRiwayatPress = () => {
    router.push('/HistoryLaporan');
  };

  const handleEditProfileImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Izin Diperlukan', 'Aplikasi memerlukan izin untuk mengakses galeri foto Anda.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setUser(prevUser => ({
        ...prevUser,
        profileImage: { uri: result.assets[0].uri },
      }));
    }
  };

  return (
    <View style={styles.fullContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#D48442" />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.headerLeft} onPress={() => router.push('/Homepage')}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          {/* Ubah TouchableOpacity di sini untuk foto profil */}
          <TouchableOpacity style={styles.profileImageContainer} onPress={() => setModalVisible(true)}>
            <Image source={user.profileImage} style={styles.profileImage} />
            <View style={styles.profileImageButtons}>
              <TouchableOpacity style={styles.editImageIcon} onPress={handleEditProfileImage}>
                <MaterialIcons name="edit" size={20} color="white" />
              </TouchableOpacity>
              {/* Tombol fullscreen telah dihapus */}
            </View>
          </TouchableOpacity>
          <Text style={styles.userName}>{user.name}</Text>

          <View style={styles.infoRow}>
            <AntDesign name="user" size={20} color="#66320F" />
            <Text style={styles.infoText}>{user.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome name="at" size={20} color="#66320F" />
            <Text style={styles.infoText}>{user.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome name="phone" size={20} color="#66320F" />
            <Text style={styles.infoText}>{user.phone}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.actionButton} onPress={handleLihatRiwayatPress}>
          <FontAwesome name="history" size={20} color="#D2601A" style={styles.actionIcon} />
          <Text style={styles.actionButtonText}>Lihat Riwayat Laporan</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={handleLogout}>
          <FontAwesome name="sign-out" size={20} color="#E74C3C" style={styles.actionIcon} />
          <Text style={[styles.actionButtonText, styles.logoutText]}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.bottomSection}>
          <Text style={styles.appVersion}>Aplikasi SIGANAS MADU</Text>
          <Text style={styles.appMotto}>"Sistem Informasi Tanggap Bencana Berbasis Masyarakat Terpadu"</Text>
        </View>
      </ScrollView>

      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalBackground}>
          <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
            <AntDesign name="closecircle" size={30} color="white" />
          </TouchableOpacity>
          <Image
            source={user.profileImage}
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
    backgroundColor: '#FFF1E1',
  },
  header: {
    backgroundColor: '#D48442',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    height: 80,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 2,
  },
  headerRight: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
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
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#D48442',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  profileImageButtons: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 15,
    padding: 2,
  },
  editImageIcon: {
    padding: 4,
  },
  // viewImageIcon tidak lagi dibutuhkan karena tombolnya dihapus
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
    marginLeft: 15,
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
    marginTop: 40,
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
    opacity: 0.2,
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
    top: 60,
    right: 20,
    zIndex: 1,
  },
  fullImage: {
    width: '90%',
    height: '80%',
    borderRadius: 12,
  },
});
