import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { emailWithNodemailerGmail } from "../config/email.config";

import { success, failure } from "../utilities/common";

import {
  createCharterService,
  deleteCharterService,
  getAllChartersService,
  updateCharterStatusService,
  getCharterByIdService,
} from "../services/charter.service";

import HTTP_STATUS from "../constants/statusCodes";

import { CreateUserQueryParams } from "../types/query-params";

import { TUploadFields } from "../types/upload-fields";
import { UserRequest } from "../interfaces/user.interface";

const createCharter = async (req: Request, res: Response) => {
  try {
    const validation = validationResult(req).array();
    if (validation.length) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("Failed to create charter", validation[0].msg));
    }

    const charter = await createCharterService(req.body);

    if (!charter) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("Failed to create charter"));
    }

    if (charter.email) {
      const emailData = {
        email: charter.email,
        subject: "Charter Request Confirmation",
        html: `<h6>Hello, ${
          charter.name || charter.email || "User"
        }</h6><p>Your charter request has been received. We will get back to you shortly.</p>`,
      };

      emailWithNodemailerGmail(emailData);
    }

    res
      .status(HTTP_STATUS.CREATED)
      .send(success("Charter created successfully", charter));
  } catch (error: any) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Error creating charter", error.message));
  }
};

const deleteCharter = async (req: Request, res: Response) => {
  try {
    const validation = validationResult(req).array();
    if (validation.length) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("Failed to delete charter", validation[0].msg));
    }
    const { id } = req.params;
    const charter = await deleteCharterService(id);
    if (!charter) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .send(failure("Charter not found"));
    }
    res
      .status(HTTP_STATUS.OK)
      .send(success("Charter deleted successfully", charter));
  } catch (error: any) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Error deleting charter", error.message));
  }
};

const getAllCharters = async (req: Request, res: Response) => {
  try {
    const result = await getAllChartersService(req.query);
    const { result: charters, currentPage, totalPages, totalItems } = result;

    res.status(HTTP_STATUS.OK).send(
      success("Charters fetched successfully", {
        result: charters,
        currentPage: Number(currentPage) || 1,
        totalPages,
        totalItems,
      })
    );
  } catch (error: any) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Error fetching charters", error.message));
  }
};

const updateCharterStatus = async (req: Request, res: Response) => {
  try {
    const validation = validationResult(req).array();
    if (validation.length) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("Failed to update charter status", validation[0].msg));
    }
    const { id } = req.params;
    const { status } = req.body;

    const charter = await updateCharterStatusService(id, status);

    if (!charter) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .send(failure("Charter not found"));
    }
    if (charter.email) {
      const emailData = {
        email: charter.email,
        subject: "Charter Status Update",
        html: `<h6>Hello, ${"User"}</h6><p>Your charter request has been ${status}.</p>`,
      };
      emailWithNodemailerGmail(emailData);
    }

    res
      .status(HTTP_STATUS.OK)
      .send(success("Charter status updated successfully", charter));
  } catch (error: any) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Error updating charter status", error.message));
  }
};

const mailUserRegardingCharterStatusUpdate = async (
  req: Request,
  res: Response
) => {
  try {
    const validation = validationResult(req).array();
    if (validation.length) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("Failed to send email", validation[0].msg));
    }
    const { id } = req.params;

    const charter = await getCharterByIdService(id);
    if (!charter) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .send(failure("Charter not found"));
    }

    const email = charter.email;
    const status = charter.status;
    if (!email) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("Email is required"));
    }
    if (email) {
      const emailData = {
        email,
        subject: "Charter Status Update",
        html: `<h6>Hello, ${"User"}</h6><p>Your charter request has been ${status}.</p>`,
      };

      emailWithNodemailerGmail(emailData);
    }

    res.status(HTTP_STATUS.OK).send(success("Email sent successfully"));
  } catch (error: any) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Error sending email", error.message));
  }
};

export {
  createCharter,
  deleteCharter,
  getAllCharters,
  updateCharterStatus,
  mailUserRegardingCharterStatusUpdate,
};
