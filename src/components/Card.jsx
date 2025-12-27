import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../styles/theme';
import { shadowCard } from '../styles/shadows';

export default function Card({ children, style }) {
  const renderChildren = () => {
    if (
      typeof children === 'string' ||
      typeof children === 'number'
    ) {
      return <Text>{children}</Text>;
    }

    return children;
  };

  return (
    <View style={[styles.card, style]}>
      {renderChildren()}
    </View>
  );
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
