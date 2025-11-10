// app/_layout.tsx
import { AuthProvider } from "@/context/AuthContext";
import { navigationRef } from "@/utils/navigation";
import { Slot, useNavigationContainerRef } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const ref = useNavigationContainerRef();

  useEffect(() => {
    Object.assign(navigationRef, ref);
  }, [ref]);

  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}