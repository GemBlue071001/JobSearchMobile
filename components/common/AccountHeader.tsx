import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons

export default function AccountHeader() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View>
    <View style={styles.container}>
      {/* Top bar with menu and bell icons */}
      <View style={styles.topBar}>
        <TouchableOpacity>
          <Icon name="bars" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.text}>My Profile</Text>
        <TouchableOpacity>
          <Icon name="bell" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search bar */}

    </View>
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
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FF4500',
    paddingVertical: 30,
    paddingHorizontal: 10,
    elevation: 4,
    height:90
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
    marginRight: 10
  
  },
  searchInput: {
    flex: 1, 
    height: 40,
    fontSize: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
});
