import allyModel from "../models/ally.model";
import { IQuery } from "../types/query-params";

const addAllyService = async (data: any) => {
  const ally = await allyModel.create(data);
  return ally;
};

const updateAllyService = async (id: string, data: any) => {
  const ally = await allyModel.findByIdAndUpdate(id, data, { new: true });
  return ally;
};

const deleteAllyService = async (id: string) => {
  const ally = await allyModel.findByIdAndDelete(id);
  return ally;
};

const getAllAllyService = async (query?: IQuery) => {
  const dbQuery: any = {};
  if (query && query.status) {
    dbQuery.status = query.status;
  }
  if (query && query.type) {
    dbQuery.type = query.type;
  }
  const allies = await allyModel.find(dbQuery);
  return allies;
};

export {
  addAllyService,
  updateAllyService,
  deleteAllyService,
  getAllAllyService,
};
