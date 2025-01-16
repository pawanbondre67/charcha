import React, {useState, useEffect} from 'react';
import {View, FlatList, StyleSheet, Alert} from 'react-native';
import {FAB, Text, Card, Button, Avatar, Searchbar} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import {useTheme} from '../../theme/ThemeProvider';
import {useAuth} from '../../contextApi/AuthProvider';
import {useNavigation} from '@react-navigation/native';
import {NavigationStackProp} from 'react-navigation-stack';

type RootStackParamList = {
  home: {
    screen: string;
    params: {
      userId?: string;
      userName?: string;
    };
  };
  // Add other screens here
};

const RequestScreen = () => {
  const {Colors} = useTheme();
  const navigation = useNavigation<NavigationStackProp<RootStackParamList>>();
  const [requests, setRequests] = useState<
    {id: string; name: string; profileImage: string}[]
  >([]);
  const [sentRequests, setSentRequests] = useState<
  {id: string; name: string; profileImage: string , status : string}[]
>([]);

// const [isSent , setIsSent] = useState(false);
// const [isAccpeted , setIsAccepted] = useState(false);

  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState<
    {id: string; name: string; profileImage: string , isSent?: boolean}[]
  >([]);
  const [searchResults, setSearchResults] = useState<
    {id: string; name: string; profileImage: string , isSent?: boolean; }[]
  >([]);
  const {user} = useAuth();
  useEffect(() => {
    const fetchAllUsers = async () => {
      console.log('Fetching users...');
      try {
         // Fetch connection user IDs
         const connectionsSnapshot = await firestore()
         .collection('users')
         .doc(user?.id)
         .collection('connections')
         .get();

       const connectionUserIds = connectionsSnapshot.docs.map(doc => doc.data().userId);
      //  setConnectionUserIds(connectionUserIds);
      console.log('Connection User Ids:', connectionUserIds);

       // Fetch all users excluding the current user and connections
       const usersCollection = await firestore()
         .collection('users')
         .where('id', '!=', user?.id)
         .get();

       const users = usersCollection.docs
         .map(doc => ({
           id: doc.id,
           ...doc.data(),
         }))
         .filter(user => !connectionUserIds.includes(user.id)) as { id: string; name: string; profileImage: string }[];

         console.log('All Users:', users);
       setAllUsers(users);
      } catch (error) {
        console.log('Error fetching users:', error);
      }
    };

    const fetchRequests = async () => {
      console.log('Fetching requests...');
      try {
        const requestsCollection = await firestore()
          .collection('users')
          .doc(user?.id)
          .collection('requests')
          .get();
        const requests = requestsCollection.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as {id: string; name: string; profileImage: string}[];
        setRequests(requests);
      } catch (error) {
        console.log('Error fetching requests:', error);
      }
    };
    const fetchSentRequests = async () => {
      try {
        const sentRequestsCollection = await firestore()
          .collection('users')
          .doc(user?.id)
          .collection('sentRequests')
          .get();

       // Map the documents to extract the necessary information
       const sentRequestsList = sentRequestsCollection.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as {id: string; name: string; profileImage: string , status : string }[];

    // Update the state with the fetched data
    setSentRequests(sentRequestsList);


      } catch (error) {
        console.log('Error fetching sent requests:', error);
      }
    };

    // fetchAllUsers();
    // fetchSentRequests();
    const interval = setInterval(() => {
      fetchAllUsers();
      fetchRequests();
      fetchSentRequests();
    }, 300000000);
    return () => clearInterval(interval);

    //     const timeout = setTimeout(() => {
    //   const interval = setInterval(fetchRequests, 60000); // 1 minute
    //   return () => clearInterval(interval);
    // }, 60000); // 1 minute delay

    // return () => clearTimeout(timeout);
  }, [user?.id]);

  const handleAccept = async (requesterId: string, name: string) => {
    console.log('Connection saved:', requesterId, name);

    const combinedId = `${user.id}_${requesterId}`;
    try {
      // // Update the status of the request to 'accepted' for the current user
      // await firestore()
      //   .collection('users')
      //   .doc(user?.id)
      //   .collection('requests')
      //   .doc(requesterId)
      //   .update({status: 'accepted'});

      // Create a connection for the current user
      await firestore()
        .collection('users')
        .doc(user?.id)
        .collection('connections')
        .doc(combinedId)
        .set({
          userId: requesterId,
          name: name,
          profileImage: `https://avatar.iran.liara.run/public/boy?username=${name}`,
        });

        console.log('Connection saved for current user:', requesterId, name);

      // Create a connection for the requester
      await firestore()
        .collection('users')
        .doc(requesterId)
        .collection('connections')
        .doc(combinedId)
        .set({
          userId: user?.id,
          name: user?.name,
          profileImage: `https://avatar.iran.liara.run/public/boy?username=${user?.name}`,
        });

        console.log('Connection saved for requester:', user?.id, user?.name);

        // Update the status of the sent request to 'accepted' for the requester

        await firestore()
        .collection('users')
        .doc(requesterId)
        .collection('sentRequests')
        .doc(user.id)
        .update({status: 'accepted'});

        console.log('Request status updated to accepted for :', requesterId);



      // Create a chatroom for the connection
        await firestore()
        .collection('chatrooms')
        .doc(combinedId)
        .set({
          members: [user?.id, requesterId],
          lastMessage: null,
          lastMessageTime: null,
        });
      
        console.log('Chatroom created:', combinedId);

        

      // Refresh the requests
      // Navigate to the ChatScreen and pass data
      navigation.navigate('home', {
        screen: 'chat',
        params: {userId: combinedId, userName: name},
      });

       await firestore()
        .collection('users')
        .doc(user.id)
        .collection('requests')
        .doc(requesterId)
        .delete();

      // Update the state to remove the request from the list
  setRequests(prevRequests =>
    prevRequests.filter(request => request.id !== requesterId),
  );


    } catch (error) {
      console.log('Error saving connection:', error);
    }
  };

  const handleReject = async (id: string) => {
    // Implement reject functionality here

    console.log('Rejected request:', id);
    try {
      // Delete the request from the current user's requests subcollection
      await firestore()
        .collection('users')
        .doc(user?.id)
        .collection('requests')
        .doc(id)
        .delete();

      // Remove the request from the local state
      setRequests(prevRequests =>
        prevRequests.filter(request => request.id !== id),
      );

      console.log('Rejected request:', id);
    } catch (error) {
      console.log('Error rejecting request:', error);
    }


  };

  const confirmReject = (id: string) => {
    Alert.alert(
      'Reject Request',
      'Are you sure you want to reject this request?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reject',
          onPress: () => handleReject(id),
        },
      ],
    );
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);

      return <Text style={{color: Colors.text}}>Search</Text>;
    }

    const filteredUsers = allUsers.filter(user =>
      user.name.toLowerCase().includes(query.toLowerCase()),
    );
    setSearchResults(filteredUsers);
  };

  const handleConnect = async (receiverId: string , receiverName: string) => {
    // Implement connect functionality here
    await firestore()
      .collection('users')
      .doc(receiverId)
      .collection('requests')
      .doc(user?.id)
      .set({
        id: user?.id,
        name: user?.name,
        profileImage: `https://avatar.iran.liara.run/public/boy?username=${user?.name}`,
        isSent: true,
      });

    await firestore()
      .collection('users')
      .doc(user?.id)
      .collection('sentRequests')
      .doc(receiverId)
      .set({
        id: receiverId,
        name: receiverName,
        profileImage :`https://avatar.iran.liara.run/public/boy?username=${receiverName}`, 
        status: 'pending',
        isSent : true,
      });

   

    // console.log(sendConnection, 'usersCollection');
    setSentRequests([...sentRequests, { id: receiverId, name: receiverName, status: 'pending' , profileImage : `https://avatar.iran.liara.run/public/boy?username=${receiverName}` }]);
        setAllUsers(allUsers.map(user =>
          user.id === receiverId ? {...user, isSent: true} : user,
        ));


      // setIsSent(true);
      console.log('Sent connection request to:', receiverId);
  };


  const clearSentRequests = () => {
    setSentRequests([]);
  };

  const renderSentItem = ({
    item,
  }: {
    item: {id: string; name: string; profileImage: string , status : string};
  }) => (
    <SentRequestsCard
      id={item.id}
      name={item.name}
      profileImage={item.profileImage}
      status={item.status}
    />
  );


  const renderItem = ({
    item,
  }: {
    item: {id: string; name: string; profileImage: string};
  }) => (
    <RequestCard
      id={item.id}
      name={item.name}
      profileImage={item.profileImage}
      onAccept={handleAccept}
      onReject={confirmReject}
    />
  );

  const renderSearchResultItem = ({
    item,
  }: {
    item: {id: string; name: string; profileImage: string , isSent: boolean};
  }) => (
    <SearchResultCard
      id={item.id}
      name={item.name}
      profileImage={item.profileImage}
      onConnect={() => handleConnect(item.id, item.name)}
      isSent={item.isSent ?? false}
    />
  );

  const handleFabPress = () => {
    setIsSearchBarVisible(!isSearchBarVisible);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <View style={[styles.container, {backgroundColor: Colors.cardBackground}]}>
      {isSearchBarVisible ? (
        <>
          <Searchbar
            placeholder="Search"
            onChangeText={handleSearch}
            value={searchQuery}
            style={styles.searchbar}
          />
          <FlatList
            data={searchResults.length > 0 ? searchResults : allUsers}
            renderItem={renderSearchResultItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
          />
        </>
      ) : (
        <>
          <Text style={[styles.title, {color: Colors.text}]}>
            Pending Requests
          </Text>
          <FlatList
            data={requests}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
          />
          <Text style={[styles.title, {color: Colors.text}]}>
           Requests Sent
          </Text>
          <Button
            style={{backgroundColor: Colors.cardBackground ,}}
           onPress={clearSentRequests}>
            Clear All Request
           </Button>
          <FlatList
            data={sentRequests}
            renderItem={renderSentItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
          />
        </>
      )}
      <FAB style={styles.fab} icon="plus" onPress={handleFabPress} />
    </View>
  );
};

const RequestCard = ({
  id,
  name,
  profileImage,
  onAccept,
  onReject,
}: {
  id: string;
  name: string;
  profileImage: string;
  onAccept: (id: string, name: string) => void;
  onReject: (id: string) => void;
}) => {
  const {Colors} = useTheme();

  return (
    <Card style={[styles.card, {backgroundColor: Colors.background}]}>
      <Card.Title
        title={name}
        left={props => <Avatar.Image {...props} source={{uri: profileImage}} />}
      />
      <Card.Actions>
        <Button
          style={{backgroundColor: Colors.cardBackground}}
          onPress={() => onAccept(id, name)}>
          Accept
        </Button>
        <Button
          style={{backgroundColor: Colors.primary}}
          onPress={() => onReject(id)}>
          Reject
        </Button>
      </Card.Actions>
    </Card>
  );
};

const SearchResultCard = ({
  id,
  name,
  profileImage,
  onConnect,
  isSent,
}: {
  id: string;
  name: string;
  profileImage: string;
  onConnect: (id: string , name : string) => void;
  isSent: boolean;

}) => {
  const {Colors} = useTheme();
  console.log('isSent:', isSent);

  return (
    <Card style={[styles.card, {backgroundColor: Colors.background}]}>
      <Card.Title
        title={name}
        left={props => <Avatar.Image {...props} source={{uri: profileImage}} />}
      />
      <Card.Actions>
      <Button
          style={{ backgroundColor: Colors.primary }}
          onPress={() => onConnect(id , name)}
          disabled={isSent}>
          {isSent ? 'Request Sent' : 'Connect'}
        </Button>
      </Card.Actions>
    </Card>
  );
};


const SentRequestsCard = ({
  id,
  name,
  profileImage,
  status
  // isAccpeted,
}: {
  id: string;
  name: string;
  profileImage: string;
  status : string;
  // isAccpeted: boolean;
  // onConnect: (id: string , name : string) => void;
}) => {
  const {Colors} = useTheme();

  return (
    <Card style={[styles.card, {backgroundColor: Colors.background}]}>
      <Card.Title
        title={name}
        left={props => <Avatar.Image {...props} source={{uri: profileImage}} />}
      />
      <Card.Actions>
      <Button
          style={{ backgroundColor: Colors.primary }}
          onPress={() => console.log('Request Sent')}
          disabled={status === 'accepted'}>
          {status === 'accepted' ? 'Accepted' : 'Pending'}
           </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  list: {
    flexGrow: 1,
  },
  card: {
    marginBottom: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  searchbar: {
    marginBottom: 10,
  },
});

export default RequestScreen;
