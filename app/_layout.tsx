import { Stack } from "expo-router";

export const unstable_settings = {
  headerShown: false,
};

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
