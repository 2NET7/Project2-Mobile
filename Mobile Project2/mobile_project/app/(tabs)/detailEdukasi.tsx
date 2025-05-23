import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { edukasiBencana } from '../api/dummyEdukasi';
import { AntDesign } from '@expo/vector-icons';

const DetailEdukasi: React.FC = () => {
  const { jenis } = useLocalSearchParams();
  const router = useRouter();

  const detail = edukasiBencana.find(item => item.jenis === jenis);

  if (!detail) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Data edukasi tidak ditemukan.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => router.push('/EdukasiBencana')}>
                  <AntDesign name="arrowleft" size={24} color="white" />
                </TouchableOpacity>
        <Text style={styles.headerText}>{detail.jenis}</Text>
      </View>

      {/* Konten */}
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={detail.image} style={styles.image} />
        <Text style={styles.title}>{detail.judul}</Text>
        <Text style={styles.meta}>
          Diunggah oleh: <Text style={{ fontWeight: 'bold' }}>{detail.diunggahOleh}</Text> pada {detail.tanggal}
        </Text>
        <Text style={styles.description}>{detail.deskripsi}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D48442',
    padding: 16,
    paddingTop: 48,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  image: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    marginBottom: 16,
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
    marginBottom: 16,
  },
  description: {
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
  backButton: { 
    position: 'absolute', 
    left: 20, 
    top: 
    40, 
    zIndex: 1 
  },
});

export default DetailEdukasi;
