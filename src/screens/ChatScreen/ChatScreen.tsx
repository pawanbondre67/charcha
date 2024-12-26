import React, {useState, useLayoutEffect, useCallback, useEffect} from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DialogBox from '../../components/Dialog';
import {Provider} from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {CameraOptions, launchCamera} from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
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
  const [selectedMessageId, setSelectedMessageId] = useState<
    string | number | null
  >(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [showActions, setShowActions] = useState(false);


  // console.log('outside' ,isAdmin);

  const onSignOut = async () => {
    console.log('Sign-out button clicked');
    setSignoutLoading(true);
    try {
      await auth().signOut();
      console.log('User signed out!');
      navigation.replace('login');
    } catch (error) {
      console.error(error + 'Error signing out');
      Alert.alert(error.message);
    } finally {
      setSignoutLoading(false);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerTitle: () => (
        <View>
          <Text
            // eslint-disable-next-line react-native/no-inline-styles
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
            <MaterialCommunityIcons name="logout" size={28} color="white" />
          </TouchableOpacity>
        ),
      headerStyle: {
        backgroundColor: '#bcc4ff',
      },
      headerTintColor: '#fff',
    });
  }, [signoutLoading]);

  useEffect(() => {
    if (!firebaseUser) return;
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
    // console.log('firebaseUser', firebaseUser?.uid);
    console.log("isAdmin updated to at before setmessahes layouteffect:", isAdmin);
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
          const data: IMessage = {
            _id: doc.id,
            createdAt: new Date(doc.data().createdAt.seconds * 1000),
            text: doc.data().text,
            user: doc.data().user,
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
        console.log("isAdmin updated to aftersetting messages to  layouteffect:", isAdmin);
      });
    return () => unsubscribe();
  }, [groupId , isAdmin]);

  const onSend = useCallback(
    (messages: IMessage[] = []) => {
      console.log("Admin status during send:", isAdmin);
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
          seenBy: [],
        });
        console.log("isAdmin updated to:", isAdmin);
    },
    [groupId, isAdmin],
  );


  // onLongPress={(context, message) => {
  //   console.log('message  is  pressed', message);
  //   if (message.user._id === firebaseUser?.uid || isAdmin) {
  //     showDialog(message._id);
  //   }
  // }}
  // eslint-disable-next-line react/no-unstable-nested-components
  const CustomBubble = props => {
    
    return (
      <Bubble
        {...props}

        onPress={() => {console.log('bubble is long pressed',props.currentMessage._id);
      //  console.log('firebaseUser',firebaseUser?.uid);
       console.log(isAdmin);
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
  // const [open, setOpen] = useState(false);
  // const onStateChange = ({ open }) => setOpen(open);
  // eslint-disable-next-line react/no-unstable-nested-components
  const CustomActions = () => {


    const handlePress = async (action: string) => {
      console.log(`Pressed ${action}`);
      switch (action) {
        case 'camera':
          const cameraOptions: CameraOptions = {
            mediaType: 'photo',
            cameraType: 'front',
            saveToPhotos: true,
            presentationStyle: 'fullScreen',
          };
          launchCamera(cameraOptions, response => {
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.errorMessage) {
              console.log('ImagePicker Error: ', response.errorMessage);
            } else {
              const source = {uri: response.assets[0].uri};
              onSend([{image: source.uri}]);
            }
          });
          break;
        case 'file':
          try {
            const res = await DocumentPicker.pick({
              type: [DocumentPicker.types.allFiles],
            });
            console.log('File selected: ', res);
            onSend([{file: res.uri}]);
          } catch (err) {
            if (DocumentPicker.isCancel(err)) {
              console.log('User cancelled file picker');
            } else {
              throw err;
            }
          }
          break;
        default:
          break;
      }
    };

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handlePress('camera')}>
          <MaterialCommunityIcons name="camera" size={24} color="#007bff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handlePress('file')}>
          <MaterialCommunityIcons name="file" size={24} color="#007bff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handlePress('microphone')}>
          <MaterialCommunityIcons name="microphone" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>
    );
  };



  return loading ? (
    <ActivityIndicator size="large" color="#000" />
  ) : (
    <Provider>
      <View style={{flex: 1}}>
        <GiftedChat
          messages={messages}
          alwaysShowSend={true}

          messagesContainerStyle={{backgroundColor: '#f6f5f1'}}
          renderUsernameOnMessage={true}
          renderBubble={props => <CustomBubble {...props} />}
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
                  // backgroundColor: 'red',
                  paddingVertical: 7,
                }}

                renderActions={() =>
                  // <CustomActions {...props} />
                  (
                 <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Pressable
               onPress={() => setShowActions(!showActions)}
              style={{
                height: 44,
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 10,
                zIndex:10,
              }}>
                <MaterialCommunityIcons
                  name="plus" size={28} color="#bcc4ff" />
              </Pressable>
              {showActions && <CustomActions {...props} onSend={onSend} />}
            </View>
                  )
                }

                renderSend={() => {
                  return (
                    <View style={{ justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 15,
                      }} >
                      {props.text.length > 0  && <Send
                        {...props}
                        containerStyle={
                          // eslint-disable-next-line react-native/no-inline-styles
                          {
                            justifyContent: 'center',
                            alignItems: 'center',
                          }
                        }
                        >
                        <FontAwesome name="send" size={24} color="#bcc4ff" />
                      </Send>
                    }
                    {props.text?.length === 0 && <FontAwesome
                      style={{marginBottom:10}}
                            onLongPress={() => {console.log('mic clicked');}}
                            name="microphone" size={24} color="#bcc4ff" />}
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
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  button: {
    marginHorizontal: 5,
  },
  composer: {
    // backgroundColor: 'red',
    marginHorizontal: 10,
  },
});

export default ChatScreen;

