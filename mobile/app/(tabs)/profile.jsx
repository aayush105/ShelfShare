import {
  View,
  Alert,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useRouter } from "expo-router";
import { API_URL } from "../../constants/api";
import styles from "../../assets/styles/profile.styles";
import ProfileHeader from "../../components/ProfileHeader";
import LogoutButton from "../../components/LogoutButton";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { Image } from "expo-image";
import { sleep } from ".";
import Loader from "../../components/Loader";

export default function Profile() {
  const { user, token } = useAuthStore();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [deleteBookId, setDeleteBookId] = useState(null);

  const router = useRouter();

  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/books/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch data");
      }

      setBooks(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to load profile data. Pull down to refresh."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteBook = async (bookId) => {
    try {
      setDeleteBookId(bookId);
      const response = await fetch(`${API_URL}/books/${bookId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete book");
      }

      setBooks(books.filter((book) => book._id !== bookId));

      Alert.alert("Success", "Recommendation deleted successfully.");
    } catch (error) {
      console.error("Error deleting book:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to delete the book. Please try again."
      );
    } finally {
      setDeleteBookId(null);
    }
  };

  const confirmDelete = (bookId) => {
    Alert.alert(
      "Delete Recommendation",
      "Are you sure you want to delete this recommendation?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => handleDeleteBook(bookId),
        },
      ]
    );
  };

  const renderBookItem = ({ item }) => (
    <View style={styles.bookItem}>
      <Image source={item.image} style={styles.bookImage} />
      <View style={styles.bookInfo}>
        <View style={styles.titleContainer}>
          <Text style={styles.bookTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.genreTag}>
            <Text style={styles.genreTagText}>{item.genre}</Text>
          </View>
        </View>
        {/* <Text style={styles.bookTitle}>{item.title}</Text> */}
        <View style={styles.ratingContainer}>
          {renderRatingStars(item.rating)}
        </View>
        <Text style={styles.bookCaption}>{item.caption}</Text>
        <Text style={styles.bookDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => confirmDelete(item._id)}
      >
        {deleteBookId === item._id ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
        )}
      </TouchableOpacity>
    </View>
  );

  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={14}
          color={i <= rating ? "#f4b400" : COLORS.textSecondary}
          style={{ marginRight: 2 }}
        />
      );
    }

    return stars;
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await sleep(500); // Simulate a delay for the refresh
    await fetchData();
    setRefreshing(false);
  };

  if (loading && !refreshing) return <Loader />;

  return (
    <View style={styles.container}>
      <ProfileHeader />
      <LogoutButton />

      {/* your recommendations */}
      <View style={styles.booksHeader}>
        <Text style={styles.booksTitle}>Your Recommendations 📚</Text>
        <Text style={styles.booksCount}>{books.length} books</Text>
      </View>

      {/* own books */}
      <FlatList
        data={books}
        renderItem={renderBookItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.booksList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="book-outline"
              size={50}
              color={COLORS.textSecondary}
            />
            <Text style={styles.emptyText}>No recommendations yet.</Text>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/create")}
            >
              <Text style={styles.addButtonText}>Add Your First Book</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}
