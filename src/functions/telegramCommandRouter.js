import { register } from "./telegram_commands/register.js";
import { admission } from "./telegram_commands/admission.js";

export async function telegramCommandRouter(bot, ctx, user, command) {
  switch (command) {
    case 'admission':
      await admission(bot, ctx, user); break;
    case 'register':
      await register(bot, ctx, user); break;
    default:
      ctx.reply('Command not found'); 
      break;
  }
}