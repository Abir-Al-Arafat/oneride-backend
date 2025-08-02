import { Request, Response } from "express";
import { validationResult } from "express-validator";
import HTTP_STATUS from "../constants/statusCodes";
import { success, failure } from "../utilities/common";

import {
  addAllyService,
  updateAllyService,
  deleteAllyService,
  getAllAllyService,
} from "../services/ally.service";

const addAlly = async (req: Request, res: Response) => {
  try {
    const validation = validationResult(req).array();
    if (validation.length) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("Validation failed", validation[0].msg));
    }

    const ally = await addAllyService(req.body);
    if (!ally) {
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Error adding ally"));
    }
    res.status(HTTP_STATUS.CREATED).send(success("Ally added", ally));
  } catch (error: any) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Error adding ally", error.message));
  }
};

const updateAlly = async (req: Request, res: Response) => {
  try {
    const validation = validationResult(req).array();
    if (validation.length) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("Validation failed", validation[0].msg));
    }
    const ally = await updateAllyService(req.params.id, req.body);
    if (!ally) {
      return res.status(HTTP_STATUS.NOT_FOUND).send(failure("Ally not found"));
    }
    res.status(HTTP_STATUS.OK).send(success("ally updated", ally));
  } catch (error: any) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Error updating ally", error.message));
  }
};
const deleteAlly = async (req: Request, res: Response) => {
  try {
    const validation = validationResult(req).array();
    if (validation.length) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("Validation failed", validation[0].msg));
    }
    const ally = await deleteAllyService(req.params.id);
    console.log("ally", ally);
    if (!ally) {
      return res.status(HTTP_STATUS.NOT_FOUND).send(failure("ally not found"));
    }
    res.status(HTTP_STATUS.OK).send(success("ally deleted", ally));
  } catch (error: any) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Error deleting ally", error.message));
  }
};
const getAllAlly = async (req: Request, res: Response) => {
  try {
    const validation = validationResult(req).array();
    if (validation.length) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("Validation failed", validation[0].msg));
    }

    const allies = await getAllAllyService(req.query);
    if (!allies.result || !allies.result.length) {
      return res.status(HTTP_STATUS.NOT_FOUND).send(failure("ally not found"));
    }
    res.status(HTTP_STATUS.OK).send(success("ally fetched", allies));
  } catch (error: any) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Error fetching ally", error.message));
  }
};

export { addAlly, getAllAlly, updateAlly, deleteAlly };
