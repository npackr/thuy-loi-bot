export function toDiscordTimestamp(date, mode) {
  switch (mode) {
    case "R":
      return `<t:${Math.floor(date.getTime() / 1000)}:R>`; // Relative time
    case "F":
      return `<t:${Math.floor(date.getTime() / 1000)}:F>`; // Full date
    case "T":
      return `<t:${Math.floor(date.getTime() / 1000)}:T>`; // hh:mm:ss
    case "D":
      return `<t:${Math.floor(date.getTime() / 1000)}:D>`; // Short date
    case "d":
      return `<t:${Math.floor(date.getTime() / 1000)}:d>`; // Long date
    case "f":
      return `<t:${Math.floor(date.getTime() / 1000)}:f>`; // yyyy/mm/dd hh:mm
    case "t":
      return `<t:${Math.floor(date.getTime() / 1000)}:t>`; // hh:mm
    default:
      return `<t:${Math.floor(date.getTime() / 1000)}>`;
  }
}