const PNR_PREFIX = "SKY";
const PNR_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Generates a fake 9-character PNR (e.g. SKY4X7K2M). */
export function generatePnr(): string {
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += PNR_CHARS[Math.floor(Math.random() * PNR_CHARS.length)]!;
  }
  return `${PNR_PREFIX}${suffix}`;
}
