
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from './screens/AuthScreen/AuthScreen';
import ChatScreen from './screens/ChatScreen/ChatScreen';
import { useFirebaseUser } from './hooks/useFirebaseUser';

type RootParamList = {
  auth: undefined,
  chat: undefined
}
const Stack = createNativeStackNavigator<RootParamList>();
const RootStack = () => {
           
  const { firebaseUser } = useFirebaseUser();
  return (
    <NavigationContainer>

        <Stack.Navigator
            initialRouteName= {firebaseUser ? 'chat' : 'auth'}
            // initialRouteName='chat'
         >
            <Stack.Screen name="chat" options={{title :'Charcha'}} component={ChatScreen} />
            <Stack.Screen name="auth"
            options={{headerShown:false}} component={AuthScreen} />
        </Stack.Navigator>

    </NavigationContainer>
  );
};

export default RootStack;
