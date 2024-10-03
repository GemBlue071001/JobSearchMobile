// import { Link } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
interface props {
  data: Job;
  img: string | undefined;
  company: Company | undefined;
  navigation: any;
}

export default function CardJobs({ data, img, company, navigation }: props) {
  const jobDetailHref = `/job/${data.id}`;
  const [follow, setFollow] = useState<boolean>(false);
  return (
    <View style={styles.card}>
      <View style={styles.main}>
        <View style={styles.main1}>
          <View style={styles.main2}>
            <Image
              source={{
                uri: company ? company.image : img,
              }}
              style={styles.image}
            />
            <Text style={styles.text} numberOfLines={2} ellipsizeMode="tail">
              {company?.name}
            </Text>
          </View>
          <View style={{ paddingLeft: 20, marginLeft: "auto" }}>
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
        {/* <Link href={{pathname:"/JobDetail",params:{id:data?.id } }} asChild> */}

        <TouchableOpacity
          onPress={() => navigation.navigate("JobDetail", { id: data?.id })}
        >
          <Text style={styles.text1} numberOfLines={2} ellipsizeMode="tail">
            {data?.title}
          </Text>
        </TouchableOpacity>
        {/* </Link> */}
        <View style={styles.main3}>
          <View style={styles.location}>
            <Icon name="location-on" size={15} color="#808080" />
            <Text style={styles.locationtext}>{data?.location}</Text>
          </View>
          <View style={styles.tax}>
            <Icon name="attach-money" size={15} color="#808080" />
            <Text style={styles.taxtext}>{data?.salary}</Text>
          </View>
          <View style={styles.post}>
            <Icon name="access-time" size={15} color="#808080" />
            <Text style={styles.posttext}>{data?.postDate}</Text>
          </View>
        </View>
        <View style={styles.skillList}>
          {data?.tags.map((tag, index) => (
            <TouchableOpacity key={data?.id} style={styles.button}>
              <Text style={styles.buttonText}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 16,
    paddingTop: 8,
    backgroundColor: "#fff",
    flexDirection: "column",
    position: "relative",
    width:370,
    borderColor: "#FF4500",
    borderLeftWidth: 10,
    borderWidth: 1,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },

  main: {
    paddingLeft: 12,
    paddingRight: 12,
  },

  main1: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  main2: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  image: {
    height: 48,
    width: 48,
    backgroundColor: "white",
  },
  text: {
    fontSize: 16,
    lineHeight: 25,
    marginTop: 5,
    marginBottom: 5,
  },
  text1: {
    fontSize: 20,
    lineHeight: 30,
    fontWeight: "700",
    marginTop: 5,
    marginBottom: 5,
    color: "#FF4500",
  },
  main3: {
    flexDirection: "column",
    gap: 5,
    marginVertical: 5,
  },
  location: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  locationtext: {
    fontSize: 12,
    lineHeight: 18,
  },
  tax: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  taxtext: {
    color: "#0AB305",
    fontSize: 12,
    lineHeight: 18,
  },
  post: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  posttext: {
    // color: "#0AB305",
    fontSize: 12,
    lineHeight: 18,
  },
  skillList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  button: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 5,
    paddingHorizontal: 20,
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
