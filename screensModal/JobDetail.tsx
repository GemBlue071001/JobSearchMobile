// import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { jobData } from "../mock/JobData";
import { Image } from "react-native";

// import { companyData } from "../mock/CompanyData";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthModal from "../components/AuthModal";
import { useQuery } from "@tanstack/react-query";
import { GetJobPostById } from "../Services/JobsPost/GetJobPostById";
import { fetchCompanies } from "../Services/CompanyService/GetCompanies";
import { GetJobPost } from "../Services/JobsPost/GetJobPosts";
import { GetJobActivity } from "../Services/UserJobPostActivity/GetUserJobPostActivity";
import RenderHTML from "react-native-render-html";
import { GetBusinessStream } from "../Services/BusinessStreamService/GetBusinessStream";
// import { Item } from "react-native-paper/lib/typescript/components/Drawer/Drawer";
// import { Link } from "expo-router";
type InfoLineProps = {
  icon: string;
  text: string | undefined;
};

const InfoLine = ({ icon, text }: InfoLineProps) => (
  <View style={styles.line}>
    <Icon name={icon} size={30} color="#808080" />
    <Text style={styles.infoText}>{text}</Text>
  </View>
);

export default function JobDetail({ route, navigation }: any) {
  const { id } = route.params;
  const [follow, setFollow] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState("Job Details");
  const [modalVisibleLogin, setModalVisibleLogin] = useState<boolean>(false);
  const { width } = Dimensions.get("window");
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toISOString().split("T")[0]; // Chỉ lấy phần ngày (YYYY-MM-DD)
  };
  // Parse the id as a number for comparison with numeric job ids
  const { data: jobData } = useQuery({
    queryKey: ["Job-details", id],
    queryFn: ({ signal }) => GetJobPostById({ id: Number(id), signal }), // Convert JobId to number
    enabled: !!id, // Chỉ chạy query khi JobId có giá trị
  });

  const {
    data: Company,
    // isLoading: isCompanyLoading,
    // isError: isCompanyError,
  } = useQuery({
    queryKey: ["Company"],
    queryFn: ({ signal }) => fetchCompanies({ signal: signal }),
    staleTime: 5000,
  });
  const {
    data: JobPosts,
    // isLoading: isJobLoading,
    // isError: isJobError,
  } = useQuery({
    queryKey: ["JobPosts"],
    queryFn: ({ signal }) => GetJobPost({ signal: signal }),
    staleTime: 5000,
  });
  const {
    data: JobPostActivity,
    // isLoading: isJobLoading,
    // isError: isJobError,
  } = useQuery({
    queryKey: ["JobPostActivity"],
    queryFn: ({ signal }) => GetJobActivity({ signal: signal }),
    staleTime: 5000,
  });

  const { data: BusinessStream } = useQuery({
    queryKey: ["BusinessStream"],
    queryFn: ({ signal }) => GetBusinessStream({ signal }),
    staleTime: 5000,
  });
  const BusinessStreamData = BusinessStream?.BusinessStreams;

  const JobPostActivitydata = JobPostActivity?.UserJobActivitys;
  const Companiesdata = Company?.Companies;

  const job = jobData?.JobPosts;
  const JobPostsdata = JobPosts?.JobPosts;
  const detailsCompany = Companiesdata?.find(
    (item) => item.id === job?.companyId
  );
  const hasAppliedJobActivity = JobPostActivitydata?.find(
    (activity) => activity.jobPostId === job?.id
  );

  const BusinessStreamDatainCompany = BusinessStreamData?.find(
    (item) => detailsCompany?.businessStream?.id === item.id
  );
  const renderContent = () => {
    if (selectedTab === "Job Details") {
      return (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Infomation</Text>
          <View style={{ marginBottom: 10 }}>
            {job?.jobLocationAddressDetail.length &&
            job.jobLocationAddressDetail.length > 0 ? (
              job.jobLocationAddressDetail.map((item, index) => (
                <View style={styles.location} key={index}>
                  <Icon name="location-on" size={20} color="#808080" />
                  <Text style={styles.locationtext}>{item}</Text>
                </View>
              ))
            ) : (
              <View style={styles.location}>
                <Icon name="location-on" size={20} color="#808080" />
                <Text style={styles.locationtext}>no Location Yet</Text>
              </View>
            )}

            <View style={styles.tax}>
              <Icon name="attach-money" size={20} color="#808080" />
              <Text style={styles.taxtext}>{job?.salary}</Text>
            </View>

            <View style={styles.tax}>
              <Icon name="work" size={20} color="#808080" />
              <Text style={styles.locationtext}>
                {job?.experienceRequired} Years
              </Text>
            </View>
            <View style={styles.location}>
              <Icon name="insert-drive-file" size={20} color="#808080" />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: 5,
                }}
              >
                {job?.skillSets.map((item) => (
                  <Text> {item}</Text>
                ))}
              </View>
            </View>
          </View>

          <Text style={styles.cardTitle}>Job Description</Text>
          <View>
            {job?.jobDescription ? (
              <RenderHTML
                contentWidth={width}
                source={{ html: job.jobDescription }}
              />
            ) : (
              "Description not available"
            )}
          </View>
          <Text style={styles.cardTitle}>Job Benefit</Text>
          <View>
            {job?.benefits ? (
              <RenderHTML
                contentWidth={width}
                source={{ html: job.benefits }}
              />
            ) : (
              "Description not available"
            )}
          </View>
          <Text style={styles.cardTitle}>Job Required</Text>
          <View>
            {job?.qualificationRequired ? (
              <RenderHTML
                contentWidth={width}
                source={{ html: job.qualificationRequired }}
              />
            ) : (
              "Description not available"
            )}
          </View>
        </View>
      );
      // } else if (selectedTab === "news") {
      //   return (
      //     <View style={styles.card}>
      //       <Text style={styles.cardTitle}>News</Text>
      //       <Text style={styles.paragraph}>
      //         Latest news and updates related to the company will appear here.
      //       </Text>
      //     </View>
      //   );
    } else if (selectedTab === "Company") {
      return (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Infomation</Text>
          <View style={styles.company}>
            <Image
              source={{ uri: detailsCompany?.imageUrl }}
              style={{ width: 40, height: 40 }}
              resizeMode="cover"
            />
            <View
              style={{
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <Text style={styles.companyTitle}>
                {detailsCompany?.companyName}
              </Text>
              <Text style={styles.locationtext}>
                {detailsCompany?.establishedYear}
              </Text>
            </View>
          </View>
          <View style={styles.location}>
            <Icon name="location-on" size={20} color="#808080" />
            <Text style={styles.locationtext}>
              {detailsCompany?.address} {detailsCompany?.city}
            </Text>
          </View>
          <View style={styles.line2}>
            <InfoLine
              icon="group"
              text={
                detailsCompany && detailsCompany?.numberOfEmployees?.toString()
              }
            />
            <InfoLine
              icon="work"
              text={`${detailsCompany?.jobPosts?.length} jobs`}
            />
          </View>

          <View style={styles.location}>
            <Icon name="insert-drive-file" size={20} color="#808080" />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 5,
              }}
            >
              {job?.skillSets.map((item) => (
                <Text> {item}</Text>
              ))}
            </View>
          </View>
          <View style={styles.location}>
            <Icon name="folder" size={20} color="#808080" />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 5,
              }}
            >
              <Text> {BusinessStreamDatainCompany?.businessStreamName}</Text>
            </View>
          </View>

          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              borderColor: "#FF4500",
              borderWidth: 1,
              backgroundColor: "white",
              paddingVertical: 10,
              width: "100%",
              borderRadius: 10,
            }}
          >
            <Text style={{ fontSize: 20, lineHeight: 30, color: "#FF4500" }}>
              Follow
            </Text>
          </View>
          <View
            style={{
              alignItems: "center",
              borderColor: "#808080",
              justifyContent: "center",
              borderWidth: 1,
              backgroundColor: "white",
              paddingVertical: 10,
              width: "100%",
              borderRadius: 10,
            }}
          >
            {/* <Link
              href={{
                pathname: "/CompanyDetail",
                params: {
                  id: companyDetail?.id,
                  companyDetail: JSON.stringify(companyDetail),
                },
              }}
              asChild
            > */}
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("CompanyDetail", {
                  id: detailsCompany?.id,
                  companyDetail: JSON.stringify(detailsCompany),
                })
              }
            >
              <Text style={{ fontSize: 20, lineHeight: 30, color: "#808080" }}>
                View Details
              </Text>
            </TouchableOpacity>
            {/* </Link> */}
          </View>
          <Text style={styles.cardTitle}>Introduce</Text>
          <View>
            {detailsCompany?.companyDescription ? (
              <RenderHTML
                contentWidth={width}
                source={{ html: detailsCompany.companyDescription }}
              />
            ) : (
              "Description not available"
            )}
          </View>
        </View>
      );
    }
  };
  // Handle the case where jobDetail is not found
  if (!job) {
    return (
      <View>
        <Text>Job not found</Text>
      </View>
    );
  }

  const handleApply = async () => {
    const Auth = await AsyncStorage.getItem("Auth");
    if (!Auth) {
      setModalVisibleLogin(true);
      return;
    }
    navigation.navigate("Apply", { job: job, id: job.id });
  };

  return (
    <View>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.main}>
          <View style={styles.main1}>
            <Image
              source={{ uri: job.imageURL }}
              resizeMode="cover"
              style={styles.main3}
            />
            <View style={styles.main4}>
              <Image
                source={{ uri: job.imageURL }}
                resizeMode="cover"
                style={styles.img1}
              />
            </View>
          </View>
          <View style={styles.main5}>
            <View style={styles.main6}>
              <Text style={styles.title}>{job.jobTitle}</Text>
              <Text style={styles.text}>{detailsCompany?.companyName}</Text>
              <View style={styles.skillList}>
                {job?.skillSets?.map((job, jobIndex) => (
                  <TouchableOpacity key={`${jobIndex}`} style={styles.button}>
                    <Text style={styles.buttonText}>{job}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.post}>
                <Icon name="access-time" size={15} color="#808080" />
                <Text style={styles.posttext}>
                  {" "}
                  {job?.postingDate
                    ? formatDate(job.postingDate)
                    : "No Date Available"}
                </Text>
              </View>
            </View>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tab,
                  selectedTab === "Job Details" && styles.activeTab,
                ]}
                onPress={() => setSelectedTab("Job Details")}
              >
                <Text
                  style={
                    selectedTab === "Job Details"
                      ? styles.activeTabText
                      : styles.tabText
                  }
                >
                  Jobs Details
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tab,
                  selectedTab === "Company" && styles.activeTab,
                ]}
                onPress={() => setSelectedTab("Company")}
              >
                <Text
                  style={
                    selectedTab === "Company"
                      ? styles.activeTabText
                      : styles.tabText
                  }
                >
                  Company
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
          </View>
          {renderContent()}
        </View>
      </ScrollView>
      <View style={styles.like}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => setFollow(!follow)}
          >
            <Text style={styles.saveButtonText}>SAVE</Text>
            <View style={{ marginLeft: 10 }}>
              {/* Nút follow/unfollow */}
              <TouchableOpacity>
                <Icon
                  name={follow ? "bookmark" : "bookmark-border"}
                  size={30}
                  color="#FF5A5F"
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          {hasAppliedJobActivity ? (
            <TouchableOpacity
              style={styles.applyButtonApplied}
              onPress={handleApply}
            >
              <Text style={styles.applyButtonText}>
                {hasAppliedJobActivity.status}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>EASY APPLY</Text>
            </TouchableOpacity>
          )}
        </View>
        <AuthModal
          visible={modalVisibleLogin}
          onClose={() => setModalVisibleLogin(false)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flexDirection: "column",
    width: "100%",
    position: "relative",
  },
  main1: {
    position: "relative",
    flexDirection: "column",
  },
  main2: {
    position: "absolute",
  },
  main3: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    height: 200,
  },
  main4: {
    position: "absolute",
    // top: -50,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "#dedede",
    top: "25%",
    left: "38%",
  },
  img1: {
    height: 100,
    width: 100,
    opacity: 1,
  },

  main5: {
    flexDirection: "column",
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 20,
  },
  main6: {
    flexDirection: "column",
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: -30,
    backgroundColor: "white",
    elevation: 10,
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FF4500",
    lineHeight: 30,
    // marginBottom: 10,
  },
  text: {
    fontSize: 15,
    fontWeight: "500",

    lineHeight: 22.5,
    // marginBottom: 10,
  },
  skillList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 5,
    paddingHorizontal: 10,
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
  post: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  posttext: {
    // color: "#0AB305",
    fontSize: 12,
    lineHeight: 18,
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
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    // marginBottom: 5,
    marginTop: 20,
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
  notificationBadge: {
    backgroundColor: "red",
    borderRadius: 10,
    position: "absolute",
    right: -10,
    top: -5,
    paddingHorizontal: 6,
  },
  notificationText: {
    color: "white",
    fontSize: 12,
  },
  scrollViewContainer: {
    paddingBottom: 20,
    height: "auto",
  },
  location: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  locationtext: {
    fontSize: 15,
    lineHeight: 22.5,
  },
  tax: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  taxtext: {
    color: "#0AB305",
    fontSize: 15,
    lineHeight: 22.5,
  },
  company: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 20,
  },
  companyTitle: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 30,
  },
  line: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  line2: {
    flexDirection: "row",
    alignItems: "center",
    gap: 50,
  },
  infoText: {
    fontSize: 15,
    lineHeight: 20,
  },
  like: {
    position: "absolute",

    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 30,
    backgroundColor: "white",
    bottom: 0,
    left: 0,
    right: 0,
  },
  saveButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "white",
    borderColor: "#FF5A5F",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  saveButtonText: {
    color: "#FF5A5F",
    fontWeight: "bold",
  },
  applyButton: {
    flex: 1,
    backgroundColor: "#FF5A5F",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    marginLeft: 8,
  },
  applyButtonApplied: {
    flex: 1,
    backgroundColor: "#DEDEDE",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    marginLeft: 8,
  },
  applyButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
