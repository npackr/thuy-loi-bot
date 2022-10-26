import { fetchGraphQL } from "../../graphql/fetchGraphQL.js";

export async function getCommands() {
  const operationsDoc = `
  query getCommands {
    commands {
      description
      id
      name
    }
  }
`;

  function fetchGetCommands() {
    return fetchGraphQL(
      operationsDoc,
      "getCommands",
      {}
    );
  }

  async function startFetchGetCommands() {
    const { errors, data } = await fetchGetCommands();

    if (errors) {
      // handle those errors like a pro
      console.error(errors);
    }
    return data.commands;
  }

  return startFetchGetCommands();
}