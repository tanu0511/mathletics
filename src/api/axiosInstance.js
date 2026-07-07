// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const BASE_URL = 'http://13.203.232.239:3000';

// const api = axios.create({ baseURL: BASE_URL });

// // ── Request: attach access token ─────────────────────────────────────────
// api.interceptors.request.use(async (config) => {
//   const accessToken = await AsyncStorage.getItem('accessToken');
//   if (accessToken) {
//     config.headers.Authorization = `Bearer ${accessToken}`;
//   }
//   return config;
// });

// // ── Response: handle 401 → refresh → retry ──────────────────────────────
// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (error, token = null) => {
//   failedQueue.forEach(prom => {
//     if (error) prom.reject(error);
//     else prom.resolve(token);
//   });
//   failedQueue = [];
// };

// api.interceptors.response.use(
//   res => res,
//   async (error) => {
//     const originalRequest = error.config;

//     const code = error.response?.data?.code;
//     const status = error.response?.status;

//     if (status === 401 && code === 'TOKEN_EXPIRED' && !originalRequest._retry) {
//       if (isRefreshing) {
//         // Queue this request until refresh completes
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         }).then(token => {
//           originalRequest.headers.Authorization = `Bearer ${token}`;
//           return api(originalRequest);
//         });
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         const refreshToken = await AsyncStorage.getItem('refreshToken');
//         const res = await axios.post(`${BASE_URL}/api/auth/refresh-token`, { refreshToken });

//         const { accessToken: newAccess, refreshToken: newRefresh } = res.data;

//         await AsyncStorage.setItem('accessToken', newAccess);
//         await AsyncStorage.setItem('refreshToken', newRefresh);

//         processQueue(null, newAccess);
//         originalRequest.headers.Authorization = `Bearer ${newAccess}`;
//         return api(originalRequest);

//       } catch (err) {
//         processQueue(err, null);
//         await forceLogout();
//         return Promise.reject(err);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     // REFRESH_TOKEN_INVALID → force logout
//     if (status === 401 && code === 'REFRESH_TOKEN_INVALID') {
//       await forceLogout();
//     }

//     return Promise.reject(error);
//   }
// );

// export const forceLogout = async () => {
//   await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
//   // Import your navigationRef from App.js
//   // navigationRef.current?.reset({ index: 0, routes: [{ name: 'Login' }] });
// };

// export default api;

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://13.203.232.239:3000';

const api = axios.create({ baseURL: BASE_URL });

// ── Logout callback (set this from App.js or AuthProvider) ──
let _logoutCallback = null;
export const setLogoutCallback = (fn) => { _logoutCallback = fn; };

export const forceLogout = async () => {
  await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
  _logoutCallback?.();
};

// ── Request interceptor ──────────────────────────────────────
api.interceptors.request.use(async (config) => {
  const accessToken = await AsyncStorage.getItem('accessToken');
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

// ── Response interceptor ─────────────────────────────────────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(p => error ? p.reject(error) : p.resolve(token));
  failedQueue = [];
};

api.interceptors.response.use(
  res => res,
  async (error) => {
    const originalRequest = error.config;
    const code = error.response?.data?.code;
    const status = error.response?.status;

    if (status === 401 && code === 'TOKEN_EXPIRED' && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');

        if (!refreshToken) {
          await forceLogout();
          return Promise.reject(error);
        }

        // ✅ Use plain axios here to avoid triggering this interceptor again
        const res = await axios.post(`${BASE_URL}/api/auth/refresh-token`, { refreshToken });
        const { accessToken: newAccess, refreshToken: newRefresh } = res.data;

        await AsyncStorage.setItem('accessToken', newAccess);
        await AsyncStorage.setItem('refreshToken', newRefresh);

        api.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;
        processQueue(null, newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);

      } catch (err) {
        processQueue(err, null);
        await forceLogout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;  // ✅ always resets
      }
    }

    if (status === 401 && code === 'REFRESH_TOKEN_INVALID') {
      await forceLogout();
    }

    return Promise.reject(error);
  }
);

export default api;