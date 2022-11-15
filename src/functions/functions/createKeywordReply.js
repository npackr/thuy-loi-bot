import { createCondition } from "../database/mutation/createCondition.js";
import { createConditionReply } from "../database/mutation/createConditionReply.js";

export async function createKeywordReply(data) {
  const answer = data.answer;
  const keywords = data.keywords;
  const name = data.name;

  let result = Array();
  const reply = await createConditionReply({ content: answer, name: name });
  keywords.forEach(async keyword => {
    const condition = await createCondition({ replyId: reply.id, keyword: keyword });
    result.push(condition);
  });
  return true;
}