import mongoose from "mongoose";

const ProjectMemberSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    userId: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
    },
    assignedBy: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assignedAt: {
      required: true,
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const ProjectMember = mongoose.model("ProjectMember", ProjectMemberSchema);
export default ProjectMember;
