import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, StatusBar } from 'react-native'; // Tambahkan StatusBar
import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { edukasiBencana } from '../api/dummyEdukasi';
import { AntDesign } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Import useSafeAreaInsets

const DetailEdukasi: React.FC = () => {
  const { jenis } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets(); // Gunakan insets untuk penanganan area aman

  const detail = edukasiBencana.find(item => item.jenis === jenis);

  if (!detail) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.errorText}>Data edukasi tidak ditemukan.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Pastikan StatusBar berwarna sesuai header */}
      <StatusBar barStyle="light-content" backgroundColor="#D48442" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}> {/* Gunakan insets.top */}
        {/* Slot Kiri (Tombol Kembali) */}
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={() => router.push('/EdukasiBencana')}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>

        {/* Slot Tengah (Judul) */}
        <View style={styles.headerCenter}>
          <Text style={styles.headerText} numberOfLines={1} ellipsizeMode="tail">
            {detail.jenis}
          </Text>
        </View>

        {/* Slot Kanan (Kosong atau untuk ikon lain) */}
        <View style={styles.headerRight} />
      </View>

      {/* Konten */}
      <ScrollView contentContainerStyle={styles.scrollContent}> {/* Ubah nama style content */}
        {/* Card Gambar dan Judul */}
        <View style={styles.imageTitleCard}>
          <Image source={detail.image} style={styles.image} />
          <Text style={styles.title}>{detail.judul}</Text>
          <Text style={styles.meta}>
            Diunggah oleh: <Text style={{ fontWeight: 'bold' }}>{detail.diunggahOleh}</Text> pada {detail.tanggal}
          </Text>
        </View>

        {/* Card Deskripsi */}
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionLabel}>Deskripsi:</Text>
          <Text style={styles.descriptionText}>{detail.deskripsi}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0', // Warna latar belakang keseluruhan
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D48442',
    // paddingTop diatur dinamis menggunakan useSafeAreaInsets
    height: 90, // Tentukan tinggi tetap untuk header (akan ditimpa oleh paddingTop + tinggi konten)
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    // Tambahkan shadow untuk header
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
    // Untuk memastikan konten di dalam header tidak terpotong
    overflow: 'hidden', // Potong konten yang keluar dari batas radius
  },
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
    paddingBottom: 5, // Sedikit padding untuk ikon
  },
  headerCenter: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 5, // Sedikit padding untuk judul
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
    paddingBottom: 5, // Sedikit padding untuk slot kanan
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingTop: 0, // Disesuaikan oleh header
    // Agar ada sedikit ruang di bagian bawah scroll
    paddingBottom: 20,
  },
  imageTitleCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center', // Pusatkan gambar dan teks di dalam card
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 4,
  },
  image: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    marginBottom: 16,
    borderRadius: 10, // Tambahkan sedikit border radius pada gambar
    borderWidth: 1, // Tambahkan border tipis
    borderColor: '#D4844230', // Warna border
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
  },
  meta: {
    fontSize: 14,
    color: '#777',
    marginBottom: 16, // Sedikit lebih banyak ruang sebelum deskripsi
    textAlign: 'center',
  },
  descriptionCard: {
    backgroundColor: 'white', // Latar belakang putih untuk card deskripsi
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 4,
    borderWidth: 1, // Border tipis
    borderColor: '#D4844220', // Warna border
  },
  descriptionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D48442', // Warna judul deskripsi
    marginBottom: 10,
    textAlign: 'center', // Pusatkan label deskripsi
  },
  descriptionText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    textAlign: 'justify',
  },
  errorText: {
    marginTop: 50,
    textAlign: 'center',
    fontSize: 18,
    color: 'red',
  },
});

export default DetailEdukasi;
