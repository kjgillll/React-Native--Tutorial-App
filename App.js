import React, {useState,useEffect} from 'react';
import { Text, View, StyleSheet,Platform} from 'react-native';
import Constants from 'expo-constants';  
import {Focus} from './src/features/focus/focus';  
import {colors} from './src/utils/colors'; 
import {fontSizes,  spacing} from './src/utils/sizes';
import {Timer} from './src/features/timer/Timer';
import {FocusHistory} from './src/features/focus/FocusHistory';   
import AsyncStorage from '@react-native-async-storage/async-storage'

// You can import from local files
import AssetExample from './src/components/AssetExample';

// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';
const STATUSES = { 
  COMPLETE: 1,
  CANCELLED: 2
}

export default function App() {
  const [focusSubject, setFocusSubject] = useState(null);  
  const [focusHistory, setFocusHistory] = useState([])
  
  // useEffect(()=>{
  //   if(focusSubject){ 
  //     setFocusHistory([...focusHistory, focusSubject])
  //   }
  // },[focusSubject])
  const addFocusHistorySubjectWithState = (subject, status) => {
    setFocusHistory([...focusHistory, {subject,status}])
  } 

  const onClear = () => {
    setFocusHistory([])
  }

  const  saveFocusHistory = async () => {
    try{
      await AsyncStorage.setItem("focusHistory",JSON.stringify(focusHistory));
    }catch(e){
      console.log(e);
    }
  }   

  const loadFocusHistory = async () => {
    try{
      const history  =  await AsyncStorage.getItem("focusHistory");
      if(history && JSON.parse(history).length){
        setFocusHistory(JSON.parse(history));
      }
    }catch(e){
      console.log(e);
    }
  }
  
  useEffect(()=>{
    loadFocusHistory();
  },[])

  useEffect(()=> {
    saveFocusHistory()
  },[focusHistory])

  return (
    <View style={styles.container}>
      {focusSubject ?  (
          <Timer 
            focusSubject={focusSubject} 
            onTimerEnd={() => { 
              addFocusHistorySubjectWithState(focusSubject,STATUSES.COMPLETE)
              setFocusSubject(null);
            }}  
            clearSubject={() => {
              addFocusHistorySubjectWithState(focusSubject,STATUSES.CANCELLED)
              setFocusSubject(null)
              }}
          />
       ) : ( 
        <>
          <Focus addSubject={setFocusSubject}/>
          <FocusHistory 
            focusHistory={focusHistory}
            onClear={onClear}
          />
        </>
       )} 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    paddingTop: Platform.OS === 'ios' ? spacing.md : spacing.lg,
    backgroundColor: colors.darkBlue
  }
});
