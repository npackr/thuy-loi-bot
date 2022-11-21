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
  const badScore = await getBadScore(lang, message); console.log(badScore); if (badScore.bad > 0.2) return string.DO_NOT_UNDESTAND;
  const apiURL = `https://simsimi.info/api/`;
  message.replace("Em Gái Thủy Lợi", "sim");
  message.replace("em gái thủy lợi", "sim");
  const data = await got.get(apiURL + "?lc=" + lang + "&text=" + message).json();
  let reply = data.message;
  if (vnstr.hasOffensiveWords(reply)) return string.DO_NOT_UNDESTAND;
  if (data.status == "success") {
    reply.replace("sim", " Em Gái Thủy Lợi ");
    reply.replace("Sim", " Em Gái Thủy Lợi ");
    reply.replace("SIM", " Em Gái Thủy Lợi ");
    reply.replace("simsimi", " Em Gái Thủy Lợi ");
    reply.replace("Simsimi", " Em Gái Thủy Lợi ");
    reply.replace("SIMSIMI", " Em Gái Thủy Lợi ");
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
