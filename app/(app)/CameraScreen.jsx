import React, { useState, useRef,useEffect } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { View, Text, TouchableOpacity, StyleSheet, Button, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';

export default function CameraScreen() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [capturedImage, setCapturedImage] = useState(null);
  const cameraRef = useRef(null);


  useEffect(() => {
  if (!mediaPermission?.granted) {
    requestMediaPermission();
  }
}, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const __takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPreviewVisible(true);
      setCapturedImage(photo);

       const asset = await MediaLibrary.createAssetAsync(photo.uri);
    console.log('Saved to gallery:', asset.uri);
    }
  };

  const CameraPreview = ({ photo, onRetake }) => {
    return (
      <View style={{ flex: 1 }}>
        <Image source={{ uri: photo.uri }} style={{ flex: 1 }} />
        <TouchableOpacity
          onPress={onRetake}
          style={styles.retakeButton}
        >
          <Text style={{ color: 'black' }}>Retake</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {previewVisible && capturedImage ? (
        <CameraPreview
          photo={capturedImage}
          onRetake={() => {
            setCapturedImage(null);
            setPreviewVisible(false);
          }}
        />
      ) : (
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <MaterialIcons name='flip-camera-ios' color={'white'} size={50} />
            </TouchableOpacity>
          </View>

          <View style={styles.captureContainer}>
            <View style={styles.captureButtonWrapper}>
              <TouchableOpacity
                onPress={__takePicture}
                style={styles.captureButton}
              />
            </View>
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    position: 'absolute',
    bottom: 35,
    right: 110,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  captureContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    width: '100%',
    padding: 20,
    justifyContent: 'center',
  },
  captureButtonWrapper: {
    alignSelf: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'red',
  },
  retakeButton: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
  },
});
