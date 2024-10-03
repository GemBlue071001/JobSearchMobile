import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { companyData } from "../mock/CompanyData";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as DocumentPicker from "expo-document-picker";
import { RadioButton } from 'react-native-paper';
import TextInputComponent from "../components/TextInputComponent";

interface FileResponse {
  uri: string;
  name: string | null;
  mimeType: string | null;
  size: number | null;
}

export default function Apply({ route }: any) {
  const { job } = route.params;
  const companyDetail = companyData.find((item) => item.id === job?.companyId);

  const [selectedFile, setSelectedFile] = useState<FileResponse | null>(null);
  const [selectedCV, setSelectedCV] = useState<string | null>(null); // State to manage the selected CV
  const [name,setName]=useState<string>('')
  const [email,setEmail]=useState<string>('hathucminh456@gmail.com')
  const [phone,setPhone]=useState<string>('')

  async function pickFile() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ], // Filters for pdf, doc, docx
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        Alert.alert("File selection was cancelled.");
        return;
      }

      // If successful, access the first file in the assets array (for single file selection)
      const selectedAsset = result.assets[0];

      // Update the state with the selected file
      setSelectedFile({
        uri: selectedAsset.uri,
        name: selectedAsset.name ?? "Unknown",
        mimeType: selectedAsset.mimeType ?? "Unknown",
        size: selectedAsset.size ?? 0,
      });

      // Set the selected CV in the radio button when a file is uploaded
      setSelectedCV(selectedAsset.name ?? "Unknown");
    } catch (error) {
      console.error("Error picking file: ", error);
      Alert.alert("Error", "There was an error while selecting the file.");
    }
  }

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
            <Text style={styles.title}>{job?.title}</Text>
            <Text style={styles.companyText}>{companyDetail?.name}</Text>
            <View style={styles.location}>
              <Icon name="location-on" size={20} color="#808080" />
              <Text style={styles.locationtext}>{job?.location}</Text>
            </View>
            <View style={styles.tax}>
              <Icon name="attach-money" size={20} color="#808080" />
              <Text style={styles.taxtext}>{job?.salary}</Text>
            </View>
            <View style={styles.post}>
              <Icon name="access-time" size={15} color="#808080" />
              <Text style={styles.posttext}>{job?.postDate}</Text>
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

          {/* Section to display and select the uploaded CV */}
          <View style={styles.main1}>
            <Text style={styles.title1}>Select Your File</Text>

            <View style={styles.radioContainer}>
              {selectedFile && (
                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={() => setSelectedCV(selectedFile.name ?? "")}
                >
                  <Text style={styles.cvText} numberOfLines={1}>
                    {selectedFile.name}
                  </Text>
                  <RadioButton
                    value={selectedFile.name ?? ""}
                    status={selectedCV === selectedFile.name ? 'checked' : 'unchecked'}
                    onPress={() => setSelectedCV(selectedFile.name ?? "")}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.main1}>
            <Text style={styles.title1}>Information</Text>

            <TextInputComponent text={name} setText={setName} name="Fullname" placeholder="Input Your FullName"/>
            
            <TextInputComponent text={email} setText={setEmail} name="Email" placeholder="" boolean={false}/>
            <TextInputComponent text={phone} setText={setPhone} name="Phone Number" placeholder="Optional" />
            
          </View>
        </View>
      </ScrollView>

      <View style={styles.save}>
        <TouchableOpacity style={styles.buttonsave} >
          <Text style={styles.textsave}>Confirm Apply</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  main: {
    paddingTop:20,
    paddingBottom:60,
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
    width:'100%'
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
  textsave: {
    color: "white",
    fontSize: 20,
    lineHeight: 30,
    fontWeight: "bold",
  },
});
