import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["todo", "in-progress", "completed"],
      default:"todo"
    },
    priority: {
      required: true,
      type: String,
      enum: ["low", "medium", "high", "urgent"],
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
const Task = mongoose.model("Task", TaskSchema);
export default Task;
