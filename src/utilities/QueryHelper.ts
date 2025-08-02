type QueryOptions = {
  search?: string;
  searchFields?: string[];
  filter?: Record<string, any>;
  sort?: string;
  page?: number;
  limit?: number;
};

class QueryHelper<T> {
  async query(
    model: any,
    options: QueryOptions = {}
  ): Promise<{
    result: T[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
  }> {
    const {
      search,
      searchFields = [],
      filter = {},
      sort = "",
      page = 1,
      limit = 10,
    } = options;

    let dbQuery: any = { ...filter };

    // Searching
    if (search && searchFields.length) {
      dbQuery.$or = searchFields.map((field) => ({
        [field]: { $regex: search, $options: "i" },
      }));
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

    return {
      result,
      currentPage: page,
      totalPages,
      totalItems,
    };
  }
}

export default QueryHelper;
