import jwt from "jsonwebtoken";

const secretMap = {
  customer: process.env.CUSTOMMER_JWT_SECRET,
  administration: process.env.ADMINISTRATION_JWT_SECRET,
  registration: process.env.REGISTRATION_JWT_SECRET,
  default: process.env.JWT_SECRET,
};

const getSecret = (type) => {
  if (type && secretMap[type]) return secretMap[type];
  if (secretMap.default) return secretMap.default;
  throw new Error("No JWT secret configured for token type");
};

const getTokenTypeByRole = (role) => {
  if (role === "patient") return "customer";
  if (role === "admin") return "administration";
  if (role === "clinician") return "registration";
  return "default";
};

export const generateToken = (payload = {}, options = {}) => {
  const tokenType =
    options.secretType || payload.tokenType || getTokenTypeByRole(payload.role);
  const secret = getSecret(tokenType);
  return jwt.sign({ ...payload, tokenType }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

export const verifyToken = (token) => {
  const decoded = jwt.decode(token);
  if (!decoded) throw new Error("Token not valid");

  const tokenType = decoded.tokenType || getTokenTypeByRole(decoded.role);
  const secret = getSecret(tokenType);
  return jwt.verify(token, secret);
};
