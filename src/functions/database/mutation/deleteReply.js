import { fetchGraphQL } from "../graphql/fetchGraphQL.js";

export async function deleteReply(replyId) {
  const operationsDoc = `
  mutation deleteReply {
    delete_conditions_replies(where: {id: {_eq: ${replyId}}}) {
      affected_rows
    }
  }
`;

  function executeDeleteReply() {
    return fetchGraphQL(
      operationsDoc,
      "deleteReply",
      {}
    );
  }

  async function startExecuteDeleteReply() {
    const { errors, data } = await executeDeleteReply();

    if (errors) {
      // handle those errors like a pro
      console.error(errors);
    }

    return data.delete_conditions_replies.affected_rows;
  }

  return startExecuteDeleteReply();
}