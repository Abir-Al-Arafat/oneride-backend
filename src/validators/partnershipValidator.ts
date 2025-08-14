import { body, param } from "express-validator";

const partnershipValidator = {
  create: [
    body("organizerName")
      .exists()
      .withMessage("organizerName was not provided")
      .bail()
      .isString()
      .withMessage("organizerName must be a string"),
    body("eventName")
      .exists()
      .withMessage("eventName was not provided")
      .bail()
      .isString()
      .withMessage("eventName must be a string"),
    body("organizerEmail")
      .exists()
      .withMessage("organizerEmail was not provided")
      .bail()
      .isEmail()
      .withMessage("organizerEmail must be a valid email address"),
    body("eventDate")
      .exists()
      .withMessage("eventDate was not provided")
      .bail()
      .isString()
      .withMessage("eventDate must be a string"),
    body("eventLocation")
      .exists()
      .withMessage("eventLocation was not provided")
      .bail()
      .isString()
      .withMessage("eventLocation must be a string"),
    body("transportationNeeds")
      .exists()
      .withMessage("transportationNeeds was not provided")
      .bail()
      .isString()
      .withMessage("transportationNeeds must be a string"),
  ],

  togglePartnership: [
    param("id")
      .exists()
      .withMessage("id was not provided")
      .bail()
      .isMongoId()
      .withMessage("id must be a valid mongo id"),
    body("status")
      .exists()
      .withMessage("status was not provided")
      .bail()
      .isString()
      .withMessage("status must be a string")
      .bail()
      .isIn(["pending", "approved", "rejected"])
      .withMessage(
        "status must be one of the following: pending, approved, rejected"
      ),
  ],
};

export default partnershipValidator;
