import de from "./locales/de";
import en from "./locales/en";
import es from "./locales/es";
import fr from "./locales/fr";
import id from "./locales/id";
import ja from "./locales/ja";
import pt from "./locales/pt";
import ru from "./locales/ru";
import { SupportedLanguage, TranslationSchema } from "./types";

export * from "./types";

export const DEFAULT_LANGUAGE: SupportedLanguage = "en";

export const SUPPORTED_LANGUAGES: Record<
  SupportedLanguage,
  { name: string; nativeName: string; flag: string; aliases: string[] }
> = {
  en: {
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
    aliases: ["en", "eng", "english"]
  },
  id: {
    name: "Indonesian",
    nativeName: "Bahasa Indonesia",
    flag: "🇮🇩",
    aliases: ["id", "ind", "indo", "indonesia", "indonesian"]
  },
  es: {
    name: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
    aliases: ["es", "esp", "spanish", "espanol"]
  },
  ja: {
    name: "Japanese",
    nativeName: "日本語",
    flag: "🇯🇵",
    aliases: ["ja", "jp", "jpn", "japanese", "nihongo"]
  },
  pt: {
    name: "Portuguese",
    nativeName: "Português",
    flag: "🇧🇷",
    aliases: ["pt", "por", "portuguese", "portugues", "brasil", "brazil"]
  },
  ru: {
    name: "Russian",
    nativeName: "Русский",
    flag: "🇷🇺",
    aliases: ["ru", "rus", "russian", "russkiy"]
  },
  fr: {
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷",
    aliases: ["fr", "fra", "fre", "french", "francais"]
  },
  de: {
    name: "German",
    nativeName: "Deutsch",
    flag: "🇩🇪",
    aliases: ["de", "deu", "ger", "german", "deutsch"]
  }
};

const dictionaries: Record<SupportedLanguage, TranslationSchema> = {
  en,
  id,
  es,
  ja,
  pt,
  ru,
  fr,
  de
};

/**
 * Mencocokkan input pengguna (kode / nama bahasa) ke SupportedLanguage
 */
export function resolveLanguage(input: string): SupportedLanguage | null {
  if (!input) return null;
  const clean = input.trim().toLowerCase();

  for (const [code, meta] of Object.entries(SUPPORTED_LANGUAGES)) {
    if (code === clean || meta.aliases.includes(clean)) {
      return code as SupportedLanguage;
    }
  }

  return null;
}

/**
 * Mengambil string terjemahan berdasarkan bahasa dan key path (contoh: 'play.starting_playback')
 * dengan fallback otomatis ke bahasa Inggris jika key tidak ditemukan.
 */
export function t(
  lang: string | SupportedLanguage | undefined,
  path: string,
  params?: Record<string, string | number>
): string {
  const targetLang: SupportedLanguage =
    lang && lang in dictionaries ? (lang as SupportedLanguage) : DEFAULT_LANGUAGE;

  const getNestedValue = (obj: any, keyPath: string): string | undefined => {
    return keyPath.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  let template = getNestedValue(dictionaries[targetLang], path);

  // Fallback ke bahasa Inggris (Default) jika tidak ada
  if (!template && targetLang !== DEFAULT_LANGUAGE) {
    template = getNestedValue(dictionaries[DEFAULT_LANGUAGE], path);
  }

  if (!template) {
    return path; // Jika tetap tidak ada, kembalikan key path
  }

  // Interpolasi parameter: {title}, {artist}, dll.
  if (params) {
    for (const [key, val] of Object.entries(params)) {
      template = template.replace(new RegExp(`\\{${key}\\}`, "g"), String(val));
    }
  }

  return template;
}

/**
 * Mengambil metadata bahasa (Bendera, Nama, Native Name)
 */
export function getLanguageMeta(lang: string | SupportedLanguage | undefined) {
  const targetLang = (lang && lang in SUPPORTED_LANGUAGES ? lang : DEFAULT_LANGUAGE) as SupportedLanguage;
  return SUPPORTED_LANGUAGES[targetLang];
}

/**
 * Format daftar seluruh bahasa yang tersedia untuk pesan embed
 */
export function getAvailableLanguagesList(): string {
  return Object.entries(SUPPORTED_LANGUAGES)
    .map(([code, meta]) => `• ${meta.flag} **${meta.name}** (\`${code}\` / *${meta.nativeName}*)`)
    .join("\n");
}
