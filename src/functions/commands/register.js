import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { getString } from "../languages/stringRouter.js";

export async function register(interaction, user, options) {
  const string = getString(user.language);
  const configurations = options.configurations;
  const allowRegister = configurations.find(setting => setting.name === 'allowRegister').value;
  if (!allowRegister) { return await interaction.editReply({ content: `${string.REGISTER_TIMEOUT}`, ephemeral: true }); }
  
  const addmissButton = new ButtonBuilder().setLabel(string.GO_REGISTER).setStyle(ButtonStyle.Link).setURL('https://nhaphoc.tlu.edu.vn/');
  const addmissionOptions = new ActionRowBuilder().addComponents(addmissButton);
  const stringHeader = `${string.SCHOOL_LOGO}\n**${string.NEW_STUDENT_REGISTER.toUpperCase()}**\n`;
  return await interaction.editReply({ content: `${stringHeader}${string.WELCOME_TO_REGISTER}!\n\n${string.REGISTER_DESCRIPTION}`, components: [addmissionOptions], ephemeral: true });
}