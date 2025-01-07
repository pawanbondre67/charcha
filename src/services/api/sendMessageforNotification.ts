import axios from 'axios';

const baseUrl = 'http://192.168.191.14:3000';
import { REACT_APP_BASE_URL} from '@env';

export const sendMessageforNotification = async (token: string, message: any) => {
  const { text, user } = message;
  console.log('message', text, user);
  console.log('react natve url',REACT_APP_BASE_URL);
  const payload = {
    text,
    user,
  };

  try {
    const response = await axios.post(`${baseUrl}/send-Notification`, {
      token,
      payload,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('response', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};