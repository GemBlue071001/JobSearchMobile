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
// import { companyData } from "../mock/CompanyData";
import { useQuery } from "@tanstack/react-query";
import { fetchCompanies } from "../Services/CompanyService/GetCompanies";
import { GetJobPost } from "../Services/JobsPost/GetJobPosts";
const SkillSet = ["PHP", "Front End", "Java", "End", "Javascript"];
export default function FormSearch({ navigation }: any) {
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

  const JobPostsdata = JobPosts?.JobPosts;
  const Companiesdata = Company?.Companies;
  const jobSlice = JobPostsdata?.slice(0, 5);
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
                width: "100%",
                paddingHorizontal: 15,
              }}
            >
              <Text style={styles.title}>Popular Jobs from Companies</Text>
              <TouchableOpacity>
                <Text style={styles.title1}>View More</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.jobdisplay}>
              {jobSlice?.map((job) => {
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
    paddingVertical: 30,
    paddingHorizontal: 50,
    backgroundColor: "#fff",
  },
  main3: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 10,
  },
  jobdisplay: {
    paddingRight: 12,
    flexDirection: "column",
    gap: 5,
    paddingLeft: 10,
    alignItems: "center",
  },
});
