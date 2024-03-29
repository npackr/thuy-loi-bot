import { reply } from "./commands/reply.js";
import { admission } from "./commands/admission.js";
import { register } from "./commands/register.js";

export async function commandsRouter(command, interaction, user, options) {
  switch (command) {
    case "admission": return await admission(interaction, user);
    case "register": return await register(interaction, user, options);
    case "reply": return await reply(interaction, user);
    default:
      return await interaction.editReply("Command not found!");
  }
}