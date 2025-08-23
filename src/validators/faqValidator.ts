import { body } from "express-validator";

const faqValidator = {
  create: [
    body("question")
      .exists()
      .withMessage("question was not provided")
      .bail()
      .isString()
      .withMessage("question must be a string")
      .bail()
      .notEmpty()
      .withMessage("question cannot be empty"),

    body("answer")
      .exists()
      .withMessage("answer was not provided")
      .bail()
      .isString()
      .withMessage("answer must be a string")
      .bail()
      .notEmpty()
      .withMessage("answer cannot be empty"),
  ],
};

export default faqValidator;
