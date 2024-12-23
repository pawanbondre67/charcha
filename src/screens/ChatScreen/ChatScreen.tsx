import React, {useState, useLayoutEffect, useCallback, useEffect} from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
// import { AntDesign } from '@expo/vector-icons';
import {
  Bubble,
  Day,
  GiftedChat,
  IMessage,
  InputToolbar,
  Send,
  Time,
} from 'react-native-gifted-chat';
import {useNavigation} from '@react-navigation/native';
import {useFirebaseUser} from '../../hooks/useFirebaseUser';
import {signOut} from '@react-native-firebase/auth';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import DialogBox from '../../components/Dialog';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.floor(Math.random() * 16);
    const v = c === 'x' ? r : (r % 4) + 8;
    return v.toString(16);
  });
};

const ChatScreen = () => {
  const groupId = '1234567';
  const navigation = useNavigation();
  const firebaseUser = useFirebaseUser().firebaseUser;
  const [loading, setLoading] = useState(false);
  const [signoutLoading, setSignoutLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | undefined>(undefined);

  const onSignOut = async () => {
    setLoading(true);
    try {
      await signOut(auth()).catch(error => Alert.alert(error.message));
      console.log('sign out');
      navigation.navigate('auth');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerTitle: () => (
        <View>
          <Text
            style={{
              color: '#fff',
              fontSize: 20,
              fontWeight: 'bold',
            }}>
            Chat Screen
          </Text>
        </View>
      ),
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () =>
        signoutLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <TouchableOpacity onPress={onSignOut}>
           <MaterialCommunityIcons
                name="logout"
                size={28}
                color="white"
            />
          </TouchableOpacity>
        ),
      headerStyle: {
        backgroundColor: '#bcc4ff',
        
      },
      headerTintColor: '#fff',
    });
  }, [signoutLoading]);

  useEffect(() => {
    const fetchUserRole = async () => {
      setLoading(true);
      const userDoc = await firestore()
        .collection('users')
        .doc(firebaseUser?.uid)
        .get();

      if (userDoc.exists) {
        const userData = userDoc.data();

        console.log('userData', userData);
        console.log('userData', userData?.role);
        console.log('userData', userData?.role === 'admin');
        setIsAdmin(userData?.role === 'admin');
        setUserName(userData?.name);
      }

      setLoading(false);
    };

    fetchUserRole();
  }, [firebaseUser]);



  const showDialog = (messageId: string) => {
    setSelectedMessageId(messageId);
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
    setSelectedMessageId(undefined);
  };

  // const onLongPress = (context, message) => {
  //   if (isAdmin) {
  //     showDialog(message._id);
  //   }
  // };


  useLayoutEffect(() => {
    //  console.log(firebaseUser);
    if (firebaseUser !== undefined) {
      navigation.navigate('auth');
    }
    const unsubscribe = firestore()
      .collection('groups')
      .doc(groupId)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const messagesFirestore = querySnapshot.docs.map(doc => {
          const data = {
            _id: doc.id,
            createdAt: new Date(doc.data().createdAt.seconds * 1000),
            text: doc.data().text,
            user: doc.data().user,
          };

          return data;
        });

        setMessages(messagesFirestore);
      });
    return () => unsubscribe();
  }, [groupId]);

  const [messages, setMessages] = useState<IMessage[]>([]);
  const onSend = useCallback(
    (messages: IMessage[] = []) => {
      console.log('admin', isAdmin);
      if (!isAdmin) {
        Alert.alert('Only admins can send messages.');
        return;
      } else {
        setMessages(newMessages => GiftedChat.append(newMessages, messages));
        const {text, createdAt, user} = messages[0];
        console.log('user', createdAt);
        firestore()
          .collection('groups')
          .doc(groupId)
          .collection('messages')
          .add({
            _id: uuidv4(),
            text,
            createdAt: firestore.Timestamp.fromDate(new Date()),
            user,
          });
      }
    },
    [groupId, isAdmin],
  );

  // const renderInputToolbar = props => {
  //   // console.log('InputToolbar props:', props);
  //   if (isAdmin) {
  //     return (
  //       <InputToolbar
  //         {...props}
  //         containerStyle={styles.inputToolbarContainer}
  //         primaryStyle={styles.inputToolbarPrimary}
  //         renderComposer={composerProps => (
  //           <TextInput {...composerProps} placeholder="Message"
  //           placeholderTextColor ="lightgrey"
  //            style={styles.textInput} />
  //         )}
  //       />
  //     );
  //   }
  //   return (
  //     <Text style={styles.warningText}>Only admins can send messages.</Text>
  //   );
  // };

  // eslint-disable-next-line react/no-unstable-nested-components
  const CustomBubble = props => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: styles.leftBubble,
          right: styles.rightBubble,
        }}
        usernameStyle={{color: 'blue'}}
        textStyle={{
          left: styles.leftBubbleText,
          right: styles.rightBubbleText,
        }}
        renderTime={props => <CustomTime {...props} />}
      />
    );
  };

  // eslint-disable-next-line react/no-unstable-nested-components
  const CustomDay = props => {
    return (
      <Day {...props} dateFormat="MMM DD YYYY" textStyle={styles.dayText} />
    );
  };

  // eslint-disable-next-line react/no-unstable-nested-components
  const CustomTime = props => {
    return (
      <Time
        {...props}
        timeTextStyle={{
          left: styles.leftTimeText,
          right: styles.rightTimeText,
        }}
      />
    );
  };

  return loading ? (
    <ActivityIndicator size="large" color="#000" />
  ) : (
    <View style={{ flex: 1 }}>
      <GiftedChat
      messages={messages}
       alwaysShowSend={true}
       onLongPress={(context, message)=> {
  
      if (message.user._id === firebaseUser?.uid || isAdmin) {
        showDialog(message._id);
      }
    }
  }
      messagesContainerStyle={{backgroundColor: '#f6f5f1'}}
      renderUsernameOnMessage={true}
      renderBubble={props => <CustomBubble {...props} />}
      renderDay={props => <CustomDay {...props} />}
      renderInputToolbar={props =>
        isAdmin ? (
          <InputToolbar {...props} 
          // eslint-disable-next-line react-native/no-inline-styles
          containerStyle={{
          borderWidth:2,
          borderTopWidth:2,
          borderColor: '#bcc4ff',
          borderTopEndRadius: 15,
          borderTopStartRadius: 15,
          // padding: 5,
          paddingVertical:7,
          }}
           renderSend={() => {
            return <  Send {...props} containerStyle={
               // eslint-disable-next-line react-native/no-inline-styles
               {
                 justifyContent: 'center',
                 alignItems: 'center',
                 marginRight: 15,
                 marginBottom: 5,
               }}> 
               <FontAwesome name="send" size={24} color="#007bff" />
                </Send>;
                }
              }
          />
        ) : (
          <Text style={{padding: 10, textAlign: 'center'}}>
            Only admins can send messages
          </Text>
        )
      }
      onSend={messages => onSend(messages)}
    //   renderSend={(props) => 
    // }
      user={{
        _id: firebaseUser?.uid,
        name: firebaseUser?.displayName || userName,
      }}
    />
     <DialogBox
        message_id={selectedMessageId}
        visible={dialogVisible}
        showDialog={showDialog}
        hideDialog={hideDialog}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  dayText: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: '#e0e0e0',
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  leftTimeText: {
    color: '#aaa',
    fontSize: 12,
  },
  rightTimeText: {
    color: '#aaa',
    fontSize: 12,
  },
  leftBubble: {
    backgroundColor: '#f5efd9',
    borderRadius: 15,
    padding: 5,
  },
  rightBubble: {
    backgroundColor: '#bcc4ff',
    borderRadius: 15,
    padding: 5,
  },
  leftBubbleText: {
    color: '#000',
  },
  rightBubbleText: {
    color: '#000',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChatScreen;
