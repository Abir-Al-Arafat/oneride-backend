import User from "../models/user.model";
import Phone from "../models/phone.model";
import { generateRandomCode } from "../utilities/common";
import { emailWithNodemailerGmail } from "../config/email.config";
import bcrypt from "bcryptjs";

const sendVerificationCode = async (phone: string) => {
  const phoneNumberVerifyCode = generateRandomCode(4);
  const newPhone = await Phone.create({
    email: phone,
    phoneNumberVerifyCode,
  });

  await newPhone.save();
  return phoneNumberVerifyCode;
};

const verifyEmailService = async (email: string, emailVerifyCode: string) => {
  const user = await User.findOne({ email, emailVerifyCode });
  if (user) {
    user.emailVerified = true;
    await user.save();
    return true;
  }
  return false;
};

const registerUser = async (name: string, email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const emailVerifyCode = generateRandomCode(4);
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    emailVerifyCode,
  });

  const emailData = {
    email: newUser.email,
    subject: "Account Activation Email",
    html: `<h6>Hello, ${newUser.name}</h6><p>Your email verification code is <h6>${emailVerifyCode}</h6> to verify your email</p>`,
  };

  emailWithNodemailerGmail(emailData);
  return newUser;
};

const authenticateUser = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select("+password");
  if (user && (await bcrypt.compare(password, user.password!))) {
    return user;
  }
  return null;
};

const generateOTP = async (email: string) => {
  const otp = generateRandomCode(4);
  const user = await User.findOne({ email });
  if (user) {
    user.emailVerifyCode = otp;
    user.emailVerified = false;
    await user.save();
    return otp;
  }
  return null;
};

const resetUserPassword = async (email: string, newPassword: string) => {
  const user = await User.findOne({ email });
  if (user) {
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return true;
  }
  return false;
};

const updatePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  const user = await User.findById(userId).select("+password");
  if (user && (await bcrypt.compare(oldPassword, user.password!))) {
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return true;
  }
  return false;
};

const checkEmailVerification = async (email: string) => {
  const user = await User.findOne({ email });
  if (user && user.emailVerified) {
    return true;
  }
  return false;
};

export {
  sendVerificationCode,
  verifyEmailService,
  registerUser,
  authenticateUser,
  generateOTP,
  resetUserPassword,
  updatePassword,
  checkEmailVerification,
};
