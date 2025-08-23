import express from "express";
import {
  addAlly,
  getAllAlly,
  updateAlly,
  deleteAlly,
} from "../controllers/ally.controller";
import multer from "multer";

import {
  isAuthorizedUser,
  isAuthorizedAdmin,
  isAuthorizedSuperAdmin,
} from "../middlewares/authValidationJWT";
import fileUploadMemory from "../middlewares/fileUploadMemory";
import { allyValidator, mongoDBIdValidator } from "../middlewares/validation";

const routes = express();
const upload = multer();

routes.post("/", fileUploadMemory, allyValidator.create, addAlly);

routes.get("/", getAllAlly);

routes.put(
  "/:id",
  upload.none(),
  mongoDBIdValidator,
  allyValidator.create,
  updateAlly
);

routes.delete("/:id", mongoDBIdValidator, deleteAlly);

export default routes;
