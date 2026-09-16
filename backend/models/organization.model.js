import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
      trime: true,
    },
    inviteCode: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Organization = mongoose.model("Organization", organizationSchema);
export default Organization;
