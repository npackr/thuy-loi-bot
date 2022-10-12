// EM GAI THUY LOI Discord Bot by npackr
// 2022 - All rights reserved

import { AttachmentBuilder, Client, GatewayIntentBits, Partials, REST, Routes } from "discord.js";
import { config } from "dotenv";
import { commandsRouter } from "./src/functions/commandsRouter.js";
import { createCommandsList } from "./src/functions/createCommandsList.js";
import { getConfigurations } from "./src/functions/database/queries/common/getConfigurations.js";
import { getString } from "./src/functions/languages/stringRouter.js";

config();
export const cooldownTime = 30000;
const LANGUAGE = "vi_VN";

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent], 'partials': [Partials.Channel, Partials.Message] });
client.login(process.env.DISCORD_TOKEN);
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
const cooldown = new Set();
let user = { language: LANGUAGE };
let string = getString(user.language);
rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: createCommandsList() });
client.once('ready', () => { client.user.setActivity(`V${process.env.npm_package_version}`); client.user.setStatus('online') });
console.log("Logging in successfully and waiting for commands!");
client.on('interactionCreate', async interaction => {
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

client.on('messageCreate', async message => {
  if (message.author.bot) return;
  if (message.mentions.has(client.user)) {
    const instructionImage = new AttachmentBuilder().setFile('./src/assets/images/find_out_em_gai_thuy_loi.jpg');
    await message.reply({ content: `${string.BOT_INSTRUCTION}`, files: [instructionImage] });
  }
  const admissionCondition = (message.content.includes('đăng ký')) || (message.content.includes('dang ky')) || (message.content.includes('nhập học')) || (message.content.includes('nhap hoc'));
  const registerCondition = (message.content.includes('tuyển sinh')) || (message.content.includes('tuyen sinh') || (message.content.includes('xet hoc ba') || (message.content.includes('xét học bạ')) || (message.content.includes('nguyện vọng')) || (message.content.includes('nguyen vong'))));
  
  if (registerCondition) {
    return await message.reply({ content: `${string.ADMISSION_INSTRUCTION}`});
  }
  if (admissionCondition) {
    return await message.reply({ content: `${string.REGISTER_INSTRUCTION}`});
  }
});