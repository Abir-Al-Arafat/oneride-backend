import fs from "fs";
import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { success, failure, generateRandomCode } from "../utilities/common";

import User from "../models/user.model";
import Phone from "../models/phone.model";
import Event from "../models/event.model";
import Transport from "../models/transport.model";

import HTTP_STATUS from "../constants/statusCodes";
import { emailWithNodemailerGmail } from "../config/email.config";
import { CreateUserQueryParams } from "../types/query-params";

import { TUploadFields } from "../types/upload-fields";
import { UserRequest } from "../interfaces/user.interface";

const createEvent = async (req: Request, res: Response) => {
  try {
    const validation = validationResult(req).array();
    if (validation.length) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("Failed to create event", validation[0].msg));
    }

    const {
      title,
      category,
      description,
      startDate,
      endDate,
      startTime,
      endTime,
      venueName,
      busRoutes,
      parkAndRides,
      pubPickups,
      totalSeat,
      ticketPrice,
      adminStatus,
      websiteStatus,
    } = req.body;

    let parsedBusRoutes: any[] = [];
    let parsedParkAndRides: any[] = [];
    let parsedPubPickups: any[] = [];

    console.log("Received busRoutes:", busRoutes);
    console.log("Received parkAndRides:", parkAndRides);
    console.log("Received pubPickups:", pubPickups);

    console.log("Received busRoutes type:", typeof busRoutes);
    console.log("Received parkAndRides type:", typeof parkAndRides);
    console.log("Received pubPickups type:", typeof pubPickups);

    try {
      parsedBusRoutes = JSON.parse(busRoutes);
      parsedParkAndRides = JSON.parse(parkAndRides);
      parsedPubPickups = JSON.parse(pubPickups);
    } catch (jsonError: any) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("Invalid JSON in transport arrays", jsonError.message));
    }

    if (!Array.isArray(parsedBusRoutes)) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("busRoutes must be an array"));
    }

    const busRoutesExist = await Transport.find({
      _id: { $in: parsedBusRoutes },
      type: "busRoute",
    });
    if (!busRoutesExist.length) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("bus routes do not exist"));
    }
    if (busRoutesExist.length !== parsedBusRoutes.length) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("Some bus routes do not exist"));
    }

    if (!Array.isArray(parsedParkAndRides)) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("parkAndRides must be an array"));
    }

    const parkAndRidesExist = await Transport.find({
      _id: { $in: parsedParkAndRides },
      type: "parkAndRide",
    });
    if (!parkAndRidesExist.length) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("park and rides do not exist"));
    }
    if (parkAndRidesExist.length !== parsedParkAndRides.length) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("Some park and rides do not exist"));
    }

    if (!Array.isArray(parsedPubPickups)) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("pubPickups must be an array"));
    }

    const pubPickupsExist = await Transport.find({
      _id: { $in: parsedPubPickups },
      type: "pubPickup",
    });

    if (!pubPickupsExist.length) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("pub pickups do not exist"));
    }

    if (pubPickupsExist.length !== parsedPubPickups.length) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("Some pub pickups do not exist"));
    }
    const files = req.files as TUploadFields;
    let imageFileName = "";
    if (req.files && files?.["image"]) {
      if (files?.image[0]) {
        imageFileName = `public/uploads/images/${files?.image[0]?.filename}`;
      }
    }

    const event = await Event.create({
      title,
      category,
      description,
      startDate,
      endDate,
      startTime,
      endTime,
      venueName,
      busRoutes: busRoutesExist.map((route) => route._id),
      parkAndRides: parkAndRidesExist.map((ride) => ride._id),
      pubPickups: pubPickupsExist.map((pickup) => pickup._id),
      totalSeat,
      ticketPrice,
      image: imageFileName,
      adminStatus: adminStatus || "active",
      websiteStatus: websiteStatus || "upcoming",
    });

    res
      .status(HTTP_STATUS.CREATED)
      .send(success("Event created successfully", event));
  } catch (error: any) {
    console.error("Error creating event:", error);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Error creating event", error.message));
  }
};

const getAllEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.find().populate("category");
    res
      .status(HTTP_STATUS.OK)
      .send(success("Events fetched successfully", events));
  } catch (error: any) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Error fetching events", error.message));
  }
};

const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      return res.status(HTTP_STATUS.NOT_FOUND).send(failure("Event not found"));
    }
    if (event.image) {
      const imagePath = `./${event.image}`;
      try {
        fs.unlinkSync(imagePath);
      } catch (err) {
        console.error(err);
      }
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

export { createEvent, getAllEvents, deleteEvent };
