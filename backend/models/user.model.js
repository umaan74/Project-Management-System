import mongoose from "mongoose";
// required: true
// → field hona compulsory

// unique: true
// → same email normally duplicate nahi hona chahiye

// minlength
// → minimum characters

// maxlength
// → maximum characters

// trim: true
// → extra spaces remove

// lowercase: true
// → email lowercase mein store

// default
// → value nahi di to default value
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 4,
      maxlength: 12,
      trim: true
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
      minlength: 8,
    //   NO max length because password hash hone ke baad uski length bad jaati hai
      trim: true,
    },
    profilePicture: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const User=mongoose.model("User",userSchema);
export default User;