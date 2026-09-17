import mongoose from "mongoose";
const SessionSchema =new mongoose.Schema(
  {
    userId: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    refreshTokenHash: {
      type: String,
      required: true,
    },
    revoked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true
  },
);

const Session=mongoose.model("Session",SessionSchema);
export default Session;