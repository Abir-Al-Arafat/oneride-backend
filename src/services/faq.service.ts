import faqModel from "../models/faq.model";

class FaqService {
  async addFaq(faqData: any) {
    try {
      const faq = new faqModel(faqData);
      await faq.save();
      return faq;
    } catch (error) {
      throw new Error("Error adding FAQ");
    }
  }

  async getFaqById(faqId: string) {
    try {
      const faq = await faqModel.findById(faqId);
      return faq;
    } catch (error) {
      throw new Error("Error fetching FAQ");
    }
  }

  async updateFaq(faqId: string, faqData: any) {
    try {
      const faq = await faqModel.findByIdAndUpdate(faqId, faqData, {
        new: true,
      });
      return faq;
    } catch (error) {
      throw new Error("Error updating FAQ");
    }
  }

  async deleteFaq(faqId: string) {
    try {
      const faq = await faqModel.findByIdAndDelete(faqId);
      return faq;
    } catch (error) {
      throw new Error("Error deleting FAQ");
    }
  }

  async getAllFaqs() {
    try {
      const faqs = await faqModel.find();
      return faqs;
    } catch (error) {
      throw new Error("Error fetching FAQs");
    }
  }
}

export default new FaqService();
