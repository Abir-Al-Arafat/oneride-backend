import fs from "fs";
import Event from "../models/event.model";
import Transport from "../models/transport.model";
import Category from "../models/category.model";
import HTTP_STATUS from "../constants/statusCodes";
import { success, failure } from "../utilities/common";
import { TUploadFields } from "../types/upload-fields";
import { filterByDateRange } from "../utilities/filters";

const createEventService = async (body: any, files?: TUploadFields) => {
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
  } = body;

  // Parse and validate arrays
  let parsedBusRoutes: any[] = [];
  let parsedParkAndRides: any[] = [];
  let parsedPubPickups: any[] = [];

  try {
    parsedBusRoutes = JSON.parse(busRoutes);
    parsedParkAndRides = JSON.parse(parkAndRides);
    parsedPubPickups = JSON.parse(pubPickups);
  } catch (err: any) {
    throw new Error(
      "Invalid JSON in transport arrays. eg: busRoutes, parkAndRides, pubPickups"
    );
  }

  if (!Array.isArray(parsedBusRoutes))
    throw new Error("busRoutes must be an array");
  if (!Array.isArray(parsedParkAndRides))
    throw new Error("parkAndRides must be an array");
  if (!Array.isArray(parsedPubPickups))
    throw new Error("pubPickups must be an array");

  // Existence checks
  const busRoutesExist = await Transport.find({
    _id: { $in: parsedBusRoutes },
    type: "busRoute",
  });
  if (!busRoutesExist.length) throw new Error("bus routes do not exist");
  if (busRoutesExist.length !== parsedBusRoutes.length)
    throw new Error("Some bus routes do not exist");

  const parkAndRidesExist = await Transport.find({
    _id: { $in: parsedParkAndRides },
    type: "parkAndRide",
  });
  if (!parkAndRidesExist.length) throw new Error("park and rides do not exist");
  if (parkAndRidesExist.length !== parsedParkAndRides.length)
    throw new Error("Some park and rides do not exist");

  const pubPickupsExist = await Transport.find({
    _id: { $in: parsedPubPickups },
    type: "pubPickup",
  });
  if (!pubPickupsExist.length) throw new Error("pub pickups do not exist");
  if (pubPickupsExist.length !== parsedPubPickups.length)
    throw new Error("Some pub pickups do not exist");

  // Handle image
  let imageFileName = "";
  if (files && files["image"] && files.image[0]) {
    imageFileName = `public/uploads/images/${files.image[0].filename}`;
  }

  // Create event
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

  return event;
};

const getAllEventsService = async (query: any) => {
  const { category, title, adminStatus, filterByQuarter } = query;
  let dbQuery: any = {};
  // If category is a string, try to find by name
  if (category) {
    // If it's a valid ObjectId, allow direct filtering by id
    if (/^[0-9a-fA-F]{24}$/.test(category)) {
      dbQuery.category = category;
    } else {
      // Otherwise, treat as name
      const categoryDoc = await Category.findOne({ name: category });
      if (categoryDoc) {
        dbQuery.category = categoryDoc._id;
      } else {
        // No such category, return empty result
        return [];
      }
    }
  }
  if (title) dbQuery.title = { $regex: new RegExp(String(title), "i") };
  if (adminStatus) dbQuery.adminStatus = adminStatus;
  if (filterByQuarter) {
    const dateRange = filterByDateRange(filterByQuarter);
    if (dateRange) dbQuery.startDate = dateRange;
  }
  const events = await Event.find(dbQuery).populate("category");
  return events;
};

const deleteEventService = async (id: string) => {
  const event = await Event.findByIdAndDelete(id);
  if (!event) return null;
  if (event.image) {
    const imagePath = `./${event.image}`;
    try {
      fs.unlinkSync(imagePath);
    } catch (err) {
      console.error("Error deleting image file:", err);
      throw new Error("Failed to delete event image");
    }
  }
  return event;
};

const getEventServiceById = async (id: string) => {
  const event = await Event.findById(id).populate("category");
  return event;
};

const removeEventSeats = async (eventId: string, seats: number) => {
  const event = await Event.findById(eventId);
  if (!event) return null;
  if (seats > event.totalSeat) return null;
  event.totalSeat -= seats;
  await event.save();
  return true;
};

export {
  createEventService,
  getAllEventsService,
  getEventServiceById,
  deleteEventService,
  removeEventSeats,
};
