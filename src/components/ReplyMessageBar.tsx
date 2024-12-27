import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type ReplyMessageBarProps = {
  clearReply: () => void;
  message: {text: string};
};

const ReplyMessageBar = ({clearReply, message}: ReplyMessageBarProps) => {
  return (
    <View style={styles.container}>
     <View style={styles.userContainer}>

     <View style={styles.replyUserNameContainer}>
        <Text>user</Text>
      </View>

      <TouchableOpacity style={styles.crossButton} onPress={clearReply}>
        <MaterialCommunityIcons name="close" size={16} color="#007bff" />
      </TouchableOpacity>
      
     </View>
     <View style={styles.messageContainer}>
        <Text>{message.text}</Text>
      </View>

      
    </View>
  );
};

export default ReplyMessageBar;

const styles = StyleSheet.create({
    container: {
        // flexDirection: 'column',
        // paddingVertical: 5,
        // width: '100%',
        width:350,
        paddingHorizontal: 10,
        marginHorizontal: 10,
        borderLeftWidth: 4,
        borderLeftColor: 'black',
        backgroundColor: 'lightblue',
        borderRadius: 10,
        marginBottom: 10,
        height: 50,
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
