import React from "react";
import { Text, View } from "react-native";

interface NotificationItemProps {
  type: "water" | "light" | "harvest" | "sensor" | "environment";
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ type }) => {
  const getLabel = () => {
    switch (type) {
      case "water":
        return "Needs Watering";
      case "light":
        return "Light Level Alert";
      case "harvest":
        return "Ready for Harvest";
      case "sensor":
        return "Sensor Notification";
      case "environment":
        return "Environment Alert";
      default:
        return "Unknown Notification";
    }
  };

  return (
    <View className="p-3 bg-gray-100 rounded-xl mb-2">
      <Text className="text-black text-base font-semibold">{getLabel()}</Text>
    </View>
  );
};
