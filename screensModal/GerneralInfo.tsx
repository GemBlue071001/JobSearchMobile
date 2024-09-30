import React, { useEffect, useRef, useState } from "react";
import {
  Button,
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
  const EducationRef =useRef<View>(null);


  useEffect(() => {

    InteractionManager.runAfterInteractions(() => {
      if (route.params?.scrollToSection === "WorkingExperience" && workingExperienceRef.current) {
        workingExperienceRef.current.measureInWindow((x, y, width, height) => {
          if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: y, animated: true });
          }
        });
      } else if (route.params?.scrollToSection === "Skills" && SkillsRef.current) {
        SkillsRef.current.measureInWindow((x, y, width, height) => {
          if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: y, animated: true });
          }
        });
      } else if (route.params?.scrollToSection === "Education" && EducationRef.current) {
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
          <View style={styles.main1}>
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
          </View>
          <View style={styles.main1} ref={workingExperienceRef}>
            <Text style={styles.title}>Working Experience</Text>
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
});
