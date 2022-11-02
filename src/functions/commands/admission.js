import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder } from "discord.js";
import { cooldownTime } from "../../../deploy-commands.js";
import { getCategories } from "../database/queries/common/getCategories.js";
import { getString } from "../languages/stringRouter.js";
import { admissionMustKnow } from "./admission/admission_must_know/admissionMustKnow.js";

export async function admission(interaction, user) {
  const string = getString(user.language);
  const stringHeader = `${string.SCHOOL_LOGO}\n**${string.ADMISSION_INFOMATION}**`;
  const stringSubHeader = `**${string.UNIVERSITY_DEGREE} ${new Date().getFullYear()}**`;
  const categories = await getCategories(1);
  const categoryRow = new ActionRowBuilder().addComponents(
    new SelectMenuBuilder().setCustomId('select_category').setPlaceholder('Danh mục thông tin tuyển sinh').addOptions(categories.map(category => {
      return { label: category.name, value: category.id.toString(), description: category.description }
    })));
  await interaction.editReply({ content: `${stringHeader.toUpperCase()}\n${stringSubHeader}`, components: [categoryRow] });

  const filter = i => i.customId === 'select_category' && i.user.id === interaction.user.id;
  const collector = interaction.channel.createMessageComponentCollector({ filter, time: cooldownTime });
  collector.on('collect', async i => {
    await i.update({ content: string.LOADING_STRING, components: [] }).catch(console.error);
    if (i.values[0] === "4") { return await admissionMustKnow(i, user); }
    const category = categories.find(category => category.id.toString() === i.values[0]);
    const stringTitle = `**${category.name.toUpperCase()}**\n\n`;
    if (category.url) {
      const learnMoreButton = new ButtonBuilder().setLabel(string.LEARN_MORE).setStyle(ButtonStyle.Link).setURL(category.url);
      const learnMoreOptions = new ActionRowBuilder().addComponents(learnMoreButton);
      return await i.editReply({ content: `${stringTitle}${category.content}`, components: [learnMoreOptions] });
    } else {
      return await i.editReply({ content: `${stringTitle}${category.content}`, components: [] }).catch(console.error);
    }
  });
}