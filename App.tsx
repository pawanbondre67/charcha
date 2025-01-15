import React from 'react';
import {StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import RootStack from './src/Navigation';
import { ThemeProvider } from './src/theme/ThemeProvider';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/contextApi/AuthProvider';
import { NavigationContainer } from '@react-navigation/native';

const App = () => {
  return (
    <PaperProvider>
      <AuthProvider>
    <SafeAreaProvider style={styles.backgroundStyle}>
      <ThemeProvider>
      <NavigationContainer>
      <GestureHandlerRootView>
        <RootStack />
      </GestureHandlerRootView>
      </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
    </AuthProvider>
    </PaperProvider>
  );
};
const styles = StyleSheet.create({
  backgroundStyle: {
    flex: 1,
  },
});

export default App;
