export function checkAdmissionConditions(messageContent) {
  const admissionConditions = ["tuyển sinh", "tuyen sinh"];
  admissionConditions.forEach(condition => { if (messageContent.includes(condition)) { return true; } });
}