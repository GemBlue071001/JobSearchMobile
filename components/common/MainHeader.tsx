import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons

export default function MainHeader() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.container}>

      <View style={styles.topBar}>
        <TouchableOpacity>
          <Icon name="bars" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity>
          <Icon name="bell" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      
      <View style={styles.searchContainer}>
        <Icon name="search" size={16} color="#ccc" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Type keyword to search."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FF4500',
    paddingVertical: 50,
    paddingHorizontal: 15,
    elevation: 4,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
});
