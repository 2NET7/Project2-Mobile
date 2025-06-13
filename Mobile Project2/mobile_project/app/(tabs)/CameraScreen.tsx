import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator } from 'react-native';
// --- PERUBAHAN: Menghapus 'CameraType' dan hanya menggunakan 'Camera' ---
import { Camera, FlashMode } from 'expo-camera'; 
// Pastikan GestureHandlerRootView sudah membungkus aplikasi Anda di file layout utama (misal: app/_layout.tsx)
import { PinchGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Video } from 'expo-av';

/* CATATAN PENTING:
  Fitur zoom menggunakan 'react-native-gesture-handler'. Jika belum terpasang, jalankan:
  npx expo install react-native-gesture-handler
  Dan pastikan file layout utama Anda (misal: app/_layout.tsx) dibungkus oleh <GestureHandlerRootView style={{ flex: 1 }}>
*/

// Mendefinisikan tipe untuk media yang ditangkap
type CapturedMediaType = {
  uri: string;
  type: 'image' | 'video';
};

const CameraScreen: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  // --- PERBAIKAN: Menggunakan Camera.Constants.Type untuk nilai awal yang lebih aman ---
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [capturedMedia, setCapturedMedia] = useState<CapturedMediaType | null>(null);
  const [captureMode, setCaptureMode] = useState<'photo' | 'video'>('photo');
  const [isCameraReady, setIsCameraReady] = useState<boolean>(false);
  const [flashMode, setFlashMode] = useState<FlashMode>(FlashMode.off);
  const [zoom, setZoom] = useState<number>(0);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);

  const cameraRef = useRef<Camera>(null);
  const router = useRouter();
  const baseZoom = useRef(0);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      const microphoneStatus = await Camera.requestMicrophonePermissionsAsync();
      setHasPermission(cameraStatus.status === 'granted' && microphoneStatus.status === 'granted');
    })();
  }, []);

  useEffect(() => {
    if (isRecording) {
        timerInterval.current = setInterval(() => {
            setRecordingDuration((prev) => prev + 1);
        }, 1000);
    } else {
        if (timerInterval.current) {
            clearInterval(timerInterval.current);
        }
        setRecordingDuration(0);
    }
    return () => {
        if (timerInterval.current) {
            clearInterval(timerInterval.current);
        }
    };
  }, [isRecording]);

  const handleFlipCamera = () => {
    // --- PERBAIKAN: Menggunakan Camera.Constants.Type untuk membalik kamera ---
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const handleToggleFlash = () => {
    if (flashMode === FlashMode.off) {
      setFlashMode(FlashMode.on);
    } else if (flashMode === FlashMode.on) {
      setFlashMode(FlashMode.auto);
    } else {
      setFlashMode(FlashMode.off);
    }
  };
  
  const onPinchGestureEvent = (event: any) => {
    const newZoom = baseZoom.current * event.nativeEvent.scale;
    setZoom(Math.min(1, Math.max(0, newZoom)));
  };

  const onPinchStateHandlerChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      baseZoom.current = zoom;
    }
  };

  const handleTakePhoto = async () => {
    if (cameraRef.current && !isRecording) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ 
          quality: 0.7,
          flash: flashMode,
        });
        setCapturedMedia({ uri: photo.uri, type: 'image' });
      } catch (error) {
        console.error('Gagal mengambil foto:', error);
        Alert.alert('Error', 'Gagal mengambil foto.');
      }
    }
  };

  const startRecording = async () => {
    if (!cameraRef.current || isRecording) return;
    
    setIsRecording(true);
    try {
        const options = {
            quality: Camera.Constants.VideoQuality['720p'],
            maxDuration: 60,
        };
        const videoData = await cameraRef.current.recordAsync(options);
        setCapturedMedia({ uri: videoData.uri, type: 'video' });
    } catch (error) {
        console.error('Error saat merekam:', error);
        Alert.alert('Error', 'Gagal memulai rekaman.');
    } finally {
        setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
        cameraRef.current.stopRecording();
    }
  };

  const handleToggleRecord = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  const handleCapture = () => {
    if (captureMode === 'photo') {
      handleTakePhoto();
    } else {
      handleToggleRecord();
    }
  };

  const handleUseMedia = () => {
    if (capturedMedia) {
        router.replace({ pathname: '/ReportScreen', params: { mediaUri: capturedMedia.uri, mediaType: capturedMedia.type } });
    }
  };
  
  const handleRetake = () => {
    setCapturedMedia(null);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (hasPermission === null) {
    return <View style={styles.permissionContainer}><Text>Meminta izin...</Text></View>;
  }
  if (hasPermission === false) {
    return <View style={styles.permissionContainer}><Text>Akses kamera tidak diizinkan.</Text></View>;
  }
  
  if (capturedMedia) {
      return (
          <View style={styles.container}>
              {capturedMedia.type === 'image' ? (
                  <Image source={{ uri: capturedMedia.uri }} style={styles.preview} />
              ) : (
                  <Video
                      source={{ uri: capturedMedia.uri }}
                      style={styles.preview}
                      useNativeControls
                      resizeMode="contain"
                      isLooping
                  />
              )}
              <View style={styles.previewButtonContainer}>
                  <TouchableOpacity onPress={handleRetake} style={styles.previewButton}>
                      <AntDesign name="close" size={24} color="white" />
                      <Text style={styles.previewButtonText}>Ambil Ulang</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleUseMedia} style={[styles.previewButton, styles.useButton]}>
                      <AntDesign name="check" size={24} color="white" />
                      <Text style={styles.previewButtonText}>Gunakan</Text>
                  </TouchableOpacity>
              </View>
          </View>
      )
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PinchGestureHandler
        onGestureEvent={onPinchGestureEvent}
        onHandlerStateChange={onPinchStateHandlerChange}
        enabled={isCameraReady && !isRecording}
      >
        <View style={styles.container}>
          <Camera 
            style={styles.camera} 
            type={cameraType} 
            ref={cameraRef} 
            ratio="16:9"
            flash={flashMode}
            zoom={zoom}
            onCameraReady={() => setIsCameraReady(true)}
          >
            {!isCameraReady && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fff" />
              </View>
            )}

            <View style={styles.topControlsContainer}>
                {isRecording && (
                  <View style={styles.timerContainer}>
                    <View style={styles.recordingIndicator} />
                    <Text style={styles.timerText}>{formatTime(recordingDuration)}</Text>
                  </View>
                )}
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={handleToggleFlash}
                  disabled={!isCameraReady || isRecording}
                >
                    <MaterialIcons 
                      name={
                          flashMode === FlashMode.on ? 'flash-on' : 
                          flashMode === FlashMode.auto ? 'flash-auto' : 'flash-off'
                      } 
                      size={28} 
                      color="white" />
                </TouchableOpacity>
            </View>

            <View style={styles.bottomControlsContainer}>
              <View style={styles.mainControlsContainer}>
                <TouchableOpacity 
                  style={styles.controlButton} 
                  onPress={handleFlipCamera} 
                  disabled={!isCameraReady || isRecording}
                >
                   <MaterialIcons name="flip-camera-ios" size={28} color="white" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.captureButtonOuter} 
                  onPress={handleCapture}
                  disabled={!isCameraReady}
                >
                   <View style={isRecording && captureMode === 'video' ? styles.captureButtonRecording : styles.captureButtonInner} />
                </TouchableOpacity>

                <View style={styles.controlButton} />
              </View>

              <View style={styles.modeContainer}>
                  <TouchableOpacity 
                    onPress={() => setCaptureMode('photo')} 
                    disabled={!isCameraReady || isRecording}
                  >
                      <Text style={[styles.modeText, captureMode === 'photo' && styles.modeTextActive]}>FOTO</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => setCaptureMode('video')} 
                    disabled={!isCameraReady || isRecording}
                  >
                      <Text style={[styles.modeText, captureMode === 'video' && styles.modeTextActive]}>VIDEO</Text>
                  </TouchableOpacity>
              </View>
            </View>
          </Camera>
        </View>
      </PinchGestureHandler>
    </GestureHandlerRootView>
  );
}

export default CameraScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    camera: {
        flex: 1,
        justifyContent: 'space-between',
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    topControlsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingTop: 40,
        paddingHorizontal: 20,
    },
    timerContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    recordingIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'red',
        marginRight: 8,
    },
    timerText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    bottomControlsContainer: {
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    mainControlsContainer: { 
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical: 10,
    },
    captureButtonOuter: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureButtonInner: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'white',
    },
    captureButtonRecording: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: 'red',
    },
    controlButton: {
        padding: 10,
        width: 50,
        alignItems: 'center',
    },
    preview: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    previewButtonContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingVertical: 20,
    },
    previewButton: {
        alignItems: 'center',
        flexDirection: 'row',
        padding: 10,
    },
    previewButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    useButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 10
    },
    modeContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20,
        paddingTop: 10,
    },
    modeText: {
        color: 'gray',
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 15,
    },
    modeTextActive: {
        color: '#FFC107',
        fontSize: 18,
    }
});
