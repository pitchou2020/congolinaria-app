import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { colors, spacing, radius, typography } from '../styles/theme';
import { shadowButton } from '../styles/shadows';
import { getIsPro, setIsPro } from '../data/proStorage';

export default function UpgradeProScreen({ navigation }) {
  const [isPro, setIsProState] = useState(false);

  useEffect(() => {
    (async () => {
      setIsProState(await getIsPro());
    })();
  }, []);

  const activate = async () => {
    await setIsPro(true);
    setIsProState(true);
    Alert.alert('PRO ativado', 'Recursos PRO liberados no seu aparelho.');
  };

  const deactivate = async () => {
    await setIsPro(false);
    setIsProState(false);
    Alert.alert('PRO desativado', 'Você voltou ao plano gratuito.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Congolinaria Receitas — PRO</Text>
      <Text style={styles.subtitle}>
        {isPro
          ? 'Status: PRO ativo (ilimitado + PDF)'
          : 'Status: FREE (até 5 receitas)'}
      </Text>

      <View style={styles.box}>
        <Text style={styles.boxTitle}>O que você ganha no PRO</Text>
        <Text style={styles.bullet}>• Receitas ilimitadas</Text>
        <Text style={styles.bullet}>• Exportar PDF estilo caderno</Text>
        <Text style={styles.bullet}>• Futuro: coleções e e-book</Text>
      </View>

      {!isPro ? (
        <TouchableOpacity style={styles.primaryBtn} onPress={activate}>
          <Text style={styles.primaryText}>Ativar PRO</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.secondaryBtn} onPress={deactivate}>
          <Text style={styles.secondaryText}>Desativar PRO</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.linkBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.link}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.xl },
  title: { ...typography.title, color: colors.primary, marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.muted, marginBottom: spacing.lg },
  box: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  boxTitle: { ...typography.h2, color: colors.primary, marginBottom: spacing.sm },
  bullet: { ...typography.body, color: colors.text, marginBottom: spacing.xs },

  primaryBtn: {
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    ...shadowButton,
  },
  primaryText: { color: '#FFF', fontWeight: '800', fontSize: 16 },

  secondaryBtn: {
    backgroundColor: '#FFF',
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryText: { color: colors.primary, fontWeight: '800', fontSize: 16 },

  linkBtn: { marginTop: spacing.lg, alignItems: 'center' },
  link: { color: colors.primary, fontWeight: '700' },
});
