import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const educations = [
  { id: 1, name: "Tanah Longsor", image: require('@/assets/images/Longsor.png') },
  { id: 2, name: "Gempa Bumi", image: require('@/assets/images/Gempa.png') },
  { id: 3, name: "Banjir", image: require('@/assets/images/Banjir.png') },
  { id: 4, name: "Erupsi Gunung Berapi", image: require('@/assets/images/Erupsi.png') },
  { id: 5, name: "Angin Puting Beliung", image: require('@/assets/images/Tornado.png') },
  { id: 6, name: "Tsunami", image: require('@/assets/images/Tsunami.png') }
];

const Homepage: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [showAllEducations, setShowAllEducations] = useState(false);

  const handleReportPress = () => {
    router.push('/LaporBencana');
  };

  const handleEducationListPress = (name?: string) => {
    if (name) {
      router.push({ pathname: '/detailEdukasi', params: { jenis: name } });
    } else {
      router.push('/EdukasiBencana');
    }
  };

  const handlePenyuluhanPress = () => {
    router.push('/PenyuluhanScreen');
  };

  const handleProfilePress = () => {
    router.push('/Profile');
  };

  const handleNotificationPress = () => {
    router.push('/NotificationScreen');
  };

  const displayedEducations = showAllEducations ? educations : educations.slice(0, 3);
  const hasMoreEducations = educations.length > 3 && !showAllEducations;
  const showLessButton = showAllEducations;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#D48442" />

      {/* Header Utama */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerLeft}></View>
        <View style={styles.headerCenter}>
          <Text style={styles.headerText}>Homepage</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={handleNotificationPress} style={styles.headerIcon}>
            <AntDesign name="bells" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleProfilePress} style={styles.headerIcon}>
            <MaterialIcons name="person" size={26} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Konten Utama yang bisa di-scroll */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Tombol Lapor di Tengah */}
        <View style={styles.laporSection}>
          <Text style={styles.laporSectionTitle}>Laporkan Bencana</Text>
          <Text style={styles.laporSectionSubtitle}>Segera laporkan kejadian darurat</Text>
          <TouchableOpacity style={styles.laporButton} onPress={handleReportPress}>
            <Text style={styles.laporText}>Lapor Sekarang</Text>
          </TouchableOpacity>
        </View>

        {/* Tombol Edukasi (Cari Edukasi Bencana Lainnya) */}
        <TouchableOpacity style={styles.educationButton} onPress={() => handleEducationListPress()}>
          <Text style={styles.educationButtonText}>Cari Edukasi Bencana Lainnya</Text>
          <AntDesign name="arrowright" size={18} color="#D48442" />
        </TouchableOpacity>

        {/* --- TOMBOL PENYULUHAN --- */}
        <TouchableOpacity style={styles.penyuluhanButton} onPress={handlePenyuluhanPress}>
          <Text style={styles.penyuluhanButtonText}>Informasi Penyuluhan</Text>
          <FontAwesome5 name="chalkboard-teacher" size={18} color="#66320F" />
        </TouchableOpacity>

        {/* List Bencana Horizontal */}
        <View style={styles.horizontalListSection}>
          <Text style={styles.horizontalListTitle}>Jenis Edukasi Bencana</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {displayedEducations.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.horizontalItemCard}
                onPress={() => handleEducationListPress(item.name)}>
                <Image source={item.image} style={styles.horizontalItemImage} />
                <Text style={styles.horizontalItemLabel}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* "Lihat Lebih Lengkap" button */}
          {hasMoreEducations && (
            <TouchableOpacity
              style={styles.viewMoreButton}
              onPress={() => setShowAllEducations(true)}
            >
              <Text style={styles.viewMoreText}>Tampilkan Lebih Lengkap</Text>
            </TouchableOpacity>
          )}

          {/* "Tampilkan Lebih Sedikit" button */}
          {showLessButton && (
            <TouchableOpacity
              style={[styles.viewMoreButton, styles.viewLessButton]}
              onPress={() => setShowAllEducations(false)}
            >
              <Text style={styles.viewMoreText}>Tampilkan Lebih Sedikit</Text>
            </TouchableOpacity>
          )}
        </View>
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
    width: '100%',
    backgroundColor: '#D48442',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
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
    justifyContent: 'center',
  },
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: 15,
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  laporSection: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  laporSectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  laporSectionSubtitle: {
    fontSize: 14,
    color: '#777',
    marginBottom: 20,
    textAlign: 'center',
  },
  laporButton: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#D2601A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
    elevation: 10,
  },
  laporText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  educationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#D4844230',
  },
  educationButtonText: {
    color: '#D48442',
    fontWeight: 'bold',
    fontSize: 16,
  },
  penyuluhanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#66320F30',
  },
  penyuluhanButtonText: {
    color: '#66320F',
    fontWeight: 'bold',
    fontSize: 16,
  },
  horizontalListSection: {
    marginBottom: 20,
    position: 'relative',
  },
  horizontalListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  horizontalScroll: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  horizontalItemCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    width: 120,
    height: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#D4844220',
  },
  horizontalItemImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  horizontalItemLabel: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
    fontWeight: 'bold',
  },
  viewMoreButton: {
    position: 'absolute',
    bottom: 0,
    right: 7,
    backgroundColor: '#D2601A',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    flexDirection: 'row',
  },
  viewMoreText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  viewLessButton: {
    right: 7, // Adjust position to be next to "Lihat Lebih Lengkap"
    backgroundColor: '#777', // A grey color to differentiate
  },
});

export default Homepage;
