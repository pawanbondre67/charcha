import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { FadeInDown } from 'react-native-reanimated';

type ReplyMessageBarProps = {
  clearReply: () => void;
  message: {
    text: string,
  user: {
    _id: string | number,
    name: string,
  }};
};

const ReplyMessageBar = ({clearReply, message}: ReplyMessageBarProps) => {
  return (
    <Animated.View
    entering={FadeInDown}
     style={styles.container}>
     <View style={styles.userContainer}>

     <View style={styles.replyUserNameContainer}>
        <Text>{message?.user?.name}</Text>
      </View>

      <TouchableOpacity style={styles.crossButton} onPress={clearReply}>
        <MaterialCommunityIcons name="close" size={16} color="#007bff" />
      </TouchableOpacity>
      
     </View>
     <View style={styles.messageContainer}>
        <Text>{message?.text.length > 30 ? message?.text.substring(0,30) + '...' : message.text}</Text>
      </View>

      
    </Animated.View>
  );
};

export default ReplyMessageBar;

const styles = StyleSheet.create({
    container: {
        width:350,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginHorizontal: 10,
        borderLeftWidth: 4,
        borderLeftColor: 'black',
        backgroundColor: '#D8DDFF',
        borderRadius: 10,
        marginBottom: 10,
        height: 'auto',
    },
    userContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 3,
    },
    replyUserNameContainer: {
      
    },
    messageContainer: {
       
    },
    crossButton: {

    },
});
