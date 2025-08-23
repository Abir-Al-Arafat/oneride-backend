import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  deleteEvent,
} from "../controllers/event.controller";
import multer from "multer";

import { eventValidator } from "../middlewares/validation";

import fileUpload from "../middlewares/fileUpload";

import {
  isAuthorizedUser,
  isAuthorizedAdmin,
  isAuthorizedSuperAdmin,
} from "../middlewares/authValidationJWT";

const routes = express();
const upload = multer();

routes.post("/", fileUpload(), eventValidator.create, createEvent);

routes.get("/", getAllEvents);

routes.get("/:id", getEventById);

routes.delete("/:id", deleteEvent);

export default routes;
