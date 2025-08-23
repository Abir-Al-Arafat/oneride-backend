import express from "express";
import termController from "../controllers/term.controller";
import multer from "multer";

import {
  isAuthorizedUser,
  isAuthorizedAdmin,
  isAuthorizedSuperAdmin,
} from "../middlewares/authValidationJWT";

const routes = express();
const upload = multer();

routes.post("/", upload.none(), termController.addTerm);

routes.get("/", termController.getAllTerms);

export default routes;
