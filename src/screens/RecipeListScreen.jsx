import { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
} from "react-native";

const API_URL = "https://congolinaria.com.br/api/receita_autoral.php";

export default function RecipeListScreen({ navigation }) {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  /* =========================
     LOAD RECEITAS
  ========================= */
  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const json = await res.json();

      const data = json.dados || [];
      setRecipes(data);

      const uniqueCats = [
        ...new Set(data.map((r) => r.categoria).filter(Boolean)),
      ];
      setCategories(uniqueCats);
    } catch (e) {
      console.log("Erro ao carregar receitas", e);
    }
    setLoading(false);
  };

  /* =========================
     FILTRO + BUSCA
  ========================= */
  const filteredRecipes = useMemo(() => {
    return recipes.filter((r) => {
      const matchCategory = selectedCategory
        ? r.categoria === selectedCategory
        : true;

      const matchSearch = r.titre
        ?.toLowerCase()
        .includes(search.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [recipes, selectedCategory, search]);

  /* =========================
     ITEM
  ========================= */
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("Details", {
          recipe: {
            id: item.id,
            title: item.titre,
            type: item.categoria,
            cooking: item.metodo_cocao || "",
            image: item.url_image || null,
            content:
              "🧺 INGRÉDIENTS:\n" +
              (item.ingredients || "") +
              "\n\n👨🏾‍🍳 PRÉPARATION:\n" +
              (item.etapes || ""),
          },
        })
      }
    >
      {item.url_image ? (
        <Image
          source={{ uri: item.url_image }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : null}

      <Text style={styles.title}>{item.titre}</Text>
      <Text style={styles.category}>{item.categoria}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Receitas</Text>

      {/* BUSCA */}
      <TextInput
        style={styles.search}
        placeholder="🔍 Buscar receita..."
        placeholderTextColor="#9CA3AF"
        value={search}
        onChangeText={setSearch}
      />

      {/* CATEGORIAS */}
      <View style={styles.categories}>
        <TouchableOpacity
          style={[
            styles.catBtn,
            !selectedCategory && styles.catSelected,
          ]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text
            style={[
              styles.catText,
              !selectedCategory && styles.catTextSelected,
            ]}
          >
            Todas
          </Text>
        </TouchableOpacity>

        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.catBtn,
              selectedCategory === cat && styles.catSelected,
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={[
                styles.catText,
                selectedCategory === cat && styles.catTextSelected,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LISTA */}
      {loading ? (
        <Text style={styles.loading}>Carregando...</Text>
      ) : (
        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

/* =========================
   ESTILOS
========================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E1D14",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#C9A23F",
    textAlign: "center",
    marginBottom: 12,
  },
  search: {
    backgroundColor: "#1C2F23",
    borderRadius: 10,
    padding: 10,
    color: "#F5F1E8",
    borderWidth: 1,
    borderColor: "#2F4A3A",
    marginBottom: 10,
  },
  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  catBtn: {
    borderWidth: 1,
    borderColor: "#C9A23F",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  catSelected: {
    backgroundColor: "#C9A23F",
  },
  catText: {
    color: "#F5F1E8",
    fontSize: 12,
    fontWeight: "bold",
  },
  catTextSelected: {
    color: "#0E1D14",
  },
  card: {
    width: "48%",
    backgroundColor: "#1C2F23",
    borderRadius: 14,
    padding: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2F4A3A",
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    marginBottom: 6,
  },
  title: {
    color: "#F5F1E8",
    fontWeight: "bold",
    fontSize: 14,
  },
  category: {
    color: "#C9A23F",
    fontSize: 12,
    marginTop: 2,
  },
  loading: {
    textAlign: "center",
    color: "#C9A23F",
    marginTop: 20,
  },
});
