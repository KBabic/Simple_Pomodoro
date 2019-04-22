import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { millisecondsToHuman } from '../utils/TimerUtils'

const Timer = props => {
   const { elapsed, color } = props
   const elapsedString = millisecondsToHuman(elapsed);
   return (
      <View style={[styles.timerContainer, {borderColor: color}]}>
         <Text style={[styles.elapsedTime, {color}]}>
            {elapsedString}
         </Text>
      </View>
   )
}

const styles = StyleSheet.create({
   timerContainer: {
      backgroundColor: 'transparent',
      borderWidth: 3,
      borderRadius: 10,
      padding: 15,
      margin: 15,
      marginBottom: 0
  },
  elapsedTime: {
   fontSize: 40,
   fontWeight: 'bold',
   textAlign: 'center',
   paddingVertical: 15
},
})

export default Timer