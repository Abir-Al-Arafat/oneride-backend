import express from "express";
import {
  addTeamMember,
  getAllTeamMembers,
  updateTeamMember,
  deleteTeamMember,
} from "../controllers/teamMember.controller";
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
  addTeamMember
);

routes.get("/", getAllTeamMembers);

routes.put(
  "/:id",
  fileUpload(),
  mongoDBIdValidator,
  //   allyValidator.create,
  updateTeamMember
);

routes.delete("/:id", mongoDBIdValidator, deleteTeamMember);

export default routes;
