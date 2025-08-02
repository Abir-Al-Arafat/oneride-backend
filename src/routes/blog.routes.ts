import express from "express";
import {
  addBlog,
  getAllBlogs,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller";
import multer from "multer";

import {
  isAuthorizedUser,
  isAuthorizedAdmin,
  isAuthorizedSuperAdmin,
} from "../middlewares/authValidationJWT";

import { blogValidator, mongoDBIdValidator } from "../middlewares/validation";

const routes = express();
const upload = multer();

routes.post("/", upload.none(), blogValidator.create, addBlog);

routes.get("/", getAllBlogs);

routes.put(
  "/:id",
  upload.none(),
  mongoDBIdValidator,
  blogValidator.create,
  updateBlog
);

routes.delete("/:id", mongoDBIdValidator, deleteBlog);

export default routes;
