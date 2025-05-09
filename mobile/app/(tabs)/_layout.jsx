import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import COLORS from "../../constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text } from "react-native";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: "#888",
        tabBarStyle: {
          backgroundColor: "#F5F7FA",
          borderTopWidth: 0,
          borderWidth: 0,
          paddingTop: 5,
          paddingBottom: insets.bottom + 10,
          height: 70 + insets.bottom,
          elevation: 0,
          shadowColor: "transparent",
          shadowOpacity: 0,
          shadowOffset: { height: 0, width: 0 },
        },
        tabBarBackground: () => (
          <View
            style={{
              backgroundColor: COLORS.cardBackground,
              height: "100%",
              borderTopWidth: 0, // Ensure no border
            }}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
          tabBarLabel: ({ focused, color }) => (
            <View style={{ alignItems: "center" }}>
              <Text style={{ color, fontSize: 12, marginTop: 4 }}>Home</Text>
              {focused && (
                <View
                  style={{
                    height: 4,
                    width: 40,
                    backgroundColor: COLORS.primary,
                    marginTop: 4,
                    borderRadius: 2,
                  }}
                />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
          tabBarLabel: ({ focused, color }) => (
            <View style={{ alignItems: "center" }}>
              <Text style={{ color, fontSize: 12, marginTop: 4 }}>Create</Text>
              {focused && (
                <View
                  style={{
                    height: 4,
                    width: 40,
                    backgroundColor: COLORS.primary,
                    marginTop: 4,
                    borderRadius: 2,
                  }}
                />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
          tabBarLabel: ({ focused, color }) => (
            <View style={{ alignItems: "center" }}>
              <Text style={{ color, fontSize: 12, marginTop: 4 }}>Profile</Text>
              {focused && (
                <View
                  style={{
                    height: 4,
                    width: 40,
                    backgroundColor: COLORS.primary,
                    marginTop: 4,
                    borderRadius: 2,
                  }}
                />
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
