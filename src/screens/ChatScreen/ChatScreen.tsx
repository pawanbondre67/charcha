// import {View, Text, Switch} from 'react-native';
// import React from 'react';
// import {useTheme} from '../../theme/ThemeProvider';

// const ChatScreen = () => {
//   console.log(useTheme, 'current theme');
//   const {Colors, dark, setScheme} = useTheme();
//   console.log(Colors, 'colors');
//   console.log(dark, 'dark');

//   const toggleTheme = () => {
//     setScheme(dark ? 'light' : 'dark');
//   };

//   return (
//     <View style={{backgroundColor: Colors.primary}}>
//       <Switch value={dark} onValueChange={toggleTheme} />
//       <Text style={{color: Colors.text}}>Navigation</Text>
//     </View>
//   );
// };

// export default ChatScreen;


import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

const ChatScreen = () => {
  const route = useRoute();
  const { userId, userName } = route.params as { userId: string, userName: string };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Chat with {userName}</Text>
      <Text style={styles.text}>User ID: {userId}</Text>
      {/* Add your chat UI here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
});

export default ChatScreen;