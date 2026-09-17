import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
    },
    description: {
      type: String,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    createdBy: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      required: true,
      enum: ["planning", "active", "completed", "on-hold"],
    },
    startDate: {
      type: Date,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
const Project = mongoose.model("Project", ProjectSchema);
export default Project;
