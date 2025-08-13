import { body, param } from "express-validator";
const paymentValidator = {
  create: [
    body("amount")
      .exists()
      .withMessage("amount was not provided")
      .bail()
      .isNumeric()
      .withMessage("amount must be a number"),
    body("bookingId")
      .exists()
      .withMessage("bookingId was not provided")
      .bail()
      .isMongoId()
      .withMessage("bookingId must be a valid mongo id"),
  ],
  paymentIntent: [
    param("paymentIntentId")
      .exists()
      .withMessage("paymentIntentId was not provided")
      .bail()
      .isString()
      .withMessage("paymentIntentId must be a string"),
  ],
};

export default paymentValidator;
