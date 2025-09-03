import { Request, Response } from "express";
import { validationResult } from "express-validator";
import HTTP_STATUS from "../constants/statusCodes";
import { success, failure } from "../utilities/common";

import {
  addTeamMemberService,
  updateTeamMemberService,
  deleteTeamMemberService,
  getAllTeamMemberService,
} from "../services/teamMember.service";

import { TUploadFields } from "../types/upload-fields";

const addTeamMember = async (req: Request, res: Response) => {
  try {
    // const validation = validationResult(req).array();
    // if (validation.length) {
    //   return res
    //     .status(HTTP_STATUS.BAD_REQUEST)
    //     .send(failure("Validation failed", validation[0].msg));
    // }

    const about = await addTeamMemberService(
      req.body,
      req.files as TUploadFields
    );
    if (!about) {
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Error adding team member information"));
    }
    res
      .status(HTTP_STATUS.CREATED)
      .send(success("Team member information added", about));
  } catch (error: any) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Error adding team member information", error.message));
  }
};

const updateTeamMember = async (req: Request, res: Response) => {
  try {
    // const validation = validationResult(req).array();
    // if (validation.length) {
    //   return res
    //     .status(HTTP_STATUS.BAD_REQUEST)
    //     .send(failure("Validation failed", validation[0].msg));
    // }
    console.log("req.body", req.body);
    console.log("req.files", req.files);
    const about = await updateTeamMemberService(
      req.params.id,
      req.body,
      req.files as TUploadFields
    );
    if (!about) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .send(failure("Team member information not found"));
    }
    res
      .status(HTTP_STATUS.OK)
      .send(success("Team member information updated", about));
  } catch (error: any) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Error updating team member information", error.message));
  }
};
const deleteTeamMember = async (req: Request, res: Response) => {
  try {
    const validation = validationResult(req).array();
    if (validation.length) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("Validation failed", validation[0].msg));
    }
    const about = await deleteTeamMemberService(req.params.id);
    console.log("about", about);
    if (!about) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .send(failure("Team member information not found"));
    }
    res
      .status(HTTP_STATUS.OK)
      .send(success("Team member information deleted", about));
  } catch (error: any) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Error deleting team member information", error.message));
  }
};
const getAllTeamMembers = async (req: Request, res: Response) => {
  try {
    // const validation = validationResult(req).array();
    // if (validation.length) {
    //   return res
    //     .status(HTTP_STATUS.BAD_REQUEST)
    //     .send(failure("Validation failed", validation[0].msg));
    // }

    const abouts = await getAllTeamMemberService();
    if (!abouts) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .send(failure("About us information not found"));
    }
    res
      .status(HTTP_STATUS.OK)
      .send(success("About us information fetched", abouts));
  } catch (error: any) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Error fetching about us information", error.message));
  }
};

export { addTeamMember, getAllTeamMembers, updateTeamMember, deleteTeamMember };
