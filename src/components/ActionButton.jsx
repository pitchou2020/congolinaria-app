export default function ActionButton({ icon, label, onPress, color }) {
  return (
    <TouchableOpacity style={[styles.btn, { backgroundColor: color }]} onPress={onPress}>
      <Icon name={icon} size={18} color="#0E1D14" />
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}
