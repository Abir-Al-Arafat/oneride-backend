import { Request, Response } from "express";

import { success, failure } from "../utilities/common";
import { IQuery } from "../types/query-params";

import HTTP_STATUS from "../constants/statusCodes";

import { UserRequest } from "../interfaces/user.interface";

import userGuestService from "../services/userguest.service";

class UserGuestController {
  async getAllUsersAndGuests(req: Request, res: Response) {
    try {
      const { page, limit, search, sort, role, status, dateFilter } =
        req.query as IQuery;
      const results = await userGuestService.getAllUsersAndGuests({
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
        search: search ?? "",
        sort: sort ?? "createdAt",
        role: role ?? "",
        status: status ?? "",
        dateFilter: dateFilter && dateFilter,
      });
      return res
        .status(HTTP_STATUS.OK)
        .send(success("Fetched all users and guests", results));
    } catch (error) {
      console.error(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Internal server error"));
    }
  }
}

export default new UserGuestController();
