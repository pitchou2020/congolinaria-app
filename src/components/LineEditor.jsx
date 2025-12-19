import { useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { colors, spacing, radius, typography } from '../styles/theme';

/**
 * value: string com \n
 * onChangeText: setter
 * checklist: boolean
 * mode: 'visual' | 'text'
 */
export default function LineEditor({
  value,
  onChangeText,
  placeholder,
  checklist = false,
  mode = 'visual',
  minLines = 5,
}) {
  const lines = useMemo(() => {
    const arr = value.split('\n');
    return arr.length ? arr : [''];
  }, [value]);

  /* =========================
     CHECKLIST TOGGLE
  ========================= */
  const toggleCheck = (index) => {
    const updated = [...lines];
    const line = updated[index];

    if (line.startsWith('[x] ')) {
      updated[index] = line.replace('[x] ', '');
    } else {
      updated[index] = `[x] ${line.replace(/^\[\s?\]\s?/, '')}`;
    }

    onChangeText(updated.join('\n'));
  };

  /* =========================
     UPDATE LINE
  ========================= */
  const updateLine = (text, index) => {
    const updated = [...lines];
    updated[index] = text;
    onChangeText(updated.join('\n'));
  };

  /* =========================
     ADD NEW LINE
  ========================= */
  const addLine = () => {
    onChangeText([...lines, ''].join('\n'));
  };

  /* =========================
     MODE TEXTO SIMPLES
  ========================= */
  if (mode === 'text') {
    return (
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline
        textAlignVertical="top"
        style={styles.textMode}
      />
    );
  }

  /* =========================
     MODO VISUAL
  ========================= */
  return (
    <View style={styles.wrapper}>
      {lines.map((line, index) => {
        const checked = line.startsWith('[x] ');
        const clean = line.replace(/^\[x\]\s/, '');

        return (
          <View key={index} style={styles.row}>
            {/* CHECK */}
            {checklist && (
              <TouchableOpacity onPress={() => toggleCheck(index)}>
                <Text style={styles.check}>
                  {checked ? '✓' : '○'}
                </Text>
              </TouchableOpacity>
            )}

            {/* INDEX */}
            <Text style={styles.index}>{index + 1}</Text>

            {/* INPUT */}
            <TextInput
              value={clean}
              onChangeText={(t) => updateLine(checked ? `[x] ${t}` : t, index)}
              placeholder={index === 0 ? placeholder : ''}
              style={[
                styles.input,
                checked && styles.checkedText,
              ]}
            />
          </View>
        );
      })}

      <TouchableOpacity onPress={addLine} style={styles.addBtn}>
        <Text style={styles.addText}>＋ Adicionar linha</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },

  check: {
    fontSize: 18,
    width: 24,
    color: colors.accent,
  },

  index: {
    width: 26,
    textAlign: 'right',
    marginRight: spacing.sm,
    ...typography.small,
    color: colors.muted,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    paddingVertical: 4,
  },

  checkedText: {
    textDecorationLine: 'line-through',
    color: colors.muted,
  },

  addBtn: {
    padding: spacing.sm,
    alignItems: 'center',
  },

  addText: {
    color: colors.primary,
    fontWeight: '700',
  },

  textMode: {
    minHeight: 140,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    textAlignVertical: 'top',
    color: colors.text,
  },
});
