import { injectable } from 'inversify';

import { ITransactionDao } from '@apis/transaction/Transaction.ioc';

import { TCreateTransaction } from '@apis/transaction/Transaction.data';

import Transaction from '@models/transaction/Transaction.model';

@injectable()
export default class TransactionDao implements ITransactionDao {
  public create = async (data: TCreateTransaction) => {
    const transactionDocument = new Transaction({
      ...data,
      customerId: 1,
      transactionId: data.id,
    });

    await transactionDocument.save();

    return transactionDocument.toObject();
  };

  public findById = async (transactionId: number) => {
    const itemDocument = await Transaction.findOne({ transactionId });

    return itemDocument ? itemDocument.toObject() : null;
  };

  public find = async () => {
    const itemDocuments = await Transaction.find();

    return itemDocuments.map((document) => document.toObject());
  };
}
