import { fetchGraphQL } from "../../../../graphql/fetchGraphQL.js";

export async function getMustKnowCategories() {
  const operationsDoc = `
  query getFeedCategories {
    admission_must_know_categories {
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
    return data.admission_must_know_categories;
  }

  return startFetchGetFeedCategories();
}