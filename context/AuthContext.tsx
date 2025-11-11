// context/AuthContext.tsx
import api from "@/services/api";
import {
  clearAuthData,
  getToken,
  getUser,
  saveAuthData,
} from "@/utils/storage";
import { useRouter, useSegments } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
  token: string;
  profile_photo_path?: string;
  full_profile_photo_url?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: any) => Promise<void>;
  updateUser: (userData: User) => void;
  refreshUser: () => Promise<void>;
  updateProfile: (
    data: FormData | any
  ) => Promise<{ success: boolean; data?: User; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  // 🔹 Verifica autenticación al iniciar
  const checkAuth = async () => {
    try {
      const [storedUser, token] = await Promise.all([getUser(), getToken()]);

      if (storedUser && token) {
        try {
          // 🔥 Usa la ruta correcta con el ID del usuario
          const response = await api.get(`/users/${storedUser.id}`);

          if (response.data.code === 200) {
            const freshUser = response.data.data.user || response.data.data;
            await saveAuthData(token, freshUser);
            setUser(freshUser);
          } else {
            throw new Error("Token inválido");
          }
        } catch (error: any) {
          if (error.response?.status === 401) {
            // Token realmente expirado
            await clearAuthData();
            setUser(null);
          } else {
            console.warn(
              "⚠️ Error no crítico en verificación del token:",
              error
            );
            // Mantener usuario si fue error de red
            setUser(storedUser);
          }
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("❌ Error en checkAuth:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Protección de rutas automática
  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "screens" && segments[1] === "auth";

    // Solo forzar login si no hay usuario ni token guardado
    const verifyAndRedirect = async () => {
      const token = await getToken();
      if (!user && !token && !inAuthGroup) {
        router.replace("/screens/auth/login");
      } else if (user && inAuthGroup) {
        router.replace("/(drawer)");
      }
    };

    verifyAndRedirect();
  }, [user, segments, loading]);

  useEffect(() => {
    checkAuth();
  }, []);

  // 🔹 Login
  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/users/login", { email, password });

      if (response.data.code === 200) {
        const { user: userData } = response.data.data;
        const token = userData.token;

        // 1️⃣ Guardar token para autorizar siguiente request
        await saveAuthData(token, userData);

        // 2️⃣ Obtener usuario completo con relaciones
        const fullUserRes = await api.get(`/users/${userData.id}`);
        if (fullUserRes.data.code === 200) {
          const freshUser = fullUserRes.data.data.user;

          // 3️⃣ Guardar el user completo
          await saveAuthData(token, freshUser);
          setUser(freshUser);
        } else {
          setUser(userData); // fallback si algo falla
        }

        router.replace("/(drawer)");
      } else {
        throw new Error(response.data.message || "Error al iniciar sesión");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error al iniciar sesión";
      throw new Error(errorMessage);
    }
  };

  // 🔹 Registro
  // Dentro de AuthContext.tsx
  const register = async (data: any) => {
    try {
      const response = await api.post("/users", data, {
        headers:
          data instanceof FormData
            ? { "Content-Type": "multipart/form-data" }
            : { "Content-Type": "application/json" },
      });

      if (response.data.code === 201) {
        // ✅ Registro exitoso → ahora hacer login automáticamente
        const email = data.get ? data.get("email") : data.email;
        const password = data.get ? data.get("password") : data.password;

        // 👇 Usa el mismo login ya definido arriba
        await login(email, password);

        return;
      } else {
        throw new Error(response.data.message || "Error al registrarse");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error al registrarse";
      throw new Error(errorMessage);
    }
  };

  // 🔹 Logout
  const logout = async () => {
    try {
      const token = await getToken();
      if (token) {
        try {
          await api.post("/users/logout");
        } catch (err) {
          // Ignorar errores del logout en API
          console.log("Error en logout API:", err);
        }
      }
    } finally {
      await clearAuthData();
      setUser(null);
      router.replace("/screens/auth/login");
    }
  };

  // 🔹 Actualizar usuario en memoria (sin llamada a API)
  const updateUser = (userData: User) => {
    setUser(userData);
    saveAuthData(userData.token, userData);
  };

  // 🔹 Refrescar datos del usuario desde API
  const refreshUser = async () => {
    try {
      const storedUser = await getUser();
      if (!storedUser?.id) return null;

      const response = await api.get(`/users/${storedUser.id}`);

      if (response.data.code === 200) {
        const freshUser = response.data.data.user;
        const token = await getToken();

        if (token) {
          await saveAuthData(token, freshUser);
          setUser(freshUser);
          console.log("✅ refreshUser() -> usuario actualizado:", freshUser);
          return freshUser; // 👈 IMPORTANTE: devolvemos el usuario actualizado
        }
      } else {
        console.warn("⚠️ Error al obtener usuario:", response.data.message);
        return null;
      }
    } catch (err) {
      console.error("❌ Error al refrescar usuario:", err);
      return null;
    }
  };

  const updateProfile = async (data: FormData | any) => {
    try {
      const storedUser = await getUser();
      if (!storedUser?.id) throw new Error("Usuario no encontrado");

      // 🔹 1️⃣ Actualizar usuario básico
      const response = await api.post(`/users/${storedUser.id}`, data);
      if (response.data.code !== 200) {
        throw new Error(
          response.data.message || "Error al actualizar el usuario"
        );
      }

      // 🔹 2️⃣ Obtener usuario completo con relaciones
      const fullRes = await api.get(`/users/${storedUser.id}`);
      if (fullRes.data.code !== 200) {
        throw new Error(fullRes.data.message || "Error al refrescar usuario");
      }

      const fullUser = fullRes.data.data.user;
      const token = await getToken();

      // 🔹 3️⃣ Guardar globalmente
      if (token) {
        await saveAuthData(token, fullUser);
        setUser(fullUser);
      }

      console.log("✅ Usuario actualizado globalmente:", fullUser);
      return { success: true, data: fullUser };
    } catch (err: any) {
      console.error("❌ Error en updateProfile (AuthContext):", err);
      return {
        success: false,
        error: err.response?.data?.message || "Error al actualizar usuario",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        updateUser,
        refreshUser,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 🔹 Hook para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
