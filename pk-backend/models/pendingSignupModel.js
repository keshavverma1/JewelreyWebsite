import mongoose from "mongoose";

const pendingSignupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    acceptedTerms: {
      type: Boolean,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    otpExpiry: {
      type: Date,
      required: true,
    },

    signupExpiry: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

pendingSignupSchema.index(
  { signupExpiry: 1 },
  { expireAfterSeconds: 0 }
);

const pendingSignupModel = mongoose.model("PendingSignup", pendingSignupSchema);

export default pendingSignupModel;
