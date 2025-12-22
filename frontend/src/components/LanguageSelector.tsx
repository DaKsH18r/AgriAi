/**
 * Language Selector Component
 * Allows users to switch between supported languages
 */

import { Globe } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import type { Language } from "../i18n/translations";

const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
];

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative inline-block">
      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
        <Globe className="w-4 h-4 text-white" />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="bg-transparent text-white text-sm font-medium outline-none cursor-pointer pr-2"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code} className="text-gray-900">
              {lang.nativeName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
