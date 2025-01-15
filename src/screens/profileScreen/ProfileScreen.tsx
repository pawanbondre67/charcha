import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity ,TextInput, Alert} from 'react-native';
import { Button, Avatar, ActivityIndicator, IconButton, Text } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import { useTheme } from '../../theme/ThemeProvider';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import { useAuth } from '../../contextApi/AuthProvider';

const ProfileScreen = () => {
  const { Colors , setScheme , dark} = useTheme();
  const [name, setName] = useState('John Doe');
  const [profileImage, setProfileImage] = useState('https://avatar.iran.liara.run/public/boy?username=Ash');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [signoutLoading, setSignoutLoading] = useState(false);
  const navigation = useNavigation();
  const {logout} = useAuth();

  const handleImagePicker = () => {
    setLoading(false);
    launchImageLibrary({}, (response) => {
      if (response.assets && response.assets.length > 0) {
        setProfileImage(response.assets[0].uri);
      }
      setLoading(false);
    });
  };

  
  const onSignOut = async () => {
    console.log('Sign-out button clicked');
    setSignoutLoading(true);
    try {
      // await AsyncStorage.removeItem('user');
      logout();

      console.log('User signed out!');
      navigation.replace('login');
    } catch (error) {
      console.error(error + 'Error signing out');
      Alert.alert('Error', error.toString());
    } finally {
      setSignoutLoading(false);
    }
  };

  const handleSaveName = () => {
    setIsEditing(false);
    // Implement save name functionality here
    console.log('Name saved:', name);
  };

  const toggleTheme = () => {
    setScheme(dark ? 'light' : 'dark');
  };


  return (
    <View style={[styles.container, { backgroundColor: Colors.cardBackground }]}>
      <View style={[styles.card , {backgroundColor : Colors.background}]}>
      <TouchableOpacity onPress={handleImagePicker}>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <Avatar.Image size={100} source={{ uri: profileImage }} style={styles.avatar} />
        )}
      </TouchableOpacity>
      <View style={styles.nameContainer}>
        {isEditing ? (
          <View style={styles.nameDisplay}>
            <TextInput
              value={name}
              autoFocus
              onChangeText={text => setName(text)}
              style={[styles.name, { color: Colors.text }]}
            />
            <IconButton
              icon="content-save"
              size={20}
              onPress={handleSaveName}
            />
          </View>
        ) : (
          <View style={styles.nameDisplay}>
            <Text style={[styles.name, { color: Colors.text }]}>{name}</Text>
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => setIsEditing(true)}
            />
          </View>
        )}
      </View>

      {signoutLoading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <TouchableOpacity style={[styles.button , {backgroundColor:Colors.primary}]} onPress={onSignOut}>
          <Text style={{color:Colors.text ,  fontWeight: 'bold'}}>Logout</Text>
        <MaterialCommunityIcons name="logout" size={20} color="white" />
      </TouchableOpacity>
      )}
      </View>

      <IconButton
        icon={dark ? "weather-sunny" : "weather-night"}
        size={30}
        onPress={toggleTheme}
        style={styles.themeToggle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    padding: 20,
    borderRadius: 40,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    // elevation: 5,

  },

  avatar: {
    marginBottom: 20,
  },
  nameContainer: {
    width: '100%',
    marginBottom: 20,
  },
  nameDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
    borderBottomWidth : 1,
    borderRadius : 10,
    borderColor : 'gray',
  },
  nameEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    width: '40%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderColor: 'white',
    borderWidth: 1,
    padding: 10,
    borderRadius: 40,
  },
  themeToggle: {
    position: 'absolute',
    top: 40,
    right: 20,
    borderWidth: 1,
    
  },
});

export default ProfileScreen;