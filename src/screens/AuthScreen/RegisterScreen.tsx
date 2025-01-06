import React, {useState} from 'react';
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

const RegisterScreen = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigation = useNavigation();
  const [passwordVisible, setPasswordVisible] = useState(false);




  const validateEmail = email => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = password => {
    return password.length >= 6;
  };

  const handleRegister = async () => {
    setLoading(true); // Start loading spinner
    let valid = true;

    if (!userName) {
      //   Alert.alert('Username is required');
      setLoading(false);
      valid = false;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      setLoading(false); 
      valid = false;
    } else {
      setEmailError('');
    }

    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 6 characters long.');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (valid) {
      try {
        const credentials = await auth().createUserWithEmailAndPassword(
          email,
          password,
        );
        const UserToken = await messaging().getToken();
        console.log('User created!', credentials.user?.uid);
        const user = { email, password };
        await AsyncStorage.setItem('user', JSON.stringify(user));

        await firestore()
          .collection('users')
          .doc(credentials.user?.uid)
          .set({
            name: userName,
            email: email,
            role: password === '123456' ? 'admin' : 'user',
            id: credentials.user?.uid,
            FCMtoken: UserToken,
            secret_code: password,
          },{ merge: true })
          .then(() => {
            console.log('User added!');
          });
          
     



        navigation.navigate('chat');
        console.log('User created and signed in!');
      } catch (createError) {
        if (createError instanceof Error) {
            if ((createError as any).code === 'auth/email-already-in-use') {
                Alert.alert('email-already-in-use!');
              }
        } else {
          console.log('An unknown error occurred.');
        }
      } finally {
        setLoading(false);
        // Stop loading spinner
      }
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <TextInput
          style={[styles.input, {marginBottom: 20}]}
          placeholder="Enter username"
          placeholderTextColor="#aaa"
          value={userName}
          autoFocus={true}
          onChangeText={text => setUserName(text)}
        />

        <View
          style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            width: '100%',
            marginBottom: 20,
          }}>
          <TextInput
            style={styles.input}
            placeholder="Enter email"
            placeholderTextColor="#aaa"
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
            secureTextEntry={true}
            textContentType="emailAddress"
            onChangeText={text => setEmail(text)}
          />
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}
        </View>
        <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.input2]}
              placeholder="Enter Secret text"
              placeholderTextColor="#aaa"
              value={password}
              secureTextEntry={!passwordVisible}
              autoCapitalize="none"
              
              textContentType="password"
              onChangeText={text => setPassword(text)}
            />
            <Pressable
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={styles.eyeIconContainer}>
              <MaterialCommunityIcons
                name={passwordVisible ? 'eye-off' : 'eye'}
                size={24}
                color="#808080"
              />
            </Pressable>
          </View>
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : (
            <Text>password must contain 6 characters</Text>
          )}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#bcc4ff" />
        ) : (
          <Pressable style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
            <MaterialCommunityIcons name="arrow-right" size={24} color="#fff" />
          </Pressable>
        )}
        <TouchableOpacity onPress={() => navigation.navigate('login')}>
          <Text style={styles.linkText}> or login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#F6FBFF', // Light background color for simplicity
  },
  overlay: {
    backgroundColor: '#fff', // Solid white background
    padding: 20,
    borderRadius: 10,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // Add elevation for shadow effect on Android
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd', // Lighter border color
    padding: 10,

    borderRadius: 10,
    width: '100%',
    color: '#333',
    fontSize: 18,
    backgroundColor: '#f9f9f9', // Light background for input field
  },
  input2: {
    marginBottom: 4,
  },
  errorText: {
    color: 'red',
  },
  linkText: {
    padding: 10,
    color: '#007bff',
    marginTop: 16,
    textAlign: 'center',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 10,
    top: 13, // Align the icon vertically within the input field
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#bcc4ff', // Blue background color
    paddingVertical: 12, // Reduced padding for a smaller button
    paddingHorizontal: 10, // Reduced horizontal padding
    borderRadius: 25, // Slightly smaller border radius for a more compact button
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '40%', // Button width reduced to 80% of the container
    maxWidth: 200, // Set a maximum width for the button
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4, // Add shadow effect on Android
  },
  buttonText: {
    color: '#fff', // White text color
    fontSize: 16, // Slightly smaller font size
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
