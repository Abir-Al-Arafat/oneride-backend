import mongoose, { PipelineStage } from "mongoose";
import userModel from "../models/user.model";
import { IQuery } from "../types/query-params";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";

class UserGuestService {
  async getAllUsersAndGuests({
    page = 1,
    limit = 10,
    search = "",
    sort = "createdAt",
    role,
    status,
    dateFilter, // "today" | "thisWeek" | "thisMonth"
  }: IQuery) {
    const skip = (page - 1) * limit;

    // ✅ Dynamic conditions
    const conditions: any = {};

    if (search) {
      conditions.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    console.log("role", role);
    if (role) {
      conditions.roles = { $in: [role] };
    }

    if (status) {
      conditions.status = status;
    }

    if (dateFilter) {
      let start: Date = new Date(),
        end: Date = new Date();
      if (dateFilter === "today") {
        start = startOfDay(new Date());
        end = endOfDay(new Date());
      } else if (dateFilter === "thisWeek") {
        start = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday start
        end = endOfWeek(new Date(), { weekStartsOn: 1 });
      } else if (dateFilter === "thisMonth") {
        start = startOfMonth(new Date());
        end = endOfMonth(new Date());
      }
      conditions.createdAt = { $gte: start, $lte: end };
    }

    const baseMatch: PipelineStage.Match = { $match: conditions };

    // ✅ 1) Query pipeline with filters + pagination
    const pipeline: PipelineStage[] = [
      { $unionWith: { coll: "guests" } }, // merge users + guests
      baseMatch,
      { $sort: { [sort]: -1 } },
      { $skip: skip },
      { $limit: limit },
    ];

    // ✅ 2) Count pipeline
    const countPipeline: PipelineStage[] = [
      { $unionWith: { coll: "guests" } },
      baseMatch,
      { $count: "total" },
    ];

    const [result, countResult] = await Promise.all([
      userModel.aggregate(pipeline),
      userModel.aggregate(countPipeline),
    ]);

    const totalResults = countResult.length > 0 ? countResult[0].total : 0;
    const totalPages = Math.ceil(totalResults / limit);

    return {
      result,
      currentPage: page,
      limit,
      totalItems: totalResults,
      totalPages,
      //   totalItems: result.length,
    };
  }
}

export default new UserGuestService();
