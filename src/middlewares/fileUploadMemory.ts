import multer from "multer";

const fileUploadMemory = multer({
  storage: multer.memoryStorage(),
}).fields([
  { name: "image", maxCount: 1 },
  { name: "productImage", maxCount: 10 },
  { name: "categoryImage", maxCount: 1 },
  { name: "videoFile", maxCount: 1 },
  { name: "audioFile", maxCount: 1 },
  { name: "pdfFiles", maxCount: 5 },
  { name: "previewPdfFiles", maxCount: 3 },
  { name: "passportIdFront", maxCount: 1 },
  { name: "passportIdBack", maxCount: 1 },
  { name: "drivingLicenseFront", maxCount: 1 },
  { name: "drivingLicenseBack", maxCount: 1 },
  { name: "carImages", maxCount: 10 },
]);

export default fileUploadMemory;
