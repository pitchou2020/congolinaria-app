import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";


const API = "https://congolinaria.com.br/api/curadoria_receitas.php";
const BASE_IMAGE = "https://congolinaria.com.br/";

export default function CuradoriaSection({ navigation }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((json) => {
        if (!json?.erro && Array.isArray(json.curadoria)) {
          setItems(json.curadoria);
        }
      })
      .catch(() => {});
  }, []);

  if (!items.length) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✨ Destaques Congolinaria</Text>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("RecipeDetails", {
                recipe: {
                  id: item.id,
                  title: item.titre,
                  category: item.categoria,
                  imageUri: item.url_image
                    ? item.url_image
                    : null,
                  ingredients: item.ingredientes,
                  preparation: item.etapes,
                },
              })
            }
          >
            {item.url_image && (
              <Image
                source={{ uri: item.url_image }}
                style={styles.image}
              />
            )}

            <View style={styles.cardBody}>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.titre}
              </Text>

              {item.categoria && (
                <Text style={styles.cardCategory}>
                  {item.categoria}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 16,
  },
  title: {
    color: "#facc15",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 16,
    marginBottom: 8,
  },
  card: {
    width: 220,
    marginLeft: 16,
    backgroundColor: "#13261d",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1f3a2b",
  },
  image: {
    width: "100%",
    height: 120,
  },
  cardBody: {
    padding: 10,
  },
  cardTitle: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  cardCategory: {
    color: "#9ca3af",
    fontSize: 12,
    marginTop: 4,
  },
});
