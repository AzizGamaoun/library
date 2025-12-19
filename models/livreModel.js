import mongoose from "mongoose";

const LivreSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },

    author: { type: String, required: true },

    genre: { type: String, required: true },

    pub_year: { type: Number, required: true },

    availability: { type: Boolean, required: true }
  },
  { timestamps: true }
);

const LivreModel =
  mongoose.models.livre || mongoose.model("livre", LivreSchema);

export default LivreModel;