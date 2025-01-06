import axios from 'axios';
const sendNotification = async (token, message) => {
  // const FIREBASE_API_KEY = 'YOUR_FIREBASE_SERVER_KEY'; // Replace with your Firebase server key

  const notification = {
    token: 'bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1...',
    notification: {
      body: 'This is an FCM notification message!',
      title: 'FCM Message',
    },
  };

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'ya29.a0ARW5m74IJ3ny5q9-XknDg0Guwbu67jrJTNRGlVWSRSpsHCBwGODbGZVTBRnq4cuNOjjK7kMYbipm7aDyZH-J5av_fPlIlOtbGugZNE2qMck2cjoiVNOZ1jMFpfjEr2n14LD1c0IWnQPOQQUpaRYunX2pzFgppFpsHPg2c9sNaCgYKAU4SARESFQHGX2MirEeWBrUFFpYlm9QyPBncHQ0175',
  };

  await axios.post(
    'https://fcm.googleapis.com/v1/projects/digitalkissan-c7157/messages:send',
    notification,
    {headers},
  );
};

export default sendNotification;
