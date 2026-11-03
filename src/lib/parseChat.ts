import { ChatMessage } from "@/types";
import { APP_CONFIG } from "@/config";

export interface ParsedChatResult {
  messages: ChatMessage[];
  uniqueSenders: string[];
  rawMessageCount: number;
  isTruncated: boolean;
  warningMessage?: string;
}

/**
 * Mem-parse chat WhatsApp ke dalam daftar pesan terstruktur (PRD B9).
 */
export function parseChat(
  rawText: string,
  mySenderName?: string
): ParsedChatResult {
  if (!rawText || !rawText.trim()) {
    return {
      messages: [],
      uniqueSenders: [],
      rawMessageCount: 0,
      isTruncated: false,
    };
  }

  // Regex WhatsApp:
  // Format 1 (Bracket): [31/10/26 14.05.22] Nama: pesan atau [10/31/26, 2:05:00 PM] Nama: pesan
  // Format 2 (Dash): 31/10/2026, 14.05 - Nama: pesan atau 10/31/26, 2:05 PM - Nama: pesan
  const headerRegex = /^(?:\[(\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4}[,\s]+\d{1,2}[:.]\d{2}(?:[:.]\d{2})?(?:\s?[APMapm]{2})?)\]\s*([^:]+):\s*(.*)|(\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4}[,\s]+\d{1,2}[:.]\d{2}(?:[:.]\d{2})?(?:\s?[APMapm]{2})?)\s*-\s*([^:]+):\s*(.*))$/;

  // Filter baris sistem WhatsApp
  const isSystemNotice = (text: string): boolean => {
    const lower = text.toLowerCase();
    return (
      lower.includes("pesan dan panggilan dienkripsi") ||
      lower.includes("end-to-end") ||
      lower.includes("<media tidak disertakan>") ||
      lower.includes("<media omitted>") ||
      lower.includes("mengubah setelan pesan") ||
      lower.includes("menambahkan") ||
      lower.includes("bergabung") ||
      lower.includes("keluar")
    );
  };

  const lines = rawText.split(/\r?\n/);
  interface TempMsg {
    senderName: string;
    text: string;
  }

  const rawMessages: TempMsg[] = [];
  let currentMsg: TempMsg | null = null;
  const sendersSet = new Set<string>();

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const match = trimmed.match(headerRegex);
    if (match) {
      const sender = (match[2] || match[5] || "").trim();
      const content = (match[3] || match[6] || "").trim();

      if (isSystemNotice(content)) {
        continue;
      }

      if (sender) {
        sendersSet.add(sender);
      }

      if (currentMsg) {
        rawMessages.push(currentMsg);
      }

      currentMsg = {
        senderName: sender,
        text: content,
      };
    } else {
      // Baris lanjutan atau format tanpa timestamp (fallback)
      if (currentMsg) {
        currentMsg.text += "\n" + trimmed;
      } else {
        // Fallback: paragraf tanpa format waktu WA
        if (!isSystemNotice(trimmed)) {
          rawMessages.push({
            senderName: "tidak_diketahui",
            text: trimmed,
          });
        }
      }
    }
  }

  if (currentMsg) {
    rawMessages.push(currentMsg);
  }

  const uniqueSenders = Array.from(sendersSet);

  // Batasi sesuai PRD B9: maks 120 pesan dan 12.000 karakter
  const maxMessages = APP_CONFIG.maxMessages;
  const maxCharacters = APP_CONFIG.maxCharacters;

  let totalChars = 0;
  let isTruncated = false;
  const finalMessages: ChatMessage[] = [];

  for (let i = 0; i < rawMessages.length; i++) {
    if (finalMessages.length >= maxMessages) {
      isTruncated = true;
      break;
    }

    const item = rawMessages[i];
    if (totalChars + item.text.length > maxCharacters) {
      // Potong pesan terakhir jika melebihi batas karakter
      const remainingChars = Math.max(0, maxCharacters - totalChars);
      if (remainingChars > 50) {
        item.text = item.text.slice(0, remainingChars) + "... [DIPOTONG]";
        finalMessages.push({
          index: i + 1,
          sender: mapSender(item.senderName, mySenderName),
          text: item.text,
        });
      }
      isTruncated = true;
      break;
    }

    totalChars += item.text.length;
    finalMessages.push({
      index: i + 1,
      sender: mapSender(item.senderName, mySenderName),
      text: item.text,
    });
  }

  let warningMessage: string | undefined = undefined;
  if (isTruncated) {
    warningMessage = `Chat terlalu panjang, dipotong ke ${finalMessages.length} pesan terpenting (${totalChars.toLocaleString()} karakter) untuk menjaga kestabilan analisis.`;
  }

  return {
    messages: finalMessages,
    uniqueSenders,
    rawMessageCount: rawMessages.length,
    isTruncated,
    warningMessage,
  };
}

function mapSender(
  senderName: string,
  mySenderName?: string
): "klien" | "saya" | "tidak_diketahui" {
  if (senderName === "tidak_diketahui" || !senderName) {
    return "tidak_diketahui";
  }
  if (mySenderName && senderName.toLowerCase() === mySenderName.toLowerCase()) {
    return "saya";
  }
  return "klien";
}

