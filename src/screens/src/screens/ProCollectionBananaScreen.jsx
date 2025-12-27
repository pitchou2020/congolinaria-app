import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { colors, spacing, radius, typography } from '../styles/theme';
import { shadowButton } from '../styles/shadows';
import { getIsPro } from '../data/proStorage';

export default function ProCollectionBananaScreen({ navigation }) {
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    (async () => {
      const pro = await getIsPro();
      setIsPro(pro);
    })();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      
      {/* CAPA */}
      <Image
        source={require('../../assets/banana-capa.jpg')}
        style={styles.cover}
      />

      {/* SELO */}
      <View style={styles.proBadge}>
        <Text style={styles.proText}>👑 COLEÇÃO PRO</Text>
      </View>

      <Text style={styles.title}>
        Banana da Terra na Cozinha
      </Text>

      <Text style={styles.description}>
        Um caderno culinário exclusivo da Congolinaria, dedicado à banana-da-terra
        como ingrediente central da cozinha ancestral, vegetal e criativa.
        {"\n\n"}
        Receitas autorais, técnicas, memórias afetivas e cultura alimentar.
      </Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>📚 Caderno digital ilustrado</Text>
        <Text style={styles.infoText}>🌱 Cozinha vegetal & ancestral</Text>
        <Text style={styles.infoText}>🖨️ Versão imprimível</Text>
      </View>

      {/* BOTÃO DINÂMICO */}
      {isPro ? (
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('Coleções')}
        >
          <Text style={styles.primaryText}>📖 Abrir Caderno</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.lockedBtn}
          onPress={() => navigation.navigate('Upgrade PRO')}
        >
          <Text style={styles.lockedText}>🔓 Desbloquear PRO</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  cover: { width: '100%', height: 320 },

  proBadge: {
    alignSelf: 'center',
    marginTop: -18,
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    ...shadowButton,
  },

  proText: {
    color: '#FFF',
    fontWeight: '900',
    letterSpacing: 1,
    fontSize: 12,
  },

  title: {
    ...typography.title,
    color: colors.primary,
    textAlign: 'center',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },

  description: {
    ...typography.body,
    color: colors.text,
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    lineHeight: 22,
    textAlign: 'center',
  },

  infoBox: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },

  infoText: {
    ...typography.small,
    color: colors.muted,
    marginBottom: 6,
    textAlign: 'center',
  },

  primaryBtn: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
    ...shadowButton,
  },

  primaryText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 16,
  },

  lockedBtn: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.accent,
    alignItems: 'center',
  },

  lockedText: {
    color: colors.accent,
    fontWeight: '900',
    fontSize: 16,
  },

  backBtn: {
    marginTop: spacing.md,
    alignItems: 'center',
  },

  backText: {
    color: colors.muted,
    fontSize: 14,
  },
});
