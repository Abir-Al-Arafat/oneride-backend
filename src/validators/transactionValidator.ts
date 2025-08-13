import { body, param } from "express-validator";
const transactionValidator = {
  create: [
    body("bookingId")
      .exists()
      .withMessage("bookingId was not provided")
      .bail()
      .isMongoId()
      .withMessage("bookingId must be a valid mongo id"),
    body("amount")
      .exists()
      .withMessage("amount was not provided")
      .bail()
      .isNumeric()
      .withMessage("amount must be a number"),
    body("paymentIntentId")
      .exists()
      .withMessage("paymentIntentId was not provided")
      .bail()
      .isString()
      .withMessage("paymentIntentId must be a string"),
    body("status")
      .exists()
      .withMessage("status was not provided")
      .bail()
      .isString()
      .withMessage("status must be a string")
      .bail()
      .isIn(["pending", "success", "failed"])
      .withMessage("status must be pending, success, failed"),
  ],
};

export default transactionValidator;
