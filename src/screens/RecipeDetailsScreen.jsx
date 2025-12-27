import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from 'react-native';

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import Card from '../components/Card';
import { colors, spacing, typography, radius } from '../styles/theme';
import { shadowButton } from '../styles/shadows';
import { getIsPro } from '../data/proStorage';
import { getCollections, updateCollection } from '../data/collectionsStorage';

export default function RecipeDetailsScreen({ route, navigation }) {
  const recipe = route?.params?.recipe;

  const [isPro, setIsPro] = useState(false);

  // 🔒 BLINDAGEM CRÍTICA
  if (!recipe || typeof recipe !== 'object') {
    return (
      <View style={styles.container}>
        <Text style={styles.body}>
          Receita não encontrada.
        </Text>
      </View>
    );
  }

  useEffect(() => {
    (async () => {
      const pro = await getIsPro();
      setIsPro(pro);
    })();
  }, []);

  /* =========================
     EXPORTAR PDF (PRO)
  ========================= */
  const exportPDF = async () => {
    const html = `
      <html>
        <body>
          <h1>${escapeHtml(recipe.title || '')}</h1>
        </body>
      </html>
    `;

    const file = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(file.uri);
  };

  const addToCollection = async () => {
    const collections = await getCollections();
    if (!collections.length) {
      Alert.alert('Nenhuma coleção', 'Crie uma coleção primeiro.');
      return;
    }

    const c = collections[0];
    if (!c.recipeIds.includes(recipe.id)) {
      c.recipeIds.push(recipe.id);
      await updateCollection(c);
      Alert.alert('Adicionado', 'Receita adicionada à coleção.');
    } else {
      Alert.alert('Já existe', 'Esta receita já está na coleção.');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {recipe.imageUri && (
        <Image source={{ uri: recipe.imageUri }} style={styles.image} />
      )}

      <Text style={styles.title}>
        {String(recipe.title)}
      </Text>

      <Text style={styles.subtitle}>
        {String(recipe.category || 'Sem categoria')}
      </Text>

      <Card>
        <Text style={styles.sectionTitle}>🧺 Ingredientes</Text>
        <Text style={styles.body}>
          {String(recipe.ingredients || '—')}
        </Text>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>👨🏾‍🍳 Modo de preparo</Text>
        <Text style={styles.body}>
          {String(recipe.preparation || '—')}
        </Text>
      </Card>

      <TouchableOpacity
        style={styles.secondaryBtn}
        onPress={() => navigation.navigate('Cozinhar', { recipe })}
      >
        <Text style={styles.secondaryText}>🍳 Modo cozinhar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryBtn}
        onPress={addToCollection}
      >
        <Text style={styles.secondaryText}>Adicionar à coleção</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={exportPDF}
      >
        <Text style={styles.primaryText}>📄 Exportar PDF</Text>
      </TouchableOpacity>

      {!isPro && (
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('Upgrade PRO')}
        >
          <Text style={styles.secondaryText}>
            Ativar PRO para liberar PDF
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

/* =========================
   HELPERS
========================= */
function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

/* =========================
   ESTILOS
========================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  image: {
    width: '100%',
    height: 240,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.title,
    color: colors.primary,
  },
  subtitle: {
    ...typography.small,
    color: colors.muted,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  body: {
    ...typography.body,
    color: colors.text,
  },
  primaryBtn: {
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
    ...shadowButton,
  },
  primaryText: {
    color: '#FFF',
    fontWeight: '900',
  },
  secondaryBtn: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryText: {
    color: colors.primary,
    fontWeight: '900',
  },
});
