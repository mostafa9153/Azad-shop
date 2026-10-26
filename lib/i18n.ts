import bnMessages from "@/messages/bn.json";
import enMessages from "@/messages/en.json";

export type Locale = "bn" | "en";
export const defaultLocale: Locale = "bn";
export const locales: Locale[] = ["bn", "en"];

const messages: Record<Locale, any> = {
  bn: bnMessages,
  en: enMessages,
};

export function getMessages(locale: Locale) {
  return messages[locale] || messages.bn;
}

export function getNestedValue(obj: any, path: string): string {
  const parts = path.split(".");
  let current = obj;
  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = current[part];
    } else {
      return path;
    }
  }
  return typeof current === "string" ? current : path;
}

export function translate(locale: Locale, key: string, params?: Record<string, string | number>): string {
  const dict = getMessages(locale);
  let text = getNestedValue(dict, key);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(new RegExp(`{${k}}`, "g"), String(v));
    });
  }
  return text;
}

const bnDigits: Record<string, string> = {
  "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪",
  "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯"
};

export function toBengaliNumerals(val: string | number): string {
  return String(val).replace(/[0-9]/g, (digit) => bnDigits[digit] || digit);
}

/**
 * Format paise to formatted INR string (₹)
 * Example: 149900 paise -> ₹1,499 (or ₹১,৪৯৯ if in Bengali mode)
 */
export function formatPrice(paise: number, locale: Locale = "bn", useBnNumerals: boolean = true): string {
  const rupees = Math.round(paise / 100);
  const formattedEn = new Intl.NumberFormat("en-IN").format(rupees);
  if (locale === "bn" && useBnNumerals) {
    return `₹${toBengaliNumerals(formattedEn)}`;
  }
  return `₹${formattedEn}`;
}
