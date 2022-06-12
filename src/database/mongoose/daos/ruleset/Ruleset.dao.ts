import { injectable } from 'inversify';

import { IRulesetDao } from '@apis/ruleset/Ruleset.ioc';

import { TCreateRuleset, TUpdateRuleSet, TUpdateRuleSets } from '@apis/ruleset/Ruleset.data';

import Ruleset from '@models/ruleset/Ruleset.model';

@injectable()
export default class RulesetDao implements IRulesetDao {
  public create = async (data: TCreateRuleset) => {
    const rulesetDocument = new Ruleset({
      ...data,
    });

    await rulesetDocument.save();

    return rulesetDocument.toObject();
  };

  public findById = async (rulesetId: string) => {
    const itemDocument = await Ruleset.findById(rulesetId).exec();

    return itemDocument ? itemDocument.toObject() : null;
  };

  public find = async () => {
    const itemDocuments = await Ruleset.find().exec();

    return itemDocuments.map((document) => document.toObject());
  };
  
  public update = async (data: TUpdateRuleSet) => {
    const { rulesetId } = data;
    await Ruleset.findByIdAndUpdate(rulesetId, data).exec();
  };

  public updateMany = async (data: TUpdateRuleSets) => {
    const { rulesetIds } = data;
    
    await Ruleset.updateMany({ rulesetId: { $in: [...rulesetIds] }}, data.data).exec();
  };
}
