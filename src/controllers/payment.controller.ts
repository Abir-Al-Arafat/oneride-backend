import { Request, Response } from "express";
import { validationResult } from "express-validator";
import HTTP_STATUS from "../constants/statusCodes";
import { success, failure } from "../utilities/common";
import paymentService from "../services/payment.service";
import bookingService from "../services/booking.service";
import transactionService from "../services/transaction.service";
import { getEventServiceById } from "../services/event.service";
import { UserRequest } from "../interfaces/user.interface";

class PaymentController {
  async createPaymentIntent(req: UserRequest, res: Response) {
    try {
      if (!req.user || !req.user?._id) {
        return res
          .status(HTTP_STATUS.UNAUTHORIZED)
          .send(failure("User not authenticated"));
      }

      if (validationResult(req).array().length) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send(
            failure("Validation failed", validationResult(req).array()[0].msg)
          );
      }

      const { bookingId, amount } = req.body;

      const booking = await bookingService.getBookingById(bookingId);

      if (!booking) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("booking not found"));
      }

      const paymentIntent = await paymentService.createPaymentIntent(amount);

      if (!paymentIntent) {
        return res
          .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
          .send({ error: "Failed to create payment intent" });
      }

      booking.paymentIntentId = paymentIntent.id;
      await booking.save();

      res
        .status(HTTP_STATUS.OK)
        .send(success("Payment intent created", paymentIntent));
    } catch (error) {
      console.error(error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send({ error: "Failed to create payment intent" });
    }
  }

  async confirmPaymentByPaymentIntentId(req: UserRequest, res: Response) {
    if (!req.user || !req.user?._id) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .send(failure("User not authenticated"));
    }
    if (validationResult(req).array().length) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(
          failure("Validation failed", validationResult(req).array()[0].msg)
        );
    }
    req.body.userId = req.user._id;
    try {
      const booking = await bookingService.getBookingById(req.body.bookingId);

      if (!booking) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("Booking not found"));
      }

      const event = await getEventServiceById(booking.event._id.toString());
      if (!event) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("Event not found"));
      }
      if (event.totalSeat < booking.ticketCount) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send(failure("Not enough seats available"));
      }
      event.totalSeat -= booking.ticketCount;
      await event.save();
      const payment = await transactionService.createTransaction(req.body);
      res.status(HTTP_STATUS.OK).send(success("Payment confirmed", payment));
    } catch (error) {
      console.error(error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send({ error: "Failed to confirm payment" });
    }
  }

  async getPaymentByPaymentIntentId(req: Request, res: Response) {
    try {
      const payment = await paymentService.getPaymentIntent(
        req.params.paymentIntentId
      );
      res.status(HTTP_STATUS.OK).send(success("Payment found", payment));
    } catch (error) {
      console.error(error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send({ error: "Failed to get payment" });
    }
  }

  async getPaymentByBookingId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const booking = await bookingService.getBookingById(id);
      if (!booking) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("Booking not found"));
      }
      if (!booking.paymentIntentId) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("paymentIntentId not found for booking"));
      }
      const payment = await paymentService.getPaymentIntent(
        booking.paymentIntentId
      );
      res.status(HTTP_STATUS.OK).send(success("Payment found", payment));
    } catch (error) {
      console.error(error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send({ error: "Failed to get payment" });
    }
  }

  async getAllPayments(req: Request, res: Response) {
    try {
      const payments = await paymentService.getAllPaymentIntents();
      res.status(HTTP_STATUS.OK).send(success("Payments found", payments));
    } catch (error) {
      console.error(error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send({ error: "Failed to get payments" });
    }
  }
}

export default new PaymentController();
