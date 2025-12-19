import axios from "axios";

const API_URL = "http://localhost:4000/api/livre"; // adapte selon ton backend

const livreService = {
  // 🔹 Créer un livre
  createLivre: async (livreData) => {
    try {
      const response = await axios.post(API_URL, livreData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Erreur création livre" };
    }
  },

  // 🔹 Récupérer tous les livres
  getAllLivres: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Erreur récupération livres" };
    }
  },

  // 🔹 Récupérer un livre par ID
  getLivreById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Erreur récupération livre" };
    }
  },

  // 🔹 Mettre à jour un livre
  updateLivre: async (id, updateData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Erreur mise à jour livre" };
    }
  },

  // 🔹 Supprimer un livre
  deleteLivre: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Erreur suppression livre" };
    }
  },
};

export default livreService;
