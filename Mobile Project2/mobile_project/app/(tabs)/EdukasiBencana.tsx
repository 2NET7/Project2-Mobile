import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { edukasiBencana } from '../api/dummyEdukasi';

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

  const handlePress = (name: string) => {
    console.log(`Selected Disaster: ${name}`);
    router.push({ pathname: '/detailEdukasi', params: { jenis: name } });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/Homepage')}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Edukasi Bencana</Text>
      </View>

      {/* Disaster List */}
      <View style={styles.listContainer}>
        <View style={styles.grid}>
          {disasters.map((disaster) => (
            <TouchableOpacity key={disaster.id} style={styles.item} onPress={() => handlePress(disaster.name)}>
              <Image source={disaster.image} style={styles.image} />
              <Text style={styles.text}>{disaster.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCEBD5',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    backgroundColor: '#D48442',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    fontSize: 24,
    marginRight: 8,
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 24,
  },
  listContainer: {
    marginTop: 20,
    width: '85%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  item: {
    alignItems: 'center',
    width: '45%',
    marginBottom: 16,
  },
  image: {
    width: 64,
    height: 64,
  },
  text: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
  }
});

export default DisasterListPage;
