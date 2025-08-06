import userModel from "../models/user.model";
import { ObjectId } from "mongoose";

class UserService {
  async getUserById(id: ObjectId) {
    const user = await userModel.findById(id);
    return user;
  }
  async getAllUsers() {
    const users = await userModel.find();
    return users;
  }
}

export default new UserService();
