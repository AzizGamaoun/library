import LivreModel from "../models/livreModel.js";

// ---------------------- CREATE ----------------------
export const createLivre = async (req, res) => {
  try {
    const { title, author, genre, pub_year, availability } = req.body;

    // Vérifier si le livre existe déjà
    const existingLivre = await LivreModel.findOne({ title });
    if (existingLivre) {
      return res.status(400).json({
        success: false,
        message: "Le livre existe déjà",
      });
    }

    const newLivre = new LivreModel({
      title,
      author,
      genre,
      pub_year,
      availability,
    });

    await newLivre.save();

    res.status(201).json({
      success: true,
      message: "Livre créé avec succès",
      livre: newLivre,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// ---------------------- READ ALL ----------------------
export const getAllLivres = async (req, res) => {
  try {
    const livres = await LivreModel.find();
    res.status(200).json({
      success: true,
      livres,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// ---------------------- READ ONE ----------------------
export const getLivreById = async (req, res) => {
  try {
    const { id } = req.params;
    const livre = await LivreModel.findById(id);

    if (!livre) {
      return res.status(404).json({
        success: false,
        message: "Livre non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      livre,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// ---------------------- UPDATE ----------------------
export const updateLivre = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedLivre = await LivreModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedLivre) {
      return res.status(404).json({
        success: false,
        message: "Livre non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      message: "Livre mis à jour avec succès",
      livre: updatedLivre,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// ---------------------- DELETE ----------------------
export const deleteLivre = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedLivre = await LivreModel.findByIdAndDelete(id);

    if (!deletedLivre) {
      return res.status(404).json({
        success: false,
        message: "Livre non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      message: "Livre supprimé avec succès",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};
