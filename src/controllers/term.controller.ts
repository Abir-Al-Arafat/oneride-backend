import { Request, Response } from "express";
import { validationResult } from "express-validator";
import HTTP_STATUS from "../constants/statusCodes";
import { success, failure } from "../utilities/common";

import termService from "../services/term.service";

class TermController {
  async addTerm(req: Request, res: Response) {
    try {
      const validation = validationResult(req).array();
      if (validation.length) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send(failure("Validation failed", validation[0].msg));
      }

      const { content } = req.body;

      if (!content) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send(failure("Content is required"));
      }

      const term = await termService.addTermConditions(req.body);
      if (!term) {
        return res
          .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
          .send(failure("Error adding term conditions"));
      }

      res
        .status(HTTP_STATUS.CREATED)
        .send(success("Term conditions added", term));
    } catch (error: any) {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Error adding term conditions", error.message));
    }
  }

  async getAllTerms(req: Request, res: Response) {
    try {
      const terms = await termService.getAllTermsConditions();
      if (!terms) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("No term conditions found"));
      }

      res
        .status(HTTP_STATUS.OK)
        .send(success("Term conditions fetched", terms));
    } catch (error: any) {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Error fetching term conditions", error.message));
    }
  }
}

export default new TermController();
