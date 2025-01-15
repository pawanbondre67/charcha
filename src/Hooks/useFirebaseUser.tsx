import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../contextApi/AuthProvider';

const MyComponent = () => {
  const {user , setUser} = useAuth();

  const fetchUserRole = async () => {
    const userDoc = await firestore()
      .collection('users')
      .doc(user?.id)
      .get();
if(userDoc.exists){
    const userData = userDoc.data();
    const {  } = userData;

}
  }

  fetchUserRole();

  return null; // Replace with your component JSX
}

export default MyComponent;