import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CardJobs from "../components/CardJobs";
import { jobData } from "../mock/JobData";
import { companyData } from "../mock/CompanyData";
const SkillSet = ["PHP", "Front End", "Java", "End", "Javascript"];
export default function FormSearch({ navigation }: any) {
  const jobSlice = jobData.slice(0, 5);
  return (
    <ScrollView>
      <View style={styles.main}>
        <View style={styles.main1}>
          <Image
            source={require("../assets/image.jpg")}
            style={{ width: 200, height: 150 }}
          />
          <Text style={styles.title}>Discover Jobs/Companies </Text>
          <Text style={styles.title1}>
            Try Discovering new jobs/companies with search on browse our
            categories{" "}
          </Text>
          <View style={styles.catgories}>
            <Text style={styles.title}>Top Keyword </Text>
            <View style={styles.skillList}>
              {SkillSet.map((tag, index) => (
                <TouchableOpacity key={index} style={styles.button}>
                  <Text style={styles.buttonText}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        <View style={styles.main2}>
          <View style={styles.main3}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width:'100%'
              }}
            >
              <Text style={styles.title}>Popular Jobs from Companies</Text>
              <TouchableOpacity>
              <Text style={styles.title1}>View More</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.jobdisplay}>
              {jobSlice.map((job) => {
                const companys = companyData.find(
                  (item) => item.id === job.companyId
                );
                return (
                  <CardJobs
                    key={job.id}
                    data={job}
                    img={job.companyImage}
                    company={companys}
                    navigation={navigation}
                  />
                );
              })}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  main: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },

  main1: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 20,
  },
  title: {
    fontSize: 15,
    lineHeight: 22.5,
    fontWeight: "bold",
  },
  title1: {
    fontSize: 15,
    lineHeight: 22.5,
    textAlign: "center",
  },
  catgories: {
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 10,
  },

  skillList: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#dedede",
    marginRight: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: "#6c6c6c",
    fontSize: 13,
    lineHeight: 22.5,
    fontWeight: "500",
    textAlign: "center",
  },

  main2: {
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  main3: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 10,
  },
  jobdisplay: {
    flexDirection: "column",
    gap: 5,
    alignItems: "center",
  },
});
