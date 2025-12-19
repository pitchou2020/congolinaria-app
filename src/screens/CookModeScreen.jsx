import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useKeepAwake } from 'expo-keep-awake';
import { colors, spacing, typography } from '../styles/theme';

export default function CookModeScreen({ route }) {
  useKeepAwake();
  const { recipe } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{recipe.title}</Text>

      <Text style={styles.section}>Ingredientes</Text>
      {recipe.ingredients.split('\n').map((i, idx) => (
        <Text key={idx} style={styles.item}>• {i}</Text>
      ))}

      <Text style={styles.section}>Modo de preparo</Text>
      {recipe.preparation.split('\n').map((p, idx) => (
        <Text key={idx} style={styles.step}>
          {idx + 1}. {p}
        </Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  title: { ...typography.title, color: colors.primary, marginBottom: spacing.md },
  section: { ...typography.h2, marginTop: spacing.lg },
  item: { fontSize: 18, marginVertical: 4 },
  step: { fontSize: 18, marginVertical: 8 },
});
