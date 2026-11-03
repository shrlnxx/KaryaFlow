"use client";

import React from "react";
import {
  Printer,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  Clock,
  CheckCircle2,
  FileCheck2,
  Building2,
  User,
  MessageCircle,
} from "lucide-react";
import { QuotationCalculationResult } from "../lib/calculator";

export interface A4ProposalProps {
  brandName: string;
  brandSector: string;
  brandPersona: string;
  clientName: string;
  documentNumber: string;
  validityDays: number;
  durationText: string;
  quotation: QuotationCalculationResult;
  exclusions: string[];
  revisiPolicy: {
    revisiMayor: number;
    microChange: number;
    garansiHari: number;
  };
}

export function A4Proposal({
  brandName,
  brandSector,
  brandPersona,
  clientName,
  documentNumber,
  validityDays,
  durationText,
  quotation,
  exclusions,
  revisiPolicy,
}: A4ProposalProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Action Bar (Hidden on print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-100 p-3 rounded-lg border border-zinc-200 no-print">
        <div>
          <div className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
            <FileCheck2 className="w-4 h-4 text-zinc-800" />
            <span>Pratinjau Proposal A4 Siap Cetak / Simpan PDF</span>
          </div>
          <p className="text-[11px] text-zinc-600 mt-0.5">
            Format lembaran resmi A4 dengan 10 komponen scope profesional. Siap simpan ke PDF.
          </p>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center justify-center gap-1.5 h-8 px-4 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 rounded transition-colors shadow-xs cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Printer className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Cetak / Simpan PDF</span>
        </button>
      </div>

      {/* KERTAS PRATINJAU A4 (Clean White Sheet with Crisp 1px Border) */}
      <div className="bg-zinc-200/80 p-2 sm:p-6 rounded-lg border border-zinc-300 overflow-x-auto flex justify-center w-full max-w-full min-w-0">
        <article
          id="a4-proposal-sheet"
          className="bg-white text-zinc-900 border border-zinc-300 shadow-md w-full max-w-[800px] min-h-[1130px] p-4 sm:p-8 md:p-12 space-y-6 text-xs leading-relaxed font-sans min-w-0"
        >
          {/* KOMPONEN 1: KOP USAHA & NOMOR DOKUMEN */}
          <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-zinc-900 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-zinc-900 text-white flex items-center justify-center font-bold text-sm">
                  {brandName.charAt(0)}
                </div>
                <div>
                  <h1 className="text-lg font-bold tracking-tight text-zinc-900 leading-tight">
                    {brandName}
                  </h1>
                  <p className="text-[11px] text-zinc-500 font-medium">
                    {brandSector}
                  </p>
                </div>
              </div>
              <p className="text-[10px] text-zinc-500 mt-2 font-mono">
                Penanggung Jawab: {brandPersona}
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400">
                Surat Penawaran Layanan (Proposal)
              </div>
              <div className="font-mono text-xs font-bold text-zinc-900">
                No: {documentNumber}
              </div>
              <div className="text-[11px] text-zinc-600 flex items-center sm:justify-end gap-1.5">
                <Calendar className="w-3 h-3 text-zinc-400" />
                <span>Tanggal: 2 November 2026</span>
              </div>
              <div className="text-[11px] text-amber-800 font-medium">
                Masa Berlaku: {validityDays} Hari Kalender
              </div>
            </div>
          </header>

          {/* KOMPONEN 2 & 3: IDENTITAS KLIEN & EXECUTIVE SUMMARY */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-50 rounded border border-zinc-200 p-3.5 space-y-1.5">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500">
                Ditujukan Kepada Klien:
              </span>
              <div className="font-bold text-sm text-zinc-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-zinc-600" />
                <span>{clientName}</span>
              </div>
              <p className="text-[11px] text-zinc-600 leading-normal">
                Dokumen spesifikasi ruang lingkup kerja terukur, batasan revisi, dan rincian alokasi biaya resmi untuk proyek yang diajukan.
              </p>
            </div>

            <div className="bg-zinc-50 rounded border border-zinc-200 p-3.5 space-y-1.5">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500">
                Ringkasan Eksekutif (Format WhatsApp):
              </span>
              <p className="text-[11px] text-zinc-700 leading-relaxed font-mono bg-white p-2 rounded border border-zinc-200">
                "Penawaran resmi {brandName} untuk {clientName}: mencakup deliverable terukur dengan proteksi garansi {revisiPolicy.garansiHari} hari dan revisi terkendali."
              </p>
            </div>
          </section>

          {/* KOMPONEN 4: KOTAK RINGKASAN NILAI KONTRAK & SKEMA TERMIN */}
          <section className="bg-zinc-900 text-zinc-100 rounded-lg p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                Kotak Ringkasan Nilai Investasi Proyek
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                Kalkulasi Kode Deterministik
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="space-y-0.5 border-r border-zinc-800 last:border-none pr-2">
                <span className="text-[10px] text-zinc-400 block">Total Nilai Kontrak</span>
                <span className="font-mono text-base sm:text-lg font-bold text-white tabular-nums">
                  {quotation.subtotalDisplay}
                </span>
              </div>
              <div className="space-y-0.5 border-r border-zinc-800 last:border-none pr-2">
                <span className="text-[10px] text-zinc-400 block">DP Awal (50%)</span>
                <span className="font-mono text-base sm:text-lg font-bold text-zinc-200 tabular-nums">
                  {quotation.dpAmountDisplay}
                </span>
              </div>
              <div className="space-y-0.5 border-r border-zinc-800 last:border-none pr-2">
                <span className="text-[10px] text-zinc-400 block">Pelunasan (50%)</span>
                <span className="font-mono text-base sm:text-lg font-bold text-zinc-200 tabular-nums">
                  {quotation.finalAmountDisplay}
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-zinc-400 block">Estimasi Linimasa</span>
                <span className="font-mono text-xs sm:text-sm font-semibold text-zinc-300">
                  {durationText}
                </span>
              </div>
            </div>

            {quotation.hasUnconfirmedItems && (
              <div className="text-[11px] text-amber-300 bg-amber-950/50 p-2 rounded border border-amber-800 text-center font-medium">
                * Terdapat {quotation.unconfirmedCount} item yang status tarifnya masih perlu disepakati bersama via WhatsApp.
              </div>
            )}
          </section>

          {/* KOMPONEN 5 & 7: TABEL HARGA PER SKU & RUANG LINGKUP TERUKUR */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                Rincian Layanan & Ruang Lingkup Terukur (Per SKU)
              </h2>
              <span className="text-[10px] font-mono text-zinc-500">
                {quotation.items.length} Item Deliverable
              </span>
            </div>

            <div className="border border-zinc-300 rounded overflow-x-auto w-full max-w-full min-w-0">
              <table className="w-full text-left text-xs min-w-[500px]">
                <thead className="bg-zinc-100 border-b border-zinc-300 text-zinc-700 text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-2 px-3 font-semibold w-24">Kode SKU</th>
                    <th className="py-2 px-3 font-semibold">Nama Layanan & Spesifikasi</th>
                    <th className="py-2 px-3 font-semibold text-center w-16">Qty</th>
                    <th className="py-2 px-3 font-semibold text-right w-28">Tarif Satuan</th>
                    <th className="py-2 px-3 font-semibold text-right w-28">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {quotation.items.map((line, idx) => (
                    <tr key={idx} className="hover:bg-zinc-50/60">
                      <td className="py-2.5 px-3 font-mono font-medium text-zinc-700 text-[11px]">
                        {line.sku}
                      </td>
                      <td className="py-2.5 px-3 space-y-0.5">
                        <div className="font-semibold text-zinc-900">{line.name}</div>
                        {line.notes && (
                          <div className="text-[11px] text-zinc-500 leading-tight">
                            {line.notes}
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-medium tabular-nums">
                        {line.quantity}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums text-zinc-700">
                        {line.unitPriceDisplay}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold tabular-nums text-zinc-900">
                        {line.lineTotalDisplay}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-zinc-50 border-t-2 border-zinc-300 font-bold text-zinc-900">
                  <tr>
                    <td colSpan={4} className="py-2.5 px-3 text-right text-xs uppercase tracking-wider">
                      Total Nilai Kontrak (Confirmed):
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-sm tabular-nums text-zinc-900">
                      {quotation.subtotalDisplay}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>

          {/* KOMPONEN 6: DAFTAR TEGAS "TIDAK TERMASUK (EXCLUDES)" */}
          <section className="bg-rose-50/70 border border-rose-200 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-xs uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-rose-700" />
              <span>Daftar Tegas Tidak Termasuk (Scope Exclusions):</span>
            </div>
            <p className="text-[11px] text-rose-800 leading-normal">
              Untuk mencegah salah paham, layanan di bawah ini dinyatakan di luar kesepakatan dasar dan membutuhkan add-on berbayar jika diminta:
            </p>
            <ul className="list-disc list-inside text-xs text-rose-950 space-y-1 pl-1">
              {exclusions.map((ex, i) => (
                <li key={i} className="font-medium">
                  {ex}
                </li>
              ))}
            </ul>
          </section>

          {/* KOMPONEN 8 & 9: SKEMA TERMIN & KEBIJAKAN BATAS REVISI */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Skema Termin */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3.5 space-y-2">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500">
                Skema Pembayaran Termin
              </span>
              <div className="space-y-1.5 text-xs text-zinc-800">
                <div className="flex justify-between items-center border-b border-zinc-200 pb-1">
                  <span>Termin 1 (DP 50% Mulai Kerja):</span>
                  <span className="font-mono font-bold">{quotation.dpAmountDisplay}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Termin 2 (Pelunasan Serah Terima):</span>
                  <span className="font-mono font-bold">{quotation.finalAmountDisplay}</span>
                </div>
              </div>
              <p className="text-[10px] text-zinc-500 italic">
                Pengerjaan dimulai efektif setelah konfirmasi transfer bukti DP diterima.
              </p>
            </div>

            {/* Kebijakan Revisi & Garansi */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 text-zinc-900 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-zinc-800" />
                <span>Kebijakan Revisi & Masa Garansi</span>
              </div>
              <ul className="text-xs text-zinc-700 space-y-1 list-disc list-inside">
                <li>
                  Maksimal <strong>{revisiPolicy.revisiMayor}x putaran revisi mayor</strong> (alur & layout).
                </li>
                <li>
                  Termasuk <strong>{revisiPolicy.microChange}x micro-change</strong> (teks minor / warna).
                </li>
                <li>
                  Garansi bebas error / cacat fungsi selama <strong>{revisiPolicy.garansiHari} hari</strong> kalender.
                </li>
              </ul>
            </div>
          </section>

          {/* KOMPONEN 10: AJAKAN TINDAKAN & TANDA TANGAN / FOOTER LEMBAR */}
          <footer className="border-t-2 border-zinc-300 pt-4 space-y-4">
            <div className="bg-zinc-100 rounded-lg p-3 text-center space-y-1 border border-zinc-200">
              <div className="text-xs font-bold text-zinc-900 flex items-center justify-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Cara Persetujuan Dokumen:</span>
              </div>
              <p className="text-xs text-zinc-700">
                Ketik dan kirim pesan <strong className="bg-white px-2 py-0.5 rounded border border-zinc-300 font-mono text-zinc-900">"SETUJU"</strong> melalui kontak WhatsApp resmi kami untuk mengunci jadwal produksi.
              </p>
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 pt-2 border-t border-zinc-100">
              <div>KaryaFlow Scope Guard Protection &bull; Ekraf AI Solution</div>
              <div>Halaman 1 dari 1</div>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}

