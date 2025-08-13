import transactionModel from "../models/transaction.model";

class TransactionService {
  async createTransaction(data: any) {
    const transaction = await transactionModel.create(data);
    return transaction;
  }
}

export default new TransactionService();
