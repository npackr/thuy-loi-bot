import got from 'got';
import { config } from 'dotenv';
import vnstr from "vn-str";
import { getString } from '../../../../languages/stringRouter.js';
config();
const preferAPI = "premium"; // premium or free
const badWords = [
  "Mẹ", "Cmm", "Đm", "Ra", "Bj", "Cần Sa", "Xxx", "Mông", "Cắn", "Cha",
  "Chó", "Đụ", "Đéo", "Địt", "Bú", "Nút", "Bắn", "Phịch", "Lồn", "Cặc",
  "Má", "Bố",
];

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
  if (userMessage.length == 0) return string.PLEASE_LET_ME_KNOW_WHAT_YOU_WANT_TO_SAY;
  if (vnstr.hasOffensiveWords(message)) return string.DO_NOT_UNDESTAND;
  const badScore = await getBadScore(lang, message); console.log(badScore); if (badScore.bad > 0.2) return string.PLEASE_WATCH_YOUR_LANGUAGE;
  const includeBadWords = badWords.some(word => message.includes(word) || message.includes(word.toUpperCase()) || message.includes(word.toLowerCase())); if (includeBadWords) return string.PLEASE_WATCH_YOUR_LANGUAGE;
  message = message.replaceAll(string.BOT_NAME, "sim"); message = message.replaceAll(string.BOT_NAME.toLowerCase(), "sim");

  if (preferAPI == "free") {
    const data = await getFreeSimReply(lang, message); let reply = data.response;
    if (data.status == "success") { reply = replaceAllSimWithBotName(reply, string.BOT_NAME); reply = removeBadWords(reply);  return reply; }
    else if (data.status == "false - 1" || data.status == "false - 2" || data.status == "false - 3") { return string.DO_NOT_UNDESTAND; }
    else return string.SOMETHING_WHEN_WRONG;
  }
  if (preferAPI == "premium") {
    const data = await getSimSmallTalkReply(lang, message);
    let reply = data.message;
    if (data.status == "success") { reply = replaceAllSimWithBotName(reply, string.BOT_NAME); reply = removeBadWords(reply); return reply; }
    else if (data.status == "fail") { return string.DO_NOT_UNDESTAND; }
    else return string.SOMETHING_WHEN_WRONG;
  }
}

async function getBadScore(lang, message) {
  const apiURL = `https://wsapi.simsimi.com/190410/classify/bad`;
  const data = await got.post(apiURL, {
    headers: { "x-api-key": process.env.SIMSIMI_BAD_SCORE_API_KEY, },
    json: { sentence: message, lang: lang, type: "DPD" }
  }).json();
  return data;
}

async function getFreeSimReply(lang, question) {
  const apiURL = `https://simsimi.info/api/`;
  const data = await got.get(apiURL + "?lc=" + lang + "&text=" + question).json();
  console.log(data);
  return data;
}


async function getSimSmallTalkReply(lang, question) {
  const data = { status: "not_run", message: "" };
  const apiURL = `https://wsapi.simsimi.com/190410/talk`;
  const response = await got.post(apiURL, {
    headers: { "x-api-key": process.env.SIMSIMI_SMALL_TALK_API_KEY, },
    json: { utext: question, lang: lang, country: ["VN"], atext_bad_prob_max: "0", qtext_bad_prob_max: "0", talkset_bad_prob_max: "0" }
  }).json();
  console.log(response);
  if (response.status == "200") { data.status = "success"; data.message = response.atext; return data; }
  if (response.status == "228") { data.status = "fail"; return data; }
}

function removeBadWords(string) {
  let message = string;
  badWords.forEach(word => {
    if (message.includes(word)) message = message.replaceAll(word, "");
    if (message.includes(word.toUpperCase())) message = message.replaceAll(word.toUpperCase(), "");
    if (message.includes(word.toLowerCase())) message = message.replaceAll(word.toLowerCase(), "");
  });
  message = message.replaceAll(" m ", " b "); message.replaceAll(" t ", " m ");
  message = message.replaceAll(" T ", " M "); message.replaceAll(" M ", " B ");
  message = message.replaceAll("mày", "bạn"); message.replaceAll("Mày", "Bạn");
  message = message.replaceAll("tao", "mình"); message.replaceAll("Tao", "Mình");
  return message;
}

function replaceAllSimWithBotName(message, botName) {
  message = message.replaceAll("sim", botName);
  message = message.replaceAll("Sim", botName);
  message = message.replaceAll("SIM", botName);
  message = message.replaceAll("simsimi", botName);
  message = message.replaceAll("Simsimi", botName);
  message = message.replaceAll("SIMSIMI", botName);
  return message;
}