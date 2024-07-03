import bcrypt from "bcrypt";

export const hashPasswords = async (password, cpassword) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const hashedCPassword = await bcrypt.hash(cpassword, saltRounds);
    return { hashedPassword, hashedCPassword };
  } catch (error) {
    console.log(error);
  }
};

export const comparePasswords = async (
  password,
  hashedPassword,
  cpassword,
  hashedCPassword
) => {
  const passwordMatch = await bcrypt.compare(password, hashedPassword);
  const cpasswordMatch = await bcrypt.compare(cpassword, hashedCPassword);
  return passwordMatch && cpasswordMatch;
};
