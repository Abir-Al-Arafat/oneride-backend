import { body } from "express-validator";

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

    body("pickUpPoint.name")
      .exists()
      .withMessage("pickUpPoint.name was not provided")
      .bail()
      .isString()
      .withMessage("pickUpPoint.name must be a string"),

    body("pickUpPoint.lat")
      .exists()
      .withMessage("pickUpPoint.lat was not provided")
      .bail()
      .isFloat()
      .withMessage("pickUpPoint.lat must be a number"),

    body("pickUpPoint.lng")
      .exists()
      .withMessage("pickUpPoint.lng was not provided")
      .bail()
      .isFloat()
      .withMessage("pickUpPoint.lng must be a number"),

    body("dropOffPoint.name")
      .exists()
      .withMessage("dropOffPoint.name was not provided")
      .bail()
      .isString()
      .withMessage("dropOffPoint.name must be a string"),

    body("dropOffPoint.lat")
      .exists()
      .withMessage("dropOffPoint.lat was not provided")
      .bail()
      .isFloat()
      .withMessage("dropOffPoint.lat must be a number"),

    body("dropOffPoint.lng")
      .exists()
      .withMessage("dropOffPoint.lng was not provided")
      .bail()
      .isFloat()
      .withMessage("dropOffPoint.lng must be a number"),

    body("duration")
      .exists()
      .withMessage("duration was not provided")
      .bail()
      .isString()
      .withMessage("duration must be a string"),

    body("departureTime")
      .exists()
      .withMessage("departureTime was not provided")
      .bail()
      .isString()
      .withMessage("departureTime must be a string"),
  ],
};

export default transportValidator;
