
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from './screens/AuthScreen/AuthScreen';
import ChatScreen from './screens/ChatScreen/ChatScreen';
const RootStack = () => {

   type RootParamList = {
        auth: undefined,
        chat: undefined
    }

    const Stack = createNativeStackNavigator<RootParamList>();
  return (
    <NavigationContainer>

        <Stack.Navigator
         initialRouteName="auth"
         >
            <Stack.Screen name="chat" component={ChatScreen} />
            <Stack.Screen name="auth"
            options={{headerShown:false}} component={AuthScreen} />
        </Stack.Navigator>

    </NavigationContainer>
  );
};

export default RootStack;
