import express from "express";
import {
  addInvitation,
  getAllInvitations,
} from "../controllers/invitation.controller";
import multer from "multer";

import {
  isAuthorizedUser,
  isAuthorizedAdmin,
  isAuthorizedSuperAdmin,
} from "../middlewares/authValidationJWT";

import {
  invitationValidator,
  mongoDBIdValidator,
} from "../middlewares/validation";

const routes = express();
const upload = multer();

routes.post("/", upload.none(), invitationValidator.create, addInvitation);

routes.get("/", getAllInvitations);

export default routes;
