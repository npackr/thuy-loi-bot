import fetch from "node-fetch";


export async function fetchGraphQL(operationsDoc, operationName, variables) {
  const endpoint = "https://nearby-squirrel-90.hasura.app/v1/graphql";
  const headers = {
    "content-type": "application/json",
    "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
  };

  const result = await fetch(
    endpoint,
    {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        query: operationsDoc,
        variables: variables,
        operationName: operationName
      })
    }
  );

  return await result.json();
}
