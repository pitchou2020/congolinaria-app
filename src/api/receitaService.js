const API_URL = "https://congolinaria.com.br/api/receita_autoral.php";

export async function listarReceitas() {
  const res = await fetch(API_URL);
  return res.json();
}

export async function criarReceita(formData) {
  const res = await fetch(API_URL, {
    method: "POST",
    body: formData, // multipart
  });
  return res.json();
}

export async function editarReceita(id, formData) {
  const res = await fetch(`${API_URL}?id=${id}`, {
    method: "POST",
    body: formData,
  });
  return res.json();
}

export async function excluirReceita(id) {
  const res = await fetch(`${API_URL}?id=${id}`, {
    method: "DELETE",
  });
  return res.json();
}
