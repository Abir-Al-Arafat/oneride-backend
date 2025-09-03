import { Request, Response } from "express";
import { validationResult } from "express-validator";
import HTTP_STATUS from "../constants/statusCodes";
import { success, failure } from "../utilities/common";

import {
  addAboutService,
  updateAboutService,
  deleteAboutService,
  getAboutService,
} from "../services/about.service";

import { TUploadFields } from "../types/upload-fields";

const addAbout = async (req: Request, res: Response) => {
  try {
    const validation = validationResult(req).array();
    if (validation.length) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("Validation failed", validation[0].msg));
    }

    const about = await addAboutService(req.body, req.files as TUploadFields);
    if (!about) {
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Error adding about us information"));
    }
    res
      .status(HTTP_STATUS.CREATED)
      .send(success("About us information added", about));
  } catch (error: any) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Error adding about us information", error.message));
  }
};

const updateAbout = async (req: Request, res: Response) => {
  try {
    const validation = validationResult(req).array();
    if (validation.length) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("Validation failed", validation[0].msg));
    }
    const about = await updateAboutService(req.params.id, req.body);
    if (!about) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .send(failure("About us information not found"));
    }
    res
      .status(HTTP_STATUS.OK)
      .send(success("About us information updated", about));
  } catch (error: any) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Error updating about us information", error.message));
  }
};
const deleteAbout = async (req: Request, res: Response) => {
  try {
    const validation = validationResult(req).array();
    if (validation.length) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("Validation failed", validation[0].msg));
    }
    const about = await deleteAboutService(req.params.id);
    console.log("about", about);
    if (!about) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .send(failure("About us information not found"));
    }
    res
      .status(HTTP_STATUS.OK)
      .send(success("About us information deleted", about));
  } catch (error: any) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Error deleting about us information", error.message));
  }
};
const getAllAbout = async (req: Request, res: Response) => {
  try {
    const validation = validationResult(req).array();
    if (validation.length) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("Validation failed", validation[0].msg));
    }

    const abouts = await getAboutService();
    if (!abouts) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .send(failure("About us information not found"));
    }
    res
      .status(HTTP_STATUS.OK)
      .send(success("About us information fetched", abouts));
  } catch (error: any) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Error fetching about us information", error.message));
  }
};

export { addAbout, getAllAbout, updateAbout, deleteAbout };
