import { Request, Response } from "express";
import { validationResult } from "express-validator";
import HTTP_STATUS from "../constants/statusCodes";
import { success, failure } from "../utilities/common";
import { UserRequest } from "../interfaces/user.interface";
import bookingService from "../services/booking.service";
import guestService from "../services/guest.service";
import userService from "../services/user.service";
import { getEventServiceById } from "../services/event.service";
import TransportService from "../services/transport.service";
class BookingController {
  async createBookingRegisteredUser(req: UserRequest, res: Response) {
    try {
      if (!req.user || !req.user._id) {
        return res
          .status(HTTP_STATUS.UNAUTHORIZED)
          .send(failure("User not authenticated"));
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send(failure("Validation failed", errors.array()[0].msg));
      }
      const userId = req.user?._id;

      if (!userId) {
        return res
          .status(HTTP_STATUS.UNAUTHORIZED)
          .send(failure("User not authenticated"));
      }

      const user = userId && (await userService.getUserById(userId));

      if (!user) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("User not found"));
      }

      const event = await getEventServiceById(req.body.event);
      if (!event) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("Event not found"));
      }

      if (event.totalSeat < req.body.ticketCount) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send(failure("Not enough seats available"));
      }

      const transport = await TransportService.getTransportById(
        req.body.transport
      );
      if (!transport) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("Transport not found"));
      }

      const newBooking = await bookingService.createBooking({
        ...req.body,
        registeredUser: userId,
      });
      return res
        .status(HTTP_STATUS.CREATED)
        .send(success("Booking created", newBooking));
    } catch (error: any) {
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Error creating booking", error.message));
    }
  }

  async createBookingGuestUser(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send(failure("Validation failed", errors.array()[0].msg));
      }

      const event = await getEventServiceById(req.body.event);
      if (!event) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("Event not found"));
      }

      const guestUser = await guestService.getGuestByEmail(req.body.email);

      if (!guestUser) {
        const newGuestUser = await guestService.createGuest({
          ...req.body,
          roles: ["guest"],
        });
        if (!newGuestUser) {
          return res
            .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
            .send(failure("Error creating guest user"));
        }
        req.body.guestUser = newGuestUser._id;
      } else {
        req.body.guestUser = guestUser._id;
      }

      const newBooking = await bookingService.createBooking(req.body);
      return res
        .status(HTTP_STATUS.CREATED)
        .send(success("Booking created", newBooking));
    } catch (error: any) {
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Error creating booking", error.message));
    }
  }

  async deleteBookingById(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send(failure("Validation failed", errors.array()[0].msg));
      }
      const deletedBooking = await bookingService.deleteBookingById(
        req.params.id
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(success("Booking deleted", deletedBooking));
    } catch (error: any) {
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Error deleting booking", error.message));
    }
  }

  async getAllBookings(req: Request, res: Response) {
    try {
      const allBookings = await bookingService.getAllBookings();
      return res
        .status(HTTP_STATUS.OK)
        .send(success("All bookings", allBookings));
    } catch (error: any) {
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Error getting all bookings", error.message));
    }
  }

  async getBookingById(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send(failure("Validation failed", errors.array()[0].msg));
      }
      const booking = await bookingService.getBookingById(req.params.id);
      return res.status(HTTP_STATUS.OK).send(success("Booking found", booking));
    } catch (error: any) {
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Error getting booking", error.message));
    }
  }
}

export default new BookingController();
