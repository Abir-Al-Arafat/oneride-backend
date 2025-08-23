import { Request, Response } from "express";
import { validationResult } from "express-validator";
import HTTP_STATUS from "../constants/statusCodes";
import { success, failure } from "../utilities/common";

import faqService from "../services/faq.service";

import { TUploadFields } from "../types/upload-fields";

class FaqController {
  async createFAQ(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("Validation failed", errors.array()[0].msg));
    }

    try {
      const faq = await faqService.addFaq(req.body);
      return res.status(HTTP_STATUS.CREATED).send(success("FAQ created", faq));
    } catch (error: any) {
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Error creating FAQ", error.message));
    }
  }

  async getFAQ(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const faq = await faqService.getFaqById(id);
      if (!faq) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure("FAQ not found"));
      }
      return res.status(HTTP_STATUS.OK).send(success("FAQ fetched", faq));
    } catch (error: any) {
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Error fetching FAQ", error.message));
    }
  }

  async updateFAQ(req: Request, res: Response) {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("Validation failed", errors.array()[0].msg));
    }

    try {
      const faq = await faqService.updateFaq(id, req.body);
      if (!faq) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure("FAQ not found"));
      }
      return res.status(HTTP_STATUS.OK).send(success("FAQ updated", faq));
    } catch (error: any) {
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Error updating FAQ", error.message));
    }
  }

  async deleteFAQ(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const faq = await faqService.deleteFaq(id);
      if (!faq) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(failure("FAQ not found"));
      }
      return res.status(HTTP_STATUS.OK).send(success("FAQ deleted", faq));
    } catch (error: any) {
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Error deleting FAQ", error.message));
    }
  }

  async getAllFAQs(req: Request, res: Response) {
    try {
      const faqs = await faqService.getAllFaqs();
      return res.status(HTTP_STATUS.OK).send(success("FAQs fetched", faqs));
    } catch (error: any) {
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Error fetching FAQs", error.message));
    }
  }
}

export default new FaqController();
