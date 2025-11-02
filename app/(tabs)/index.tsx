import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View, Alert } from "react-native";
import { useAuth } from "@/contexts/AuthContext";

const LOCAL_IP = process.env.EXPO_PUBLIC_LOCAL_IP_ADDRESS;
const PORT = process.env.EXPO_PUBLIC_PORT;

export default function NurturaWelcome() {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!user?.email) return;
      try {
        const response = await fetch(`http://${LOCAL_IP}:${PORT}/users/fetch-userinfo`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email }),
        });

        const data = await response.json();
        if (response.ok && data.userInfo) {
          setUserInfo(data.userInfo);
        } else {
          console.log("No DB user info found, using Firebase/Google data");
          setUserInfo({
            username: user.username || "—",
            first_name: user.firstName || "—",
            last_name: user.lastName || "—",
            email: user.email,
            birthday: user.birthday || null,
          });
        }
      } catch (err: any) {
        console.error("Fetch user info failed:", err);
        Alert.alert("Error", "Unable to fetch profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  const fullName = `${userInfo?.first_name || "—"} ${userInfo?.last_name || ""}`;
  const age = userInfo?.birthday
    ? Math.floor((new Date().getTime() - new Date(userInfo.birthday).getTime()) / (1000 * 60 * 60 * 24 * 365))
    : "—";

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Welcome,</Text>
          <Text style={styles.username}>{fullName}</Text>
        </View>

        <Image
          source={require("@/assets/images/google.png")}
          style={styles.avatarPlaceholder}
          resizeMode="cover"
        />
      </View>

      <View style={styles.centerSection}>
        <Image
          source={require("@/assets/images/nurturaRack.png")}
          style={styles.plantImage}
          resizeMode="contain"
        />

        <View style={styles.messageContainer}>
          <Text style={styles.boldText}>
            <Text style={styles.placeholder}>{userInfo?.username || "—"}</Text>, doesn't have a Nurtura Rack
          </Text>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.infoBlock}>
          <Text style={styles.boldText}>
            Are you really <Text style={styles.placeholder}>{age}</Text> years old?
          </Text>
          <Text style={styles.subText}>
            Check if <Text style={styles.placeholder}>{userInfo?.formattedBirthday || "—"}</Text> is your
            real birthday.
          </Text>
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.boldText}>Is this really yours?</Text>
          <Text style={styles.subText}>
            Is <Text style={styles.placeholder}>{userInfo?.email || "—"}</Text> your email?
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 30,
    justifyContent: "space-between",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },

  welcome: {
    fontSize: 32,
    color: "#333",
    fontWeight: "600",
  },

  username: {
    fontSize: 30,
    color: "#000",
    fontWeight: "800",
    marginTop: 2,
    maxWidth: 220,
  },

  centerSection: {
    alignItems: "flex-start",
  },

   avatarPlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: "#e5e5e5",
    borderRadius: 50,
  },

  plantImage: {
    width: 150,
    height: 150,
    backgroundColor: "transparent",
    marginBottom: 16,
  },

  messageContainer: {
    width: "85%",
  },

  boldText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 6,
  },

  subText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },

  highlight: {
    color: "#7a934d",
    fontWeight: "700",
  },

  placeholder: {
    color: "#7a934d",
  },

  bottomSection: {
    alignItems: "flex-start",
  },

  infoBlock: {
    marginBottom: 26,
  },
});
