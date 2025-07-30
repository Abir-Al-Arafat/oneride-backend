import { Request, Response } from "express";
import { validationResult } from "express-validator";
import HTTP_STATUS from "../constants/statusCodes";
import { success, failure } from "../utilities/common";
import invitationModel from "../models/invitation.model";
import { emailWithNodemailerGmail } from "../config/email.config";
import {
  addInvitationService,
  getAllInvitationsService,
} from "../services/invitation.service";

const addInvitation = async (req: Request, res: Response) => {
  try {
    const validation = validationResult(req).array();
    if (validation.length) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("Failed to create invitation", validation[0].msg));
    }

    const invitation = await addInvitationService(req.body);

    if (!invitation) {
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Error creating invitation"));
    }

    if (invitation.email) {
      const emailData = {
        email: invitation.email,
        subject: "Invitation to Join Oneride",
        html: `<h6>Hello there </h6><p> you have been invited to join oneride.</p> ${
          invitation.optionalMessage
            ? `<p>${invitation.optionalMessage}</p>`
            : ""
        }`,
      };

      emailWithNodemailerGmail(emailData);
    }

    res
      .status(HTTP_STATUS.CREATED)
      .send(success("Invitation added", invitation));
  } catch (error: any) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Error adding invitation", error.message));
  }
};

const getAllInvitations = async (req: Request, res: Response) => {
  try {
    const invitations = await getAllInvitationsService();
    if (!invitations.length) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .send(failure("invitation not found"));
    }
    res.status(HTTP_STATUS.OK).send(success("invitation fetched", invitations));
  } catch (error: any) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(failure("Error fetching invitation", error.message));
  }
};

export { addInvitation, getAllInvitations };
