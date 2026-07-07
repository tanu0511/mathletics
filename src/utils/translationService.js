// utils/TranslationService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const TRANSLATE_API = 'http://13.203.232.239:3000/api/auth/translate';
const CACHE_PREFIX = 'translations_';

/**
 * Sends all app strings to the backend for translation.
 * Returns the translated content object.
 *
 * @param {string} targetLanguage - e.g. 'Hindi', 'Spanish', 'Chinese', 'English'
 * @param {object} contentToTranslate - object with keys: title, buttons[], paragraphs[], footer, sentance, etc.
 */
export const translateContent = async (targetLanguage, contentToTranslate) => {
  try {
    // Check cache first
    const cacheKey = `${CACHE_PREFIX}${targetLanguage}`;
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      console.log(`[TranslationService] Using cached translations for: ${targetLanguage}`);
      return JSON.parse(cached);
    }

    console.log(`[TranslationService] Fetching translations for: ${targetLanguage}`);

    // ✅ Fixed: backend expects "pageContent" and "targetLanguage"
    const requestBody = {
      targetLanguage: targetLanguage,
      pageContent: contentToTranslate,
    };

    console.log('[TranslationService] Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(TRANSLATE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const responseText = await response.text();
    console.log(`[TranslationService] Response status: ${response.status}`);
    console.log(`[TranslationService] Response body:`, responseText);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${responseText}`);
    }

    const data = JSON.parse(responseText);
    const translated = data.translatedContent || data.content || data;

    // Cache the result
    await AsyncStorage.setItem(cacheKey, JSON.stringify(translated));

    console.log('[TranslationService] Translation successful');
    return translated;
  } catch (error) {
    console.error('[TranslationService] Error:', error);
    // Return original content as fallback
    return contentToTranslate;
  }
};

/**
 * Clear translation cache (useful when forcing a re-fetch)
 */
export const clearTranslationCache = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const translationKeys = keys.filter(k => k.startsWith(CACHE_PREFIX));
    await AsyncStorage.multiRemove(translationKeys);
    console.log('[TranslationService] Cache cleared');
  } catch (error) {
    console.error('[TranslationService] Error clearing cache:', error);
  }
};

/**
 * Map language code to full name expected by your API
 */
export const getLanguageNameFromCode = (code) => {
  const map = {
    en: 'English',
    hi: 'Hindi',
    es: 'Spanish',
    zh: 'Chinese',
  };
  return map[code] || 'English';
};