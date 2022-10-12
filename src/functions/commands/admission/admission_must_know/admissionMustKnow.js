import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder } from "discord.js";
import { cooldownTime } from "../../../../../deploy-commands.js";
import { getMustKnowCategories } from "../../../database/queries/common/admission/admission_must_know/getMustKnowCategories.js";
import { getFeed } from "../../../feed/parseFromUrl.js";
import { getString } from "../../../languages/stringRouter.js";

export async function admissionMustKnow(interaction, user) {
  const string = getString(user.language);
  const stringHeader = `${string.SCHOOL_LOGO}\n**${string.ADMISSION_MUST_KNOW.toUpperCase()}**`;
  const categories = await getMustKnowCategories();
  const categoryOptions = categories.map((category) => ({ label: category.name, value: category.id.toString(), description: category.description }));
  const categoryMenu = new SelectMenuBuilder().addOptions(categoryOptions).setCustomId("admission_must_know_category").setPlaceholder(string.SELECT_CATEGORIES);
  const categoryRow = new ActionRowBuilder().addComponents(categoryMenu);
  await interaction.editReply({ content: `${stringHeader}`, components: [categoryRow], ephemeral: true });

  const filter = (i) => i.user.id === interaction.user.id;
  const collector = interaction.channel.createMessageComponentCollector({ filter, time: cooldownTime });
  collector.on("collect", async (i) => {
    if (i.customId === "admission_must_know_category") {
      await i.update({ content: string.LOADING_STRING, components: [], ephemeral: true });
      const category = categories.find((category) => category.id.toString() === i.values[0]);
      const feed = await getFeed(category.url);
      const articles = feed.items.map((article) => ({
        label: article.title.substring(0, 96) + "...",
        value: article.pubDate,
        description: article.contentSnippet.substring(0, 96) + "..."
      }));
      const articleMenu = new SelectMenuBuilder().addOptions(articles).setCustomId("admission_must_know_article").setPlaceholder(string.ARTICLES_LIST);
      const readMoreButton = new ButtonBuilder().setLabel(string.READ_MORE).setStyle(ButtonStyle.Link).setURL(category.url);
      const articleRow = new ActionRowBuilder().addComponents(articleMenu);
      const readMoreRow = new ActionRowBuilder().addComponents(readMoreButton);
      const categoryString = `**${category.name}**`;
      await i.editReply({ content: `${stringHeader}\n${categoryString}`, components: [articleRow, readMoreRow], ephemeral: true });

      const articleCollector = interaction.channel.createMessageComponentCollector({ filter, time: cooldownTime });
      articleCollector.on("collect", async (i) => {
        if (i.customId === "admission_must_know_article") {
          await i.update({ content: string.LOADING_STRING, components: [], ephemeral: true });
          const article = feed.items.find((article) => article.pubDate === i.values[0]);
          const articleString = `**${article.title}**\n\n> ${article.contentSnippet}`;
          const readFullArticleButton = new ButtonBuilder().setLabel(string.READ_FULL).setStyle(ButtonStyle.Link).setURL(article.link);
          const articleRow = new ActionRowBuilder().addComponents(readFullArticleButton);
          await i.editReply({ content: `${stringHeader}\n${categoryString}\n\n${articleString}`, components: [articleRow], ephemeral: true });
        }
      });
    }
  });
}