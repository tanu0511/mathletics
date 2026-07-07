// // context/TranslationContext.js
// // Provides translated strings to the entire app via React Context

// import React, { createContext, useContext, useState, useEffect } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { translateContent, getLanguageNameFromCode } from '../services/TranslationService';

// // ─── DEFAULT APP STRINGS (English baseline) ───────────────────────────────────
// // Add ALL your app's translatable strings here.
// // The backend will translate everything in this object.
// export const DEFAULT_APP_STRINGS = {
//   // Common / Shared
//   title: 'Welcome',
//   footer: 'All rights reserved.',
//   sentance: 'Have you read all the terms?',

//   // Buttons
//   buttons: [
//     'Submit',
//     'Cancel',
//     'Continue',
//     'Go Back',
//     'Okay',
//     'Get Started',
//     'Sign In',
//     'Sign Up',
//     'Save',
//     'Delete',
//     'Confirm',
//     'Next',
//     'Skip',
//     'Sign - In',
//     'Forgot Password',
//     'Register now',
//     'Not a member?',
//     'Done',  
//      "Let's Play",  // ← add this
 

//   ],

//   // Paragraphs / Body text
//   paragraphs: [
//     'Select your preferred language',
//     'You have Selected:',
//     'Click the button.',
//     'Please wait while we load your content.',
//     'Something went wrong. Please try again.',
//     'No internet connection. Please check your network.',
//     'Your changes have been saved successfully.',
//     'Are you sure you want to continue?',
//     'Enter your details below.',
//     'Welcome back!',
//     'Create your account',
//     'Forgot your password?',
//     'Don\'t have an account?',
//     'Already have an account?',
//     'Enter your Email',
//     'Enter your Password',
//     'or continue with',
//     'Your email is wrong',
//     'Your password is wrong',
//     'ID / Password is Incorrect',
//     'This field is required',
//     'Please enter a valid email',
//     'OTP Sent',
//     'Failed',
//     'Network Error',
//     'Please try again later.',
//     'Google login coming soon',
//     'Twitter login coming soon',
//     'Facebook login coming soon',
//     'Token or user data not received',
//     'By continuing, you agree to our Terms of Service.',
//   'Boost your mental math and reflexes.',       // ← add
//   "Put on your gym shoes and let's get working.", // ← add
//   'And Remember - Every Second Counts.',
//   ],

//   // Screen-specific labels (add more as your app grows)
//   labels: [
//     'Email',
//     'Password',
//     'Full Name',
//     'Phone Number',
//     'Date of Birth',
//     'Gender',
//     'Address',
//     'City',
//     'Country',
//     'Loading...',
//     'Error',
//     'Success',
//     'Warning',
//     'Info',
//     'Notifications',
//     'Settings',
//     'Profile',
//     'Home',
//     'Search',
//     'Logout',
//     'STATS',
//     'User Name',
//     'PVP Stats',
//     'Practice Stats',
//     'Rating',
//     'Correct',
//     'Incorrect',
//     'Skipped',
//     'Win',
//     'Loss',
//     'Draw',
//     'No rating history available',
//     'Authentication token missing. Please log in again.',
//     'Player ID not found. Please log out and log in again.',
//     'Server returned an unexpected response. Please try again.',
//     'Something went wrong. Please try again.',
//     '1 W',
//     '1 M',
//     '3 M',
//     '1 Y',
//     'All Time',
//     'Highest Rating',
//     'Longest Win Streak',
//     'Best Win (Opponent)',
//     'Ques/Sec',
//     'No. of Games Played',
//     'Best Streak',
//     'Best Accuracy',
//     'Best Q/s',
//     'Top Score',
//     'Accuracy %',
//   ],
// };

// // ─── CONTEXT SETUP ─────────────────────────────────────────────────────────────
// const TranslationContext = createContext({
//   strings: DEFAULT_APP_STRINGS,
//   isTranslating: false,
//   currentLanguage: 'en',
//   applyTranslation: async () => {},
//   t: (key) => key, // simple lookup
// });

// export const TranslationProvider = ({ children }) => {
//   const [strings, setStrings] = useState(DEFAULT_APP_STRINGS);
//   const [isTranslating, setIsTranslating] = useState(false);
//   const [currentLanguage, setCurrentLanguage] = useState('en');

//   // On mount: restore last used language translations
//   useEffect(() => {
//     const restoreLanguage = async () => {
//       try {
//         const savedCode = await AsyncStorage.getItem('appLanguage');
//         if (savedCode && savedCode !== 'en') {
//           await applyTranslation(savedCode);
//         }
//       } catch (e) {
//         console.log('[TranslationContext] Restore error:', e);
//       }
//     };
//     restoreLanguage();
//   }, []);

//   /**
//    * Call this when user picks a language.
//    * Fetches translations from API and updates global string state.
//    */
//   const applyTranslation = async (langCode) => {
//     if (langCode === 'en') {
//       setStrings(DEFAULT_APP_STRINGS);
//       setCurrentLanguage('en');
//       return DEFAULT_APP_STRINGS;
//     }

//     setIsTranslating(true);
//     try {
//       const langName = getLanguageNameFromCode(langCode);
//       const translated = await translateContent(langName, DEFAULT_APP_STRINGS);

//       // Merge with defaults to ensure no missing keys
//       const merged = { ...DEFAULT_APP_STRINGS, ...translated };
//       setStrings(merged);
//       setCurrentLanguage(langCode);
//       return merged;
//     } catch (error) {
//       console.error('[TranslationContext] Failed:', error);
//       return strings;
//     } finally {
//       setIsTranslating(false);
//     }
//   };

//   /**
//    * Simple translation lookup.
//    * Searches buttons[], paragraphs[], labels[] arrays and top-level keys.
//    * Usage: t('Submit') → 'जमा करना'
//    */
//   const t = (originalText) => {
//     if (!originalText) return originalText;
//     if (currentLanguage === 'en') return originalText;

//     // Check top-level string keys
//     for (const key of Object.keys(strings)) {
//       if (typeof strings[key] === 'string' && DEFAULT_APP_STRINGS[key] === originalText) {
//         return strings[key];
//       }
//     }

//     // Check arrays: buttons, paragraphs, labels
//     const arrayKeys = ['buttons', 'paragraphs', 'labels'];
//     for (const arrayKey of arrayKeys) {
//       const defaultArr = DEFAULT_APP_STRINGS[arrayKey] || [];
//       const translatedArr = strings[arrayKey] || [];
//       const idx = defaultArr.indexOf(originalText);
//       if (idx !== -1 && translatedArr[idx]) {
//         return translatedArr[idx];
//       }
//     }

//     return originalText; // fallback
//   };

//   return (
//     <TranslationContext.Provider
//       value={{ strings, isTranslating, currentLanguage, applyTranslation, t }}>
//       {children}
//     </TranslationContext.Provider>
//   );
// };

// export const useAppTranslation = () => useContext(TranslationContext);
// context/TranslationContext.js
// context/TranslationContext.js
// Provides translated strings to the entire app via React Context.

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translateContent, getLanguageNameFromCode } from '../services/TranslationService';
import { APP_STRINGS } from '../config/appStrings';

export const DEFAULT_APP_STRINGS = APP_STRINGS;

const TranslationContext = createContext({
  strings: DEFAULT_APP_STRINGS,
  isTranslating: false,
  currentLanguage: 'en',
  applyTranslation: async () => {},
  t: (key) => key,
});

export const TranslationProvider = ({ children }) => {
  const [strings, setStrings] = useState(DEFAULT_APP_STRINGS);
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // On mount: restore last used language
  useEffect(() => {
    const restoreLanguage = async () => {
      try {
        const savedCode = await AsyncStorage.getItem('appLanguage');
        console.log('[TC] Restored language code:', savedCode);
        if (savedCode && savedCode !== 'en') {
          await applyTranslation(savedCode);
        }
      } catch (e) {
        console.log('[TC] Restore error:', e);
      }
    };
    restoreLanguage();
  }, []);

  /**
   * Call this when user picks a language.
   * Fetches translations from the API and updates global string state.
   */
  const applyTranslation = async (langCode) => {
    if (langCode === 'en') {
      setStrings(DEFAULT_APP_STRINGS);
      setCurrentLanguage('en');
      await AsyncStorage.setItem('appLanguage', 'en');
      return DEFAULT_APP_STRINGS;
    }

    setIsTranslating(true);
    try {
      const langName = getLanguageNameFromCode(langCode);
      console.log(`[TC] Applying translation: ${langCode} -> ${langName}`);

      const translated = await translateContent(langName, DEFAULT_APP_STRINGS);

      console.log('[TC] Translated buttons[2] (Continue):', translated?.buttons?.[2]);
      console.log('[TC] Translated paragraphs[0]:', translated?.paragraphs?.[0]);

      // ✅ Deep merge: always fall back to English defaults for any missing index
      const merged = {
        ...DEFAULT_APP_STRINGS,
        ...translated,
        // Preserve top-level nav keys — these must also be translated if API returns them
        Home: translated?.Home || DEFAULT_APP_STRINGS.Home,
        Play: translated?.Play || DEFAULT_APP_STRINGS.Play,
        Practise: translated?.Practise || DEFAULT_APP_STRINGS.Practise,
        More: translated?.More || DEFAULT_APP_STRINGS.More,
        title: translated?.title || DEFAULT_APP_STRINGS.title,
        footer: translated?.footer || DEFAULT_APP_STRINGS.footer,
        sentance: translated?.sentance || DEFAULT_APP_STRINGS.sentance,
        // Arrays: map by index, fall back to English for any gap
        buttons: DEFAULT_APP_STRINGS.buttons.map(
          (_, i) => translated?.buttons?.[i] || DEFAULT_APP_STRINGS.buttons[i]
        ),
        paragraphs: DEFAULT_APP_STRINGS.paragraphs.map(
          (_, i) => translated?.paragraphs?.[i] || DEFAULT_APP_STRINGS.paragraphs[i]
        ),
        labels: DEFAULT_APP_STRINGS.labels.map(
          (_, i) => translated?.labels?.[i] || DEFAULT_APP_STRINGS.labels[i]
        ),
      };

      setStrings(merged);
      setCurrentLanguage(langCode);
      await AsyncStorage.setItem('appLanguage', langCode);

      console.log('[TC] Merge complete. buttons count:', merged.buttons.length);
      console.log('[TC] Home (top-level):', merged.Home);
      return merged;
    } catch (error) {
      console.error('[TC] Failed:', error);
      return strings;
    } finally {
      setIsTranslating(false);
    }
  };

  /**
   * t(originalEnglishText) → translated string
   *
   * Lookup priority (IMPORTANT — matches how appStrings.js is structured):
   *   1. Top-level string keys  (Home, Play, More, title, footer, etc.)
   *   2. buttons[]
   *   3. paragraphs[]
   *   4. labels[]
   *   5. Return original text as fallback
   *
   * This order ensures top-level nav labels (Home/Play/Practise/More) are
   * never shadowed by labels[] entries, since they were removed from labels[].
   */
  const t = (originalText) => {
    if (!originalText) return originalText;
    if (currentLanguage === 'en') return originalText;

    // ── 1. Top-level keys ─────────────────────────────────────────────────────
    for (const key of Object.keys(DEFAULT_APP_STRINGS)) {
      if (
        typeof DEFAULT_APP_STRINGS[key] === 'string' &&
        DEFAULT_APP_STRINGS[key] === originalText
      ) {
        const result = strings[key] || originalText;
        console.log(`[TC] t('${originalText}') → '${result}' [top-level: ${key}]`);
        return result;
      }
    }

    // ── 2‑4. Arrays: buttons → paragraphs → labels ───────────────────────────
    const arrayKeys = ['buttons', 'paragraphs', 'labels'];
    for (const arrayKey of arrayKeys) {
      const defaultArr = DEFAULT_APP_STRINGS[arrayKey] || [];
      const translatedArr = strings[arrayKey] || [];
      const idx = defaultArr.indexOf(originalText);
      if (idx !== -1) {
        const result = translatedArr[idx] || originalText;
        console.log(`[TC] t('${originalText}') → '${result}' [${arrayKey}[${idx}]]`);
        return result;
      }
    }

    // ── 5. Fallback ───────────────────────────────────────────────────────────
    console.warn(`[TC] ❌ t('${originalText}') NOT FOUND — lang=${currentLanguage}`);
    return originalText;
  };

  return (
    <TranslationContext.Provider
      value={{ strings, isTranslating, currentLanguage, applyTranslation, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useAppTranslation = () => useContext(TranslationContext);