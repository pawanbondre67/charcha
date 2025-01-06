import  notifee, { AndroidImportance, AndroidStyle }  from '@notifee/react-native';

// Function to handle alert notifications
const handleNotification = async (data: any) => {
    console.log('Handling  notification:', data);
  
    await notifee.displayNotification({
      title: data.notification.title,
      body: data.notification.body,

      android: {
        channelId: 'default',
        pressAction: {
          id: 'default',
        },
        sound: 'alert',
        importance: AndroidImportance.HIGH,
        style: {type: AndroidStyle.BIGTEXT, text: data.notification.title},
        vibrationPattern: [500, 500, 500, 500],
      },
    });
  };

    export default handleNotification;