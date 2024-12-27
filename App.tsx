
import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import RootStack from './src';

const App = () => {
  return (
    <PaperProvider>
      <SafeAreaProvider>
      <SafeAreaView style={styles.backgroundStyle}>
        <GestureHandlerRootView >
          <RootStack />
        </GestureHandlerRootView>
      </SafeAreaView>
      </SafeAreaProvider>

    </PaperProvider>
  );
};
const styles = StyleSheet.create({
  backgroundStyle: {
    flex: 1,
  },
});

export default App;
