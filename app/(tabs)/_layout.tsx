import { Tabs } from "expo-router";
import React, { useState } from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/constants";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Provider } from "@/MyContext";
import { MaterialIcons } from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Provider>
      <Tabs
        initialRouteName="index"
        screenOptions={{
          tabBarActiveTintColor: Colors.accentColor,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: {
            paddingTop: 10,
            borderTopWidth: 0,
            backgroundColor: Colors.GreyColor,
            ...Platform.select({
              ios: {
                // Use a transparent background on iOS to show the blur effect
                position: "absolute",
              },
              default: {},
            }),
          },
        }}
      >
        <Tabs.Screen
          name="repetition/repetition"
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ color, focused }) => (
              <MaterialIcons
                name="repeat"
                size={34}
                color={focused ? Colors.accentColor : Colors.GreyWhiteColor}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="index"
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ color, focused }) => (
              <MaterialIcons
                name="home"
                size={34}
                color={focused ? Colors.accentColor : Colors.GreyWhiteColor}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="wordList"
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ color, focused }) => (
              <MaterialIcons
                name="storage"
                size={34}
                color={focused ? Colors.accentColor : Colors.GreyWhiteColor}
              />
            ),
          }}
        />

        <Tabs.Screen name="repetition/cards" options={{ href: null }} />
        <Tabs.Screen name="repetition/writeText" options={{ href: null }} />
      </Tabs>
    </Provider>
  );
}
