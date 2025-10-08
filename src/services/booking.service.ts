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
    return await bookingModel
      .findById(bookingId)
      .populate("event")
      .populate("registeredUser")
      .populate("guestUser");
  }

  async deleteBookingById(bookingId: string) {
    return await bookingModel.findByIdAndDelete(bookingId);
  }

  async getAllBookings(query?: any) {
    const { search, page = 1, limit = 0 } = query || {};

    // populate event and transport; use populate.match to avoid pulling unrelated fields,
    // but Mongoose will still return bookings with event === null if no match, so we filter after.
    let bookings = await bookingModel
      .find()
      .populate({
        path: "event",
        // do not set match here if you want to support sorting/pagination across all bookings easily.
        // we'll filter by title below if search provided.
      })
      .populate("transport");

    // If search provided, filter bookings by event.title (case-insensitive)
    if (search) {
      const re = new RegExp(String(search), "i");
      bookings = bookings.filter(
        (b: any) =>
          b.event && typeof b.event.title === "string" && re.test(b.event.title)
      );
    }

    // apply pagination (if limit === 0 => return all)
    if (Number(limit) > 0) {
      const p = Math.max(1, Number(page));
      const l = Math.max(1, Number(limit));
      const start = (p - 1) * l;
      const paged = bookings.slice(start, start + l);
      const totalItems = bookings.length;
      const totalPages = Math.ceil(totalItems / l);
      return {
        result: paged,
        currentPage: p,
        totalPages,
        totalItems,
      };
    }
    // no pagination requested -> return full array
    return bookings;
  }
}

export default new BookingService();
