import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { getString } from "../languages/stringRouter.js";

export async function register(interaction, user, options) {
  const string = getString(user.language);
  const configurations = options.configurations;
  const allowRegister = configurations.find(setting => setting.name === 'allowRegister').value;
  if (!allowRegister) { return await interaction.editReply({ content: `Hiện đã hết thời gian đăng ký nhập học, vui lòng liên hệ <@${string.ADMIN_ID}> để được hỗ trợ!`, ephemeral: true }); }

  const addmissButton = new ButtonBuilder().setLabel('Đăng ký nhập học').setStyle(ButtonStyle.Link).setURL('https://nhaphoc.tlu.edu.vn/');
  const addmissionOptions = new ActionRowBuilder().addComponents(addmissButton);
  return await interaction.editReply({ content: `Chào mừng Tân sinh viên K64 của ${string.SCHOOL_NAME}!`, components: [addmissionOptions], ephemeral: true });
}