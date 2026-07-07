// import AsyncStorage from '@react-native-async-storage/async-storage';

// /**
//  * 🎯 Utility: Fetch a question with randomly selected symbol
//  * Handles comma-separated symbol lists from PlayGame
//  * @param {string} symbolList - Comma-separated symbols: "sum,difference,product,quotient"
//  * @param {string} difficulty - Difficulty level: "easy", "medium", "hard"
//  * @returns {Promise<Object>} Question object or null
//  */
// export const fetchQuestionWithRandomSymbol = async (symbolList, difficulty) => {
//   try {
//     const token = await AsyncStorage.getItem('accessToken');

//     if (!token) {
//       console.error('🔴 NO TOKEN FOUND');
//       return null;
//     }

//     // ✅ Parse symbol list and randomly select one
//     const getRandomSymbol = (symbols) => {
//       if (!symbols) return null;

//       let symbolToUse = symbols;
      
//       // If comma-separated, randomly pick one
//       if (symbols.includes(',')) {
//         const symbolArray = symbols.split(',').map(s => s.trim());
//         symbolToUse = symbolArray[Math.floor(Math.random() * symbolArray.length)];
//       }

//       // Capitalize first letter
//       symbolToUse = symbolToUse.charAt(0).toUpperCase() + symbolToUse.slice(1);

//       // Map to valid API values
//       const map = {
//         Sum: 'Sum',
//         Difference: 'Difference',
//         Product: 'Product',
//         Quotient: 'Quotient',
//         Modulus: 'Modulus',
//         Exponent: 'Exponent',
//       };

//       return map[symbolToUse] || symbolToUse;
//     };

//     const apiSymbol = getRandomSymbol(symbolList);

//     console.log('🎯 RANDOM SYMBOL SELECTED:');
//     console.log('  - Available symbols:', symbolList);
//     console.log('  - Selected for this question:', apiSymbol);

//     if (!apiSymbol) {
//       console.error('🚨 INVALID SYMBOL!', symbolList);
//       return null;
//     }

//     const queryParams = new URLSearchParams({
//       difficulty: difficulty || 'easy',
//       symbol: apiSymbol,
//     });

//     const url = `http://13.203.232.239:3000/api/question?${queryParams.toString()}`;
//     console.log('📡 Fetching from:', url);

//     const response = await fetch(url, {
//       method: 'GET',
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!response.ok) {
//       console.error('❌ API Error:', response.status);
//       return null;
//     }

//     const data = await response.json();

//     // Handle all possible response formats
//     const questionData =
//       data?.question ||
//       data?.nextQuestion ||
//       data?.data?.question ||
//       null;

//     if (questionData) {
//       console.log('✅ Question fetched with symbol:', apiSymbol);
//       return questionData;
//     }

//     console.error('❌ No question in response');
//     return null;
//   } catch (err) {
//     console.error('❌ ERROR FETCHING QUESTION:', err);
//     return null;
//   }
// };


import AsyncStorage from '@react-native-async-storage/async-storage';
import { authFetch as fetch } from './authFetch'; // auto-refresh wrapper for expired access tokens

/**
 * 🎯 Utility: Fetch a question with randomly selected symbol
 * Handles comma-separated symbol lists from PlayGame
 * @param {string} symbolList - Comma-separated symbols: "sum,difference,product,quotient"
 * @param {string} diffCode - "E2"|"E4"|"M2"|"M4"|"H2"|"H4"
 * @returns {Promise<Object>} Full response: { question, initQM, ceiling, diffCode } or null
 */
export const fetchQuestionWithRandomSymbol = async (symbolList, diffCode) => {
  try {
    const token = await AsyncStorage.getItem('accessToken');

    if (!token) {
      console.error('🔴 NO TOKEN FOUND');
      return null;
    }

    // ✅ Parse symbol list and randomly select one
    const getRandomSymbol = (symbols) => {
      if (!symbols) return null;

      let symbolToUse = symbols;
      
      // If comma-separated, randomly pick one
      if (symbols.includes(',')) {
        const symbolArray = symbols.split(',').map(s => s.trim());
        symbolToUse = symbolArray[Math.floor(Math.random() * symbolArray.length)];
      }

      // Capitalize first letter
      symbolToUse = symbolToUse.charAt(0).toUpperCase() + symbolToUse.slice(1);

      // Map to valid API values
      const map = {
        Sum: 'Sum',
        Difference: 'Difference',
        Product: 'Product',
        Quotient: 'Quotient',
        Modulus: 'Modulus',
        Exponent: 'Exponent',
      };

      return map[symbolToUse] || symbolToUse;
    };

    const apiSymbol = getRandomSymbol(symbolList);

    console.log('🎯 RANDOM SYMBOL SELECTED:');
    console.log('  - Available symbols:', symbolList);
    console.log('  - Selected for this question:', apiSymbol);

    if (!apiSymbol) {
      console.error('🚨 INVALID SYMBOL!', symbolList);
      return null;
    }

    const queryParams = new URLSearchParams({
      diffCode: diffCode,
      symbol: apiSymbol,
    });

    const url = `http://13.203.232.239:3000/api/question?${queryParams.toString()}`;
    console.log('📡 Fetching from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('❌ API Error:', response.status);
      return null;
    }

    const data = await response.json();

    if (!data?.question) {
      console.error('❌ No question in response');
      return null;
    }

    console.log('✅ Question fetched with symbol:', apiSymbol, '| initQM:', data.initQM, '| ceiling:', data.ceiling);
    return data; // { question, initQM, ceiling, diffCode }
  } catch (err) {
    console.error('❌ ERROR FETCHING QUESTION:', err);
    return null;
  }
};