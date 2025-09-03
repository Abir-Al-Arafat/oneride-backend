import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";

import { DateFilter } from "../types/query-params";

import { IQuery } from "../types/query-params";

export type QueryResult<T> = {
  result: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  stats?: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
};

class QueryHelper<T> {
  async query(model: any, options: IQuery = {}): Promise<QueryResult<T>> {
    const {
      search,
      searchFields = [],
      filter = {},
      sort = "",
      page = 1,
      limit = 10,
      dateFilter,
    } = options;

    let dbQuery: any = { ...filter };

    // Searching
    if (search && searchFields.length) {
      dbQuery.$or = searchFields.map((field) => ({
        [field]: { $regex: search, $options: "i" },
      }));
    }

    // 📅 Date Filtering
    if (dateFilter) {
      const now = new Date();
      if (dateFilter === "today") {
        dbQuery.createdAt = { $gte: startOfDay(now), $lte: endOfDay(now) };
      } else if (dateFilter === "thisWeek") {
        dbQuery.createdAt = { $gte: startOfWeek(now), $lte: endOfWeek(now) };
      } else if (dateFilter === "thisMonth") {
        dbQuery.createdAt = { $gte: startOfMonth(now), $lte: endOfMonth(now) };
      }
    }

    // Sorting
    let sortQuery: any = {};
    if (sort) {
      // Example: "createdAt:desc,name:asc"
      sort.split(",").forEach((s) => {
        const [field, order] = s.split(":");
        sortQuery[field] = order === "desc" ? -1 : 1;
      });
    }

    // Pagination
    const skip = (page - 1) * limit;

    const result = await model
      .find(dbQuery)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit);

    const totalItems = await model.countDocuments(dbQuery);
    const totalPages = Math.ceil(totalItems / limit);

    // 📊 Stats (only if user filters by `status`)
    let stats;

    if (options.includeStats === true || options.includeStats === "true") {
      const [total, pending, approved, rejected] = await Promise.all([
        model.countDocuments({}),
        model.countDocuments({ status: "pending" }),
        model.countDocuments({ status: "approved" }),
        model.countDocuments({ status: "rejected" }),
      ]);

      stats = { total, pending, approved, rejected };
    }

    return {
      result,
      currentPage: page,
      totalPages,
      totalItems,
      ...(stats ? { stats } : {}), // ✅ only include if stats exist
    };
  }
}

export default QueryHelper;
