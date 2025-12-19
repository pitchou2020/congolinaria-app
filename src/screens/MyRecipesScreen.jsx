import { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';

import Card from '../components/Card';
import { colors, spacing, typography, radius } from '../styles/theme';
import { shadowButton } from '../styles/shadows';
import { getRecipes } from '../data/recipesStorage';
import { getIsPro } from '../data/proStorage';
import { exportCongolinariaNotebook } from '../utils/congolinariaPdf';

  

const FREE_LIMIT = 5;

export default function MyRecipesScreen({ navigation }) {
  const [recipes, setRecipes] = useState([]);
  const [isPro, setIsProState] = useState(false);

  const load = async () => {
    const [r, p] = await Promise.all([getRecipes(), getIsPro()]);
    setRecipes(r);
    setIsProState(p);
  };

  useEffect(() => {
    const unsub = navigation.addListener('focus', load);
    return unsub;
  }, [navigation]);

  const remaining = useMemo(() => {
    if (isPro) return null;
    return Math.max(0, FREE_LIMIT - recipes.length);
  }, [isPro, recipes.length]);

  const handleNew = () => {
    if (!isPro && recipes.length >= FREE_LIMIT) {
      Alert.alert(
        'Limite do plano gratuito',
        `Você já criou ${FREE_LIMIT} receitas no FREE. Ative o PRO para criar ilimitado.`,
        [
          { text: 'Depois' },
          { text: 'Ver PRO', onPress: () => navigation.navigate('Upgrade PRO') },
        ]
      );
      return;
    }
    navigation.navigate('Nova Receita');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Minhas Receitas</Text>
          <Text style={styles.subtitle}>
            {isPro
              ? 'PRO ativo • receitas ilimitadas • PDF liberado'
              : `FREE • você ainda pode criar ${remaining} receita(s)`}
          </Text>
        </View>
<TouchableOpacity
  style={styles.exportBtn}
  onPress={() =>
    exportCongolinariaNotebook({
      title: 'Congolinaria',
      subtitle: 'Minhas Receitas',
      recipes,
    })
  }
>
  <Text style={styles.exportText}>
    🧾 Exportar Caderno Congolinaria
  </Text>
</TouchableOpacity>

        <TouchableOpacity
          style={styles.proChip}
          onPress={() => navigation.navigate('Upgrade PRO')}
        >
          <Text style={styles.proChipText}>{isPro ? 'PRO' : 'FREE'}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListEmptyComponent={
          <Card>
            <Text style={{ ...typography.h2, color: colors.primary }}>
              Nenhuma receita ainda
            </Text>
            <Text style={{ ...typography.body, color: colors.muted, marginTop: spacing.sm }}>
              Toque em “Nova Receita” para criar sua primeira receita.
            </Text>
          </Card>
        }
      renderItem={({ item }) => (
  <TouchableOpacity
    onPress={() => navigation.navigate('Details', { recipe: item })}
  >
    <Card style={{ padding: 0 }}>
      {item.imageUri && (
        <Image
          source={{ uri: item.imageUri }}
          style={styles.cardImage}
        />
      )}

      <View style={styles.cardContent}>
        <Text style={styles.recipeTitle}>{item.title}</Text>
        <Text style={styles.recipeMeta}>
          {item.category || 'Sem categoria'}
        </Text>
      </View>
    </Card>
  </TouchableOpacity>
)}

      />

      <View style={styles.footer}>
      

        <TouchableOpacity style={styles.newBtn} onPress={handleNew}>
          <Text style={styles.newBtnText}>＋ Nova Receita</Text>
        </TouchableOpacity>

        {!isPro && (
          <TouchableOpacity
            style={styles.upgradeBtn}
            onPress={() => navigation.navigate('Upgrade PRO')}
          >
            <Text style={styles.upgradeText}>Ativar PRO</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: { ...typography.title, color: colors.primary },
  subtitle: { ...typography.small, color: colors.muted, marginTop: 2 },

  proChip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  proChipText: { fontWeight: '900', color: colors.primary },

  recipeTitle: { ...typography.h2, color: colors.primary },
  recipeMeta: { ...typography.small, color: colors.muted, marginTop: spacing.xs },

  footer: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg,
    gap: spacing.sm,
  },

  newBtn: {
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    ...shadowButton,
  },
  newBtnText: { color: '#FFF', fontWeight: '900', fontSize: 16 },

  upgradeBtn: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  upgradeText: { color: colors.primary, fontWeight: '900', fontSize: 16 },



cardImage: {
  width: '100%',
  height: 160,
  borderTopLeftRadius: radius.lg,
  borderTopRightRadius: radius.lg,
},

cardContent: {
  padding: spacing.lg,
},

recipeTitle: {
  ...typography.h2,
  color: colors.primary,
},

recipeMeta: {
  ...typography.small,
  color: colors.muted,
  marginTop: spacing.xs,
},
exportBtn: {
  backgroundColor: '#C9A23F',
  padding: 14,
  borderRadius: 12,
  alignItems: 'center',
  marginBottom: 12,
},

exportText: {
  color: '#0E1D14',
  fontWeight: '900',
  fontSize: 16,
},

});
