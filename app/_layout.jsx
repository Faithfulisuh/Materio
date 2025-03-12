import React, { useState } from "react";
import "../global.css";
import { ActivityIndicator, Text, View } from "react-native";
import { SplashScreen, Stack } from "expo-router";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import { useFonts } from "expo-font";
import { Suspense, useEffect } from "react";
import { SQLiteProvider } from "expo-sqlite";
import { initializeTables } from "../utility/sqlite";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const RootLayout = () => {
  const [dbLoaded, setDbLoaded] = useState(false);
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  const loadDatabase = async () => {
    const dbName = "materio.db";
    const dbAsset = require("../assets/materio.db");
    const dbUri = Asset.fromModule(dbAsset).uri;
    const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;
    const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
    if (!fileInfo.exists) {
      await FileSystem.makeDirectoryAsync(
        `${FileSystem.documentDirectory}SQLite`,
        { intermediates: true }
      );
      await FileSystem.downloadAsync(dbUri, dbFilePath);
    }
  };

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) SplashScreen.hideAsync();
    loadDatabase()
      .then(() => initializeTables())
      .then(() => setDbLoaded(true))
      .catch((e) => console.error(e));
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) return null;

  return (
    <GestureHandlerRootView>
      <Suspense
        fallback={
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size={"large"} />
            <Text>Loading Database...</Text>
          </View>
        }
      >
        <SQLiteProvider databaseName="materio.db" useSuspense>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="search/[query]" />
          </Stack>
        </SQLiteProvider>
      </Suspense>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
