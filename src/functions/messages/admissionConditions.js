export function checkAdmissionConditions(messageContent) {
  switch (messageContent) {
    case 'tuyển sinh': return true;
    case 'tuyen sinh': return true;
    case 'xet hoc ba': return true;
    case 'xét học bạ': return true;
    case 'nguyen vong': return true;
    case 'nguyện vọng': return true;
    case 'xet tuyen': return true;
    case 'xét tuyển': return true;
    case 'tsinh': return true;
    case 'tuyensinh': return true;
    case 'Tuyen sinh': return true;
    case 'Tuyển sinh': return true;
    default:
      return false;
  }
}