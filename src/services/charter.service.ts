import Charter from "../models/charter.model";
import { filterByDateRange } from "../utilities/filters";

const createCharterService = async (charterData: any) => {
  const charter = await Charter.create(charterData);
  return charter;
};

const deleteCharterService = async (id: string) => {
  const charter = await Charter.findByIdAndDelete(id);
  return charter;
};

const getAllChartersService = async (queryParams: any) => {
  const { name, status, limit, page, filterByQuarter } = queryParams;
  const query: any = {};

  if (name) {
    query.name = { $regex: name, $options: "i" };
  }
  if (status) {
    query.status = status;
  }
  // Add date filter if needed
  const dateRange = filterByDateRange(filterByQuarter);
  if (dateRange) {
    query.createdAt = dateRange;
  }

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;

  const charters = await Charter.find(query)
    .limit(limitNum)
    .skip((pageNum - 1) * limitNum);

  const totalItems = await Charter.countDocuments(query);
  const totalPages = Math.ceil(totalItems / limitNum);

  return {
    result: charters,
    currentPage: pageNum,
    totalPages,
    totalItems,
  };
};

const updateCharterStatusService = async (id: string, status: string) => {
  const charter = await Charter.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
  return charter;
};

const getCharterByIdService = async (id: string) => {
  const charter = await Charter.findById(id);
  return charter;
};

export {
  createCharterService,
  deleteCharterService,
  getAllChartersService,
  updateCharterStatusService,
  getCharterByIdService,
};
