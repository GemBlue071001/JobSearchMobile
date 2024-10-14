import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { GetUserProfile } from "../Services/UserProfileService/UserProfile";

const ResumeScreen = () => {
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
    staleTime: 1000,
  });

  const UserProfileData = UserProfile?.UserProfiles;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        {/* Technical Skills Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technical Skills</Text>
          {UserProfileData?.skillSets.map((skills) => (
            <Text style={styles.bulletPoint}>
              •{skills.name}:{" "}
              {skills.description.replace(/<\/?[^>]+(>|$)/g, "")}{" "}
            </Text>
          ))}
        </View>

        <View style={styles.divider} />

        {/* Work Experience Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Experience</Text>
          {UserProfileData?.experienceDetails.map((exp) => (
            <View style={styles.job}>
              <Text style={styles.jobTitle}>
                Company Name: {exp.companyName} |{" "}
                {new Date(exp.startDate).toLocaleString("en", {
                  month: "short",
                  year: "numeric",
                })}{" "}
                -{" "}
                {exp.endDate
                  ? new Date(exp.endDate).toLocaleString("en", {
                      month: "short",
                      year: "numeric",
                    })
                  : "Present"}{" "}
              </Text>
              <Text style={styles.jobRole}>
                Position: {""}
                {exp.position}
              </Text>
              <Text style={styles.jobResponsibilities}>
                {exp.responsibilities.replace(/<\/?[^>]+(>|$)/g, "")}
              </Text>
              <Text style={styles.jobTitle}>Achievements:</Text>
              <Text style={styles.jobDescription}>
                {exp.achievements.replace(/<\/?[^>]+(>|$)/g, "")}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        {/* Education Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {UserProfileData?.educationDetails.map((edu) => (
            <View style={styles.education}>
              <Text style={styles.school}>
                School Name:{edu.name} |{" "}
                {new Date(edu.startDate).toLocaleString("en", {
                  month: "short",
                  year: "numeric",
                })}{" "}
                -{" "}
                {edu.endDate
                  ? new Date(edu.endDate).toLocaleString("en", {
                      month: "short",
                      year: "numeric",
                    })
                  : "Present"}{" "}
              </Text>
              <Text style={styles.degree}>Major: {edu.fieldOfStudy}</Text>
              <Text style={styles.thesis}>GPA: {edu.gpa}</Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        {/* Footer */}
        {/* <View style={styles.footer}>
          <Text style={styles.footerText}>CV By TopDev 1/1</Text>
        </View> */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f5f5f5", // Light background color for outer area
    flexGrow: 1,
  },
  card: {
    backgroundColor: "#fff", // White background for the card area
    padding: 16,
    borderRadius: 8,
    elevation: 3, // For shadow on Android
    shadowColor: "#000", // For shadow on iOS
    shadowOpacity: 0.2,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 14,
    marginLeft: 8,
  },
  job: {
    marginTop: 8,
  },
  jobTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  jobRole: {
    fontSize: 14,
    marginTop: 4,
  },
  jobResponsibilities: {
    fontSize: 14,
    fontStyle: "italic",
    marginTop: 4,
  },
  jobDescription: {
    fontSize: 14,
    marginTop: 4,
  },
  education: {
    marginTop: 8,
  },
  school: {
    fontSize: 14,
    fontWeight: "bold",
  },
  degree: {
    fontSize: 14,
    marginTop: 4,
  },
  thesis: {
    fontSize: 14,
    marginTop: 4,
  },
  divider: {
    borderBottomColor: "#ccc", // Light grey color for the divider
    borderBottomWidth: 1,
    marginVertical: 16, // Space around the divider
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#999",
  },
});

export default ResumeScreen;
