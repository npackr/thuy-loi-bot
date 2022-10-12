import { SlashCommandBuilder } from 'discord.js';

export function createCommandsList() {

  const register = new SlashCommandBuilder().setName('register').setDescription('Tân sinh viên thực hiện Đăng ký nhập học');
  const addmission = new SlashCommandBuilder().setName('addmission').setDescription('Thông tin tuyển sinh đại học năm ' + new Date().getFullYear());
  const commands = [register, addmission].map(command => command.toJSON());
  return commands;
}
