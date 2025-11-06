// utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@auth_token';
const USER_KEY = '@user_data';

export const saveAuthData = async (token: string, user: any) => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem(TOKEN_KEY);
};

export const getUser = async (): Promise<any | null> => {
  const json = await AsyncStorage.getItem(USER_KEY);
  return json ? JSON.parse(json) : null;
};

export const clearAuthData = async () => {
  await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem(USER_KEY);
};
