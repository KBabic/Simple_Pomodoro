import React from 'react'
import Video from 'react-native-video'
import { Alert, View } from 'react-native'

const Sound = props => {
   const { paused, sound } = props
   if (sound !== null) {
      return <Video
            source={sound}
            onError={() => Alert.alert(
               'Sound Alert',
               'Error playing sound',
               [
                  {text: 'OK', onPress: () => console.log('OK pressed')}
               ]
            )}
            poster='../assets/icon_small.png'
            audioOnly={true}
            paused={paused}
            muted={false}
            playInBackground={true}
            style={{ width: 0, height: 0 }}
         />
   } else {
      return <View />
   }
}
export default Sound