import express from "express";
import dashboardController from "../controllers/dashboard.controller";
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

routes.get(
  "/overview",
  dashboardController.getDashboardOverview.bind(dashboardController)
);

export default routes;
