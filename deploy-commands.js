// EM GAI THUY LOI Discord Bot by npackr
// 2022 - All rights reserved

import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, GatewayIntentBits, Partials, REST, Routes, SelectMenuBuilder } from "discord.js";
import { config } from "dotenv";
import { commandsRouter } from "./src/functions/commandsRouter.js";
import { createCommandsList } from "./src/functions/createCommandsList.js";
import { getSchoolInformation } from "./src/functions/database/queries/common/admission/school_information/getSchoolInformation.js";
import { getConfigurations } from "./src/functions/database/queries/common/getConfigurations.js";
import { getString } from "./src/functions/languages/stringRouter.js";

config();
const ADMIN_ID = "336096287407472641";
const LANGUAGE = "vi_VN";
export const cooldownTime = 20000;

const client = new Client({ intents: [GatewayIntentBits.Guilds], 'partials': [Partials.Channel] });
client.login(process.env.DISCORD_TOKEN); console.log("Logging in successfully!");
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
const cooldown = new Set();
let user = Object(); user.language = LANGUAGE;
let string = getString(user.language);
rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: createCommandsList() }).then(() => console.log('Successfully registered application commands to global!'));
client.once('ready', () => { client.user.setActivity(`V${process.env.npm_package_version}`); client.user.setStatus('online') });
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  await interaction.deferReply({ ephemeral: true });
  if (cooldown.has(interaction.user.id)) return interaction.editReply({ content: 'Bạn đã thực hiện lệnh này trong vòng 5 giây trước đó, vui lòng thử lại sau!', ephemeral: true });
  // REPLYING TO COMMANDS
  cooldown.add(interaction.user.id); setTimeout(() => { cooldown.delete(interaction.user.id) }, cooldownTime);
  await interaction.editReply({ content: string.LOADING_STRING, ephemeral: true });
  if (interaction.commandName === 'register') {
    const configurations = await getConfigurations();
    const allowRegister = configurations.find(setting => setting.name === 'allowRegister').value;
    if (!allowRegister) { return await interaction.editReply({ content: `Hiện đã hết thời gian đăng ký nhập học, vui lòng liên hệ <@${ADMIN_ID}> để được hỗ trợ!`, ephemeral: true }); }
    return await interaction.editReply({ content: `Chúc mừng bạn đã trúng tuyển vào ${string.SCHOOL_NAME}!` });
  }
  if (interaction.commandName === 'addmission') {
    await commandsRouter("admission", interaction, user);
  }
});