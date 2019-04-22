import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';

import Start from './screens/Start'
import Pomodoro from './screens/Pomodoro'

export default class App extends React.Component {
  state = {
    timerRunning: false
  }
  onPressGo = () => {
    this.setState({
      timerRunning: true
    })
  }
  render() {
    const { timerRunning } = this.state

    return (
      <View style={styles.container}>
        <StatusBar barStyle='light-content' />
        {!timerRunning && (
          <Start onPressGo={this.onPressGo}/>
        )}
        {timerRunning && (
          <Pomodoro />
        )}
      </View>
    )
    
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
});
