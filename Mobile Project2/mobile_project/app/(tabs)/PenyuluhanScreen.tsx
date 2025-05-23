import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import React from 'react';
import { dummyPenyuluhan } from '../api/dummyPenyuluhan';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

export default function PenyuluhanScreen() {
  const router = useRouter();

  // Ambil 3 penyuluhan berdasarkan ID spesifik (bisa pakai index juga)
  const penyuluhanList = [
    dummyPenyuluhan.find((item) => item.id === '1'),
    dummyPenyuluhan.find((item) => item.id === '2'),
    dummyPenyuluhan.find((item) => item.id === '3'),
  ].filter(Boolean); // Hilangkan jika ada yang undefined/null

  return (
    <View style={styles.container}>
      <FlatList
        data={penyuluhanList}
        keyExtractor={(item) => item!.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() =>
  router.push({
    pathname: '/detailPenyuluhan',
    params: { id: item!.id },
  })
}>
            <View style={styles.card}>
              <Text style={styles.tema}>{item!.tema}</Text>
              <Text style={styles.subText}>{item!.tanggal}</Text>
              <Text style={styles.subText}>{item!.lokasi}</Text>
              <Text style={styles.deskripsi}>{item!.deskripsi}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    <TouchableOpacity  style={styles.backButton} onPress={() => router.push('/Homepage')}>
        <AntDesign name="arrowleft" size={24} color="white" />
    </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF1E1',
  },
  card: {
    backgroundColor: '#D2601A',
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
  },
  tema: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subText: {
    color: '#fff',
    marginTop: 4,
  },
  deskripsi: {
    color: '#fff',
    marginTop: 8,
    fontStyle: 'italic',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 40,
    zIndex: 1,
  },
});
