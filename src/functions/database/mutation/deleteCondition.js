import { fetchGraphQL } from "../graphql/fetchGraphQL.js";

export async function deleteCondition(id) {
  const operationsDoc = `
  mutation deleteCondition {
    delete_conditions(where: {id: {_eq: ${id}}}) {
      affected_rows
    }
  }
`;

  function executeDeleteCondition() {
    return fetchGraphQL(
      operationsDoc,
      "deleteCondition",
      {}
    );
  }

  async function startExecuteDeleteCondition() {
    const { errors, data } = await executeDeleteCondition();

    if (errors) {
      // handle those errors like a pro
      console.error(errors);
    }

    return data.delete_conditions.affected_rows;
  }

  return startExecuteDeleteCondition();
}