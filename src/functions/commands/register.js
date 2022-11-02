import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder } from "discord.js";
import { cooldownTime } from "../../../deploy-commands.js";
import { getCategories } from "../database/queries/common/getCategories.js";
import { getString } from "../languages/stringRouter.js";

export async function register(interaction, user, options) {
  const string = getString(user.language);
  const configurations = options.configurations;
  const allowRegister = configurations.find(setting => setting.name === 'allowRegister').value;
  const stringHeader = `${string.SCHOOL_LOGO}\n**${string.NEW_STUDENT_REGISTER.toUpperCase()}**\n\n`;
  if (!allowRegister) { return await interaction.editReply({ content: `${stringHeader}${string.REGISTER_TIMEOUT}`, ephemeral: true }); }
  const categories = await getCategories(2);
  const selectMenu = new SelectMenuBuilder().setCustomId('select_register_category').setPlaceholder(string.SELECT_CATEGORIES).addOptions(categories.map(category => {
    return { label: category.name, value: category.id.toString(), description: category.description }
  }));
  const categoryRow = new ActionRowBuilder().addComponents(selectMenu);
  await interaction.editReply({ content: `${stringHeader}`, components: [categoryRow] });

  const filter = i => i.customId === 'select_register_category' && i.user.id === interaction.user.id;
  const collector = interaction.channel.createMessageComponentCollector({ filter, time: cooldownTime });
  collector.on('collect', async i => {
    await i.update({ content: string.LOADING_STRING, components: [] }).catch(console.error);
    const category = categories.find(category => category.id.toString() === i.values[0]);
    const registerButton = new ButtonBuilder().setLabel(category.url_name).setStyle(ButtonStyle.Link).setURL(category.url);
    const registerOptions = new ActionRowBuilder().addComponents(registerButton);
    return await interaction.editReply({ content: `${stringHeader}${category.content}`, components: [registerOptions], ephemeral: true });
  });
}