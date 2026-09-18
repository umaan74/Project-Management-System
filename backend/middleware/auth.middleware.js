import jwt from "jsonwebtoken";

export async function AuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: "Token not Found" });
  }
  const AccessToken = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(AccessToken, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Something went wrong",
    });
  }
}
