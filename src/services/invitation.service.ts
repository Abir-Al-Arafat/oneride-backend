import invitationModel from "../models/invitation.model";
import { emailWithNodemailerGmail } from "../config/email.config";

const addInvitationService = async (data: any) => {
  const invitation = await invitationModel.create(data);

  if (!invitation) {
    throw new Error("Error creating invitation");
  }

  return invitation;
};

const getAllInvitationsService = async () => {
  const invitations = await invitationModel.find();
  return invitations;
};

export { addInvitationService, getAllInvitationsService };
