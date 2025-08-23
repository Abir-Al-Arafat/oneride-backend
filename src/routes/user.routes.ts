import express from "express";
import multer from "multer";
import { Request, Response, NextFunction, RequestHandler } from "express";
import {
  getAllUsers,
  getOneUserById,
  getNotificationsByUserId,
  getAllNotifications,
  updateUserById,
  profile,
  updateProfileByUser,
  toggleBan,
  updateUserCurrentLocation,
} from "../controllers/users.controller";

import {
  isAuthorizedUser,
  isAuthorizedAdmin,
  isAuthorizedSuperAdmin,
} from "../middlewares/authValidationJWT";

import { userValidator } from "../middlewares/validation";

import fileUpload from "../middlewares/fileUpload";
import fileUploadMemory from "../middlewares/fileUploadMemory";

const routes = express();
const upload = multer();

// /api/users

routes.get("/", getAllUsers);

// /api/users/123
routes.get("/:id", getOneUserById);

routes.get("/auth/profile", isAuthorizedUser, profile);

// /api/users

routes.patch(
  "/auth/update-profile-by-user",
  isAuthorizedUser,
  fileUploadMemory,
  updateProfileByUser
);

routes.patch(
  "/auth/toggle-ban",
  upload.none(),
  isAuthorizedAdmin,
  userValidator.toggleBan,
  toggleBan
);

routes.patch("/update-location", isAuthorizedUser, updateUserCurrentLocation);

export default routes;
