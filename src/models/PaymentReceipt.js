import mongoose from "mongoose";

const PaymentReceiptSchema = new mongoose.Schema(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applicantId: {
      type: String,
      required: true,
    },
    fullName: String,
    email: String,
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "NGN",
    },
    paystackReference: {
      type: String,
      required: true,
      unique: true,
    },
    paidAt: {
      type: Date,
      required: true,
    },
    channel: String,
  },
  { timestamps: true },
);

export default mongoose.models.PaymentReceipt ||
  mongoose.model("PaymentReceipt", PaymentReceiptSchema);
