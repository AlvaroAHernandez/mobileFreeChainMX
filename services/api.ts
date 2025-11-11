import { getToken } from "@/utils/storage";

// ✅ Solución: Usar fetch nativo en lugar de axios para React Native
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

console.log("🌐 [API] Base URL configurada:", API_BASE_URL);

// ✅ Crear wrapper personalizado que usa fetch en lugar de axios
const api = {
  async get(url: string, config: any = {}) {
    return this._request("GET", url, null, config);
  },

  async post(url: string, data: any = null, config: any = {}) {
    return this._request("POST", url, data, config);
  },

  async put(url: string, data: any = null, config: any = {}) {
    return this._request("PUT", url, data, config);
  },

  async delete(url: string, config: any = {}) {
    return this._request("DELETE", url, null, config);
  },

  async _request(method: string, url: string, data: any, config: any) {
    const token = await getToken();
    const fullUrl = `${API_BASE_URL}${url}`;

    const headers: any = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...config.headers,
    };

    const isPublicEndpoint =
      url.includes("/login") ||
      url.includes("/register") ||
      (method === "POST" && /^\/users$/.test(url));

    if (token && !isPublicEndpoint) {
      headers.Authorization = `Bearer ${token}`;
    } else {
      delete headers.Authorization;
    }

    console.log("➡️ [API] Request:", {
      method,
      fullUrl,
      hasToken: !!token,
      headers,
      data: data ? JSON.stringify(data).substring(0, 100) : null,
    });

    try {
      const start = Date.now();
      let bodyToSend = null;
      let headersToSend = { ...headers };

      // ⚙️ Si el cuerpo es FormData, no lo serializamos ni seteamos Content-Type manualmente
      if (data instanceof FormData) {
        bodyToSend = data;
        delete headersToSend["Content-Type"]; // <- Fetch lo genera solo correctamente
      } else if (data) {
        bodyToSend = JSON.stringify(data);
      }

      const response = await fetch(fullUrl, {
        method,
        headers: headersToSend,
        body: bodyToSend,
      });
      const end = Date.now();
      console.log(`⏱️ [API] ${method} ${url} tomó ${end - start} ms`);
      console.log("📥 [API] Response recibida:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
      });

      const responseData = await response.json();

      console.log("✅ [API] Response data:", responseData);

      // ✅ Manejo de 401
      if (response.status === 401) {
        console.warn("🚫 [API] 401 detectado en:", url);

        // ⚠️ NO limpiar sesión automáticamente aquí.
        // Deja que el contexto decida qué hacer.
        throw {
          response: {
            data: responseData,
            status: 401,
            config: { url, method, headers },
          },
          message: responseData.message || "No autenticado",
          code: 401,
        };
      }

      // ✅ Formato compatible con axios
      const axiosFormat = {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        config: { url, method, headers, data },
        request: {},
      };

      if (!response.ok) {
        throw {
          response: axiosFormat,
          message: responseData.message || `HTTP Error ${response.status}`,
          code: response.status,
        };
      }

      return axiosFormat;
    } catch (error: any) {
      console.error("❌ [API] Error en fetch:", {
        name: error.name,
        message: error.message,
        url: fullUrl,
      });

      // ✅ Si es error de red (no hay response)
      if (!error.response) {
        throw {
          message: "Network Error",
          code: "ERR_NETWORK",
          config: { url, method, baseURL: API_BASE_URL },
        };
      }

      throw error;
    }
  },
};

export default api;
