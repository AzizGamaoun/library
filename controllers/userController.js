import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";


import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: "3d" }
  );
};

export default generateToken;

const inscriptionUser = async (req, res) => {
  try {
    const { email, Firstname, Lastname, password, role } = req.body;

    // Vérifier si l'utilisateur existe
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création utilisateur
    const newUser = new UserModel({
      email,
      Firstname,
      Lastname,
      role: role || "etudiant", // par défaut
      password: hashedPassword,
    });

    await newUser.save();

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, Firstname, Lastname, role, password } = req.body;

    // 1️⃣ Vérifier existence user
    const user = await UserModel.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Utilisateur introuvable" });
    }

    // 2️⃣ Vérifier rôle valide
    if (role && !["admin", "etudiant"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Rôle invalide"
      });
    }

    // 3️⃣ Mise à jour des champs
    if (email) user.email = email;
    if (Firstname) user.Firstname = Firstname;
    if (Lastname) user.Lastname = Lastname;
    if (role) user.role = role;

    // 4️⃣ Hash du mot de passe si modifié
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    // 5️⃣ Ne pas retourner le password
    const { password: _, ...userData } = user.toObject();

    res.status(200).json({
      success: true,
      message: "Utilisateur mis à jour",
      user: userData
    });
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur"
    });
  }
};
// DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Vérifier existence
    const user = await UserModel.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Utilisateur introuvable" });
    }

    // 2️⃣ Supprimer
    await UserModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Utilisateur supprimé avec succès"
    });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur"
    });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().select("-password"); // ne pas renvoyer le password
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("GET ALL USERS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};


export { loginUser, inscriptionUser };