import React, { useCallback, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  StatusBar, 
  Linking, // Digunakan untuk membuka link
  Alert 
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video } from 'expo-av';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Mendefinisikan tipe data untuk setiap laporan agar lebih aman
interface Laporan {
  id: number;
  namaLengkap: string;
  tanggal: string;
  waktu: string;
  jenisBencana: string;
  kecamatan: string;
  desa: string;
  alamat: string;
  mediaUri?: string;
  mediaType?: 'image' | 'video';
  locationLink?: string; // Menambahkan properti locationLink
}

export default function HistoryLaporan() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [laporanList, setLaporanList] = useState<Laporan[]>([]);

  // Menggunakan useFocusEffect untuk memuat ulang data setiap kali layar ini dibuka
  useFocusEffect(
    useCallback(() => {
      const loadHistory = async () => {
        try {
          const storedData = await AsyncStorage.getItem('riwayatLaporan');
          if (storedData) {
            const parsedData: Laporan[] = JSON.parse(storedData);
            setLaporanList(parsedData);
          }
        } catch (err) {
          console.error('Gagal memuat data riwayat:', err);
          Alert.alert('Error', 'Gagal memuat riwayat laporan.');
        }
      };

      loadHistory();
    }, [])
  );

  const handleOpenLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Tidak bisa membuka link', `Tidak ada aplikasi yang bisa membuka link ini: ${url}`);
    }
  };

  return (
    <View style={styles.fullContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#D2601A" />
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.headerLeft} onPress={() => router.push('/Homepage')}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Riwayat Laporan</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={true}>
        {laporanList.length === 0 ? (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>Belum ada laporan yang tersedia.</Text>
            <Text style={styles.noDataSubtext}>Silakan buat laporan baru.</Text>
          </View>
        ) : (
          laporanList.map((laporan, index) => (
            <View key={laporan.id} style={styles.card}>
              <Text style={styles.cardTitle}>Laporan #{laporanList.length - index}</Text>
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
              {/* --- PERUBAHAN: Menampilkan Kecamatan dan Desa --- */}
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
              
              {laporan.locationLink && (
                 <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>Link Lokasi:</Text>
                  <TouchableOpacity onPress={() => handleOpenLink(laporan.locationLink!)}>
                     <Text style={[styles.itemValue, styles.linkValue]} numberOfLines={1}>
                        Buka di Peta
                     </Text>
                  </TouchableOpacity>
                </View>
              )}

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
    backgroundColor: '#FFF1E1',
  },
  header: {
    backgroundColor: '#D2601A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    height: 90,
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
  headerCenter: {
    flex: 2,
    alignItems: 'center',
  },
  headerRight: {
    flex: 1,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#D2601A30',
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
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  itemLabel: {
    fontWeight: 'bold',
    color: '#66320F',
    fontSize: 15,
    width: 100, // Sedikit diperlebar agar cukup untuk 'Kecamatan'
  },
  itemValue: {
    flex: 1,
    color: '#333',
    fontSize: 15,
  },
  linkValue: {
    color: '#2980b9',
    textDecorationLine: 'underline',
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
    backgroundColor: '#f0f0f0',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
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
    marginTop: 30,
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 15,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#D2601A30',
  },
  homeButtonText: {
    color: '#D2601A',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
