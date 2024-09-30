import {
  Button,
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

//   import EditScreenInfo from "@/components/EditScreenInfo";
//   import { Text, View } from "@/components/Themed";
import CompanyCard from "../components/CompanyCard";
import { companyData } from "../mock/CompanyData";
import { useRef, useState } from "react";
import RNPickerSelect from "react-native-picker-select";
import CardCompany from "../components/CardCompany";
import { Text } from "react-native";

const SkillSet = ["PHP", "Front End", "Java", "End", "Javascript"];
const { width } = Dimensions.get("window");
export default function CompaniesScreen({ navigation }: any) {
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState("");
  const extendedData = [...companyData, ...companyData];
  const flatListRef = useRef<FlatList<Company>>(null);
  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.floor(contentOffsetX / width);

    if (currentIndex >= companyData.length) {
      const scrollToIndex = currentIndex % companyData.length;
      flatListRef.current?.scrollToIndex({
        index: scrollToIndex,
        animated: false,
      });
    }
  };
  const changeMessage = () => {
    setLocation("You pressed the button!");
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        {/* <Text style={styles.title}>Tab Twaso</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <EditScreenInfo path="app/(tabs)/two.tsx" /> */}
        <Text style={styles.title}> Top KeyWord</Text>
        <View style={styles.skillList}>
          {SkillSet.map((tag, index) => (
            <TouchableOpacity key={index} style={styles.button}>
              <Text style={styles.buttonText}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.title1}>Spotlight Seacrh Page</Text>
        <FlatList
          ref={flatListRef}
          data={extendedData}
          style={{ marginTop: 10 }}
          horizontal
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          snapToInterval={width}
          decelerationRate="fast"
          onMomentumScrollEnd={handleScrollEnd}
          pagingEnabled
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
            <Text>{location}</Text>
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
            <Text>{industry}</Text>
            <RNPickerSelect
              onValueChange={(value) => setIndustry(value)}
              items={[
                { label: "Java", value: "Java" },
                { label: "Reactjs ", value: "Reactjs" },
                { label: "React Native", value: "React Native" },
                { label: ".Net", value: ".Net" },
              ]}
              value={industry}
              placeholder={{ label: "Select Industry...", value: null }}
              style={pickerSelectStyles}
            />
          </View>
        </View>

        <View style={styles.companiesisplay}>
          {companyData.map((company) => (
            <CardCompany data={company} navigation={navigation} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingVertical: 30,
    paddingHorizontal: 10,
    backgroundColor:'white'

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
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
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
  container1: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
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
  companiesisplay: {
    flexDirection: "column",
    gap: 5,
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
