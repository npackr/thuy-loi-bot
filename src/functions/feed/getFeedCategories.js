import { fetchGraphQL } from "../database/graphql/fetchGraphQL.js";

export async function getFeedCategories() {
  const operationsDoc = `
  query getFeedCategories {
    feed_categories {
      description
      id
      name
      url
    }
  }
`;

  function fetchGetFeedCategories() {
    return fetchGraphQL(
      operationsDoc,
      "getFeedCategories",
      {}
    );
  }

  async function startFetchGetFeedCategories() {
    const { errors, data } = await fetchGetFeedCategories();

    if (errors) {
      // handle those errors like a pro
      console.error(errors);
    }
  return data.feed_categories;
  }

  return startFetchGetFeedCategories();
}