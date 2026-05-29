import "dotenv/config";

const requiredVars = ["MONGO_URI", "PORT"];
const jwtVars = [
  "JWT_SECRET",
  "CUSTOMMER_JWT_SECRET",
  "ADMINISTRATION_JWT_SECRET",
  "REGISTRATION_JWT_SECRET",
];

requiredVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Missing environment variable: ${varName}`);
  }
});

if (!jwtVars.some((varName) => process.env[varName])) {
  throw new Error(
    `Missing environment variable: one of ${jwtVars.join(", ")}`
  );
}

export default {
  NODE_ENV: process.env.NODE_ENV || "development",
  
  PORT: process.env.PORT || 5000,
  
  DB_URI: process.env.DB_URI || process.env.MONGO_URI,
  
  JWT_SECRET: process.env.JWT_SECRET,
  
  CUSTOMMER_JWT_SECRET: process.env.CUSTOMMER_JWT_SECRET,
  ADMINISTRATION_JWT_SECRET: process.env.ADMINISTRATION_JWT_SECRET,
  REGISTRATION_JWT_SECRET: process.env.REGISTRATION_JWT_SECRET,
  
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  
  SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10,
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  
  FORGET_PASSWORD_TOKEN_SECRET: process.env.FORGET_PASSWORD_TOKEN_SECRET,
  FORGET_PASSWORD_TOKEN_EXPIRES_IN: process.env.FORGET_PASSWORD_TOKEN_EXPIRES_IN,
  
  FRONTEND_URL: process.env.FRONTEND_URL,
  NETWORK_URL: process.env.NETWORK_URL,
  API_VERSION: process.env.API_VERSION || "v1",
};
