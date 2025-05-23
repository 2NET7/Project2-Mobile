import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { dummyPenyuluhan } from '../api/dummyPenyuluhan';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';


export default function DetailPenyuluhanScreen() {
  const { id } = useLocalSearchParams();
  const detail = dummyPenyuluhan.find((item) => item.id === id);
  const navigation = useNavigation();
  const router = useRouter();

  if (!detail) {
    return <Text>Penyuluhan tidak ditemukan</Text>;
  }

  return (
    <View style={styles.container}>
        <View>
            <TouchableOpacity  style={styles.backButton} onPress={() => router.push('/PenyuluhanScreen')}>
                <AntDesign name="arrowleft" size={24} color="white" />
            </TouchableOpacity>
        </View>
      <Text style={styles.title}>{detail.tema}</Text>
      <Text>{detail.tanggal}</Text>
      <Text>{detail.lokasi}</Text>
      <Text>{detail.deskripsi}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFF1E1',
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 40,
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D2601A',
    marginBottom: 8,
  },
});
