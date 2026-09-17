// Purpose: kaunsa user kis organization ka member hai aur us organization mein uska role kya hai.
// OrganizationMember = User aur Organization ke beech relationship
import mongoose from "mongoose";

const organizationMember_Schema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Organization",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique:true
  },
  role: {
    type: String,
    enum: ["admin", "member"],
  },
});
const OrganizationMember = mongoose.model(
  "OrganizationMember",
  organizationMember_Schema,
);

export default OrganizationMember;
