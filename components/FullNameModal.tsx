import React from "react";
import {
  View,
  Modal,
  ScrollView,
  Text,
  TextInput,
  Button,
  StyleSheet,
} from "react-native";

const FullNameModal = ({
  modalVisible,
  setModalVisible,
  fullName,
  setFullName,
  address,
  setAddress,
  phoneNumber,
  setPhoneNumber,
}: {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  fullName?: string;
  setFullName?: (name: string) => void;
  address?:string,
  setAddress?:  (name: string) => void;
  phoneNumber?:string,
  setPhoneNumber?:(name: string) => void;
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Your Full Name</Text>
          <Text style={{ marginBottom: 10 }}>
            Help companies identify you easily by inputting your full name
            below.
          </Text>
          <ScrollView>
            <View style={styles.form}>
              <ScrollView style={{ width: "100%" }}>
                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    width: "100%",
                    gap: 5,
                  }}
                >
                  <Text>Your Full Name</Text>
                  <TextInput
                    style={styles.input}
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Your Full Name"
                  />
                </View>
                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    width: "100%",
                    gap: 5,
                  }}
                >
                  <Text>Your Email</Text>
                  <TextInput
                    style={styles.input}
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Your Email"
                  />
                </View>
                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    width: "100%",
                    gap: 5,
                  }}
                >
                  <Text>Your Phone number</Text>
                  <TextInput
                    style={styles.input}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    placeholder="Your Email"
                  />
                </View>
              </ScrollView>
            </View>
          </ScrollView>
          <View style={styles.buttonContainer}>
            <Button
              title="SAVE CHANGES"
              onPress={() => setModalVisible(false)}
              color="#FF4500"
            />
            <Button
              title="CANCEL"
              onPress={() => setModalVisible(false)}
              color="#777"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    overflow: "scroll",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  form: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    height: 250,
    overflow: "scroll",
    gap: 5,
  },
});

export default FullNameModal;
