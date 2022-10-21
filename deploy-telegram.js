import { Telegraf } from 'telegraf';
import { config } from 'dotenv';
import { checkAdmissionConditions } from './src/functions/messages/admissionConditions.js';
import { getString } from './src/functions/languages/stringRouter.js';
import { checkRegisterCondition } from './src/functions/messages/registerConditions.js';
import { checkIndustriesConditions } from './src/functions/messages/industriesConditions.js';
import { telegramCommandRouter } from './src/functions/telegramCommandRouter.js';
config();

export const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
const user = { language: 'vi_VN' };
const string = getString(user.language);

bot.command('admission', async (ctx) => {
  await telegramCommandRouter(bot, ctx, 'admission');
});

bot.command('register', async (ctx) => {
  await telegramCommandRouter(bot, ctx, 'register');
});

bot.on('text', async (ctx) => {
  if (checkAdmissionConditions(ctx.message.text) || ctx.message.text === 'tuyển sinh' || ctx.message.text === 'tuyen sinh') {
    await ctx.reply(string.ADMISSION_INSTRUCTION); return;
  }
  if (checkRegisterCondition(ctx.message.text) || ctx.message.text === 'đăng ký' || ctx.message.text === 'dang ky' || ctx.message.text === 'nhập học' || ctx.message.text === 'nhap hoc') {
    await ctx.reply(string.REGISTER_INSTRUCTION); return;
  }
  if (checkIndustriesConditions(ctx.message.text) || ctx.message.text === 'nganh' || ctx.message.text === 'ngành') {
    await ctx.reply(string.INDUSTRIES_INSTRUCTION); return;
  }
  // Explicit usage
  await ctx.reply(`${string.WELCOME_TO} ${string.SCHOOL_NAME}!`);
  await ctx.reply(string.BOT_INSTRUCTION);
});

bot.launch().then(() => console.log('Telegram Bot logged in and waiting for commands!'));

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));