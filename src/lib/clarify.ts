import { ClarificationQuestion } from "@/types";

/**
 * Menyusun template pesan klarifikasi WhatsApp dari daftar pertanyaan (PRD B11 / T11).
 * Dibuat kode murni tanpa panggilan API.
 */
export function buildClarificationMessage(
  questions: ClarificationQuestion[],
  clientName?: string,
  businessName?: string
): string {
  const greeting = clientName ? `Halo Kak ${clientName}` : "Halo Kak";
  const senderSign = businessName ? `\n\nSalam hangat,\nTim ${businessName}` : "";

  // Urutkan prioritas: tinggi -> sedang -> rendah
  const sorted = [...questions].sort((a, b) => {
    const priorityWeight = { tinggi: 3, sedang: 2, rendah: 1 };
    return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
  });

  const selectedQuestions = sorted.filter((q) => q.checked !== false);

  if (selectedQuestions.length === 0) {
    return `${greeting}! Terima kasih atas brief yang dikirimkan. Seluruh poin kebutuhan proyek sudah kami catat dengan lengkap.${senderSign}`;
  }

  const questionList = selectedQuestions
    .map((q, idx) => {
      const priorityBadge = q.priority === "tinggi" ? " [Penting]" : "";
      return `${idx + 1}. ${q.question}${priorityBadge}`;
    })
    .join("\n\n");

  return `${greeting}! Terima kasih banyak atas brief proyek yang dikirimkan 🙏

Agar penawaran dan ruang lingkup pekerjaan yang kami siapkan benar-benar presisi, kami izin mengonfirmasi beberapa poin singkat berikut ya Kak:

${questionList}

Setelah poin di atas terkonfirmasi, kami akan segera terbitkan lembar penawaran resmi. Terima kasih banyak atas kerjasamanya! 🙏${senderSign}`;
}

