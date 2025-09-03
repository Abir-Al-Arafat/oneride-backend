import express from "express";
import FAQController from "../controllers/faq.controller";
import multer from "multer";

import {
  isAuthorizedUser,
  isAuthorizedAdmin,
  isAuthorizedSuperAdmin,
} from "../middlewares/authValidationJWT";
import fileUpload from "../middlewares/fileUpload";
import { mongoDBIdValidator } from "../middlewares/validation";
import faqValidator from "../validators/faqValidator";

const routes = express();
const upload = multer();

routes.post("/", upload.none(), faqValidator.create, FAQController.createFAQ);

routes.get("/", FAQController.getAllFAQs);

routes.get("/:id", mongoDBIdValidator, FAQController.getFAQ);

routes.put(
  "/:id",
  upload.none(),
  mongoDBIdValidator,
  faqValidator.create,
  FAQController.updateFAQ
);

routes.delete("/:id", mongoDBIdValidator, FAQController.deleteFAQ);

export default routes;
