import React, { useState } from 'react';
import { Bubble, Time } from 'react-native-gifted-chat';
import { StyleSheet } from 'react-native';

interface CustomBubbleProps {
    isAdmin: boolean;
    props: any;
  }

  const CustomTime = (props) => {
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
const CustomBubble = ({props , isAdmin } : CustomBubbleProps) => {
  const [isLongPressed, setIsLongPressed] = useState(false);

  const handleLongPress = () => {
    console.log('bubble is long pressed', props.currentMessage._id);
    setIsLongPressed(!isLongPressed);

    if (isAdmin) {
      // showDialog(props.currentMessage._id);
    }
  };

  // eslint-disable-next-line react/no-unstable-nested-components


  return (
    <Bubble
      {...props}
      onLongPress={handleLongPress}
      wrapperStyle={{
        left: isLongPressed ? styles.leftBubbleLongPressed : styles.leftBubble,
        right: isLongPressed ? styles.rightBubbleLongPressed : styles.rightBubble,
      }}
      usernameStyle={{ color: 'blue' }}
      textStyle={{
        left: styles.leftBubbleText,
        right: styles.rightBubbleText,
      }}
      renderTime={props => <CustomTime {...props} />}
    />
  );
};

const styles = StyleSheet.create({
  leftBubble: {
    backgroundColor: '#f0f0f0',
  },
  rightBubble: {
    backgroundColor: '#007aff',
  },
  leftBubbleLongPressed: {
    backgroundColor: '#d3d3d3',
  },
  rightBubbleLongPressed: {
    backgroundColor: '#005bb5',
  },
  leftBubbleText: {
    color: '#000',
  },
  rightBubbleText: {
    color: '#fff',
  },
  leftTimeText: {
    color: '#aaa',
    fontSize: 12,
  },
  rightTimeText: {
    color: '#aaa',
    fontSize: 12,
  },
});

export default CustomBubble;