import { verifyToken } from "../utils/jwt.util.js";
import User from "../models/User.model.js";

const verifyAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer "))
      return res.status(401).json({ success: false, message: "Token not found" });

    const decoded = verifyToken(header.split(" ")[1]);
    const user = await User.findById(decoded.id).select("-password");
   
    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    req.user = user;
    next();
  } catch {
    res.status(401).json({ success: false, message: "Token not valid" });
  }
};

export default verifyAuth;
