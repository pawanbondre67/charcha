
import React, { useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import RootStack from './src';
import messaging from '@react-native-firebase/messaging';

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

// async function getToken() {
//   const token = await messaging().getToken();
//   console.log('Token: ', token);
  
// }




const App = () => {

useEffect(() => {
  requestUserPermission();
//  getToken();
}
, []);

  return (
    <PaperProvider>
      <SafeAreaProvider>
      <SafeAreaView style={styles.backgroundStyle}>
        <GestureHandlerRootView >
          <RootStack />
        </GestureHandlerRootView>
      </SafeAreaView>
      </SafeAreaProvider>

    </PaperProvider>
  );
};
const styles = StyleSheet.create({
  backgroundStyle: {
    flex: 1,
  },
});

export default App;
