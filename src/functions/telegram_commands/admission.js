import Keyboard from 'telegram-keyboard';

export async function admission(bot, ctx) {
  const categories = ['Thông tin trường', 'Hình thức xét tuyển', 'Các ngành đào tạo', 'Thông tin cần biết'];
  await ctx.reply('admission', Keyboard.Keyboard.make(categories).reply());
}