import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

const Parameter = props => {

   const handleChangeValue = (sign) => {
      const { title, value, onChangeValue } = props
      const intValue = parseInt(value)
      
      switch (sign) {
         case "+":
            const incValue = intValue + 1
            onChangeValue(title, incValue.toString())
            break
         case "-":
            const decValue = intValue - 1
            if (decValue <= 0) {
               onChangeValue(title, '1')
            } else {
               onChangeValue(title, decValue.toString())
            }
      }
   }
   
   const { color, title, value, enabled } = props
   const { 
         container,
         titleStyle,
         valueStyle,
         valueText,
         plusMinusContainer
   } = styles
   const opacity = enabled ? 1 : 0.4
   return (
      <View style={container}>
         <Text style={[titleStyle, {color}]}>{title}</Text>
   
         <View style={[valueStyle, {borderColor: color}]}>
            <Text style={[valueText, {color}]}>{value}</Text>
         </View>
   
         <View style={plusMinusContainer}>
            <TouchableOpacity 
               onPress={() => handleChangeValue("-")}
               disabled={!enabled}
            >
               <Text 
                  style={[valueText, {color, fontSize: 34, opacity} ]}>
                  -
               </Text>
            </TouchableOpacity>
   
            <TouchableOpacity 
               onPress={() => handleChangeValue("+")}
               disabled={!enabled}
            >
               <Text style={[valueText, {color, fontSize: 34, opacity }]}>
                  +
               </Text>
            </TouchableOpacity>
         </View>
      </View>
   )
}
   


const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
   },
   titleStyle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 7,
      textAlign: 'center'
   },
   valueStyle: {
      width: 60,
      height: 60,
      borderRadius: 60/2,
      borderWidth: 2,
      justifyContent: 'center'
   },
   valueText: {
      fontSize: 22,
      textAlign: 'center'
   },
   plusMinusContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: 60,
      height: 100
   }
})

export default Parameter