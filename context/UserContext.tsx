// context/UserContext.tsx
import { getUser } from "@/utils/storage";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const stored = await getUser();
      if (stored) setUser(stored);
    };
    load();
  }, []);

  if (children == null) return null; // <-- seguridad extra

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
