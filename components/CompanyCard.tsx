import React, { useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import RenderHtml from "react-native-render-html";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GetJobPost } from "../Services/JobsPost/GetJobPosts";
import { PostFollowCompany } from "../Services/FollowCompany/PostFollowCompany";
import { queryClient } from "../Services/mainService";
import { Alert } from "react-native";
import { DeleteFollowCompany } from "../Services/FollowCompany/DeleteFollowCompany";
import { GetFollowCompany } from "../Services/FollowCompany/GetFollowCompany";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthModal from "./AuthModal";

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
  const [follow, setFollow] = useState<boolean>(false);
  const { width } = Dimensions.get("window");

  const { data: JobPosts } = useQuery({
    queryKey: ["JobPosts"],
    queryFn: ({ signal }) => GetJobPost({ signal: signal }),
    staleTime: 5000,
  });
  const JobPostsdata = JobPosts?.JobPosts;
  const { mutate } = useMutation({
    mutationFn: PostFollowCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["FollowCompany"],
        refetchType: "active",
      });
      Alert.alert(`Follow ${data?.companyName} Successfully`);
    },
    // onError: () => {
    //   Alert.alert(`Failed to Follow ${data?.companyName} `);
    // },
  });
  const { mutate: Unfollow } = useMutation({
    mutationFn: DeleteFollowCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["FollowCompany"],
        refetchType: "active",
      });
      Alert.alert(`Unfollow ${data?.companyName} Successfully`);
    },
    onError: () => {
      Alert.alert(`Failed to UnFollow ${data?.companyName} `);
    },
  });
  const { data: FollowCompany } = useQuery({
    queryKey: ["FollowCompany"],
    queryFn: ({ signal }) => GetFollowCompany({ signal }),
    staleTime: 5000,
  });
  const FollowCompanydata = FollowCompany?.Companies;
  const [modalVisibleLogin, setModalVisibleLogin] = useState<boolean>(false);
  const haveFollow = FollowCompanydata?.find(
    (item) => item.id === Number(data.id)
  );
  const handleFollow =async() => {
    const Auth = await AsyncStorage.getItem("Auth");
    if (!Auth) {
      setModalVisibleLogin(true);
    }
    mutate({
      data: {
        companyId: Number(data.id),
      },
    });
  };

  const handleUnFollow =async() => {
    const Auth = await AsyncStorage.getItem("Auth");
    if (!Auth) {
      setModalVisibleLogin(true);
    }
    Unfollow({ id: Number(haveFollow?.id) });
  };

  return (
    <View style={styles.main}>
      <View>
        <Image
          source={{
            uri: data.imageUrl,
          }}
          style={styles.logo}
        />
      </View>

      <View style={styles.main2}>
        <View style={styles.header}>
          <View style={styles.img}>
            <Image
              source={{
                uri: data.imageUrl,
              }}
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

        <Text style={styles.text} numberOfLines={2} ellipsizeMode="tail">
          <RenderHtml
            contentWidth={width}
            source={{ html: data.companyDescription }}
          />
        </Text>

        <View style={styles.job}>
          <Icon
            name="work"
            size={30}
            color="#808080"
            style={{ marginTop: 5 }}
          />
          <Text style={styles.text} numberOfLines={2} ellipsizeMode="tail">
            {data.jobPosts.length} Jobs
          </Text>
        </View>

        <View style={styles.skill}>
          <View style={styles.skillList}>
            {data.jobPosts.map((job, jobIndex) => {
              const jobSkill = JobPostsdata?.find((item) => item.id === job.id);
              return jobSkill?.skillSets?.map((tag, tagIndex) => (
                <TouchableOpacity
                  key={`${jobIndex}-${tagIndex}`}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>{tag}</Text>
                </TouchableOpacity>
              ));
            })}
          </View>
          <View>
            {haveFollow?.id === data.id ? (
              <TouchableOpacity onPress={handleUnFollow}>
                <Icon
                  name={"bookmark" }
                  size={30}
                  color="#808080"
                /> 
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleFollow}>
                <Icon
                  name={"bookmark-border"}
                  size={30}
                  color="#808080"
                />
              </TouchableOpacity>
            )}
          </View>
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
    display: "flex",
    flexDirection: "column",
    borderWidth: 1,
    borderColor: "#dedede",
    borderRadius: 10, // Rounded card edges
    overflow: "hidden", // Prevent content overflow
    marginBottom: 15, // Space between cards
    width: "100%", // Full width of the container
    backgroundColor: "white",
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2, // Shadow for Android
  },
  logo: {
    height: 200,
    width: "100%", // Ensures image fills the width
    resizeMode: "cover", // Keeps image aspect ratio
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
    flexShrink: 1, // Ensure content fits within the container
    marginBottom: 10, // Spacing between header and description
  },
  img: {
    padding: 12,
    borderRadius: 50, // Rounded logo container
    borderWidth: 1,
    borderColor: "#dedede",
    backgroundColor: "white",
  },
  logo1: {
    height: 60, // Adjusted size for company logo
    width: 60,
    borderRadius: 30, // Rounded company logo
  },
  main3: {
    marginLeft: 10, // Adjusted margin for spacing
    flexShrink: 1, // Ensure text content does not overflow the container
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
    textAlign: "center",
  },
});
