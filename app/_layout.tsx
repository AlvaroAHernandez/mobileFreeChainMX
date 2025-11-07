import { navigationRef } from "@/utils/navigation";
import { Slot, useNavigationContainerRef } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const ref = useNavigationContainerRef();

  // sincronizamos con nuestra ref global
  useEffect(() => {
    Object.assign(navigationRef, ref);
  }, [ref]);

  return <Slot />;
}
