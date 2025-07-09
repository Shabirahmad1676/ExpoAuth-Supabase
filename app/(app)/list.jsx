import React, { useEffect, useState } from 'react'
import { View, StyleSheet, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import { decode } from 'base64-arraybuffer'
import { supabase } from '../../utils/supabase'
import { useAuth } from '../../Providers/AuthProvider'
import ImageItem from '../../components/ImageItem'
import { useRouter, useLocalSearchParams } from 'expo-router'

export default function list() {
  const { user } = useAuth()
  const router = useRouter()
  const [files, setFiles] = useState([])
  const { photo } = useLocalSearchParams()



  useEffect(() => {
  if (photo && photo.base64) {
    uploadToSupabase(photo)
  }
}, [photo])

  useEffect(() => {
    if (!user) return
    loadImages()
  }, [user])

  const loadImages = async () => {
    const { data, error } = await supabase.storage.from('file').list(user.id)
    if (error) {
      console.log('List error:', error)
      return
    }
    setFiles(data)
  }

  const onSelectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: true,
    })

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const image = result.assets[0]
      const base64 = image.base64
      const fileName = Date.now() + '.jpg'

      const { error } = await supabase.storage
        .from('file')
        .upload(`${user.id}/${fileName}`, decode(base64), {
          contentType: 'image/jpeg',
        })

      if (error) {
        console.log('Upload error:', error)
      } else {
        loadImages()
      }
    }
  }

  const onRemoveImage = async (item, index) => {
  const { error } = await supabase.storage
    .from('file')
    .remove([`${user.id}/${item.name}`])
  if (error) {
    console.log('Remove error:', error)
  } else {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
  }
}


  return (
    <View style={styles.container}>
      {/* <ScrollView>
        {files.map((file) => (
          <Image
            key={file.name}
            source={{ uri: `https://quonuxvuxwavpuqcbxeb.supabase.co/storage/v1/object/public/files/${user.id}/${file.name}` }}
            style={{ width: 100, height: 100, marginBottom: 10 }}
          />
        ))}
      </ScrollView> */}

       {/* <ScrollView>
      {files.map((item, index) => (
        <ImageItem
          key={item.id}
          item={item}
          userId={user.id}
          onRemoveImage={() => onRemoveImage(item, index)}
        />
      ))}
    </ScrollView> */}

    
 <FlatList
  data={files}
  keyExtractor={(item) => item.name}
  numColumns={3}
  contentContainerStyle={{ gap: 10 }}
  columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 10 }}
  renderItem={({ item, index }) => (
    <ImageItem
      item={item}
      userId={user.id}
      onRemoveImage={() => onRemoveImage(item, index)}
    />
  )}
/> 

      {/* FAB to add images */}
      {/* <TouchableOpacity onPress={onSelectImage} style={styles.fab}>
        <Ionicons name="camera-outline" size={30} color={'#fff'} />
      </TouchableOpacity> */}

      <TouchableOpacity onPress={() => router.push('/CameraScreen')} style={styles.fab}>
  <Ionicons name="camera-outline" size={30} color={'#fff'} />
</TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#151515',
  },
  fab: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    position: 'absolute',
    bottom: 40,
    right: 30,
    height: 70,
    backgroundColor: '#2b825b',
    borderRadius: 100,
  },
})
