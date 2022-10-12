export function checkIndustriesConditions(messageContent) {
  switch (messageContent) {
    case 'ngành': return true;
    case 'nganh': return true;
    case 'ngành học': return true;
    case 'nganh hoc': return true;
    case 'ngành đào tạo': return true;
    case 'nganh dao tao': return true;
    case 'ngành đào tạo năm': return true;
    case 'nganh dao tao nam': return true;
    case 'ngành đào tạo năm 2021': return true;
    case 'nganh dao tao nam 2021': return true;
    case 'ngành đào tạo năm 2022': return true;
    case 'nganh dao tao nam 2022': return true;
    case 'ngành đào tạo năm 2023': return true;
    case 'nganh dao tao nam 2023': return true;
    case 'ngành đào tạo năm 2024': return true;
    case 'nganh dao tao nam 2024': return true;
    case 'ngành đào tạo năm 2025': return true;
    case 'nganh dao tao nam 2025': return true;
    default:
      return false;
  }
}