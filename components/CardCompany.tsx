import React, { useState } from "react";
import { View, Image, TouchableOpacity, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const SkillSet = ["PHP", "Front End", "Java", "End", "Javascript"];

type InfoLineProps = {
  icon: string;
  text: string;
};

const InfoLine = ({ icon, text }: InfoLineProps) => (
  <View style={styles.line}>
    <Icon name={icon} size={20} color="#808080" />
    <Text style={styles.infoText}>{text}</Text>
  </View>
);

interface CardEmployerProps {
  data: Company;
  navigation: any;
}

export default function CardCompany({ data, navigation }: CardEmployerProps) {
  const [follow, setFollow] = useState<boolean>(false);
  return (
    <View style={styles.card}>
      <Image
        source={{
          uri: data.image,
        }}
        style={styles.image}
      />
      <View style={styles.main1}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("CompanyDetail", {
              id: data?.id,
              companyDetail: JSON.stringify(data),
            })
          }
        >
          <Text style={{ fontSize: 20, lineHeight: 30 }}>{data.name}</Text>
        </TouchableOpacity>

        {/* Skill List */}
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

        {/* Location */}
        <View style={styles.location}>
          <Icon name="location-on" size={20} color="#808080" />
          <Text style={styles.locationtext}>{data.location}</Text>
        </View>

        {/* Info Lines */}
        <View style={styles.line2}>
          <InfoLine icon="group" text="123" />
          <InfoLine icon="work" text={`${data?.jobs?.length} jobs`} />
        </View>

        {/* Job Tags */}
        <View style={styles.location}>
          <Icon name="folder" size={20} color="#808080" />
          <View style={styles.tagContainer}>
            {data?.jobs?.map((item, jobIndex) => (
              <React.Fragment key={jobIndex}>
                {item?.tags?.map((tag, tagIndex) => (
                  <Text style={styles.tagText} key={tagIndex}>
                    {tag},
                  </Text>
                ))}
              </React.Fragment>
            ))}
          </View>
        </View>
      </View>
      <View style={styles.icon}>
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
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 20,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#dedede",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    position: "relative",
    gap: 20,
  },
  image: {
    height: 48,
    width: 48,
    backgroundColor: "white",
  },
  main1: {
    flexDirection: "column",
    gap: 10,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexShrink: 1,
  },
  skillList: {
    flexDirection: "row",
    flexWrap: "wrap", // Ensures buttons wrap when necessary
    width: "100%", // Ensures the skill list respects the card's width
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
    maxWidth: "100%", // Ensures buttons don't overflow
  },
  buttonText: {
    color: "#6c6c6c",
    fontSize: 10,
    lineHeight:15,
    fontWeight: "500",
    textAlign: "center",
    flexShrink: 1, // Ensures text inside the button shrinks when necessary
  },
  location: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  locationtext: {
    fontSize: 15,
    lineHeight: 30,
  },
  line2: {
    flexDirection: "row",
    alignItems: "center",
    gap: 50,
  },
  line: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  infoText: {
    fontSize: 15,
    lineHeight: 20,
  },
  tagContainer: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 5,
  },
  tagText: {
    fontSize: 13,
    lineHeight: 20,
  },
  icon: {
    position: "absolute",
    right: 10,
    top: 8,
  },
});
