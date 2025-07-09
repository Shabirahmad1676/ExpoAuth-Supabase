import { FileObject } from '@supabase/storage-js'
import { Image, View, Text, TouchableOpacity } from 'react-native'
import { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../utils/supabase'

const ImageItem = ({ item, userId, onRemoveImage }) => {
  const [image, setImage] = useState(null)

  useEffect(() => {
    const loadImage = async () => {
      const { data } = await supabase.storage
        .from('file')
        .download(`${userId}/${item.name}`)
      if (data) {
        const fr = new FileReader() //Data is  blob which cannot be render directly so we convert into base64 string using this filereader 
        fr.readAsDataURL(data)
        fr.onload = () => {
          setImage(fr.result)//so string store here 
        }
      }
    }
    loadImage()
  }, [item.name])

  return (
    <View style={{ flexDirection: 'row', margin: 1, alignItems: 'center', gap: 5 }}>
      {image ? (
        <Image style={{ width: 80, height: 80 }} source={{ uri: image }} />
      ) : (
        <View style={{ width: 80, height: 80, backgroundColor: '#1A1A1A' }} />
      )}
      <Text style={{ flex: 1, color: '#fff' }}>{item.name}</Text>
      <TouchableOpacity onPress={onRemoveImage}>
        <Ionicons name="trash-outline" size={20} color={'#fff'} />
      </TouchableOpacity>
    </View>
  )
}

export default ImageItem
