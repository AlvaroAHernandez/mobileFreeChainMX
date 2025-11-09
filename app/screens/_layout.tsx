import { Stack } from "expo-router";

export const unstable_settings = {
  // Esto le dice a Expo Router que las rutas dentro de /screens son reales
  // y se pueden acceder directamente (como /screens/club/create)
  initialRouteName: "club",
};

export default function ScreensLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="club/index" />
      <Stack.Screen name="club/create" />
      <Stack.Screen name="riders/index" />
      <Stack.Screen name="event/index" />
      <Stack.Screen name="event/detail" />
      <Stack.Screen name="routes/index" />
    </Stack>
  );
}
