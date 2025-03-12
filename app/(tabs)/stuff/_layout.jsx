import { Stack } from "expo-router";

export default function Homestack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
      <Stack.Screen name="categories" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="othersections" />
    </Stack>
  );
}
