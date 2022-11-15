import { fetchGraphQL } from "../graphql/fetchGraphQL.js";

export async function createCondition(condition) {
  const replyId = condition.replyId;
  const keyword = condition.keyword;
  const operationsDoc = `
  mutation insertCondition {
    insert_conditions(objects: {reply: ${replyId}, keyword: "${keyword}"}) {
      returning {
        id
      }
    }
  }
`;

  function executeInsertCondition() {
    return fetchGraphQL(
      operationsDoc,
      "insertCondition",
      {}
    );
  }

  async function startExecuteInsertCondition() {
    const { errors, data } = await executeInsertCondition();

    if (errors) {
      // handle those errors like a pro
      console.error(errors);
    }

    return data.insert_conditions.returning[0];
  }

  return startExecuteInsertCondition();
}