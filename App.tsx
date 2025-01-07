import React, {useEffect} from 'react';
import {PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {SafeAreaView} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StyleSheet} from 'react-native';
import RootStack from './src';
import messaging from '@react-native-firebase/messaging';
import {Alert} from 'react-native';
import notifee, {AuthorizationStatus, EventType} from '@notifee/react-native';
import createNotificationChannels from './src/services/notifications/CreateNotificationChannel';
import handleNotification from './src/services/notifications/notificationHandle';

const App = () => {
  useEffect(() => {
    async function requestUserPermission() {
      const settings = await notifee.requestPermission();

      if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
        console.log('Permission Granted');
      } else {
        Alert.alert(
          'Permission Denied',
          'You must enable notifications in settings',
        );
      }
    }
    requestUserPermission();


    const initializeApp = async () => {
      try {
        await createNotificationChannels();
        console.log('Notification channels created successfully.');
      } catch (error) {
        console.error('Error creating notification channels:', error);
      }
    };

      initializeApp();



// Function to handle background notifications
const handleBackgroundNotification = async notification => {
  // console.log('Step 1: Entered handleBackgroundNotification', notification);
  

  try {
     await handleNotification(notification);
    //  console.log('Step 2: Processed notification successfully.');
  } catch (error) {
     console.error('Error processing notification:', error);
  }
};

// Handle background/terminated notifications
messaging().setBackgroundMessageHandler(async remoteMessage => {
  // console.log('Background message received:', remoteMessage);
  await handleBackgroundNotification(remoteMessage);
});
// Set up Notifee background event handler
notifee.onBackgroundEvent(async ({type, detail}) => {
  if (type === EventType.PRESS) {
    console.log('Notification was pressed in background:', detail);
    // Handle the notification press
  }
});

// Run initialization and register services
// const runAppSetup = async () => {
//   await initializeApp();
 // ReactNativeForegroundService.register();
// };

// Call the setup function
// runAppSetup();

// Handle foreground notifications
messaging().onMessage(async remoteMessage => {
  // console.log('Foreground message received:', remoteMessage);
  // console.log('Handling notification:', remoteMessage.notification);
  // Process the notification
  await handleNotification(remoteMessage);
});

// Handle notifications when app is opened from a killed state
messaging()
  .getInitialNotification()
  .then(async remoteMessage => {
    if (remoteMessage) {
      console.log(
        'App opened from killed state with notification:',
        remoteMessage,
      );
      // await processNotification(remoteMessage);
      // Navigate to the appropriate screen if needed
      // Example: Navigation to a specific screen (ensure you use the correct navigation setup)
      // navigation.navigate(remoteMessage.data.screen || 'DefaultScreen');
    }
  });

// Handle notifications when app is opened from the background
messaging().onNotificationOpenedApp(async remoteMessage => {
  console.log('Notification opened the app from background:', remoteMessage);
  // await processNotification(remoteMessage);
  // Navigate to the appropriate screen if needed
  // Example: Navigation to a specific screen (ensure you use the correct navigation setup)
  // navigation.navigate(remoteMessage.data.screen || 'DefaultScreen');
});

  }, []);

  return (
    <PaperProvider>
      <SafeAreaProvider>
        <SafeAreaView style={styles.backgroundStyle}>
          <GestureHandlerRootView>
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
