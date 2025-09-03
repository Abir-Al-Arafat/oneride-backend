import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { success, failure, generateRandomCode } from "../utilities/common";

import HTTP_STATUS from "../constants/statusCodes";

import { TUploadFields } from "../types/upload-fields";
import { UserRequest } from "../interfaces/user.interface";

import {
  createEventService,
  getAllEventsService,
  getEventServiceById,
  deleteEventService,
} from "../services/event.service";

const createEvent = async (req: Request, res: Response) => {
  try {
    const validation = validationResult(req).array();
    if (validation.length) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("Failed to create event", validation[0].msg));
    }

    const event = await createEventService(
      req.body,
      req.files as TUploadFields
    );

    res
      .status(HTTP_STATUS.CREATED)
      .send(success("Event created successfully", event));
  } catch (error: any) {
    res.status(HTTP_STATUS.BAD_REQUEST).send(failure(error.message));
  }
};

const getAllEvents = async (req: Request, res: Response) => {
  try {
    const events = await getAllEventsService(req.query);
    res
      .status(HTTP_STATUS.OK)
      .send(success("Events fetched successfully", events));
  } catch (error: any) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Error fetching events", error.message));
  }
};

const getEventById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const transports = req.query.transports === "true";

  try {
    const event = await getEventServiceById(id, transports);
    if (!event) {
      return res.status(HTTP_STATUS.NOT_FOUND).send(failure("Event not found"));
    }
    res
      .status(HTTP_STATUS.OK)
      .send(success("Event fetched successfully", event));
  } catch (error: any) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Error fetching event", error.message));
  }
};

const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await deleteEventService(id);
    if (!event) {
      return res.status(HTTP_STATUS.NOT_FOUND).send(failure("Event not found"));
    }
    res
      .status(HTTP_STATUS.OK)
      .send(success("Event deleted successfully", event));
  } catch (error: any) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Error deleting event", error.message));
  }
};

export { createEvent, getAllEvents, getEventById, deleteEvent };
