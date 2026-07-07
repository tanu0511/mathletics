// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';

// const BASE_URL = 'http://13.203.232.239:3000';

// export const authenticateSocket = (socket, onFailure) => {
//   return new Promise(async (resolve, reject) => {
//     const token = await AsyncStorage.getItem('accessToken');

//     socket.emit('authenticate', token, async (response) => {
//       if (response?.success) {
//         resolve();
//         return;
//       }

//       if (response?.code === 'TOKEN_EXPIRED') {
//         try {
//           const refreshToken = await AsyncStorage.getItem('refreshToken');
//           const res = await axios.post(`${BASE_URL}/api/auth/refresh-token`, { refreshToken });

//           const { accessToken: newAccess, refreshToken: newRefresh } = res.data;
//           await AsyncStorage.setItem('accessToken', newAccess);
//           await AsyncStorage.setItem('refreshToken', newRefresh);

//           // Retry auth with new token
//           socket.emit('authenticate', newAccess, (retryResponse) => {
//             if (retryResponse?.success) {
//               resolve();
//             } else {
//               onFailure?.('AUTH_FAILED_AFTER_REFRESH');
//               reject(new Error('Socket auth failed after refresh'));
//             }
//           });

//         } catch (err) {
//           onFailure?.('REFRESH_FAILED');
//           reject(err);
//         }
//       } else {
//         onFailure?.('AUTH_FAILED');
//         reject(new Error(response?.error || 'Socket auth failed'));
//       }
//     });
//   });
// };

import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './axiosInstance'; // ✅ use api, not axios

export const authenticateSocket = (socket, onFailure) => {
  return new Promise(async (resolve, reject) => {
    const token = await AsyncStorage.getItem('accessToken');

    socket.emit('authenticate', token, async (response) => {
      if (response?.success) return resolve();

      if (response?.code === 'TOKEN_EXPIRED') {
        try {
          // ✅ Trigger the HTTP interceptor to do the refresh
          // This also handles the queue if refresh is already in progress
          await api.get('/api/auth/getUser');

          // By now the interceptor has saved fresh tokens
          const freshToken = await AsyncStorage.getItem('accessToken');

          socket.emit('authenticate', freshToken, (retry) => {
            if (retry?.success) resolve();
            else {
              onFailure?.('AUTH_FAILED_AFTER_REFRESH');
              reject(new Error('Socket auth failed after refresh'));
            }
          });

        } catch (err) {
          onFailure?.('REFRESH_FAILED');
          reject(err);
        }

      } else {
        onFailure?.('AUTH_FAILED');
        reject(new Error(response?.error || 'Socket auth failed'));
      }
    });
  });
};