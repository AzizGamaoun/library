import express from "express";
import {
  createLivre,
  getAllLivres,
  getLivreById,
  updateLivre,
  deleteLivre
} from "../controllers/livreController.js";

const router = express.Router();

router.post("/", createLivre);          // Créer un livre
router.get("/", getAllLivres);         // Tous les livres
router.get("/:id", getLivreById);      // Un livre par ID
router.put("/:id", updateLivre);       // Mettre à jour un livre
router.delete("/:id", deleteLivre);    // Supprimer un livre

export default router;
