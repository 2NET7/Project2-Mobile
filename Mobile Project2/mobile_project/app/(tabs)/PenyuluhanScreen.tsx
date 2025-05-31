import { View, Text, StyleSheet, TouchableOpacity, FlatList, StatusBar } from 'react-native'; // Tambahkan StatusBar
import React from 'react';
import { dummyPenyuluhan } from '../api/dummyPenyuluhan';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Import useSafeAreaInsets

export default function PenyuluhanScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets(); // Dapatkan insets untuk area aman

  // Ambil 3 penyuluhan berdasarkan ID spesifik (bisa pakai index juga)
  // Untuk tujuan demo tampilan, kita bisa ambil lebih banyak item dummyPenyuluhan
  // atau membuat data dummy yang lebih panjang agar scrolling terlihat.
  // Jika Anda ingin semua data, gunakan dummyPenyuluhan langsung:
  const penyuluhanList = dummyPenyuluhan.filter(Boolean); // Filter untuk memastikan tidak ada null/undefined
  // Atau jika memang hanya 3:
  // const penyuluhanList = [
  //   dummyPenyuluhan.find((item) => item.id === '1'),
  //   dummyPenyuluhan.find((item) => item.id === '2'),
  //   dummyPenyuluhan.find((item) => item.id === '3'),
  // ].filter(Boolean);

  return (
    <View style={styles.container}>
      {/* StatusBar untuk konsistensi warna */}
      <StatusBar barStyle="light-content" backgroundColor="#D2601A" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}> {/* Sesuaikan padding top dengan insets */}
        {/* Slot Kiri (Tombol Kembali) */}
        <TouchableOpacity style={styles.headerLeft} onPress={() => router.push('/Homepage')}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>

        {/* Slot Tengah (Judul) */}
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
            Penyuluhan
          </Text>
        </View>

        {/* Slot Kanan (Kosong atau untuk ikon lain) */}
        <View style={styles.headerRight} />
      </View>

      {/* FlatList untuk daftar penyuluhan */}
      <FlatList
        data={penyuluhanList}
        keyExtractor={(item) => item!.id}
        contentContainerStyle={styles.listContentContainer} // Gunakan style baru
        showsVerticalScrollIndicator={true} // Tampilkan indikator scroll
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card} // Gunakan gaya card yang diperbarui
            onPress={() =>
              router.push({
                pathname: '/detailPenyuluhan',
                params: { id: item!.id },
              })
            }>
            <Text style={styles.tema}>{item!.tema}</Text>
            <Text style={styles.subText}>{item!.tanggal}</Text>
            <Text style={styles.subText}>{item!.lokasi}</Text>
            <Text style={styles.deskripsi}>{item!.deskripsi}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF1E1', // Warna latar belakang keseluruhan
  },
  header: {
    backgroundColor: '#D2601A', // Warna latar belakang header
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Menyebar elemen secara horizontal
    paddingHorizontal: 16,
    paddingBottom: 16, // Padding bawah untuk header
    height: 90, // Tinggi tetap untuk header (akan ditimpa oleh paddingTop)
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000', // Tambahkan shadow untuk header
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
    overflow: 'hidden', // Pastikan radius terlihat rapi dengan shadow
  },
  headerLeft: {
    flex: 1, // Mengambil 1 bagian dari ruang flex
    alignItems: 'flex-start', // Letakkan di kiri
    paddingBottom: 5, // Sedikit padding untuk ikon
  },
  headerCenter: {
    flex: 3, // Mengambil 3 bagian (lebih besar untuk judul)
    alignItems: 'center', // Letakkan di tengah slot ini
    justifyContent: 'center', // Jika teksnya pendek, ini akan memusatkannya juga
    paddingBottom: 5, // Sedikit padding untuk judul
  },
  headerRight: {
    flex: 1, // Mengambil 1 bagian (kosong atau untuk ikon lain)
    alignItems: 'flex-end', // Letakkan di kanan
    paddingBottom: 5, // Sedikit padding untuk slot kanan
  },
  headerTitle: {
    color: 'white',
    fontSize: 20, // Ukuran font sedikit lebih besar
    fontWeight: 'bold',
    textAlign: 'center', // Pastikan teksnya sendiri terpusat di dalam View headerCenter
  },
  listContentContainer: {
    padding: 16,
    paddingTop: 20, // Sedikit ruang di atas list
    paddingBottom: 20, // Padding di bagian bawah list
  },
  card: {
    backgroundColor: 'white', // Latar belakang putih untuk card
    padding: 16,
    borderRadius: 15, // Sudut membulat lebih halus
    marginBottom: 16,
    shadowColor: '#000', // Tambahkan shadow untuk efek card
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1, // Border tipis
    borderColor: '#D2601A20', // Warna border dengan opacity
  },
  tema: {
    color: '#D2601A', // Warna tema lebih gelap (sesuai branding)
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8, // Sedikit ruang di bawah tema
  },
  subText: {
    color: '#66320F', // Warna teks yang lebih gelap dan mudah dibaca
    fontSize: 14,
    marginBottom: 4, // Sedikit ruang antar sub-teks
  },
  deskripsi: {
    color: '#333', // Warna deskripsi yang mudah dibaca
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20, // Spasi antar baris untuk keterbacaan
    fontStyle: 'normal', // Hapus italic jika tidak diperlukan untuk deskripsi
  },
});
