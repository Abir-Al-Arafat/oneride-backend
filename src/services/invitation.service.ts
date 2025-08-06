import invitationModel from "../models/invitation.model";

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
