import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Share,
  Image,
} from "react-native";
import * as MailComposer from "expo-mail-composer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";

import * as Print from "expo-print";
import * as Sharing from "expo-sharing";


import * as FileSystem from "expo-file-system/legacy";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
















const API_URL = "https://congolinaria.com.br/api/receita_autoral.php";


function ActionButton({ icon, label, onPress, bg = "#caa64b", color = "#1b3328" }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: "48%",
        backgroundColor: bg,
        paddingVertical: 14,
        borderRadius: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
      activeOpacity={0.8}
    >
      {icon}
      <Text style={{ color, fontWeight: "700", fontSize: 14 }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/* =========================
   FORMULÁRIO
========================= */
function RecipeForm({ onSave, onCancel, initialRecipe, categories }) {
  const [title, setTitle] = useState(initialRecipe?.title || "");
  const [type, setType] = useState(initialRecipe?.type || "");
  const [cooking, setCooking] = useState(initialRecipe?.cooking || "");
  const [texto, setTexto] = useState(initialRecipe?.content || "");
  const [image, setImage] = useState(initialRecipe?.image || null);

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const pickFromCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert("Permissão da câmera é necessária!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!title.trim() || !type) return;

    onSave({
      ...initialRecipe,
      title: title.trim(),
      type: type.trim(),
      cooking: cooking.trim(),
      content: texto.trim(),
      image: image || null,
    });
  };

  return (
   <ScrollView contentContainerStyle={{  paddingBottom: 180 }}>

      <View style={styles.card}>

        <Text style={styles.label}>Nom de la recette</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} />

        <Text style={styles.label}>Catégorie</Text>
        <View style={styles.categoryRow}>
          {(categories || []).map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                type === cat && styles.categorySelected,
              ]}
              onPress={() => setType(cat)}
            >
              <Text style={type === cat ? styles.categoryTextSelected : styles.categoryText}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Type de cuisson</Text>
        <TextInput style={styles.input} value={cooking} onChangeText={setCooking} />

        <Text style={styles.label}>Recette / instructions</Text>

        <View style={styles.notebookContainer}>
          {[...Array(10)].map((_, i) => (
            <View key={i} style={styles.line} />
          ))}

          <TextInput
            multiline
            placeholder="Escreva sua receita aqui ✍🏾"
            placeholderTextColor="#8B6F47"
            style={[styles.notebookAbsolute, { zIndex: 5 }]}
            value={texto}
            onChangeText={setTexto}
          />
        </View>

        <View style={{ flexDirection: "row", gap: 10, marginVertical: 10 }}>
          <TouchableOpacity style={styles.buttonSecondary} onPress={pickFromGallery}>
            <Text style={styles.buttonSecondaryText}>📁 Galeria</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonSecondary} onPress={pickFromCamera}>
            <Text style={styles.buttonSecondaryText}>📸 Câmera</Text>
          </TouchableOpacity>
        </View>

        {image && (
          <Image
            source={{ uri: image }}
            style={{ width: "100%", height: 180, borderRadius: 12, marginBottom: 10 }}
          />
        )}

        <View style={[styles.row, { zIndex: 20 }]}>
          <TouchableOpacity style={styles.buttonSecondary} onPress={onCancel}>
            <Text style={styles.buttonSecondaryText}>Annuler</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Enregistrer</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
}

/* =========================
   DETALHES
========================= */
function RecipeDetails({
  recipe,
  recipes,
  setSelectedRecipe,
  onBack,
  onEdit,
  onToggleFavorite,
  isFavorite,
}) {
  const [porcoes, setPorcoes] = useState(1);

  const handleSendByEmail = async () => {
    await MailComposer.composeAsync({
      subject: `Recette : ${recipe.title}`,
      body: recipe.content || "",
    });
  };



 const handleShareWhatsApp = async () => {
  try {
    const mensagem = `🍽️ Receita: ${recipe.title}

📌 Categoria: ${recipe.type}
🔥 Cozimento: ${recipe.cooking}

🧺 INGRÉDIENTS:
${ingredientesAjustados}

👨🏾‍🍳 PRÉPARATION:
${preparo}

— Enviado pelo Congolinaria Receitas`;

    if (recipe.image) {
      const fileUri = FileSystem.documentDirectory + "receita.jpg";

      // ✅ Baixa a imagem para o celular
      await FileSystem.downloadAsync(recipe.image, fileUri);

      // ✅ Compartilha imagem + texto juntos
      await Sharing.shareAsync(fileUri, {
        dialogTitle: recipe.title,
        mimeType: "image/jpeg",
        UTI: "public.jpeg",
      });

      // ✅ Abre novamente o WhatsApp só com o TEXTO (complemento)
      await Share.share({ message: mensagem });

    } else {
      // ✅ Caso não tenha imagem, manda só texto
      await Share.share({ message: mensagem });
    }

  } catch (e) {
    console.log("Erro ao compartilhar no WhatsApp:", e);
  }
};



const exportToPDF = async () => {
  try {
    const html = `
      <html>
        <body style="font-family: Arial; padding: 20px;">
          <h1>${recipe.title}</h1>

          <p><strong>Categoria:</strong> ${recipe.type}</p>
          <p><strong>Cozimento:</strong> ${recipe.cooking}</p>

          ${
            recipe.image
              ? `<img src="${recipe.image}" style="width:100%; border-radius:12px; margin:12px 0;" />`
              : ""
          }

          <h3>🧺 Ingredientes</h3>
          <pre>${ingredientesAjustados}</pre>

          <h3>👨🏾‍🍳 Modo de preparo</h3>
          <pre>${preparo}</pre>

          <p style="margin-top:40px; font-size:12px; color:gray;">
            Gerado pelo Congolinaria Receitas
          </p>
        </body>
      </html>
    `;

    const file = await Print.printToFileAsync({ html });

    await Sharing.shareAsync(file.uri);

  } catch (e) {
    console.log("Erro ao gerar PDF:", e);
  }
};


  const partes = recipe?.content?.split("👨🏾‍🍳 PRÉPARATION:");
  const ingredientesOriginais = partes?.[0]
    ?.replace("🧺 INGRÉDIENTS:\n", ",")
    ?.trim();

  const preparo = partes?.[1] || "";

 const ingredientesAjustados = formatarIngredientesPorVirgula(
  ajustarIngredientesPorPorcao(ingredientesOriginais, porcoes)
);


  return (
    <View style={{ flex: 1 }}>
      {/* ✅ CONTEÚDO COM SCROLL */}
      <ScrollView
        contentContainerStyle={{  paddingBottom: 180 }}
      >
        <View style={styles.card}>
          <Text style={styles.title}>{recipe.title}</Text>

          {recipe.image ? (
            <Image
              source={{ uri: recipe.image }}
              style={{
                width: "100%",
                height: 220,
                borderRadius: 12,
                marginVertical: 10,
              }}
              resizeMode="cover"
            />
          ) : null}

          {/* ✅ CONTROLE DE PORÇÕES */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginBottom: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => setPorcoes(Math.max(1, porcoes - 1))}
              style={styles.buttonSecondary}
            >
              <Text style={styles.buttonSecondaryText}>-</Text>
            </TouchableOpacity>

            <Text
              style={{
                marginHorizontal: 12,
                fontSize: 18,
                color: "#C9A23F",
              }}
            >
              {porcoes} porção{porcoes > 1 ? "s" : ""}
            </Text>

            <TouchableOpacity
              onPress={() => setPorcoes(porcoes + 1)}
              style={styles.buttonSecondary}
            >
              <Text style={styles.buttonSecondaryText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* ✅ FAVORITO */}
          <TouchableOpacity
            onPress={onToggleFavorite}
            style={{ marginBottom: 10 }}
          >
            <Text style={{ fontSize: 18 }}>
              {isFavorite
                ? "⭐ Remover dos favoritos"
                : "☆ Adicionar aos favoritos"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.meta}>Catégorie : {recipe.type}</Text>
          <Text style={styles.meta}>Cuisson : {recipe.cooking}</Text>

          {/* ✅ TEXTO LONGO COM INGREDIENTES AJUSTADOS + ETAPAS NUMERADAS */}
          <Text style={styles.content}>
            🧺 INGRÉDIENTS:
            {"\n"}
            {ingredientesAjustados}

            {"\n\n"}👨🏾‍🍳 PRÉPARATION:
            {"\n"}
            {preparo}
          </Text>
        </View>
      </ScrollView>

      {/* ✅ ✅ ✅ BARRA DE BOTÕES FIXA NO RODAPÉ */}
      <View style={styles.actionBar}>
        <View style={styles.actionGrid}>
          <ActionButton
      label="Voltar"
      icon={<Ionicons name="arrow-back" size={18} color="#1b3328" />}
      onPress={onBack}
    />
    
        <ActionButton
      label="Adaptar"
      icon={<MaterialIcons name="auto-fix-high" size={18} color="#1b3328" />}
      onPress={onEdit}
    />

    <ActionButton
      label="E-mail"
      icon={<MaterialIcons name="email" size={18} color="#1b3328" />}
      onPress={handleSendByEmail}
    />
    <ActionButton
      label="WhatsApp"
      bg="#25D366"
      color="#0b3d1e"
      icon={<FontAwesome5 name="whatsapp" size={18} color="#0b3d1e" />}
      onPress={handleShareWhatsApp}
    />

    <ActionButton
      label="PDF"
      bg="#e8c46a"
      icon={<MaterialIcons name="picture-as-pdf" size={18} color="#1b3328" />}
      onPress={exportToPDF}
    />

</View>
      </View>
    </View>
  );
}



const ajustarIngredientesPorPorcao = (texto, fator) => {
  if (!texto) return "";

  return texto
    .replace(/,\s*/g, "\n") // ✅ quebra vírgulas em linhas
    .split("\n")
    .map((linha) => {
      const match = linha.match(/^([\d./]+)\s*(.*)$/);

      if (!match) return linha;

      let valor = match[1];

      // ✅ Converte fração para decimal
      if (valor.includes("/")) {
        const [n, d] = valor.split("/").map(Number);
        valor = n / d;
      } else {
        valor = parseFloat(valor.replace(",", "."));
      }

      if (isNaN(valor)) return linha;

      const novoValor = valor * fator;

      // ✅ Converte para fração bonita
      const valorFinal = converterDecimalParaFracao(novoValor);

      return `${valorFinal} ${match[2]}`;
    })
    .join("\n");
};



const formatarIngredientesPorVirgula = (texto) => {
  if (!texto) return "";

  return texto
    .replace(/,\s*/g, "\n") // ✅ quebra TODAS as vírgulas em nova linha
    .replace(/\n+/g, "\n")  // ✅ evita linhas vazias repetidas
    .trim();
};


const converterDecimalParaFracao = (numero) => {
  const inteiro = Math.floor(numero);
  const decimal = +(numero - inteiro).toFixed(2);

  const mapa = {
    0.25: "¼",
    0.33: "⅓",
    0.5: "½",
    0.66: "⅔",
    0.75: "¾",
  };

  if (mapa[decimal]) {
    return inteiro === 0
      ? mapa[decimal]
      : `${inteiro}${mapa[decimal]}`;
  }

  return Number.isInteger(numero) ? numero.toString() : numero.toFixed(2);
};

/* =========================
   APP PRINCIPAL
========================= */
export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [screen, setScreen] = useState("list");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [porcoes, setPorcoes] = useState(1);
  const [texto, setTexto] = useState("");




  const toggleFavorite = async (recipeId) => {
    let newFavorites = [];

    if (favorites.includes(recipeId)) {
      newFavorites = favorites.filter((id) => id !== recipeId);
    } else {
      newFavorites = [...favorites, recipeId];
    }

    setFavorites(newFavorites);
    await AsyncStorage.setItem("favorites", JSON.stringify(newFavorites));
  };





  useEffect(() => {

    loadAll();
    loadFavorites();
  }, []);

const loadAll = async () => {
  try {
    const apiData = await loadFromAPI();

    if (apiData.length > 0) {
      setRecipes(apiData);
      await AsyncStorage.setItem("offline_recipes", JSON.stringify(apiData));

      const uniqueCategories = [
        ...new Set(apiData.map(r => r.type).filter(Boolean))
      ];
      setCategories(uniqueCategories);

      console.log("✅ Dados carregados da API e salvos offline");
      return;
    }
  } catch (e) {
    console.log("⚠️ Falha ao carregar da API, tentando offline...");
  }

  // ✅ FALLBACK OFFLINE
  try {
    const offline = await AsyncStorage.getItem("offline_recipes");

    if (offline) {
      const data = JSON.parse(offline);
      setRecipes(data);

      const uniqueCategories = [
        ...new Set(data.map(r => r.type).filter(Boolean))
      ];
      setCategories(uniqueCategories);

      console.log("✅ App funcionando 100% OFFLINE");
    } else {
      console.log("⚠️ Nenhum dado offline encontrado");
    }
  } catch (e) {
    console.log("❌ Erro ao carregar offline", e);
  }
};





  const loadFromAPI = async () => {
    try {
      const res = await fetch(API_URL);
      const text = await res.text(); // 👈 agora estamos lendo como TEXTO

      console.log("API RAW TEXT:", text);

      // Tentativa manual de converter para JSON
      const json = JSON.parse(text);

      if (!json.erro && Array.isArray(json.dados)) {
        const formatted = json.dados.map((r) => {
          // ✅ Quebra as etapas por linha e numera
          const etapesNumeradas = (r.etapes || "")
            .split("\n")
            .filter((etapa) => etapa.trim() !== "")
            .map((etapa, index) => `${index + 1}. ${etapa}`)
            .join("\n");

          return {
            id: String(r.id),
            title: r.titre,
            type: r.categoria || "Autre",
            cooking: r.metodo_cocao || "",
            image: r.url_image
              ? r.url_image //`https://congolinaria.com.br/${r.url_image}`
              : null,
            content:
  "🧺 INGRÉDIENTS:\n" +
  (r.ingredients || "") +
  "\n\n👨🏾‍🍳 PRÉPARATION:\n" +
  etapesNumeradas,

            isOfficial: true,
          };
        });




        return formatted;
      }
    } catch (e) {
      console.log("❌ API não retornou JSON válido:", e);
    }

    return [];
  };





  const loadLocal = async () => {
  try {
    const saved = await AsyncStorage.getItem("recipes");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.log("Erro ao carregar cache local", e);
  }
  return [];
};


  const loadFavorites = async () => {
    try {
      const saved = await AsyncStorage.getItem("favorites");
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch (e) {
      console.log("Erro ao carregar favoritos", e);
    }
  };


  const saveLocal = async (localRecipes) => {
    await AsyncStorage.setItem("recipes", JSON.stringify(localRecipes));
  };

  const handleSaveRecipe = (recipe) => {
    let newList = [];

    // 1️⃣ Se veio da API e está sendo personalizada
    if (recipe.isOfficial) {
      const personalVersion = {
        ...recipe,
        id: "local_" + Date.now(),
        originalId: recipe.id,
        isOfficial: false,
      };
      newList = [...recipes, personalVersion];
    }

    // 2️⃣ Se está editando receita local existente
    else if (recipe.id?.startsWith("local_")) {
      newList = recipes.map((r) => (r.id === recipe.id ? recipe : r));
    }

    // 3️⃣ Se é uma receita NOVA criada pelo usuário
    else {
      const newLocal = {
        ...recipe,
        id: "local_" + Date.now(),
        isOfficial: false,
      };
      newList = [...recipes, newLocal];
    }

    setRecipes(newList);
    saveLocal(newList.filter((r) => !r.isOfficial));
    setScreen("list");
  };


  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setScreen("details");
  };

  const filteredRecipes = recipes.filter((r) => {
    const matchesCategory = selectedCategory
      ? r.type &&
      r.type.toLowerCase().trim() ===
      selectedCategory.toLowerCase().trim()
      : true;

    const matchesSearch = r.title
      ?.toLowerCase()
      .includes(searchText.toLowerCase().trim());

    const matchesFavorite = showOnlyFavorites
      ? favorites.includes(r.id)
      : true;

    return matchesCategory && matchesSearch && matchesFavorite;
  });


const renderRecipeItem = ({ item }) => {
  const isFav = favorites.includes(item.id);

  return (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => handleSelectRecipe(item)}
    >
      {item.image ? (
        <Image
          source={{ uri: item.image }}
          style={{
            width: "100%",
            height: 160,
            borderRadius: 10,
            marginBottom: 6,
          }}
          resizeMode="cover"
        />
      ) : null}

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.listItemTitle}>{item.title}</Text>
        <Text>{isFav ? "⭐" : "☆"}</Text>
      </View>

      <Text>{item.type}</Text>
    </TouchableOpacity>
  );
};

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.appTitle}> Congolinaria Receitas</Text>

      {screen === "list" && (
        <>

          <TextInput
            style={styles.searchInput}
            placeholder="🔍 Buscar receita pelo nome..."
            value={searchText}
            onChangeText={setSearchText}
          />

          <View style={styles.categoryRow}>
            <TouchableOpacity
              style={[
                styles.categoryButton,
                !selectedCategory && styles.categorySelected,
              ]}
              onPress={() => setSelectedCategory(null)}
            >
              <Text>Toutes</Text>
            </TouchableOpacity>

            {categories.map((cat) => (

              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  selectedCategory === cat && styles.categorySelected,
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text
                  style={
                    selectedCategory === cat
                      ? styles.categoryTextSelected
                      : styles.categoryText
                  }
                >
                  {cat}
                </Text>

              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={[styles.button, { marginBottom: 10 }]}
            onPress={() => setShowOnlyFavorites(!showOnlyFavorites)}
          >
            <Text>
              {showOnlyFavorites ? "⭐ Mostrar todas" : "⭐ Mostrar só favoritas"}
            </Text>
          </TouchableOpacity>

    <FlatList
  data={filteredRecipes}
  keyExtractor={(item) => item.id}
  numColumns={2}
  columnWrapperStyle={{ justifyContent: "space-between" }}
  renderItem={({ item }) => {
    const isFav = favorites.includes(item.id);

    return (
      <TouchableOpacity
        style={styles.gridItem}
        onPress={() => handleSelectRecipe(item)}
      >
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={styles.gridImage}
            resizeMode="cover"
          />
        ) : null}

        <Text style={styles.gridTitle}>{item.title}</Text>
        <Text style={styles.gridCategory}>{item.type}</Text>

        <Text style={{ fontSize: 18 }}>
          {isFav ? "⭐" : "☆"}
        </Text>
      </TouchableOpacity>
    );
  }}
/>


        </>
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setSelectedRecipe(null);
          setScreen("form");
        }}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {screen === "details" && selectedRecipe && (
        <RecipeDetails
          recipe={selectedRecipe}
          recipes={recipes}
          setSelectedRecipe={setSelectedRecipe}
          onBack={() => setScreen("list")}
          onEdit={() => setScreen("form")}
          onToggleFavorite={() => toggleFavorite(selectedRecipe.id)}
          isFavorite={favorites.includes(selectedRecipe.id)}
        />
      )}


      {screen === "form" && (
        <RecipeForm
          initialRecipe={selectedRecipe}
          onSave={handleSaveRecipe}
          onCancel={() => setScreen("list")}
          categories={categories}
        />
      )}

    </SafeAreaView>
  );
}

/* =========================
   ESTILOS========================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#0E1D14",
  },

  appTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 14,
    color: "#C9A23F",
    textAlign: "center",
    letterSpacing: 1,
  },

  card: {
    backgroundColor: "#1C2F23",
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#C9A23F",
  },

  label: {
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 4,
    color: "#C9A23F",
  },

  input: {
    borderWidth: 1,
    borderColor: "#C9A23F",
    padding: 10,
    borderRadius: 8,
    color: "#F5F1E8",
    backgroundColor: "#0E1D14",
  },

  textArea: {
    height: 120,
  },

  row: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },

  button: {
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#C9A23F",
  },

  buttonText: {
    fontWeight: "bold",
    color: "#0E1D14",
  },

  buttonSecondary: {
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C9A23F",
  },

  buttonSecondaryText: {
    fontWeight: "bold",
    color: "#C9A23F",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#C9A23F",
    marginBottom: 6,
  },

  meta: {
    fontSize: 14,
    color: "#9CA3AF",
  },

  content: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: "#F5F1E8",
  },

  listItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#2F4A3A",
  },

  listItemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F5F1E8",
  },

  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },

  categoryButton: {
    borderWidth: 1,
    borderColor: "#C9A23F",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },

  categorySelected: {
    backgroundColor: "#C9A23F",
  },

  categoryText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#F5F1E8",
  },

  categoryTextSelected: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0E1D14", // texto escuro no fundo dourado
  },



  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E85D04",
    borderWidth: 2,
    borderColor: "#C9A23F",
  },

  fabText: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#F5F1E8",
  },

  searchInput: {
    borderWidth: 1,
    borderColor: "#C9A23F",
    borderRadius: 10,
    padding: 10,
    color: "#F5F1E8",
    backgroundColor: "#1C2F23",

    marginBottom: 10,
  },
  floatingBar: {
  position: "absolute",
  bottom: 20,
  left: 10,
  right: 10,

  flexDirection: "row",
  flexWrap: "wrap",              // ✅ PERMITE QUEBRAR LINHA
  justifyContent: "space-between",
  gap: 8,

  backgroundColor: "#1C2F23",
  padding: 12,
  borderRadius: 16,
  borderWidth: 1,
  borderColor: "#C9A23F",

  elevation: 10,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 5,
},



  floatingButton: {
  width: "32%",                  // ✅ 3 por linha
  backgroundColor: "#C9A23F",
  paddingVertical: 10,
  borderRadius: 12,
  alignItems: "center",
},


floatingSecondary: {
  width: "48%",                  // ✅ 2 por linha
  borderWidth: 1,
  borderColor: "#C9A23F",
  paddingVertical: 10,
  borderRadius: 12,
  alignItems: "center",
},

  gridItem: {
  width: "48%",
  backgroundColor: "#1C2F23",
  borderRadius: 12,
  padding: 8,
  marginBottom: 12,
  borderWidth: 1,
  borderColor: "#2F4A3A",
},

gridImage: {
  width: "100%",
  height: 120,
  borderRadius: 10,
  marginBottom: 6,
},

gridTitle: {
  fontSize: 14,
  fontWeight: "bold",
  color: "#F5F1E8",
},

gridCategory: {
  fontSize: 12,
  color: "#C9A23F",
},
notebookContainer: {
  backgroundColor: "#FFF8E7",
  padding: 16,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "#E0C097",
  marginVertical: 12,
},

notebookInput: {
  minHeight: 220,
  fontSize: 16,
  color: "#3B2A1A",
  lineHeight: 28, // distância entre linhas (efeito de caderno)
  fontFamily: "monospace", // efeito manuscrito
  backgroundColor: "transparent",
},
line: {
  height: 28,
  borderBottomWidth: 1,
  borderBottomColor: "#E6D3A3",
},

notebookAbsolute: {
  position: "absolute",
  top: 12,
  left: 16,
  right: 16,
  bottom: 12,
  fontSize: 16,
  color: "#3B2A1A",
  lineHeight: 28,
  fontFamily: "monospace",
},
actionBar: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#1b3328",
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: "#caa64b",
  },

  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  
  },
  botao: {
  width: "48%",
  paddingVertical: 14,
  borderRadius: 14,
  alignItems: "center",
  backgroundColor: "#caa64b",
}


});

