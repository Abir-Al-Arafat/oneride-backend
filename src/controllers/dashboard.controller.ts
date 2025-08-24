import { Request, Response } from "express";

import StatsService from "../services/dashboard.service";
import { success } from "../utilities/common";
import HTTP_STATUS from "../constants/statusCodes";

class DashboardController {
  async getDashboardOverview(req: Request, res: Response) {
    try {
      const overview = await StatsService.getOverviewStats();
      return res
        .status(HTTP_STATUS.OK)
        .send(success("Dashboard overview fetched successfully", overview));
    } catch (error) {
      console.error(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send({ message: "Failed to fetch dashboard overview" });
    }
  }
}

export default new DashboardController();
