import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video } from 'expo-av';

export default function HistoryLaporan() {
  const { data } = useLocalSearchParams();
  const router = useRouter();

  const [laporanList, setLaporanList] = useState<any[]>([]);

  useEffect(() => {
    const saveData = async () => {
      console.log('Data dari halaman sebelumnya:', data);

      try {
        if (data) {
          const newData = JSON.parse(decodeURIComponent(data as string));
          console.log('Data setelah decode:', newData);

          const existingData = await AsyncStorage.getItem('riwayatLaporan');
          const parsedExisting = existingData ? JSON.parse(existingData) : [];

          const updatedData = [...parsedExisting, newData];
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
  }, [data]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/Homepage')}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Riwayat Laporan</Text>
      </View>

      {laporanList.length === 0 ? (
        <Text style={styles.noData}>Belum ada laporan.</Text>
      ) : (
        laporanList.map((laporan: any, index: number) => (
          <View key={index} style={styles.card}>
            <Text style={styles.item}>Nama: {laporan.namaLengkap}</Text>
            <Text style={styles.item}>Tanggal: {laporan.tanggal}</Text>
            <Text style={styles.item}>Waktu: {laporan.waktu}</Text>
            <Text style={styles.item}>Bencana: {laporan.jenisBencana}</Text>
            <Text style={styles.item}>Kecamatan: {laporan.kecamatan}</Text>
            <Text style={styles.item}>Desa: {laporan.desa}</Text>
            <Text style={styles.item}>Alamat: {laporan.alamat}</Text>

            {/* Tampilkan gambar jika tersedia */}
            {laporan.mediaUri && laporan.mediaType === 'image' && (
              <Image source={{ uri: laporan.mediaUri }} style={styles.media} />
            )}

            {/* Tampilkan video jika tersedia */}
            {laporan.mediaUri && laporan.mediaType === 'video' && (
              <Video
                source={{ uri: laporan.mediaUri }}
                style={styles.media}
                useNativeControls
                resizeMode="contain"/>
            )}
          </View>
        ))
      )}

      <TouchableOpacity style={styles.homeButton} onPress={() => router.push('/Homepage')}>
        <Text style={styles.homeButtonText}>Kembali ke Homepage</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFF',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  item: {
    marginBottom: 4,
  },
  backButton: {
    padding: 4,
  },
  homeButton: {
    marginTop: 20,
    backgroundColor: '#D2601A',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  homeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noData: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 20,
  },
  media: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 8,
  },
});
