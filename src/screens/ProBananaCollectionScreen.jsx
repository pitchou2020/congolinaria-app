import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, radius, typography } from '../styles/theme';

export default function ProBananaCollectionScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>

      {/* CAPA */}
      <View style={styles.cover}>
        <Text style={styles.crown}>👑</Text>
        <Text style={styles.coverTitle}>Banana-da-Terra</Text>
        <Text style={styles.coverSubtitle}>na Cozinha</Text>
      </View>

      {/* DESCRIÇÃO */}
      <Text style={styles.description}>
        A banana-da-terra é base, memória e criatividade.
        Nesta coleção editorial, ela é apresentada como
        protagonista em receitas que atravessam tradição,
        afeto e reinvenção culinária.
      </Text>

      {/* CONTEÚDO DA COLEÇÃO */}
      <View style={styles.box}>
        <Text style={styles.boxTitle}>O que esta coleção oferece</Text>

        <Text style={styles.bullet}>• Conteúdo curatorial exclusivo</Text>
        <Text style={styles.bullet}>• Caderno culinário em PDF estilo livro</Text>
        <Text style={styles.bullet}>• Capa editorial personalizada</Text>
        <Text style={styles.bullet}>• Sumário organizado</Text>
        <Text style={styles.bullet}>• Material pensado para impressão</Text>
        <Text style={styles.bullet}>• Uso offline</Text>
      </View>

      {/* CTA */}
      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={() => navigation.navigate('Upgrade PRO')}
      >
        <Text style={styles.primaryText}>👑 Desbloquear Coleção PRO</Text>
      </TouchableOpacity>

      {/* NOTA */}
      <Text style={styles.note}>
        Coleção integrante do Congolinaria PRO.
        Conteúdo editorial criado para ser lido,
        impresso e preservado.
      </Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },

  cover: {
    backgroundColor: '#1C2F23',
    borderRadius: radius.lg,
    paddingVertical: 50,
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },

  crown: {
    fontSize: 34,
    marginBottom: 10,
  },

  coverTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 2,
  },

  coverSubtitle: {
    fontSize: 18,
    color: colors.muted,
    marginTop: 6,
  },

  description: {
    ...typography.body,
    color: colors.text,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },

  box: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },

  boxTitle: {
    ...typography.h2,
    color: colors.primary,
    marginBottom: spacing.sm,
  },

  bullet: {
    color: colors.text,
    marginBottom: 6,
  },

  primaryBtn: {
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },

  primaryText: {
    color: '#0E1D14',
    fontWeight: '900',
    fontSize: 16,
  },

  note: {
    textAlign: 'center',
    color: colors.muted,
    marginTop: spacing.md,
    fontSize: 13,
  },
});
