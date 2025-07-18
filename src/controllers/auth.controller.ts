import { Request, Response } from "express";
import { validationResult } from "express-validator";

import jwt from "jsonwebtoken";
import twilio from "twilio";
import { success, failure, generateRandomCode } from "../utilities/common";
import {
  registerUser,
  authenticateUser,
  generateOTP,
  resetUserPassword,
  updatePassword,
  verifyEmailService,
  checkEmailVerification,
} from "../services/auth.service";
import User from "../models/user.model";
import Phone from "../models/phone.model";

import HTTP_STATUS from "../constants/statusCodes";
import { emailWithNodemailerGmail } from "../config/email.config";
import { CreateUserQueryParams } from "../types/query-params";

import { TUploadFields } from "../types/upload-fields";
import { UserRequest } from "../interfaces/user.interface";

const sendVerificationCodeToPhone = async (req: Request, res: Response) => {
  try {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID as string,
      process.env.TWILIO_AUTH_TOKEN as string
    );

    const { phone } = req.body;

    if (!phone) {
      return res.status(400).send(success("Phone number is required"));
    }

    const phoneNumberVerifyCode = generateRandomCode(4);

    const newPhone = await Phone.create({
      email: phone,
      phoneNumberVerifyCode,
    });

    const message = await client.messages.create({
      body: `Your verification code is ${phoneNumberVerifyCode}`,
      from: "+14176203785",
      to: phone,
    });

    await newPhone.save();

    console.log("verification", message);

    return res.status(HTTP_STATUS.OK).send(
      success("Verification code sent successfully", {
        message,
      })
    );
  } catch (err) {
    console.log(err);
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("INTERNAL SERVER ERROR"));
  }
};

const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { email, emailVerifyCode } = req.body;

    if (!email || !emailVerifyCode) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("Please provide email and code"));
    }

    const isVerified = await verifyEmailService(email, emailVerifyCode);

    if (isVerified) {
      return res
        .status(HTTP_STATUS.OK)
        .send(success("Email verified successfully"));
    }
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .send(failure("Invalid verification code"));
  } catch (err) {
    console.log(err);
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("INTERNAL SERVER ERROR"));
  }
};

const signup = async (req: Request, res: Response) => {
  try {
    const validation = validationResult(req).array();
    if (validation.length) {
      return res
        .status(HTTP_STATUS.OK)
        .send(failure("Failed to add the user", validation[0].msg));
    }

    const { name, email, password, roles } = req.body;

    if (roles === "admin") {
      return res
        .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
        .send(failure(`Admin cannot be signed up`));
    }

    const emailCheck = await User.findOne({ email });

    if (emailCheck && !emailCheck.emailVerified) {
      return res
        .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
        .send(failure(`User with email: ${email} already exists`));
    }

    if (emailCheck) {
      return res
        .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
        .send(failure(`User with email: ${email} already exists`));
    }

    const newUser = await registerUser(name, email, password);

    const expiresIn = process.env.JWT_EXPIRES_IN
      ? parseInt(process.env.JWT_EXPIRES_IN, 10)
      : 3600; // default to 1 hour if not set

    const token = jwt.sign(
      {
        _id: newUser._id,
        roles: newUser.roles,
      },
      process.env.JWT_SECRET ?? "default_secret",
      {
        expiresIn,
      }
    );
    res.setHeader("Authorization", token);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production" ? true : false,
      maxAge: expiresIn * 1000,
    });
    if (newUser) {
      return res
        .status(HTTP_STATUS.OK)
        .send(success("Account created successfully ", { newUser, token }));
    }
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .send(failure("Account couldnt be created"));
  } catch (err) {
    console.log(err);
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Internal server error"));
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const validation = validationResult(req).array();
    console.log(validation);
    if (validation.length) {
      return res
        .status(HTTP_STATUS.OK)
        .send(failure("Failed to login", validation[0].msg));
    }

    const { email, password } = req.body;
    const user = await authenticateUser(email, password);

    if (!user) {
      return res
        .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
        .send(failure("Invalid email or password"));
    }

    if (user.googleId) {
      return res
        .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
        .send(failure("Please login with google account"));
    }

    if (!user.emailVerified) {
      return res
        .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
        .send(failure("Please verify your email"));
    }

    const expiresIn = process.env.JWT_EXPIRES_IN
      ? parseInt(process.env.JWT_EXPIRES_IN, 10)
      : 3600; // default to 1 hour if not set

    const token = jwt.sign(
      {
        _id: user._id,
        roles: user.roles,
      },
      process.env.JWT_SECRET ?? "default_secret",
      {
        expiresIn,
      }
    );

    res.setHeader("Authorization", token);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production" ? true : false,
      maxAge: expiresIn * 1000,
    });

    return res
      .status(HTTP_STATUS.OK)
      .send(success("Login successful", { user, token }));
  } catch (err) {
    console.log(err);
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Internal server error"));
  }
};

const sendOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("Please provide email"));
    }

    const otp = await generateOTP(email);

    if (!otp) {
      return res
        .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
        .send(failure("User not found"));
    }

    const emailData = {
      email,
      subject: "OTP Verification",
      html: `
                    <h6>Hello, ${email}</h6>
                    <p>Your OTP is <h6>${otp}</h6> to verify your account</p>
                    
                  `,
    };

    emailWithNodemailerGmail(emailData);

    return res
      .status(HTTP_STATUS.OK)
      .send(success("OTP sent successfully", { otp }));
  } catch (err) {
    console.log(err);
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Internal server error"));
  }
};

const resetPassword = async (req: Request, res: Response) => {
  try {
    const validation = validationResult(req).array();
    console.log(validation);
    if (validation.length) {
      return res
        .status(HTTP_STATUS.OK)
        .send(failure("Password reset failed", validation[0].msg));
    }

    const { email, password } = req.body;

    const emailVerified = await checkEmailVerification(email);

    if (!emailVerified) {
      return res
        .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
        .send(failure("Please verify your email"));
    }

    const isUpdated = await resetUserPassword(email, password);

    if (!isUpdated) {
      return res
        .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
        .send(failure("User not found"));
    }

    return res
      .status(HTTP_STATUS.OK)
      .send(success("Password reset successfully"));
  } catch (err) {
    console.log(err);
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Internal server error"));
  }
};

const changePassword = async (req: UserRequest, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return res
        .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
        .send(failure("please login"));
    }
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(
          failure(
            "Please provide old password, new password and confirm new password"
          )
        );
    }

    if (newPassword !== confirmNewPassword) {
      return res
        .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
        .send(failure("New password and confirm password do not match"));
    }

    const isUpdated = await updatePassword(
      req.user!._id.toString(),
      oldPassword,
      newPassword
    );

    if (!isUpdated) {
      return res
        .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
        .send(failure("Old password is incorrect"));
    }

    return res
      .status(HTTP_STATUS.OK)
      .send(success("Password changed successfully"));
  } catch (err) {
    console.log(err);
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Internal server error"));
  }
};

export {
  signup,
  login,
  sendVerificationCodeToPhone,
  sendOTP,
  verifyEmail,
  resetPassword,
  changePassword,
};
