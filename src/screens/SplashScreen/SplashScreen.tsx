import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        console.log('fetchung user' , user)
        if (user) {
          const parsedUser = JSON.parse(user as string);
          console.log('user is present', parsedUser);
          navigation.navigate('home'); // Replace 'chat' with your target screen name
        } else {
          navigation.replace('login'); // Navigate to login if no user is found
        }
      } catch (error) {
        console.log('Error checking user login status:', error);
        navigation.replace('login'); // Navigate to login on error
      }
    };

    checkUserLoggedIn();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SplashScreen;