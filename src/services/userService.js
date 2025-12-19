import axios from "axios";

const API_URL = "http://localhost:4000/api/user"; // adapte si besoin

// Récupérer le token du localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const userService = {
  // 🔹 Inscription
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      // Sauvegarder token localStorage
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Erreur inscription" };
    }
  },

  // 🔹 Login
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Erreur login" };
    }
  },
  

  // 🔹 Update user
  update: async (id, updateData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updateData, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Erreur update" };
    }
  },

  // 🔹 Delete user
  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Erreur suppression" };
    }
  },

  // 🔹 Logout
  logout: () => {
    localStorage.removeItem("token");
  },

  // 🔹 Get current user (optionnel)
  getCurrentUser: () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const base64Payload = token.split(".")[1];
      const payload = JSON.parse(atob(base64Payload));
      return payload;
    } catch (error) {
      return error.message||null;
    }
  },

getAllUsers: async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Erreur récupération utilisateurs" };
  }
},

};


export default userService;
