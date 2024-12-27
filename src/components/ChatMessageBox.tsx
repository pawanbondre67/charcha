
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { IMessage,Message,MessageProps } from 'react-native-gifted-chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { SharedValue } from 'react-native-reanimated';

import { isSameDay,isSameUser } from 'react-native-gifted-chat';

type ChatMessageboxProps = {
  setReplyOnSwipeOpen : (message : IMessage) => void;
  updateRowRef : (ref : any) => void;
  } & MessageProps<IMessage>;

const ChatMessagebox = ({setReplyOnSwipeOpen, updateRowRef, ...props } : ChatMessageboxProps) => {

  const isNextMyMessage = props.currentMessage &&
  props.nextMessage &&
  isSameUser(props.currentMessage, props.nextMessage) &&
  isSameDay(props.currentMessage, props.nextMessage);


  const renderRightAction = ( prog: SharedValue<number>) =>{
    // const scale = interpolate(prog.value, [0, 1 , 100], [0, 1 ,1]);
    // const transX = interpolate(prog.value, [0, 1 ,2], [0, -12,-20]);
    // {transform: [{scale : scale} , {translateX : transX}]} , {borderWidth:1}
    return (
     <Reanimated.View 
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
     </Reanimated.View>
    );
  };

  const onSwipeOpenAction =()=>{
    console.log('swipe open');
    if(props.currentMessage){
      setReplyOnSwipeOpen({...props.currentMessage});
    }
  }
  return  (
  <ReanimatedSwipeable
  ref={updateRowRef}
  friction={2}
  leftThreshold={40}
  renderRightActions={renderRightAction}
  onSwipeableOpen={onSwipeOpenAction}
  >

    <Message {...props} />
  </ReanimatedSwipeable>);
};

const styles= StyleSheet.create({
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
})

export default ChatMessagebox;
