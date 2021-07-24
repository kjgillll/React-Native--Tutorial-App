import React,{useState,useEffect}from  'react';  
import {Text, View, StyleSheet} from 'react-native'; 
import {fontSizes,  spacing} from '../utils/sizes'; 
import {colors} from '../utils/colors';

const minutestoMillis = (min) => min * 1000 * 60;
const formatTime = (time) => time < 10 ? `0${time}` : time; 
export const Countdown = ({
  minutes = 20,  
  isPaused,
  onProgress,
  onEnd
}) => { 
  const [millis, setMills] = useState(minutestoMillis(minutes));  
  const  minute = Math.floor(millis /1000 / 60 )%60; 
  const  seconds = Math.floor(millis/1000) % 60; 
  const interval = React.useRef(null);
  
  const countDown = () => {
    setMills((time) => {
      if(time === 0) {
        clearInterval(interval.current)
        onEnd();
        return time;
      }
      const timeLeft = time - 1000;  
      onProgress(timeLeft / minutestoMillis(minutes))
      return timeLeft;
    })
  } 
  
  useEffect(()=>{
    setMills(minutestoMillis(minutes))
  },[minutes])

  useEffect(()=>{
    if(isPaused){ 
      if(interval.current) clearInterval(interval.current);
      return;
    }
    interval.current = setInterval(countDown, 1000); 

    return () => clearInterval(interval.current);
  },[isPaused])

  return (
    <Text style={styles.text}>{formatTime(minute)}:{formatTime(seconds)}</Text>
  )

} 

const styles = StyleSheet.create({
  text: {
    color: colors.white, 
    fontSize: fontSizes.xxxl, 
    fontWeight: 'bold', 
    padding: spacing.lg, 
    backgroundColor: 'rgba(94,132,226,0.3)' ,

  }
})
