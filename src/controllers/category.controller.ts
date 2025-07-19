import { Request, Response } from "express";
import HTTP_STATUS from "../constants/statusCodes";
import { success, failure } from "../utilities/common";
import categoryModel from "../models/category.model";

const addCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("Category name is required"));
    }
    const category = await categoryModel.create(req.body);
    res.status(HTTP_STATUS.CREATED).send(success("Category added", category));
  } catch (error: any) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Error adding category", error.message));
  }
};

const updateCategory = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .send(failure("Please provide category id"));
    }
    const { name } = req.body;
    if (!name) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("Category name is required"));
    }
    const category = await categoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(HTTP_STATUS.OK).send(success("Category updated", category));
  } catch (error: any) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Error updating category", error.message));
  }
};
const deleteCategory = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .send(failure("Please provide category id"));
    }
    const category = await categoryModel.findByIdAndDelete(req.params.id);
    console.log("category", category);
    if (!category) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .send(failure("Category not found"));
    }
    res.status(HTTP_STATUS.OK).send(success("Category deleted", category));
  } catch (error: any) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Error deleting category", error.message));
  }
};
const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryModel.find();
    if (!categories.length) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .send(failure("Categories not found"));
    }
    res.status(HTTP_STATUS.OK).send(success("Categories fetched", categories));
  } catch (error: any) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Error fetching categories", error.message));
  }
};

export { addCategory, getAllCategories, updateCategory, deleteCategory };
