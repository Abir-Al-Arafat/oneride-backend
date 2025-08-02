import express from "express";
import {
  addAbout,
  getAllAbout,
  updateAbout,
  deleteAbout,
} from "../controllers/about.controller";
import multer from "multer";

import {
  isAuthorizedUser,
  isAuthorizedAdmin,
  isAuthorizedSuperAdmin,
} from "../middlewares/authValidationJWT";
import fileUpload from "../middlewares/fileUpload";
import { mongoDBIdValidator } from "../middlewares/validation";

const routes = express();
const upload = multer();

routes.post(
  "/",
  fileUpload(),
  // allyValidator.create,
  addAbout
);

routes.get("/", getAllAbout);

routes.put(
  "/:id",
  upload.none(),
  mongoDBIdValidator,
  //   allyValidator.create,
  updateAbout
);

routes.delete("/:id", mongoDBIdValidator, deleteAbout);

export default routes;
