import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {ActivityIndicator} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const AuthScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('pawanbondre19@gmail.com');
  const [password, setPassword] = useState('123456');
  const [userName, setUserName] = useState('Pawan');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [passwordVisible, setPasswordVisible] = useState(false);
  
  const handleLogin = async () => {
    setLoading(true); // Start loading spinner
    if (!userName) {
      // Alert.alert('Username is required');
      setLoading(false); // Stop loading spinner
      return;
  }
    try {
      await auth().signInWithEmailAndPassword(email, password);
      // console.log(firebaseUser?.uid);
      setLoading(false); // Stop loading spinner
      navigation.navigate('chat');
    // eslint-disable-next-line no-catch-shadow
    } catch (error) {
      if (error instanceof Error) {
        if ((error as any).code === 'auth/wrong-password' || (error as any).code === 'auth/invalid-email') {
          console.log('Incorrect password!');
          setError('Incorrect email/password!');
        }
       else if (
          (error as any).code === 'auth/user-not-found' ||
          (error as any).code === 'auth/invalid-credential'
        ) {
          try {
            // Alert.alert('User not found. Creating a new user...');
           const credentials = await auth().createUserWithEmailAndPassword(email, password);
            console.log('User created!' , credentials.user?.uid);
            await firestore()
              .collection('users')
              .doc(credentials.user?.uid)
              .set({
                name: userName,
                email: email,
                role: password === '123456' ? 'admin' : 'user',
                id: credentials.user?.uid,
                secret_code: password,
              })
              .then(() => {
                console.log('User added!');
              });

            navigation.navigate('chat');
            console.log('User created and signed in!');
          } catch (createError) {
            if (createError instanceof Error) {
              console.log('Error creating user:', createError.message);
            }
          }
        } else if ((error as any).code === 'auth/wrong-password') {
          console.log('Incorrect password!');
        } else {
          console.log('Error signing in:', error.message);
        }
      } else {
        console.log('An unknown error occurred.');
      }
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <TextInput
          style={styles.input}
          placeholder="Enter username"
          placeholderTextColor="#aaa"
          value={userName}
          autoFocus={true}
          onChangeText={(text) => setUserName(text)}
        />
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
          onChangeText={(text) => setEmail(text)}
        />

      <View style={styles.passwordContainer}>
        <TextInput
            style={styles.input}
            placeholder="Enter Secret text"
            placeholderTextColor="#aaa"
            value={password}
            secureTextEntry={!passwordVisible}
            autoCapitalize="none"
            autoFocus={true}
            textContentType="password"
            onChangeText={(text) => setPassword(text)}
        />
        <Pressable
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={styles.eyeIconContainer}
        >
            <MaterialCommunityIcons
                name={passwordVisible ? 'eye-off' : 'eye'}
                size={24}
                color="#808080"
            />
        </Pressable>
    </View>
    

        {loading ? (
          <ActivityIndicator size="large" color="#bcc4ff" />
        ) : (
          <Pressable style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
            <MaterialCommunityIcons
                name="arrow-right"
                size={24}
                color="#fff"
            />
          </Pressable>
        )}
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
    marginBottom: 20,
    borderRadius: 10,
    width: '100%',
    color: '#333',
    fontSize: 18,
    backgroundColor: '#f9f9f9', // Light background for input field
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
});

export default AuthScreen;
