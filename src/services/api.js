const API_URL = "http://127.0.0.1:8000/api/";

export async function login(dados) {
  const response = await fetch(`${API_URL}/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });

  return await response.json();
}

export async function cadastro(dados) {
  const response = await fetch(`${API_URL}/cadastro/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });

  return await response.json();
}
