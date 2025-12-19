import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import { processAndCacheImage } from '../utils/imageUtils';

import { colors, spacing, radius, typography } from '../styles/theme';
import { shadowButton } from '../styles/shadows';
import Card from '../components/Card';

import {
  saveRecipe,
  getRecipes,
  updateRecipe,
} from '../data/recipesStorage';

import { getIsPro } from '../data/proStorage';
import LineEditor from '../components/LineEditor';

const FREE_LIMIT = 5;

export default function RecipeFormScreen({ navigation, route }) {
  /* =========================
     CONTEXTO
  ========================= */
  const isEditing = route?.params?.mode === 'edit';
  const adaptingRecipe = route?.params?.mode === 'adapt';
  const sourceRecipe = route?.params?.recipe || null;

  /* =========================
     PLANO
  ========================= */
  const [isPro, setIsPro] = useState(false);
  const [recipesCount, setRecipesCount] = useState(0);

  /* =========================
     CAMPOS
  ========================= */
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [preparation, setPreparation] = useState('');
  const [imageUri, setImageUri] = useState(null);

  /* =========================
     LOAD PLANO / COUNT
  ========================= */
  useEffect(() => {
    (async () => {
      const [p, r] = await Promise.all([getIsPro(), getRecipes()]);
      setIsPro(p);
      setRecipesCount(r.length);
    })();
  }, []);

  /* =========================
     PREFILL (EDIT / ADAPT)
  ========================= */
  useEffect(() => {
    if ((adaptingRecipe || isEditing) && sourceRecipe) {
      setTitle(sourceRecipe.title || '');
      setCategory(sourceRecipe.category || '');
      setIngredients(sourceRecipe.ingredients || '');
      setPreparation(sourceRecipe.preparation || '');
      setImageUri(sourceRecipe.imageUri || null);
    }
  }, [adaptingRecipe, isEditing, sourceRecipe]);

  /* =========================
     IMAGEM (PRO)
  ========================= */
  const pickFromGallery = async () => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Autorize acesso à galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      const processed = await processAndCacheImage(
        result.assets[0].uri
      );
      setImageUri(processed);
    }
  };

  const takePhoto = async () => {
    const { status } =
      await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Autorize acesso à câmera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      const processed = await processAndCacheImage(
        result.assets[0].uri
      );
      setImageUri(processed);
    }
  };

  const chooseImage = () => {
    if (!isPro) {
      Alert.alert(
        'Recurso PRO',
        'Adicionar imagem está disponível apenas no plano PRO.',
        [
          { text: 'Depois' },
          {
            text: 'Ver PRO',
            onPress: () => navigation.navigate('Upgrade PRO'),
          },
        ]
      );
      return;
    }

    Alert.alert('Adicionar imagem', 'Escolha a origem', [
      { text: 'Câmera', onPress: takePhoto },
      { text: 'Galeria', onPress: pickFromGallery },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  /* =========================
     SALVAR
  ========================= */
  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Faltou o nome', 'Digite o nome da receita.');
      return;
    }

    if (!isPro && recipesCount >= FREE_LIMIT && !isEditing) {
      Alert.alert(
        'Limite do plano gratuito',
        `Você já criou ${FREE_LIMIT} receitas no FREE.`,
        [
          { text: 'Depois' },
          {
            text: 'Ver PRO',
            onPress: () => navigation.navigate('Upgrade PRO'),
          },
        ]
      );
      return;
    }

    if (isEditing) {
      await updateRecipe({
        ...sourceRecipe,
        title,
        category,
        ingredients,
        preparation,
        imageUri,
        updatedAt: new Date().toISOString(),
      });
    } else {
      await saveRecipe({
        id: `${Date.now()}-${Math.floor(Math.random() * 100000)}`,
        title: title.trim(),
        category: category.trim(),
        ingredients: ingredients.trim(),
        preparation: preparation.trim(),
        imageUri,
        createdAt: new Date().toISOString(),
        adaptedFrom: adaptingRecipe
          ? {
              title: sourceRecipe.title,
              category: sourceRecipe.category,
              source: 'API',
            }
          : null,
      });
    }

    navigation.goBack();
  };

  /* =========================
     UI
  ========================= */
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <Text style={styles.title}>
        {adaptingRecipe
          ? 'Adaptar receita'
          : isEditing
          ? 'Editar receita'
          : 'Nova receita'}
      </Text>

      {adaptingRecipe && (
        <Text style={styles.subtitle}>
          Você está criando sua própria versão desta receita
        </Text>
      )}

      <Text style={styles.subtitle}>
        {isPro
          ? 'PRO ativo • ilimitado'
          : `FREE • ${Math.max(
              0,
              FREE_LIMIT - recipesCount
            )} restante(s)`}
      </Text>

      <Card>
        {/* IMAGEM */}
        <Text style={styles.label}>Imagem da receita</Text>

        {imageUri ? (
          <View style={styles.imageWrapper}>
            <Image source={{ uri: imageUri }} style={styles.image} />
            <TouchableOpacity
              style={styles.changeImageBtn}
              onPress={chooseImage}
            >
              <Text style={styles.changeImageText}>
                Trocar imagem
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addImageBtn}
            onPress={chooseImage}
          >
            <Text style={styles.addImageText}>
              ＋ Adicionar imagem
            </Text>
          </TouchableOpacity>
        )}

        {/* CAMPOS */}
        <Text style={styles.label}>Nome</Text>
        <TextInput
          placeholder="Ex: Panna cotta de abóbora"
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Categoria</Text>
        <TextInput
          placeholder="Ex: Sobremesa"
          style={styles.input}
          value={category}
          onChangeText={setCategory}
        />

        <Text style={styles.label}>Ingredientes</Text>
        <LineEditor
          value={ingredients}
          onChangeText={setIngredients}
          placeholder="1 ingrediente por linha"
          checklist
        />

        <Text style={styles.label}>Modo de preparo</Text>
        <LineEditor
          value={preparation}
          onChangeText={setPreparation}
          placeholder="1 passo por linha"
          checklist
        />
      </Card>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Salvar receita</Text>
      </TouchableOpacity>

      {!isPro && (
        <TouchableOpacity
          style={styles.upgradeBtn}
          onPress={() => navigation.navigate('Upgrade PRO')}
        >
          <Text style={styles.upgradeText}>Ativar PRO</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
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
  title: { ...typography.title, color: colors.primary },
  subtitle: {
    ...typography.small,
    color: colors.muted,
    marginBottom: spacing.md,
  },
  label: {
    ...typography.small,
    color: colors.muted,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },

  addImageBtn: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  addImageText: { color: colors.primary, fontWeight: '700' },

  imageWrapper: { marginBottom: spacing.md },
  image: {
    width: '100%',
    height: 200,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
  },
  changeImageBtn: { alignSelf: 'center', paddingVertical: 6 },
  changeImageText: { color: colors.primary, fontWeight: '700' },

  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },

  saveBtn: {
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    ...shadowButton,
  },
  saveText: { color: '#FFF', fontWeight: '900', fontSize: 16 },

  upgradeBtn: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.sm,
  },
  upgradeText: {
    color: colors.primary,
    fontWeight: '900',
    fontSize: 16,
  },
});
