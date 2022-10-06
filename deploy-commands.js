// EM GAI THUY LOI Discord Bot by npackr
// 2022 - All rights reserved

import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, GatewayIntentBits, Partials, REST, Routes, SelectMenuBuilder } from "discord.js";
import { config } from "dotenv";
import { createCommandsList } from "./src/functions/createCommandsList.js";
import { getSchoolInformation } from "./src/functions/database/queries/common/admission/school_information/getSchoolInformation.js";
import { getConfigurations } from "./src/functions/database/queries/common/getConfigurations.js";

config();
const client = new Client({ intents: [GatewayIntentBits.Guilds], 'partials': [Partials.Channel] });
client.login(process.env.DISCORD_TOKEN); console.log("Logging in successfully!");
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
const cooldown = new Set();
const cooldownTime = 20000;
const LOADING_STRING = "<a:loading:721911709773594684> Đang xử lý yêu cầu của bạn, vui lòng đợi...";
const ADMIN_ID = "336096287407472641";
const FEATURE_ARE_IN_DEVELOPMENT = "Chức năng này đang được phát triển, vui lòng quay lại sau!";
const SCHOOL_NAME = "Phân hiệu Trường Đại học Thủy lợi";
rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: createCommandsList() }).then(() => console.log('Successfully registered application commands to global!'));
client.once('ready', () => { client.user.setActivity(`V${process.env.npm_package_version}`); client.user.setStatus('online') });
client.on('interactionCreate', async interaction => {
  await interaction.deferUpdate({ ephemeral: true });
  const configurations = await getConfigurations();
  if (!interaction.isCommand()) return;
  if (cooldown.has(interaction.user.id)) return interaction.editReply({ content: 'Bạn đã thực hiện lệnh này trong vòng 5 giây trước đó, vui lòng thử lại sau!', ephemeral: true });
  // REPLYING TO COMMANDS
  cooldown.add(interaction.user.id); setTimeout(() => { cooldown.delete(interaction.user.id) }, cooldownTime);
  if (interaction.commandName === 'register') {
    const allowRegister = configurations.find(setting => setting.name === 'allowRegister').value;
    if (!allowRegister) { return await interaction.editReply({ content: `Hiện đã hết thời gian đăng ký nhập học, vui lòng liên hệ <@${ADMIN_ID}> để được hỗ trợ!`, ephemeral: true }); }
    return await interaction.editReply({ content: `Chúc mừng bạn đã trúng tuyển vào ${SCHOOL_NAME}!` });
  }
  if (interaction.commandName === 'addmission') {
    const stringHeader = `**Thông tin tuyển sinh**`;
    const stringSubHeader = `**Trình độ đại học năm ${new Date().getFullYear()}**`;
    const categories = [
      { value: 'school_information', label: 'Thông tin trường', description: 'Phân hiệu trường Đại học Thủy lợi' },
      { value: 'admission_type', label: 'Hình thức xét tuyển', description: 'Kết quả thi THPT Quốc gia - Xét học bạ - Tuyển thẳng' },
    ];
    const categoryRow = new ActionRowBuilder().addComponents(
      new SelectMenuBuilder().setCustomId('select_category').setPlaceholder('Danh mục thông tin tuyển sinh').addOptions(categories.map(category => {
        return { label: category.label, value: category.value, description: category.description }
      })));
    await interaction.editReply({ content: `${stringHeader.toUpperCase()}\n${stringSubHeader}`, components: [categoryRow] });

    const filter = i => i.customId === 'select_category' && i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: cooldownTime });
    collector.on('collect', async i => {
      await i.update(LOADING_STRING).catch(console.error);

      if (i.values[0] === 'school_information') {
        let school = Object();
        const data = await getSchoolInformation();
        data.forEach(element => { school[element.name] = element.value });
        const stringHeader = `**${school.name}**\n`;
        const base_1_string = `> Cơ sở TP.HCM: ${school.address_1}\n> SDT: ${school.phone_number_1}\n> Email: ${school.email}\n`;
        const base_2_string = `> Cơ sở Bình Dương: ${school.address_2}\n > SDT: ${school.phone_number_2}\n> Email: ${school.email}\n`;
        const stringContent = `${school.description}`;
        const learnMoreRow = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel('Tìm hiểu thêm').setStyle(ButtonStyle.Link).setURL(school.learn_more_url));
        return await i.editReply({ content: `${stringHeader.toUpperCase()}\n${base_1_string}\n${base_2_string}\n${stringContent}`, components: [learnMoreRow] });
      }
      if (i.values[0] === 'admission_type') {
        return await i.editReply({ content: FEATURE_ARE_IN_DEVELOPMENT, components: [] });
      }
    });
  }
});