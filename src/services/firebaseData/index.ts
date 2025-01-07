import {IMessage} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import uuidv4 from '../../utils/helper';


type MyMessage = IMessage & {
  groupId?: string;
  replyMessage?: {
    _id?: string;
    text: string;
    user?: any;
  };
};


const saveMessage = ({ text, user, replyMessage}: MyMessage) => {
  firestore()
    .collection('groups')
    .doc('1234567')
    .collection('messages')
    .add({
      _id: uuidv4(),
      text,
      createdAt: firestore.Timestamp.fromDate(new Date()),
      user,
      seenBy: [],
      replyMessage: replyMessage ? replyMessage : null,
    });
 
};

export default saveMessage;
