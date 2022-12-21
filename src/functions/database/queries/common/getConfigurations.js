import { fetchGraphQL } from "../../graphql/fetchGraphQL.js";
export async function getConfigurations() {
  const operationsDoc = `
  query getConfigurations {
    settings {
      name
      value
      id
      options
    }
  }
`;

  function fetchGetConfigurations() {
    return fetchGraphQL(
      operationsDoc,
      "getConfigurations",
      {}
    );
  }

  async function startFetchGetConfigurations() {
    const { errors, data } = await fetchGetConfigurations();

    if (errors) {
      // handle those errors like a pro
      console.error(errors);
    }

    // do something great with this precious data
    return data.settings;
  }

  return startFetchGetConfigurations();
}