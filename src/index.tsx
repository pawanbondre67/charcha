
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import AuthScreen from './screens/AuthScreen/AuthScreen';
import ChatScreen from './screens/ChatScreen/ChatScreen';
import { useFirebaseUser } from './hooks/useFirebaseUser';
import RegisterScreen from './screens/AuthScreen/RegisterScreen';
import LoginScreen from './screens/AuthScreen/LoginScreen';

type RootParamList = {
  // auth: undefined,
  login: undefined,
  register: undefined,
  chat: undefined
}
const Stack = createNativeStackNavigator<RootParamList>();
const RootStack = () => {

  const { firebaseUser } = useFirebaseUser();
  return (
    <NavigationContainer>

        <Stack.Navigator
            initialRouteName= { firebaseUser ? 'chat' : 'login'}
            // initialRouteName='chat'
         >
            <Stack.Screen name="chat" options={{headerShown:false}} component={ChatScreen} />
            <Stack.Screen name="login" options={{headerShown:false}} component={LoginScreen} />
            <Stack.Screen name="register" options={{headerShown:false}} component={RegisterScreen} />
            {/* <Stack.Screen name="auth"
            options={{headerShown:false}} component={AuthScreen} /> */}
        </Stack.Navigator>

    </NavigationContainer>
  );
};

export default RootStack;
