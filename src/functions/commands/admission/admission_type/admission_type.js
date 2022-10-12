import { getAdmissionType } from "../../../database/queries/common/admission/admisstion_type/getAdmissionType.js";
import { getString } from "../../../languages/stringRouter.js";

export async function admissionType(interaction, user) {
  const string = getString(user.language);
  const admissionType = await getAdmissionType();
  const admissionTypeList = admissionType.map((admissionType, index) => {
    if (admissionType.description) {
      return (`${index + 1}. **${admissionType.name}**\n` +
        `${admissionType.description}\n`);
    } else {
      return (`${index + 1}. **${admissionType.name}**\n`);
    }
  });
  const stringHeader = `${string.SCHOOL_LOGO}  **${string.ADMISSION_TYPE_LIST}**`;
  const stringBody = admissionTypeList.join("\n");
  await interaction.editReply({ content: `${stringHeader.toUpperCase()}\n\n${stringBody}`, ephemeral: true });
}