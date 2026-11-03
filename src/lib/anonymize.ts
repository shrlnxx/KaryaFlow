export interface AnonymizeResult {
  text: string;
  maskedCount: number;
  details: {
    telepon: number;
    email: number;
    link: number;
    nomorId: number;
    rekening: number;
  };
}

/**
 * Menyamarkan data pribadi sensitif sebelum dikirim ke AI (PRD B9).
 * Nomor telepon, email, link, NIK (16 digit), rekening (10-16 digit).
 */
export function anonymize(rawText: string): AnonymizeResult {
  let maskedText = rawText;
  const details = {
    telepon: 0,
    email: 0,
    link: 0,
    nomorId: 0,
    rekening: 0,
  };

  // 1. Email pattern
  const emailRegex = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/g;
  maskedText = maskedText.replace(emailRegex, () => {
    details.email++;
    return "[EMAIL]";
  });

  // 2. URL / Link pattern (http, https, www, bit.ly, wa.me)
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|bit\.ly\/[^\s]+|wa\.me\/[^\s]+)/gi;
  maskedText = maskedText.replace(urlRegex, () => {
    details.link++;
    return "[LINK]";
  });

  // 3. Nomor Identitas / NIK KTP (16 digit persis, terkadang dengan spasi/strip)
  const nikRegex = /\b\d{4}[ -]?\d{4}[ -]?\d{4}[ -]?\d{4}\b/g;
  maskedText = maskedText.replace(nikRegex, (match) => {
    const cleanDigits = match.replace(/[\s-]/g, "");
    if (cleanDigits.length === 16) {
      details.nomorId++;
      return "[NOMOR_ID]";
    }
    return match;
  });

  // 4. Nomor Telepon Indonesia (+62 / 62 / 08 dengan 7-12 digit lanjutan)
  // Menangani format: 0812-3456-7890, +62 812 3456 789, 08123456789
  const phoneRegex = /(\+62|62|0)8[0-9\s-]{7,14}\b/g;
  maskedText = maskedText.replace(phoneRegex, (match) => {
    const cleanDigits = match.replace(/[\s-]/g, "");
    if (cleanDigits.length >= 10 && cleanDigits.length <= 15) {
      details.telepon++;
      return "[TELEPON]";
    }
    return match;
  });

  // 5. Nomor Rekening Bank (10 - 16 digit angka berurutan yang bukan nomor telepon)
  const rekeningRegex = /\b(rek|rekening|bca|mandiri|bni|bri)?[:\s]*(\d{3,5}[-\s]?\d{3,5}[-\s]?\d{3,6})\b/gi;
  maskedText = maskedText.replace(rekeningRegex, (fullMatch, prefix, digits) => {
    const cleanDigits = digits.replace(/[\s-]/g, "");
    if (cleanDigits.length >= 10 && cleanDigits.length <= 16 && !cleanDigits.startsWith("08")) {
      details.rekening++;
      return prefix ? `${prefix}: [REKENING]` : "[REKENING]";
    }
    return fullMatch;
  });

  const maskedCount =
    details.telepon + details.email + details.link + details.nomorId + details.rekening;

  return {
    text: maskedText,
    maskedCount,
    details,
  };
}

