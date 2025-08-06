import { body, param } from "express-validator";

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

const eventValidator = {
  create: [
    body("title")
      .exists()
      .withMessage("title was not provided")
      .bail()
      .isString()
      .withMessage("title must be a string"),

    body("startDate")
      .exists()
      .withMessage("startDate was not provided")
      .bail()
      .isString()
      .withMessage("startDate must be a string"),

    body("endDate")
      .exists()
      .withMessage("endDate was not provided")
      .bail()
      .isString()
      .withMessage("endDate must be a string"),

    body("startTime")
      .exists()
      .withMessage("startTime was not provided")
      .bail()
      .isString()
      .withMessage("startTime must be a string"),

    body("endTime")
      .exists()
      .withMessage("endTime was not provided")
      .bail()
      .isString()
      .withMessage("endTime must be a string"),

    body("venueName")
      .exists()
      .withMessage("venueName was not provided")
      .bail()
      .isString()
      .withMessage("venueName must be a string"),

    body("totalSeat")
      .exists()
      .withMessage("totalSeat was not provided")
      .bail()
      .isNumeric()
      .withMessage("totalSeat must be a number"),

    body("ticketPrice")
      .exists()
      .withMessage("ticketPrice was not provided")
      .bail()
      .isNumeric()
      .withMessage("ticketPrice must be a number"),
  ],
};

const charterValidator = {
  create: [
    body("name")
      .exists()
      .withMessage("name was not provided")
      .bail()
      .isString()
      .withMessage("name must be a string"),
    body("email")
      .exists()
      .withMessage("email was not provided")
      .bail()
      .isEmail()
      .withMessage("email must be a valid email"),
    body("phone")
      .exists()
      .withMessage("phone was not provided")
      .bail()
      .isString()
      .withMessage("phone must be a string"),
    body("passengerCount")
      .exists()
      .withMessage("passengerCount was not provided")
      .bail()
      .isNumeric()
      .withMessage("passengerCount must be a number"),
    body("pickupLocation")
      .exists()
      .withMessage("pickupLocation was not provided")
      .bail()
      .isString()
      .withMessage("pickupLocation must be a string"),
    body("dropoffLocation")
      .exists()
      .withMessage("dropoffLocation was not provided")
      .bail()
      .isString()
      .withMessage("dropoffLocation must be a string"),
    body("pickupDateAndTime")
      .exists()
      .withMessage("pickupDateAndTime was not provided")
      .bail()
      .isString()
      .withMessage("pickupDateAndTime must be a string"),
    body("purpose")
      .exists()
      .withMessage("purpose was not provided")
      .bail()
      .isString()
      .withMessage("purpose must be a string"),
    body("specialInstructions")
      .optional()
      .isString()
      .withMessage("specialInstructions must be a string"),
  ],
  updateCharterStatus: [
    param("id")
      .exists()
      .withMessage("Charter ID was not provided")
      .bail()
      .isMongoId()
      .withMessage("Charter ID must be a valid MongoDB ObjectId"),
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

const mongoDBIdValidator = [
  param("id")
    .exists()
    .withMessage("id was not provided")
    .bail()
    .isMongoId()
    .withMessage("id must be a valid MongoDB ObjectId"),
];

const invitationValidator = {
  create: [
    body("fullName")
      .exists()
      .withMessage("fullName was not provided")
      .bail()
      .notEmpty()
      .withMessage("fullName cannot be empty")
      .bail()
      .isString()
      .withMessage("fullName must be a string"),
    body("email")
      .exists()
      .withMessage("email was not provided")
      .bail()
      .isEmail()
      .withMessage("email must be a valid email"),
    body("role")
      .exists()
      .withMessage("role was not provided")
      .bail()
      .isString()
      .withMessage("role must be a string")
      .bail()
      .isIn(["admin", "eventOrganizer", "viewer"])
      .withMessage(
        "role must be one of the following: admin, eventOrganizer, viewer"
      ),
    body("optionalMessage")
      .optional()
      .isString()
      .withMessage("optionalMessage must be a string"),
  ],
};

const blogValidator = {
  create: [
    body("title")
      .exists()
      .withMessage("title was not provided")
      .bail()
      .notEmpty()
      .withMessage("title cannot be empty")
      .bail()
      .isString()
      .withMessage("title must be a string"),
    body("author")
      .exists()
      .withMessage("author was not provided")
      .bail()
      .notEmpty()
      .withMessage("author cannot be empty")
      .bail()
      .isString()
      .withMessage("author must be a string"),
    body("status")
      .exists()
      .withMessage("status was not provided")
      .bail()
      .notEmpty()
      .withMessage("status cannot be empty")
      .bail()
      .isString()
      .withMessage("status must be a string")
      .bail()
      .isIn(["draft", "published"])
      .withMessage("status must be either 'draft' or 'published'"),
    body("content")
      .exists()
      .withMessage("content was not provided")
      .bail()
      .notEmpty()
      .withMessage("content cannot be empty")
      .bail()
      .isString()
      .withMessage("content must be a string"),
  ],
  query: [
    body("status")
      .optional()
      .isString()
      .withMessage("status must be a string")
      .bail()
      .isIn(["draft", "published"])
      .withMessage("status must be either 'draft' or 'published'"),
  ],
};

const allyValidator = {
  query: [
    body("status")
      .optional()
      .isString()
      .withMessage("status must be a string")
      .bail()
      .isIn(["active", "inactive"])
      .withMessage("status must be either 'active' or 'inactive'"),
  ],

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
    body("location")
      .exists()
      .withMessage("location was not provided")
      .bail()
      .notEmpty()
      .withMessage("location cannot be empty")
      .bail()
      .isString()
      .withMessage("location must be a string"),
    body("websiteURL")
      .optional()
      .isString()
      .withMessage("websiteURL must be a string"),
    body("type")
      .exists()
      .withMessage("type was not provided")
      .bail()
      .isString()
      .withMessage("type must be a string")
      .bail()
      .isIn(["pub", "restaurant", "venue"])
      .withMessage("type must be either 'pub', 'restaurant' or 'venue'"),
    body("marketingBlurb")
      .optional()
      .isString()
      .withMessage("marketingBlurb must be a string"),
    body("status")
      .optional()
      .isString()
      .withMessage("status must be a string")
      .bail()
      .isIn(["active", "inactive"])
      .withMessage("status must be either 'active' or 'inactive'"),
  ],
};

export {
  userValidator,
  authValidator,
  reviewValidator,
  driverValidator,
  transportValidator,
  eventValidator,
  charterValidator,
  invitationValidator,
  mongoDBIdValidator,
  blogValidator,
  allyValidator,
};
