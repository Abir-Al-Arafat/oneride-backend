import express from "express";
import partnershipController from "../controllers/partnership.controller";
import multer from "multer";

import {
  isAuthorizedUser,
  isAuthorizedAdmin,
  isAuthorizedSuperAdmin,
  userExists,
} from "../middlewares/authValidationJWT";

import { mongoDBIdValidator } from "../middlewares/validation";

import partnershipValidator from "../validators/partnershipValidator";

const routes = express();
const upload = multer();

routes.post(
  "/",
  upload.none(),
  partnershipValidator.create,
  userExists,
  partnershipController.createPartnership
);

routes.patch(
  "/toggle/:id",
  upload.none(),
  isAuthorizedAdmin,
  partnershipValidator.togglePartnership,
  partnershipController.togglePartnership
);

routes.get("/", partnershipController.getAllPartnerships);

routes.get(
  "/:id",
  mongoDBIdValidator,
  partnershipController.getPartnershipById
);

routes.patch(
  "/:id",
  upload.none(),
  isAuthorizedAdmin,
  mongoDBIdValidator,
  // partnershipValidator.updatePartnership,
  partnershipController.updatePartnership
);

// routes.delete("/:id", mongoDBIdValidator, deleteAlly);

export default routes;
