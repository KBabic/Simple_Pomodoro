import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import BackgroundTimer from 'react-native-background-timer'

import Parameter from '../components/Parameter'
import Timer from '../components/Timer'
import PauseReset from '../components/PauseReset'
import Sound from '../components/Sound'
import styles from '../utils/styles'

State = {
   INITIAL: 'INITIAL',
   WORK: 'WORK',
   SHORT_BREAK: 'SHORT_BREAK',
   LONG_BREAK: 'LONG_BREAK'
}
breakSound = require('../assets/sounds/short_break_sound.mp4')
workSound = require('../assets/sounds/work_sound.mp4')
endSound = require('../assets/sounds/end_sound.mp4')
//breakSound = { uri: 'short_break_sound'}
//workSound = { uri: 'work_sound'}
//endSound = { uri: 'end_sound'}


class Pomodoro extends React.Component {
   constructor(props) {
      super(props)

      this.state = {
         work: {
            title: 'WORK',
            time: 25, //min
            running: false,
            count: 0,
            color: 'red'
         },
         shortBreak: {
            title: 'SHORT BREAK',
            time: 5, //min
            running: false,
            count: 0,
            color: 'green'
         },
         longBreak: {
            title: 'LONG BREAK',
            time: 20, //min
            running: false,
            count: 0,
            color: '#cc6600'
         },
         numOfCycles: {
            title: 'NUMBER OF CYCLES',
            value: 1,
            count: 0,
            color: '#b30047'
         },
         elapsed: 25*60*1000, //miliseconds
         buttonsEnabled: true,
         pauseResetEnabled: false,
         startEnabled: true,
         transitionState: State.INITIAL,
         sound: null,
         soundPaused: true
      }
   }
   componentWillUnmount() {
      BackgroundTimer.clearInterval(this.interval)
   }
   componentDidUpdate(prevProps, prevState) {
      const { elapsed, transitionState, numOfCycles, work, shortBreak, longBreak } = this.state

      // enable/disable buttons after pressing START
      if (
         transitionState !== State.INITIAL &&
         prevState.transitionState === State.INITIAL 
      ) {
         this.setState((prevState) => ({
            ...prevState,
            buttonsEnabled: false,
            startEnabled: false,
            pauseResetEnabled: true
         }))
      }
      // enable/disable buttons after pressing RESET
      if (
         transitionState === State.INITIAL &&
         prevState.transitionState !== State.INITIAL
      ) {
         this.setState((prevState) => ({
            ...prevState,
            buttonsEnabled: true,
            startEnabled: true,
            pauseResetEnabled: false
         }))
      }
      // start short break session
      if (
         prevState.shortBreak.count < 3*numOfCycles.value &&
         prevState.elapsed === 0 &&
         prevState.transitionState === State.WORK &&
         transitionState === State.WORK
      ) {
         this.setState((prevState) => ({
            ...prevState,
            elapsed: shortBreak.time*60*1000,
            work: {...prevState.work, running: false},
            longBreak: {...prevState.longBreak, running: false},
            shortBreak: {
               ...prevState.shortBreak, 
               running: true,
               count: 
                  prevState.shortBreak.count === 3 ? 
                  prevState.shortBreak.count :
                  prevState.shortBreak.count + 1
            },
            transitionState: State.SHORT_BREAK,
            soundPaused: true
         }))
      }
      // start work session
      if (
         numOfCycles.count < numOfCycles.value &&
         prevState.work.count < 4*numOfCycles.value &&
         prevState.elapsed === 0 &&
         (prevState.transitionState === State.SHORT_BREAK ||
         prevState.transitionState === State.LONG_BREAK) &&
         transitionState !== State.INITIAL
      ) {
         this.setState((prevState) => ({
            ...prevState,
            elapsed: work.time*60*1000,
            work: {
               ...prevState.work,
               running: true,
               count: prevState.work.count + 1
            },
            shortBreak: {...prevState.shortBreak, running: false},
            longBreak: {...prevState.longBreak, running: false},
            transitionState: State.WORK,
            soundPaused: true
         }))
      }
      // start long break session
      if (
         prevState.work.count % 4 === 0 &&
         prevState.shortBreak.count % 3 === 0 &&
         prevState.elapsed === 0 &&
         prevState.numOfCycles.count < prevState.numOfCycles.value &&
         prevState.transitionState === State.WORK
      ) {
         this.setState((prevState) => ({
            ...prevState,
            elapsed: longBreak.time*60*1000,
            work: {...prevState.work, running: false},
            shortBreak: {...prevState.shortBreak, running: false},
            longBreak: {
                  ...prevState.longBreak,
                  running: true,
                  count: prevState.longBreak.count + 1
               },
            transitionState: State.LONG_BREAK,
            numOfCycles: {
               ...prevState.numOfCycles,
               count: prevState.numOfCycles.count + 1
            },
            soundPaused: true
         }))
      }
      // what happens when all cycles are done
      if (
         parseInt(prevState.numOfCycles.count) === parseInt(prevState.numOfCycles.value) &&
         prevState.elapsed === 0 &&
         prevState.transitionState === State.LONG_BREAK
      ) {
         BackgroundTimer.clearInterval(this.interval)
         this.resetState()
      }
      // play sounds during the last 8 seconds of each section:
      if (elapsed === 8000 && prevState.elapsed !== 8000 && transitionState !== State.INITIAL) {
         this.playSound()
      }
      console.log(
         this.state.sound,
         this.state.soundPaused,
         this.state.elapsed
      )
   }
   
   onChangeValue = (title, val) => {
      const { work, shortBreak, longBreak, numOfCycles, elapsed } = this.state
      switch (title) {
         case work.title:
            this.setState((prevState) => ({
               ...prevState,
               work: { ...prevState.work, time: val },
               elapsed: work.running ? elapsed - 1000 : val*60*1000
            }))
            break
         case shortBreak.title:
            this.setState((prevState) => ({ 
               ...prevState,
               shortBreak: { ...prevState.shortBreak, time: val },
            }))
            break
         case longBreak.title:
            this.setState((prevState) => ({
               ...prevState,
               longBreak: { ...prevState.longBreak, time: val }
            }))
            break
         case numOfCycles.title:
            this.setState((prevState) => ({ 
               ...prevState,
               numOfCycles: { ...prevState.numOfCycles, value: val } 
            }))
      }
   }
   setTimerInterval = () => {
      this.interval = BackgroundTimer.setInterval(this.updateElapsed, 1000)
   }
   updateElapsed = () => {
      const { work, shortBreak, longBreak, elapsed } = this.state
      this.setState(prevState => ({
         ...prevState,
         elapsed: 
            (work.running || shortBreak.running || longBreak.running) ?
            elapsed - 1000 :
            elapsed
      }))
   }  
   handleStart = () => {      
      this.setState((prevState) => ({
         ...prevState,
         work: { 
            ...prevState.work, 
            running: true,
            count: prevState.work.count + 1
         },
         transitionState: State.WORK
      }))
      this.setTimerInterval()
   }
   resetState = () => {
      const { work } = this.state
      this.setState((prevState) => ({
         ...prevState,
         work: { ...prevState.work, running: false, count: 0 },
         shortBreak: {...prevState.shortBreak, running: false, count: 0},
         longBreak: {...prevState.longBreak, running: false, count: 0},
         numOfCycles: {...prevState.numOfCycles, count: 0},
         elapsed: work.time*60*1000,
         transitionState: State.INITIAL,
         sound: null,
         soundPaused: true
      }))
      BackgroundTimer.clearInterval(this.interval)
      
   }
   handlePauseOrReset = (icon) => {
      const { transitionState } = this.state
      switch (icon) {
         case 'replay':
            this.resetState()
            break
         case 'pause':
         // check if the State is WORK, SHORT_BREAK or LONG_BREAK
            switch (transitionState) {
               case State.WORK:
                  this.setState((prevState) => ({
                     ...prevState,
                     soundPaused: !prevState.soundPaused,
                     work: { ...prevState.work, running: !prevState.work.running },
                  }))
                  break
               case State.SHORT_BREAK:
                  this.setState((prevState) => ({
                     ...prevState,
                     soundPaused: !prevState.soundPaused,
                     shortBreak: { ...prevState.shortBreak, running: !prevState.shortBreak.running },
                  }))
                  break
               case State.LONG_BREAK:
                  this.setState((prevState) => ({
                     ...prevState,
                     soundPaused: !prevState.soundPaused,
                     longBreak: { ...prevState.longBreak, running: !prevState.longBreak.running },
                  }))
                  break
            }
      }
   }
   setTimerColor = () => {
      const { shortBreak, longBreak, work, transitionState } = this.state
      switch (transitionState) {
         case State.SHORT_BREAK:
            return shortBreak.color
         case State.LONG_BREAK:
            return longBreak.color
         default:
            return work.color
      }
   }
   playSound = () => {
      switch (this.state.transitionState) {
         case State.WORK:
            this.setState(prevState => ({
               ...prevState,
               sound: breakSound,
               soundPaused: false
            }))
            break
         case State.SHORT_BREAK:
            this.setState(prevState => ({
               ...prevState,
               sound: workSound,
               soundPaused: false
            }))
            break
         case State.LONG_BREAK:
         // the last cycle:
         if (parseInt(this.state.numOfCycles.count) === parseInt(this.state.numOfCycles.value)) {
            this.setState(prevState => ({
               ...prevState,
               sound: endSound,
               soundPaused: false
            }))
         // not the last cycle:
         } else {
            this.setState(prevState => ({
               ...prevState,
               sound: workSound,
               soundPaused: false
            }))
         }
         break
      }
   }
   render() {
      const {  container, containerTop, containerMiddle, 
               containerBottom, titleContainer, titleText, 
               startButton, startButtonTxt,  iconsContainer
      } = styles
      const {  work, shortBreak, longBreak, numOfCycles, 
               buttonsEnabled, elapsed, pauseResetEnabled, 
               startEnabled, sound, soundPaused
      } = this.state
      const parameters = [ work, shortBreak, longBreak ]
      const startOpacity = startEnabled ? 1 : 0.4
      return(
         <View style={container}>

            <View style={titleContainer}>
               <Text style={titleText}>Set times in minutes:</Text>
            </View>

            <View style={containerTop}>         
            {parameters.map(param => {
               return (
                  <Parameter
                     key={param.title} 
                     title={param.title}
                     value={param.time}
                     color={param.color}
                     onChangeValue={this.onChangeValue}
                     enabled={buttonsEnabled}
                  />)
               })
            }
            </View>

            <View style={containerMiddle}>
               <Parameter 
                  title={numOfCycles.title}
                  value={numOfCycles.value}
                  color={numOfCycles.color}
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
                  color={this.setTimerColor()}
               />
               <PauseReset
                  style={iconsContainer}
                  handlePauseOrReset={this.handlePauseOrReset}
                  enabled={pauseResetEnabled}
               />
               <Sound 
                  paused={soundPaused}
                  sound={sound}
               />
            </View>
         </View> 
      )
   }
}
export default Pomodoro