export function checkAdmissionConditions(messageContent) {
  switch (messageContent) {
    case 'đăng ký': return true;
    case 'dang ky': return true;
    case 'nhập học': return true;
    case 'nhap hoc': return true;
    default:
      return false;
  }
}