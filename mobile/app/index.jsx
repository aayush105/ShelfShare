import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>heello</Text>
      <Image />

      <Link href="/(auth)/signup">Sign up</Link>
      <Link href="/(auth)">Login</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "blue",
  },
});
