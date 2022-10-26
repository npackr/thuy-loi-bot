import { Keyboard, Key } from 'telegram-keyboard';
import { getCategories } from '../database/queries/common/getCategories.js';
import { getString } from '../languages/stringRouter.js';

export async function admission(bot, ctx, user) {
  const string = getString(user.language);
  const categories = await getCategories(1);
  const buttons = Array();
  const keyboardString = categories.map((category) => category.name);
  const stringBody = string.WHAT_ISSUE_ARE_YOU_INTERESTED_IN;
  await ctx.reply(stringBody, Keyboard.make(keyboardString).reply());
}