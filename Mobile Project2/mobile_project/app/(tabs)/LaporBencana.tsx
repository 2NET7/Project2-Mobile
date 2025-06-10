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
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { dummyUsers } from '../api/dummyUsers';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Diimpor untuk akses lokasi GPS
import * as Location from 'expo-location'; // Import Location
import JenisBencanaPicker from '../api/JenisBencanaPicker';
import LocationPickers from '../api/LocationPickers';

export default function ReportScreen() {
  const navigation = useNavigation();
  const router = useRouter();

  const [namaLengkap, setNamaLengkap] = useState(dummyUsers[3].name);
  const [tanggal, setTanggal] = useState(new Date());
  const [waktu, setWaktu] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [jenisBencana, setJenisBencana] = useState('');
  const [customJenisBencana, setCustomJenisBencana] = useState('');

  const [kecamatan, setKecamatan] = useState('Pilih Kecamatan');
  const [desa, setDesa] = useState('Pilih Desa');

  const [alamat, setAlamat] = useState('');
  const [media, setMedia] = useState<{ uri: string; type: string } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    const now = new Date();
    const jam = now.getHours().toString().padStart(2, '0');
    const menit = now.getMinutes().toString().padStart(2, '0');
    setWaktu(`${jam}:${menit}`);
  }, []);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setTanggal(selectedDate);
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const jam = selectedTime.getHours().toString().padStart(2, '0');
      const menit = selectedTime.getMinutes().toString().padStart(2, '0');
      setWaktu(`${jam}:${menit}`);
    }
  };

  const formatDate = (date: Date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const { data } = useLocalSearchParams();

  const pickMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selected = result.assets[0];
      const uri = selected.uri.toLowerCase();

      const allowedExtensions = ['.jpg', '.jpeg', '.mp4', '.png'];
      const isAllowed = allowedExtensions.some(ext => uri.endsWith(ext));

      if (isAllowed) {
        setMedia({ uri: selected.uri, type: selected.type });
      } else {
        Alert.alert('Format File Tidak Didukung', 'Harap unggah file JPG, JPEG, PNG, atau MP4.');
      }
    }
  };

  const handleGetLocation = async () => {
    setLoadingLocation(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Izin Lokasi Ditolak', 'Mohon berikan izin akses lokasi untuk mengisi alamat secara otomatis.');
      setLoadingLocation(false);
      return;
    }

    try {
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const dummyAddress = `Jalan Contoh No. 123, Desa Dummy, Kecamatan Dummy, Subang`;
      setAlamat(dummyAddress);

      Alert.alert('Lokasi Ditemukan', 'Alamat berhasil diisi secara otomatis.');

    } catch (error) {
      console.error('Gagal mendapatkan lokasi:', error);
      Alert.alert('Gagal Mendapatkan Lokasi', 'Terjadi kesalahan saat mencoba mendapatkan lokasi Anda.');
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

    if (jenisBencana === 'Lainnya' && !customJenisBencana.trim()) {
      Alert.alert('Jenis Bencana Tidak Boleh Kosong', 'Mohon masukkan jenis bencana lainnya.');
      return;
    }

    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(waktu)) {
      Alert.alert('Format Waktu Salah', 'Mohon masukkan waktu dengan format HH:MM (contoh: 14:30).');
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
      Alert.alert('Terjadi Kesalahan', 'Terjadi kesalahan saat menyimpan laporan.');
    }
  };

  // Calculate the minimum selectable date (13 days ago from today)
  const today = new Date();
  const thirteenDaysAgo = new Date();
  thirteenDaysAgo.setDate(today.getDate() - 13); // Changed from -14 to -13

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header fixed at the top */}
      <View style={styles.topShape}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/Homepage')}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Form Laporan Bencana</Text>
      </View>

      {/* Scrollable content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <Text style={styles.label}>Nama Lengkap</Text>
          <TextInput style={styles.input} value={namaLengkap} editable={false} />

          <Text style={styles.label}>Tanggal Kejadian</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
            <Text>{formatDate(tanggal)}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={tanggal}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              maximumDate={today} // Restrict to today or past
              minimumDate={thirteenDaysAgo} // Now restricted to no older than 13 days ago
            />
          )}

          <Text style={styles.label}>Waktu Kejadian</Text>
          <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.input}>
            <Text>{waktu}</Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={new Date(`2000-01-01T${waktu}:00`)}
              mode="time"
              display="spinner"
              onChange={handleTimeChange}
              is24Hour={true}
            />
          )}

          {/* Calling JenisBencanaPicker component */}
          <JenisBencanaPicker
            jenisBencana={jenisBencana}
            setJenisBencana={setJenisBencana}
            customJenisBencana={customJenisBencana}
            setCustomJenisBencana={setCustomJenisBencana}
          />

          {/* Calling LocationPickers component */}
          <LocationPickers
            kecamatan={kecamatan}
            setKecamatan={setKecamatan}
            desa={desa}
            setDesa={setDesa}
          />

          <Text style={styles.label}>Alamat Lengkap</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan Alamat Lengkap"
            value={alamat}
            onChangeText={setAlamat}
            multiline
            numberOfLines={4}
          />

          {/* Button to auto-fill location */}
          <TouchableOpacity
            style={[styles.button, styles.autoFillButton]}
            onPress={handleGetLocation}
            disabled={loadingLocation}
          >
            {loadingLocation ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Isi Otomatis Lokasi</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.label}>Bukti Foto / Video</Text>
          <TouchableOpacity onPress={pickMedia} style={styles.uploadButton}>
            <Text style={styles.uploadText}>Pilih Foto atau Video</Text>
          </TouchableOpacity>
          {media?.type === 'image' && (
            <Image source={{ uri: media.uri }} style={styles.previewMedia} />
          )}
          {media?.type === 'video' && (
            <Video
              source={{ uri: media.uri }}
              style={styles.previewMedia}
              useNativeControls
              resizeMode="contain"
            />
          )}

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>LAPOR</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF1E1' },
  topShape: {
    position: 'absolute',
    width: '100%',
    height: 100,
    backgroundColor: '#D2601A',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: 'center',
    paddingTop: 20,
    zIndex: 5,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 40,
    zIndex: 11,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  scrollView: {
    flex: 1,
    marginTop: 100,
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  formContainer: {
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  input: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  pickerContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginTop: 5,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 50,
    color: '#333',
  },
  uploadButton: {
    backgroundColor: '#E7E7E7',
    padding: 12,
    borderRadius: 8,
    marginTop: 5,
    alignItems: 'center',
  },
  uploadText: {
    color: '#555',
  },
  previewMedia: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 8,
  },
  button: {
    marginTop: 20,
    width: '100%',
    backgroundColor: '#D2601A',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  autoFillButton: {
    backgroundColor: '#FF0000',
    marginTop: 10,
  },
});
