import express from "express";
import {
  createCharter,
  getAllCharters,
  updateCharterStatus,
  deleteCharter,
  mailUserRegardingCharterStatusUpdate,
} from "../controllers/charter.controller";
import multer from "multer";

import {
  isAuthorizedUser,
  isAuthorizedAdmin,
  isAuthorizedSuperAdmin,
} from "../middlewares/authValidationJWT";

import {
  charterValidator,
  mongoDBIdValidator,
} from "../middlewares/validation";

const routes = express();
const upload = multer();

routes.post("/", upload.none(), charterValidator.create, createCharter);

routes.post(
  "/status/mail-user/:id",
  upload.none(),
  mongoDBIdValidator,
  mailUserRegardingCharterStatusUpdate
);

routes.patch(
  "/status/:id",
  upload.none(),
  charterValidator.updateCharterStatus,
  updateCharterStatus
);

routes.delete("/:id", mongoDBIdValidator, deleteCharter);

routes.get("/", getAllCharters);

export default routes;
