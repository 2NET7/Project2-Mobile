import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, StatusBar } from 'react-native'; // Tambahkan StatusBar
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video } from 'expo-av'; // Pastikan expo-av terinstal
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Import useSafeAreaInsets

export default function HistoryLaporan() {
  const { data } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets(); // Dapatkan insets untuk area aman

  const [laporanList, setLaporanList] = useState<any[]>([]);

  useEffect(() => {
    const saveData = async () => {
      // console.log('Data dari halaman sebelumnya:', data); // Log ini hanya untuk debugging

      try {
        if (data) {
          const newData = JSON.parse(decodeURIComponent(data as string));
          // console.log('Data setelah decode:', newData); // Log ini hanya untuk debugging

          const existingData = await AsyncStorage.getItem('riwayatLaporan');
          const parsedExisting = existingData ? JSON.parse(existingData) : [];

          // Tambahkan ID unik jika belum ada, atau setidaknya timestamp
          const reportWithId = { ...newData, id: Date.now().toString() }; // Tambahkan ID unik

          const updatedData = [reportWithId, ...parsedExisting]; // Tambahkan yang baru di awal daftar
          await AsyncStorage.setItem('riwayatLaporan', JSON.stringify(updatedData));
          setLaporanList(updatedData);
        } else {
          const stored = await AsyncStorage.getItem('riwayatLaporan');
          if (stored) {
            const parsed = JSON.parse(stored);
            setLaporanList(parsed);
          }
        }
      } catch (err) {
        console.error('Gagal memuat atau menyimpan data:', err);
      }
    };

    saveData();
  }, [data]); // data sebagai dependency agar effect jalan jika data berubah

  return (
    <View style={styles.fullContainer}> {/* Gunakan fullContainer agar header tetap */}
      {/* StatusBar untuk konsistensi warna */}
      <StatusBar barStyle="light-content" backgroundColor="#D2601A" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        {/* Slot Kiri (Tombol Kembali) */}
        <TouchableOpacity style={styles.headerLeft} onPress={() => router.push('/Homepage')}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>

        {/* Slot Tengah (Judul) */}
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Riwayat Laporan</Text>
        </View>

        {/* Slot Kanan (Kosong atau untuk ikon lain) */}
        <View style={styles.headerRight} />
      </View>

      {/* Konten yang bisa di-scroll */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={true}>
        {laporanList.length === 0 ? (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>Belum ada laporan yang tersedia.</Text>
            <Text style={styles.noDataSubtext}>Silakan buat laporan baru.</Text>
          </View>
        ) : (
          laporanList.map((laporan: any, index: number) => (
            <View key={laporan.id || index} style={styles.card}> {/* Gunakan laporan.id sebagai key jika ada */}
              <Text style={styles.cardTitle}>Laporan #{laporanList.length - index}</Text> {/* Nomor laporan */}
              <View style={styles.itemRow}>
                <Text style={styles.itemLabel}>Nama:</Text>
                <Text style={styles.itemValue}>{laporan.namaLengkap}</Text>
              </View>
              <View style={styles.itemRow}>
                <Text style={styles.itemLabel}>Tanggal:</Text>
                <Text style={styles.itemValue}>{laporan.tanggal}</Text>
              </View>
              <View style={styles.itemRow}>
                <Text style={styles.itemLabel}>Waktu:</Text>
                <Text style={styles.itemValue}>{laporan.waktu}</Text>
              </View>
              <View style={styles.itemRow}>
                <Text style={styles.itemLabel}>Bencana:</Text>
                <Text style={styles.itemValue}>{laporan.jenisBencana}</Text>
              </View>
              <View style={styles.itemRow}>
                <Text style={styles.itemLabel}>Kecamatan:</Text>
                <Text style={styles.itemValue}>{laporan.kecamatan}</Text>
              </View>
              <View style={styles.itemRow}>
                <Text style={styles.itemLabel}>Desa:</Text>
                <Text style={styles.itemValue}>{laporan.desa}</Text>
              </View>
              <View style={styles.itemRow}>
                <Text style={styles.itemLabel}>Alamat:</Text>
                <Text style={styles.itemValue}>{laporan.alamat}</Text>
              </View>

              {/* Tampilkan media jika tersedia */}
              {laporan.mediaUri && (
                <View style={styles.mediaContainer}>
                  <Text style={styles.mediaLabel}>Media Bukti:</Text>
                  {laporan.mediaType === 'image' && (
                    <Image source={{ uri: laporan.mediaUri }} style={styles.mediaPreview} />
                  )}
                  {laporan.mediaType === 'video' && (
                    <Video
                      source={{ uri: laporan.mediaUri }}
                      style={styles.mediaPreview}
                      useNativeControls
                      resizeMode="contain"
                    />
                  )}
                </View>
              )}
            </View>
          ))
        )}

        <TouchableOpacity style={styles.homeButton} onPress={() => router.push('/Homepage')}>
          <Text style={styles.homeButtonText}>Kembali ke Homepage</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: '#FFF1E1', // Warna latar belakang keseluruhan
  },
  header: {
    backgroundColor: '#D2601A', // Warna latar belakang header
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    height: 90, // Tinggi tetap untuk header
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000', // Tambahkan shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
    overflow: 'hidden', // Pastikan radius terlihat rapi
  },
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
    paddingBottom: 5,
  },
  headerCenter: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 5,
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
    paddingBottom: 5,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollContent: {
    flexGrow: 1, // Penting agar ScrollView bisa mengisi sisa ruang dan konten pendek tetap di tengah
    padding: 16,
    paddingTop: 20, // Sedikit ruang di atas kartu pertama
    paddingBottom: 20, // Ruang di bawah tombol kembali
  },
  card: {
    backgroundColor: 'white',
    padding: 20, // Padding lebih besar
    borderRadius: 15, // Sudut lebih membulat
    marginBottom: 16, // Jarak antar kartu
    shadowColor: '#000', // Shadow untuk efek card
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1, // Border tipis
    borderColor: '#D2601A30', // Warna border dengan opacity
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D2601A',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  itemRow: {
    flexDirection: 'row', // Atur item dalam baris
    marginBottom: 6,
  },
  itemLabel: {
    fontWeight: 'bold',
    color: '#66320F', // Warna label
    marginRight: 8,
    fontSize: 15,
    width: 90, // Lebar tetap untuk label agar sejajar
  },
  itemValue: {
    flex: 1, // Mengambil sisa ruang
    color: '#333', // Warna nilai
    fontSize: 15,
  },
  mediaContainer: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  mediaLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#66320F',
    marginBottom: 8,
  },
  mediaPreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: '#f0f0f0', // Latar belakang placeholder untuk media
  },
  noDataContainer: {
    flex: 1, // Penting agar pesan berada di tengah jika scrollContent flexGrow: 1
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50, // Padding vertikal untuk ruang
  },
  noDataText: {
    fontSize: 18,
    color: '#D2601A',
    marginBottom: 10,
    textAlign: 'center',
  },
  noDataSubtext: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
  },
  homeButton: {
    marginTop: 30, // Jarak dari kartu terakhir atau pesan noData
    backgroundColor: 'white', // Latar belakang putih
    paddingVertical: 15, // Padding lebih besar
    paddingHorizontal: 25,
    borderRadius: 15, // Lebih membulat
    alignSelf: 'center', // Pusatkan tombol
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#D2601A30',
  },
  homeButtonText: {
    color: '#D2601A', // Warna teks sesuai branding
    fontSize: 16,
    fontWeight: 'bold',
  },
});
