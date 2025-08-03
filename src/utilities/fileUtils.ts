import path from "path";
import fs from "fs";

export const deleteImageFile = (imagePath: string) => {
  const oldImagePath = path.join(__dirname, "../../", imagePath);
  console.log("oldImagePath", oldImagePath);
  fs.unlink(oldImagePath, (err) => {
    if (err) {
      console.error("Failed to delete old image:", err);
    }
  });
};
export const saveImageFile = (
  file: Express.Multer.File,
  uploadDir: string
): string => {
  const fileName = `${Date.now()}-${file.originalname}`;
  const filePath = path.join(uploadDir, fileName);
  fs.writeFileSync(filePath, file.buffer);
  return filePath;
};
