import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated, // Import Animated
} from "react-native";
import CardJobs from "../components/CardJobs";
import { jobData } from "../mock/JobData";
import { companyData } from "../mock/CompanyData";
import CardCompany from "../components/CardCompany";
import LocationModal from "../components/LocationModal";

type RootStackParamList = {
  Home: undefined;
  SearchResults: { query: string; location?: string }; // Nhận thêm tham số 'location'
};

type SearchResultsRouteProp = RouteProp<RootStackParamList, "SearchResults">;

export default function SearchResults({ navigation }: any) {
  const [selectedTab, setSelectedTab] = useState("All");
  const route = useRoute<SearchResultsRouteProp>();
  // const { query } = route.params;
  const { query, location } = route.params || { query: "", location: "" }; 

  const jobSlice = jobData.slice(0, 5);

  const [fadeAnim] = useState(new Animated.Value(1)); // Tạo giá trị animated cho opacity

  const handleTabChange = (tab:any) => {
    // Animation fade out trước khi thay đổi tab
    Animated.timing(fadeAnim, {
      toValue: 0, // Làm mờ nội dung hiện tại
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Thay đổi tab sau khi hoàn thành fade out
      setSelectedTab(tab);

      // Animation fade in sau khi đổi tab
      Animated.timing(fadeAnim, {
        toValue: 1, // Hiển thị lại nội dung
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const renderContent = () => {
    if (selectedTab === "All") {
      return (
        <View style={styles.container}>
          <Text style={{ fontSize: 15, lineHeight: 22.5, fontWeight: "bold" }}>
            Jobs
          </Text>
          <Text style={{ fontSize: 15, lineHeight: 22.5 }}>
            Have {jobData.length} jobs
          </Text>
          <View style={styles.jobdisplay}>
            {jobSlice.map((job) => {
              const company = companyData.find(
                (item) => item.id === job.companyId
              );
              return (
                <CardJobs
                  key={job.id}
                  data={job}
                  img={job.companyImage}
                  company={company}
                  navigation={navigation}
                />
              );
            })}
          </View>
          <Text style={{ fontSize: 15, lineHeight: 22.5, fontWeight: "bold" }}>
            Companies
          </Text>
          <Text style={{ fontSize: 15, lineHeight: 22.5 }}>
            Have {companyData.length} companies
          </Text>
          <View style={styles.companiesisplay}>
            {companyData.map((company) => (
              <CardCompany
                key={company.id}
                data={company}
                navigation={navigation}
              />
            ))}
          </View>
        </View>
      );
    } else if (selectedTab === "Jobs") {
      return (
        <View style={styles.container}>
          <Text style={{ fontSize: 15, lineHeight: 22.5, fontWeight: "bold" }}>
            Jobs
          </Text>
          <Text style={{ fontSize: 15, lineHeight: 22.5 }}>
            Have {jobData.length} jobs
          </Text>
          <View style={styles.jobdisplay}>
            {jobSlice.map((job) => {
              const company = companyData.find(
                (item) => item.id === job.companyId
              );
              return (
                <CardJobs
                  key={job.id}
                  data={job}
                  img={job.companyImage}
                  company={company}
                  navigation={navigation}
                />
              );
            })}
          </View>
        </View>
      );
    } else if (selectedTab === "Companies") {
      return (
        <View style={styles.container}>
          <Text style={{ fontSize: 15, lineHeight: 22.5, fontWeight: "bold" }}>
            Companies
          </Text>
          <Text style={{ fontSize: 15, lineHeight: 22.5 }}>
            Have {companyData.length} companies
          </Text>
          <View style={styles.companiesisplay}>
            {companyData.map((company) => (
              <CardCompany
                key={company.id}
                data={company}
                navigation={navigation}
              />
            ))}
          </View>
        </View>
      );
    }
  };

  return (
    <View style={styles.main1}>
      <View style={styles.main}>
        <TouchableOpacity
          style={[styles.all, selectedTab === "All" && styles.activeTab]}
          onPress={() => handleTabChange("All")}
        >
          <Text
            style={{
              fontSize: 15,
              lineHeight: 22.5,
              color: selectedTab === "All" ? "#FF4500" : "#000",
            }}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.all, selectedTab === "Jobs" && styles.activeTab]}
          onPress={() => handleTabChange("Jobs")}
        >
          <Text
            style={{
              fontSize: 15,
              lineHeight: 22.5,
              color: selectedTab === "Jobs" ? "#FF4500" : "#000",
            }}
          >
            Jobs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.all, selectedTab === "Companies" && styles.activeTab]}
          onPress={() => handleTabChange("Companies")}
        >
          <Text
            style={{
              fontSize: 15,
              lineHeight: 22.5,
              color: selectedTab === "Companies" ? "#FF4500" : "#000",
            }}
          >
            Companies
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <Animated.View style={{ opacity: fadeAnim }}>{renderContent()}</Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  main1: {
    flexDirection: "column",
  },
  main: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomColor: "#dedede",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  },
  all: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
  },
  activeTab: {
    borderColor: "#FF4500",
  },
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 20,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  jobdisplay: {
    flexDirection: "column",
    marginBottom: 5, // Updated margin spacing
    alignItems: "center",
  },
  companiesisplay: {
    flexDirection: "column",
    marginBottom: 5, // Updated margin spacing
    alignItems: "center",
  },
});
