import { UserProvider } from "@/context/UserContext"; // 👈 importa el provider
import { navigationRef } from "@/utils/navigation";
import { Slot, useNavigationContainerRef } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const ref = useNavigationContainerRef();

  useEffect(() => {
    Object.assign(navigationRef, ref);
  }, [ref]);

  return (
    <UserProvider>
      <Slot />
    </UserProvider>
  );
}
