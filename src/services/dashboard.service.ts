import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subDays,
  subMonths,
} from "date-fns";
import Event from "../models/event.model";
import Booking from "../models/booking.model";
import User from "../models/user.model";
import Charter from "../models/charter.model";
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
}

export default new DashboardService();
