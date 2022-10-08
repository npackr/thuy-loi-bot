import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { getSchoolInformation } from "../../../database/queries/common/admission/school_information/getSchoolInformation.js";

export async function schoolInformation(interaction, user) {
  let school = Object();
  const data = await getSchoolInformation();
  data.forEach(element => { school[element.name] = element.value });
  const stringHeader = `**${school.name}**\n`;
  const base_1_string = `> Cơ sở TP.HCM: ${school.address_1}\n> SDT: ${school.phone_number_1}\n> Email: ${school.email}\n`;
  const base_2_string = `> Cơ sở Bình Dương: ${school.address_2}\n > SDT: ${school.phone_number_2}\n> Email: ${school.email}\n`;
  const stringContent = `${school.description}`;
  const learnMoreRow = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel('Tìm hiểu thêm').setStyle(ButtonStyle.Link).setURL(school.learn_more_url));
  return await interaction.editReply({ content: `${stringHeader.toUpperCase()}\n${base_1_string}\n${base_2_string}\n${stringContent}`, components: [learnMoreRow] });
}