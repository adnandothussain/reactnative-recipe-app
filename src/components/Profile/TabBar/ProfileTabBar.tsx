import * as React from "react";
import { View, StyleSheet } from "react-native";
import ProfileTabItem from "src/components/Profile/TabBar/ProfileTabItem";

interface ProfileTabBarProps {
  index?: number;
  routes: { title: string; key: string }[];
  // eslint-disable-next-line no-unused-vars
  onPress: (key: string) => void;
}

const ProfileTabBar: React.FC<ProfileTabBarProps> = ({
  index,
  routes,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      {routes.map((route, routeIndex) => (
        <ProfileTabItem
          key={`__tabItem__${index}__${route.key}__`}
          title={route.title}
          active={index === routeIndex}
          routeKey={route.key}
          onPress={onPress}
        />
      ))}
    </View>
  );
};

export default ProfileTabBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 10,
    justifyContent: "center",
  },
});
