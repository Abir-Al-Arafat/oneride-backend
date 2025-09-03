import { body, param } from "express-validator";
const bookingValidator = {
  create: [
    body("event")
      .exists()
      .withMessage("event was not provided")
      .bail()
      .isMongoId()
      .withMessage("event must be a valid mongo id"),
    body("transport")
      .exists()
      .withMessage("transport was not provided")
      .bail()
      .isMongoId()
      .withMessage("transport must be a valid mongo id"),
    body("ticketCount")
      .exists()
      .withMessage("ticketCount was not provided")
      .bail()
      .isInt()
      .withMessage("ticketCount must be an integer"),
  ],
};

export default bookingValidator;
