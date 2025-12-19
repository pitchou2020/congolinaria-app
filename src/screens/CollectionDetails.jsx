import { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet
} from 'react-native';

import Card from '../components/Card';
import { colors, spacing, typography } from '../styles/theme';
import { getRecipes } from '../data/recipesStorage';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { getIsPro } from '../data/proStorage';
import { exportCongolinariaNotebook } from '../utils/congolinariaPdf';


export default function CollectionDetails({ route, navigation }) {
  const { collection } = route.params;
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    (async () => {
      const all = await getRecipes();
      setRecipes(all.filter(r => collection.recipeIds.includes(r.id)));
    })();
  }, []);


const exportCollectionPDF = async () => {
  const isPro = await getIsPro();
  if (!isPro) {
    Alert.alert('Recurso PRO', 'Exportar coleção é exclusivo do PRO.');
    return;
  }

  const html = `
  <html>
    <body style="font-family: Georgia, serif; padding:40px;">
      <h1>${collection.title}</h1>
      ${recipes
        .map(
          (r) => `
          <hr/>
          <h2>${r.title}</h2>
          <p><strong>Categoria:</strong> ${r.category || ''}</p>
          <h3>Ingredientes</h3>
          <p>${r.ingredients.replace(/\n/g, '<br/>')}</p>
          <h3>Modo de preparo</h3>
          <p>${r.preparation.replace(/\n/g, '<br/>')}</p>
        `
        )
        .join('')}
    </body>
  </html>
  `;

  const file = await Print.printToFileAsync({ html });
  await Sharing.shareAsync(file.uri);
};

  return (
    <View style={styles.container}>

   <TouchableOpacity
  style={styles.primaryBtn}
  onPress={() =>
    exportCongolinariaNotebook({
      title: 'Congolinaria',
      subtitle: collection.name || 'Caderno Culinário',
      recipes,
    })
  }
>
  <Text style={styles.primaryText}>
    🧾 Exportar Caderno Congolinaria
  </Text>
</TouchableOpacity>


      <Text style={styles.title}>{collection.title}</Text>

      <FlatList
        data={recipes}
        keyExtractor={r => r.id}
        ListEmptyComponent={
          <Card>
            <Text>Nenhuma receita nesta coleção.</Text>
          </Card>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Detalhes', { recipe: item })}
          >
            <Card>
              <Text style={typography.h2}>{item.title}</Text>
            </Card>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  title: { ...typography.title, marginBottom: spacing.md },
});
