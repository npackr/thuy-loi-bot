import { ActionRowBuilder, SelectMenuBuilder } from "discord.js";
import { cooldownTime } from "../../../deploy-commands.js";
import { getString } from "../languages/stringRouter.js";
import { admissionIndustries } from "./admission/admission_industries/admission_industries.js";
import { admissionMustKnow } from "./admission/admission_must_know/admissionMustKnow.js";
import { admissionType } from "./admission/admission_type/admission_type.js";
import { schoolInformation } from "./admission/school_information/schoolInformation.js";

export async function admission(interaction, user) {
  const string = getString(user.language);
  const stringHeader = `${string.SCHOOL_LOGO}\n**${string.ADMISSION_INFOMATION}**`;
  const stringSubHeader = `**${string.UNIVERSITY_DEGREE} ${new Date().getFullYear()}**`;
  const categories = [
    { value: 'school_information', label: 'Thông tin trường', description: 'Phân hiệu trường Đại học Thủy lợi' },
    { value: 'admission_type', label: 'Hình thức xét tuyển', description: 'Kết quả thi THPT Quốc gia - Xét học bạ - Tuyển thẳng' },
    { value: 'admission_industries', label: 'Các ngành đào tạo', description: 'Nhóm ngành Thủy lợi, KTXD - CNTT - Kế toán và Logistic' },
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
    await i.update({ content: string.LOADING_STRING, components: [] }).catch(console.error);

    if (i.values[0] === 'school_information') { return await schoolInformation(i, user); }
    if (i.values[0] === 'admission_type') { return await admissionType(i, user); }
    if (i.values[0] === 'admission_industries') { return await admissionIndustries(i, user); }
    if (i.values[0] === 'admission_must_know') { return await admissionMustKnow(i, user); }
  });
}