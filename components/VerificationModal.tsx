import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PutEmail } from "../Services/AuthService/PutEmail";
import { AuthService } from "../Services/AuthService/AuthService";
import AuthModal from "./AuthModal";

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
}

interface FormData {
  userId: number;
  verificationCode: string;
  newEmail: string;
}

const VerificationModal: React.FC<AuthModalProps> = ({ visible, onClose }) => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [userRegisterId, setUserRegisterId] = useState<string | null>(null);
  const [modalVisibleLogin, setModalVisibleLogin] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserId = async () => {
      const Registerid = await AsyncStorage.getItem("userIdRegister");

      if (Registerid) {
        setUserRegisterId(Registerid);
        setFormData((prevData) => ({
          ...prevData,
          userId: Number(Registerid), // Now setting userId properly once it is fetched
        }));
      }
    };

    fetchUserId();
  }, []);

  const [formData, setFormData] = useState<FormData>({
    userId: NaN, // Initial value will be updated once AsyncStorage is fetched
    verificationCode: "",
    newEmail: "",
  });

  const {
    mutate: mutatePutEmail,
    isPending: RegisterPending,
    reset,
  } = useMutation({
    mutationFn: PutEmail,
    onSuccess: () => {
      Alert.alert("Success", "Update Email successful!");

      setIsLogin(true);
      setTimeout(() => {
        reset();
      }, 3000);
    },
    onError: () => {
      Alert.alert("Error", "Update failed. Please try again.");
      setTimeout(() => {
        reset();
      }, 5000);
    },
  });

  const {
    mutate: mutateAuth,
    isPending: PendingLogin,
  } = useMutation({
    mutationFn: AuthService,
    onSuccess: () => {
      setModalVisibleLogin(true);
      Alert.alert("Success", "Account Verification Complete!");
      onClose();
    },
    onError: () => {
      Alert.alert(
        "Error",
        "Login failed. Please check your credentials and try again."
      );
    },
  });

  const handleInputChange = (name: keyof FormData, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    const { verificationCode } = formData;
    if (!verificationCode) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    mutateAuth({
      user: {
        userId: Number(userRegisterId),
        verificationCode: verificationCode,
      },
    });
  };

  const handleRegister = async () => {
    const { newEmail } = formData;
    if (!newEmail) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    mutatePutEmail({
      data: {
        newEmail: newEmail,
        userId: Number(userRegisterId),
      },
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.container}>
        <View style={styles.modal}>
          <Text style={styles.title}>{isLogin ? "Login" : "Register"}</Text>

          {isLogin ? (
            <TextInput
              style={styles.input}
              placeholder="Verification Code"
              value={formData.verificationCode}
              onChangeText={(text) =>
                handleInputChange("verificationCode", text)
              }
            />
          ) : (
            <TextInput
              style={styles.input}
              placeholder="New Email"
              value={formData.newEmail}
              onChangeText={(text) => handleInputChange("newEmail", text)}
            />
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={isLogin ? handleLogin : handleRegister}
            disabled={PendingLogin || RegisterPending}
          >
            <Text style={styles.buttonText}>
              {isLogin
                ? PendingLogin
                  ? "Please wait..."
                  : "Verify"
                : RegisterPending
                ? "Please wait..."
                : "Update Email"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.switchText}>
              {isLogin ? "Switch to Email Update" : "Switch to Verification"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
      <AuthModal
        visible={modalVisibleLogin}
        onClose={() => setModalVisibleLogin(false)}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#ff5733",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  switchText: {
    color: "#ff5733",
    textAlign: "center",
    marginBottom: 10,
  },
  closeText: {
    textAlign: "center",
    color: "grey",
  },
});

export default VerificationModal;