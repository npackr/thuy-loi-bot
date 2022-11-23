import got from 'got';
import { config } from 'dotenv';
import vnstr from "vn-str";
import { getString } from '../../../../languages/stringRouter.js';
config();

export async function getSimReply(userLanguage, userMessage) {
  const string = getString(userLanguage);
  let message = userMessage;
  let lang = "vn";
  switch (userLanguage) {
    case "en_US": lang = "en"; break;
    case "vi_VN": lang = "vn"; break;
    case "zh_CN": lang = "ch"; break;
    default: lang = "vn"; break;
  }
  if (vnstr.hasOffensiveWords(message)) return string.DO_NOT_UNDESTAND;
  const badScore = await getBadScore(lang, message); console.log(badScore); if (badScore.bad > 0.3) return string.DO_NOT_UNDESTAND;
  const apiURL = `https://simsimi.info/api/`;
  message = message.replace("Em Gái Thủy Lợi", "sim");
  message = message.replace("em gái thủy lợi", "sim");
  const data = await got.get(apiURL + "?lc=" + lang + "&text=" + message).json();
  let reply = data.message;
  if (vnstr.hasOffensiveWords(reply)) return `${string.CAN_NOT_REPLY_YOUR_QUESTION}, ${string.HELP_YOU_TO_SEARCH_ON_GOOGLE}:\nhttps://www.google.com/search?q=${message}`;
  if (data.status == "success") {
    reply = reply.replace("sim", " Em Gái Thủy Lợi ");
    reply = reply.replace("Sim", " Em Gái Thủy Lợi ");
    reply = reply.replace("SIM", " Em Gái Thủy Lợi ");
    reply = reply.replace("simsimi", " Em Gái Thủy Lợi ");
    reply = reply.replace("Simsimi", " Em Gái Thủy Lợi ");
    reply = reply.replace("SIMSIMI", " Em Gái Thủy Lợi ");
    reply = removeBadWords(reply);
    return reply;
  }
  else if (data.status == "false - 1" || data.status == "false - 2" || data.status == "false - 3") { return string.DO_NOT_UNDESTAND; }
  else return string.SOMETHING_WHEN_WRONG;
}

async function getBadScore(lang, message) {
  const apiURL = `https://wsapi.simsimi.com/190410/classify/bad`;
  const data = await got.post(apiURL, {
    headers: { "x-api-key": "~OOtdkW9rNHLqnFJpmBWThQjEWR85tdmx-Da4Nuc", },
    json: { sentence: message, lang: lang, type: "DPD" }
  }).json();
  return data;
}

function removeBadWords(string) {
  let message = string;
  const badWords = ["Mẹ", "Cmm", "Đm", "Ra", "Bj", "Cần Sa"];
  badWords.forEach(word => {
    if (message.includes(word)) message = message.replace(word, "");
    if (message.includes(word.toUpperCase())) message = message.replace(word.toUpperCase(), "");
    if (message.includes(word.toLowerCase())) message = message.replace(word.toLowerCase(), "");
  });
  message = message.replace(" m ", " b "); message.replace(" t ", " m ");
  message = message.replace(" T ", " M "); message.replace(" M ", " B ");
  message = message.replace("mày", "bạn"); message.replace("Mày", "Bạn");
  message = message.replace("tao", "mình"); message.replace("Tao", "Mình");
  return message;
}
