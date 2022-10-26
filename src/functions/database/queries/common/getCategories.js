import { fetchGraphQL } from "../../graphql/fetchGraphQL.js";

export async function getCategories(commandId) {
  const operationsDoc = `
  query getCategories {
    categories(where: {command: {_eq: ${commandId}}}) {
      description
      id
      lang
      name
      url
      url_name
      editable
      content
    }
  }
`;

  function fetchGetCategories() {
    return fetchGraphQL(
      operationsDoc,
      "getCategories",
      {}
    );
  }

  async function startFetchGetCategories() {
    const { errors, data } = await fetchGetCategories();

    if (errors) {
      // handle those errors like a pro
      console.error(errors);
    }

    return data.categories;
  }

  return startFetchGetCategories();
}