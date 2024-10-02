import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Skills() {
  const [skillName, setSkillName] = useState<string>("");
  const [shorthand, setShorthand] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleSave = () => {
    if (!skillName || !shorthand || !description) {
      alert("Please fill in all required fields.");
      return;
    }

    // Logic to handle save or form submission
    console.log("Skill saved:", { skillName, shorthand, description });
  };

  return (
    <>
      <View style={styles.main}>
        <View style={styles.main1}>
          <View style={styles.namecompany}>
            <Text style={styles.text}>
              Skills Name <Text style={styles.require}> (*)</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={skillName}
              onChangeText={setSkillName}
            />
          </View>

          <View style={styles.position}>
            <Text style={styles.text}>
              Shorthand <Text style={styles.require}> (*)</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={shorthand}
              onChangeText={setShorthand}
            />
          </View>

          <View style={styles.position}>
            <Text style={styles.text}>
              Description <Text style={styles.require}> (*)</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
            />
          </View>
        </View>
      </View>
      <View style={styles.save}>
        <TouchableOpacity style={styles.buttonsave} onPress={handleSave}>
          <Text style={styles.textsave}>Save</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  main: {
    paddingVertical: 10,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
  },
  main1: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 10,
    backgroundColor: "white",
    width: "100%",
  },
  namecompany: {
    flexDirection: "column",
    gap: 5,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
  },
  text: {
    fontSize: 15,
    lineHeight: 22.5,
    fontWeight: "600",
  },
  require: {
    color: "red",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  position: {
    flexDirection: "column",
    gap: 5,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
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
