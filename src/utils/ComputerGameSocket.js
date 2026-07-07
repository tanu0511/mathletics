// /**
//  * ComputerGameSocket.js
//  *
//  * Singleton holder for the /computer-game socket instance.
//  *
//  * Why a module instead of a global or React context?
//  * - Module-level state is set synchronously and is immediately readable
//  *   by any other module in the same JS bundle — no render cycle, no timing gap.
//  * - navigation.replace() can mount the destination screen before the line
//  *   after it executes (React batching), so global.__x = socket after replace()
//  *   is a race condition. Setting the module ref BEFORE calling replace() is safe.
//  * - Unlike React context, this doesn't require a Provider or cause re-renders.
//  */

// let _socket = null;

// const ComputerGameSocket = {
//   /** Call this BEFORE navigation.replace() so the new screen always finds it. */
//   set(socket) {
//     _socket = socket;
//   },

//   /** Returns the socket instance, or null if not set. */
//   get() {
//     return _socket;
//   },

//   /** Disconnect and clear. Call from ComputerGame on unmount / game end. */
//   clear() {
//     if (_socket) {
//       try {
//         _socket.disconnect();
//       } catch (_) {}
//       _socket = null;
//     }
//   },
// };

// export default ComputerGameSocket;


import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BASE_URL = 'http://13.203.232.239:3000';

let _socket = null;
let _onAuthFailure = null;

const authenticateSocket = async (sock, token) => {
  return new Promise((resolve, reject) => {
    sock.emit('authenticate', token, async (response) => {
      if (response?.success) {
        resolve();
        return;
      }

      if (response?.code === 'TOKEN_EXPIRED') {
        try {
          const refreshToken = await AsyncStorage.getItem('refreshToken');
          const res = await axios.post(`${BASE_URL}/api/auth/refresh-token`, { refreshToken });

          const { accessToken, refreshToken: newRefresh } = res.data;
          await AsyncStorage.setItem('accessToken', accessToken);
          await AsyncStorage.setItem('refreshToken', newRefresh);

          sock.emit('authenticate', accessToken, (retry) => {
            if (retry?.success) resolve();
            else reject(new Error('Auth failed after refresh'));
          });
        } catch (err) {
          reject(err);
        }
      } else {
        reject(new Error(response?.error || 'Auth failed'));
      }
    });
  });
};

const ComputerGameSocket = {
  /** Call this BEFORE navigation.replace() so the new screen always finds it. */
  set(socket, onAuthFailure) {
    _socket = socket;
    _onAuthFailure = onAuthFailure;

    socket.on('connect', async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        await authenticateSocket(socket, token);
      } catch (err) {
        console.error('[ComputerGameSocket] Auth failed:', err.message);
        _onAuthFailure?.();
      }
    });
  },

  /** Returns the socket instance, or null if not set. */
  get() {
    return _socket;
  },

  /** Disconnect and clear. Call from ComputerGame on unmount / game end. */
  clear() {
    if (_socket) {
      try {
        _socket.disconnect();
      } catch (_) {}
      _socket = null;
    }
    _onAuthFailure = null;
  },
};

export default ComputerGameSocket;