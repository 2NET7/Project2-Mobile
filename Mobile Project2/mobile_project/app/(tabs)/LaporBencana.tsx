import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { dummyUsers } from '../api/dummyUsers';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ReportScreen() {
  const navigation = useNavigation();
  const router = useRouter();

  const [namaLengkap, setNamaLengkap] = useState(dummyUsers[3].name);
  const [tanggal, setTanggal] = useState(new Date());
  const [waktu, setWaktu] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [jenisBencana, setJenisBencana] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [desa, setDesa] = useState('');
  const [alamat, setAlamat] = useState('');
  const [media, setMedia] = useState<{ uri: string; type: string } | null>(null);

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

  const formatDate = (date: Date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const { data } = useLocalSearchParams();
  const laporan = data ? JSON.parse(data as string) : [];

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
        alert('Format file tidak didukung. Harap unggah file JPG, JPEG, PNG, atau MP4.');
      }
    }
  };

  const handleSubmit = async () => {
    const newLaporan = {
      id: Date.now(),
      namaLengkap,
      tanggal: formatDate(tanggal),
      waktu,
      jenisBencana,
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

      router.push('/Homepage');
    } catch (error) {
      console.error('Gagal menyimpan laporan:', error);
      alert('Terjadi kesalahan saat menyimpan laporan.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header tetap di atas */}
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
            />
          )}

          <Text style={styles.label}>Waktu Kejadian</Text>
          <TextInput style={styles.input} value={waktu} editable={false} />

          <Text style={styles.label}>Jenis Bencana</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={jenisBencana}
              onValueChange={(itemValue) => setJenisBencana(itemValue)}
            >
              <Picker.Item label="Pilih Jenis Bencana" value="" />
              <Picker.Item label="Tanah Longsor" value="Tanah Longsor" />
              <Picker.Item label="Gempa Bumi" value="Gempa Bumi" />
              <Picker.Item label="Banjir" value="Banjir" />
              <Picker.Item label="Erupsi Gunung Berapi" value="Erupsi Gunung Berapi" />
              <Picker.Item label="Angin Puting Beliung" value="Angin Puting Beliung" />
              <Picker.Item label="Tsunami" value="Tsunami" />
            </Picker>
          </View>

          <Text style={styles.label}>Kecamatan</Text>
          <TextInput
            style={styles.input}
            placeholder="Pilih Kecamatan"
            value={kecamatan}
            onChangeText={setKecamatan}
          />

          <Text style={styles.label}>Desa</Text>
          <TextInput
            style={styles.input}
            placeholder="Pilih Desa"
            value={desa}
            onChangeText={setDesa}
          />

          <Text style={styles.label}>Alamat Lengkap</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan Alamat Lengkap"
            value={alamat}
            onChangeText={setAlamat}
          />

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
              resizeMode="contain"/>
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
    height: 180,
    backgroundColor: '#D2601A',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    justifyContent: 'center',
    paddingTop: 40,
    zIndex: 10,
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
    marginTop: 180,
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 40,
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
});
