"use client";

import React, { useRef, useState, useEffect } from "react";
import { UploadCloud, Image as ImageIcon, X, AlertCircle } from "lucide-react";

export interface UploadedImageData {
  base64: string; // pure base64 without data:image/xxx;base64,
  mimeType: string;
  fileName: string;
  fileSize: number;
  previewUrl: string;
}

interface ImageDropzoneProps {
  image: UploadedImageData | null;
  onImageChange: (image: UploadedImageData | null) => void;
  disabled?: boolean;
}

export function ImageDropzone({
  image,
  onImageChange,
  disabled = false,
}: ImageDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Process file into UploadedImageData
  const processFile = (file: File) => {
    setErrorMessage(null);

    // Validate type
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Format file tidak didukung. Harap unggah gambar (PNG, JPG, WEBP).");
      return;
    }

    // Validate size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage("Ukuran gambar terlalu besar (maksimal 8MB).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const [header, base64] = result.split(",");
      const mimeMatch = header.match(/:(.*?);/);
      const mimeType = mimeMatch ? mimeMatch[1] : file.type || "image/png";

      onImageChange({
        base64: base64 || "",
        mimeType,
        fileName: file.name,
        fileSize: file.size,
        previewUrl: result,
      });
    };
    reader.onerror = () => {
      setErrorMessage("Gagal membaca file gambar.");
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Clipboard paste support (Ctrl+V anywhere in active area)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (disabled) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            const pasteFile = new File([blob], `screenshot-wa-${Date.now()}.png`, {
              type: blob.type,
            });
            processFile(pasteFile);
            e.preventDefault();
            break;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, [disabled]);

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
    // reset input so same file can be reselected if deleted
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={handleSelectFile}
        className="hidden"
        disabled={disabled}
      />

      {image ? (
        /* Image Preview Box */
        <div className="relative border border-[#E5E7EB] bg-[#F8F9FB] rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 min-w-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-16 h-16 rounded-md overflow-hidden bg-white border border-[#E5E7EB] shrink-0 flex items-center justify-center">
              <img
                src={image.previewUrl}
                alt="Pratinjau Screenshot WhatsApp"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#171717]">
                <ImageIcon className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                <span className="truncate">{image.fileName}</span>
              </div>
              <p className="text-[11px] font-mono text-[#737373]">
                {formatFileSize(image.fileSize)} &bull; {image.mimeType.replace("image/", "").toUpperCase()}
              </p>
              <span className="inline-block text-[10px] text-[#10B981] font-medium bg-[#ECFDF5] border border-[#A7F3D0] px-1.5 py-0.2 rounded">
                Siap Dianalisis AI
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="px-2.5 py-1.5 text-xs text-[#525252] hover:text-[#171717] bg-white hover:bg-[#F1F3F5] border border-[#E5E7EB] rounded-md transition-colors cursor-pointer disabled:opacity-50"
            >
              Ganti Gambar
            </button>
            <button
              type="button"
              onClick={() => onImageChange(null)}
              disabled={disabled}
              className="p-1.5 text-[#737373] hover:text-[#EF4444] bg-white hover:bg-[#FEF2F2] border border-[#E5E7EB] hover:border-[#FCA5A5] rounded-md transition-colors cursor-pointer disabled:opacity-50"
              title="Hapus gambar"
              aria-label="Hapus gambar screenshot"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Empty Dropzone State */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer transition-all min-w-0 ${
            isDragOver
              ? "border-[#2563EB] bg-[#EFF6FF]"
              : "border-[#D1D5DB] hover:border-[#171717] bg-[#F8F9FB] hover:bg-white"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <div className="w-12 h-12 mx-auto rounded-full bg-white border border-[#E5E7EB] text-[#2563EB] flex items-center justify-center mb-3 shadow-xs">
            <UploadCloud className="w-6 h-6" />
          </div>

          <p className="text-xs font-semibold text-[#171717]">
            Tarik & Lepas screenshot chat WhatsApp ke sini
          </p>
          <p className="text-[11px] text-[#737373] mt-1">
            atau <span className="text-[#2563EB] underline font-medium">klik untuk memilih file</span> dari perangkat Anda
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 text-[10px] text-[#737373] font-mono bg-white border border-[#E5E7EB] px-2.5 py-1 rounded-md">
            <span>Bisa langsung tekan <kbd className="font-semibold text-[#171717]">Ctrl + V</kbd> untuk tempel tangkapan layar</span>
          </div>

          <p className="text-[10px] text-[#9CA3AF] mt-2">
            Mendukung file PNG, JPG, JPEG, atau WEBP hingga 8MB
          </p>
        </div>
      )}

      {errorMessage && (
        <div className="text-xs text-[#DC2626] bg-[#FEF2F2] border border-[#FECDD3] p-2.5 rounded-lg flex items-center gap-2 font-medium animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}

