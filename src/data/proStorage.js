import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@is_pro';

export async function getIsPro() {
  const v = await AsyncStorage.getItem(KEY);
  return v === 'true';
}

export async function setIsPro(value) {
  await AsyncStorage.setItem(KEY, value ? 'true' : 'false');
}
