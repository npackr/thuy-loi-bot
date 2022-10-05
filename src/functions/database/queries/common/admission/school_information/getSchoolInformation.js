import { fetchGraphQL } from "../../../../graphql/fetchGraphQL.js";

export async function getSchoolInformation() {
  const operationsDoc = `
  query getSchoolInformation {
    admission_school_information {
      id
      name
      value
    }
  }
`;

  function fetchGetSchoolInformation() {
    return fetchGraphQL(
      operationsDoc,
      "getSchoolInformation",
      {}
    );
  }

  async function startFetchGetSchoolInformation() {
    const { errors, data } = await fetchGetSchoolInformation();

    if (errors) {
      console.error(errors);
    }
    return data.admission_school_information;
  }

  return startFetchGetSchoolInformation();
}