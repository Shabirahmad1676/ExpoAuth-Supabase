import { View, Text, Button } from 'react-native'
import React from 'react'
import { useAuth } from '../Providers/AuthProvider'
import { Redirect } from 'expo-router'

const index = () => {
    const {userName,signOut,session} = useAuth()

    if (!session) {
    return <Redirect href="/sign-in" />;
  }
  return (
    <View>
      <Text>Hey,{userName}</Text>
      <Button title={'Sign out'} onPress={signOut} />
    </View>
  )
}

export default index