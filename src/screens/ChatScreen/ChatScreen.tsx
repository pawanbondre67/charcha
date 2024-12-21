
import React ,
{
    useState,
    useEffect,
    useLayoutEffect,
    useCallback,
} from 'react';
import { TouchableOpacity,Text, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
// import { AntDesign } from '@expo/vector-icons';
import { GiftedChat } from 'react-native-gifted-chat';
import { useNavigation } from '@react-navigation/native';
const ChatScreen = () => {
    const navigation = useNavigation();
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

    const [messages, setMessages] = useState([]);
    const onSend = (newMessages = []) => {
        setMessages(GiftedChat.append(messages, newMessages));
    };

    return (
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
                _id: 1,
            }}
        />
    );
}

export default ChatScreen