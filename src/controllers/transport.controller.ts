import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { success, failure } from "../utilities/common";

import User from "../models/user.model";
import Phone from "../models/phone.model";
import Transport from "../models/transport.model";

import HTTP_STATUS from "../constants/statusCodes";

import { CreateUserQueryParams } from "../types/query-params";

import { TUploadFields } from "../types/upload-fields";
import { UserRequest } from "../interfaces/user.interface";

const createTransport = async (req: Request, res: Response) => {
  try {
    const validation = validationResult(req).array();
    if (validation.length) {
      return res
        .status(HTTP_STATUS.OK)
        .send(failure("Failed to add the transport", validation[0].msg));
    }

    const transportData = req.body;
    const transport = await Transport.create(transportData);

    res
      .status(HTTP_STATUS.CREATED)
      .send(success("Transport created successfully", transport));
  } catch (error: any) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Error creating transport", error.message));
  }
};

const deleteTransport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const transport = await Transport.findByIdAndDelete(id);
    if (!transport) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .send(failure("Transport not found"));
    }
    res
      .status(HTTP_STATUS.OK)
      .send(success("Transport deleted successfully", transport));
  } catch (error: any) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Error deleting transport", error.message));
  }
};

const getAllTransports = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    let query: any = {};
    if (type) {
      query.type = type;
    }
    const transports = await Transport.find(query).sort({ createdAt: -1 });
    res
      .status(HTTP_STATUS.OK)
      .send(success("Transports retrieved", transports));
  } catch (error: any) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Error retrieving transports", error.message));
  }
};

export { createTransport, getAllTransports, deleteTransport };
