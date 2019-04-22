import React from 'react'
import { 
   View,
   Button, 
   ImageBackground, 
   StyleSheet, 
   LayoutAnimation, 
   UIManager, 
   Platform
} from 'react-native'
import Logo from '../components/Logo'

if (
   Platform.OS === 'android' &&
   UIManager.setLayoutAnimationEnabledExperimental
 ) {
   UIManager.setLayoutAnimationEnabledExperimental(true);
 }
 
class Start extends React.Component {

   async componentDidMount() {
      const animation = LayoutAnimation.create(
         1500,
         LayoutAnimation.Types.easeInEaseOut,
         LayoutAnimation.Properties.opacity
      )
      LayoutAnimation.configureNext(animation)
   }

   handlePressGo = () => {
      const { onPressGo } = this.props
      onPressGo()
   }
   render() {
      return (
         <View style={styles.container}>
            <ImageBackground 
               source={require('../assets/splash.png')}
               style={styles.imageContainer}
               imageStyle={styles.image}
            >
               <View style={styles.logoContainer}>
                  <Logo />
               </View>
               <View style={styles.button}>
                  <Button
                     title="Go!"
                     color='red'
                     onPress={this.handlePressGo}
                  />
               </View>
            </ImageBackground>  
         </View>
             
      )
   }
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   imageContainer: {
      flex: 1,
   },
   image: {
      flex: 1,
      width: null,
      height: null,
      resizeMode: 'cover'
   },
   logoContainer: {
      flex: 1,
      paddingTop: 110,
   },
   button: {
      width: 100,
      height: 30,
      marginBottom: 30,
      alignSelf: 'center'
   }
})
export default Start