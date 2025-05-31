import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, StatusBar } from 'react-native'; // Tambahkan StatusBar
import { useLocalSearchParams } from 'expo-router';
import { dummyPenyuluhan } from '../api/dummyPenyuluhan';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Import useSafeAreaInsets

export default function DetailPenyuluhanScreen() {
  const { id } = useLocalSearchParams();
  const detail = dummyPenyuluhan.find((item) => item.id === id);
  const router = useRouter();
  const insets = useSafeAreaInsets(); // Dapatkan insets untuk area aman

  if (!detail) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.errorText}>Penyuluhan tidak ditemukan</Text>
        <TouchableOpacity style={styles.backButtonBottom} onPress={() => router.push('/PenyuluhanScreen')}>
          <Text style={styles.backButtonText}>Kembali ke Daftar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* StatusBar untuk konsistensi warna */}
      <StatusBar barStyle="light-content" backgroundColor="#D2601A" />

      {/* Header (akan tetap di atas dan tidak ikut di-scroll) */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}> {/* Sesuaikan padding top dengan insets */}
        {/* Slot Kiri (Tombol Kembali) */}
        <TouchableOpacity onPress={() => router.push('/PenyuluhanScreen')} style={styles.headerLeft}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>

        {/* Slot Tengah (Judul) */}
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
            Detail Penyuluhan
          </Text>
        </View>

        {/* Slot Kanan (Kosong atau untuk ikon lain) */}
        <View style={styles.headerRight} />
      </View>

      {/* Konten yang bisa di-scroll */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true} // <--- Tambahan ini
      >
        <View style={styles.detailCard}>
          <Text style={styles.title}>{detail.tema}</Text>

          <View style={styles.infoRow}>
            <Feather name="calendar" size={18} color="#66320F" />
            <Text style={styles.infoText}>{detail.tanggal}</Text>
          </View>

          <View style={styles.infoRow}>
            <Feather name="map-pin" size={18} color="#66320F" />
            <Text style={styles.infoText}>{detail.lokasi}</Text>
          </View>

          <View style={styles.descriptionCard}>
            <Text style={styles.descriptionLabel}>Deskripsi:</Text>
            <Text style={styles.descriptionText}>{detail.deskripsi}</Text>
          </View>

          {/* Bukti Foto */}
          {detail.foto && (
            <View style={styles.photoSection}>
              <Text style={styles.photoLabel}>Bukti Foto:</Text>
              <Image source={detail.foto} style={styles.photo} resizeMode="contain" />
            </View>
          )}
          {/* Akhir Bukti Foto */}

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF1E1',
  },
  header: {
    backgroundColor: '#D2601A',
    // paddingTop diatur dinamis menggunakan useSafeAreaInsets
    height: 90, // Tentukan tinggi tetap untuk header (akan ditimpa oleh paddingTop + tinggi konten)
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 16,
    // Tambahkan shadow untuk header agar konsisten dengan halaman lain
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
    overflow: 'hidden', // Untuk memastikan radius sudut bawah header terlihat rapi
  },
  headerLeft: {
    flex: 0.5,
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
    flex: 0.5,
    alignItems: 'flex-end',
    paddingBottom: 5, // Sedikit padding untuk slot kanan
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 16,
    paddingTop: 0, // Padding atas sudah di handle oleh margin header
    paddingBottom: 20, // Tambahkan padding bawah agar ada ruang saat scroll sampai akhir
  },
  detailCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D2601A',
    marginBottom: 15,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#66320F',
    marginLeft: 10,
  },
  descriptionCard: {
    backgroundColor: '#FFF8F0',
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#D2601A30',
  },
  descriptionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D2601A',
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  photoSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  photoLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D2601A',
    marginBottom: 10,
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    alignSelf: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#D2601A',
    marginBottom: 20,
  },
  backButtonBottom: {
    backgroundColor: '#D2601A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
