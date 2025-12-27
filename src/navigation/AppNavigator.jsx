import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import MyRecipesScreen from '../screens/MyRecipesScreen';
import RecipeFormScreen from '../screens/RecipeFormScreen';
import RecipeDetailsScreen from '../screens/RecipeDetailsScreen';
import UpgradeProScreen from '../screens/UpgradeProScreen';
import CollectionsScreen from '../screens/CollectionsScreen';
import CollectionDetails from '../screens/CollectionDetails';
import CookModeScreen from '../screens/CookModeScreen';
import ProCollectionBananaScreen from '../screens/ProBananaCollectionScreen';
import ProCollectionScreen from "../screens/ProCollectionScreen";
import ProCollectionDetailsScreen from "../screens/ProCollectionDetailsScreen";


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    
  <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Minhas Receitas" component={MyRecipesScreen} />
      <Stack.Screen name="Nova Receita" component={RecipeFormScreen} />
      <Stack.Screen   name="Coleções PRO"   component={ProCollectionScreen}/>
<Stack.Screen name="Coleção PRO" component={ProCollectionDetailsScreen} />
      <Stack.Screen name="Details" component={RecipeDetailsScreen} />
      <Stack.Screen name="Upgrade PRO" component={UpgradeProScreen} />
      <Stack.Screen name="Coleções" component={CollectionsScreen} />
<Stack.Screen name="Coleção" component={CollectionDetails} />
<Stack.Screen name="Cozinhar" component={CookModeScreen} />
<Stack.Screen
  name="Coleção Banana da Terra"
  component={ProCollectionBananaScreen}
/>




    </Stack.Navigator>
  );
}