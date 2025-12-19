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
  const { recipe } = route.params;

  const [isPro, setIsPro] = useState(false);

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
   /* if (!isPro) {
      Alert.alert(
        'Recurso PRO',
        'Exportar PDF está disponível apenas no plano PRO.',
        [
          { text: 'Depois' },
          { text: 'Ver PRO', onPress: () => navigation.navigate('Upgrade PRO') },
        ]
      );
      return;
    }*/

    const html = `
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body { font-family: Georgia, serif; margin: 0; color: #1F1F1F; }
      .cover {
        width: 100%;
        height: 360px;
        background-image: url('${recipe.imageUri || ''}');
        background-size: cover;
        background-position: center;
      }
      .content { padding: 40px; }
      .brand { letter-spacing: 0.12em; font-size: 12px; color: #7A7A7A; }
      h1 { margin: 8px 0; font-size: 28px; }
      .meta { color: #7A7A7A; margin-bottom: 18px; }
      .section { margin-top: 26px; }
      .h { font-weight: bold; margin-bottom: 8px; }
      .box {
        border: 1px solid #E8E1D8;
        border-radius: 14px;
        padding: 14px;
      }
    </style>
  </head>
  <body>
    ${recipe.imageUri ? `<div class="cover"></div>` : ''}
    <div class="content">
      <div class="brand">CONGOLINARIA RECEITAS</div>
      <h1>${escapeHtml(recipe.title || '')}</h1>
      <div class="meta">${escapeHtml(recipe.category || 'Sem categoria')}</div>

      <div class="section">
        <div class="h">Ingredientes</div>
        <div class="box">${nl2br(escapeHtml(recipe.ingredients || ''))}</div>
      </div>

      <div class="section">
        <div class="h">Modo de preparo</div>
        <div class="box">${nl2br(escapeHtml(recipe.preparation || ''))}</div>
      </div>
    </div>
  </body>
</html>
`;

    const file = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(file.uri);
  };

  /* =========================
     ADICIONAR À COLEÇÃO (PRO)
  ========================= */
  const addToCollection = async () => {
    const collections = await getCollections();
    if (!collections.length) {
      Alert.alert('Nenhuma coleção', 'Crie uma coleção primeiro.');
      return;
    }

    const c = collections[0]; // MVP: primeira coleção
    if (!c.recipeIds.includes(recipe.id)) {
      c.recipeIds.push(recipe.id);
      await updateCollection(c);
      Alert.alert('Adicionado', 'Receita adicionada à coleção.');
    } else {
      Alert.alert('Já existe', 'Esta receita já está na coleção.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* IMAGEM */}
      {recipe.imageUri && (
        <Image source={{ uri: recipe.imageUri }} style={styles.image} />
      )}

      {/* HEADER */}
      <Text style={styles.title}>{recipe.title}</Text>
      <Text style={styles.subtitle}>{recipe.category || 'Sem categoria'}</Text>

      {/* INGREDIENTES */}
      <Card>
        <Text style={styles.sectionTitle}>🧺 Ingredientes</Text>
        <Text style={styles.body}>
          {recipe.ingredients || '—'}
        </Text>
      </Card>

      {/* PREPARO */}
      <Card>
        <Text style={styles.sectionTitle}>👨🏾‍🍳 Modo de preparo</Text>
        <Text style={styles.body}>
          {recipe.preparation || '—'}
        </Text>
      </Card>
<TouchableOpacity
  style={styles.secondaryBtn}
  onPress={() => navigation.navigate('Cozinhar', { recipe })}
>
  <Text style={styles.secondaryText}>🍳 Modo cozinhar</Text>
</TouchableOpacity>

      {/* COLEÇÃO */}
      <TouchableOpacity style={styles.secondaryBtn} onPress={addToCollection}>
        <Text style={styles.secondaryText}>Adicionar à coleção</Text>
      </TouchableOpacity>

<TouchableOpacity
  style={styles.secondaryBtn}
  onPress={() =>
    navigation.navigate('Nova Receita', {
      mode: 'edit',
      recipe,
    })
  }
>
  <Text style={styles.secondaryText}>✏️ Editar receita</Text>
</TouchableOpacity>

      {/* PDF */}
      <TouchableOpacity style={styles.primaryBtn} onPress={exportPDF}>
        <Text style={styles.primaryText}>📄 Exportar PDF (Caderno)</Text>
      </TouchableOpacity>
<TouchableOpacity
  style={styles.secondaryBtn}
  onPress={() =>
    navigation.navigate('Nova Receita', {
      mode: 'adapt',
      recipe,
    })
  }
>
  <Text style={styles.secondaryText}>✍🏾 Adaptar a receita</Text>
</TouchableOpacity>

      {/* UPGRADE */}
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
function nl2br(text) {
  return text.replace(/\n/g, '<br/>');
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
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
    marginBottom: 4,
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
    lineHeight: 22,
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
    fontSize: 16,
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
    fontSize: 16,
  },
});
