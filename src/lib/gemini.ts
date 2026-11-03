import { APP_CONFIG } from "@/config";
import { AnalysisResult, CatalogItem, ProposedItem, ScopeGuardResult } from "@/types";
import { ANALYZE_SYSTEM_PROMPT, buildAnalyzePrompt } from "@/prompts/analyze";
import { SCOPE_GUARD_SYSTEM_PROMPT, buildScopeGuardPrompt } from "@/prompts/scopeGuard";
import { validateAnalysisResult, validateScopeGuardResult } from "./validate";

export interface ApiCallState {
  isLoading: boolean;
  error?: string;
  isQuotaExceeded?: boolean;
}

// Skema JSON untuk respons analisis
const ANALYSIS_JSON_SCHEMA = {
  type: "object",
  properties: {
    summary: { type: "string" },
    marks: {
      type: "array",
      items: {
        type: "object",
        properties: {
          quote: { type: "string" },
          messageIndex: { type: "integer" },
          level: { type: "string", enum: ["merah", "kuning", "hijau"] },
          reason: { type: "string" },
        },
        required: ["quote", "level", "reason"],
      },
    },
    requirements: {
      type: "array",
      items: {
        type: "object",
        properties: {
          text: { type: "string" },
          sourceQuote: { type: "string" },
        },
        required: ["text", "sourceQuote"],
      },
    },
    questions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          why: { type: "string" },
          priority: { type: "string", enum: ["tinggi", "sedang", "rendah"] },
        },
        required: ["question", "priority"],
      },
    },
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          catalogItemId: { type: "string" },
          label: { type: "string" },
          quantity: { type: "number" },
          deliverable: { type: "string" },
          sourceQuote: { type: "string" },
          notes: { type: "string" },
        },
        required: ["label", "deliverable"],
      },
    },
    exclusions: {
      type: "array",
      items: { type: "string" },
    },
    assumptions: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: ["summary", "marks", "questions", "items"],
};

/**
 * Panggilan Gemini API dengan backoff retry dan penanganan kuota (PRD B10).
 * Mendukung format API Key lama (AIza...) maupun format baru Auth Key (AQ...).
 */
export async function callGemini(
  systemPrompt: string,
  userPrompt: string,
  responseSchema?: any,
  apiKey?: string
): Promise<string> {
  const key = apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
  if (!key) {
    throw new Error("API_KEY_MISSING");
  }

  const model = APP_CONFIG.geminiModel;

  // Cek apakah menggunakan format token baru dari Google AI Studio (AQ...)
  const isNewAuthKey = key.startsWith("AQ.");

  // Tentukan URL: Jika AQ... URL bersih, jika AIza... tambahkan ?key=
  const url = isNewAuthKey
    ? `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
    : `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

  // Siapkan headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Auth Key baru (AQ...) wajib dikirim lewat Header Authorization
  if (isNewAuthKey) {
    headers["Authorization"] = `Bearer ${key}`;
  }

  const bodyPayload: any = {
    contents: [
      {
        role: "user",
        parts: [{ text: userPrompt }],
      },
    ],
    systemInstruction: {
      parts: [{ text: systemPrompt }],
    },
    generationConfig: {
      temperature: 0.2, // Suhu rendah PRD B5
      responseMimeType: "application/json",
    },
  };

  if (responseSchema) {
    bodyPayload.generationConfig.responseSchema = responseSchema;
  }

  // Retry logic: coba ulang maks 2 kali dengan jeda 2 dan 5 detik (PRD B10)
  const delays = [2000, 5000];
  let lastError: any = null;

  for (let attempt = 0; attempt <= delays.length; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), APP_CONFIG.requestTimeoutMs);

      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(bodyPayload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 429 || response.status === 503) {
        if (attempt < delays.length) {
          await new Promise((r) => setTimeout(r, delays[attempt]));
          continue;
        }
        throw new Error("QUOTA_EXCEEDED");
      }

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API_ERROR_${response.status}: ${errText}`);
      }

      const data = await response.json();
      const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textOutput) {
        throw new Error("EMPTY_RESPONSE");
      }

      return textOutput;
    } catch (err: any) {
      lastError = err;
      if (err.message === "QUOTA_EXCEEDED") {
        throw err;
      }
      if (attempt < delays.length) {
        await new Promise((r) => setTimeout(r, delays[attempt]));
      }
    }
  }

  throw lastError || new Error("REQUEST_FAILED");
}

/**
 * Panggilan Gemini untuk Analisis Brief (Panggilan 1).
 */
export async function analyzeBriefWithGemini(
  serviceMode: string,
  catalog: CatalogItem[],
  anonymizedChat: string,
  apiKey?: string
): Promise<AnalysisResult> {
  const userPrompt = buildAnalyzePrompt(serviceMode, catalog, anonymizedChat);
  const rawJson = await callGemini(
    ANALYZE_SYSTEM_PROMPT,
    userPrompt,
    ANALYSIS_JSON_SCHEMA,
    apiKey
  );

  const parsed = JSON.parse(rawJson);
  return validateAnalysisResult(parsed, catalog);
}

/**
 * Panggilan Gemini untuk Scope Guard (Panggilan 2).
 */
export async function checkScopeGuardWithGemini(
  approvedItems: ProposedItem[],
  exclusions: string[],
  catalog: CatalogItem[],
  anonymizedRequest: string,
  apiKey?: string
): Promise<ScopeGuardResult> {
  const userPrompt = buildScopeGuardPrompt(
    approvedItems,
    exclusions,
    catalog,
    anonymizedRequest
  );

  const rawJson = await callGemini(
    SCOPE_GUARD_SYSTEM_PROMPT,
    userPrompt,
    undefined,
    apiKey
  );

  const parsed = JSON.parse(rawJson);
  const validIds = approvedItems.map((i) => i.catalogItemId || "").filter(Boolean);
  return validateScopeGuardResult(parsed, validIds);
}