import React,{useState} from 'react';
import {Text, View,  StyleSheet,Vibration,Platform}  from 'react-native'; 
import {colors} from '../../utils/colors';  
import {fontSizes,  spacing} from '../../utils/sizes';
import {Countdown} from  '../../components/Countdown'; 
import {RoundedButton} from '../../components/RoundedButton'; 
import {ProgressBar} from 'react-native-paper' 
import {Timing} from './Timing'
import { useKeepAwake } from 'expo-keep-awake'; 

const DEFAULT_TIME = 0.1;

export const Timer = ({focusSubject, onTimerEnd, clearSubject}) => {  
  useKeepAwake()
  const [minutes, setMinutes] = useState(.1)
  const [isStarted, setIsStarted] =  useState(false); 
  const [progress, setProgress] = useState(1); 

  const onProgress = (progress) => {
    setProgress(progress)
  } 

  const vibrate = () => {
    if(Platform.OS === 'ios') {
      const interval = setInterval(()=> Vibration.vibrate(),1000); 
      setTimeout(() =>  clearInterval(interval),10000);
    }else{
      Vibration.vibrate(10000)
    }
  }

  const onEnd  = () => {
    vibrate();
    setMinutes(DEFAULT_TIME);
    setProgress(DEFAULT_TIME);
    setIsStarted(false);
    onTimerEnd();
  }
  
  const changeTime = (min) =>  {
    setMinutes(min);
    setProgress(1);
    setIsStarted(false);
  }

  return (
    <View  sytle={styles.container}> 
      <View  style={styles.countdown}>
        <Countdown 
          minutes={minutes} 
          isPaused={!isStarted} 
          onProgress={onProgress}
          onEnd={onEnd}
        />
      </View>
      <View style={{paddingTop: spacing.xxl}}>
        <Text style={styles.title}>Focusing on:</Text>
        <Text style={styles.task}>{focusSubject}</Text>
      </View>  
      <View  style={{paddingTop: spacing.xxl}}>
        <ProgressBar  
          progress={progress}
          color='#5E84E2'
          style={{height: 10}}
        />  
      </View> 
      <View style={styles.buttonWrapper}>
        <Timing onChangeTime={changeTime}/>
      </View>
      <View style={styles.buttonWrapper}>
        {!isStarted ? (
        <RoundedButton
          title='start' 
          onPress={()=> setIsStarted(true)}
          />  
        ):(
        <RoundedButton
          title='pause' 
          onPress={()=> setIsStarted(false)}
          />
        )} 
      </View>  
      <View style={styles.clearSubject}>
        <RoundedButton 
          title='-'  
          size={50}
          onPress={()=> clearSubject()}
        /> 
      </View>
    </View>
  );
}  

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }, 
  title: {
    color: colors.white,  
    textAlign: 'center',
  }, 
  task: {
    color: colors.white,  
    textAlign: 'center', 
    fontWeight: 'bold'
  }, 
  countdown: { 
    alignItems: 'center',
    justifyContent: 'center',
  }, 
  buttonWrapper: {
    flex: 0.5, 
    flexDirection: 'row', 
    paddingTop: 100,
    padding: 15,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  clearSubject: {
    paddingTop: 180,
    paddingLeft: 25,
  },
});