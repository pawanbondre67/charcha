import {View, Text, StyleSheet, Image, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTheme} from '../../theme/ThemeProvider';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Appbar, Searchbar} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {useAuth} from '../../contextApi/AuthProvider';
import { NavigationStackProp } from 'react-navigation-stack';
import { RootStackParamList } from '../../types/navigationTypes';

interface UserCardProps {
  id: string;
  profileImage: string;
  name: string;
  lastMessage?: string;
  time?: string;
}

const UserCard: React.FC<UserCardProps> = ({
  id,
  profileImage,
  name,
  lastMessage,
  time,
}) => {
  const {Colors} = useTheme();
  console.log('UserCard:', id, profileImage, name, lastMessage, time);
  const navigation = useNavigation<NavigationStackProp<RootStackParamList>>();
  return (
    <Pressable
      style={[styles.card]}
      onPress={() => {
        navigation.navigate('chat', { userId: id, userName: name});
      }}>
      <Image source={{uri: profileImage}} style={styles.profileImage} />
      <View style={styles.textContainer}>
        <Text style={[styles.name, {color: Colors.text}]}>{name}</Text>
        <Text style={[styles.lastMessage, {color: Colors.subText}]}>
          {lastMessage}
        </Text>
      </View>
      <Text style={[styles.time, {color: Colors.subText}]}>{time}</Text>
    </Pressable>
  );
};

const HomeScreen = () => {
  const {Colors} = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
  const [users, setUsers] = useState<UserCardProps[]>([]);
  console.log('Users:', users);
  const {user} = useAuth();
  const onChangeSearch = (query: string) => setSearchQuery(query);

  useEffect(() => {
    const fetchRequests = async () => {
      console.log('Fetching requests...');
      try {
        const requestsCollection = await firestore()
          .collection('users')
          .doc(user?.id)
          .collection('connections')
          .get();
        const connections = requestsCollection.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as {id: string; name: string; profileImage: string}[];
        setUsers(connections);
      } catch (error) {
        console.log('Error fetching requests:', error);
      }
    };
    const interval = setInterval(fetchRequests, 1000);
    return () => clearInterval(interval);

  }, [user?.id]);

  return (
    <View style={[styles.container, {backgroundColor: Colors.background}]}>
      <Appbar.Header
        style={[styles.header, {backgroundColor: Colors.background}]}>
        <Appbar.Content
          title="Messages"
          titleStyle={{fontSize: 24, fontWeight: 'bold', color: Colors.text}}
        />
        <Appbar.Action
          icon="magnify"
          size={28}
          onPress={() => setIsSearchBarVisible(!isSearchBarVisible)}
        />
      </Appbar.Header>
      {isSearchBarVisible && (
        <Searchbar
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={[styles.searchbar, {backgroundColor: Colors.background}]}
        />
      )}
      <View>
        <Text style={{color: Colors.subText, margin: 20}}>Active Members</Text>
        <View style={styles.activeContainer}>
          <View style={styles.profileContainer}>
            <Image
              source={{
                uri: 'https://avatar.iran.liara.run/public/boy?username=sujit',
              }}
              style={styles.ActiveprofileImage}
            />
            <Text style={[styles.profileName, {color: Colors.text}]}>
              Sujit
            </Text>
          </View>
          <View style={styles.profileContainer}>
            <Image
              source={{
                uri: 'https://avatar.iran.liara.run/public/boy?username=girl',
              }}
              style={styles.ActiveprofileImage}
            />
            <Text style={[styles.profileName, {color: Colors.text}]}>John</Text>
          </View>
          <View style={styles.profileContainer}>
            <Image
              source={{
                uri: 'https://avatar.iran.liara.run/public/boy?username=pawan',
              }}
              style={styles.ActiveprofileImage}
            />
            <Text style={[styles.profileName, {color: Colors.text}]}>
              Pawan
            </Text>
          </View>
        </View>
      </View>
      <View
        style={[
          styles.usersContainer,
          {backgroundColor: Colors.cardBackground},
        ]}>
        {users.map(user => {
          return (
            <UserCard
              key={user.id}
              profileImage={user.profileImage}
              name={user.name}
              lastMessage={user.lastMessage}
              time={user.time}
              id={user.id}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  activeContainer: {
    // padding: 10,
    flexDirection: 'row',
    gap: 20,
    marginLeft: 10,
  },
  profileContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  ActiveprofileImage: {
    width: 60,
    height: 60,
    borderRadius: 25,
  },
  profileName: {
    marginTop: 5,
    fontSize: 16,
  },
  usersContainer: {
    flex: 1,
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    color: 'gray',
  },
  time: {
    fontSize: 12,
    color: 'gray',
  },
  searchbar: {
    borderWidth: 1,
    borderColor: 'gray',
    // margin: 5,
    marginHorizontal: 10,
  },
});

export default HomeScreen;
