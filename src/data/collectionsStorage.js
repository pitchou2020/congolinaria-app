import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@collections';

export async function getCollections() {
  const json = await AsyncStorage.getItem(KEY);
  return json ? JSON.parse(json) : [];
}

export async function saveCollection(collection) {
  const collections = await getCollections();
  collections.push(collection);
  await AsyncStorage.setItem(KEY, JSON.stringify(collections));
}

export async function deleteCollection(id) {
  const collections = await getCollections();
  const next = collections.filter(c => c.id !== id);
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
}

export async function updateCollection(updated) {
  const collections = await getCollections();
  const next = collections.map(c => c.id === updated.id ? updated : c);
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
}
