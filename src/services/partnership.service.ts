import partnershipModel from "../models/partnership.model";
import { IQuery } from "../types/query-params";
import QueryHelper from "../utilities/QueryHelper";

class PartnershipService {
  public async getAllPartnershipsService(query?: IQuery) {
    return await partnershipModel.find();
  }
  public async createPartnershipService(data: any) {
    return await partnershipModel.create(data);
  }
  public async updatePartnershipService(id: string, data: any) {
    return await partnershipModel.findByIdAndUpdate(id, data, { new: true });
  }
  public async deletePartnershipService(id: string) {
    return await partnershipModel.findByIdAndDelete(id);
  }
  public async getPartnershipByIdService(id: string) {
    return await partnershipModel.findById(id);
  }

  public async togglePartnershipByIdService(id: string, data: any) {
    return await partnershipModel.findByIdAndUpdate(id, data, { new: true });
  }
}

export default new PartnershipService();
