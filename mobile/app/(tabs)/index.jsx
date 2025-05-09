import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Animated,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import COLORS from "../../constants/colors";
import styles from "../../assets/styles/home.styles";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/authStore";
import { API_URL } from "../../constants/api";
import { Image } from "expo-image";
import { formatPublishDate } from "../../lib/utils";
import Loader from "../../components/Loader";
import ErrorComponent from "../../components/ErrorComponent";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Home() {
  const { token } = useAuthStore();
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  // Animation-related state
  const scrollY = useRef(new Animated.Value(0)).current;
  const genreSectionRef = useRef(null);
  const [genreSectionOffset, setGenreSectionOffset] = useState(0);
  const stickyHeaderOpacity = useRef(new Animated.Value(0)).current;

  const fetchInitialData = async (isInitial = true) => {
    if (!token) {
      if (isInitial) setInitialLoading(false);
      return;
    }

    if (isInitial) setInitialLoading(true);
    setError(null);

    try {
      const genresResponse = await fetch(`${API_URL}/books/active-genres`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const genresData = await genresResponse.json();
      if (!genresResponse.ok) {
        throw new Error(genresData.message || "Failed to fetch active genres");
      }
      setGenres(["All", ...genresData]);

      const booksResponse = await fetch(`${API_URL}/books?page=1&limit=2`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const booksData = await booksResponse.json();
      if (!booksResponse.ok) {
        throw new Error(booksData.message || "Failed to fetch books");
      }

      setBooks(booksData.books);
      setHasMore(1 < booksData.totalPages);
      setPage(2);
    } catch (error) {
      console.error("Error fetching initial data:", error);
      setError(error.message || "Something went wrong while fetching data");
    } finally {
      if (isInitial) setInitialLoading(false);
    }
  };

  // Fetch genres and initial books on mount
  useEffect(() => {
    fetchInitialData(true);
  }, [token]);

  // Measure genre section position after layout
  useEffect(() => {
    if (genreSectionRef.current) {
      genreSectionRef.current.measure((x, y, width, height, pageX, pageY) => {
        setGenreSectionOffset(pageY);
      });
    }
  }, [initialLoading]);

  // Animate sticky header based on scroll position
  useEffect(() => {
    const listener = scrollY.addListener(({ value }) => {
      if (value > genreSectionOffset) {
        Animated.timing(stickyHeaderOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(stickyHeaderOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    });

    return () => scrollY.removeListener(listener);
  }, [scrollY, genreSectionOffset]);

  const fetchBooks = async (pageNum = 1, refresh = false) => {
    if (loading || (!hasMore && !refresh)) return;

    if (refresh) setRefreshing(true);
    else if (pageNum !== 1) setLoading(true);
    setError(null);

    try {
      const url =
        selectedGenre === "All"
          ? `${API_URL}/books?page=${pageNum}&limit=2`
          : `${API_URL}/books/genre/${selectedGenre}?page=${pageNum}&limit=2`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch books");
      }

      const uniqueBooks =
        refresh || pageNum === 1
          ? data.books
          : Array.from(
              new Set([...books, ...data.books].map((book) => book._id))
            ).map((id) =>
              [...books, ...data.books].find((book) => book._id === id)
            );

      setBooks(uniqueBooks);
      setHasMore(pageNum < data.totalPages);
      setPage(pageNum + 1);
    } catch (error) {
      console.error("Error fetching books:", error);
      setError(error.message || "Something went wrong while fetching books");
    } finally {
      if (refresh) {
        await sleep(400);
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!initialLoading) {
      fetchBooks(1, true);
    }
  }, [selectedGenre]);

  const handleLoadMore = async () => {
    if (!loading && !initialLoading && hasMore && !refreshing) {
      await fetchBooks(page);
    }
  };

  const handleInitialRetry = () => {
    setError(null);
    setInitialLoading(true);
    fetchInitialData(true);
  };

  const handleBooksRetry = () => {
    fetchBooks(1, true);
  };

  if (initialLoading) {
    return <Loader />;
  }

  if (error && !books.length && !genres.length) {
    return <ErrorComponent message={error} onRetry={handleInitialRetry} />;
  }

  const renderItem = ({ item }) => (
    <View style={styles.bookCard}>
      <View style={styles.bookHeader}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: item.user.profileImage }}
            style={styles.avatar}
          />
          <Text style={styles.username}>{item.user.username}</Text>
        </View>
      </View>
      <View style={styles.bookImageContainer}>
        <Image
          source={item.image}
          style={styles.bookImage}
          contentFit="cover"
        />
      </View>
      <View style={styles.bookDetails}>
        <View style={styles.titleContainer}>
          <Text style={styles.bookTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.genreTag}>
            <Text style={styles.genreTagText}>{item.genre}</Text>
          </View>
        </View>
        <View style={styles.ratingContainer}>
          {renderRatingStars(item.rating)}
        </View>
        <Text style={styles.caption} numberOfLines={2}>
          {item.caption}
        </Text>
        <Text style={styles.date}>
          Shared on {formatPublishDate(item.createdAt)}
        </Text>
      </View>
    </View>
  );

  const renderGenre = ({ item }) => (
    <View style={styles.genreBadgeContainer}>
      <View
        style={[
          styles.genreBadge,
          selectedGenre === item && styles.genreBadgeSelected,
        ]}
        onStartShouldSetResponder={() => true}
        onResponderRelease={() => setSelectedGenre(item)}
      >
        <Text
          style={[
            styles.genreBadgeText,
            selectedGenre === item && styles.genreBadgeTextSelected,
          ]}
        >
          {item}
        </Text>
      </View>
    </View>
  );

  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={16}
          color={i <= rating ? "#f4b400" : COLORS.textSecondary}
          style={{ marginRight: 2 }}
        />
      );
    }
    return <View style={styles.ratingContainer}>{stars}</View>;
  };

  // render sticky header
  const renderStickyHeader = () => (
    <Animated.View
      style={[
        styles.stickyHeader,
        {
          opacity: stickyHeaderOpacity,
          transform: [
            {
              translateY: stickyHeaderOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.stickyHeaderContent}>
        <Image
          source={require("../../assets/images/shelfshare-logo.png")}
          style={styles.stickyLogo}
        />
        <FlatList
          data={genres}
          renderItem={renderGenre}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.genreScrollContent}
        />
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {renderStickyHeader()}
      <AnimatedFlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true); // Manually set refreshing state
              await fetchBooks(1, true); // Fetch books first
              // Only fetch genres if needed (e.g., if they might have changed)
              await fetchInitialData(false); // Pass false to avoid initialLoading
              setRefreshing(false); // Reset refreshing state
            }}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>ShelfShare 📚</Text>
              <Text style={styles.headerSubtitle}>
                Discover great reads from the community👇
              </Text>
            </View>
            {(books.length > 0 || genres.length > 1) && (
              <View
                ref={genreSectionRef}
                onLayout={() => {
                  genreSectionRef.current.measure(
                    (x, y, width, height, pageX, pageY) => {
                      setGenreSectionOffset(pageY);
                    }
                  );
                }}
              >
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.genreScrollContent}
                  style={styles.genreScroll}
                >
                  <FlatList
                    data={genres}
                    renderItem={renderGenre}
                    keyExtractor={(item) => item}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                  />
                </ScrollView>
              </View>
            )}
            {error && (
              <ErrorComponent message={error} onRetry={handleBooksRetry} />
            )}
          </>
        }
        ListFooterComponent={
          hasMore && books.length > 0 && !refreshing ? (
            <ActivityIndicator
              style={styles.footerLoader}
              size="small"
              color={COLORS.primary}
            />
          ) : null
        }
        ListEmptyComponent={
          !error && (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="book-outline"
                size={60}
                color={COLORS.textSecondary}
              />
              <Text style={styles.emptyText}>
                {selectedGenre === "All"
                  ? "No recommendations yet"
                  : `No books found in ${selectedGenre}`}
              </Text>
              <Text style={styles.emptySubtitle}>
                {selectedGenre === "All"
                  ? "Be the first to share your favorite book!"
                  : "Share a book in this genre to get started!"}
              </Text>
            </View>
          )
        }
      />
    </View>
  );
}
