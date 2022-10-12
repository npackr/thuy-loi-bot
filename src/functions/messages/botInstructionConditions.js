export function checkBotInstructionConditions(messageContent) {
  switch (messageContent) {
    case 'dung lenh': return true;
    case 'dùng lệnh': return true;
    case 'dụng lệnh': return true;
  default:
    return false;
  }
}