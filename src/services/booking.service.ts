import bookingModel from "../models/booking.model";
import { ObjectId } from "mongoose";

class BookingService {
  async createBooking(bookingData: any) {
    const newBooking = new bookingModel(bookingData);
    return await newBooking.save();
  }

  async getBookingByUserId(userId: ObjectId) {
    return await bookingModel
      .find({
        $or: [{ registeredUser: userId }, { guestUser: userId }],
      })
      .populate("event");
  }

  async getBookingById(bookingId: string) {
    return await bookingModel.findById(bookingId).populate("event");
  }

  async deleteBookingById(bookingId: string) {
    return await bookingModel.findByIdAndDelete(bookingId);
  }

  async getAllBookings() {
    return await bookingModel.find().populate("event").populate("transport");
  }
}

export default new BookingService();
