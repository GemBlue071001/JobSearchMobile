import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { Link, useNavigation } from "expo-router"; // Sử dụng Expo Router để điều hướng
import Icon from "react-native-vector-icons/MaterialIcons";
import { companyData } from "../mock/CompanyData";
import { jobData } from "../mock/JobData";
import { Link } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

interface CardEmployerProps {
  data: Company;
  navigation:any
}

export default function CompanyCard({ data ,navigation}: CardEmployerProps) {
  const [follow, setFollow] = useState<boolean>(false);
//   const navigation = useNavigation();
  // const navigate =useNavigation()

  // const handleNavigate =()=>{
  //   navigate('/modal',stat)
  // }
  // Kiểm tra dữ liệu đầu vào, trả về null nếu dữ liệu thiếu
  if (!data || !data.image || !data.name || !data.overview || !data.jobs) {
    return null; // Không hiển thị nếu dữ liệu không đầy đủ
  }

  return (
    <View style={styles.main}>
      {/* Điều hướng sử dụng Link từ expo-router */}
 
        <View>
          <Image
            source={{
              uri: data.image,
            }}
            style={styles.logo}
         
          />
        </View>


      <View style={styles.main2}>
        <View style={styles.header}>
          <View style={styles.img}>
            <Image
              source={{
                uri: data.image,
              }}
              style={styles.logo1}
              resizeMode="contain"
            />
          </View>
          <View style={styles.main3}>
            {/* <Link
              to={{
                pathname: "/CompanyDetail",
                params: { id: data?.id, companyDetail: JSON.stringify(data) },
              }}
            > */}
            <TouchableOpacity onPress={() => navigation.navigate("CompanyDetail", { id: data?.id, companyDetail: JSON.stringify(data) })}>
       
                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={styles.textStyle}
                >
                  {data.name}
                </Text>
              </TouchableOpacity>
            {/* </Link> */}
          </View>
        </View>

        {/* Mô tả công ty */}
        <Text style={styles.text} numberOfLines={2} ellipsizeMode="tail">
          {data.overview.description}
        </Text>

        {/* Hiển thị số lượng công việc */}
        <View style={styles.job}>
          <Icon
            name="work"
            size={30}
            color="#808080"
            style={{ marginTop: 5 }}
          />
          <Text style={styles.text} numberOfLines={2} ellipsizeMode="tail">
            {data.jobs.length} Jobs
          </Text>
        </View>

        {/* Hiển thị danh sách kỹ năng và nút bookmark */}
        <View style={styles.skill}>
          <View style={styles.skillList}>
            {data.jobs.map((job, jobIndex) =>
              job.tags?.map((tag, tagIndex) => (
                <TouchableOpacity
                  key={`${jobIndex}-${tagIndex}`}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>{tag}</Text>
                </TouchableOpacity>
              ))
            )}
          </View>
          <View>
            {/* Nút follow/unfollow */}
            <TouchableOpacity onPress={() => setFollow(!follow)}>
              <Icon
                name={follow ? "bookmark" : "bookmark-border"}
                size={30}
                color="#808080"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    display: "flex",
    flexDirection: "column",
    borderWidth: 1,
    borderColor: "#dedede",
    width: "100%", // Đặt width 100% để tránh việc nội dung tràn ra ngoài
  },
  logo: {
    height: 200,
    width: "100%", // Đảm bảo hình ảnh chiếm hết chiều rộng
  },
  main2: {
    paddingRight: 50,
    paddingLeft: 15,
    backgroundColor: "#fff",
    flexGrow: 1,
    paddingVertical: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1, // Co lại nếu vượt quá kích thước của container
  },
  img: {
    padding: 14,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "#dedede",
    backgroundColor: "white",
  },
  logo1: {
    height: 80,
    width: 80,
  },
  main3: {
    marginTop: 12,
    marginLeft: 8,
    flexShrink: 1, // Đảm bảo không vượt quá container
  },
  textStyle: {
    color: "#FF4500",
    lineHeight: 30,
    fontSize: 18,
    fontWeight: "600",
    flexShrink: 1, // Co lại nếu cần thiết
  },
  text: {
    fontSize: 16,
    lineHeight: 25,
    marginTop: 5,
    marginBottom: 5,
    flexShrink: 1, // Co lại khi nội dung quá dài
  },
  job: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    gap: 10,
  },
  skill: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skillList: {
    flexDirection: "row",
    flexWrap: "wrap",
    // Đảm bảo các phần tử tự động xuống dòng nếu không đủ không gian
  },
  button: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#dedede",
    marginRight: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: "#6c6c6c",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
});
