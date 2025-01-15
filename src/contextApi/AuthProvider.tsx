import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {User} from '../types/userType';
import firestore from '@react-native-firebase/firestore';

interface AuthContextProps {
  user: User;
  setUser: (user: User) => void;
  login: (email: string, password: string) => Promise<void>;
  // register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
  user: {id: '', name: '', role: 'user', email: ''},
  setUser: () => {},
  login: async () => {},
  // register: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          fetchUserRole(parsedUser.id);
        }
      } catch (e) {
        console.log(e);
      }
    };

    loadUser();
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      const userDoc = await firestore().collection('users').doc(userId).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        const {name, role, email} = userData as {
          name?: string;
          role?: string;
          email?: string;
        };

        // Update the user state with the fetched data
        setUser({
          id: userId,
          name: name || '',
          role: role || 'user',
          email: email || '',
        });
      }
    } catch (e) {
      console.log('error at fetching role', e);
    }
  };

  const storeUser = async (newUser: User) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: (newUser: User) => {
          setUser(newUser);
          storeUser(newUser);
        },
        login: async (email: string, password: string) => {
          try {
            const userCredential = await auth().signInWithEmailAndPassword(
              email,
              password,
            );
            const userId = userCredential.user.uid;
            // Fetch additional user details from Firestore
            await fetchUserRole(userId);
            storeUser({id: userId, email: email});
            console.log('user stored in local storage');
          } catch (e) {
            throw e;
          }
        },
        logout: async () => {
          try {
            await auth().signOut();
            setUser(undefined);
            await AsyncStorage.removeItem('user');
          } catch (e) {
            console.error(e);
          }
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
