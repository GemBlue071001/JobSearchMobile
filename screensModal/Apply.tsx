import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";

import Icon from "react-native-vector-icons/MaterialIcons";
import * as DocumentPicker from "expo-document-picker";
import { RadioButton } from "react-native-paper";
import TextInputComponent from "../components/TextInputComponent";
import { fetchCompanies } from "../Services/CompanyService/GetCompanies";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GetJobPostById } from "../Services/JobsPost/GetJobPostById";
import { fetchCVs } from "../Services/CVService/GetCV";
import { PostCVs } from "../Services/CVService/PostCV";
import { queryClient } from "../Services/mainService";
import { PostJobPostActivity } from "../Services/JobsPostActivity/PostJobPostActivity";
import { GetJobActivity } from "../Services/UserJobPostActivity/GetUserJobPostActivity";
import { GetSeekerJobPost } from "../Services/JobsPost/GetSeekerJobPost";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import 'react-native-get-random-values';
import * as uuid from 'uuid'
import { storage } from "../firebase/config";


interface FileResponse {
  uri: string;  
  name: string | null;
  mimeType: string | null;
  size: number | null;
}

export default function Apply({ route,navigation }: any) {
  const { id } = route.params;

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toISOString().split("T")[0]; // Chỉ lấy phần ngày (YYYY-MM-DD)
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const { data: jobData } = useQuery({
    queryKey: ["Job-details", id],
    queryFn: ({ signal }) => GetJobPostById({ id: Number(id), signal }),
    enabled: !!id,
  });
  const job = jobData?.JobPosts;

  const { data: Company } = useQuery({
    queryKey: ["Company"],
    queryFn: ({ signal }) => fetchCompanies({ signal }),
    staleTime: 5000,
  });

  const Companiesdata = Company?.Companies;
  const companyDetail = Companiesdata?.find(
    (item) => item.id === job?.companyId
  );

  const { data: JobPostActivity } = useQuery({
    queryKey: ["JobPostActivity"],
    queryFn: ({ signal }) => GetJobActivity({ signal }),
    staleTime: 5000,
  });

  const JobPostActivitydata = JobPostActivity?.UserJobActivitys;
  const hasAppliedJobActivity = JobPostActivitydata?.find(
    (activity) => activity.jobPostId === job?.id
  );

  const [selectedFile, setSelectedFile] = useState<FileResponse | null>(null);
  const [selectedCV, setSelectedCV] = useState<string | null>(null);
  const [selectedCVId, setSelectedCVId] = useState<number | null>(null);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("hathucminh456@gmail.com");
  const [phone, setPhone] = useState<string>("");

  const [UserId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem("userId");
      setUserId(id);
    };

    fetchUserId();
  }, []);

  const { data: CVdata } = useQuery({
    queryKey: ["CVs"],
    queryFn: ({ signal }) => fetchCVs({ signal }),
    staleTime: 5000,
  });

  const dataCVS = CVdata?.CVs || [];

  const { mutate,isPending } = useMutation({
    mutationFn: PostCVs,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["CVs"] });
      Alert.alert("Post CV successfully");
    },
    onError: () => {
      Alert.alert("Failed to Upload CV");
    },
  });
  async function pickFile() {
    try {
      // Let the user pick a file with specified types
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        copyToCacheDirectory: true,
      });
  
      // Check if user cancelled file selection
      if (result.canceled) {
        Alert.alert("File selection was cancelled.");
        return;
      }
  
      const selectedAsset = result.assets ? result.assets[0] : result;
  
      if (!selectedAsset.uri) {
        Alert.alert("Error", "No file was selected.");
        return;
      }
  
      // Set file details to state (optional)
      setSelectedFile({
        uri: selectedAsset.uri,
        name: selectedAsset.name ?? "Unknown",
        mimeType: selectedAsset.mimeType ?? "Unknown",
        size: selectedAsset.size ?? 0,
      });
  
      // Generate a unique reference in Firebase Storage
      const fileRef = ref(storage, `${selectedAsset.name}`);
  
      // Convert file URI to blob for upload
      const response = await fetch(selectedAsset.uri);
      const blob = await response.blob();
  
      // Upload the file to Firebase Storage
      await uploadBytes(fileRef, blob);
  
      // Get the download URL once upload completes
      const fileUrl = await getDownloadURL(fileRef);
  
      // Perform mutation or any other action with the file URL and details
      mutate({
        data: {
          url: fileUrl,
          name: selectedAsset.name,
        },
      });
  
      Alert.alert("Success", "File uploaded successfully!");
  
    } catch (error) {
      console.error("Error picking or uploading file: ", error);
      Alert.alert("Error", "There was an error while selecting or uploading the file.");
    }
  }
  const { mutate: JobApply } = useMutation({
    mutationFn: PostJobPostActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["JobPostActivity"],
        refetchType: "active",
      });
      Alert.alert(`CV Apply to ${job?.jobTitle} successfully!`);
      navigation.navigate('ApplyComplete')
    },
    onError: () => {
      Alert.alert("Failed to Apply CV.");
    },
  });

  const handleSelectCV = (id: number, name: string) => {
    setSelectedCV(name);
    setSelectedCVId(id);
  };

  const handleApply = () => {
    if (selectedCV) {
      JobApply({
        data: {
          jobPostId: job?.id,
          cvId: selectedCVId,
        },
      });
    } else {
      Alert.alert("Please select a CV to apply.");
    }
  };

  const { data: SeekerApply } = useQuery({
    queryKey: ["SeekerApply", id],
    queryFn: ({ signal }) => GetSeekerJobPost({ id: Number(id), signal }),
    enabled: !!id,
  });

  const dataSeekerApply = SeekerApply?.GetSeekers;
  const profileApply = dataSeekerApply?.find(
    (item) => item.id === Number(UserId)
  );

  const CVApplied = dataCVS.find((item) => item.id === profileApply?.cvId);

  if (!job) {
    return (
      <View>
        <Text>Job not found</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView>
        <View style={styles.main}>
          <View style={styles.main1}>
            <Text style={styles.title}>{job?.jobTitle}</Text>
            <Text style={styles.companyText}>{companyDetail?.companyName}</Text>
            <View style={styles.location}>
              {job?.jobLocationAddressDetail?.length > 0 ? (
                job.jobLocationAddressDetail.map((item, index) => (
                  <View style={styles.location} key={index}>
                    <Icon name="location-on" size={20} color="#808080" />
                    <Text style={styles.locationtext}>{item}</Text>
                  </View>
                ))
              ) : (
                <View style={styles.location}>
                  <Icon name="location-on" size={20} color="#808080" />
                  <Text style={styles.locationtext}>No Location Yet</Text>
                </View>
              )}
            </View>
            <View style={styles.tax}>
              <Icon name="attach-money" size={20} color="#808080" />
              <Text style={styles.taxtext}>{job?.salary}</Text>
            </View>
            <View style={styles.post}>
              <Icon name="access-time" size={15} color="#808080" />
              <Text style={styles.posttext}>
                {job?.postingDate
                  ? formatDate(job.postingDate)
                  : "No Date Available"}
              </Text>
            </View>
          </View>

          <View style={styles.container}>
            <TouchableOpacity style={styles.uploadButton} onPress={pickFile}>
              <Icon name="cloud-upload" size={24} color="#1E90FF" />
              <Text style={styles.uploadText}>Upload your CV</Text>
            </TouchableOpacity>

            <Text style={styles.hintText}>
              (*.doc, *.docx, *.pdf, and &lt; 5MB)
            </Text>

            {selectedFile && (
              <Text style={styles.selectedFileText}>
                Selected file: {selectedFile.name}
              </Text>
            )}
          </View>

          <View style={styles.main1}>
            <Text style={styles.title1}>Select Your File</Text>
            <View style={styles.radioContainer}>
              {hasAppliedJobActivity && profileApply && CVApplied ? (
                <TouchableOpacity
                  style={styles.radioButton}
                  key={CVApplied?.id}
                >
                  <View
                    style={{
                      flexDirection: "column",
                      alignItems: "flex-start",
                      justifyContent: "flex-start",
                    }}
                  >
                    <Text style={styles.cvText} numberOfLines={1}>
                      {CVApplied?.name ?? profileApply?.userName}
                    </Text>

                    {hasAppliedJobActivity?.applicationDate && (
                      <View style={styles.location}>
                        <Icon name="access-time" size={20} color="#808080" />
                        <Text style={styles.locationtext}>
                          {formatDateTime(
                            hasAppliedJobActivity.applicationDate
                          )}
                        </Text>
                      </View>
                    )}
                  </View>
                  <RadioButton
                    value={CVApplied?.name ?? ""}
                    status={
                      selectedCVId === CVApplied?.id ? "checked" : "unchecked"
                    }
                  />
                </TouchableOpacity>
              ) : (
                dataCVS.map((cv) => (
                  <TouchableOpacity
                    style={styles.radioButton}
                    onPress={() => handleSelectCV(cv.id, cv.name)}
                    key={cv.id}
                  >
                    <View
                      style={{
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "flex-start",
                      }}
                    >
                      <Text style={styles.cvText} numberOfLines={1}>
                        {cv.name}
                      </Text>
                    </View>
                    <RadioButton
                      value={cv.name ?? ""}
                      status={selectedCVId === cv.id ? "checked" : "unchecked"}
                      onPress={() => handleSelectCV(cv.id, cv.name)}
                    />
                  </TouchableOpacity>
                ))
              )}
            </View>
          </View>

          <View style={styles.main1}>
            <Text style={styles.title1}>Information</Text>

            <TextInputComponent
              text={name}
              setText={setName}
              name="Fullname"
              placeholder="Input Your FullName"
            />

            <TextInputComponent
              text={email}
              setText={setEmail}
              name="Email"
              placeholder=""
              boolean={false}
            />
            <TextInputComponent
              text={phone}
              setText={setPhone}
              name="Phone Number"
              placeholder="Optional"
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.save}>
        {hasAppliedJobActivity ? (
          <TouchableOpacity style={styles.buttonsaveApplied}>
            <Text style={styles.textsave}>Confirm Apply</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.buttonsave} onPress={handleApply}>
            <Text style={styles.textsave}>Confirm Apply</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  main: {
    paddingTop: 20,
    paddingBottom: 60,
    flexDirection: "column",
    gap: 10,
  },
  main1: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: "column",
    gap: 10,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FF4500",
    lineHeight: 30,
  },
  title1: {
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 30,
  },
  companyText: {
    fontSize: 15,
    fontWeight: "bold",
    lineHeight: 22.5,
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
  post: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  posttext: {
    fontSize: 12,
    lineHeight: 18,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    width: "100%",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  uploadText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#1E90FF",
    fontWeight: "bold",
  },
  hintText: {
    marginTop: 5,
    fontSize: 12,
    color: "#808080",
  },
  selectedFileText: {
    marginTop: 10,
    fontSize: 14,
    color: "#1E90FF",
  },
  radioContainer: {
    marginTop: 10,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 10,
    width: "100%",
  },
  cvText: {
    fontSize: 16,
    flexShrink: 1,
  },
  save: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
    position: "absolute",
    width: "100%",
    bottom: 0,
    left: 0,
    right: 0,
  },
  buttonsave: {
    width: "100%",
    paddingVertical: 10,
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
    backgroundColor: "#FF5A5F",
    borderRadius: 8,
  },
  buttonsaveApplied: {
    width: "100%",
    paddingVertical: 10,
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
    backgroundColor: "#DEDEDE",
    borderRadius: 8,
  },
  textsave: {
    color: "white",
    fontSize: 20,
    lineHeight: 30,
    fontWeight: "bold",
  },
});
