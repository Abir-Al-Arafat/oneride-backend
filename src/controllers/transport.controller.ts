import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { success, failure } from "../utilities/common";
import HTTP_STATUS from "../constants/statusCodes";

import Transport from "../models/transport.model";

import transportService from "../services/transport.service";

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

const getTransportById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const transport = await transportService.getTransportById(id);
    if (!transport) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .send(failure("Transport not found"));
    }
    res
      .status(HTTP_STATUS.OK)
      .send(success("Transport retrieved successfully", transport));
  } catch (error: any) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Error retrieving transport", error.message));
  }
};

export { createTransport, getAllTransports, deleteTransport, getTransportById };
