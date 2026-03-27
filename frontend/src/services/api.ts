import axios from "axios";

// Cliente HTTP centralizado para evitar repetição de configuração entre os serviços do front
export const api = axios.create({
  baseURL: "http://localhost:5204",
  headers: {
    "Content-Type": "application/json",
  },
});