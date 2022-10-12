import { fetchGraphQL } from "../../../../graphql/fetchGraphQL.js";

export async function getAdmissionIndustries() {
  const operationsDoc = `
  query getAdmissionIndustries {
    admissions_industries {
      description
      general_id
      id
      name
      required_class
    }
  }
`;

  function fetchGetAdmissionIndustries() {
    return fetchGraphQL(
      operationsDoc,
      "getAdmissionIndustries",
      {}
    );
  }

  async function startFetchGetAdmissionIndustries() {
    const { errors, data } = await fetchGetAdmissionIndustries();

    if (errors) {
      console.error(errors);
    }
  return data.admissions_industries;
  }

  return startFetchGetAdmissionIndustries();
}