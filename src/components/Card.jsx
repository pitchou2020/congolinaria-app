import { View, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../styles/theme';
import { shadowCard } from '../styles/shadows';

export default function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadowCard,
  },
});
