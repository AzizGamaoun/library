import axios from "axios";

const API_URL = "http://localhost:4000/api/loan"; // adapte selon ton backend

const loanService = {
  // 🔹 Créer un emprunt
  createLoan: async (loanData) => {
    try {
      const response = await axios.post(API_URL, loanData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Erreur création emprunt" };
    }
  },

  // 🔹 Retourner un livre
  returnLoan: async (loan_id) => {
    try {
      const response = await axios.put(`${API_URL}/return/${loan_id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Erreur retour livre" };
    }
  },

  // 🔹 Lister tous les emprunts
  getAllLoans: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Erreur récupération emprunts" };
    }
  },

  // 🔹 Supprimer un emprunt
  deleteLoan: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Erreur suppression emprunt" };
    }
  },
};

export default loanService;
