import { fetchGraphQL } from "../../graphql/fetchGraphQL.js";

export async function getConditionReplies() {
  const operationsDoc = `
  query getConditionReplies {
    conditions {
      keyword
      reply_details {
        content
        name
      }
    }
  }
`;

  function fetchGetConditionReplies() {
    return fetchGraphQL(
      operationsDoc,
      "getConditionReplies",
      {}
    );
  }

  async function startFetchGetConditionReplies() {
    const { errors, data } = await fetchGetConditionReplies();

    if (errors) {
      // handle those errors like a pro
      console.error(errors);
    }

    return data.conditions;
  }

  return startFetchGetConditionReplies();
}