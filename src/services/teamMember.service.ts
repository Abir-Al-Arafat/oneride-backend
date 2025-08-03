import { deleteImageFile } from "../utilities/fileUtils";
import teamMemberModel from "../controllers/teamMember.model";
import { TUploadFields } from "../types/upload-fields";

const addTeamMemberService = async (data: any, files: TUploadFields) => {
  let imageFileName = "";
  if (files && files["image"] && files.image[0]) {
    imageFileName = `public/uploads/images/${files.image[0].filename}`;
  }
  data.image = imageFileName;
  const teamMember = await teamMemberModel.create(data);
  return teamMember;
};

const updateTeamMemberService = async (
  id: string,
  data: any,
  files?: TUploadFields
) => {
  let imageFileName = "";
  if (files && files["image"] && files.image[0]) {
    imageFileName = `public/uploads/images/${files.image[0].filename}`;
  }
  const teamMember = await teamMemberModel.findById(id);

  if (teamMember && teamMember.image) {
    deleteImageFile(teamMember.image);
  }
  teamMember!.name = data.name && data.name;
  teamMember!.role = data.role && data.role;
  if (imageFileName) teamMember!.image = imageFileName;
  await teamMember!.save();
  return teamMember;
};

const deleteTeamMemberService = async (id: string) => {
  const teamMember = await teamMemberModel.findByIdAndDelete(id);
  if (teamMember && teamMember.image) {
    deleteImageFile(teamMember.image);
  }
  return teamMember;
};

const getAllTeamMemberService = async () => {
  const teamMembers = await teamMemberModel.find({});
  return teamMembers;
};

export {
  addTeamMemberService,
  updateTeamMemberService,
  deleteTeamMemberService,
  getAllTeamMemberService,
};
