import React from 'react'
import { View, TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

const PauseReset = props => {
   const icons = ['pause', 'replay']
   const { handlePauseOrReset, style, enabled } = props
   const handlePress = icon => {
      handlePauseOrReset(icon)
   }
   const iconStyle = {
      color: '#b30047',
      opacity: enabled === true ? 1 : 0.4
   }
   return (
      <View style={style}>
         {icons.map(icon => {
            return (
               <TouchableOpacity 
                  key={icon}
                  onPress={() => handlePress(icon)}
                  disabled={!enabled}
               >
                  <Icon
                     name={icon}
                     size={40}
                     style={iconStyle}
                  />
               </TouchableOpacity>
            )
         })}
      </View>
   )
}
export default PauseReset