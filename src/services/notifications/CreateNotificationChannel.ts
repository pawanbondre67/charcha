import notifee, { AndroidImportance } from '@notifee/react-native';

const createNotificationChannels = async () => {
    await notifee.createChannel({
      id: 'default',
      name: 'Buzzer Notifications',
      importance: AndroidImportance.HIGH,
      vibration: true,
      sound: 'buzzer',
    });
};


export default createNotificationChannels;
