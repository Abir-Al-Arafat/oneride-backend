import { Request, Response } from "express";
import { validationResult } from "express-validator";
import HTTP_STATUS from "../constants/statusCodes";
import { success, failure } from "../utilities/common";

import partnershipService from "../services/partnership.service";

import { UserRequest } from "../interfaces/user.interface";

class PartnershipController {
  public async createPartnership(req: UserRequest, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure(errors.array()[0].msg));
    }

    try {
      if (req?.user || req?.user?._id) {
        req.body.loggedInUser = req?.user?._id;
      }

      const partnership = await partnershipService.createPartnershipService(
        req.body
      );

      if (!partnership)
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send(failure("Error creating partnership"));

      return res
        .status(HTTP_STATUS.OK)
        .send(success("Partnership created", partnership));
    } catch (error: any) {
      return res.status(HTTP_STATUS.BAD_REQUEST).send(failure(error));
    }
  }

  public async togglePartnership(req: UserRequest, res: Response) {
    try {
      if (!req?.user || !req?.user?._id) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send(failure("admin access required"));
      }
      const validation = validationResult(req).array();
      if (validation.length) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send(failure("Validation failed", validation[0].msg));
      }
      const partnership = await partnershipService.togglePartnershipByIdService(
        req.params.id,
        req.body
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(success(`Partnership ${partnership?.status}`, partnership));
    } catch (error: any) {
      return res.status(HTTP_STATUS.BAD_REQUEST).send(failure(error));
    }
  }

  public async getAllPartnerships(req: Request, res: Response) {
    const query = req.query;
    try {
      const allPartnerships =
        await partnershipService.getAllPartnershipsService(query);

      return res
        .status(HTTP_STATUS.OK)
        .send(success("All partnerships", allPartnerships));
    } catch (error: any) {
      return res.status(HTTP_STATUS.BAD_REQUEST).send(failure(error));
    }
  }
}

export default new PartnershipController();
