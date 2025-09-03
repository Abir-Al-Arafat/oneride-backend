import fs from "fs";
import path from "path";
import { ObjectId } from "mongoose";
import userModel from "../models/user.model";
import { IUser } from "../interfaces/user.interface";
import { TUploadFields } from "../types/upload-fields";

class UserService {
  async getUserById(id: ObjectId) {
    const user = await userModel.findById(id);
    return user;
  }
  async getAllUsers() {
    const users = await userModel.find();
    return users;
  }
  async updateUserProfile(
    userId: ObjectId,
    data: IUser,
    file?: Express.Multer.File
  ) {
    const user = await userModel.findById(userId);
    if (!user) {
      return null; // caller handles not found
    }

    // if new image provided
    if (file) {
      // delete old image if exists
      if (user.image) {
        const oldImagePath = path.join(__dirname, "../../", user.image);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error("Failed to delete old image:", err);
        });
      }

      // define new file path
      const newFileName =
        Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
      const newFilePath = path.join("public/uploads/images", newFileName);

      // save buffer to disk
      fs.writeFileSync(newFilePath, file.buffer);

      // update user field
      user.image = `public/uploads/images/${newFileName}`;
    }

    // update other fields
    if (data.name) user.name = data.name;
    if (data.phone) user.phone = data.phone;
    if (data.gender) user.gender = data.gender;

    await user.save();

    return {
      name: user.name,
      phone: user.phone,
      image: user.image,
      gender: user.gender,
    };
  }

  async toggleBanService(userId: ObjectId) {
    const user = await userModel.findById(userId);
    if (!user) {
      return null; // caller handles not found
    }

    user.status === "active"
      ? (user.status = "banned")
      : (user.status = "active");

    await user.save();

    return {
      id: user._id,
      status: user.status,
    };
  }
}

export default new UserService();
