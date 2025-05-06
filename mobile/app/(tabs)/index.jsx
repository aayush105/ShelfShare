import { View, Text, TextInput } from "react-native";
import React from "react";
import COLORS from "../../constants/colors";
import styles from "../../assets/styles/create.styles";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
  return (
    <View>
      {/* book title */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Book Title</Text>
        <View style={styles.inputContainer}>
          <Ionicons
            name="book-outline"
            size={20}
            color={COLORS.textSecondary}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter book title"
            placeholderTextColor={COLORS.placeholderText}
          />
        </View>
      </View>
    </View>
  );
}
