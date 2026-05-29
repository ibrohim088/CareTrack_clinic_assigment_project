import bcrypt from "bcryptjs";

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT_ROUNDS) || 10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = (password, hash) => bcrypt.compare(password, hash);
