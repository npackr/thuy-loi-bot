import { SlashCommandBuilder } from 'discord.js';

export function createCommandsList() {

  const register = new SlashCommandBuilder().setName('register').setDescription('Tân sinh viên thực hiện Đăng ký nhập học');
  const addmission = new SlashCommandBuilder().setName('admission').setDescription('Thông tin tuyển sinh đại học năm ' + new Date().getFullYear());
  const reply = new SlashCommandBuilder().setName('reply').setDescription('Điền khiển câu trả lời tự động');
  reply.addSubcommand(subcommand => subcommand.setName('add').setDescription('Thêm câu trả lời tự động')
    .addStringOption(option => option.setName('answer').setDescription('Câu trả lời').setRequired(true))
    .addStringOption(option => option.setName('1st_keyword').setDescription('Từ khóa 1').setRequired(true))
    .addStringOption(option => option.setName('2nd_keyword').setDescription('Từ khóa 2'))
    .addStringOption(option => option.setName('3rd_keyword').setDescription('Từ khóa 3'))
    .addStringOption(option => option.setName('name').setDescription('Tên gợi nhớ'))
  );
  reply.addSubcommand(subcommand => subcommand.setName('remove').setDescription('Xóa câu trả lời tự động')
    .addStringOption(option => option.setName('keyword').setDescription('Từ khóa').setRequired(true))
  );
  const commands = [register, addmission, reply].map(command => command.toJSON());
  return commands;
}
