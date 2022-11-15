import { fetchGraphQL } from "../../../graphql/fetchGraphQL.js";

export async function getConditions(replyId) {
  const operationsDoc = `
  query getConditions {
    conditions(where: {reply: {_eq: ${replyId}}}) {
      id
    }
  }
`;

  function fetchGetConditions() {
    return fetchGraphQL(
      operationsDoc,
      "getConditions",
      {}
    );
  }

  async function startFetchGetConditions() {
    const { errors, data } = await fetchGetConditions();

    if (errors) {
      // handle those errors like a pro
      console.error(errors);
    }

    return data.conditions;
  }

  return startFetchGetConditions();
}