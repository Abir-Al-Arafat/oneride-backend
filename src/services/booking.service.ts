import bookingModel from "../models/booking.model";

class BookingService {
  async createBooking(bookingData: any) {
    const newBooking = new bookingModel(bookingData);
    return await newBooking.save();
  }

  async getBookingById(bookingId: string) {
    return await bookingModel.findById(bookingId);
  }

  async deleteBookingById(bookingId: string) {
    return await bookingModel.findByIdAndDelete(bookingId);
  }

  async getAllBookings() {
    return await bookingModel.find().populate("event").populate("transport");
  }
}

export default new BookingService();
