import { admission } from "./commands/admission.js";

export async function commandsRouter(command, interaction, user) {
  switch (command) {
    case "admission":
      return await admission(interaction, user);
    default:
      return await interaction.editReply("Command not found");
  }
}