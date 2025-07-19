import express from "express";
import {
  addCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";
import multer from "multer";

import {
  isAuthorizedUser,
  isAuthorizedAdmin,
  isAuthorizedSuperAdmin,
} from "../middlewares/authValidationJWT";

const routes = express();
const upload = multer();

routes.post("/", addCategory);

routes.get("/", getAllCategories);

routes.put("/:id", upload.none(), updateCategory);

routes.delete("/:id", deleteCategory);

export default routes;
