// // utils/TranslationService.js
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const TRANSLATE_API = 'http://13.203.232.239:3000/api/auth/translate';
// const CACHE_PREFIX = 'translations_';

// /**
//  * Sends all app strings to the backend for translation.
//  * Returns the translated content object.
//  *
//  * @param {string} targetLanguage - e.g. 'Hindi', 'Spanish', 'Chinese', 'English'
//  * @param {object} contentToTranslate - object with keys: title, buttons[], paragraphs[], footer, sentance, etc.
//  */
// export const translateContent = async (targetLanguage, contentToTranslate) => {
//   try {
//     // Check cache first
//     const cacheKey = `${CACHE_PREFIX}${targetLanguage}`;
//     const cached = await AsyncStorage.getItem(cacheKey);
//     if (cached) {
//       console.log(`[TranslationService] Using cached translations for: ${targetLanguage}`);
//       return JSON.parse(cached);
//     }

//     console.log(`[TranslationService] Fetching translations for: ${targetLanguage}`);

//     // ✅ Fixed: backend expects "pageContent" and "targetLanguage"
//     const requestBody = {
//       targetLanguage: targetLanguage,
//       pageContent: contentToTranslate,
//     };

//     console.log('[TranslationService] Request body:', JSON.stringify(requestBody, null, 2));

//     const response = await fetch(TRANSLATE_API, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(requestBody),
//     });

//     const responseText = await response.text();
//     console.log(`[TranslationService] Response status: ${response.status}`);
//     console.log(`[TranslationService] Response body:`, responseText);

//     if (!response.ok) {
//       throw new Error(`API Error: ${response.status} - ${responseText}`);
//     }

//     const data = JSON.parse(responseText);
//     const translated = data.translatedContent || data.content || data;

//     // Cache the result
//     await AsyncStorage.setItem(cacheKey, JSON.stringify(translated));

//     console.log('[TranslationService] Translation successful');
//     return translated;
//   } catch (error) {
//     console.error('[TranslationService] Error:', error);
//     // Return original content as fallback
//     return contentToTranslate;
//   }
// };

// /**
//  * Clear translation cache (useful when forcing a re-fetch)
//  */
// export const clearTranslationCache = async () => {
//   try {
//     const keys = await AsyncStorage.getAllKeys();
//     const translationKeys = keys.filter(k => k.startsWith(CACHE_PREFIX));
//     await AsyncStorage.multiRemove(translationKeys);
//     console.log('[TranslationService] Cache cleared');
//   } catch (error) {
//     console.error('[TranslationService] Error clearing cache:', error);
//   }
// };

// /**
//  * Map language code to full name expected by your API
//  */
// export const getLanguageNameFromCode = (code) => {
//   const map = {
//     en: 'English',
//     hi: 'Hindi',
//     es: 'Spanish',
//     'zh-cn': 'Chinese (Simplified)',
//   };
//   return map[code] || 'English';
// };

// utils/TranslationService.js  ← DEBUG VERSION (remove logs once working)
// services/TranslationService.js

import AsyncStorage from '@react-native-async-storage/async-storage';

const TRANSLATE_API = 'http://13.203.232.239:3000/api/auth/translate';
const CACHE_PREFIX = 'translations_v2_'; // ✅ Bumped prefix — forces old v1 caches to be ignored

/**
 * Sends all app strings to the backend for translation.
 * Returns the translated content object, or falls back to the original on error.
 *
 * @param {string} targetLanguage  - Full language name, e.g. 'Hindi', 'Spanish'
 * @param {object} contentToTranslate - The DEFAULT_APP_STRINGS object
 */
export const translateContent = async (targetLanguage, contentToTranslate) => {
  const cacheKey = `${CACHE_PREFIX}${targetLanguage}`;

  try {
    // ── 1. Cache check ──────────────────────────────────────────────────────
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);

      // ✅ Validate ALL arrays match current appStrings length.
      // If the developer added new strings since last cache, force a fresh fetch.
      const buttonsMatch   = parsed.buttons?.length   === contentToTranslate.buttons?.length;
      const paragraphMatch = parsed.paragraphs?.length === contentToTranslate.paragraphs?.length;
      const labelsMatch    = parsed.labels?.length     === contentToTranslate.labels?.length;

      // ✅ Also validate top-level keys exist
      const topLevelKeys = ['title', 'footer', 'sentance', 'Home', 'Play', 'Practise', 'More'];
      const topLevelMatch = topLevelKeys.every((k) => k in parsed);

      if (buttonsMatch && paragraphMatch && labelsMatch && topLevelMatch) {
        console.log(`[TS] ✅ Cache hit for: ${targetLanguage}`);
        console.log(`[TS] Cached buttons[0..2]:`, parsed?.buttons?.slice(0, 3));
        return parsed;
      } else {
        console.log(`[TS] ⚠️ Cache STALE for: ${targetLanguage} — fetching fresh`);
        console.log(`[TS]   buttons match: ${buttonsMatch}, paragraphs: ${paragraphMatch}, labels: ${labelsMatch}, topLevel: ${topLevelMatch}`);
        // Remove stale cache before refetching
        await AsyncStorage.removeItem(cacheKey);
      }
    }

    // ── 2. API call ─────────────────────────────────────────────────────────
    console.log(`[TS] Calling API for: ${targetLanguage}`);
    const requestBody = {
      targetLanguage,
      pageContent: contentToTranslate,
    };

    const response = await fetch(TRANSLATE_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    const responseText = await response.text();
    console.log(`[TS] Status: ${response.status}`);
    console.log(`[TS] Raw response (first 600 chars):`, responseText.slice(0, 600));

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${responseText}`);
    }

    // ── 3. Parse — handle multiple possible response shapes ──────────────────
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error(`[TS] Failed to parse API JSON response: ${responseText.slice(0, 200)}`);
    }

    console.log(`[TS] Response top-level keys:`, Object.keys(data));

    // Resolve the translated content from whichever key the API uses
    const translated =
      data.translatedContent ||
      data.content ||
      data.data ||
      data.result ||
      data;

    console.log(`[TS] Resolved keys:`, Object.keys(translated));
    console.log(`[TS] buttons is array?`, Array.isArray(translated.buttons));
    console.log(`[TS] buttons[0..2]:`, translated.buttons?.slice(0, 3));
    console.log(`[TS] paragraphs[0..1]:`, translated.paragraphs?.slice(0, 2));
    console.log(`[TS] Home (top-level):`, translated?.Home);

    // ✅ Warn if arrays are missing or wrong type — helps debug backend issues
    if (!Array.isArray(translated.buttons)) {
      console.warn(`[TS] ⚠️ 'buttons' is not an array in API response!`);
    }
    if (!Array.isArray(translated.paragraphs)) {
      console.warn(`[TS] ⚠️ 'paragraphs' is not an array in API response!`);
    }
    if (!Array.isArray(translated.labels)) {
      console.warn(`[TS] ⚠️ 'labels' is not an array in API response!`);
    }

    // ── 4. Cache the valid result ────────────────────────────────────────────
    await AsyncStorage.setItem(cacheKey, JSON.stringify(translated));
    console.log(`[TS] ✅ Translation cached for: ${targetLanguage}`);
    return translated;

  } catch (error) {
    console.error('[TS] ❌ Error:', error.message);
    // Return original English content as fallback so the app never breaks
    return contentToTranslate;
  }
};

/**
 * Clears ALL translation caches (call this after updating appStrings).
 */
export const clearTranslationCache = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const translationKeys = keys.filter((k) => k.startsWith(CACHE_PREFIX));
    await AsyncStorage.multiRemove(translationKeys);
    console.log('[TS] ✅ Cache cleared:', translationKeys);
  } catch (error) {
    console.error('[TS] ❌ Error clearing cache:', error);
  }
};

/**
 * Maps language code → full name expected by the translation API.
 * Add new languages here as the app grows.
 */
// export const getLanguageNameFromCode = (code) => {
//   const map = {
//     en: 'English',
//     hi: 'Hindi',
//     es: 'Spanish',
//     zh: 'Chinese (Simplified)',
//     'zh-cn': 'Chinese (Simplified)',
//     // fr: 'French',
//     // ar: 'Arabic',
//     // pt: 'Portuguese',
//     // ru: 'Russian',
//     // de: 'German',
//     // ja: 'Japanese',
//     // ko: 'Korean',
//   };
//   const result = map[code] || 'English';
//   console.log(`[TS] Code '${code}' → '${result}'`);
//   return result;
// };

export const getLanguageNameFromCode = (code) => {
  const map = {
    en: 'English',
    hi: 'Hindi',
    es: 'Spanish',
    zh: 'Chinese (Simplified)',
    'zh-cn': 'Chinese (Simplified)',
    mr: 'Marathi',   // ← add
    kn: 'Kannada',   // ← add
    te: 'Telugu',    // ← add
  };
  const result = map[code] || 'English';
  console.log(`[TS] Code '${code}' → '${result}'`);
  return result;
};