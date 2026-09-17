import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Session from "../models/session.model.js";

export async function Register(req, res) {
  const { username, email, password } = req.body;

  const isUserExist = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (isUserExist) {
    return res.json("User Already Exist !");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    username: username,
    email: email,
    password: hashedPassword,
  });

  res.status(201).json({
    message: "User registered Successfully",
    user,
  });
}
export async function Login(req, res) {
  const { username, password } = req.body;
  const user = await User.findOne({
    username,
  });
  if (!user) {
    return res.json("User doesn't Exist !\nPlease Register first");
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.json("Invalid Password!");
  }

  const AccessToken = jwt.sign(
    {
      username,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "15m",
    },
  );
  const RefreshToken = jwt.sign(
    {
      username,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "7d",
    },
  );

  const RefreshTokenHash = await bcrypt.hash(RefreshToken, 10);

  const userSession = await Session.create({
    userId: user._id,
    refreshTokenHash: RefreshTokenHash,
  });
  res.cookie("refreshToken", RefreshToken, {
    httpOnly: true,
  });
  res.json({
    message: "User Logined Successfully",
    AccessToken,
  });
}

