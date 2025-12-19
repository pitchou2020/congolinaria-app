import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveOfflineRecipes = async (recipes) => {
  await AsyncStorage.setItem("offline_recipes", JSON.stringify(recipes));
};

export const loadOfflineRecipes = async () => {
  const data = await AsyncStorage.getItem("offline_recipes");
  return data ? JSON.parse(data) : [];
};
