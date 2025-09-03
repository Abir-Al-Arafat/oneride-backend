export function percentageChange(
  current: number,
  previous: number,
  period: "daily" | "weekly" | "monthly"
): {
  change: string;
  trend: "increase" | "decrease" | "no-change";
  period: string;
} {
  if (previous === 0) {
    // If there were no previous records, any current value means 100% increase
    if (current > 0) {
      return { change: "100.00", trend: "increase", period };
    } else {
      return { change: "0.00", trend: "no-change", period };
    }
  }

  const difference = current - previous;
  const percentageChange = (difference / previous) * 100;

  return {
    change: percentageChange.toFixed(2),
    trend:
      percentageChange > 0
        ? "increase"
        : percentageChange < 0
        ? "decrease"
        : "no-change",
    period,
  };
}
