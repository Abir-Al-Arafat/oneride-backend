import termModel from "../models/term.model";

class TermService {
  async addTermConditions(data: any) {
    const termExists = await termModel.findOne({});
    if (termExists) {
      return await termModel.findOneAndUpdate({}, data, { new: true });
    }
    return await termModel.create(data);
  }
  async getAllTermsConditions() {
    return await termModel.find();
  }
}

export default new TermService();
