import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Session from "../models/session.model.js";

// Register Function Logic
export async function Register(req, res) {
  const { username, email, password } = req.body;

  const isUserExist = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (isUserExist) {
    return res.json("User Already Exist !");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User({
    username: username,
    email: email,
    password: hashedPassword,
  });

  res.status(201).json({
    message: "User registered Successfully",
    user,
  });
}
// Login Function Logic
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
      userId: user._id,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "15m",
    },
  );
  const RefreshToken = jwt.sign(
    {
      username,
      userId: user._id,
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

// Refresh function logic (Refresh Token Rotation)
export async function Refresh(req, res) {
  const RefreshToken = req.cookies.refreshToken;
  const decoded = jwt.verify(RefreshToken, process.env.JWT_SECRET_KEY);
  const user = decoded;

  const Sessions = await Session.find({
    userId: user.userId,
     revoked: false,
  });
  let userSession = null;
  for (const s of Sessions) {
    const isRefreshToken_Valid = await bcrypt.compare(
      RefreshToken,
      s.refreshTokenHash,
    );
    if (isRefreshToken_Valid) {
      userSession = s;
      break;
    }
  }
  if (userSession === null) {
    return res.json({
      message: "Refresh Token is not Valid",
    });
  }

  const NewAccessToken = jwt.sign(
    {
      username: user.username,
      userId: user.userId,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "15m",
    },
  );

  const NewRefreshToken = jwt.sign(
    {
      username: user.username,
      userId: user.userId,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "7d",
    },
  );

  const NewRefreshTokenHash = await bcrypt.hash(NewRefreshToken, 10);
  userSession.refreshTokenHash = NewRefreshTokenHash;
  await userSession.save();

  res.json({
    message: "New Access and Refresh Token is Generated",
    NewAccessToken,
  });
}

// Logout function logic
export async function Logout(req, res) {
  const RefreshToken = req.cookies.refreshToken;
  const decoded = jwt.verify(RefreshToken, process.env.JWT_SECRET_KEY);
  const user = decoded;

  const Sessions = await Session.find({
    userId: user.userId,
    revoked: false,
  });
  let userSession = null;
  for (const s of Sessions) {
    const isRefreshToken_Valid = await bcrypt.compare(
      RefreshToken,
      s.refreshTokenHash,
    );
    if (isRefreshToken_Valid) {
      userSession = s;
      break;
    }
  }
  if (userSession === null) {
    return res.json({
      message: "Refresh Token is not Valid",
    });
  }
  userSession.revoked = true;
  await userSession.save();

  res.clearCookie("refreshToken");
  res.json({
    message: "User Logout Successfully",
  });
}
// Logout-all function Logic
export async function LogoutAll(req, res) {
  const RefreshToken = req.cookies.refreshToken;
  const decoded = jwt.verify(RefreshToken, process.env.JWT_SECRET_KEY);
  const user = decoded;

  const Sessions = await Session.find({
    userId: user.userId,
    revoked: false,
  });

  for (const s of Sessions) {
    s.revoked = true;
    await s.save();
  }
  if (Sessions.length === 0) {
    return res.json({
      message: "Refresh Token is not Valid",
    });
  }

  res.clearCookie("refreshToken");
  res.json({
    message: "Logout from All devices Successfully",
  });
}
