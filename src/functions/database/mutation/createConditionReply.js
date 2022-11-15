import { fetchGraphQL } from "../graphql/fetchGraphQL.js";

export async function createConditionReply(reply) {
  const content = reply.content;
  const name = reply.name;
  let operationsDoc;
  if (reply.name) {
    operationsDoc = `
      mutation insertConditionReply {
        insert_conditions_replies(objects: {content: "${content}", name: "${name}"}) {
          returning {
            id
          }
        }
      }`;
  } else {
    operationsDoc = `
      mutation insertConditionReply {
        insert_conditions_replies(objects: {content: "${content}"}) {
          returning {
            id
          }
        }
      }`;
  }


  function executeInsertConditionReply() {
    return fetchGraphQL(
      operationsDoc,
      "insertConditionReply",
      {}
    );
  }

  async function startExecuteInsertConditionReply() {
    const { errors, data } = await executeInsertConditionReply();

    if (errors) {
      // handle those errors like a pro
      console.error(errors);
    }

    return data.insert_conditions_replies.returning[0];
  }

  return startExecuteInsertConditionReply();
}