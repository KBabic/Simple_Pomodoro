import React from 'react'
import { Image, StyleSheet } from 'react-native'
import logo from '../assets/logo.png'

function Logo () {
   return <Image style={styles.logo} source={logo} />
}
const styles = StyleSheet.create({
   logo: {
      width: null,
      height: null,
      resizeMode: 'contain',
      aspectRatio: 255 / 55,
   }
})

export default Logo

