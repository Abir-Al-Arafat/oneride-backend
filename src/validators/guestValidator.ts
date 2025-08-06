import { body, param } from "express-validator";
const guestValidator = {
  create: [
    body("firstName")
      .exists()
      .withMessage("firstName was not provided")
      .bail()
      .isString()
      .withMessage("firstName must be a string"),
    body("lastName")
      .exists()
      .withMessage("lastName was not provided")
      .bail()
      .isString()
      .withMessage("lastName must be a string"),
    body("phone")
      .exists()
      .withMessage("phone was not provided")
      .bail()
      .isString()
      .withMessage("phone must be a string"),
    body("email")
      .exists()
      .withMessage("email was not provided")
      .bail()
      .isEmail()
      .withMessage("email must be a valid email address"),
    body("gender")
      .exists()
      .withMessage("gender was not provided")
      .bail()
      .isString()
      .withMessage("gender must be a string")
      .bail()
      .isIn(["male", "female", "other"])
      .withMessage("gender must be either 'male', 'female' or 'other'"),
  ],
};
export default guestValidator;
