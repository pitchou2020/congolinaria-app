import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import * as Sharing from "expo-sharing";

import { proCollections } from "../data/proCollections";
import { getIsPro } from "../data/proStorage";

export default function ProCollectionScreen({ navigation }) {
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    getIsPro().then(setIsPro);
  }, []);

  // 🛡️ BLINDAGEM CONTRA UNDEFINED
  if (!Array.isArray(proCollections) || proCollections.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>
          Nenhuma coleção disponível no momento.
        </Text>
      </View>
    );
  }

  const handlePress = async (collection) => {
    if (!isPro) {
      navigation.navigate("Upgrade PRO");
      return;
    }

    await Sharing.shareAsync(collection.pdf);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>👑 Coleções PRO</Text>
      <Text style={styles.subheader}>
        Cadernos culinários exclusivos Congolinaria
      </Text>

      {proCollections.map((c) => (
        <View key={c.id} style={styles.card}>
          <Image source={{ uri: c.cover }} style={styles.cover} />

          <View style={styles.badge}>
            <Text style={styles.badgeText}>PRO</Text>
          </View>

          <Text style={styles.title}>{c.title}</Text>
          <Text style={styles.description}>{c.description}</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => handlePress(c)}
          >
            <Text style={styles.buttonText}>
              {isPro ? "📘 Abrir Caderno" : "🔒 Desbloquear PRO"}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E1D14",
    padding: 16,
  },

  header: {
    fontSize: 26,
    fontWeight: "900",
    color: "#C9A23F",
    marginTop: 10,
  },

  subheader: {
    color: "#F5F1E8",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#1C2F23",
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#2F4A3A",
  },

  cover: {
    width: "100%",
    height: 220,
    borderRadius: 14,
    marginBottom: 12,
  },

  badge: {
    position: "absolute",
    top: 14,
    right: 14,
    backgroundColor: "#C9A23F",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  badgeText: {
    color: "#0E1D14",
    fontWeight: "900",
    fontSize: 12,
  },

  title: {
    fontSize: 20,
    fontWeight: "900",
    color: "#C9A23F",
    marginBottom: 4,
  },

  description: {
    color: "#F5F1E8",
    marginBottom: 12,
  },

  button: {
    backgroundColor: "#C9A23F",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  buttonText: {
    color: "#0E1D14",
    fontWeight: "900",
    fontSize: 16,
  },

  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0E1D14",
  },

  emptyText: {
    color: "#F5F1E8",
  },
});
