import express from "express";

import userGuestController from "../controllers/userGuest.controller";

import {
  isAuthorizedUser,
  isAuthorizedAdmin,
  isAuthorizedSuperAdmin,
} from "../middlewares/authValidationJWT";

const routes = express();

routes.get("/", userGuestController.getAllUsersAndGuests);

export default routes;
