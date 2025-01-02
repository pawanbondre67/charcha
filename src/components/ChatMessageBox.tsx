import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { IMessage, Message, MessageProps } from 'react-native-gifted-chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { isSameDay, isSameUser } from 'react-native-gifted-chat';
import { Swipeable } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

type ChatMessageBoxProps = {
  setReplyOnSwipeOpen: (message: IMessage) => void;
  updateRowRef: (ref: any) => void;
  CustomBubble: any;
} & MessageProps<IMessage>;

const ChatMessagebox = ({ setReplyOnSwipeOpen, updateRowRef, CustomBubble, ...props }: ChatMessageBoxProps) => {
  const isNextMyMessage =
    props.currentMessage &&
    props.nextMessage &&
    isSameUser(props.currentMessage, props.nextMessage) &&
    isSameDay(props.currentMessage, props.nextMessage);

  const renderRightAction = () => {
    return (
      <Animated.View
        style={[
          styles.container,
          isNextMyMessage ? styles.defaultBottomOffset : styles.defaultOffsetNext,
          // styles.rightAction,
        ]}
      >
        <View style={styles.actionContent}>
          <Pressable onPress={() => console.log('Right Action Triggered: Delete')}>
            <MaterialCommunityIcons name="linux" size={28} color="grey" />
          </Pressable>
        </View>
      </Animated.View>
    );
  };

  const renderLeftAction = () => {
    return (
      <Animated.View
        style={[
          styles.container,
          isNextMyMessage ? styles.defaultBottomOffset : styles.defaultOffsetNext,

        ]}
      >
        <View style={styles.actionContent}>
          <Pressable onPress={() => console.log('Left Action Triggered: Reply')}>
            <MaterialCommunityIcons name="reply" size={28} color="grey" />
          </Pressable>
        </View>
      </Animated.View>
    );
  };

  const onSwipeOpenAction = () => {
    if (props.currentMessage) {
      setReplyOnSwipeOpen({ ...props.currentMessage });
    }
  };

  return (
    <Swipeable
      ref={updateRowRef}
      friction={1}
      dragOffsetFromLeftEdge={5}
      dragOffsetFromRightEdge={5}
      rightThreshold={10}
      leftThreshold={5}

      renderRightActions={props.position === 'right' ? renderRightAction : undefined}
      renderLeftActions={props.position === 'left' ? renderLeftAction : undefined}
      onSwipeableOpen={onSwipeOpenAction}
    >
      {props.currentMessage ? <Message renderBubble={CustomBubble} {...props} /> : null}
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 80,
  },
  actionContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultOffsetNext: {
    marginBottom: 10,
  },
  defaultBottomOffset: {
    marginBottom: 2,
  },
  rightAction: {
    backgroundColor: 'lightcoral',
  },
  leftAction: {
    backgroundColor: 'lightblue',
  },
});

export default ChatMessagebox;
