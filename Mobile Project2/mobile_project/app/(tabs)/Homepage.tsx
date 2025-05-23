import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

const educations = [
  { id: 1, name: "Tanah Longsor", image: require('@/assets/images/Longsor.png') },
  { id: 2, name: "Gempa Bumi", image: require('@/assets/images/Gempa.png') },
  { id: 3, name: "Banjir", image: require('@/assets/images/Banjir.png') },
  { id: 4, name: "Erupsi Gunung Berapi", image: require('@/assets/images/Erupsi.png') },
  { id: 5, name: "Angin Puting Beliung", image: require('@/assets/images/Tornado.png') },
  { id: 6, name: "Tsunami", image: require('@/assets/images/Tsunami.png') }
];

const DisasterListPage: React.FC = () => {
  const router = useRouter(); // 🔥 ini penting

  const handleReportPress = () => {
    router.push('/LaporBencana');
  };

  const handleEducationPress = () => {
    router.push('/EdukasiBencana');
  };

  const handleProfilePress = () => {
    router.push('/Profile'); // Navigasi ke halaman Profile
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Homepage</Text>
        <TouchableOpacity onPress={() => router.push('/PenyuluhanScreen')}>
          <FontAwesome5 name="chalkboard-teacher" size={22} color="white" />
        </TouchableOpacity>
        {/* Ikon Profil */}
        <TouchableOpacity onPress={handleProfilePress}>
          <MaterialIcons name="person" size={26} color="white" />
        </TouchableOpacity>
      </View>

      {/* Tombol Lapor di Tengah */}
      <View style={styles.centerWrapper}>
        <TouchableOpacity style={styles.laporButton} onPress={handleReportPress}>
          <Text style={styles.laporText}>Lapor Sekarang</Text>
        </TouchableOpacity>
      </View>

      {/* Tombol Edukasi */}
      <TouchableOpacity style={styles.educationButton} onPress={handleEducationPress}>
        <Text style={styles.educationText}>Edukasi Bencana</Text>
      </TouchableOpacity>

      {/* List Bencana */}
      <View style={styles.educationListWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.educationScroll}>
          {educations.map((item) => (
            <TouchableOpacity key={item.id} style={styles.educationItem} onPress={() => handleEducationPress(item.name)}>
              <Image source={item.image} style={styles.educationImage} />
              <Text style={styles.educationLabel}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCEBD5',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
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
    color: 'white',
    fontSize: 18,
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  centerWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },  
  laporButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#D2601A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 5,
  },
  laporText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  educationText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listContainer: {
    marginTop: 20,
    width: '100%',
    paddingVertical: 16,
    paddingLeft: 10,
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
    color: '#8C4B1D',
    fontWeight: 'bold',
  },
  actionButtons: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  scrollContent: {
    paddingHorizontal: 10,
  },
  horizontalItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  educationButton: {
    marginBottom: 10,
    backgroundColor: '#D48442',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    zIndex: 5,
  },
  educationListWrapper: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    paddingVertical: 10,
    marginBottom: 50,
  },
  educationScroll: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  educationItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  educationImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    marginBottom: 6,
  },
  educationLabel: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8C4B1D',
  },
});

export default DisasterListPage;
