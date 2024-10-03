import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import LocationModal from "../LocationModal";
type RootStackParamList = {

  SearchResults: { query: string; location?: string }; 
};

// Use the type for navigation prop
type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SearchResults'>;
export default function SearchHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location,setLocation]=useState("")
  const [open, setOpen] = useState(false);
  const navigation = useNavigation<SearchScreenNavigationProp>();

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigation.navigate("SearchResults", { query: searchQuery ,location:location });
    } else {
      alert("Please enter a search query");
    }
  };
  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation);
    navigation.setParams({ location: newLocation }); 
  };
  const handleOpenModal = () => {
    setOpen((prev) => !prev);
  };


  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
          accessible={true}
        >
          <Icon name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>
        <View style={styles.search}>
          <Icon
            name="search"
            size={16}
            color="black"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Type keyword to search."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
        </View>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleOpenModal}
        >
          <Icon name="tune" size={30} color="#fff" />
        </TouchableOpacity>
        <LocationModal
          modalVisible={open}
          setModalVisible={setOpen}
          navigation={navigation}
          location={location}
          setLocation={handleLocationChange} // Truyền handleLocationChange cho LocationModal
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FF4500",
    paddingTop: 30,
    paddingBottom: 1,
    paddingHorizontal: 10,
    elevation: 4,
    height: 90,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconButton: {
    // padding: 10,
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    height: 40,
    width: 300,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
});
