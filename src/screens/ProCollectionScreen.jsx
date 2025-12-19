import { View, Text } from "react-native";
import { proCollections } from "../data/proCollections";

export default function ProCollectionScreen() {
  return (
    <View style={{ padding: 20 }}>
      {proCollections.map((c) => (
        <View key={c.id}>
          <Text style={{ fontSize: 22 }}>{c.title}</Text>
          <Text>{c.description}</Text>
          <Text>🔒 Conteúdo PRO</Text>
        </View>
      ))}
    </View>
  );
}
