import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subDays,
  subMonths,
  format,
} from "date-fns";
import Event from "../models/event.model";
import Booking from "../models/booking.model";
import User from "../models/user.model";
import Charter from "../models/charter.model";
import Transaction from "../models/transaction.model";
import { percentageChange } from "../utilities/calculateChange";

class DashboardService {
  async getOverviewStats() {
    // 1. Total Events (current & previous day)
    const totalEvents = await Event.countDocuments();
    const prevEvents = await Event.countDocuments({
      createdAt: {
        $gte: subDays(new Date(), 1),
        $lt: new Date(),
      },
    });

    const eventsChange = percentageChange(totalEvents, prevEvents, "monthly");

    // 2. Bookings made today vs yesterday
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const bookingsToday = await Booking.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow },
    });

    const yesterday = subDays(today, 1);
    const bookingsYesterday = await Booking.countDocuments({
      createdAt: { $gte: yesterday, $lt: today },
    });

    const bookingsChange = percentageChange(
      bookingsToday,
      bookingsYesterday,
      "daily"
    );

    // 3. Active Users (current vs previous total)
    const activeUsers = await User.countDocuments({ status: "active" });
    const prevUsers = await User.countDocuments({
      createdAt: { $gte: subDays(new Date(), 1), $lt: new Date() },
    });
    const usersChange = percentageChange(activeUsers, prevUsers, "weekly");

    // 4. Pending Charters (current vs previous total)
    const pendingCharters = await Charter.countDocuments({ status: "pending" });
    const prevCharters = await Charter.countDocuments({
      createdAt: { $gte: subDays(new Date(), 1), $lt: new Date() },
    });
    const chartersChange = percentageChange(
      pendingCharters,
      prevCharters,
      "daily"
    );

    return {
      totalEvents,
      eventsChange,
      bookingsToday,
      bookingsChange,
      activeUsers,
      usersChange,
      pendingCharters,
      chartersChange,
    };
  }

  async getEarningsChartData(period: "daily" | "weekly" | "monthly") {
    let groupFormat: string;
    let start: Date;
    let end: Date;

    const now = new Date();

    if (period === "daily") {
      groupFormat = "yyyy-MM-dd";
      start = startOfWeek(now);
      end = endOfWeek(now);
    } else if (period === "weekly") {
      groupFormat = "yyyy-'W'II";
      start = startOfMonth(now);
      end = endOfMonth(now);
    } else {
      groupFormat = "yyyy-MM";
      start = startOfMonth(now);
      end = endOfMonth(now);
    }

    // Get all successful transactions in the period
    const transactions = await Transaction.find({
      status: "success",
      createdAt: { $gte: start, $lte: end },
    });

    // Group and sum earnings
    const earningsMap: Record<string, number> = {};
    transactions.forEach((tx) => {
      let dateKey: string;
      if (period === "daily") {
        dateKey = format(tx.createdAt, "yyyy-MM-dd");
      } else if (period === "weekly") {
        // Group by week number
        dateKey = format(tx.createdAt, "yyyy-'W'II");
      } else {
        dateKey = format(tx.createdAt, "yyyy-MM");
      }
      earningsMap[dateKey] = (earningsMap[dateKey] || 0) + (tx.amount || 0);
    });

    // Format for chart
    const chartData = Object.entries(earningsMap).map(([date, earning]) => ({
      date,
      earning,
    }));

    // Optionally, sort by date
    chartData.sort((a, b) => a.date.localeCompare(b.date));

    return chartData;
  }
}

export default new DashboardService();
