// import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { jobData } from "../mock/JobData";
import CardJobs from "../components/CardJobs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchCompaniesById } from "../Services/CompanyService/GetCompanyById";
import RenderHTML from "react-native-render-html";
import { fetchCompanies } from "../Services/CompanyService/GetCompanies";
import { GetJobPost } from "../Services/JobsPost/GetJobPosts";
import { GetBusinessStream } from "../Services/BusinessStreamService/GetBusinessStream";
import { PostFollowCompany } from "../Services/FollowCompany/PostFollowCompany";
import { queryClient } from "../Services/mainService";
import { DeleteFollowCompany } from "../Services/FollowCompany/DeleteFollowCompany";
import { GetFollowCompany } from "../Services/FollowCompany/GetFollowCompany";
import AuthModal from "../components/AuthModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { companyData } from "../mock/CompanyData";
type InfoLineProps = {
  icon: string;
  text: string;
};
export default function CompanyDetail({ route, navigation }: any) {
  const { id, companyDetail } = route.params;
  // const parsedId = Array.isArray(id) ? id[0] : id;
  // const parsedCompanyData = Array.isArray(companyDetail)
  //   ? companyDetail[0]
  //   : companyDetail;
  // const company:Company = parsedCompanyData ? JSON.parse(parsedCompanyData) : null;
  const { width } = Dimensions.get("window");
  const { data: CompanyData } = useQuery({
    queryKey: ["Company-details", id],
    queryFn: ({ signal }) => fetchCompaniesById({ id: Number(id), signal }),
    enabled: !!id,
  });

  const companyDataa = CompanyData?.Companies;
  useEffect(() => {
    // Cập nhật options của màn hình và truyền companyData vào header
    navigation.setOptions({
      // header: () => <MainHeader company={companyData} />
    });
  }, [navigation, companyDataa]);
  // const company:Company= JSON.parse(companyDetail);
  const [selectedTab, setSelectedTab] = useState("about");
  const { data: JobPosts } = useQuery({
    queryKey: ["JobPosts"],
    queryFn: ({ signal }) => GetJobPost({ signal }),
    staleTime: 5000,
  });
  const JobPostsdata = JobPosts?.JobPosts;
  const joblistinCompany = JobPostsdata?.filter(
    (item) => item.companyId === companyDataa?.id
  );
  const { data: Company } = useQuery({
    queryKey: ["Companies"],
    queryFn: ({ signal }) => fetchCompanies({ signal }),
    staleTime: 5000,
  });
  const Companiesdata = Company?.Companies;
  const { data: BusinessStream } = useQuery({
    queryKey: ["BusinessStream"],
    queryFn: ({ signal }) => GetBusinessStream({ signal }),
    staleTime: 5000,
  });
  const BusinessStreamData = BusinessStream?.BusinessStreams;
  console.log("busines", BusinessStreamData);

  const detail = Companiesdata?.find((item) => item.id === companyDataa?.id);

  const BusinessStreamDatainCompany = BusinessStreamData?.find(
    (item) => detail?.businessStream?.id === item.id
  );

  const { mutate } = useMutation({
    mutationFn: PostFollowCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["FollowCompany"],
        refetchType: "active",
      });
      Alert.alert(`Follow ${companyDataa?.companyName} Successfully`);
    },
    onError: () => {
      Alert.alert(`Failed to Follow ${companyDataa?.companyName} `);
    },
  });
  const { mutate: Unfollow } = useMutation({
    mutationFn: DeleteFollowCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["FollowCompany"],
        refetchType: "active",
      });
      Alert.alert(`Unfollow ${companyDataa?.companyName} Successfully`);
    },
    // onError: () => {
    //   Alert.alert(`Failed to UnFollow ${companyDataa?.companyName} `);
    // },
  });
  const { data: FollowCompany } = useQuery({
    queryKey: ["FollowCompany"],
    queryFn: ({ signal }) => GetFollowCompany({ signal }),
    staleTime: 5000,
  });
  const FollowCompanydata = FollowCompany?.Companies;
  const [modalVisibleLogin, setModalVisibleLogin] = useState<boolean>(false);
  const haveFollow = FollowCompanydata?.find((item) => item.id === Number(id));
  const handleFollow =async () => {
    const Auth = await AsyncStorage.getItem("Auth");
    if (!Auth) {
      setModalVisibleLogin(true);
    }
    mutate({
      data: {
        companyId: Number(id),
      },
    });
  };

  const handleUnFollow =async () => {
    const Auth = await AsyncStorage.getItem("Auth");
    if (!Auth) {
      setModalVisibleLogin(true);
    }
    Unfollow({ id: Number(haveFollow?.id) });
  };

  const renderContent = () => {
    if (selectedTab === "about") {
      return (
        <View style={styles.card}>
           <AuthModal
            visible={modalVisibleLogin}
            onClose={() => setModalVisibleLogin(false)}
          />
          <Text style={styles.cardTitle}>Introduction</Text>
          <Text style={styles.paragraph}>
            {companyDataa?.companyDescription ? (
              <RenderHTML
                contentWidth={width}
                source={{ html: companyDataa.companyDescription }}
              />
            ) : (
              "Description not available"
            )}
          </Text>
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
    } else if (selectedTab === "opening") {
      return (
        <View style={styles.card}>
          {joblistinCompany?.map((job) => {
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

  const InfoLine = ({ icon, text }: InfoLineProps) => (
    <View style={styles.line}>
      <Icon name={icon} size={30} color="#808080" />
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.main}>
        {companyDataa ? (
          <View>
            <Image
              source={{ uri: companyDataa.imageUrl }}
              style={styles.img}
              resizeMode="cover"
            />
            <View style={styles.main1}>
              <View style={styles.main2}>
                <Image
                  source={{ uri: companyDataa.imageUrl }}
                  style={styles.img1}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.title}>{companyDataa.companyName}</Text>
              <View style={styles.skillList}>
                {companyDataa?.jobPosts.map((job, jobIndex) =>
                  job?.skillSets?.map((tag, tagIndex) => (
                    <TouchableOpacity
                      key={`${jobIndex}-${tagIndex}`}
                      style={styles.button}
                    >
                      <Text style={styles.buttonText}>{tag}</Text>
                    </TouchableOpacity>
                  ))
                )}
              </View>
              <View
                style={{ paddingHorizontal: 15, width: "100%", marginTop: 10 }}
              >
                {haveFollow ? (
                  <TouchableOpacity
                    style={[styles.follow, { backgroundColor: "#FF4500" }]}
                    onPress={handleUnFollow}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                      }}
                    >
                      <Text
                        style={{ color: "white", fontSize: 20, lineHeight: 30 }}
                      >
                        UnFollowed
                      </Text>
                      <Icon
                        name="notifications-none"
                        size={20}
                        style={{ marginTop: 2 }}
                        color="white"
                      />
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.follow}
                    onPress={handleFollow}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                      }}
                    >
                      <Text
                        style={{
                          color: "#FF4500",
                          fontSize: 20,
                          lineHeight: 30,
                        }}
                      >
                        Follow
                      </Text>
                      <Icon
                        name="notifications-none"
                        size={20}
                        style={{ marginTop: 2 }}
                        color="#FF4500"
                      />
                    </View>
                  </TouchableOpacity>
                )}
                {/* <TouchableOpacity style={styles.follow} onPress={handleFollow}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                    }}
                  >
                    <Text
                      style={{ color: "#FF4500", fontSize: 20, lineHeight: 30 }}
                    >
                      Follow
                    </Text>
                    <Icon
                      name="notifications-none"
                      size={20}
                      style={{ marginTop: 2 }}
                      color="#FF4500"
                    />
                  </View>
                </TouchableOpacity> */}
              </View>
            </View>

            <View style={styles.content}>
              <Text style={styles.sectionTitle}>Information</Text>
              <InfoLine icon="language" text={companyDataa.websiteURL} />
              <InfoLine
                icon="location-on"
                text={`${companyDataa.address}, ${companyDataa.city}`}
              />
              <View style={styles.line2}>
                <InfoLine
                  icon="group"
                  text={companyDataa.numberOfEmployees.toString()}
                />
                <InfoLine
                  icon="work"
                  text={`${companyDataa?.jobPosts?.length} jobs`}
                />
              </View>
              <View style={styles.tagList}>
                <Icon name="star" size={30} color="#808080" />
                <View style={styles.tagContainer}>
                  {companyDataa?.jobPosts?.map((item, jobIndex) => (
                    <>
                      {item?.skillSets?.map((tag, tagIndex) => (
                        <Text style={styles.tagText} key={tagIndex}>
                          {tag},
                        </Text>
                      ))}
                    </>
                  ))}
                </View>
              </View>
              <View style={styles.tagList}>
                <Icon name="folder" size={30} color="#808080" />
                <View style={styles.tagContainer}>
                  <Text style={styles.tagText}>
                    {BusinessStreamDatainCompany?.businessStreamName}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tab,
                  selectedTab === "about" && styles.activeTab,
                ]}
                onPress={() => setSelectedTab("about")}
              >
                <Text
                  style={
                    selectedTab === "about"
                      ? styles.activeTabText
                      : styles.tabText
                  }
                >
                  About
                </Text>
              </TouchableOpacity>
              {/* <TouchableOpacity
                style={[styles.tab, selectedTab === "news" && styles.activeTab]}
                onPress={() => setSelectedTab("news")}
              >
                <Text
                  style={
                    selectedTab === "news"
                      ? styles.activeTabText
                      : styles.tabText
                  }
                >
                  News
                </Text>
              </TouchableOpacity> */}
              <TouchableOpacity
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
                    {companyDataa?.jobPosts?.length || 0}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {renderContent()}
          </View>
        ) : (
          <Text>No company data available</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    paddingBottom: 20,
    backgroundColor: "#f0f0f0",
  },
  main: {
    flexDirection: "column",
    width: "100%",
    position: "relative",
    backgroundColor: "white",
  },
  img: {
    width: "100%",
    height: 200,
  },
  main1: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingBottom: 20,
    elevation: 5,
  },
  main2: {
    position: "relative",
    top: -50,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "#dedede",
  },
  img1: {
    height: 150,
    width: 150,
    opacity: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FF4500",
    lineHeight: 30,
    marginBottom: 10,
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
  content: {
    marginTop: 50,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 10,
    paddingHorizontal: 5,
  },
  line: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    marginTop: 20,
    backgroundColor: "white",
    elevation: 5,
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
  card: {
    borderRadius: 8,
    backgroundColor: "white",
    padding: 16,
    marginVertical: 8,
    elevation: 2,
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
  line2: {
    flexDirection: "row",
    alignItems: "center",
    gap: 50,
  },
  infoText: {
    fontSize: 15,
    lineHeight: 20,
  },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 20,
    lineHeight: 30,
  },
  tagList: {
    flexDirection: "row",
    alignItems: "center",
  },
  tagContainer: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 5,
    flexShrink: 1,
  },
  tagText: {
    flexDirection: "row",
    fontSize: 15,
    lineHeight: 20,
  },
  follow: {
    borderWidth: 1,
    borderColor: "#FF4500",
    paddingVertical: 10,
    textAlign: "center",
    alignItems: "center",
    color: "#FF4500",
    width: "100%",
  },
});
