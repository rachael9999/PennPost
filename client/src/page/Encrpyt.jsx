import bcrypt from 'bcryptjs';

const saltRounds = 10;

export const encryptPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

export const comparePasswords = async (plainPassword, hashedPassword) => (
  bcrypt.compare(plainPassword, hashedPassword));
