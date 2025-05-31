import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, StatusBar, ScrollView } from 'react-native';
import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Import useSafeAreaInsets

// Dummy data Anda tetap sama
const disasters = [
  { id: 1, name: "Tanah Longsor", image: require('@/assets/images/Longsor.png') },
  { id: 2, name: "Gempa Bumi", image: require('@/assets/images/Gempa.png') },
  { id: 3, name: "Banjir", image: require('@/assets/images/Banjir.png') },
  { id: 4, name: "Erupsi Gunung Berapi", image: require('@/assets/images/Erupsi.png') },
  { id: 5, name: "Angin Puting Beliung", image: require('@/assets/images/Tornado.png') },
  { id: 6, name: "Tsunami", image: require('@/assets/images/Tsunami.png') }
];

const DisasterListPage: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets(); // Dapatkan insets untuk area aman

  const handlePress = (name: string) => {
    console.log(`Selected Disaster: ${name}`);
    router.push({ pathname: '/detailEdukasi', params: { jenis: name } });
  };

  // Komponen renderItem untuk FlatList
  const renderDisasterItem = ({ item }: { item: typeof disasters[0] }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.gridItem} // Gunakan gaya baru untuk item grid
      onPress={() => handlePress(item.name)}>
      <Image source={item.image} style={styles.itemImage} /> {/* Gunakan gaya baru */}
      <Text style={styles.itemText}>{item.name}</Text> {/* Gunakan gaya baru */}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* StatusBar untuk konsistensi warna */}
      <StatusBar barStyle="light-content" backgroundColor="#D48442" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}> {/* Sesuaikan padding top dengan insets */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/Homepage')}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Edukasi Bencana</Text>
        {/* Tambahkan View kosong sebagai penyeimbang jika ada tombol kanan */}
        <View style={{ width: 24 }} />
      </View>

      {/* Disaster List */}
      <FlatList // Gunakan FlatList untuk performa lebih baik pada list panjang
        data={disasters}
        renderItem={renderDisasterItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2} // Tampilkan 2 kolom
        contentContainerStyle={styles.gridContainer} // Gaya untuk FlatList container
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0', // Warna latar belakang keseluruhan
  },
  header: {
    width: '100%',
    backgroundColor: '#D48442',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Menyebar elemen secara horizontal
    paddingHorizontal: 16,
    paddingBottom: 16, // Padding bawah untuk header
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  backButton: {
    // Ukuran ikon sudah di AntDesign, tidak perlu fontSize di sini
    // Jika perlu margin kanan: marginRight: 8,
    // Kita biarkan header mengatur posisinya
  },
  headerText: {
    flex: 1, // Mengambil sisa ruang
    textAlign: 'center', // Pusatkan teks di ruang flex-nya
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20, // Ukuran font sedikit lebih besar
  },
  gridContainer: {
    padding: 16,
    paddingTop: 20, // Sedikit ruang di atas grid
  },
  gridItem: {
    flex: 1, // Agar item memenuhi ruang yang tersedia dalam kolom
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8, // Margin antar item
    shadowColor: '#000', // Shadow untuk efek card
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    minHeight: 150, // Tinggi minimal untuk item agar konsisten
  },
  itemImage: {
    width: 70, // Ukuran ikon sedikit lebih besar
    height: 70,
    resizeMode: 'contain',
    marginBottom: 10, // Margin bawah untuk teks
  },
  itemText: {
    fontSize: 15, // Ukuran font sedikit lebih besar
    textAlign: 'center',
    color: '#333', // Warna teks lebih gelap
    fontWeight: 'bold',
  }
});

export default DisasterListPage;
