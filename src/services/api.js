const API_URL = "https://congolinaria.com.br/api/receita_autoral.php";

export async function fetchRecipes() {
  const res = await fetch(API_URL);
  const json = await res.json();
  return json.dados || [];
}
