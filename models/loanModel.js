import mongoose from "mongoose";

const LoanSchema = new mongoose.Schema(
  {
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: "utilisateur", required: true },
    book_id: { type: mongoose.Schema.Types.ObjectId, ref: "livre", required: true },
    loan_date: { type: Date, default: Date.now },
    return_date: { type: Date, default: null },
  },
  { timestamps: true }
);

const LoanModel = mongoose.models.Loan || mongoose.model("Loan", LoanSchema);
export default LoanModel;
