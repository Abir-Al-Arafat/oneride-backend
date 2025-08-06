import guestModel from "../models/guest.model";
import { IUser } from "../interfaces/message.interface";
import { ObjectId } from "mongoose";

class GuestService {
  async createGuest(guestData: IUser) {
    const guestUser = new guestModel(guestData);
    return await guestUser.save();
  }

  async getGuestById(userId: ObjectId) {
    return await guestModel.findById(userId);
  }

  async getGuestByEmail(email: string) {
    return await guestModel.findOne({ email: email });
  }
}

export default new GuestService();
