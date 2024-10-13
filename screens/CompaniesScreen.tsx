import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { useRef, useState } from "react";
import RNPickerSelect from "react-native-picker-select";
import CardCompany from "../components/CardCompany";
import { useQuery } from "@tanstack/react-query";
import { GetJobPost } from "../Services/JobsPost/GetJobPosts";
import { fetchCompanies } from "../Services/CompanyService/GetCompanies";
import CompanyCard from "../components/CompanyCard";

const SkillSet = ["PHP", "Front End", "Java", "End", "Javascript"];
const { width } = Dimensions.get("window");
interface BusinessStream {
  id: number;
  businessStreamName: string;
  description: string;
}
interface JobType {
  id: number;
  name: string;
  description: string;
}

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
  jobType: JobType; // jobType là đối tượng JobType
  jobLocationCities: string[];
  jobLocationAddressDetail: string[];
  skillSets: string[]; // Array of skill sets, có thể là array rỗng
}
interface Company {
  id: number;
  companyName: string;
  companyDescription: string;
  websiteURL: string;
  establishedYear: number;
  country: string;
  city: string;
  address: string;
  numberOfEmployees: number;
  businessStream: BusinessStream;
  jobPosts: JobPost[];
  imageUrl: string;
}

export default function CompaniesScreen({ navigation }: any) {
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState("");

  const flatListRef = useRef<FlatList<Company>>(null);

  // Handling scroll for infinite loop in FlatList
  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.floor(contentOffsetX / width);
  
    if (Companiesdata && currentIndex >= Companiesdata.length && flatListRef.current) {
      const scrollToIndex = currentIndex % Companiesdata.length;
      flatListRef.current.scrollToIndex({
        index: scrollToIndex,
        animated: false,
      });
    }
  };

  // Fetch JobPosts using React Query
  const {
    data: JobPosts,
    isLoading: isJobLoading,
    isError: isJobError,
  } = useQuery({
    queryKey: ["JobPosts"],
    queryFn: ({ signal }) => GetJobPost({ signal: signal }),
    staleTime: 5000,
  });

  // Fetching Companies using React Query
  const {
    data: Company,
    isLoading: isCompanyLoading,
    isError: isCompanyError,
  } = useQuery({
    queryKey: ["Company"],
    queryFn: ({ signal }) => fetchCompanies({ signal: signal }),
    staleTime: 5000,
  });

  const Companiesdata = Company?.Companies;
  const extendedData = Companiesdata ? [...Companiesdata, ...Companiesdata] : [];

  // Conditional rendering to handle loading and errors
  if (isCompanyLoading || isJobLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (isCompanyError || isJobError) {
    return <Text>Error fetching data</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Top Keywords</Text>
        <View style={styles.skillList}>
          {SkillSet.map((tag, index) => (
            <TouchableOpacity key={index} style={styles.button}>
              <Text style={styles.buttonText}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.title1}>Spotlight Search Page</Text>
        <FlatList
          ref={flatListRef}
          data={extendedData}
          horizontal
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          snapToInterval={width}
          decelerationRate="fast"
          onMomentumScrollEnd={handleScrollEnd}
          pagingEnabled
          initialNumToRender={5}
          windowSize={10}
          renderItem={({ item }) => (
            <View style={{ width }}>
              <CompanyCard data={item} navigation={navigation} />
            </View>
          )}
        />

        <Text style={styles.title1}>Popular Companies</Text>
        <View style={styles.filter}>
          {/* Location Picker */}
          <View style={styles.dropdown}>
            <Text style={styles.label}>Location:</Text>
            <RNPickerSelect
              onValueChange={(value) => setLocation(value)}
              items={[
                { label: "All Locations", value: "all" },
                { label: "Hồ Chí Minh", value: "Hồ Chí Minh" },
                { label: "Hà Nội", value: "Hà Nội" },
                { label: "Đà Nẵng", value: "Đà Nẵng" },
              ]}
              value={location}
              placeholder={{ label: "Select Location...", value: null }}
              style={pickerSelectStyles}
            />
          </View>

          {/* Industry Picker */}
          <View style={styles.dropdown}>
            <Text style={styles.label}>Industry:</Text>
            <RNPickerSelect
              onValueChange={(value) => setIndustry(value)}
              items={[
                { label: "Java", value: "Java" },
                { label: "Reactjs", value: "Reactjs" },
                { label: "React Native", value: "React Native" },
                { label: ".Net", value: ".Net" },
              ]}
              value={industry}
              placeholder={{ label: "Select Industry...", value: null }}
              style={pickerSelectStyles}
            />
          </View>
        </View>

        {/* Displaying companies */}
        <View style={styles.companiesDisplay}>
          {Companiesdata?.map((company) => (
            <CardCompany key={company.id} data={company} navigation={navigation} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 120, // Add some padding for better scrolling
  },
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingVertical: 30,
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
  title: {
    fontSize: 20,
    lineHeight: 30,
    fontWeight: "bold",
  },
  title1: {
    fontSize: 20,
    lineHeight: 30,
    fontWeight: "bold",
    marginTop: 10,
  },
  skillList: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#dedede",
    marginRight: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: "#6c6c6c",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  filter: {
    borderWidth: 1,
    borderBottomColor: "#dedede",
    borderTopColor: "#dedede",
    paddingVertical: 1,
    paddingHorizontal: 2,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginRight: 10,
  },
  companiesDisplay: {
    width:"100%",
    flexDirection: "column",
    marginBottom: 10, // Spacing between company cards
    alignItems: "center",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30,
  },
});
