import { Schema, model, Model, Document } from 'mongoose';

import { IRuleset } from '@apis/ruleset/Ruleset.data';

export interface IRulesetDocument extends IRuleset, Document {}

export type TRulesetModel = Model<IRulesetDocument>;

const rulesetSchema = new Schema<IRulesetDocument>(
  {
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    cashback: {
      type: Number,
      required: true,
    },
    redemptionLimit: {
      type: Number,
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
        ret.rulesetId = ret._id.toString();
        delete ret._id;
      },
    },
  },
);

export default model<IRulesetDocument, TRulesetModel>(
  'ruleset',
  rulesetSchema,
  'ruleset',
);
