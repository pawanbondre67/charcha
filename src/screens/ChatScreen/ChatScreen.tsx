import React, {
  useState,
  useLayoutEffect,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
// import { AntDesign } from '@expo/vector-icons';
import {
  Bubble,
  BubbleProps,
  Day,
  GiftedChat,
  IMessage,
  InputToolbar,
  MessageProps,
  Send,
  Time,
} from 'react-native-gifted-chat';

import {useFirebaseUser} from '../../hooks/useFirebaseUser';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DialogBox from '../../components/Dialog';
import {Provider} from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Header from '../../components/Header';
// import {useNavigation} from '@react-navigation/native';
import CustomActions from '../../components/CustomActions';
import ReplyMessageBar from '../../components/ReplyMessageBar';
import ChatMessagebox from '../../components/ChatMessageBox';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Easing } from 'react-native-reanimated';
import { sendMessageforNotification } from '../../services/api/sendMessageforNotification';
// import uuidv4 from '../../utils/helper';
import saveMessage from '../../services/firebaseData/index';


type MyMessage = IMessage & {
  replyMessage?: {
     _id?: string;
    text: string;
    user?: any;
  };
};

const ChatScreen = () => {
  const groupId = '1234567';

  const firebaseUser = useFirebaseUser().firebaseUser;
  // const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<
    string | number | null
  >(null);
  const [messages, setMessages] = useState<MyMessage[]>([]);
  const [showActions, setShowActions] = useState(false);
  const [replyMessage, setReplyMessage] = useState<MyMessage | null>(null);
//   const [messageId, setMessageId] = useState<
//   string | number | null
// >(null);
  const animation = useRef(new Animated.Value(0)).current;
  const swipeableRowRef = useRef<Swipeable | null>(null);

  const clearReplyMessage = () => {
    setReplyMessage(null);
  };

  useEffect(() => {
    if (!firebaseUser) {
      return;
    }

   
    const fetchUserRole = async () => {
      setLoading(true);
      console.log('firebaseUser', firebaseUser?.uid);
      const userDoc = await firestore()
        .collection('users')
        .doc(firebaseUser?.uid)
        .get();


      if (userDoc.exists) {
        const userData = userDoc.data();

        // console.log('userData', userData);
        // console.log('userData', userData?.role);
        // console.log('userData', userData?.role === 'admin');
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
    setSelectedMessageId(null);
  };

  useLayoutEffect(() => {
    // console.log('user is undefined:', firebaseUser);
    // if (firebaseUser === undefined) {
    //   navigation.navigate('login');
    // }
    const unsubscribe = firestore()
      .collection('groups')
      .doc(groupId)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const messagesFirestore = querySnapshot.docs.map(doc => {
          const data: MyMessage = {
            _id: doc.id,
            createdAt: new Date(doc.data().createdAt.seconds * 1000),
            text: doc.data().text,
            user: doc.data().user,
            replyMessage: doc.data().replyMessage || null,
            seenBy: doc.data().seenBy || [],
            // Add this line to include the 'seenBy' property
          };
          if (firebaseUser) {
            if (!data.seenBy?.includes(firebaseUser?.uid)) {
              firestore()
                .collection('groups')
                .doc(groupId)
                .collection('messages')
                .doc(doc.id)
                .update({
                  seenBy: firestore.FieldValue.arrayUnion(firebaseUser?.uid),
                })
                .catch(error => {
                  console.error('Error updating seenBy:', error);
                });
            }
          }

          return data;
        });

        setMessages(messagesFirestore);
      });
    return () => unsubscribe();
  }, [firebaseUser]);

  // const messageFormInputNotification = ()=>{
       
  //   setMessages('');
  // }

  const onSend = useCallback(
    (messages: MyMessage[] = []) => {
      if (replyMessage) {
        messages[0].replyMessage = {
          text: replyMessage.text,
        };
      }
      console.log("replyMesssage before sending", replyMessage);
      
      setMessages(newMessages => GiftedChat.append(newMessages, messages));
      const {text, createdAt, user } = messages[0];
      // const  replyMessage = messages[0].replyMessage;
      console.log('user', createdAt);
      // firestore()
      //   .collection('groups')
      //   .doc(groupId)
      //   .collection('messages')
      //   .add({
      //     _id: uuidv4(),
      //     text,
      //     createdAt: firestore.Timestamp.fromDate(new Date()),
      //     user,
      //     seenBy: [],
      //     replyMessage: replyMessage ? replyMessage : null,
      //   });
      saveMessage({ text, user, replyMessage});
      // console.log("isAdmin updated to:", isAdmin);
       clearReplyMessage();
       
        //get all user tokens
        const  usersSnapshot = firestore().collection('users').get();
        usersSnapshot.then((querySnapshot) => {
         querySnapshot.forEach((doc) => {
           // console.log(doc.id, ' => ', doc.data());
           const user = doc.data();
           console.log('user token:',user.name , messages[0]);
           sendMessageforNotification(user.FCMtoken, messages[0]);
         });
         });
       console.log("replyMesssage after sending", replyMessage);
       console.log('messages', messages);
    },
    [replyMessage],
  );



  // eslint-disable-next-line react/no-unstable-nested-components
  const CustomBubble = props => {
    return (
      <View>
     
        <Bubble
          {...props}
          renderCustomView={renderReplyMessageView}
          onPress={() => {
            const replyMessageId = props.currentMessage.replyMessage?._id;
            if (replyMessageId) {
              scrollToMessage(replyMessageId);
              console.log('scrolling to message ', replyMessageId);
            }
            else
            {
              console.log('no reply message');
            }
          }}

          onLongPress={() => {
            if (isAdmin) {
              showDialog(props.currentMessage._id);
            }
          }}
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
      </View>
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

  const toggleActions = () => {
    setShowActions(!showActions);
    Animated.timing(animation, {
      toValue: showActions ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const actionsWidth = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 70], // Adjust this value based on your CustomActions  width
  });

  const renderMessageBox = (props: MessageProps<MyMessage>) => (
    <ChatMessagebox
      CustomBubble={CustomBubble}
      {...props}
      setReplyOnSwipeOpen={setReplyMessage}
      updateRowRef={updateRowRef}
    />
  );

  const updateRowRef = useCallback(
    (ref: any) => {
      if (
        ref &&
        replyMessage &&
        ref.props.children.props.currentMessage?._id === replyMessage._id
      ) {
        swipeableRowRef.current = ref;
      }
    },
    [replyMessage],
  );

  useEffect(() => {
    if (replyMessage && swipeableRowRef.current) {
      swipeableRowRef.current.close();
      swipeableRowRef.current = null;
    }
  }, [replyMessage]);

  const renderReplyMessageView = (props: BubbleProps<MyMessage>) =>
    props.currentMessage &&
    props.currentMessage.replyMessage && (
     
        <View style={styles.container}>
     <View style={styles.userContainer}>
      <View style={styles.replyUserNameContainer}>
          <Text>{props.currentMessage.replyMessage?.user?.name}</Text>
        </View>
     </View>

     <View style={styles.messageContainer}>
        <Text style={styles.repliedmessageColor}>{props.currentMessage.replyMessage?.text?.length > 30 ? props.currentMessage.replyMessage?.text.substring(0,30) + '...' : props.currentMessage.replyMessage?.text}</Text>
      </View>

      </View>
    );

  const ScrollToBottomButton = () => (
    <View style={styles.ScrollButton}>
      <MaterialCommunityIcons name="chevron-down" size={24} color="#fff" />
    </View>
  );



  // useEffect(() => {
  //   if (messageId) {
  //     console.log('scrolling to message:', messageId);
  //     scrollToMessage(messageId);
  //   }
  // }, [messageId]);

  const messageContainerRef = useRef<FlatList<any>>(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  const scrollToMessage = (messageId) => {
    const index = messages.findIndex((msg) => msg._id === messageId);
    if (index !== -1 && messageContainerRef.current) {
      console.log('animation to message:', messageId);
      Animated.timing(scrollY, {
        toValue: index * 100, // Assuming each message has a height of 100
        easing: Easing.elastic(1),
        duration: 700,
        useNativeDriver: true,
      }).start();
      console.log('animation after to message:', scrollY);
      messageContainerRef.current.scrollToIndex({index, animated: true});
    }
  };

  return loading ? (
    <View style={{flex:1}}><ActivityIndicator size="large" color="#000" style={{justifyContent:'center' , alignItems:'center'}} /></View>
  ) : (
    <Provider>
      <View style={{flex: 1}}>
        <Header />
        <GiftedChat
         messageContainerRef={messageContainerRef}
          messages={messages}
          alwaysShowSend={true}
          scrollToBottom={true}
          scrollToBottomComponent={ScrollToBottomButton}
          // onPress={(_, message) => setReplyMessage(message)}
          messagesContainerStyle={{backgroundColor: '#f6f5f1', flex: 1}}
          renderUsernameOnMessage={true}
          // renderBubble={props => <CustomBubble {...props} />}
          renderDay={props => <CustomDay {...props} />}
          renderInputToolbar={props =>
            isAdmin ? (
              <InputToolbar
                {...props}
                // eslint-disable-next-line react-native/no-inline-styles
                containerStyle={{
                  borderWidth: 2,
                  borderTopWidth: 2,
                  borderColor: '#bcc4ff',
                  borderTopEndRadius: 15,
                  borderTopStartRadius: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  // backgroundColor: 'darkgreen',
                  // position:"relative",
                  flexDirection: 'column-reverse',
                  padding: 5,
                }}
                accessoryStyle={{height: 'auto'}}
                renderActions={() => (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Pressable
                      onPress={() => toggleActions()}
                      style={styles.ActionPlus}>
                      <MaterialCommunityIcons
                        name="plus"
                        size={28}
                        color="#bcc4ff"
                      />
                    </Pressable>
                    <Animated.View style={[{width: actionsWidth}]}>
                      {showActions && <CustomActions onSend={onSend} />}
                    </Animated.View>
                  </View>
                )}
                renderSend={() => {
                  return (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 15,
                      }}>
                      {props.text.length > 0 && (
                        <Send
                          {...props}
                          containerStyle={
                            // eslint-disable-next-line react-native/no-inline-styles
                            {
                              justifyContent: 'center',
                              alignItems: 'center',
                            }
                          }>
                          <FontAwesome name="send" size={24} color="#bcc4ff" />
                        </Send>
                      )}
                      {props.text?.length === 0 && (
                        <FontAwesome
                          style={{marginBottom: 10}}
                          onPress={() => {
                            console.log('mic clicked');
                          }}
                          name="microphone"
                          size={24}
                          color="#bcc4ff"
                        />
                      )}
                    </View>
                  );
                }}
              />
            ) : (
              <Text style={{padding: 10, textAlign: 'center'}}>
                Only admins can send messages
              </Text>
            )
          }
          textInputProps={styles.composer}
          onSend={messages => onSend(messages)}
          renderAccessory={() =>
            replyMessage && (
              <ReplyMessageBar
                clearReply={clearReplyMessage}
                message={replyMessage}
              />
            )
          }
          renderMessage={renderMessageBox}
          
          // renderCustomView={renderReplyMessageView}
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
    </Provider>
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
    // maxWidth:  '80%',
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
  button: {
    marginHorizontal: 5,
  },
  composer: {
    // backgroundColor: 'red',
    marginHorizontal: 10,
  },

  replyMessageContainer: {
    padding: 8,
    paddingBottom: 0,
  },
  replyMessageDivider: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    paddingTop: 6,
  },
  ScrollButton: {
    backgroundColor: '#7081ff',
    borderRadius: 20,
    padding: 5,
  },
  ActionPlus: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    zIndex: 10,
  },
  container: {
    borderLeftWidth: 4,
    borderLeftColor: 'black',
    backgroundColor: '#D8DDFF',
    borderRadius: 10,

    paddingHorizontal : 5,
    height: 'auto',
},
userContainer:{
    paddingVertical: 3,
},
replyUserNameContainer: {

},
messageContainer: {
  //  width: '100%',
  paddingBottom: 5,
},
repliedmessageColor:{
  color: 'grey',
},
crossButton: {

},

});

export default ChatScreen;
