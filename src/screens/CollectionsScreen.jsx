import { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Alert
} from 'react-native';

import Card from '../components/Card';
import { colors, spacing, typography, radius } from '../styles/theme';
import { shadowButton } from '../styles/shadows';
import { getCollections, saveCollection } from '../data/collectionsStorage';
import { getIsPro } from '../data/proStorage';

export default function CollectionsScreen({ navigation }) {
  const [collections, setCollections] = useState([]);
  const [isPro, setIsPro] = useState(false);

  const load = async () => {
    const [c, p] = await Promise.all([getCollections(), getIsPro()]);
    setCollections(c);
    setIsPro(p);
  };

  useEffect(() => {
    const unsub = navigation.addListener('focus', load);
    return unsub;
  }, [navigation]);

  const createCollection = () => {
    if (!isPro) {
      Alert.alert(
        'Recurso PRO',
        'Coleções estão disponíveis apenas no plano PRO.',
        [
          { text: 'Depois' },
          { text: 'Ativar PRO', onPress: () => navigation.navigate('Upgrade PRO') },
        ]
      );
      return;
    }

    const id = `${Date.now()}`;
    saveCollection({
      id,
      title: `Nova Coleção ${collections.length + 1}`,
      recipeIds: [],
      createdAt: new Date().toISOString(),
    }).then(load);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Coleções</Text>

      <FlatList
        data={collections}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Card>
            <Text style={typography.h2}>Nenhuma coleção</Text>
            <Text style={typography.body}>
              Crie coleções para organizar suas receitas.
            </Text>
          </Card>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Coleção', { collection: item })}
          >
            <Card>
              <Text style={styles.collectionTitle}>{item.title}</Text>
              <Text style={styles.meta}>
                {item.recipeIds.length} receita(s)
              </Text>
            </Card>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.newBtn} onPress={createCollection}>
        <Text style={styles.newBtnText}>＋ Nova Coleção</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  title: { ...typography.title, marginBottom: spacing.md },
  collectionTitle: { ...typography.h2, color: colors.primary },
  meta: { ...typography.small, color: colors.muted, marginTop: 4 },
  newBtn: {
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    ...shadowButton,
  },
  newBtnText: { color: '#FFF', fontWeight: '900', fontSize: 16 },
});
