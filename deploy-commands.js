// EM GAI THUY LOI Discord Bot by npackr
// 2022 - All rights reserved

import { AttachmentBuilder, Client, GatewayIntentBits, Partials, REST, Routes } from "discord.js";
import { config } from "dotenv"; config();
import { commandsRouter } from "./src/functions/commandsRouter.js";
import { createCommandsList } from "./src/functions/createCommandsList.js";
import { getConfigurations } from "./src/functions/database/queries/common/getConfigurations.js";
import { getString } from "./src/functions/languages/stringRouter.js";
import { checkBotInstructionConditions } from "./src/functions/messages/botInstructionConditions.js";
import { Telegraf } from "telegraf";
import { telegramCommandRouter } from "./src/functions/telegramCommandRouter.js";
import { getCategories } from "./src/functions/database/queries/common/getCategories.js";
import { Keyboard } from "telegram-keyboard";
import { getMustKnowCategories } from "./src/functions/database/queries/common/admission/admission_must_know/getMustKnowCategories.js";
import { getFeed } from "./src/functions/feed/parseFromUrl.js";
import { getCommands } from "./src/functions/database/queries/common/getCommands.js";
import { getConditionReplies } from "./src/functions/database/queries/common/getConditionReplies.js";
import vnstr from "vn-str";
import { toDiscordTimestamp } from "./src/functions/functions/toDiscordTimestamp.js";
import { getSimReply } from "./src/functions/database/queries/common/reply/simsimi.js";

export const cooldownTime = 20000;
const LANGUAGE = "vi_VN";

const discordClient = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent], 'partials': [Partials.Channel, Partials.Message] });
const telegramClient = new Telegraf(process.env.TELEGRAM_TOKEN);
discordClient.login(process.env.DISCORD_TOKEN);
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
const cooldown = new Map();
let user = { language: LANGUAGE };
let string = getString(user.language);
const botName = string.BOT_NAME;
const prefix = string.BOT_BUZZ_WORD;
console.log(`Bot started with: Name: ${string.BOT_NAME}, prefix: ${string.BOT_BUZZ_WORD}`);

rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: createCommandsList() });
discordClient.once('ready', () => { discordClient.user.setActivity(`V${process.env.npm_package_version}`); discordClient.user.setStatus('online'); console.log("Discord Bot logged in successfully and waiting for commands!"); });

let replied = false;

/* DISCORD COMMANDS */
discordClient.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  await interaction.deferReply({ ephemeral: true });
  if (cooldown.has(interaction.user.id)) {
    interaction.editReply({ content: `${string.YOU_ARE_IN_COOLDOWN_PLEASE_WAIT} ${toDiscordTimestamp(new Date(cooldown.get(interaction.user.id) + cooldownTime), "R")}`, ephemeral: true });
    setTimeout(() => { executeDiscordCommand(interaction, user) }, cooldown.get(interaction.user.id) + cooldownTime - Date.now());
    return;
  }
  // REPLYING TO COMMANDS
  cooldown.set(interaction.user.id, Date.now()); setTimeout(() => { cooldown.delete(interaction.user.id) }, cooldownTime);
  executeDiscordCommand(interaction, user);
});

/* DISCORD MESSAGES TRIGGER */
discordClient.on('messageCreate', async message => {
  if (cooldown.has(message.author.id)) { return await message.reply({ content: `${string.DO_NOT_TALK_TO_FAST}`, ephemeral: true });}
  if (message.author.bot) return;
  cooldown.set(message.author.id, Date.now()); setTimeout(() => { cooldown.delete(message.author.id) }, cooldownTime);

  // USER INSTRUCTIONS
  if (message.mentions.has(discordClient.user) || checkBotInstructionConditions(message.content)) {
    const instructionImage = new AttachmentBuilder().setFile('./src/assets/images/discord_instruction.png');
    return await message.reply({ content: `${string.BOT_INSTRUCTION}\n\n${string.YOU_CAN_DIRECTLY_ASKING_FOR}\n\n${string.OR_YOU_CAN_ASK_EVERYTHING_BY}`, files: [instructionImage] });
  }

  // CONDITION REPLY
  const conditionReplies = await getConditionReplies();
  for (const conditionReply of conditionReplies) {
    const messageContent = message.content.toLowerCase();
    const conditionInLowerCase = conditionReply.keyword.toLowerCase();
    const conditionInRmVnTones = vnstr.rmVnTones(conditionInLowerCase);
    if (messageContent.includes(conditionInLowerCase) || messageContent.includes(conditionInRmVnTones)) {
      return await message.reply(conditionReply.reply_details.content);
    };
  }

  // SIM REPLY
  const messageContent = message.content.toLowerCase();
  if (messageContent.startsWith(prefix.toLowerCase()) || messageContent.startsWith(vnstr.rmVnTones(prefix.toLowerCase()))) {
    if (messageContent.length > 99) { return await message.reply(string.MESSAGE_TOO_LONG); }
    if (messageContent.length < 12) { await ctx.reply(string.PLEASE_LET_ME_KNOW_WHAT_YOU_WANT_TO_SAY); return; }
    message.channel.sendTyping();
    const simReply = await getSimReply(user, messageContent.substring(12, 99), botName);
    if (simReply) { return await message.reply(simReply); }
  } else {
    // NORMAL REPLY
    const instructionImage = new AttachmentBuilder().setFile('./src/assets/images/discord_instruction.png');
    return await message.reply({ content: `${string.BOT_INSTRUCTION}\n\n${string.YOU_CAN_DIRECTLY_ASKING_FOR}\n\n${string.OR_YOU_CAN_ASK_EVERYTHING_BY}`, files: [instructionImage] });
  }
});

/* DISCORD COMMAND EXECUTION */
async function executeDiscordCommand(interaction, user) {
  const configurations = await getConfigurations();
  if (interaction.commandName === 'register') {
    const options = { configurations: configurations };
    await commandsRouter("register", interaction, user, options);
  }
  if (interaction.commandName === 'admission') {
    await commandsRouter("admission", interaction, user);
  }
  if (interaction.commandName === 'reply') {
    await commandsRouter("reply", interaction, user);
  }
}

/* TELEGRAM COMMANDS */
const telegramCommands = await getCommands();
telegramCommands.forEach(command => {
  telegramClient.command(command.name, async (ctx) => { await telegramCommandRouter(telegramClient, ctx, user, command.name); replied = true; return; });
});

/* TELEGRAM QUERIES TRIGGER */
telegramClient.on('callback_query', async (ctx) => {
  if (cooldown.has(ctx.from.id)) { return await ctx.reply(`${string.DO_NOT_TALK_TO_FAST}`); }
  cooldown.set(ctx.from.id, Date.now()); setTimeout(() => { cooldown.delete(ctx.from.id) }, cooldownTime);
  const feedCategories = await getMustKnowCategories();
  feedCategories.forEach(async (category) => {
    if (ctx.callbackQuery.data === category.name) {
      const articles = await getFeed(category.url);
      const stringHeader = `${string.ARTICLES_LIST}:\n\n`;
      const stringArticles = articles.items.map((article, index) => `${index + 1}. ${article.title}\n${article.link}\n\n`).join('');
      const stringReadMore = `\n${string.READ_MORE}: ${category.url.substring(0, category.url.length - 4)}`;
      await ctx.reply(stringHeader + stringArticles + stringReadMore); replied = true; return;
    }
  });
});

/* TELEGRAM MESSAGES TRIGGER */
telegramClient.on('text', async (ctx) => {
  if (ctx.message.from.is_bot) return;
  if (cooldown.has(ctx.from.id)) { return await ctx.reply(`${string.DO_NOT_TALK_TO_FAST}`); }
  cooldown.set(ctx.from.id, Date.now()); setTimeout(() => { cooldown.delete(ctx.from.id) }, cooldownTime);
  telegramCommands.forEach(async command => {
    const categories = await getCategories(command.id);
    categories.forEach(async (category) => {
      if (ctx.message.text.includes(category.name)) {
        if (category.id === 4) {
          const feedCategories = await getMustKnowCategories();
          const keyboard = feedCategories.map((c) => c.name);
          await ctx.reply(`${string.SELECT_CATEGORIES}`, Keyboard.make(keyboard).inline());
          replied = true;
          return;
        } else { await ctx.reply(category.content); return; }
      };
    });
  });
  if (replied) return replied = false;

  // CONDITION REPLIES
  const conditionReplies = await getConditionReplies();
  for (let i = 0; i < conditionReplies.length; i++) {
    const conditionReply = conditionReplies[i];
    const messageContent = ctx.message.text.toLowerCase();
    const conditionInLowerCase = conditionReply.keyword.toLowerCase();
    const conditionInRmVnTones = vnstr.rmVnTones(conditionInLowerCase);
    if (messageContent.includes(conditionInLowerCase) || messageContent.includes(conditionInRmVnTones)) {
      await ctx.reply(conditionReply.reply_details.content); replied = true; return;
    };
  };
  if (replied) return replied = false;

  // NORMAL REPLY
  if (ctx.message.chat.type === "supergroup" & !ctx.message.text.toLowerCase().includes(string.TELEGARM_BOT_USERNAME)) return;
  const messageContent = ctx.message.text.includes(string.TELEGARM_BOT_USERNAME) ? ctx.message.text.replace(string.TELEGARM_BOT_USERNAME, "").toLowerCase() : ctx.message.text.toLowerCase();
  /// SIM REPLY
  if (messageContent.trim().startsWith(prefix.toLowerCase()) || messageContent.trim().startsWith(vnstr.rmVnTones(prefix.toLowerCase()))) {
    if (messageContent.length > 99) { await ctx.reply(string.MESSAGE_TOO_LONG); return; }
    if (messageContent.length < 12) { await ctx.reply(string.PLEASE_LET_ME_KNOW_WHAT_YOU_WANT_TO_SAY); return; }
    const simReply = await getSimReply(user, messageContent.substring(12, 99), botName);
    if (simReply) { await ctx.reply(simReply); return; }
    replied = true; return;
  }
  if (replied) return replied = false;

  // INSTRUCTION REPLY
  await ctx.reply(`${string.TELEGRAM_INSTRUCTION}\n\n${string.YOU_CAN_DIRECTLY_ASKING_FOR}\n\n${string.OR_YOU_CAN_ASK_EVERYTHING_BY}`); return;
});

telegramClient.launch().then(() => console.log('Telegram Bot logged in and waiting for commands!'));

// Enable graceful stop
process.once('SIGINT', () => telegramClient.stop('SIGINT'));
process.once('SIGTERM', () => telegramClient.stop('SIGTERM'));