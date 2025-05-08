import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import styles from "../../assets/styles/create.styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { useAuthStore } from "../../store/authStore";

import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { API_URL } from "../../constants/api";

export default function Create() {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [rating, setRating] = useState(3);
  const [image, setImage] = useState(null); // to display the selected image in the form
  const [imageBase64, setImageBase64] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { token } = useAuthStore();

  // console.log("token", token); // log the token for debugging

  const pickImage = async () => {
    try {
      // request permission to access the camera roll
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
          Alert.alert(
            "Permission denied",
            "We need camera roll access to select an image."
          );
          return;
        }
      }

      // launch the image library to select an image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5, // lower quality for faster upload and smaller base64 representation
        base64: true, // get the image as base64 string
      });

      if (!result.canceled) {
        // console.log("result", result); // log the result for debugging
        setImage(result.assets[0].uri); // set the image URI to display in the form

        // console.log("base64", result.assets[0].base64); // log the base64 string for debugging

        // if base64 is provided then use it
        if (result.assets[0].base64) {
          setImageBase64(result.assets[0].base64); // set the base64 string to upload to the server
        } else {
          // otherwise, convert it to base64
          const base64 = await FileSystem.readAsStringAsync(
            result.assets[0].uri,
            {
              encoding: FileSystem.EncodingType.Base64,
            }
          );
          setImageBase64(base64); // set the base64 string to upload to the server
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const handleSubmit = async () => {
    if (!title || !caption || !imageBase64 || !rating) {
      Alert.alert("Error", "Please fill in all fields and select an image.");
      return;
    }

    try {
      setLoading(true); // show loading indicator

      // get the file extension from the image URI
      const uriParts = image.split(".");
      const fileType = uriParts[uriParts.length - 1];
      const imageType = fileType
        ? `image/${fileType.toLowerCase()}`
        : "image/jpeg"; // default to jpeg if file type is not found

      const imageDataUrl = `data:${imageType};base64,${imageBase64}`; // create the data URL for the image

      // console.log(
      //   "Submitting form with data:",
      //   title,
      //   caption,
      //   rating,
      //   imageDataUrl
      // ); // log the form data for debugging

      const response = await fetch(`${API_URL}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          caption,
          rating: rating.toString(),
          image: imageDataUrl,
        }),
      });

      // console.log("response", response); // log the response for debugging

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit form");
      }

      Alert.alert("Success", "Book recommendation submitted successfully!");

      setTitle(""); // clear the title input
      setCaption(""); // clear the caption input
      setRating(3); // reset the rating to default
      setImage(null); // clear the image preview
      setImageBase64(null); // clear the base64 string
      router.push("/"); // navigate to the home screen
    } catch (error) {
      console.error("Error submitting form:", error);
      Alert.alert("Error", "Failed to submit form. Please try again.");
    } finally {
      setLoading(false); // hide loading indicator
    }
  };

  // const handleSubmit = async () => {
  //   if (!title || !caption || !imageBase64 || !rating) {
  //     Alert.alert("Error", "Please fill in all fields and select an image.");
  //     return;
  //   }

  //   try {
  //     setLoading(true); // show loading indicator

  //     // Create a FormData object
  //     const formData = new FormData();
  //     formData.append("title", title);
  //     formData.append("caption", caption);
  //     formData.append("rating", rating.toString());

  //     // Append the image file
  //     const uriParts = image.split(".");
  //     const fileType = uriParts[uriParts.length - 1];
  //     const fileName = `image.${fileType}`; // Generate a unique filename if needed
  //     formData.append("image", {
  //       uri: image, // Use the image URI from the file system
  //       name: fileName,
  //       type: `image/${fileType.toLowerCase() || "jpeg"}`, // Default to jpeg if not found
  //     });

  //     const response = await fetch(`${API_URL}/books`, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         // Content-Type is set automatically for multipart/form-data
  //       },
  //       body: formData,
  //     });

  //     console.log("response", response); // log the response for debugging

  //     const data = await response.json();

  //     if (!response.ok) {
  //       throw new Error(data.message || "Failed to submit form");
  //     }

  //     Alert.alert("Success", "Book recommendation submitted successfully!");

  //     setTitle(""); // clear the title input
  //     setCaption(""); // clear the caption input
  //     setRating(3); // reset the rating to default
  //     setImage(null); // clear the image preview
  //     setImageBase64(null); // clear the base64 string
  //     router.push("/"); // navigate to the home screen
  //   } catch (error) {
  //     console.error("Error submitting form:", error);
  //     Alert.alert("Error", "Failed to submit form. Please try again.");
  //   } finally {
  //     setLoading(false); // hide loading indicator
  //   }
  // };

  const renderRatingPicker = () => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => setRating(i)}
          style={styles.starButton}
        >
          <Ionicons
            name={i <= rating ? "star" : "star-outline"}
            size={32}
            color={i <= rating ? "#f4b400" : COLORS.textSecondary}
          />
        </TouchableOpacity>
      );
    }

    return <View style={styles.ratingContainer}>{stars}</View>;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        style={styles.scrollViewStyle}
      >
        <View style={styles.card}>
          {/* header */}
          <View style={styles.header}>
            <Text style={styles.title}>Add Book Recommendation</Text>
            <Text style={styles.subtitle}>
              Share your favorite reads with others
            </Text>
          </View>

          {/* form */}
          <View style={styles.form}>
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
                  value={title}
                  onChangeText={setTitle}
                />
              </View>
            </View>

            {/* rating */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Your Rating</Text>

              {renderRatingPicker()}
            </View>

            {/* image */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Image</Text>
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.previewImage} />
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Ionicons
                      name="image-outline"
                      size={40}
                      color={COLORS.textSecondary}
                    />
                    <Text style={styles.placeholderText}>
                      Tap to select image
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* caption */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Caption</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Write your review or thoughts about this book..."
                placeholderTextColor={COLORS.placeholderText}
                value={caption}
                onChangeText={setCaption}
                multiline
              />
            </View>

            {/* button */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Ionicons
                    name="cloud-upload-outline"
                    size={20}
                    color={COLORS.white}
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>Share</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
