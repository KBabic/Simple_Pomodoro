import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import BackgroundTimer from 'react-native-background-timer'

import Parameter from '../components/Parameter'
import Timer from '../components/Timer'
import PauseReset from '../components/PauseReset'
import Sound from '../components/Sound'
import styles from '../utils/styles'
import { Session } from '../utils/Session'
import { parameters, oneCycle, getTotalCycles, workSound, breakSound, endSound } from '../utils/parameters'

class Pomodoro extends React.Component {
   constructor(props) {
      super(props)
      this.state = {
         cycle: Array.from(oneCycle),
         work: parameters.work.value,
         shortBreak: parameters.shortBreak.value,
         longBreak: parameters.longBreak.value,
         numOfCycles: parameters.numOfCycles.value,
         elapsed: parameters.work.value * 60 * 1000, // miliseconds
         buttonsEnabled: true,
         pauseResetEnabled: false,
         startEnabled: true,
         session: new Session(),
         pauseOrPlay: 'pause',
         playSound: false
      }
      this.totalCycles = getTotalCycles(this.state.cycle, this.state.numOfCycles)
   }
   componentDidMount() {
      this.setState({ elapsed: this.state.work * 60 * 1000 })
   }
   componentWillUnmount() {
      BackgroundTimer.clearInterval(this.interval)
   }
   onChangeValue = (title, val) => {
      const targetParam = Object.keys(parameters).filter(key => parameters[key].title === title)
      const target = targetParam[0]

      switch(target) {
         case 'work':
            this.setState({ work: val, elapsed: val * 60 *1000 })
            break
         case 'shortBreak':
            this.setState({ shortBreak: val })
            break
         case 'longBreak':
            this.setState({ longBreak: val })
            break
         case 'numOfCycles':
            this.setState({ numOfCycles: val })
            this.totalCycles = getTotalCycles(this.state.cycle, val)
      }
   }
   setTimerInterval = () => {
      this.interval = BackgroundTimer.setInterval(this.updateElapsed, 1000)
   }
   updateElapsed = () => {
      const { elapsed } = this.state
      if (elapsed === 8000) {
         this.playSound()
      }
      if ( elapsed === 0 ) {
         if (this.totalCycles.length === 0 ) {
            this.resetState()
         } else {
            BackgroundTimer.clearInterval(this.interval)
            this.handleStart()
         }
      } else {
         this.setState({ elapsed: elapsed - 1000 })
      }
   }
   setSessionDurationAndColor = (session) => {
      const targetParam = Object.keys(parameters).filter(key => key === session.type)
      session.duration = this.state[targetParam]
      session.color = parameters[targetParam].color
   }  
   setSessionSound = (session) => {
      switch(session.type) {
         case 'work':
            session.sound = breakSound
            break
         case 'shortBreak':
            session.sound = workSound
            break
         case 'longBreak':
            if (this.totalCycles.length === 0) {
               session.sound = endSound
            } else {
               session.sound = workSound
            }
      }
   }
   handleStart = () => {
      if (this.totalCycles.length === 0) {
         this.resetState()
      } else {
         BackgroundTimer.clearInterval(this.interval)
         const startedSession = new Session()
         startedSession.type = this.totalCycles.shift()
         this.setSessionDurationAndColor(startedSession)
         this.setSessionSound(startedSession)       
         this.setState({ 
            session: startedSession, 
            elapsed: startedSession.duration * 60 * 1000,
            pauseResetEnabled: true,
            startEnabled: false,
            buttonsEnabled: false,
            playSound: false
         })
         this.setTimerInterval()
      }
   }
   resetState = () => {
      BackgroundTimer.clearInterval(this.interval)
      this.setState({
         cycle: Array.from(oneCycle),
         work: parameters.work.value,
         shortBreak: parameters.shortBreak.value,
         longBreak: parameters.longBreak.value,
         numOfCycles: parameters.numOfCycles.value,
         elapsed: parameters.work.value * 60 * 1000,
         buttonsEnabled: true,
         pauseResetEnabled: false,
         startEnabled: true,
         session: new Session(),
         pauseOrPlay: 'pause',
         playSound: false
      })
      this.totalCycles = getTotalCycles(this.state.cycle, this.state.numOfCycles)
   }
   handlePauseOrReset = (icon) => {
      switch (icon) {
         case 'replay':
            this.resetState()
            break
         case 'pause':
            BackgroundTimer.clearInterval(this.interval)   
            this.setState({ pauseOrPlay: 'play-arrow', playSound: false })
            break
         case 'play-arrow':
            if (this.state.elapsed <= 8000) {
               this.setState({ pauseOrPlay: 'pause', playSound: true })
            } else {
               this.setState({ pauseOrPlay: 'pause' })
            }
            this.setTimerInterval()
      }
   }
   playSound = () => {
      this.setState({ playSound: true })
   }
   render() {
      const {  container, containerTop, containerMiddle, containerBottom, titleContainer, titleText, 
               startButton, startButtonTxt,  iconsContainer } = styles
      const {  buttonsEnabled, elapsed, pauseResetEnabled, startEnabled, 
               session, pauseOrPlay, playSound } = this.state
      
      const startOpacity = startEnabled ? 1 : 0.4
      return(
         <View style={container}>

            <View style={titleContainer}>
               <Text style={titleText}>Set times in minutes:</Text>
            </View>

            <View style={containerTop}>         
            {Object.keys(parameters).map(key => {
               if(key !== 'numOfCycles') {
                  return (
                  <Parameter
                     key={parameters[key].title} 
                     title={parameters[key].title}
                     value={this.state[key]}
                     color={parameters[key].color}
                     onChangeValue={this.onChangeValue}
                     enabled={buttonsEnabled}
                  />)
            }})}
            </View>

            <View style={containerMiddle}>
               <Parameter 
                  title={parameters.numOfCycles.title}
                  value={this.state.numOfCycles}
                  color={parameters.numOfCycles.color}
                  onChangeValue={this.onChangeValue}
                  enabled={buttonsEnabled} 
               />
            </View>

            <TouchableOpacity 
               onPress={this.handleStart}
               style={[startButton, { opacity: startOpacity }]}
               disabled={!startEnabled}
            >
               <Text 
                  style={[startButtonTxt, { opacity: startOpacity}]}
               >
                  START
               </Text>
            </TouchableOpacity> 

            <View style={containerBottom}>
               <Timer 
                  elapsed={elapsed}
                  color={session.color}
               />
               <PauseReset
                  icon={pauseOrPlay}
                  style={iconsContainer}
                  handlePauseOrReset={this.handlePauseOrReset}
                  enabled={pauseResetEnabled}
               />
               <Sound 
                  paused={!playSound}
                  sound={session.sound}
               />
            </View>
         </View> 
      )
   }
}
export default Pomodoro
