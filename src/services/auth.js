import api from "./api";

export async function login(cpf, password) {
  const response = await api.post("login/", {
    cpf,
    password,
  });

  localStorage.setItem("access", response.data.access);
  localStorage.setItem("refresh", response.data.refresh);

  return response.data;
}

export async function getMe() {
  const response = await api.get("me/");
  return response.data;
}

export function logout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}
