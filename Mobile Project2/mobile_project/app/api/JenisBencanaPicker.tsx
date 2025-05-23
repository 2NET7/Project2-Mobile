import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

// Komponen untuk memilih jenis bencana, termasuk opsi 'Lainnya'
const JenisBencanaPicker = ({ jenisBencana, setJenisBencana, customJenisBencana, setCustomJenisBencana }) => {
  return (
    <>
      <Text style={styles.label}>Jenis Bencana</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={jenisBencana || ''} // Pastikan selectedValue tidak undefined
          onValueChange={(itemValue) => {
            setJenisBencana(itemValue);
            if (itemValue !== 'Lainnya') {
              setCustomJenisBencana(''); // Kosongkan input kustom jika bukan 'Lainnya'
            }
          }}
          style={styles.picker}
        >
          <Picker.Item label="Pilih Jenis Bencana" value="" />
          <Picker.Item label="Tanah Longsor" value="Tanah Longsor" />
          <Picker.Item label="Gempa Bumi" value="Gempa Bumi" />
          <Picker.Item label="Banjir" value="Banjir" />
          <Picker.Item label="Erupsi Gunung Berapi" value="Erupsi Gunung Berapi" />
          <Picker.Item label="Angin Puting Beliung" value="Angin Puting Beliung" />
          <Picker.Item label="Tsunami" value="Tsunami" />
          <Picker.Item label="Lainnya" value="Lainnya" />
        </Picker>
      </View>

      {/* Input teks kondisional untuk 'Lainnya' */}
      {jenisBencana === 'Lainnya' && (
        <>
          <Text style={styles.label}>Jenis Bencana Lainnya</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan jenis bencana lainnya"
            value={customJenisBencana}
            onChangeText={setCustomJenisBencana}
          />
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
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
});

export default JenisBencanaPicker;
