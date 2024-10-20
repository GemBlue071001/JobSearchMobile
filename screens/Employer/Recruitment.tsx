import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  StyleSheet,
  Dimensions,
  Alert, // To make the layout responsive
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useQuery, useMutation } from "@tanstack/react-query";
import { GetJobPost } from "../../Services/JobsPost/GetJobPosts";
import { GetSeekerJobPost } from "../../Services/JobsPost/GetSeekerJobPost";
import { PostJobLcation } from "../../Services/JobPostLocation/PostJobLcation";
import { queryClient } from "../../Services/mainService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker"; // Importing Picker
interface JobType {
  id: number;
  name: string;
  description: string;
}

// interface JobLocation {
//   id: number;
//   district: string;
//   city: string;
//   postCode: string;
//   state: string;
//   country: string;
//   stressAddress: string;
// }

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
  jobType: JobType; // jobType là đối tượng JobType
  jobLocationCities: string[];
  jobLocationAddressDetail: string[];
  skillSets: string[]; // Array of skill sets, có thể là array rỗng
}

const screenWidth = Dimensions.get("window").width;

export default function Recruitment() {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [jobCVCounts, setJobCVCounts] = useState<Record<number, number>>({});
  const [isFetchingCVs, setIsFetchingCVs] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectJobId, setSelectJobId] = useState<number | undefined>();
  const [stressAddressDetail, setStressAddressDetail] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState("1");
  const navigation = useNavigation();

  const [UserId, setUserId] = useState<string | null>(null);
  const [Auth, setAuth] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem("userId");
      const Auth = await AsyncStorage.getItem("Auth");
      const CompanyId = await AsyncStorage.getItem("CompanyId");
      setAuth(Auth);
      setUserId(id);
      setCompanyId(CompanyId);
    };

    fetchUserId();
  }, []);

  const { data: JobPosts, isLoading: isJobLoading } = useQuery({
    queryKey: ["JobPosts"],
    queryFn: GetJobPost,
    staleTime: 5000,
  });

  const JobPostsdata = JobPosts?.JobPosts || [];
  const JobinCompany = useMemo(() => {
    return JobPostsdata.filter(
      (item: JobPost) => item.companyId === Number(companyId)
    );
  }, [JobPostsdata, companyId]);

  const filteredJobs = useMemo(() => {
    if (!searchTerm) return JobinCompany;
    return JobinCompany.filter((job) =>
      job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [JobinCompany, searchTerm]);

  const fetchCVsForJobs = useCallback(async () => {
    if (JobinCompany) {
      setIsFetchingCVs(true);
      const cvCounts: Record<number, number> = {};
      await Promise.all(
        JobinCompany.map(async (job) => {
          const seekerData = await GetSeekerJobPost({ id: job.id });
          const data = seekerData?.GetSeekers?.length || 0;
          cvCounts[job.id] = data;
        })
      );
      setJobCVCounts(cvCounts);
      setIsFetchingCVs(false);
    }
  }, [JobinCompany]);

  const { mutate } = useMutation({
    mutationFn: PostJobLcation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["JobPosts"],
      });
      Alert.alert("Success", "Job location has been successfully updated.", [
        { text: "OK" },
      ]);
      setOpenModal(false);
    },
    onError: () => {
      // Show error message
      Alert.alert(
        "Error",
        "Failed to update the job location. Please try again.",
        [{ text: "OK" }]
      );
    },
  });

  useEffect(() => {
    fetchCVsForJobs();
  }, [fetchCVsForJobs]);

  const handleEditClick = (id: number) => {
    setSelectJobId(id);
    setOpenModal(true);
  };

  const handleSave = () => {
    if (selectJobId) {
      mutate({
        data: {
          locationId: Number(selectedStatus), // Assuming default location
          jobPostId: selectJobId,
          stressAddressDetail,
        },
      });
    }
  };

  if (isJobLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchSection}>
        <Icon name="search" size={20} color="#868d94" />
        <TextInput
          style={styles.input}
          placeholder="Search for job postings"
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
        />
      </View>

      {/* Job Table Header */}
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Jobs title</Text>
        <Text style={styles.tableHeaderText}>Status</Text>
        <Text style={styles.tableHeaderText}>System-generated CVs</Text>
        {/* <Text style={styles.tableHeaderText}>Filter CVs</Text> */}
      </View>

      {/* Job Table Content */}
      {filteredJobs.map((job: JobPost, index) => (
        <View
          key={job.id}
          style={[
            styles.jobRow,
            index % 2 === 0 ? styles.evenRow : styles.oddRow,
          ]}
        >
          <View style={styles.jobColumn}>
            <Text style={styles.jobId}>{job.id}</Text>
            <Text style={styles.jobTitle}>{job.jobTitle}</Text>
            <Text style={styles.cvInfo}>
              {jobCVCounts[job.id]
                ? `Have ${jobCVCounts[job.id]} CV Applied`
                : "No CV yet"}
            </Text>
            <TouchableOpacity>
              <Text style={styles.link}>View Candidate's CV</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleEditClick(job.id)}>
              <Text style={styles.link}>Add JobLocation</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.jobStatus}>Approved</Text>

          <TouchableOpacity style={styles.detailsButton}>
            <Icon name="remove-red-eye" size={20} color="#a8afb6" />
            <Text style={styles.detailsButtonText}>View Details</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity style={styles.findCvButton}>
            <Text style={styles.findCvButtonText}>Find CVs</Text>
          </TouchableOpacity> */}
        </View>
      ))}

      {/* Modal for editing job location */}
      <Modal
        visible={openModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setOpenModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Update Status</Text>

            {/* Picker for selecting location */}
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedStatus}
                onValueChange={(itemValue) => setSelectedStatus(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Hồ Chí Minh" value="1" />
                <Picker.Item label="Hà Nội" value="2" />
                <Picker.Item label="Đà Nẵng" value="3" />
                <Picker.Item label="Hải Phòng" value="4" />
                <Picker.Item label="Cần Thơ" value="5" />
                <Picker.Item label="Nha Trang" value="6" />
              </Picker>
            </View>

            {/* Text input for stressAddressDetail */}
            <TextInput
              style={styles.inputmodal}
              placeholder="Input your address"
              value={stressAddressDetail}
              onChangeText={setStressAddressDetail}
            />

            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              onPress={() => setOpenModal(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8", // Lighter background for better contrast
    padding: 10, // Added padding around the content
  },
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
    marginBottom: 20,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333", // Darker text color for better readability
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 10,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    color: "#444", // Better contrast for header text
    textAlign: "center",
  },
  jobRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  evenRow: {
    backgroundColor: "#fefefe", // Subtle background for alternating rows
  },
  oddRow: {
    backgroundColor: "#f4f6f8", // Slight difference for alternating rows
  },
  jobColumn: {
    flex: 1.5,
    justifyContent: "flex-start",
  },
  jobId: {
    fontSize: 14,
    color: "#888", // Slightly muted text for job ID
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "600", // Bolder job title
    color: "#333", // Darker color for the title
    marginBottom: 5,
  },
  cvInfo: {
    fontSize: 14,
    color: "#666", // Muted color for CV info
    marginBottom: 5,
  },
  link: {
    color: "#FF6F61",
    fontSize: 14,
    fontWeight: "500",
    textDecorationLine: "underline", // Underline links to indicate interactivity
    marginBottom: 5,
  },
  jobStatus: {
    flex: 1,
    fontSize: 16,
    color: "#28a745", // Green for "Approved"
    fontWeight: "bold",
    textAlign: "center",
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f1f3f5", // Subtle background for details button
    marginLeft: 10,
  },
  detailsButtonText: {
    color: "#444", // Darker text for better readability
    marginLeft: 5,
    fontSize: 14,
  },
  findCvButton: {
    backgroundColor: "#FF6F61",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
  },
  findCvButtonText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Darker overlay for better modal focus
  },
  modalContainer: {
    width: screenWidth * 0.85,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333", // Darker text for modal title
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  inputmodal: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#FF6F61",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#FF6F61",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#FF6F61",
    fontWeight: "bold",
    fontSize: 16,
  },
});
