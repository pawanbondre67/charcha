import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

const DialogBox = ({ message_id, visible, showDialog, hideDialog }) => {
  const groupId = '1234567';

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog} style={styles.dialog}>
        <Dialog.Title style={styles.title}>Delete message?</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.contentText}>
            Are you sure you want to delete this message?
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog} style={styles.button} labelStyle={styles.buttonText}>
            Cancel
          </Button>
          <Button
            onPress={async () => {
              await firestore()
                .collection('groups')
                .doc(groupId)
                .collection('messages')
                .doc(message_id)
                .delete();
              hideDialog();
            }}
            style={styles.button}
            labelStyle={styles.buttonText}
          >
            Delete
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 0,
  },
  title: {
    color: '#343a40',
    fontSize: 20,
    fontWeight: 'bold',
  },
  contentText: {
    color: '#495057',
    fontSize: 16,
  },
  button: {
    marginHorizontal: 5,
    padding:0,
  },
  buttonText: {
    color: '#007bff',
    fontSize: 14,
  },
});

export default DialogBox;