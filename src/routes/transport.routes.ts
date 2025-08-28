import express from "express";
import {
  createTransport,
  getAllTransports,
  deleteTransport,
} from "../controllers/transport.controller";
import multer from "multer";

import transportValidator from "../validators/transportValidator";

import {
  isAuthorizedUser,
  isAuthorizedAdmin,
  isAuthorizedSuperAdmin,
} from "../middlewares/authValidationJWT";

const routes = express();
const upload = multer();

routes.post("/", upload.none(), transportValidator.create, createTransport);

routes.get("/", getAllTransports);

routes.delete("/:id", deleteTransport);

export default routes;
