import React from 'react'
import { View, TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

const PauseReset = props => {
   const icons = [props.icon, 'replay']
   const { handlePauseOrReset, style, enabled } = props
   const iconStyle = {
      color: '#b30047',
      opacity: enabled === true ? 1 : 0.4
   }
   return (
      <View style={style}>
         {icons.map(item => {
            return (
               <TouchableOpacity 
                  key={item}
                  onPress={() => handlePauseOrReset(item)}
                  disabled={!enabled}
               >
                  <Icon
                     name={item}
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
