import express from "express";
import {
  addBlog,
  getBlogById,
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
import fileUploadMemory from "../middlewares/fileUploadMemory";
import { blogValidator, mongoDBIdValidator } from "../middlewares/validation";

const routes = express();
const upload = multer();

routes.post("/", fileUploadMemory, blogValidator.create, addBlog);

routes.get("/", getAllBlogs);

routes.get("/:id", mongoDBIdValidator, getBlogById);

routes.put(
  "/:id",
  fileUploadMemory,
  mongoDBIdValidator,
  blogValidator.create,
  updateBlog
);

routes.delete("/:id", mongoDBIdValidator, deleteBlog);

export default routes;
