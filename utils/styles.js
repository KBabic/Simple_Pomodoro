import React from 'react'
import { StyleSheet, StatusBar } from 'react-native'

const styles = StyleSheet.create({
   titleContainer: {
      justifyContent: 'center',
      paddingTop: StatusBar.currentHeight + 10
   },
   titleText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: "#b30047",
      textAlign: 'center'
   },
   container: {
      flex: 1,
      justifyContent: 'space-around',
      backgroundColor: '#ffe5cc',
      alignItems: 'center'
   },
   containerTop: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-end'
   },
   containerMiddle: {
      flex: 1,
      alignItems: 'center',
   },
   containerBottom: {
      flex: 2,
      alignItems: 'center',
   },
   startButton: {
      borderColor: '#b30047',
      borderWidth: 2,
      borderRadius: 10,
      width: 100
   },
   startButtonTxt: {
      color: '#b30047',
      fontSize: 22,
      fontWeight: 'bold',
      textAlign: 'center'
   },
   iconsContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
   }
})
export default styles