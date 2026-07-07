// src/utils/authFetch.js
//
// Drop-in replacement for the global `fetch()` that transparently handles
// our backend's access-token expiry flow:
//   1. Makes the request exactly like fetch() would.
//   2. If the server replies 401 + { code: 'TOKEN_EXPIRED' }, it calls
//      /api/auth/refresh-token, stores the new tokens, and retries the
//      ORIGINAL request once with the new accessToken.
//   3. If the refresh token itself is invalid/missing, it force-logs-out.
//   4. Concurrent calls that hit an expired token at the same time share a
//      single in-flight refresh (no duplicate refresh-token calls).
//
// Usage: identical to fetch(url, options) — same Response object returned,
// same .json()/.ok/.status semantics for the caller.
//
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { forceLogout } from '../api/axiosInstance';

const BASE_URL = 'http://13.203.232.239:3000';

let isRefreshing = false;
let waiters = [];

const notifyWaiters = (err, token) => {
  waiters.forEach((w) => (err ? w.reject(err) : w.resolve(token)));
  waiters = [];
};

const refreshAccessToken = async () => {
  // If a refresh is already in flight, piggyback on it instead of firing
  // a second /refresh-token call (which would invalidate the first one).
  if (isRefreshing) {
    return new Promise((resolve, reject) => waiters.push({ resolve, reject }));
  }

  isRefreshing = true;
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('NO_REFRESH_TOKEN');
    }

    // Plain axios (not the axiosInstance) — avoids re-triggering any
    // interceptor logic and matches the pattern used elsewhere in the app.
    const res = await axios.post(`${BASE_URL}/api/auth/refresh-token`, { refreshToken });
    const { accessToken: newAccess, refreshToken: newRefresh } = res.data;

    await AsyncStorage.setItem('accessToken', newAccess);
    await AsyncStorage.setItem('refreshToken', newRefresh);

    notifyWaiters(null, newAccess);
    return newAccess;
  } catch (err) {
    notifyWaiters(err, null);
    throw err;
  } finally {
    isRefreshing = false;
  }
};

export const authFetch = async (url, options = {}, _isRetry = false) => {
  const response = await fetch(url, options);

  // Only ever attempt the refresh dance once per call, and only on 401s.
  if (response.status === 401 && !_isRetry) {
    let code = null;

    try {
      // Clone before reading so the caller can still consume the body
      // normally afterwards (response.json() etc. work as if untouched).
      const peek = response.clone();
      const data = await peek.json();
      code = data?.code;
    } catch (_) {
      // Body wasn't JSON (or empty) — nothing more we can do, fall through
      // and hand the original 401 response back to the caller as-is.
    }

    if (code === 'TOKEN_EXPIRED') {
      try {
        const newAccessToken = await refreshAccessToken();

        const retryOptions = {
          ...options,
          headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${newAccessToken}`,
          },
        };

        return authFetch(url, retryOptions, true);
      } catch (err) {
        await forceLogout();
        return response; // caller's existing 401-handling code still runs
      }
    }

    if (code === 'REFRESH_TOKEN_INVALID') {
      await forceLogout();
    }
  }

  return response;
};

export default authFetch;
