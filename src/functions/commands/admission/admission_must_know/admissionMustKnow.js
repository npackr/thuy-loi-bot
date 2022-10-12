import { getString } from "../../../languages/stringRouter.js";

export async function admissionMustKnow(interaction, user) {
  const string = getString(user.language);
  await interaction.editReply({ content: string.FEATURE_ARE_IN_DEVELOPMENT, ephemeral: true });
}