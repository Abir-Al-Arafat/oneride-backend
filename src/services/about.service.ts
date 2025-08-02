import path from "path";
import fs from "fs";
import aboutModel from "../models/aboutUs.model";
import { TUploadFields } from "../types/upload-fields";
const addAboutService = async (data: any, files: TUploadFields) => {
  let imageFileName = "";
  if (files && files["image"] && files.image[0]) {
    imageFileName = `public/uploads/images/${files.image[0].filename}`;
  }
  const about = await aboutModel.findOne({});
  if (about && about.heroImage) {
    const oldImagePath = path.join(__dirname, "../../", about.heroImage);
    fs.unlink(oldImagePath, (err) => {
      if (err) {
        console.error("Failed to delete old image:", err);
      }
    });
  }
  if (about) {
    const updatedAbout = await aboutModel.findByIdAndUpdate(about._id, data, {
      new: true,
    });
    if (imageFileName && updatedAbout) {
      updatedAbout!.heroImage = imageFileName;
      await updatedAbout.save();
    }
    return updatedAbout;
  }
  data.heroImage = imageFileName;
  return await aboutModel.create(data);
};

const updateAboutService = async (id: string, data: any) => {
  const about = await aboutModel.findByIdAndUpdate(id, data, { new: true });
  return about;
};

const deleteAboutService = async (id: string) => {
  const about = await aboutModel.findByIdAndDelete(id);
  return about;
};

const getAboutService = async () => {
  const about = await aboutModel.findOne({});
  if (!about) {
    throw new Error("About us information not found");
  }
  return about;
};

export {
  addAboutService,
  updateAboutService,
  deleteAboutService,
  getAboutService,
};
