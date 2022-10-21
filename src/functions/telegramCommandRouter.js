import { register } from "./telegram_commands/register.js";
import { admission } from "./telegram_commands/admission.js";

export async function telegramCommandRouter(bot, ctx, command) {
  switch (command) {
    case 'admission':
      await admission(bot, ctx); break;
    case 'register':
      await register(bot, ctx); break;
    default:
      ctx.reply('Command not found');
      break;
  }
}