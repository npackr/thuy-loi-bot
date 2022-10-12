import { getAdmissionIndustries } from "../../../database/queries/common/admission/admission_industries/getAdmissionIndustries.js";
import { getString } from "../../../languages/stringRouter.js";

export async function admissionIndustries(interaction, user) {
  const string = getString(user.language);
  const admissionIndustries = await getAdmissionIndustries();
  const admissionIndustriesList = admissionIndustries.map((admissionIndustry, index) => {
    if (admissionIndustry.description) {
      return (`> ${index + 1}. **${admissionIndustry.name}**\n` +
        `> ${string.REQUIRED_CLASS}: ${admissionIndustry.required_class}\n` +
        `> ${admissionIndustry.description}\n`);
    } else {
      return (`> ${index + 1}. **${admissionIndustry.name}**\n` +
        `> ${string.REQUIRED_CLASS}: ${admissionIndustry.required_class}\n`);
    }
  });
  const stringHeader = `${string.SCHOOL_LOGO}  **${string.ADMISSION_INDUSTRIES_LIST}**`;
  const stringBody = admissionIndustriesList.join("\n");
  await interaction.editReply({ content: `${stringHeader.toUpperCase()}\n\n${stringBody}`, ephemeral: true });
}