import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RegisterScreen from '../src/screens/AuthScreen/RegisterScreen';
import LoginScreen from '../src/screens/AuthScreen/LoginScreen';
import ChatScreen from './screens/ChatScreen/ChatScreen';
import RequestScreen from '../src/screens/RequestsScreen/RequestScreen';
import ProfileScreen from '../src/screens/profileScreen/ProfileScreen';
import HomeScreen from './screens/HomeScreen/HomeScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from './theme/ThemeProvider';
import {RootStackParamList , RootTabParamList} from './types/navigationTypes';

import SplashScreen from './screens/SplashScreen/SplashScreen';
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const ChatStack = () => {
  return (
    <Stack.Navigator initialRouteName="home">
      <Stack.Screen name="chat" component={ChatScreen} />
      <Stack.Screen name="home" options={{ headerShown: false }} component={HomeScreen} />
    </Stack.Navigator>
  );
};

const RootTab = () => {
  const { Colors } = useTheme();
  return (
    <Tab.Navigator
      initialRouteName="home"
      screenOptions={({ route }) => ({
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'home') {
            iconName = 'chat';
          } else if (route.name === 'request') {
            iconName = 'account-clock';
          } else if (route.name === 'profile') {
            iconName = 'account';
          }

          return <MaterialCommunityIcons name={iconName ?? ''} color={color} size={size} />;
        },
        tabBarActiveTintColor: '#bcc4ff',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopWidth: 0,
          elevation: 0,
          // paddingBottom: 10,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,

        },
      })}
    >
      <Tab.Screen name="home" options={{ headerShown: false }} component={ChatStack} />
      <Tab.Screen name="request" options={{ headerShown: false }} component={RequestScreen} />
      <Tab.Screen name="profile" options={{ headerShown: false }} component={ProfileScreen} />
    </Tab.Navigator>
  );
  
};
const RootStack = () => {
  return (

      <Stack.Navigator initialRouteName="splash">
        <Stack.Screen name="splash" options={{ headerShown: false }} component={SplashScreen} />
        <Stack.Screen name="register" options={{ headerShown: false }}  component={RegisterScreen} />
        <Stack.Screen name="login" options={{ headerShown: false }} component={LoginScreen} />
        <Stack.Screen name="home" component={RootTab} options={{ headerShown: false }} />
      </Stack.Navigator>

  );
};

export default RootStack;
