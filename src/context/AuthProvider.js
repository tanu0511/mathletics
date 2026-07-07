// import React, { createContext, useState, useEffect } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);

//   // Load auth state on mount
//   useEffect(() => {
//     const loadAuthData = async () => {
//       try {
//         const storedToken = await AsyncStorage.getItem('accessToken');
//         const storedUser = await AsyncStorage.getItem('userData');
//         if (storedToken && storedUser) {
//           setToken(storedToken);
//           setUser(JSON.parse(storedUser));
//         }
//       } catch (e) {
//         console.log('Failed to load auth data', e);
//       }
//     };
//     loadAuthData();
//   }, []);

//   const login = async (newToken, newUser, fullResponse) => {
//     try {
//       setToken(newToken);
//       setUser(newUser);
//       await AsyncStorage.setItem('accessToken', newToken);
//       await AsyncStorage.setItem('userData', JSON.stringify(newUser));
//       if (fullResponse) {
//         await AsyncStorage.setItem('fullLoginResponse', JSON.stringify(fullResponse));
//       }
//     } catch (e) {
//       console.log('Login error', e);
//     }
//   };

//   const logout = async () => {
//     try {
//       setToken(null);
//       setUser(null);
//       await AsyncStorage.clear(); // Or remove specific keys
//     } catch (e) {
//       console.log('Logout error', e);
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, setUser, token, setToken, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


import React, { createContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setLogoutCallback } from '../api/axiosInstance'; // ✅ adjust path if needed

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Keep a ref so the logout callback always sees the latest setter
  // without needing to re-register on every render
  const setUserRef = useRef(setUser);
  const setTokenRef = useRef(setToken);
  useEffect(() => { setUserRef.current = setUser; }, [setUser]);
  useEffect(() => { setTokenRef.current = setToken; }, [setToken]);

  // ── Register logout callback once on mount ──────────────────
  useEffect(() => {
    setLogoutCallback(() => {
      setUserRef.current(null);
      setTokenRef.current(null);
      // Navigation is handled inside forceLogout via navigationRef
      // If you have navigationRef in App.js, reset it there instead
    });
  }, []);

  // ── Load auth state on mount ────────────────────────────────
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('accessToken');
        const storedUser = await AsyncStorage.getItem('userData');
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.log('Failed to load auth data', e);
      }
    };
    loadAuthData();
  }, []);

  const login = async (newToken, newUser, fullResponse) => {
    try {
      setToken(newToken);
      setUser(newUser);
      await AsyncStorage.setItem('accessToken', newToken);
      await AsyncStorage.setItem('userData', JSON.stringify(newUser));
      if (fullResponse) {
        await AsyncStorage.setItem('fullLoginResponse', JSON.stringify(fullResponse));
      }
    } catch (e) {
      console.log('Login error', e);
    }
  };

  const logout = async () => {
    try {
      setToken(null);
      setUser(null);
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userData', 'fullLoginResponse']);
    } catch (e) {
      console.log('Logout error', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};