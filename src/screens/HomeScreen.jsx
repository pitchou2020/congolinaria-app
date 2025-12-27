import { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  Alert,
} from "react-native";

import {
  saveRecipe,
  getRecipes,
  toggleFavorite,
} from "../data/recipesStorage";
import { exportCongolinariaNotebook } from '../utils/congolinariaPdf';
import CuradoriaSection from "../components/CuradoriaSection";


const API_URL = "https://congolinaria.com.br/api/receita_autoral.php";

export default function HomeScreen({ navigation }) {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [onlyFav, setOnlyFav] = useState(false);

  /* =========================
     LOAD RECEITAS API + LOCAL
  ========================= */
  useEffect(() => {
    loadRecipes();
  }, []);

  const exportFavoritesNotebook = () => {
  const favorites = recipes.filter(r => r.favorite);

  if (!favorites.length) {
    Alert.alert(
      'Nenhuma favorita',
      'Marque receitas com ⭐ para gerar o caderno.'
    );
    return;
  }

  exportCongolinariaNotebook({
    title: 'Congolinaria',
    subtitle: 'Caderno de Receitas Favoritas',
    recipes: favorites,
  });
};


  const loadRecipes = async () => {
    setLoading(true);
    try {
      const [apiRes, local] = await Promise.all([
        fetch(API_URL).then(r => r.json()),
        getRecipes(),
      ]);

      const apiData = apiRes.dados || [];

      // mescla API + locais (favoritos / salvos)
      const merged = apiData.map(item => {
        const localMatch = local.find(r => r.id === item.id);
        return localMatch
          ? localMatch
          : {
              id: item.id,
              title: item.titre,
              category: item.categoria,
              ingredients: item.ingredients || '',
              preparation: item.etapes || '',
              imageUri: item.url_image || null,
              favorite: false,
              source: 'API',
            };
      });

      setRecipes(merged);

      const uniqueCats = [
        ...new Set(merged.map(r => r.category).filter(Boolean)),
      ];
      setCategories(uniqueCats);
    } catch (e) {
      console.log("Erro ao carregar receitas", e);
    }
    setLoading(false);
  };

  /* =========================
     FILTROS
  ========================= */
  const filteredRecipes = useMemo(() => {
    return recipes.filter(r => {
      if (onlyFav && !r.favorite) return false;

      const matchCategory = selectedCategory
        ? r.category === selectedCategory
        : true;

      const matchSearch = r.title
        ?.toLowerCase()
        .includes(search.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [recipes, selectedCategory, search, onlyFav]);

  /* =========================
     FAVORITAR (SALVA SE PRECISAR)
  ========================= */
  const handleFavorite = async (item) => {
    // se ainda não existe localmente, salva primeiro
    const locals = await getRecipes();
    const exists = locals.find(r => r.id === item.id);

    if (!exists) {
      await saveRecipe({
        ...item,
        createdAt: new Date().toISOString(),
        adaptedFrom: {
          title: item.title,
          category: item.category,
          source: 'API',
        },
      });
    }

    const updated = await toggleFavorite(item.id);
    setRecipes(prev =>
      prev.map(r =>
        r.id === item.id
          ? { ...r, favorite: !r.favorite }
          : r
      )
    );
  };

  /* =========================
     RENDER ITEM
  ========================= */
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("Details", { recipe: item })
      }
      activeOpacity={0.9}
    >
      {/* ⭐ FAVORITO */}
      <TouchableOpacity
        onPress={() => handleFavorite(item)}
        style={styles.favoriteBtn}
        activeOpacity={0.8}
      >
        <Text style={styles.favoriteIcon}>
          {item.favorite ? "⭐" : "☆"}
        </Text>
      </TouchableOpacity>

      {item.imageUri && (
        <Image
          source={{ uri: item.imageUri }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.category}>{item.category}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Congolinaria Receitas</Text>
{/* CURADORIA (isolada) */}
<CuradoriaSection navigation={navigation} />

      {/* BUSCA */}
      <TextInput
        style={styles.search}
        placeholder="🔍 Buscar receita..."
        placeholderTextColor="#9CA3AF"
        value={search}
        onChangeText={setSearch}
      />

      <TouchableOpacity
  style={styles.proBtn}
  onPress={() => navigation.navigate('Coleções PRO')}
>
  <Text style={styles.proBtnText}>👑 Coleções PRO</Text>
</TouchableOpacity>


      {/* FILTRO FAVORITOS */}
      <TouchableOpacity
        onPress={() => setOnlyFav(!onlyFav)}
        style={styles.favFilter}
      >
        <Text style={styles.favFilterText}>
          {onlyFav ? "⭐ Mostrando favoritas " 
          
          
          : "☆ Ver favoritas"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
  style={styles.exportBtn}
  onPress={exportFavoritesNotebook}
>
  <Text style={styles.exportText}>
    ⭐ Caderno de Favoritas
  </Text>
</TouchableOpacity>


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

        {categories.map(cat => (
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
        <Text style={{ color: "#C9A23F", textAlign: "center" }}>
          Carregando...
        </Text>
      ) : (
        <FlatList
          data={filteredRecipes}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("Minhas Receitas")}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
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
    fontSize: 26,
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
    marginBottom: 8,
  },
  favFilter: {
    alignSelf: "flex-end",
    marginBottom: 8,
  },
  favFilterText: {
    color: "#C9A23F",
    fontWeight: "700",
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
  favoriteBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    zIndex: 10,
  },
  favoriteIcon: {
    fontSize: 20,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#C9A23F",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
  fabText: {
    fontSize: 28,
    color: "#0E1D14",
    fontWeight: "bold",
  },

  exportBtn: {
  backgroundColor: '#C9A23F',
  padding: 14,
  borderRadius: 12,
  alignItems: 'center',
  marginBottom: 12,
},

exportText: {
  color: '#0E1D14',
  fontWeight: '900',
  fontSize: 16,
},

proBtn: {
  backgroundColor: "#C9A23F",
  borderRadius: 14,
  paddingVertical: 14,
  alignItems: "center",
  marginBottom: 12,
  elevation: 4,
},
proBtnText: {
  color: "#0E1D14",
  fontSize: 16,
  fontWeight: "900",
  letterSpacing: 0.5,
},


});