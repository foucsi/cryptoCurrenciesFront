import { View, Text, StyleSheet } from "react-native";
import React from "react";

export default function SignScreen() {
  return (
    <View style={styles.container}>
      <Text>SignScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
