import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons
import { useNavigation } from '@react-navigation/native'; // Assuming you're using React Navigation

export default function AccountHeader() {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false); 
  const navigation = useNavigation(); 

  // Toggle modal visibility
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  // Handle logout logic
  const handleLogout = async () => {
    try {
      await AsyncStorage.clear(); // Clear async storage
      console.log('Logged out and cleared storage.');
      toggleModal(); // Close modal after logging out
     // Navigate to the Login screen (adjust to your screen name)
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <View>
      <View style={styles.container}>
        {/* Top bar with menu and exit icons */}
        <View style={styles.topBar}>
          <TouchableOpacity>
            <Icon name="bars" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.text}>My Profile</Text>
          <TouchableOpacity onPress={toggleModal}>
            <Icon name="sign-out" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        {/* Uncomment the search bar if needed */}
        {/* <View style={styles.searchContainer}>
          <View style={styles.search}>
            <Icon name="search" size={16} color="black" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Type keyword to search."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View> */}

        {/* Modal for Logout Confirmation */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={toggleModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Are you sure you want to logout?</Text>
              <Button
                color={"#FF4500"}
                title="Logout"
                onPress={handleLogout} // Call the handleLogout function correctly
              />
              <Button title="Cancel" onPress={toggleModal} color="red" />
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FF4500',
    paddingVertical: 30,
    paddingHorizontal: 10,
    elevation: 4,
    height: 90,
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: '900',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchContainer: {
    marginTop: -20,
    paddingHorizontal: 10,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    gap: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
});
