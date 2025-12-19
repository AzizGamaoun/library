import express from "express";
import { createLoan, returnLoan, getAllLoans ,deleteLoan } from "../controllers/loanControlller.js";


const router = express.Router();

// Créer un emprunt (protégé)
router.post("/", createLoan);

// Retourner un livre
router.put("/return/:loan_id", returnLoan);

// Lister tous les emprunts
router.get("/", getAllLoans);
router.delete("/:id", deleteLoan);
export default router;
