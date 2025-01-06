import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ActivityIndicator} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const [email, setEmail] = useState('pawanbondre19@gmail.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const navigation = useNavigation();
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
                     // await auth().signInWithEmailAndPassword(email, password);
       console.log('user is present' , user);
          navigation.replace('chat');
        }
      } catch (error) {
        console.log('Error checking user login status:', error);
      }
    };

    checkUserLoggedIn();
  }, [navigation]);


  const validateEmail = email => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = password => {
    return password.length >= 6;
  };

  const handleLogin = async () => {
    setLoading(true); // Start loading spinner
    let valid = true;

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      valid = false;
      setLoading(false); // Stop loading spinner
    } else {
      setEmailError('');
    }

    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 6 characters long.');
      valid = false;
      setLoading(false); // Stop loading spinner
    } else {
      setPasswordError('');
    }

    if (valid) {
      try {
        await auth().signInWithEmailAndPassword(email, password);
        const user = { email, password };
        await AsyncStorage.setItem('user', JSON.stringify(user));
        console.log('user is logde in' , user);
        setLoading(false); // Stop loading spinner
        navigation.replace('chat');
      } catch (error) {
        if(error instanceof Error){
            if ((error as any).code === 'auth/invalid-credential') {
                Alert.alert('Incorrect email/password!');
              }
        }
      } finally {
        setLoading(false); // Stop loading spinner
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
       <View style={{flexDirection:'column' , alignItems:"flex-start", width:'100%',marginBottom: 20,}}>
       <TextInput
          style={styles.input}
          placeholder="Enter email"
          placeholderTextColor="#aaa"
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoFocus={true}
          secureTextEntry={true}
          textContentType="emailAddress"
          onChangeText={text => setEmail(text)}
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

       </View>
        <View style={{flexDirection:'column' , alignItems:"flex-start"}}>
        <View style={styles.passwordContainer}>
        <TextInput
            style={[styles.input,styles.input2] }
            placeholder="Enter Secret text"
            placeholderTextColor="#aaa"
            value={password}
            secureTextEntry={!passwordVisible}
            autoCapitalize="none"
            // autoFocus={true}
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
        ) : null
        }
        </View>
       

        {loading ? (
          <ActivityIndicator size="large" color="#bcc4ff" />
        ) : (
          <Pressable style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
            <MaterialCommunityIcons name="arrow-right" size={24} color="#fff" />
          </Pressable>
        )}
        <TouchableOpacity onPress={() => navigation.navigate('register')}>
          <Text style={styles.linkText}> or Register</Text>
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
  input2:{
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
    marginTop: 10,
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

export default LoginScreen;
