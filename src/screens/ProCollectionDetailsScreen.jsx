import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import * as Sharing from "expo-sharing";

import { getIsPro } from "../data/proStorage";

export default function ProCollectionDetailsScreen({ route, navigation }) {
  const { collection } = route.params;
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    getIsPro().then(setIsPro);
  }, []);

  const handleAction = async () => {
    if (!isPro) {
      navigation.navigate("Upgrade PRO");
      return;
    }

    await Sharing.shareAsync(collection.pdf);
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: collection.cover }} style={styles.cover} />

      <View style={styles.badge}>
        <Text style={styles.badgeText}>PRO</Text>
      </View>

      <Text style={styles.title}>{collection.title}</Text>
      <Text style={styles.description}>{collection.description}</Text>

      <View style={styles.box}>
        <Text style={styles.boxTitle}>📘 O que você recebe</Text>
        <Text style={styles.boxItem}>• Ebook completo em PDF</Text>
        <Text style={styles.boxItem}>• Receitas exclusivas Congolinaria</Text>
        <Text style={styles.boxItem}>• Acesso offline</Text>
        <Text style={styles.boxItem}>• Conteúdo imprimível</Text>
      </View>

      <TouchableOpacity style={styles.cta} onPress={handleAction}>
        <Text style={styles.ctaText}>
          {isPro ? "📘 Abrir Caderno" : "🔒 Desbloquear PRO"}
        </Text>
      </TouchableOpacity>

      {!isPro && (
        <Text style={styles.notice}>
          Conteúdo disponível apenas para usuários PRO.
        </Text>
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E1D14",
    padding: 16,
  },

  cover: {
    width: "100%",
    height: 320,
    borderRadius: 18,
    marginBottom: 16,
  },

  badge: {
    position: "absolute",
    top: 24,
    right: 24,
    backgroundColor: "#C9A23F",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  badgeText: {
    color: "#0E1D14",
    fontWeight: "900",
    fontSize: 12,
  },

  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#C9A23F",
    marginBottom: 8,
  },

  description: {
    color: "#F5F1E8",
    marginBottom: 20,
    lineHeight: 22,
  },

  box: {
    backgroundColor: "#1C2F23",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#2F4A3A",
  },

  boxTitle: {
    color: "#C9A23F",
    fontWeight: "900",
    marginBottom: 8,
  },

  boxItem: {
    color: "#F5F1E8",
    marginBottom: 4,
  },

  cta: {
    backgroundColor: "#C9A23F",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  ctaText: {
    color: "#0E1D14",
    fontWeight: "900",
    fontSize: 18,
  },

  notice: {
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 12,
  },
});
