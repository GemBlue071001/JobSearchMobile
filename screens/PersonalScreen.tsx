import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Linking,
} from "react-native";
import ProfileCard from "../components/ProfileCard"; // Import the ProfileCard component
import FullNameModal from "../components/FullNameModal"; // Import the FullNameModal component
import CVModal from "../components/CVModal";
import CardJobs from "../components/CardJobs";
import Icon from "react-native-vector-icons/MaterialIcons";
import { jobData } from "../mock/JobData";
import AuthModal from "../components/AuthModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GetJobActivity } from "../Services/UserJobPostActivity/GetUserJobPostActivity";
import { fetchCompanies } from "../Services/CompanyService/GetCompanies";
import { GetJobPost } from "../Services/JobsPost/GetJobPosts";
import { GetUserProfile } from "../Services/UserProfileService/UserProfile";
import { MaterialIcons } from "@expo/vector-icons";
import { fetchCVs } from "../Services/CVService/GetCV";
import { DeleteCV } from "../Services/CVService/DeleteCV";
import { queryClient } from "../Services/mainService";
export default function PersonalScreen({ navigation }: any) {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalVisibleCV, setModalVisibleCV] = useState<boolean>(false);
  const [modalVisibleLogin, setModalVisibleLogin] = useState<boolean>(false);

  const [address, setAddress] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState("Applied");
  const [follow, setFollow] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const formatDateTime = (dateString: string | undefined) => {
    if (dateString) {
      const date = new Date(dateString);
      return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // Return a fallback value if dateString is undefined
    return "Invalid date";
  };
  const [UserId, setUserId] = useState<string | null>(null);
  const [Auth, setAuth] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem("userId");
      const Auth = await AsyncStorage.getItem("Auth");
      setAuth(Auth);
      setUserId(id);
    };

    fetchUserId();
  }, []);
  const { data: UserProfile } = useQuery({
    queryKey: ["UserProfile"],
    queryFn: ({ signal }) =>
      GetUserProfile({ id: Number(UserId), signal: signal }),
    staleTime: 10000, // Cache the data for 10 seconds
  });

  const { data } = useQuery({
    queryKey: ["CVs"],
    queryFn: ({ signal }) => fetchCVs({ signal }),
    staleTime: 1000,
  });
  const handlePreview = (url: string) => {
    if (url) {
      Linking.openURL(url).catch((err) => {
        Alert.alert("Error", "Failed to open the file.");
        console.error("Failed to open URL:", err);
      });
    } else {
      Alert.alert("No URL", "This file doesn't have a valid URL.");
    }
  };

  const dataCVS = data?.CVs || [];
  const UserProfileData = UserProfile?.UserProfiles;
  const [fullName, setFullName] = useState<string>(
    UserProfileData
      ? `${UserProfileData.firstName} ${UserProfileData.lastName}`
      : ""
  );
  const renderContent = () => {
    if (selectedTab === "Applied") {
      return (
        <View style={styles.jobdisplay}>
          {JobPostActivitydata?.map((activity) => {
            const PendingJobApplied = JobPostsdata?.find(
              (job) => job.id === activity.jobPostId
            );
            const companys = Companiesdata?.find(
              (item) => item.id === PendingJobApplied?.companyId
            );
            return (
              <TouchableOpacity
                style={styles.jobCard}
                key={activity.id}
                onPress={() =>
                  navigation.navigate("JobDetail", { id: activity?.jobPostId })
                }
              >
                <View style={styles.maincompany}>
                  <View style={styles.maincom1}>
                    <Image
                      source={{
                        uri: companys && companys.imageUrl,
                      }}
                      style={styles.image}
                    />
                    <Text
                      style={styles.text}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {companys?.companyName}
                    </Text>
                  </View>
                  <View style={{ paddingLeft: 20, marginLeft: "auto" }}>
                    {/* Nút follow/unfollow */}
                    <TouchableOpacity onPress={() => setFollow(!follow)}>
                      <Icon
                        name={follow ? "bookmark" : "bookmark-border"}
                        size={30}
                        color="#808080"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.jobTitle}>{activity.jobTitle}</Text>
                <View style={styles.iconRow}>
                  <Icon name="place" size={20} color="#777" />
                  {PendingJobApplied?.jobLocationCities.map(
                    (location, index) => (
                      <Text style={styles.jobDetails} key={index}>
                        {location}
                        {index !==
                        PendingJobApplied?.jobLocationCities.length - 1
                          ? ","
                          : ""}
                      </Text>
                    )
                  )}
                </View>
                <View style={styles.iconRow}>
                  <Icon name="attach-money" size={20} color="#777" />
                  <Text style={styles.jobDetails}>
                    {PendingJobApplied?.salary}
                  </Text>
                </View>
                <View style={styles.iconRow}>
                  <Icon name="access-time" size={20} color="#777" />
                  <Text style={styles.jobDetails}>
                    {formatDateTime(PendingJobApplied?.postingDate)}
                  </Text>
                </View>

                <View style={styles.skillContainer}>
                  {PendingJobApplied?.skillSets.map((skill, index) => (
                    <TouchableOpacity style={styles.skill} key={index}>
                      <Text style={styles.skillText}>{skill}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View
                  style={{
                    marginTop: 10,
                    paddingLeft: 1,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#777", fontSize: 12, lineHeight: 15 }}>
                    Applied on: {formatDateTime(activity.applicationDate)}
                  </Text>

                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "bold",
                      marginHorizontal: 5,
                    }}
                  >
                    •
                  </Text>

                  <Text style={{ color: "#777", fontSize: 12, lineHeight: 15 }}>
                    Status: {activity.status}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      );
    } else if (selectedTab === "Saved") {
      return (
        <View style={styles.jobdisplay}>
          {JobPostsdata?.map((job) => {
            const companys = Companiesdata?.find(
              (item) => item.id === job.companyId
            );
            return (
              <CardJobs
                key={job.id}
                data={job}
                // img={job.companyImage}
                company={companys}
                navigation={navigation}
              />
            );
          })}
        </View>
      );
    }
  };

  const handleAuth = async () => {
    const Auth = await AsyncStorage.getItem("Auth");
    if (!Auth) {
      setModalVisibleLogin(true);
    } else {
      setModalVisibleCV(true);
    }
    // setModalVisibleLogin(true);
  };
  const handleNavigateInfo = () => {
    navigation.navigate("Information");
  };

  const handleNavigateCVProfile = () => {
    navigation.navigate("CVModal");
  };
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

  const { data: JobPostActivity } = useQuery({
    queryKey: ["JobPostActivity"],
    queryFn: ({ signal }) => GetJobActivity({ signal }),
    staleTime: 5000,
  });
  const JobPostsdata = JobPosts?.JobPosts;
  const Companiesdata = Company?.Companies;
  const JobPostActivitydata = JobPostActivity?.UserJobActivitys;
  const { mutate: deleteCV } = useMutation({
    mutationFn: DeleteCV,
    onSuccess: () => {
      // Invalidate and refetch the cache to ensure the UI is updated immediately
      queryClient.invalidateQueries({
        queryKey: ["CVs"],
        refetchType: "active", // Ensure an active refetch
      });
      Alert.alert("CVs Details Deleted Successfully");
      setDeletingId(null);
    },
    onError: () => {
      Alert.alert("Failed to delete the CVs");
      setDeletingId(null);
    },
  });
  const handleDeleteCV = (id: number) => {
    setDeletingId(id);
    deleteCV({ id: id });
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
          {Auth ? (
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
          ) : undefined}
        </View>

        <View style={styles.main2}>
          <Text style={styles.title}>CV/Cover Letter</Text>

          <Text>Would you like you to have a job that suits you</Text>
          {Auth && UserId && (
            <View style={styles.cardProfile}>
              <Text style={styles.titleProfile}>
                {UserProfileData?.firstName} {UserProfileData?.lastName} CV
                Profile
              </Text>
              {/* <Text style={styles.date}>13/10/2024 22:24</Text> */}
              <Text style={styles.subtitle}>Created on our System</Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.buttonProfile}
                  onPress={handleNavigateCVProfile}
                >
                  <Text style={styles.buttonTextProfile}>PREVIEW</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonProfile}
                  onPress={handleNavigateInfo}
                >
                  <Text style={styles.buttonTextProfile}>EDIT</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {Auth &&
            UserId &&
            dataCVS.map((file) => (
              <View style={styles.fileItemContainer}>
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName}>{file.name}</Text>
                  {deletingId === file.id ? (
                    <Text>Please wait a second...</Text>
                  ) : (
                    <TouchableOpacity onPress={() => handleDeleteCV(file.id)}>
                      <MaterialIcons name="delete" size={24} color="red" />
                    </TouchableOpacity>
                  )}
                </View>
                {/* <Text style={styles.fileDetails}>
                    {file.uploadTime} {"\n"}Uploaded from {file.source}
                  </Text> */}

                <TouchableOpacity
                  style={styles.previewButton}
                  onPress={() => handlePreview(file.url)}
                >
                  <Text style={styles.previewButtonText}>PREVIEW</Text>
                </TouchableOpacity>
              </View>
            ))}

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
          {renderContent()}
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
  jobCard: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    padding: 15,
    backgroundColor: "#FFFFFF",
    marginBottom: 20,
    width: 370,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  jobDetails: {
    fontSize: 14,
    color: "#777",
    marginLeft: 5,
  },
  skillContainer: {
    flexDirection: "row",
    marginTop: 10,
    gap: 5,
  },
  skill: {
    backgroundColor: "#EFEFEF",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  skillText: {
    fontSize: 12,
    color: "#333",
  },
  back: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#DDD",
    // alignItems: "center",
  },
  button: {
    borderColor: "#ddd",
    borderWidth: 1,
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: "center",
    textAlign: "center",
  },
  buttonText: {
    fontSize: 15,
    lineHeight: 22.5,
    color: "#333",
    fontWeight: "bold",
  },
  maincompany: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  maincom1: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  image: {
    height: 48,
    width: 48,
    backgroundColor: "white",
  },
  text: {
    fontSize: 16,
    lineHeight: 25,
    marginTop: 5,
    marginBottom: 5,
  },
  cardProfile: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    elevation: 3, // For shadow on Android
    shadowColor: "#000", // For shadow on iOS
    shadowOpacity: 0.2,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 5,
    marginVertical: 10,
    width: "90%",
    alignSelf: "center",
  },
  titleProfile: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#999",
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonProfile: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonTextProfile: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  fileItemContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 16,
    elevation: 3, // Shadow on Android
    shadowColor: "#000", // Shadow on iOS
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    width: "100%",
  },
  fileInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  fileName: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  fileDetails: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  previewButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  previewButtonText: {
    fontSize: 16,
    color: "#555",
  },
});
