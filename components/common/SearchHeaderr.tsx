import React, { useState, useEffect } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import LocationModal from "../LocationModal";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Home: undefined;
  SearchResults: { query: string; location?: string }; 
};

// Define kiểu cho route prop
type SearchScreenRouteProp = RouteProp<RootStackParamList, 'SearchResults'>;
type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SearchResults'>;
export default function SeacrHeaderr() {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState("");

  const navigation = useNavigation<SearchScreenNavigationProp>();

  // Lấy route với kiểu cụ thể
  const route = useRoute<SearchScreenRouteProp>();
 
  const query = route.params?.query || ""; // Lấy query từ params nếu có
  const filterLocation=route.params?.location || ""

  
  useEffect(() => {
    if (query || filterLocation) {
      setSearchQuery(query);
      setLocation(filterLocation)
    }
  }, [query]);

  // Cập nhật location và truyền nó vào SearchResults thông qua navigation.setParams()
  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation);
    navigation.setParams({ location: newLocation }); // Cập nhật params của màn hình SearchResults
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
          />
        </View>
        <TouchableOpacity style={styles.iconButton} onPress={handleOpenModal}>
          <Icon name="tune" size={30} color="#fff" />
        </TouchableOpacity>

        <LocationModal
          modalVisible={open}
          navigation={navigation}
          setModalVisible={setOpen}
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
