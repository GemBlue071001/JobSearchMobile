import React, { useCallback, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import RenderHtml from "react-native-render-html";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PostFollowCompany } from "../Services/FollowCompany/PostFollowCompany";
import { queryClient } from "../Services/mainService";
import { DeleteFollowCompany } from "../Services/FollowCompany/DeleteFollowCompany";
import { GetFollowCompany } from "../Services/FollowCompany/GetFollowCompany";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthModal from "./AuthModal";
import { useFocusEffect } from "@react-navigation/native";
import { GetJobPost } from "../Services/JobsPost/GetJobPosts";

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
  jobType: JobType;
  jobLocationCities: string[];
  jobLocationAddressDetail: string[];
  skillSets: string[];
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

interface CardEmployerProps {
  data: Company;
  navigation: any;
}

export default function CompanyCard({ data, navigation }: CardEmployerProps) {
  const [modalVisibleLogin, setModalVisibleLogin] = useState<boolean>(false);
  const [showMore, setShowMore] = useState<boolean>(false); // State to handle show more/less
  const [token, setToken] = useState<string | null>("");
  const fetchUserData = async () => {
    const id = await AsyncStorage.getItem("userId");
    const auth = await AsyncStorage.getItem("Auth");
    const token = await AsyncStorage.getItem("token");
    setToken(token);
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData(); // Fetch Auth and UserId on focus
    }, [])
  );
  const toggleShowMore = () => {
    setShowMore(!showMore);
    navigation.navigate("CompanyDetail", {
      id: data?.id,
      companyDetail: JSON.stringify(data),
    });
  };
  const { mutate: followCompany } = useMutation({
    mutationFn: PostFollowCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["FollowCompany"],
        refetchType: "active",
      });
      Alert.alert(`Followed ${data?.companyName} successfully`);
    },
    onError: () => {
      Alert.alert(`Failed to follow ${data?.companyName}`);
    },
  });

  const { mutate: unfollowCompany } = useMutation({
    mutationFn: DeleteFollowCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["FollowCompany"],
        refetchType: "active",
      });
      Alert.alert(`Unfollowed ${data?.companyName} successfully`);
    },
    onError: () => {
      Alert.alert(`Failed to unfollow ${data?.companyName}`);
    },
  });

  const { data: FollowCompany } = useQuery({
    queryKey: ["FollowCompany"],
    queryFn: GetFollowCompany,
    staleTime: 5000,
    enabled: !!token,
  });

  const haveFollow = FollowCompany?.Companies?.find(
    (item) => item.id === Number(data.id)
  );

  const handleFollow = async () => {
    const Auth = await AsyncStorage.getItem("Auth");
    if (!Auth) {
      setModalVisibleLogin(true);
      return;
    }
    followCompany({ data: { companyId: Number(data.id) } });
  };

  const handleUnFollow = async () => {
    const Auth = await AsyncStorage.getItem("Auth");
    if (!Auth) {
      setModalVisibleLogin(true);
      return; // Prevent unfollowing if not authenticated
    }
    unfollowCompany({ id: Number(haveFollow?.id) });
  };

  const { width } = Dimensions.get("window");

  const { data: JobPosts } = useQuery({
    queryKey: ["JobPosts"],
    queryFn: ({ signal }) => GetJobPost({ signal: signal }),
    staleTime: 5000,
  });
  const JobPostsdata = JobPosts?.JobPosts;

  const jobsInCompany = JobPostsdata?.filter(
    (item) => item.companyId === data.id
  );

  const skills = jobsInCompany?.map((skill) => skill.skillSets);
  const flattenedArray = skills?.flat();
  const uniqueArray = [...new Set(flattenedArray)];
console.log('realy',uniqueArray)
  return (
    <View style={styles.main}>
      <Image source={{ uri: data.imageUrl }} style={styles.logo} />

      <View style={styles.main2}>
        <View style={styles.header}>
          <View style={styles.img}>
            <Image
              source={{ uri: data.imageUrl }}
              style={styles.logo1}
              resizeMode="contain"
            />
          </View>
          <View style={styles.main3}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("CompanyDetail", {
                  id: data?.id,
                  companyDetail: JSON.stringify(data),
                })
              }
            >
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={styles.textStyle}
              >
                {data.companyName}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* <View style={styles.text} numberOfLines={2} ellipsizeMode="tail">
          <RenderHtml contentWidth={width} source={{ html: data.companyDescription }} />
        </View> */}
        <View>
          <View
            style={{
              maxHeight: showMore ? undefined : 100,
              overflow: "hidden",
            }}
          >
            <RenderHtml
              contentWidth={width}
              source={{ html: data.companyDescription }}
            />
          </View>

          <TouchableOpacity onPress={toggleShowMore}>
            <Text style={styles.readMoreText}>
              {showMore ? "Show less" : "Read more"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.job}>
          <Icon name="work" size={30} color="#808080" />
          <Text style={styles.text}>{data.jobPosts.length} Jobs</Text>
        </View>

        <View style={styles.skill}>
          <View style={styles.skillList}>
            {/* {data.jobPosts.map((job) =>
              job.skillSets.map((tag, index) => (
                <TouchableOpacity key={index} style={styles.button}>
                  <Text style={styles.buttonText}>{tag}</Text>
                </TouchableOpacity>
              ))
            )} */}
            {uniqueArray.map((tag, index) => (
              <TouchableOpacity key={index} style={styles.button}>
                <Text style={styles.buttonText}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View>
            {haveFollow && token ? (
              <TouchableOpacity onPress={handleUnFollow}>
                <Icon name="bookmark" size={30} color="#808080" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleFollow}>
                <Icon name="bookmark-border" size={30} color="#808080" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <AuthModal
          visible={modalVisibleLogin}
          onClose={() => setModalVisibleLogin(false)}
          navigation={navigation}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    display: "flex",
    flexDirection: "column",
    borderWidth: 1,
    borderColor: "#dedede",
    borderRadius: 10,
    marginBottom: 15,
    width: "100%",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  logo: {
    height: 200,
    width: "100%",
    resizeMode: "cover",
  },
  main2: {
    paddingRight: 20,
    paddingLeft: 15,
    backgroundColor: "#fff",
    paddingVertical: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    marginBottom: 10,
  },
  img: {
    padding: 12,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#dedede",
    backgroundColor: "white",
  },
  logo1: {
    height: 60,
    width: 60,
    borderRadius: 30,
  },
  main3: {
    marginLeft: 10,
    flexShrink: 1,
  },
  textStyle: {
    color: "#FF4500",
    lineHeight: 24,
    fontSize: 16,
    fontWeight: "600",
    flexShrink: 1,
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
    color: "#333",
    marginTop: 5,
    marginBottom: 10,
  },
  job: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  skill: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skillList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  button: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginRight: 8,
    marginBottom: 8,
  },
  buttonText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  readMoreText: {
    color: "#FF4500",
    marginTop: 5,
    fontWeight: "bold",
    textAlign: "right",
  },
});
