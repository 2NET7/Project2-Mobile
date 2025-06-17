import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  Share,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AntDesign } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import JenisBencanaPicker from '../api/JenisBencanaPicker';
import LocationPickers from '../api/LocationPickers';
import { dummyUsers } from '../api/dummyUsers';

// Mendefinisikan tipe untuk state media
type MediaState = {
  uri: string;
  type: 'image' | 'video';
};

const ReportScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ mediaUri?: string; mediaType?: 'image' | 'video' }>();

  // States
  const [namaLengkap, setNamaLengkap] = useState<string>(dummyUsers[3].name);
  const [tanggal, setTanggal] = useState<Date>(new Date());
  const [waktu, setWaktu] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [jenisBencana, setJenisBencana] = useState<string>('');
  const [customJenisBencana, setCustomJenisBencana] = useState<string>('');
  const [kecamatan, setKecamatan] = useState<string>('Pilih Kecamatan');
  const [desa, setDesa] = useState<string>('Pilih Desa');
  const [alamat, setAlamat] = useState<string>('');
  const [media, setMedia] = useState<MediaState | null>(null);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false);
  const [isLocationShared, setIsLocationShared] = useState<boolean>(false);
  const [locationLink, setLocationLink] = useState<string>('');


  useEffect(() => {
    if (params.mediaUri && params.mediaType) {
      setMedia({ uri: params.mediaUri, type: params.mediaType });
    }
  }, [params]);

  useEffect(() => {
    const now = new Date();
    const jam = now.getHours().toString().padStart(2, '0');
    const menit = now.getMinutes().toString().padStart(2, '0');
    setWaktu(`${jam}:${menit}`);
  }, []);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setTanggal(selectedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      const jam = selectedTime.getHours().toString().padStart(2, '0');
      const menit = selectedTime.getMinutes().toString().padStart(2, '0');
      setWaktu(`${jam}:${menit}`);
    }
  };

  const formatDate = (date: Date) => `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  
  const handleMediaResult = (result: ImagePicker.ImagePickerResult) => {
    if (!result.canceled) {
      const selectedAsset = result.assets[0];
      if (selectedAsset.type === 'image' || selectedAsset.type === 'video') {
        setMedia({ uri: selectedAsset.uri, type: selectedAsset.type });
      } else {
        Alert.alert('Format Tidak Didukung', 'Harap pilih file gambar atau video.');
      }
    }
  };

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Izin Diperlukan', 'Aplikasi memerlukan izin galeri untuk melanjutkan.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    handleMediaResult(result);
  };
  
  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert('Izin Diperlukan', 'Aplikasi ini memerlukan izin kamera untuk melanjutkan.');
        return;
    }

    const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
    });
    
    handleMediaResult(result);
  };
  
  const handleAutoFillLocation = async () => {
    setLoadingLocation(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Izin Ditolak', 'Mohon izinkan akses lokasi untuk mengisi alamat otomatis.');
      setLoadingLocation(false);
      return;
    }

    try {
      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude, longitude } = location.coords;
      let addressArray = await Location.reverseGeocodeAsync({ latitude, longitude });
      
      if (addressArray.length > 0) {
        const address = addressArray[0];
        const formattedAddress = [address.street, address.streetNumber].filter(Boolean).join(' ');
        setAlamat(formattedAddress || 'Tidak ada nama jalan');
        if (address.district) setKecamatan(address.district);
        if (address.subdistrict) setDesa(address.subdistrict);
        Alert.alert('Lokasi Ditemukan', 'Alamat, kecamatan, dan desa berhasil diisi otomatis.');
      } else {
        Alert.alert('Gagal', 'Tidak dapat menemukan alamat dari lokasi Anda.');
      }
    } catch (error) {
      console.error('Gagal mendapatkan lokasi:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat mencoba mendapatkan lokasi Anda.');
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleAddLocationLink = async () => {
    setLoadingLocation(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Izin Ditolak', 'Mohon izinkan akses lokasi untuk menambahkan link ke laporan.');
      setLoadingLocation(false);
      return;
    }
    try {
      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude, longitude } = location.coords;
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      
      setLocationLink(googleMapsUrl);
      setIsLocationShared(true); 
      Alert.alert("Link Lokasi Ditambahkan", "Link lokasi Google Maps telah ditambahkan ke laporan Anda.");

    } catch (error) {
      console.error('Gagal menambahkan link lokasi:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat mencoba mendapatkan lokasi Anda.');
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleSubmit = async () => {
    const finalJenisBencana = jenisBencana === 'Lainnya' ? customJenisBencana : jenisBencana;

    if (!namaLengkap || !finalJenisBencana || kecamatan === 'Pilih Kecamatan' || desa === 'Pilih Desa' || !alamat) {
      Alert.alert('Form Belum Lengkap', 'Mohon lengkapi semua kolom yang wajib diisi.');
      return;
    }
    const newLaporan = { 
      id: Date.now(), 
      namaLengkap, 
      tanggal: formatDate(tanggal), 
      waktu, 
      jenisBencana: finalJenisBencana, 
      kecamatan, 
      desa, 
      alamat, 
      mediaUri: media?.uri || '', 
      mediaType: media?.type || '',
      locationLink: locationLink, 
    };
    try {
      const existingData = await AsyncStorage.getItem('riwayatLaporan');
      const parsedData = existingData ? JSON.parse(existingData) : [];
      const updatedList = [...parsedData, newLaporan];
      await AsyncStorage.setItem('riwayatLaporan', JSON.stringify(updatedList));
      Alert.alert('Laporan Terkirim', 'Laporan bencana Anda berhasil dikirim!');
      router.push('/Homepage');
    } catch (error) {
      console.error('Gagal menyimpan laporan:', error);
      Alert.alert('Terjadi Kesalahan', 'Gagal menyimpan laporan.');
    }
  };

  const today = new Date();
  const thirteenDaysAgo = new Date();
  thirteenDaysAgo.setDate(today.getDate() - 13);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.topShape}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/Homepage')}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Form Laporan Bencana</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Nama Lengkap</Text>
          <TextInput style={styles.input} value={namaLengkap} editable={false} />

          <Text style={styles.label}>Tanggal Kejadian</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
            <Text>{formatDate(tanggal)}</Text>
          </TouchableOpacity>
          {showDatePicker && <DateTimePicker value={tanggal} mode="date" display="default" onChange={handleDateChange} maximumDate={today} minimumDate={thirteenDaysAgo} />}

          <Text style={styles.label}>Waktu Kejadian</Text>
          <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.input}>
            <Text>{waktu}</Text>
          </TouchableOpacity>
          {showTimePicker && <DateTimePicker value={new Date(`2000-01-01T${waktu}:00`)} mode="time" display="spinner" onChange={handleTimeChange} is24Hour={true} />}

          <JenisBencanaPicker jenisBencana={jenisBencana} setJenisBencana={setJenisBencana} customJenisBencana={customJenisBencana} setCustomJenisBencana={setCustomJenisBencana} />
          <LocationPickers kecamatan={kecamatan} setKecamatan={setKecamatan} desa={desa} setDesa={setDesa} />

          <Text style={styles.label}>Alamat Lengkap</Text>
          <TextInput style={styles.input} placeholder="Masukkan Alamat atau Isi Otomatis" value={alamat} onChangeText={setAlamat} multiline numberOfLines={4} />

          <View style={styles.locationButtonsContainer}>
            <TouchableOpacity style={[styles.locationButton, styles.autoFillButton]} onPress={handleAutoFillLocation} disabled={loadingLocation}>
              {loadingLocation ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <AntDesign name="enviromento" size={18} color="white" />
                  <Text style={styles.locationButtonText}>Isi Otomatis</Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={[styles.locationButton, styles.shareLocationButton]} onPress={handleAddLocationLink} disabled={loadingLocation}>
              {loadingLocation ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <AntDesign name="link" size={18} color="white" />
                  <Text style={styles.locationButtonText}>Lampirkan Link</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
          
          {isLocationShared && (
            <View style={styles.placeholderContainer}>
              <AntDesign name="checkcircle" size={20} color="#27ae60" style={styles.placeholderIcon} />
              <View style={styles.placeholderTextContainer}>
                <Text style={styles.placeholderTitle}>Link Lokasi Ditambahkan:</Text>
                <TextInput
                  style={styles.placeholderLink}
                  value={locationLink}
                  editable={false}
                  multiline
                />
              </View>
            </View>
          )}

          <Text style={styles.label}>Bukti Foto / Video</Text>
          {/* --- PERUBAHAN: Tombol dipisahkan menjadi dua --- */}
          <View style={styles.mediaButtonsContainer}>
            <TouchableOpacity style={[styles.mediaButton, styles.cameraButton]} onPress={openCamera}>
              <AntDesign name="camerao" size={18} color="white" />
              <Text style={styles.mediaButtonText}>Buka Kamera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.mediaButton, styles.galleryButton]} onPress={openGallery}>
              <AntDesign name="picture" size={18} color="white" />
              <Text style={styles.mediaButtonText}>Pilih Galeri</Text>
            </TouchableOpacity>
          </View>


          {media?.type === 'image' && <Image source={{ uri: media.uri }} style={styles.previewMedia} />}
          {media?.type === 'video' && <Video source={{ uri: media.uri }} style={styles.previewMedia} useNativeControls resizeMode="contain" />}

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>LAPOR</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ReportScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF1E1' },
  topShape: { position: 'absolute', width: '100%', height: 100, backgroundColor: '#D2601A', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, justifyContent: 'center', paddingTop: 20, zIndex: 5 },
  backButton: { position: 'absolute', left: 20, top: 40, zIndex: 11 },
  headerText: { color: 'white', fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 10 },
  scrollView: { flex: 1, marginTop: 100 },
  scrollContainer: { alignItems: 'center', paddingBottom: 30 },
  formContainer: { width: '90%', backgroundColor: 'white', padding: 20, borderRadius: 12, elevation: 5 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#333', marginTop: 10 },
  input: { width: '100%', backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8, fontSize: 14, color: '#333', marginTop: 5, justifyContent: 'center' },
  previewMedia: { width: '100%', height: 200, marginTop: 10, borderRadius: 8 },
  button: { marginTop: 20, width: '100%', backgroundColor: '#D2601A', padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  locationButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  locationButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  locationButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  autoFillButton: { 
    backgroundColor: '#c0392b',
  },
  shareLocationButton: {
    backgroundColor: '#27ae60',
  },
  // --- STYLE BARU UNTUK TOMBOL MEDIA ---
  mediaButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    gap: 10,
  },
  mediaButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  mediaButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cameraButton: {
    backgroundColor: '#34495e', // Warna abu-abu gelap
  },
  galleryButton: {
    backgroundColor: '#8e44ad', // Warna ungu
  },
  placeholderContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#e8f8f5',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  placeholderIcon: {
    marginRight: 10,
    marginTop: 3,
  },
  placeholderTextContainer: {
    flex: 1,
  },
  placeholderTitle: {
    color: '#2c3e50',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  placeholderLink: {
    color: '#3498db',
    fontSize: 12,
  },
});
