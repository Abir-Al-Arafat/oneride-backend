import fs from "fs";
import path from "path";
import allyModel from "../models/ally.model";
import { IQuery } from "../types/query-params";
import QueryHelper from "../utilities/QueryHelper";
const addAllyService = async (data: any, file?: Express.Multer.File) => {
  const ally = await allyModel.create(data);
  if (!ally) {
    return null;
  }
  if (file) {
    // define new file path
    const newFileName =
      Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    const newFilePath = path.join("public/uploads/images", newFileName);
    // save buffer to disk
    fs.writeFileSync(newFilePath, file.buffer);
    ally.logo = `public/uploads/images/${newFileName}`;
    await ally.save();
  }
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
  const { status, type, page = 1, limit = 10 } = query || {};
  const filter: IQuery = {};
  if (status) {
    filter.status = status;
  }
  if (type) {
    filter.type = type;
  }

  const queryHelper = new QueryHelper<typeof allyModel>();

  return await queryHelper.query(allyModel, {
    filter,
    page: Number(page),
    limit: Number(limit),
  });
};

export {
  addAllyService,
  updateAllyService,
  deleteAllyService,
  getAllAllyService,
};
