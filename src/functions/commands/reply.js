import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder } from "discord.js";
import { cooldownTime } from "../../../deploy-commands.js";
import { deleteCondition } from "../database/mutation/deleteCondition.js";
import { deleteReply } from "../database/mutation/deleteReply.js";
import { getConditions } from "../database/queries/common/reply/getConditions.js";
import { getReply } from "../database/queries/common/reply/getReply.js";
import { createKeywordReply } from "../functions/createKeywordReply.js";
import { getString } from "../languages/stringRouter.js";

export async function reply(interaction, user) {
  const string = getString(user.language);
  const userRole = interaction.member.roles.cache.find(role => role.id === "1024585623614537759" );
  if (!userRole) { return await interaction.editReply({ content: `${string.ERROR_ICON}   ${string.YOU_ARE_NOT_A_MODERATOR}`, ephemeral: true }); }
  // Add reply
  if (interaction.options.getSubcommand() === 'add') {
    const answer = interaction.options.getString('answer');
    const keyword1 = interaction.options.getString('1st_keyword');
    const keyword2 = interaction.options.getString('2nd_keyword');
    const keyword3 = interaction.options.getString('3rd_keyword');
    const name = interaction.options.getString('name');
    if (answer.length > 2000) { return await interaction.editReply({ content: `${string.ERROR_ICON}   ${string.TOO_LONG_STRING}`, ephemeral: true }); }
    const keywords = [keyword1, keyword2, keyword3].filter(keyword => keyword !== null);
    const result = await createKeywordReply({ answer: answer, keywords: keywords, name: name });
    if (!result) { return await interaction.editReply(`${string.ERROR_ICON}   ${string.SOMETHING_WHEN_WRONG} ${string.WHEN_CREATE_KEYWORD_REPLY.toLocaleLowerCase()}`); }

    // Created successfully
    const stringTitle = `${string.SUCCESSFUL_ICON}\n**${string.ADD_REPLY_SUCCESSFULLY}**`;
    const stringContent = `- ${string.KEYWORD}: ${keywords.join(" , ")}\n\n` +
      `- ${string.ANSWER}:\n` +
      `> ${answer}`;
    if (name) {
      const stringName = `\n- ${string.NAME}: ${name}`;
      await interaction.editReply({ content: `${stringTitle}\n${stringName}\n\n${stringContent}`, ephemeral: true });
    } else {
      return await interaction.editReply({ content: `${stringTitle}\n\n${stringContent}`, ephemeral: true });
    }
  }

  // Remove reply
  if (interaction.options.getSubcommand() === 'remove') {
    const keyword = interaction.options.getString('keyword');
    const reply = await getReply(keyword, 10);
    if (reply.length == 0) { return await interaction.editReply(`${string.ERROR_ICON}   ${string.REPLY_NOT_FOUND}`); }
    if (reply.length === 1) {
      await goDelete(user, interaction, reply[0].reply_details);
    } else {
      const options = reply.map(reply => { return { label: reply.keyword, value: reply.reply_details.id.toString(), description: reply.reply_details.content.substring(0, 63) } });
      const selectMenu = new ActionRowBuilder().addComponents(new SelectMenuBuilder().setCustomId('remove_reply').setPlaceholder(string.REPLY_LIST).addOptions(options))
      await interaction.editReply({ content: `${string.SELECT_REPLY_TO_REMOVE}`, components: [selectMenu] });

      const filter = i => i.customId === 'remove_reply' && i.user.id === interaction.user.id;
      const collector = interaction.channel.createMessageComponentCollector({ filter, time: cooldownTime });
      collector.on('collect', async i => {
        await i.update({ content: `${string.LOADING_STRING}`, components: [] });
        const replyId = parseInt(i.values[0]);
        const selectedReply = reply.find(r => r.reply_details.id === replyId);
        await goDelete(user, i, { id: replyId, content: selectedReply.reply_details.content });
      });
    }
  }
}

async function goDelete(user, interaction, reply) {
  const string = getString(user.language);
  const conditions = await getConditions(reply.id);
  const stringInfo = `${string.ARE_YOU_SURE_TO_REMOVE_THIS_KEYWORD_OR_THE_REPLY}?`;
  const stringContent = `${reply.content}`;
  const confirmButton = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('confirm_delete_keyword').setLabel(string.REMOVE_KEYWORD).setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId('cancel_delete_keyword').setLabel(string.REMOVE_REPLY).setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('cancel').setLabel(`${string.AUTO_CANCEL_IN} ${cooldownTime / 1000}s`).setStyle(ButtonStyle.Secondary).setDisabled(true)
  );
  await interaction.editReply({ content: `${stringInfo}\n\n${stringContent}`, components: [confirmButton], ephemeral: true });

  const filter = i => i.customId === 'confirm_delete_keyword' || i.customId === 'cancel_delete_keyword';
  const collector = interaction.channel.createMessageComponentCollector({ filter, time: cooldownTime });
  collector.on('collect', async i => {
    if (i.customId === 'confirm_delete_keyword') {
      await i.update({ content: `${string.LOADING_STRING}`, components: [], ephemeral: true });
      await deleteCondition(conditions[0].id);
      if (conditions.length === 1) { await deleteReply(reply.id); }
      await i.editReply({ content: `${string.SUCCESSFUL_ICON}   ${string.KEYWORD_HAS_BEEN_REMOVED}`, components: [], ephemeral: true });
    }
    if (i.customId === 'cancel_delete_keyword') {
      await i.update({ content: `${string.LOADING_STRING}`, components: [], ephemeral: true });
      if (conditions.length > 1) {
        conditions.forEach(async condition => { await deleteCondition(condition.id); });
      } else {
        await deleteCondition(conditions[0].id);
      }
      await deleteReply(reply.id);
      await i.editReply({ content: `${string.SUCCESSFUL_ICON}   ${string.REPLY_HAS_BEEN_REMOVED}`, components: [], ephemeral: true });
    }
  });
}