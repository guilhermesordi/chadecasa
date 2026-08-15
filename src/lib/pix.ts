function emv(id: string, value: string) {
  return `${id}${String(value.length).padStart(2, "0")}${value}`;
}

function crc16(payload: string) {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i += 1) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function pixText(value: string, max: number) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase()
    .slice(0, max);
}

export function normalizePixKey(raw: string) {
  const key = raw.trim();
  if (!key) return "";
  if (key.includes("@")) return key.toLowerCase();
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(key)) {
    return key.toLowerCase();
  }
  const digits = key.replace(/\D/g, "");
  if (digits.length === 11 || digits.length === 14) return digits;
  if (digits.length >= 12 && digits.length <= 13 && digits.startsWith("55")) {
    return `+${digits}`;
  }
  return key.replace(/\s/g, "");
}

export function buildPixCopiaECola({
  key,
  name,
  city,
  amountCents,
}: {
  key: string;
  name: string;
  city: string;
  amountCents: number;
}) {
  const pixKey = normalizePixKey(key);
  if (!pixKey || amountCents <= 0) return "";

  const merchantName = pixText(name, 25) || "CHA DE CASA";
  const merchantCity = pixText(city, 15) || "SAO PAULO";
  const amount = (amountCents / 100).toFixed(2);
  const merchantAccount = emv(
    "26",
    emv("00", "br.gov.bcb.pix") + emv("01", pixKey),
  );

  const body =
    emv("00", "01") +
    merchantAccount +
    emv("52", "0000") +
    emv("53", "986") +
    emv("54", amount) +
    emv("58", "BR") +
    emv("59", merchantName) +
    emv("60", merchantCity) +
    emv("62", emv("05", "***")) +
    "6304";

  return body + crc16(body);
}
