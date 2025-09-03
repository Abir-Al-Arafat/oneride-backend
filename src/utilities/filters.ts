export const filterByDateRange = (filterByQuarter?: string) => {
  const date = new Date();
  switch (filterByQuarter) {
    case "thisWeek":
      return {
        $gte: new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() - date.getDay()
        ),
        $lte: new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() + (7 - date.getDay())
        ),
      };
    case "thisMonth":
      return {
        $gte: new Date(date.getFullYear(), date.getMonth(), 1),
        $lte: new Date(date.getFullYear(), date.getMonth() + 1, 0),
      };
    case "thisYear":
      return {
        $gte: new Date(date.getFullYear(), 0, 1),
        $lte: new Date(date.getFullYear(), 11, 31),
      };
    default:
      return undefined;
  }
};
