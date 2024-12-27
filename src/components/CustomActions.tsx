import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { launchCamera, CameraOptions } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
interface CustomActionsProps {
  onSend: (messages: any[]) => void;
}

const CustomActions: React.FC<CustomActionsProps> = ({ onSend }) => {

     const handlePress = async (action: string) => {
      console.log(`Pressed ${action}`);
      switch (action) {
        case 'camera':
          const cameraOptions: CameraOptions = {
            mediaType: 'photo',
            cameraType: 'front',
            saveToPhotos: true,
            presentationStyle: 'fullScreen',
          };
          launchCamera(cameraOptions, response => {
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.errorMessage) {
              console.log('ImagePicker Error: ', response.errorMessage);
            } else {
              const source = {uri: response.assets[0].uri};
              onSend([{image: source.uri}]);
            }
          });
          break;
        case 'file':
          try {
            const res = await DocumentPicker.pick({
              type: [DocumentPicker.types.allFiles],
            });
            console.log('File selected: ', res);
            onSend([{file: res.uri}]);
          } catch (err) {
            if (DocumentPicker.isCancel(err)) {
              console.log('User cancelled file picker');
            } else {
              throw err;
            }
          }
          break;
        default:
          break;
      }
    };

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handlePress('camera')}>
          <MaterialCommunityIcons name="camera" size={24} color="#007bff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handlePress('file')}>
          <MaterialCommunityIcons name="file" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>
    );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 5,
  },
  button: {
    marginHorizontal: 5,
    // marginBottom: 10,
  },
});

export default CustomActions;