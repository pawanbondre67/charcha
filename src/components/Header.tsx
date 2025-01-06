import { View, ActivityIndicator, TouchableOpacity, Alert, Text, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Header = () => {

    const [signoutLoading, setSignoutLoading] = useState(false);
    const navigation = useNavigation();

    const onSignOut = async () => {
        console.log('Sign-out button clicked');
        setSignoutLoading(true);
        try {
          await AsyncStorage.removeItem('user');
          await auth().signOut();

          console.log('User signed out!');
          navigation.replace('login');
        } catch (error) {
          console.error(error + 'Error signing out');
          Alert.alert(error);
        } finally {
          setSignoutLoading(false);
        }
      };

  return (
    <View style={styles.header}>
        
        <Text
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              color: '#fff',
              fontSize: 20,
              fontWeight: 'bold',
            }}>
            Chat Screen
          </Text>
          {
       signoutLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <TouchableOpacity onPress={onSignOut}>
            <MaterialCommunityIcons name="logout" size={28} color="white" />
          </TouchableOpacity>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: '#bcc4ff',
    },
    });

export default Header;
