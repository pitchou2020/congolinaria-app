import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@recipes';

export async function getRecipes() {
  const json = await AsyncStorage.getItem(KEY);
  return json ? JSON.parse(json) : [];
}

export async function setRecipes(recipes) {
  await AsyncStorage.setItem(KEY, JSON.stringify(recipes));
}

export async function saveRecipe(recipe) {
  const recipes = await getRecipes();
  recipes.push(recipe);
  await setRecipes(recipes);
}

export async function deleteRecipe(recipeId) {
  const recipes = await getRecipes();
  const next = recipes.filter((r) => r.id !== recipeId);
  await setRecipes(next);
}

export async function updateRecipe(updated) {
  const recipes = await getRecipes();
  const next = recipes.map((r) => (r.id === updated.id ? updated : r));
  await setRecipes(next);
}

export async function countRecipes() {
  const recipes = await getRecipes();
  return recipes.length;
}
export async function toggleFavorite(id) {
  const data = await getRecipes();
  const updated = data.map(r =>
    r.id === id ? { ...r, favorite: !r.favorite } : r
  );
  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
}
