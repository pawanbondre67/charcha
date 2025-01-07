import  notifee, { AndroidImportance, AndroidStyle, EventType }  from '@notifee/react-native';

// Function to handle alert notifications
const handleNotification = async (data: any) => {
    console.log('Handling  notification:', data);
  
    await notifee.displayNotification({
      title: 'Probus Software Private Limited',
      body: `new message from ${data.notification.body}`,
      // body: data.notification.body,

      android: {
        channelId: 'default',
        sound: 'alert',
        actions: [
          {
            title: 'Reply',
            pressAction: { id: 'reply' },
            input: true, // This will allow the user to input text
          },
          {
            title: 'Like',
            pressAction: { id: 'like' },
          },
        ],
        importance: AndroidImportance.HIGH,
        style: {type: AndroidStyle.BIGTEXT, text: data.notification.title},
        vibrationPattern: [500, 500, 500, 500],
      },
    });
  };
  // Listen for notification events
notifee.onForegroundEvent(({ type, detail }) => {
  switch (type) {
    case EventType.ACTION_PRESS:
      if (detail.pressAction.id === 'reply') {
        const userInput = detail.input; // Get the user input
        console.log('User replied with:', userInput);
        // Handle the reply input here
      } else if (detail.pressAction.id === 'like') {
        console.log('User liked the message');
        // Handle the like action here
      }
      break;
  }
});

    export default handleNotification;