
import React ,
{
    useState,
    useEffect,
    useLayoutEffect,
    useCallback,
} from 'react';
import { TouchableOpacity,Text, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
// import { AntDesign } from '@expo/vector-icons';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { useNavigation } from '@react-navigation/native';
import { useFirebaseUser } from '../../hooks/useFirebaseUser';

const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.floor(Math.random() * 16);
      const v = c === 'x' ? r : (r % 4) + 8;
      return v.toString(16);
    });
  };


const ChatScreen = () => {
    
    const navigation = useNavigation();
    const firebaseUser =useFirebaseUser().firebaseUser;
    const groupId = '1234567';
    const onSignOut = () => {
        auth().signOut().catch((error) => Alert.alert(error.message));
        navigation.navigate('auth');
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            // eslint-disable-next-line react/no-unstable-nested-components
            headerRight: () => (
                <TouchableOpacity onPress={onSignOut}>
                    {/* <AntDesign name="logout" size={24} color="black" /> */}
                    <Text>Sign Out</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    useLayoutEffect(() => {
        const unsubscribe = firestore()
        .collection('groups')
        .doc(groupId)
        .collection('messages')
        .orderBy('createdAt', 'desc')
        .onSnapshot(querySnapshot => {
          const messagesFirestore = querySnapshot.docs.map(doc => {
    
  
            const data = {
              _id: doc.id,
              text: '',
              createdAt: new Date().getTime(),
              text : doc.data().text,
              user : doc.data().user,
              
            };
  
            return data;
          });
  
          setMessages(messagesFirestore);
        });
  
      return () => unsubscribe();
    }
    , [groupId]);


    const [messages, setMessages] = useState<IMessage []>([]);
    const onSend = (newMessages = []) => {
        setMessages(GiftedChat.append(messages, newMessages));
        const text = messages[0].text;
        firestore()
          .collection('groups')
          .doc(groupId)
          .collection('messages')
          .add({
            text,
            createdAt: new Date().getTime(),
            user: {
              _id: firebaseUser?.uid,
              name: firebaseUser?.displayName || 'jack',
            },
          });
    };
    
    return (
        <GiftedChat
            messages={messages}
            onSend={onSend}
        />
    );



};


export default ChatScreen