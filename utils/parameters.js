export const parameters = {
   work: {
      title: "WORK",
      value: 25,
      color: "red"
   },
   shortBreak: {
      title: "SHORT BREAK",
      value: 5,
      color: "green"
   },
   longBreak: {
      title: "LONG BREAK",
      value: 20,
      color: "#cc6600"
   },
   numOfCycles: {
      title: "NUMBER OF CYCLES",
      value: 1,
      color: "#b30047"
   }
}
export const oneCycle = [
   'work', 
   'shortBreak', 
   'work', 
   'shortBreak', 
   'work', 
   'shortBreak', 
   'work', 
   'longBreak'
]
export const getTotalCycles = (cycle, count) => {
   let totalCycles = []
   let i = 1
   while (i <= count) {
      totalCycles = [...cycle, ...totalCycles]
      i++
   }
   return totalCycles
}
export const breakSound = require('../assets/sounds/short_break_sound.mp4')
export const workSound = require('../assets/sounds/work_sound.mp4')
export const endSound = require('../assets/sounds/end_sound.mp4')