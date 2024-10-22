import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import LocationModal from "../LocationModal";
import { StackNavigationProp } from "@react-navigation/stack";
import { useMutation } from "@tanstack/react-query";
import { GetJobSearch } from "../../Services/JobSearchService/JobSearchService";
import { queryClient } from "../../Services/mainService";

type RootStackParamList = {
  Home: undefined;
  SearchResults: { query: string; location?: string ,jobSearch:JobPost[]}; 
};
interface JobPost {
  id: number;
  jobTitle: string;
  jobDescription: string;
  salary: number;
  postingDate: string;
  expiryDate: string;
  experienceRequired: number;
  qualificationRequired: string;
  benefits: string;
  imageURL: string;
  isActive: boolean;
  companyId: number;
  companyName: string;
  websiteCompanyURL: string;
  jobType: JobType;
  jobLocationCities: string[];
  jobLocationAddressDetail: string[];
  skillSets: string[];
}

interface JobType {
  id: number;
  name: string;
  description: string;
}


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
 
  const query = route.params?.query || ""; 
  const filterLocation=route.params?.location || ""
  const [jobSearch, setJobSearch] = useState<JobPost[]>();
  const { mutateAsync } = useMutation({
    mutationFn: GetJobSearch,
    onSuccess: (data) => {
      console.log("Search result:", data);

      if (data && data.result && data.result.items.length > 0) {
        setJobSearch(data.result.items);
        const jobSearchResults = data.result.items;
        navigation.navigate("SearchResults", { query: searchQuery ,location:location ,jobSearch: jobSearchResults});
      }

      queryClient.invalidateQueries({
        queryKey: ["JobSearch"],
        refetchType: "active",
      });

      // navigate("/it-jobs");
      // navigation.navigate("SearchResults", { query: searchQuery ,location:location });
    },
    onError: () => {
      Alert.alert("Failed to Search");
    },
  });
  const handleNavigate = async () => {
    // Define the shape of job data returned by the mutation
    interface JobSearchResponse {
      result: {
        items: JobPost[];
      };
    }

    const searchDataArray = [
      { companyName: searchQuery ,pasize:9},
      { skillSet: searchQuery,pageSize: 9 },
      { location: searchQuery ,pageSize: 9 },
      { experience: searchQuery ,pageSize: 9},
      { jobType: searchQuery ,pageSize: 9},
    ];

    for (let i = 0; i < searchDataArray.length; i++) {
      try {
        console.log("Searching with:", searchDataArray[i]);

        const result: JobSearchResponse = await mutateAsync({
          data: searchDataArray[i],
        });
        console.log("chan", result.result.items);

        if (result && result.result && result.result.items.length > 0) {
          setJobSearch(result.result.items);
          break;
        }
      } catch (error) {
        console.error("Error during job search:", error);
      }
    }
  };



  
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
            onSubmitEditing={handleNavigate}
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
