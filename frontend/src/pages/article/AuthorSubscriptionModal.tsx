import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AuthorNotifToggle from 'src/components/AuthorNotifToggle';
import { Author } from 'src/types/data';
import { text } from 'src/styles/styles';

interface AuthorSubscriptionModalProps {
  isVisible: boolean;
  onClose: () => void;
  author: Author | null;
}

const AuthorSubscriptionModal: React.FC<AuthorSubscriptionModalProps> = ({
  isVisible,
  onClose,
  author
}) => {
  if (!author) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.handle} />
          
          <View style={styles.header}>
            <Text style={styles.headerText}>Subscribe to this Author</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.authorContainer}>            
            <View style={styles.toggleContainer}>
              <AuthorNotifToggle author={author} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 12,
    minHeight: 250,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#DDDDDD',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 5,
  },
  authorContainer: {
    paddingHorizontal: 4,
  },
  authorName: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  authorDescription: {
    ...text.textMedium,
    marginBottom: 20,
  },
  toggleContainer: {
    marginTop: 20,
  }
});

export default AuthorSubscriptionModal;