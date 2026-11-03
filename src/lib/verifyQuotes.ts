import { XRayMark } from "@/types";

/**
 * Normalisasi teks untuk pencocokan toleran (PRD B7 aturan 2).
 * Lowercase, hapus tanda baca di ujung, samakan spasi ganda.
 */
export function normalizeText(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'’“”]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Memeriksa apakah kutipan AI benar-benar ada di dalam teks percakapan asli.
 */
export function isQuoteInChat(quote: string, fullChatText: string): boolean {
  if (!quote || !fullChatText) return false;
  const normQuote = normalizeText(quote);
  const normChat = normalizeText(fullChatText);
  if (!normQuote) return false;
  return normChat.includes(normQuote);
}

export interface VerifiedQuotesResult {
  verifiedMarks: XRayMark[];
  unverifiedMarks: XRayMark[];
}

/**
 * Memverifikasi daftar XRayMark terhadap teks chat yang dianonimkan.
 */
export function verifyQuotes(
  marks: XRayMark[],
  fullChatText: string
): VerifiedQuotesResult {
  const verifiedMarks: XRayMark[] = [];
  const unverifiedMarks: XRayMark[] = [];

  for (const mark of marks) {
    const verified = isQuoteInChat(mark.quote, fullChatText);
    const updatedMark: XRayMark = {
      ...mark,
      verified,
    };

    if (verified) {
      verifiedMarks.push(updatedMark);
    } else {
      unverifiedMarks.push(updatedMark);
    }
  }

  return {
    verifiedMarks,
    unverifiedMarks,
  };
}

