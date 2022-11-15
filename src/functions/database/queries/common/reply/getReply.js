import { fetchGraphQL } from "../../../graphql/fetchGraphQL.js";

export async function getReply(keyword, limit) {
  const operationsDoc = `
  query getReply {
    conditions(where: {keyword: {_eq: "${keyword}"}}, limit: ${limit}) {
      keyword
      reply_details {
        id
        content
        name
      }
    }
  }
`;

function fetchGetReply() {
  return fetchGraphQL(
    operationsDoc,
    "getReply",
    {}
  );
}

async function startFetchGetReply() {
  const { errors, data } = await fetchGetReply();

  if (errors) {
    // handle those errors like a pro
    console.error(errors);
  }

  return data.conditions;
}

return startFetchGetReply();
}