import partnershipModel from "../models/partnership.model";
import { IQuery } from "../types/query-params";
import QueryHelper from "../utilities/QueryHelper";

class PartnershipService {
  public async getAllPartnershipsService(query?: IQuery) {
    const { search, status, type, page = 1, limit = 10 } = query || {};
    const filter: IQuery = {};
    if (status) {
      filter.status = status;
    }
    if (type) {
      filter.type = type;
    }

    const queryHelper = new QueryHelper<typeof partnershipModel>();
    return await queryHelper.query(partnershipModel, {
      search: search || undefined,
      searchFields: ["eventName"], // search only by title
      filter,
      page: Number(page),
      limit: Number(limit),
    });
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
