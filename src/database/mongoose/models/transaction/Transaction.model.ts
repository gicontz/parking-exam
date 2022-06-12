import { Schema, model, Model, Document } from 'mongoose';

import { ITransaction } from '@apis/transaction/Transaction.data';

export interface ITransactionDocument extends ITransaction, Document {}

export type TTransactionModel = Model<ITransactionDocument>;

const transactionSchema = new Schema<ITransactionDocument>(
  {
    transactionId: {
      type: Number,
      required: true,
      unique: true,
    },
    date: {
      type: Date,
      required: true,
    },
    customerId: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
    toObject: {
      versionKey: false,
      transform(doc, ret) {
        ret.itemId = ret._id.toString();
        delete ret._id;
      },
    },
  },
);

export default model<ITransactionDocument, TTransactionModel>(
  'transaction',
  transactionSchema,
  'transaction',
);
