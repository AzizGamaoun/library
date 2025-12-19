import LoanModel from "../models/loanModel.js";
import LivreModel from "../models/livreModel.js";
import UserModel from "../models/userModel.js";

// Créer un emprunt
export const createLoan = async (req, res) => {
  try {
    const { book_id, student_id } = req.body;

    // 1️⃣ Validation
    if (!book_id || !student_id) {
      return res.status(400).json({ success: false, message: "book_id et student_id requis" });
    }

    const book = await LivreModel.findById(book_id);
    if (!book) return res.status(404).json({ success: false, message: "Livre non trouvé" });

    const student = await UserModel.findById(student_id);
    if (!student) return res.status(404).json({ success: false, message: "Étudiant non trouvé" });

    // 2️⃣ Vérifier disponibilité
    if (!book.availability) {
      return res.status(400).json({ success: false, message: "Ce livre est déjà emprunté !" });
    }

    // 3️⃣ Créer l'emprunt
    const loan = await LoanModel.create({
      book_id,
      student_id,
      loan_date: new Date(),
    });

    // 4️⃣ Mettre à jour le livre
    book.availability = false;
    await book.save();

    res.status(201).json({ success: true, message: "Emprunt validé !", loan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// Retourner un livre (mettre return_date et remettre disponible)
export const returnLoan = async (req, res) => {
  try {
    const { loan_id } = req.params;

    const loan = await LoanModel.findById(loan_id);
    if (!loan) return res.status(404).json({ success: false, message: "Emprunt non trouvé" });

    if (loan.return_date) {
      return res.status(400).json({ success: false, message: "Livre déjà retourné" });
    }

    // Mettre à jour loan
    loan.return_date = new Date();
    await loan.save();

    // Remettre le livre disponible
    const book = await LivreModel.findById(loan.book_id);
    book.availability = true;
    await book.save();

    res.status(200).json({ success: true, message: "Livre retourné avec succès", loan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// Lister tous les emprunts
export const getAllLoans = async (req, res) => {
  try {
    const loans = await LoanModel.find()
      .populate("book_id", "title author")
      .populate("student_id", "Firstname Lastname email");
    res.status(200).json({ success: true, loans });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};
export const deleteLoan = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Vérifier si l'emprunt existe
    const loan = await LoanModel.findById(id);
    if (!loan) {
      return res
        .status(404)
        .json({ success: false, message: "Emprunt introuvable" });
    }

    // 2️⃣ Si le livre n'a pas été retourné → le rendre disponible
    if (!loan.return_date) {
      await LivreModel.findByIdAndUpdate(loan.book_id, {
        availability: true
      });
    }

    // 3️⃣ Supprimer l'emprunt
    await LoanModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Emprunt supprimé avec succès"
    });
  } catch (error) {
    console.error("DELETE LOAN ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur"
    });
  }
};