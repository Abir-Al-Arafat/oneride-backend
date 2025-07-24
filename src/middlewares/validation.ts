import { body, param } from "express-validator";
import { resetPassword } from "../controllers/auth.controller";

const userValidator = {
  create: [
    body("name")
      .exists()
      .withMessage("name was not provided")
      .bail()
      .notEmpty()
      .withMessage("name cannot be empty")
      .bail()
      .isString()
      .withMessage("name must be a string"),
    body("email")
      .exists()
      .withMessage("Email was not provided")
      .bail()
      .notEmpty()
      .withMessage("Email cannot be empty")
      .bail()
      .isString()
      .withMessage("Email must be a string")
      .bail()
      .isEmail()
      .withMessage("Email format is incorrect"),
    body("phone")
      .exists()
      .withMessage("Phone number was not provided")
      .bail()
      .notEmpty()
      .withMessage("Phone number cannot be empty")
      .bail()
      .isString()
      .withMessage("Phone number must be a string")
      .bail()
      .isMobilePhone("any")
      .withMessage("Phone number format is incorrect"),
    body("gender")
      .isIn(["male", "female", "other"])
      .withMessage("Gender must be male, female or other"),
    body("address.area")
      .optional()
      .exists()
      .withMessage("area was not provided")
      .bail()
      .notEmpty()
      .withMessage("area cannot be empty")
      .bail()
      .isString()
      .withMessage("area must be a string"),
    body("address.city")
      .optional()
      .exists()
      .withMessage("city was not provided")
      .bail()
      .notEmpty()
      .withMessage("city cannot be empty")
      .bail()
      .isString()
      .withMessage("city must be a string"),
    body("address.country")
      .optional()
      .exists()
      .withMessage("country was not provided")
      .bail()
      .notEmpty()
      .withMessage("country cannot be empty")
      .bail()
      .isString()
      .withMessage("country must be a string"),
    body("balance")
      .isFloat({ min: 0, max: 1500 })
      .withMessage("balance must be grater than 0 and less than 1500"),
  ],
  update: [
    body("name")
      .optional()
      .notEmpty()
      .withMessage("Name is required")
      .bail()
      .isString()
      .withMessage("name must be a string"),
    body("email")
      .optional()
      .notEmpty()
      .withMessage("email is required")
      .bail()
      .isString()
      .withMessage("email must be a string")
      .bail()
      .isEmail()
      .withMessage("Email format is incorrect"),
    body("phone")
      .optional()
      .notEmpty()
      .withMessage("phone number cannot be empty")
      .bail()
      .isString()
      .withMessage("phone number must be a string")
      .bail()
      .isMobilePhone("any")
      .withMessage("Phone number format is incorrect"),
    body("gender")
      .optional()
      .notEmpty()
      .withMessage("gender cannot be empty")
      .bail()
      .isIn(["male", "female", "other"])
      .withMessage("Gender must be male, female or other"),
    body("address.area")
      .optional()
      .notEmpty()
      .withMessage("area cannot be empty")
      .bail()
      .isString()
      .withMessage("area must be a string"),
    body("address.city")
      .optional()
      .notEmpty()
      .withMessage("city cannot be empty")
      .bail()
      .isString()
      .withMessage("area must be a string"),
    body("address.country")
      .optional()
      .notEmpty()
      .withMessage("country cannot be empty")
      .bail()
      .isString()
      .withMessage("area must be a string"),
    body("balance")
      .optional()
      .isFloat({ min: 0, max: 1500 })
      .withMessage("balance must be greater than 0 and less than 1500"),
  ],
  delete: [
    param("id")
      .exists()
      .withMessage("User ID must be provided")
      .bail()
      .matches(/^[a-f\d]{24}$/i)
      .withMessage("ID is not in valid mongoDB format"),
  ],
};

const authValidator = {
  create: [
    body("email")
      .exists()
      .withMessage("Email was not provided")
      .bail()
      .notEmpty()
      .withMessage("Email cannot be empty")
      .bail()
      .isString()
      .withMessage("Email must be a string")
      .bail()
      .isEmail()
      .withMessage("Email format is incorrect"),
    body("password")
      .exists()
      .withMessage("Password was not provided")
      .bail()
      .isString()
      .withMessage("Password must be a string"),
    // .bail()
    // .isStrongPassword({
    //   minLength: 8,
    //   minNumbers: 1,
    //   minLowercase: 1,
    //   minUppercase: 1,
    //   minSymbols: 1,
    // })
    // .withMessage(
    //   "Password must contain 8 characters, a small letter, a capital letter, a symbol and a number"
    // ),
    body("passwordConfirm")
      .exists()
      .withMessage("Confirm Password was not provided")
      .bail()
      .isString()
      .withMessage("Password must be a string")
      .bail()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match");
        }
        return true;
      }),
    body("name").optional().isString().withMessage("Name must be a string"),

    body("role")
      .optional()
      .isIn(["user", "admin"])
      .withMessage("Role must be user or admin"),
  ],
  login: [
    body("email")
      .exists()
      .withMessage("Email was not provided")
      .bail()
      .notEmpty()
      .withMessage("Email cannot be empty"),
    body("password")
      .exists()
      .withMessage("Password was not provided")
      .bail()
      .isString()
      .withMessage("Password must be a string"),
  ],
  resetPassword: [
    body("email")
      .exists()
      .withMessage("Email was not provided")
      .bail()
      .notEmpty()
      .withMessage("Email cannot be empty")
      .bail()
      .isString()
      .withMessage("Email must be a string")
      .bail()
      .isEmail()
      .withMessage("Email format is incorrect"),
    body("password")
      .exists()
      .withMessage("Password was not provided")
      .bail()
      .isString()
      .withMessage("Password must be a string"),
    // .bail()
    // .isStrongPassword({
    //   minLength: 6,
    //   minNumbers: 1,
    //   minLowercase: 1,
    //   minUppercase: 1,
    //   minSymbols: 1,
    // })
    // .withMessage(
    //   "Password must contain 8 characters, a small letter, a capital letter, a symbol and a number"
    // ),
    body("confirmPassword")
      .exists()
      .withMessage("Confirm Password was not provided")
      .bail()
      .isString()
      .withMessage("Password must be a string")
      .bail()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password and confirm password do not match");
        }
        return true;
      }),
  ],
};

const driverValidator = {
  becomeADriver: [
    body("phone")
      .exists()
      .withMessage("Phone Number was not provided")
      .bail()
      .isString()
      .withMessage("Phone Number must be a string"),
    body("address")
      .exists()
      .withMessage("Address was not provided")
      .bail()
      .isString()
      .withMessage("Address must be a string"),
    body("drivingCity")
      .exists()
      .withMessage("Driving City was not provided")
      .bail()
      .isString()
      .withMessage("Driving City must be a string"),
    body("manufactureYear")
      .exists()
      .withMessage("Manufacture Year was not provided")
      .bail()
      .isString()
      .withMessage("Manufacture Year must be a string"),
    body("carModel")
      .exists()
      .withMessage("Car Model was not provided")
      .bail()
      .isString()
      .withMessage("Car Model must be a string"),
    body("vin")
      .exists()
      .withMessage("VIN was not provided")
      .bail()
      .isString()
      .withMessage("VIN must be a string"),
  ],
};

const reviewValidator = {
  addReview: [
    param("id")
      .exists()
      .withMessage("User ID must be provided")
      .bail()
      .matches(/^[a-f\d]{24}$/i)
      .withMessage("ID is not in valid mongoDB format"),
    body("productId")
      .exists()
      .withMessage("Product ID must be provided")
      .bail()
      .matches(/^[a-f\d]{24}$/i)
      .withMessage("ID is not in valid mongoDB format"),
    body("review")
      .exists()
      .withMessage("Review must be provided")
      .bail()
      .isString()
      .withMessage("Review has to be a string"),
    body("rating")
      .isFloat({ min: 1, max: 5 })
      .withMessage("Rating must be a number between 1 and 5"),
  ],
  updateReview: [
    param("id")
      .exists()
      .withMessage("User ID must be provided")
      .bail()
      .matches(/^[a-f\d]{24}$/i)
      .withMessage("ID is not in valid mongoDB format"),
    body("productId")
      .exists()
      .withMessage("Product ID must be provided")
      .bail()
      .matches(/^[a-f\d]{24}$/i)
      .withMessage("ID is not in valid mongoDB format"),
    body("review")
      .optional()
      .exists()
      .withMessage("Review must be provided")
      .bail()
      .isString()
      .withMessage("Review has to be a string"),
    body("rating")
      .optional()
      .isFloat({ min: 1, max: 5 })
      .withMessage("Rating must be a number between 1 and 5"),
  ],
};

const transportValidator = {
  create: [
    body("type")
      .exists()
      .withMessage("type was not provided")
      .bail()
      .isString()
      .withMessage("type must be a string")
      .bail()
      .isIn(["busRoute", "parkAndRide", "pubPickup"])
      .withMessage("type must be busRoute, parkAndRide or pubPickup"),
    body("pickUpPoint")
      .exists()
      .withMessage("pickUpPoint was not provided")
      .bail()
      .isString()
      .withMessage("pickUpPoint must be a string"),
    body("duration")
      .exists()
      .withMessage("duration was not provided")
      .bail()
      .isNumeric()
      .withMessage("duration must be a number"),
    body("departureTime")
      .exists()
      .withMessage("departureTime was not provided")
      .bail()
      .isString()
      .withMessage("departureTime must be a string"),
  ],
};

export {
  userValidator,
  authValidator,
  reviewValidator,
  driverValidator,
  transportValidator,
};
