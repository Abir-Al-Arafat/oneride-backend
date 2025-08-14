import { Request, Response } from "express";
import { validationResult } from "express-validator";
import HTTP_STATUS from "../constants/statusCodes";
import { success, failure } from "../utilities/common";

import {
  addBlogService,
  getBlogByIdService,
  updateBlogService,
  deleteBlogService,
  getAllBlogsService,
} from "../services/blog.service";

const addBlog = async (req: Request, res: Response) => {
  try {
    const validation = validationResult(req).array();
    if (validation.length) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("Validation failed", validation[0].msg));
    }

    const blog = await addBlogService(req.body);
    if (!blog) {
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Error adding blog"));
    }
    res.status(HTTP_STATUS.CREATED).send(success("Blog added", blog));
  } catch (error: any) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Error adding blog", error.message));
  }
};

const getBlogById = async (req: Request, res: Response) => {
  try {
    const validation = validationResult(req).array();
    if (validation.length) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("Validation failed", validation[0].msg));
    }
    const blog = await getBlogByIdService(req.params.id);
    if (!blog) {
      return res.status(HTTP_STATUS.NOT_FOUND).send(failure("blog not found"));
    }
    res.status(HTTP_STATUS.OK).send(success("blog fetched", blog));
  } catch (error: any) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Error fetching blog", error.message));
  }
};

const updateBlog = async (req: Request, res: Response) => {
  try {
    const validation = validationResult(req).array();
    if (validation.length) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("Validation failed", validation[0].msg));
    }
    const blog = await updateBlogService(req.params.id, req.body);
    if (!blog) {
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Error updating blog"));
    }
    res.status(HTTP_STATUS.OK).send(success("blog updated", blog));
  } catch (error: any) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Error updating blog", error.message));
  }
};
const deleteBlog = async (req: Request, res: Response) => {
  try {
    const validation = validationResult(req).array();
    if (validation.length) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("Validation failed", validation[0].msg));
    }
    const blog = await deleteBlogService(req.params.id);
    console.log("blog", blog);
    if (!blog) {
      return res.status(HTTP_STATUS.NOT_FOUND).send(failure("blog not found"));
    }
    res.status(HTTP_STATUS.OK).send(success("blog deleted", blog));
  } catch (error: any) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Error deleting blog", error.message));
  }
};
const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const validation = validationResult(req).array();
    if (validation.length) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("Validation failed", validation[0].msg));
    }

    const blogs = await getAllBlogsService({
      status: req.query.status as string,
      search: req.query.search as string,
    });

    if (!blogs.result.length) {
      return res.status(HTTP_STATUS.NOT_FOUND).send(failure("blog not found"));
    }
    res.status(HTTP_STATUS.OK).send(success("blog fetched", blogs));
  } catch (error: any) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Error fetching blog", error.message));
  }
};

export { addBlog, getBlogById, getAllBlogs, updateBlog, deleteBlog };
