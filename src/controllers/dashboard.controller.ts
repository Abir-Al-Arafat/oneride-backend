import { Request, Response } from "express";

import StatsService from "../services/dashboard.service";
import { failure, success } from "../utilities/common";
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

  async getEarningsChartData(req: Request, res: Response) {
    try {
      const { period } = req.query;
      if (
        !period ||
        !["daily", "weekly", "monthly"].includes(period as string)
      ) {
        return res.status(HTTP_STATUS.BAD_REQUEST).send({
          message: "Invalid or missing period. Use daily, weekly, or monthly.",
        });
      }
      const chartData = await StatsService.getEarningsChartData(
        period as "daily" | "weekly" | "monthly"
      );
      if (!chartData.length) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("Earnings chart data not found"));
      }
      return res
        .status(HTTP_STATUS.OK)
        .send(success("Earnings chart data fetched successfully", chartData));
    } catch (error) {
      console.error(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send({ message: "Failed to fetch earnings chart data" });
    }
  }
}

export default new DashboardController();
