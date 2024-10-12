import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import ProfileCard from "../components/ProfileCard"; // Import the ProfileCard component
import FullNameModal from "../components/FullNameModal"; // Import the FullNameModal component
import CVModal from "../components/CVModal";
import CardJobs from "../components/CardJobs";
import { companyData } from "../mock/CompanyData";
import { jobData } from "../mock/JobData";
import AuthModal from "../components/AuthModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PersonalScreen({ navigation }: any) {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalVisibleCV, setModalVisibleCV] = useState<boolean>(false);
  const [modalVisibleLogin, setModalVisibleLogin] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>("Thúc Minh");
  const [address, setAddress] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState("Applied");

  // navigation.navigate('B', { from: 'Account' });
  // const renderContent = () => {
  //   if (selectedTab === "Applied") {
  //     return (
  //       <View style={styles.jobdisplay}>
  //         {jobData.map((job) => {
  //           const companys = companyData.find(
  //             (item) => item.id === job.companyId
  //           );
  //           return (
  //             <CardJobs
  //               key={job.id}
  //               data={job}
  //               img={job.companyImage}
  //               company={companys}
  //               navigation={navigation}
  //             />
  //           );
  //         })}
  //       </View>
  //     );
  //   } else if (selectedTab === "Saved") {
  //     return (
  //       <View style={styles.jobdisplay}>
  //         {jobData.map((job) => {
  //           const companys = companyData.find(
  //             (item) => item.id === job.companyId
  //           );
  //           return (
  //             <CardJobs
  //               key={job.id}
  //               data={job}
  //               img={job.companyImage}
  //               company={companys}
  //               navigation={navigation}
  //             />
  //           );
  //         })}
  //       </View>
  //     );
  //   }
  // };

  const handleAuth = async () => {
    // const Auth = await AsyncStorage.getItem("Auth");
    // if (!Auth) {
    //   setModalVisibleLogin(true);
    // } else {
    //   setModalVisibleCV(true);
    // }
    setModalVisibleLogin(true);

  };
  return (
    <ScrollView>
      <View style={styles.main}>
        <View style={styles.main1}>
          <Text style={styles.title}>About me</Text>
          <Text> My personal details</Text>

          {/* Profile Card */}
          <ProfileCard fullName={fullName} setModalVisible={setModalVisible} />

          {/* Full Name Modal */}
          <FullNameModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            fullName={fullName}
            address={address}
            setAddress={setAddress}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            setFullName={setFullName}
          />
        </View>

        <View style={styles.main2}>
          <Text style={styles.title}>CV/Cover Letter</Text>

          <Text>Would you like you to have a job that suits you</Text>
          <TouchableOpacity
            style={styles.update}
            // onPress={() => setModalVisibleCV(true)}
            // onPress={() => setModalVisibleLogin(true)}
            onPress={handleAuth}
          >
            <Text style={{ fontSize: 20, lineHeight: 30, color: "white" }}>
              UPLOAD/CREATE NEW CV{" "}
            </Text>
          </TouchableOpacity>
          {/* MOdal cv */}
          <CVModal
            modalVisible={modalVisibleCV}
            setModalVisible={setModalVisibleCV}
            navigation={navigation}
          />
          <AuthModal
            visible={modalVisibleLogin}
            onClose={() => setModalVisibleLogin(false)}
          />
        </View>

        <View style={styles.main3}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                selectedTab === "Applied" && styles.activeTab,
              ]}
              onPress={() => setSelectedTab("Applied")}
            >
              <Text
                style={
                  selectedTab === "Applied"
                    ? styles.activeTabText
                    : styles.tabText
                }
              >
                Applied
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedTab === "Saved" && styles.activeTab]}
              onPress={() => setSelectedTab("Saved")}
            >
              <Text
                style={
                  selectedTab === "Saved"
                    ? styles.activeTabText
                    : styles.tabText
                }
              >
                Saved
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
                style={[
                  styles.tab,
                  selectedTab === "opening" && styles.activeTab,
                ]}
                onPress={() => setSelectedTab("opening")}
              >
                <Text
                  style={
                    selectedTab === "opening"
                      ? styles.activeTabText
                      : styles.tabText
                  }
                >
                  Opening
                </Text>
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationText}>
                    {?.jobs?.length || 0}
                  </Text>
                </View>
              </TouchableOpacity> */}
          </View>
          {/* {renderContent()} */}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  main: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 10,
    gap: 20,
  },
  main1: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    elevation: 5,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: "white",
    width: "100%",
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 30,
  },

  main2: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    elevation: 5,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: "white",
    width: "100%",
    gap: 10,
  },

  update: {
    width: "100%",
    paddingVertical: 10,
    backgroundColor: "#FF4500",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    borderRadius: 10,
    color: "white",
  },
  main3: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    elevation: 5,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: "white",
    width: "100%",
    gap: 10,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    // marginBottom: 5,
    // marginTop: 20,
    backgroundColor: "white",
    width: "100%",
  },
  tab: {
    padding: 10,
    borderBottomWidth: 2,
    borderColor: "transparent",
  },
  activeTab: {
    borderColor: "black",
  },
  tabText: {
    fontSize: 16,
    color: "gray",
  },
  activeTabText: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
  },
  card: {
    borderRadius: 8,
    backgroundColor: "white",
    padding: 16,
    paddingHorizontal: 20,
    marginVertical: 8,
    elevation: 2,
    flexDirection: "column",
    gap: 10,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  jobdisplay: {
    flexDirection: "column",
    gap: 5,
    alignItems: "center",
  },
});
