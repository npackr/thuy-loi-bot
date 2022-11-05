import vnstr from "vn-str";

export function checkBotInstructionConditions(messageContent) {
  const botInstructionConditions = [ "dùng lệnh", "dụng lệnh", "xài lệnh" ];
  const messageInLowerCase = messageContent.toLowerCase();
  const messageInVnRmTones = vnstr.rmVnTones(messageInLowerCase);
  return botInstructionConditions.some(condition => messageInLowerCase.includes(condition) || messageInVnRmTones.includes(condition));
}