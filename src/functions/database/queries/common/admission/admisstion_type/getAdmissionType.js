import { fetchGraphQL } from "../../../../graphql/fetchGraphQL.js";

export async function getAdmissionType() {
  const operationsDoc = `
  query getAdmissionType {
    admission_type {
      description
      id
      name
    }
  }
`;

  function fetchGetAdmissionType() {
    return fetchGraphQL(
      operationsDoc,
      "getAdmissionType",
      {}
    );
  }

  async function startFetchGetAdmissionType() {
    const { errors, data } = await fetchGetAdmissionType();

    if (errors) {
      // handle those errors like a pro
      console.error(errors);
    }
    return data.admission_type;
  }

  return startFetchGetAdmissionType();
}