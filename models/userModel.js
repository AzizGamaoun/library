import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },

    Firstname: { type: String, required: true },

    Lastname: { type: String, required: true },

    role: {
      type: String,
      enum: ["admin", "etudiant"], 
      required: true,
      default: "etudiant" 
    },

    password: { type: String, required: true }
  },
  { timestamps: true }
);

const UserModel =
  mongoose.models.utilisateur || mongoose.model("utilisateur", UserSchema);

export default UserModel;
