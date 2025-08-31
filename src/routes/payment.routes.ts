import express from "express";
import PaymentController from "../controllers/payment.controller";
import multer from "multer";

import {
  isAuthorizedUser,
  isAuthorizedAdmin,
  isAuthorizedSuperAdmin,
} from "../middlewares/authValidationJWT";

import { mongoDBIdValidator } from "../middlewares/validation";
import paymentValidator from "../validators/paymentValidator";
import transactionValidator from "../validators/transactionValidator";

const routes = express();
const upload = multer();

routes.post(
  "/intents",
  upload.none(),
  paymentValidator.create,
  // isAuthorizedUser,
  PaymentController.createPaymentIntent
);

routes.post(
  "/intents/transactions",
  upload.none(),
  transactionValidator.create,
  isAuthorizedUser,
  PaymentController.confirmPaymentByPaymentIntentId
);

routes.get("/intents", upload.none(), PaymentController.getAllPayments);

routes.get(
  "/intents/:paymentIntentId",
  upload.none(),
  paymentValidator.paymentIntent,
  isAuthorizedUser,
  PaymentController.getPaymentByPaymentIntentId
);
// get payment by booking id
routes.get(
  "/intents/bookings/:id",
  upload.none(),
  mongoDBIdValidator,
  isAuthorizedUser,
  PaymentController.getPaymentByBookingId
);

// routes.post(
//   "/guest-user",
//   upload.none(),
//   guestValidator.create,
//   paymentValidator.create,
//   PaymentController.createBookingGuestUser
// );

// routes.get("/", PaymentController.getAllBookings);

// routes.get("/:id", mongoDBIdValidator, PaymentController.getBookingById);

// routes.delete("/:id", mongoDBIdValidator, PaymentController.deleteBookingById);

export default routes;
