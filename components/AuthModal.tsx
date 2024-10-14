import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { login } from "../Services/AuthService/Login";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useRoute } from "@react-navigation/native";
import { register } from "../Services/AuthService/Register";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { queryClient } from "../Services/mainService";
import { GetUserProfile } from "../Services/UserProfileService/UserProfile";

interface CustomJwtPayload {
  Role: string;
  UserId: string;
  name: string;
}

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
}

interface FormData {
  userName: string;
  password: string;
  confirmPassword?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: number;
}

const AuthModal: React.FC<AuthModalProps> = ({ visible, onClose }) => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [formData, setFormData] = useState<FormData>({
    userName: "",
    password: "",
    confirmPassword: "",
    email: "",
    firstName: "",
    lastName: "",
    role: 0,
  });

  const route = useRoute(); // Di chuyển vào bên trong component

  const {
    mutate: mutateRegister,
    error: registerError,
    isError: isRegisterError,
    isPending: RegisterPending,
    isSuccess: isRegisterSuccess,
    reset,
  } = useMutation({
    mutationFn: register,
    onSuccess: () => {
      Alert.alert("Success", "Registration successful!");

      setFormData({
        userName: "",
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        confirmPassword: "",
        role: 0,
      });

      setIsLogin(true); // Chuyển sang màn hình đăng nhập sau khi đăng ký thành công
      setTimeout(() => {
        reset();
      }, 3000);
    },
    onError: () => {
      Alert.alert("Error", "Registration failed. Please try again.");
      setTimeout(() => {
        reset();
      }, 5000);
    },
  });

  const {
    mutate: mutateLogin,
    error: loginError,
    isError: isLoginError,
    isSuccess: isLoginSuccess,
    isPending: PendingLogin,
  } = useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      const userInfo = jwtDecode<CustomJwtPayload>(data.result);
      const userRole = userInfo.Role.toLowerCase();
      const userId = userInfo.UserId.toLowerCase();
      const userName = userInfo.name;
      const token = data.result;

      try {
        await AsyncStorage.setItem("Auth", "true");
        await AsyncStorage.setItem("name", userName);
        await AsyncStorage.setItem("role", userRole);
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("userId", userId);

        Alert.alert("Success", "Login successful!");

        // Đóng modal sau khi đăng nhập thành công
        onClose();
      } catch (e) {
        Alert.alert("Error", "Failed to save user data.");
        console.error("Failed to save user data:", e);
      }
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
    const { userName, password } = formData;
    if (!userName || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    try {
      mutateLogin({
        user: {
          userName: userName,
          password: password,
        },
      });
   
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    }
  };

  const handleRegister = async () => {
    const { userName, password, confirmPassword, email, firstName, lastName } =
      formData;
    if (
      !userName ||
      !password ||
      !confirmPassword ||
      !email ||
      !firstName ||
      !lastName
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    try {
      mutateRegister({
        user: {
          userName: userName,
          email: email,
          firstName: firstName,
          lastName: lastName,
          password: password,
          confirmPassword: confirmPassword,
          role: 0,
        },
      });
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.container}>
        <View style={styles.modal}>
          <Text style={styles.title}>{isLogin ? "Login" : "Register"}</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={formData.userName}
            onChangeText={(text) => handleInputChange("userName", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={formData.password}
            onChangeText={(text) => handleInputChange("password", text)}
          />
          {!isLogin && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry
                value={formData.confirmPassword}
                onChangeText={(text) =>
                  handleInputChange("confirmPassword", text)
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={formData.email}
                onChangeText={(text) => handleInputChange("email", text)}
              />
              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={formData.firstName}
                onChangeText={(text) => handleInputChange("firstName", text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={formData.lastName}
                onChangeText={(text) => handleInputChange("lastName", text)}
              />
            </>
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={isLogin ? handleLogin : handleRegister}
          >
            <Text style={styles.buttonText}>
          
              {isLogin
                ? PendingLogin
                  ? "Wait a seconds"
                  : "Login"
                : RegisterPending
                ? "Wait a seconds"
                : "Register"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.switchText}>
              {isLogin
                ? "Don't have an account? Register"
                : "Already have an account? Login"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
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

export default AuthModal;
