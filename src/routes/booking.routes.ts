import express from "express";
import BookingController from "../controllers/booking.controller";
import multer from "multer";

import {
  isAuthorizedUser,
  isAuthorizedAdmin,
  isAuthorizedSuperAdmin,
} from "../middlewares/authValidationJWT";

import { mongoDBIdValidator } from "../middlewares/validation";

import bookingValidator from "../validators/bookingValidator";
import guestValidator from "../validators/guestValidator";

const routes = express();
const upload = multer();

routes.post(
  "/auth-user",
  upload.none(),
  bookingValidator.create,
  isAuthorizedUser,
  BookingController.createBookingRegisteredUser
);

routes.post(
  "/guest-user",
  upload.none(),
  guestValidator.create,
  bookingValidator.create,
  BookingController.createBookingGuestUser
);

routes.get("/", BookingController.getAllBookings);

routes.get("/:id", mongoDBIdValidator, BookingController.getBookingById);

routes.delete("/:id", mongoDBIdValidator, BookingController.deleteBookingById);

export default routes;
