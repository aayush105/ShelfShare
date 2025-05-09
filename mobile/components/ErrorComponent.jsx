import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../assets/styles/home.styles";

const ErrorComponent = ({ message, onRetry }) => {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{message}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ErrorComponent;
