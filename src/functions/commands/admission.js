import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder } from "discord.js";
import { cooldownTime } from "../../../deploy-commands.js";
import { getString } from "../languages/stringRouter.js";
import { schoolInformation } from "./admission/school_information/schoolInformation.js";

export async function admission(interaction, user) {
  const string = getString(user.language);
  const stringHeader = `${string.SCHOOL_LOGO}   **Thông tin tuyển sinh**`;
  const stringSubHeader = `**Trình độ đại học năm ${new Date().getFullYear()}**`;
  const categories = [
    { value: 'school_information', label: 'Thông tin trường', description: 'Phân hiệu trường Đại học Thủy lợi' },
    { value: 'admission_type', label: 'Hình thức xét tuyển', description: 'Kết quả thi THPT Quốc gia - Xét học bạ - Tuyển thẳng' },
    { value: 'admission_industries', label: 'Các ngành đào tạo', description: 'Nhóm ngành Thủy lợi - CNTT - Kế toán và Logistic' },
    { value: 'admission_must_know', label: 'Thông tin cần biết', description: `Những điều cần biết trong mùa tuyển sinh đại học ${new Date().getFullYear()}` },
  ];
  const categoryRow = new ActionRowBuilder().addComponents(
    new SelectMenuBuilder().setCustomId('select_category').setPlaceholder('Danh mục thông tin tuyển sinh').addOptions(categories.map(category => {
      return { label: category.label, value: category.value, description: category.description }
    })));
  await interaction.editReply({ content: `${stringHeader.toUpperCase()}\n${stringSubHeader}`, components: [categoryRow] });

  const filter = i => i.customId === 'select_category' && i.user.id === interaction.user.id;
  const collector = interaction.channel.createMessageComponentCollector({ filter, time: cooldownTime });
  collector.on('collect', async i => {
    await i.update({content: string.LOADING_STRING, components: []}).catch(console.error);

    if (i.values[0] === 'school_information') {
      return await schoolInformation(i, user);
    }

    if (i.values[0] === 'admission_type') {
      return await i.editReply({ content: string.FEATURE_ARE_IN_DEVELOPMENT, components: [] });
    }

    if (i.values[0] === 'admission_industries') {
      return await i.editReply({ content: string.FEATURE_ARE_IN_DEVELOPMENT, components: [] });
    }

    if (i.values[0] === 'admission_must_know') {
      return await i.editReply({ content: string.FEATURE_ARE_IN_DEVELOPMENT, components: [] });
    }
  });
}