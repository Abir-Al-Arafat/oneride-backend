import transportModel from "../models/transport.model";

class TransportService {
  async createTransport(transportData: any) {
    const transport = await transportModel.create(transportData);
    return transport;
  }
  async getAllTransports() {
    const transports = await transportModel.find();
    return transports;
  }

  async getTransportById(id: string) {
    const transport = await transportModel.findById(id);
    return transport;
  }
}

export default new TransportService();
