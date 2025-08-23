import fs from "fs";
import path from "path";
import allyModel from "../models/ally.model";
import { IQuery } from "../types/query-params";
import QueryHelper from "../utilities/QueryHelper";
import { handleFileUpload } from "../utilities/fileUtils";
const addAllyService = async (data: any, file?: Express.Multer.File) => {
  const ally = await allyModel.create(data);
  if (!ally) {
    return null;
  }
  if (file) {
    const savedFilePath = handleFileUpload(file);
    if (savedFilePath) {
      ally.logo = savedFilePath;
      await ally.save();
    }
  }
  return ally;
};

const updateAllyService = async (
  id: string,
  data: any,
  file?: Express.Multer.File
) => {
  const ally = await allyModel.findById(id);
  if (!ally) {
    return null;
  }
  Object.assign(ally, data);
  await ally.save();
  if (file) {
    const savedFilePath = handleFileUpload(file, ally.logo || null);
    if (savedFilePath) {
      ally.logo = savedFilePath;
      await ally.save();
    }
  }
  return ally;
};

const deleteAllyService = async (id: string) => {
  const ally = await allyModel.findByIdAndDelete(id);
  if (ally) {
    if (ally.logo) {
      const oldImagePath = path.join(__dirname, "../../", ally.logo);
      fs.unlink(oldImagePath, (err) => {
        if (err) console.error("Failed to delete old image:", err);
      });
    }
  }
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
