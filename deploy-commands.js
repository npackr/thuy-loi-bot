// EM GAI THUY LOI Discord Bot by npackr
// 2022 - All rights reserved

import { AttachmentBuilder, Client, GatewayIntentBits, Partials, REST, Routes } from "discord.js";
import { config } from "dotenv";
import { commandsRouter } from "./src/functions/commandsRouter.js";
import { createCommandsList } from "./src/functions/createCommandsList.js";
import { getConfigurations } from "./src/functions/database/queries/common/getConfigurations.js";
import { getString } from "./src/functions/languages/stringRouter.js";
import { checkBotInstructionConditions } from "./src/functions/messages/botInstructionConditions.js";
import { checkAdmissionConditions } from "./src/functions/messages/admissionConditions.js";
import { checkRegisterCondition } from "./src/functions/messages/registerConditions.js";
import { checkIndustriesConditions } from "./src/functions/messages/industriesConditions.js";
import { Telegraf } from "telegraf";
import { telegramCommandRouter } from "./src/functions/telegramCommandRouter.js";
import { getCategories } from "./src/functions/database/queries/common/getCategories.js";
import { Keyboard } from "telegram-keyboard";
import { getMustKnowCategories } from "./src/functions/database/queries/common/admission/admission_must_know/getMustKnowCategories.js";
import { getFeed } from "./src/functions/feed/parseFromUrl.js";
import { getCommands } from "./src/functions/database/queries/common/getCommands.js";

config();
export const cooldownTime = 30000;
const LANGUAGE = "vi_VN";

const discordClient = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent], 'partials': [Partials.Channel, Partials.Message] });
const telegramClient = new Telegraf(process.env.TELEGRAM_TOKEN);
discordClient.login(process.env.DISCORD_TOKEN);
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
const cooldown = new Set();
let user = { language: LANGUAGE };
let string = getString(user.language);
rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: createCommandsList() });
discordClient.once('ready', () => { discordClient.user.setActivity(`V${process.env.npm_package_version}`); discordClient.user.setStatus('online'); console.log("Discord Bot logged in successfully and waiting for commands!"); });
discordClient.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  await interaction.deferReply({ ephemeral: true });
  const configurations = await getConfigurations();
  if (cooldown.has(interaction.user.id)) return interaction.editReply({
    content: `${string.YOU_ARE_IN_COOLDOWN_PLEASE_WAIT} ${cooldownTime / 1000} ${string.SECONDS}`, ephemeral: true
  });
  // REPLYING TO COMMANDS
  cooldown.add(interaction.user.id); setTimeout(() => { cooldown.delete(interaction.user.id) }, cooldownTime);
  await interaction.editReply({ content: string.LOADING_STRING, ephemeral: true });
  if (interaction.commandName === 'register') {
    const options = { configurations: configurations };
    await commandsRouter("register", interaction, user, options);
  }
  if (interaction.commandName === 'addmission') {
    await commandsRouter("admission", interaction, user);
  }
});

discordClient.on('messageCreate', async message => {
  if (message.author.bot) return;
  if (message.mentions.has(discordClient.user) || checkBotInstructionConditions(message.content)) {
    const instructionImage = new AttachmentBuilder().setFile('./src/assets/images/find_out_em_gai_thuy_loi.jpg');
    await message.reply({ content: `${string.BOT_INSTRUCTION}`, files: [instructionImage] });
  }
  if (checkAdmissionConditions(message.content) || message.content.includes('tuyển sinh') || message.content.includes('tuyen sinh')) {
    return await message.reply({ content: `${string.ADMISSION_INSTRUCTION}` });
  }
  if (checkRegisterCondition(message.content) || message.content.includes("đăng ký") || message.content.includes("dang ky") || message.content.includes("nhập học") || message.content.includes("nhap hoc")) {
    return await message.reply({ content: `${string.REGISTER_INSTRUCTION}` });
  }
  if (checkIndustriesConditions(message.content) || message.content.includes("nganh") || message.content.includes("ngành")) {
    return await message.reply({ content: `${string.INDUSTRIES_INSTRUCTION}` });
  }
});

const telegramCommands = await getCommands();
telegramCommands.forEach(command => {
  telegramClient.command(command.name, async (ctx) => {
    await telegramCommandRouter(telegramClient, ctx, user, command.name);
  });
});

telegramClient.on('text', async (ctx) => {
  telegramCommands.forEach(async command => {
    const categories = await getCategories(command.id);
    categories.forEach(async (category) => {
      if (ctx.message.text.includes(category.name)) {
        if (category.id === 4) {
          const feedCategories = await getMustKnowCategories();
          const keyboard = feedCategories.map((c) => c.name);
          await ctx.reply(`${string.SELECT_CATEGORIES}`, Keyboard.make(keyboard).inline());
        } else { await ctx.reply(category.content); return; }
      };
    });
  });
  if (checkAdmissionConditions(ctx.message.text) || ctx.message.text === 'tuyển sinh' || ctx.message.text === 'tuyen sinh') {
    await ctx.reply(string.ADMISSION_INSTRUCTION); return;
  }
  if (checkRegisterCondition(ctx.message.text) || ctx.message.text === 'đăng ký' || ctx.message.text === 'dang ky' || ctx.message.text === 'nhập học' || ctx.message.text === 'nhap hoc') {
    await ctx.reply(string.REGISTER_INSTRUCTION); return;
  }
  if (checkIndustriesConditions(ctx.message.text) || ctx.message.text === 'nganh' || ctx.message.text === 'ngành') {
    await ctx.reply(string.INDUSTRIES_INSTRUCTION); return;
  }
});

telegramClient.on('callback_query', async (ctx) => {
  const feedCategories = await getMustKnowCategories();
  feedCategories.forEach(async (category) => {
    if (ctx.callbackQuery.data === category.name) {
      const articles = await getFeed(category.url);
      const stringHeader = `${string.ARTICLES_LIST}:\n\n`;
      const stringArticles = articles.items.map((article, index) => `${index + 1}. ${article.title}\n${article.link}\n\n`).join('');
      const stringReadMore = `\n${string.READ_MORE}: ${category.url.substring(0, category.url.length - 4)}`;
      await ctx.reply(stringHeader + stringArticles + stringReadMore);
    }
  });
});

telegramClient.launch().then(() => console.log('Telegram Bot logged in and waiting for commands!'));

// Enable graceful stop
process.once('SIGINT', () => telegramClient.stop('SIGINT'));
process.once('SIGTERM', () => telegramClient.stop('SIGTERM'));