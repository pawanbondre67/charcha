
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { IMessage,Message,MessageProps } from 'react-native-gifted-chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { FadeInRight } from 'react-native-reanimated';

import { isSameDay,isSameUser } from 'react-native-gifted-chat';
import {Swipeable} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

type ChatMessageBoxProps = {
  setReplyOnSwipeOpen: (message: IMessage) => void;
  updateRowRef: (ref: any) => void;
  CustomBubble: any;
} & MessageProps<IMessage>;

const ChatMessagebox = ({setReplyOnSwipeOpen, updateRowRef, CustomBubble, ...props } : ChatMessageBoxProps) => {

  const isNextMyMessage =   props.currentMessage &&
  props.nextMessage &&
  isSameUser(props.currentMessage, props.nextMessage) &&
  isSameDay(props.currentMessage, props.nextMessage);


  const renderRightAction = ( ) =>{
    // const scale = interpolate(prog.value, [0, 1 , 100], [0, 1 ,1]);
    // const transX = interpolate(prog.value, [0, 1 ,2], [0, -12,-20]);
    // {transform: [{scale : scale} , {translateX : transX}]} , {borderWidth:1}
    return (
     <Animated.View

     style={[styles.container ,
          isNextMyMessage
          ? styles.defaultBottomOffset
          : styles.defaultOffsetNext,
          props.position  === 'right' && styles.leftOffsetValue,
     ]}>
       <View style={styles.replyContainer}>
        <Pressable onPress={() => console.log('delete')}>
          <MaterialCommunityIcons name="reply" size={28} color="darkgrey" />
        </Pressable>
      </View>
     </Animated.View>
    );
  };
  const onSwipeOpenAction = () => {
    if (props.currentMessage) {
      // console.log('swipe open' , props.currentMessage);
      setReplyOnSwipeOpen({ ...props.currentMessage });
    }
  };

  return (
      <Swipeable
        ref={updateRowRef}
        friction={2}
        rightThreshold={40}
        renderRightActions={renderRightAction}
        renderLeftActions={renderRightAction}
        onSwipeableOpen={onSwipeOpenAction}
      >
       {
       props.currentMessage ? <Message renderBubble={CustomBubble} {...props} /> : null}
      </Swipeable>

  );
};
const styles = StyleSheet.create({
  container:{
    width: 40,
  },
  replyContainer:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultOffsetNext:{
    marginBottom: 10,
  },
  defaultBottomOffset:{
    marginBottom: 2,
  },
  leftOffsetValue:{
    marginLeft: 16,
  },
});

export default ChatMessagebox;
