import { useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import { colors, spacing, radius, typography } from '../styles/theme';

export function parseStepsFromText(text) {
  const raw = (text || '').split('\n');
  const arr = raw.length ? raw : [''];
  return arr.map((line) => {
    const checked = line.startsWith('[x] ');
    const clean = line.replace(/^\[x\]\s/, '');
    return {
      id: `${Date.now()}-${Math.floor(Math.random() * 100000)}-${Math.random()}`,
      text: clean,
      checked,
      minutes: 0,
    };
  });
}

export function stepsToText(steps) {
  return (steps || [])
    .map(s => (s.checked ? `[x] ${s.text || ''}` : (s.text || '')))
    .join('\n');
}

export default function StepsEditor({
  steps,
  setSteps,
  placeholder = '1 passo por linha',
}) {
  const safeSteps = useMemo(() => (steps?.length ? steps : [{
    id: 'init',
    text: '',
    checked: false,
    minutes: 0,
  }]), [steps]);

  const toggleCheck = (id) => {
    setSteps(safeSteps.map(s => s.id === id ? { ...s, checked: !s.checked } : s));
  };

  const updateText = (id, text) => {
    setSteps(safeSteps.map(s => s.id === id ? { ...s, text } : s));
  };

  const updateMinutes = (id, minutes) => {
    const m = Math.max(0, Math.min(999, Number(minutes || 0)));
    setSteps(safeSteps.map(s => s.id === id ? { ...s, minutes: isNaN(m) ? 0 : m } : s));
  };

  const addStep = () => {
    setSteps([
      ...safeSteps,
      {
        id: `${Date.now()}-${Math.floor(Math.random() * 100000)}-${Math.random()}`,
        text: '',
        checked: false,
        minutes: 0,
      },
    ]);
  };

  const removeStep = (id) => {
    const next = safeSteps.filter(s => s.id !== id);
    setSteps(next.length ? next : [{
      id: 'init',
      text: '',
      checked: false,
      minutes: 0,
    }]);
  };

  const renderItem = ({ item, drag, isActive, index }) => (
    <ScaleDecorator>
      <View style={[styles.row, isActive && styles.activeRow]}>
        {/* Drag handle */}
        <TouchableOpacity onLongPress={drag} style={styles.dragHandle}>
          <Text style={styles.dragText}>⠿</Text>
        </TouchableOpacity>

        {/* Check */}
        <TouchableOpacity onPress={() => toggleCheck(item.id)} style={styles.checkBtn}>
          <Text style={styles.checkText}>{item.checked ? '✓' : '○'}</Text>
        </TouchableOpacity>

        {/* Index */}
        <Text style={styles.index}>{index + 1}</Text>

        {/* Step text */}
        <TextInput
          value={item.text}
          onChangeText={(t) => updateText(item.id, t)}
          placeholder={index === 0 ? placeholder : ''}
          placeholderTextColor={colors.muted}
          style={[styles.input, item.checked && styles.checkedText]}
        />

        {/* Minutes */}
        <View style={styles.timerBox}>
          <TextInput
            value={String(item.minutes || 0)}
            onChangeText={(t) => updateMinutes(item.id, t.replace(/[^\d]/g, ''))}
            keyboardType="numeric"
            style={styles.timerInput}
          />
          <Text style={styles.timerLabel}>min</Text>
        </View>

        {/* Remove */}
        <TouchableOpacity onPress={() => removeStep(item.id)} style={styles.removeBtn}>
          <Text style={styles.removeText}>✕</Text>
        </TouchableOpacity>
      </View>
    </ScaleDecorator>
  );

  return (
    <View style={styles.wrapper}>
      <DraggableFlatList
        data={safeSteps}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onDragEnd={({ data }) => setSteps(data)}
        activationDistance={12}
        containerStyle={{ borderRadius: radius.md }}
      />

      <TouchableOpacity onPress={addStep} style={styles.addBtn}>
        <Text style={styles.addText}>＋ Adicionar passo</Text>
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
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  activeRow: { opacity: 0.9 },

  dragHandle: { paddingRight: 8, paddingVertical: 4 },
  dragText: { fontSize: 16, color: colors.muted },

  checkBtn: { width: 26, alignItems: 'center' },
  checkText: { fontSize: 18, color: colors.accent },

  index: {
    width: 26,
    textAlign: 'right',
    marginRight: spacing.sm,
    ...typography.small,
    color: colors.muted,
  },
  input: { flex: 1, fontSize: 15, color: colors.text, paddingVertical: 4 },
  checkedText: { textDecorationLine: 'line-through', color: colors.muted },

  timerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  timerInput: {
    width: 34,
    textAlign: 'right',
    color: colors.text,
    fontWeight: '700',
  },
  timerLabel: { marginLeft: 4, color: colors.muted, fontSize: 12 },

  removeBtn: { marginLeft: 8, paddingHorizontal: 6, paddingVertical: 4 },
  removeText: { color: colors.muted, fontSize: 16 },

  addBtn: { padding: spacing.sm, alignItems: 'center' },
  addText: { color: colors.primary, fontWeight: '800' },
});
