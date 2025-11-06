import api from "@/services/api";
import { clearAuthData, getToken, getUser, saveAuthData } from "@/utils/storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      const [storedUser, token] = await Promise.all([getUser(), getToken()]);
      if (storedUser && token) {
        setUser(storedUser);
      } else {
        await clearAuthData();
        setUser(null);
      }
    } catch (err) {
      await clearAuthData();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/users/login", { email, password });
      const { user } = response.data.data;
      await saveAuthData(user.token, user);
      setUser(user);
      router.replace("/(drawer)");
    } catch (error: any) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      const token = await getToken();
      if (token) {
        await api.post("/users/logout", {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      await clearAuthData();
      setUser(null);
      router.replace("/screens/auth/login");
    } catch (err) {
      await clearAuthData();
      setUser(null);
      router.replace("/screens/auth/login");
    }
  };

  return { user, login, logout, loading, checkAuth };
};
