import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  InteractionManager,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import TextInputComponent from "../components/TextInputComponent";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import RNPickerSelect from "react-native-picker-select";

import Icon from "react-native-vector-icons/MaterialIcons";
import { fetchEducationDetails } from "../Services/EducationDetails/GetEducationDetails";
import { useMutation, useQuery } from "@tanstack/react-query";
import EducationCard from "../components/EducationCard";
import { DeleteEducationDetails } from "../Services/EducationDetails/DeleteEducationDetails";
import { queryClient } from "../Services/mainService";
import { fetchExperienceDetails } from "../Services/ExperienceDetailService/GetExperienceDetail";
import ExperienceCard from "../components/ExperienceCard";
import { DeleteExperienceDetail } from "../Services/ExperienceDetailService/DeleteExperienceDetail";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetUserProfile } from "../Services/UserProfileService/UserProfile";
import SkillCard from "../components/SkillCard";
import { DeleteUserProfileCV } from "../Services/UserProfileService/DeleteUserProfileCV";

interface EducationDetail {
  id: number;
  name: string;
  institutionName: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  gpa: number;
}
interface ExperienceDetail {
  id: number;
  companyName: string;
  position: string;
  startDate: string;
  endDate: string;
  responsibilities: string;
  achievements: string;
}
export default function GerneralInfo({ navigation, route }: any) {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [Linkedln, setLinkedln] = useState<string>("");
  const [github, setGithub] = useState<string>("");
  const [date, setDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState("Date of Birth");
  const scrollViewRef = useRef<ScrollView>(null);
  const workingExperienceRef = useRef<View>(null);
  const SkillsRef = useRef<View>(null);
  const EducationRef = useRef<View>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deletingIdExp, setDeletingIdExp] = useState<number | null>(null);
  const [deletingIdSkill, setDeletingIdSkill] = useState<number | null>(null);
  const [UserId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem("userId");
      setUserId(id);
    };

    fetchUserId();
  }, []);

  const { data: UserProfile } = useQuery({
    queryKey: ["UserProfile"],
    queryFn: ({ signal }) =>
      GetUserProfile({ id: Number(UserId), signal: signal }),
    staleTime: 1000,
  });

  const UserProfileData = UserProfile?.UserProfiles;
  const { mutate } = useMutation({
    mutationFn: DeleteEducationDetails,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["EducationDetails"],
        refetchType: "active",
      });
      Alert.alert("Education Details Deleted Successfully");
      setDeletingId(null);
    },
    onError: () => {
      Alert.alert("Failed to delete the skill set");
      setDeletingId(null);
    },
  });

  const { mutate: DeleteExpDetails } = useMutation({
    mutationFn: DeleteExperienceDetail,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ExperienceDetails"],
        refetchType: "active",
      });
      Alert.alert("Experience Details Deleted Successfully");
      setDeletingId(null);
    },
    onError: () => {
      Alert.alert("Failed to delete the Experience");
      setDeletingId(null);
    },
  });
  const { mutate: DeleteSkill } = useMutation({
    mutationFn: DeleteUserProfileCV,
    onSuccess: () => {
      // Invalidate and refetch the cache to ensure the UI is updated immediately
      queryClient.invalidateQueries({
        queryKey: ["UserProfile"],
        refetchType: "active", 
      });
      Alert.alert("SkillSet Details Deleted Successfully");
      setDeletingId(null);
    },
    onError: () => {
      Alert.alert("Failed to delete the skill set");
      setDeletingId(null);
    },
  });

  const onDeleteExp = (id: number) => {
    setDeletingIdExp(id);
    DeleteExpDetails({ id: id });
  };
  const onDeleteSkill = (id: number) => {
    setDeletingIdSkill(id);
    DeleteSkill({
      data: {
        userId: Number(UserId),
        skillSetId: id,
        proficiencyLevel: "",
      },
    });
  };
  const onDelete = (id: number) => {
    setDeletingId(id);
    mutate({ id: id });
  };

  const { data: Education } = useQuery({
    queryKey: ["EducationDetails"],
    queryFn: ({ signal }) => fetchEducationDetails({ signal: signal }),
    staleTime: 5000,
  });
  const { data: ExperienceData } = useQuery({
    queryKey: ["ExperienceDetails"],
    queryFn: ({ signal }) => fetchExperienceDetails({ signal: signal }),
    staleTime: 5000,
  });

  const EducationData = Education?.EducationDetails;
  const ExperienceDatas = ExperienceData?.ExperienceDetails;

  const handleNavigateEduDetails = (item: EducationDetail) => {
    navigation.navigate("EducationDetailsEdit", { item });
  };
  const handleNavigateExpDetails = (item: ExperienceDetail) => {
    navigation.navigate("ExperienceDetailsEdit", { experience: item });
  };

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      if (
        route.params?.scrollToSection === "WorkingExperience" &&
        workingExperienceRef.current
      ) {
        workingExperienceRef.current.measureInWindow((x, y, width, height) => {
          if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: y, animated: true });
          }
        });
      } else if (
        route.params?.scrollToSection === "Skills" &&
        SkillsRef.current
      ) {
        SkillsRef.current.measureInWindow((x, y, width, height) => {
          if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: y, animated: true });
          }
        });
      } else if (
        route.params?.scrollToSection === "Education" &&
        EducationRef.current
      ) {
        EducationRef.current.measureInWindow((x, y, width, height) => {
          if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: y, animated: true });
          }
        });
      }
    });
  }, [route.params]);
  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange: (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
        setFormattedDate(currentDate.toDateString());
      },
      mode: "date",
      is24Hour: true,
    });
  };

  return (
    <View>
      <ScrollView ref={scrollViewRef}>
        <View style={styles.main}>
          {/* <View style={styles.main1}>
            <Text style={styles.title}>Profile Information</Text>
            <TextInputComponent
              name="Full Name"
              placeholder="Enter Your Full Name"
              setText={setFullName}
              text={fullName}
            />
            <TextInputComponent
              name="Email"
              placeholder="Enter Your Email"
              setText={setEmail}
              text={email}
            />

            <TextInputComponent
              name="Phone"
              placeholder="Enter Your Phone"
              setText={setPhone}
              text={phone}
            />
            <View style={{ width: "100%", position: "relative" }}>
              <TextInputComponent
                name="Gender"
                placeholder="Select Your Gender"
                setText={setGender}
                text={gender}
                // boolean={false}
              />
              <View
                style={{
                  position: "absolute",
                  top: 25,
                  right: 0,
                  zIndex: 10,
                  width: 50,
                }}
              >
                <RNPickerSelect
                  onValueChange={(value) => setGender(value)}
                  items={[
                    // { label: "", value: "all" },
                    { label: "Male", value: "Male" },
                    { label: "Female", value: "Female" },
                    // { label: "Đà Nẵng", value: "Đà Nẵng" },
                  ]}
                  // value={gender}
                  placeholder={{ label: "Select Gender...", value: null }}
                  style={pickerSelectStyles}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={showDatePicker}
              style={{ width: "100%" }}
            >
              <TextInputComponent
                name="Date of Birth"
                placeholder="Enter Your Date of Birth"
                setText={setFormattedDate}
                text={formattedDate}
                boolean={false}
              />
            </TouchableOpacity>
            <TextInputComponent
              name="Linkedln"
              placeholder="Optional"
              setText={setLinkedln}
              text={Linkedln}
            />
            <TextInputComponent
              name="Github"
              placeholder="Optional"
              setText={setGithub}
              text={github}
            />
          </View> */}
          <View style={styles.main1} ref={workingExperienceRef}>
            <Text style={styles.title}>Working Experience</Text>
            {ExperienceDatas && ExperienceDatas.length > 0 ? (
              <FlatList
                data={ExperienceDatas}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <ExperienceCard
                    onClick={handleNavigateExpDetails}
                    item={item}
                    onDelete={onDeleteExp}
                    deletingId={deletingIdExp}
                    setDeletingId={setDeletingIdExp}
                  />
                )}
              />
            ) : (
              <Text>Update Your Experience Details</Text>
            )}
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("Experience")}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                }}
              >
                <Text
                  style={{ fontSize: 15, lineHeight: 22.5, color: "#FF4500" }}
                >
                  Add New
                </Text>
                <Icon name="add" size={24} color="#FF4500" />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.main1} ref={SkillsRef}>
            <Text style={styles.title}>Technical Skill</Text>
            <FlatList
              data={UserProfileData?.skillSets}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <SkillCard
                  // onClick={handleNavigateExpDetails}
                  item={item}
                  onDelete={onDeleteSkill}
                  deletingId={deletingIdSkill}
                  setDeletingId={setDeletingIdSkill}
                />
              )}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("Skills")}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                }}
              >
                <Text
                  style={{ fontSize: 15, lineHeight: 22.5, color: "#FF4500" }}
                >
                  Add New
                </Text>
                <Icon name="add" size={24} color="#FF4500" />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.main1} ref={EducationRef}>
            <Text style={styles.title}>Education</Text>
            {EducationData && EducationData.length > 0 ? (
              <FlatList
                data={EducationData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <EducationCard
                    onClick={handleNavigateEduDetails}
                    item={item}
                    onDelete={onDelete}
                    deletingId={deletingId}
                    setDeletingId={setDeletingId}
                  />
                )}
              />
            ) : (
              <Text>Update Your Education Details</Text>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("Education")}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                }}
              >
                <Text
                  style={{ fontSize: 15, lineHeight: 22.5, color: "#FF4500" }}
                >
                  Add New
                </Text>
                <Icon name="add" size={24} color="#FF4500" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    paddingVertical: 10,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 20,
  },
  main1: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: "white",
    elevation: 5,
    width: "100%",
    gap: 10,
  },
  title: {
    fontSize: 20,
    lineHeight: 30,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    width: "100%",
  },
  button: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#dedede",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  educationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    width: "100%",
  },
  textContainer: {
    flexDirection: "column",
  },
  schoolName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  degree: {
    fontSize: 14,
    color: "#666",
  },
  dates: {
    fontSize: 12,
    color: "#888",
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

    // paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",

    // paddingRight: 30,
  },
  educationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  textContainer: {
    flexDirection: "column",
  },
  schoolName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  degree: {
    fontSize: 14,
    color: "#666",
  },
  dates: {
    fontSize: 12,
    color: "#888",
  },
});
