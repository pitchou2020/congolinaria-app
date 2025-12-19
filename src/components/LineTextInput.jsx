import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../styles/theme';

export default function LineTextInput({
  value,
  onChangeText,
  placeholder,
  minLines = 5,
}) {
  const lines = Math.max(
    minLines,
    value.split('\n').length
  );

  return (
    <View style={styles.wrapper}>
      {/* LINHAS */}
      <View style={styles.lines}>
        {Array.from({ length: lines }).map((_, i) => (
          <Text key={i} style={styles.lineNumber}>
            {i + 1}
          </Text>
        ))}
      </View>

      {/* INPUT */}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        multiline
        textAlignVertical="top"
        style={styles.input}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    minHeight: 140,
  },

  lines: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRightWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#F2EFEA',
  },

  lineNumber: {
    ...typography.small,
    color: colors.muted,
    textAlign: 'right',
    height: 22,
  },

  input: {
    flex: 1,
    padding: spacing.md,
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
});
