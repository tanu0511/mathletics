// // // // // src/SocketContext.js
// // // // import React, {
// // // //   createContext,
// // // //   useContext,
// // // //   useRef,
// // // //   useState,
// // // //   useEffect,
// // // // } from 'react';
// // // // import { AppState, Alert } from 'react-native';
// // // // import { io } from 'socket.io-client';
// // // // import AsyncStorage from '@react-native-async-storage/async-storage';

// // // // // Base backend URL for all socket connections
// // // // // const SOCKET_URL = 'https://mataletics-backend.onrender.com/';
// // // // const SOCKET_URL = 'http://13.203.232.239:3000/';

// // // // // How long we wait for an initial connection before forcing a retry
// // // // const CONNECTION_TIMEOUT = 15000;

// // // // // Infinite reconnection attempts – frontend should keep trying
// // // // const MAX_RECONNECTION_ATTEMPTS = Infinity;

// // // // const SocketContext = createContext(null);
// // // // const SocketStateContext = createContext(null);

// // // // export const Socket = ({ children }) => {
// // // //   // useRef so we only create one socket.io instance for the entire app
// // // //   const socketRef = useRef();
// // // //   const [connectionState, setConnectionState] = useState('connecting'); // 'connecting', 'connected', 'disconnected', 'error'
// // // //   const [registrationQueue, setRegistrationQueue] = useState([]);
// // // //   const reconnectionAttemptsRef = useRef(0);
// // // //   const connectionTimeoutRef = useRef(null);
// // // //   const hasRegisteredRef = useRef(false);
// // // //   const appStateRef = useRef(AppState.currentState);

// // // //   if (!socketRef.current) {
// // // //     // Create singleton socket instance with explicit reconnect behaviour
// // // //     socketRef.current = io(SOCKET_URL, {
// // // //       transports: ['websocket'],
// // // //       autoConnect: true, // we will manually control when to connect
// // // //       reconnection: true,
// // // //       reconnectionAttempts: MAX_RECONNECTION_ATTEMPTS,
// // // //       reconnectionDelay: 1000,
// // // //       reconnectionDelayMax: 5000,
// // // //       timeout: CONNECTION_TIMEOUT,
// // // //     });

// // // //     // Connect immediately on first creation so the player is registered asap
// // // //     socketRef.current.connect();

// // // //     // Auto-register the player every time the socket connects
// // // //     const autoRegisterPlayer = async () => {
// // // //       try {
// // // //         const userData = await AsyncStorage.getItem('userData');
// // // //         if (!userData) {
// // // //           console.warn(
// // // //             '⚠️ No user data in AsyncStorage, skipping auto-registration',
// // // //           );
// // // //           return;
// // // //         }

// // // //         const user = JSON.parse(userData);
// // // //         console.log('📤 Auto-registering player:', user.username);

// // // //         socketRef.current.emit('register-player', {
// // // //           userId: user._id,
// // // //           username: user.username,
// // // //           email: user.email,
// // // //           rating: user.pr?.pvp?.medium || user.pr?.pvp?.easy || 1000,
// // // //           diff: user.preferences?.defaultDifficulty || 'easy',
// // // //           timer: user.preferences?.defaultTimer || 60,
// // // //           symbol: user.preferences?.defaultSymbol || ['sum', 'difference'],
// // // //         });

// // // //         // Mark that we have successfully attempted registration at least once
// // // //         hasRegisteredRef.current = true;
// // // //         console.log('✅ Auto-registration emitted to server');
// // // //       } catch (err) {
// // // //         console.error('❌ Auto-registration failed:', err);
// // // //       }
// // // //     };

// // // //     // Core connection lifecycle handlers
// // // //     const handleConnect = () => {
// // // //       console.log('🟢 Socket connected successfully');
// // // //       clearTimeout(connectionTimeoutRef.current);
// // // //       reconnectionAttemptsRef.current = 0;
// // // //       setConnectionState('connected');

// // // //       // Always (re)register the player when we get a connection.
// // // //       // This makes sure that after any reconnect the backend knows
// // // //       // the current player is online and in the pool.
// // // //       autoRegisterPlayer();

// // // //       // ✅ Process any queued registration events
// // // //       if (registrationQueue.length > 0) {
// // // //         console.log(
// // // //           `📤 Processing ${registrationQueue.length} queued registration events`,
// // // //         );
// // // //         registrationQueue.forEach(({ event, data }) => {
// // // //           socketRef.current.emit(event, data);
// // // //         });
// // // //         setRegistrationQueue([]);
// // // //       }
// // // //     };

// // // //     const handleDisconnect = reason => {
// // // //       console.log('🔴 Socket disconnected:', reason);
// // // //       setConnectionState('disconnected');
// // // //     };

// // // //     const handleConnectError = error => {
// // // //       console.error('❌ Socket connection error:', error);
// // // //       setConnectionState('error');
// // // //     };

// // // //     const handleReconnectAttempt = () => {
// // // //       reconnectionAttemptsRef.current += 1;
// // // //       console.log(
// // // //         `🔄 Reconnection attempt ${reconnectionAttemptsRef.current}/${MAX_RECONNECTION_ATTEMPTS}`,
// // // //       );
// // // //     };

// // // //     const handleReconnectFailed = () => {
// // // //       console.error('❌ Reconnection failed after max attempts');
// // // //       setConnectionState('error');
// // // //     };

// // // //     // Connection timeout guard – if the initial attempt takes too long,
// // // //     // force a new connect call so we don't stay stuck forever.
// // // //     connectionTimeoutRef.current = setTimeout(() => {
// // // //       if (socketRef.current && !socketRef.current.connected) {
// // // //         console.warn('⚠️ Connection timeout - forcing reconnection');
// // // //         setConnectionState('error');
// // // //         socketRef.current.connect();
// // // //       }
// // // //     }, CONNECTION_TIMEOUT);

// // // //     socketRef.current.on('connect', handleConnect);
// // // //     socketRef.current.on('disconnect', handleDisconnect);
// // // //     socketRef.current.on('connect_error', handleConnectError);
// // // //     socketRef.current.on('reconnect_attempt', handleReconnectAttempt);
// // // //     socketRef.current.on('reconnect_failed', handleReconnectFailed);

// // // //     // ✅ CHALLENGE LISTENERS
// // // //     // socketRef.current.on('challenge-received', (data) => {
// // // //     //   // Managed in Home.js
// // // //     // });

// // // //   }

// // // //   useEffect(() => {
// // // //     // Listen to AppState so we can reconnect as soon as the app
// // // //     // returns to the foreground or the device is unlocked.
// // // //     const handleAppStateChange = nextState => {
// // // //       const prevState = appStateRef.current;
// // // //       appStateRef.current = nextState;

// // // //       const wentToForeground =
// // // //         prevState.match(/inactive|background/) && nextState === 'active';

// // // //       if (wentToForeground && socketRef.current) {
// // // //         // If the socket is not connected when app becomes active,
// // // //         // trigger a fast reconnect.
// // // //         if (!socketRef.current.connected) {
// // // //           console.log('📱 App active - ensuring socket connection');
// // // //           socketRef.current.connect();
// // // //         }
// // // //       }
// // // //     };

// // // //     const subscription = AppState.addEventListener(
// // // //       'change',
// // // //       handleAppStateChange,
// // // //     );

// // // //     // Cleanup listener when provider unmounts
// // // //     return () => {
// // // //       subscription.remove();
// // // //     };
// // // //   }, []);

// // // //   useEffect(() => {
// // // //     // Global cleanup on unmount to avoid memory leaks and zombie listeners.
// // // //     return () => {
// // // //       clearTimeout(connectionTimeoutRef.current);
// // // //       if (socketRef.current) {
// // // //         socketRef.current.removeAllListeners();
// // // //         socketRef.current.disconnect();
// // // //       }
// // // //     };
// // // //   }, []);

// // // //   return (
// // // //     <SocketContext.Provider value={socketRef.current}>
// // // //       <SocketStateContext.Provider
// // // //         value={{ connectionState, registrationQueue, setRegistrationQueue }}>
// // // //         {children}
// // // //       </SocketStateContext.Provider>
// // // //     </SocketContext.Provider>
// // // //   );
// // // // };

// // // // export const useSocket = () => {
// // // //   const socket = useContext(SocketContext);
// // // //   if (!socket) {
// // // //     throw new Error('useSocket must be used within a <SocketProvider>');
// // // //   }
// // // //   return socket;
// // // // };

// // // // export const useSocketState = () => {
// // // //   const state = useContext(SocketStateContext);
// // // //   if (!state) {
// // // //     throw new Error('useSocketState must be used within a <Socket>');
// // // //   }
// // // //   return state;
// // // // };

// // // // // ✅ HELPER HOOK: Wait for socket connection before emitting
// // // // export const useWaitForSocketConnection = () => {
// // // //   const socket = useSocket();
// // // //   const { connectionState } = useSocketState();

// // // //   return {
// // // //     isConnected: connectionState === 'connected' && socket.connected,
// // // //     connectionState,
// // // //     // ✅ Safe emit with automatic queueing
// // // //     safeEmit: (event, data) => {
// // // //       if (socket.connected) {
// // // //         socket.emit(event, data);
// // // //         return true;
// // // //       } else {
// // // //         console.warn(`⚠️ Socket not connected, queueing event: ${event}`);
// // // //         return false;
// // // //       }
// // // //     },
// // // //     // ✅ Wait for connection promise
// // // //     waitForConnection: () => {
// // // //       return new Promise(resolve => {
// // // //         if (socket.connected) {
// // // //           resolve();
// // // //         } else {
// // // //           const checkConnection = () => {
// // // //             if (socket.connected) {
// // // //               socket.off('connect', checkConnection);
// // // //               resolve();
// // // //             }
// // // //           };
// // // //           socket.on('connect', checkConnection);
// // // //           // Timeout after 30 seconds
// // // //           setTimeout(() => {
// // // //             socket.off('connect', checkConnection);
// // // //             resolve();
// // // //           }, 30000);
// // // //         }
// // // //       });
// // // //     },
// // // //   };
// // // // };


// // // // src/context/SocketContext.js
// // // // import React, {
// // // //   createContext,
// // // //   useContext,
// // // //   useRef,
// // // //   useState,
// // // //   useEffect,
// // // //   useMemo,
// // // // } from 'react';
// // // // import { AppState } from 'react-native';
// // // // import { io } from 'socket.io-client';
// // // // import AsyncStorage from '@react-native-async-storage/async-storage';

// // // // const SOCKET_URL = 'http://13.203.232.239:3000/';
// // // // const CONNECTION_TIMEOUT = 15000;
// // // // const MAX_RECONNECTION_ATTEMPTS = Infinity;

// // // // const SocketContext = createContext(null);
// // // // const SocketStateContext = createContext(null);

// // // // export const Socket = ({ children }) => {
// // // //   const socketRef = useRef(null);

// // // //   const [connectionState, setConnectionState] = useState('connecting');
// // // //   const [isRegistered, setIsRegistered] = useState(false);

// // // //   const reconnectionAttemptsRef = useRef(0);
// // // //   const connectionTimeoutRef = useRef(null);
// // // //   const appStateRef = useRef(AppState.currentState);

// // // //   /* ==========================================
// // // //      CREATE SOCKET INSTANCE ONLY ONCE
// // // //   ========================================== */
// // // //   if (!socketRef.current) {
// // // //     socketRef.current = io(SOCKET_URL, {
// // // //       transports: ['websocket'],
// // // //       autoConnect: true,
// // // //       reconnection: true,
// // // //       reconnectionAttempts: MAX_RECONNECTION_ATTEMPTS,
// // // //       reconnectionDelay: 1000,
// // // //       reconnectionDelayMax: 5000,
// // // //       timeout: CONNECTION_TIMEOUT,
// // // //     });

// // // //     const socket = socketRef.current;

// // // //     /* ==========================================
// // // //        REGISTER PLAYER
// // // //     ========================================== */
// // // //     const autoRegisterPlayer = async (retryCount = 0) => {
// // // //       try {
// // // //         const userData = await AsyncStorage.getItem('userData');

// // // //         if (!userData) {
// // // //           if (retryCount < 5) {
// // // //             console.warn(`⚠️ No user data yet, retrying in ${(retryCount + 1) * 500}ms...`);
// // // //             setTimeout(() => autoRegisterPlayer(retryCount + 1), (retryCount + 1) * 500);
// // // //           } else {
// // // //             console.warn('⚠️ No user data found after retries');
// // // //           }
// // // //           return;
// // // //         }

// // // //         const user = JSON.parse(userData);
// // // //         console.log('📤 Registering player:', user.username);

// // // //         socket.emit(
// // // //           'register-player',
// // // //           {
// // // //             userId: user._id || user.id,
// // // //             username: user.username,
// // // //             email: user.email,
// // // //             rating: user.pr?.pvp?.medium || user.pr?.pvp?.easy || 1000,
// // // //             diff: user.preferences?.defaultDifficulty || 'easy',
// // // //             timer: user.preferences?.defaultTimer || 60,
// // // //             symbol: user.preferences?.defaultSymbol || ['sum', 'difference'],
// // // //           },
// // // //           ack => {
// // // //             if (ack?.success) {
// // // //               console.log('✅ Player registered successfully');
// // // //               setIsRegistered(true);
// // // //             } else {
// // // //               console.warn('⚠️ Player registration failed:', ack);
// // // //               if (retryCount < 3) {
// // // //                 setTimeout(() => autoRegisterPlayer(retryCount + 1), 1000);
// // // //               }
// // // //             }
// // // //           },
// // // //         );
// // // //       } catch (err) {
// // // //         console.error('❌ Registration error:', err);
// // // //       }
// // // //     };

// // // //     /* ==========================================
// // // //        CONNECTION EVENTS
// // // //     ========================================== */
// // // //     socket.on('connect', () => {
// // // //       console.log('🟢 Socket connected:', socket.id);
// // // //       setConnectionState('connected');
// // // //       reconnectionAttemptsRef.current = 0;
// // // //       autoRegisterPlayer();
// // // //     });

// // // //     socket.on('disconnect', reason => {
// // // //       console.log('🔴 Socket disconnected:', reason);
// // // //       setConnectionState('disconnected');
// // // //       setIsRegistered(false);
// // // //     });

// // // //     socket.on('connect_error', error => {
// // // //       console.error('❌ Connection error:', error.message);
// // // //       setConnectionState('error');
// // // //     });

// // // //     socket.on('reconnect_attempt', () => {
// // // //       reconnectionAttemptsRef.current += 1;
// // // //       console.log(`🔄 Reconnect attempt ${reconnectionAttemptsRef.current}`);
// // // //     });

// // // //     socket.on('reconnect', () => {
// // // //       console.log('🔁 Reconnected to server');
// // // //       autoRegisterPlayer();
// // // //     });

// // // //     /* ==========================================
// // // //        SAFETY TIMEOUT
// // // //     ========================================== */
// // // //     connectionTimeoutRef.current = setTimeout(() => {
// // // //       if (!socket.connected) {
// // // //         console.warn('⚠️ Socket connection timeout - retrying...');
// // // //         socket.connect();
// // // //       }
// // // //     }, CONNECTION_TIMEOUT);
// // // //   }

// // // //   /* ==========================================
// // // //      APP FOREGROUND / BACKGROUND HANDLING
// // // //   ========================================== */
// // // //   useEffect(() => {
// // // //     const handleAppStateChange = nextState => {
// // // //       const prevState = appStateRef.current;
// // // //       appStateRef.current = nextState;

// // // //       const cameToForeground =
// // // //         prevState.match(/inactive|background/) &&
// // // //         nextState === 'active';

// // // //       if (cameToForeground) {
// // // //         console.log('📱 App active - ensuring socket connection');
// // // //         if (!socketRef.current.connected) {
// // // //           socketRef.current.connect();
// // // //         }
// // // //       }
// // // //     };

// // // //     const subscription = AppState.addEventListener('change', handleAppStateChange);
// // // //     return () => subscription.remove();
// // // //   }, []);

// // // //   /* ==========================================
// // // //      GLOBAL CLEANUP
// // // //   ========================================== */
// // // //   useEffect(() => {
// // // //     return () => {
// // // //       clearTimeout(connectionTimeoutRef.current);
// // // //       if (socketRef.current) {
// // // //         socketRef.current.removeAllListeners();
// // // //         socketRef.current.disconnect();
// // // //       }
// // // //     };
// // // //   }, []);

// // // //   /* ==========================================
// // // //      ✅ KEY FIX: Memoize socket so its reference NEVER changes
// // // //      even when connectionState / isRegistered state updates
// // // //      cause Socket component to re-render.

// // // //      Without this: socketRef.current is re-evaluated each render
// // // //      → new object reference → useSocket() returns "new" socket
// // // //      → Effect 4 in Lobby re-runs → listeners torn down
// // // //      → registration lost → "Player not registered" error
// // // //   ========================================== */
// // // //   const stableSocket = useMemo(() => socketRef.current, []);

// // // //   /* ==========================================
// // // //      PROVIDERS
// // // //   ========================================== */
// // // //   return (
// // // //     <SocketContext.Provider value={stableSocket}>
// // // //       <SocketStateContext.Provider value={{ connectionState, isRegistered }}>
// // // //         {children}
// // // //       </SocketStateContext.Provider>
// // // //     </SocketContext.Provider>
// // // //   );
// // // // };

// // // // /* ==========================================
// // // //    HOOKS
// // // // ========================================== */
// // // // export const useSocket = () => {
// // // //   const socket = useContext(SocketContext);
// // // //   if (!socket) {
// // // //     throw new Error('useSocket must be used inside <Socket>');
// // // //   }
// // // //   return socket;
// // // // };

// // // // export const useSocketState = () => {
// // // //   const state = useContext(SocketStateContext);
// // // //   if (!state) {
// // // //     throw new Error('useSocketState must be used inside <Socket>');
// // // //   }
// // // //   return state;
// // // // };


// // // import React, {
// // //   createContext,
// // //   useContext,
// // //   useRef,
// // //   useState,
// // //   useEffect,
// // //   useMemo,
// // // } from 'react';
// // // import { AppState } from 'react-native';
// // // import { io } from 'socket.io-client';
// // // import AsyncStorage from '@react-native-async-storage/async-storage';

// // // const SOCKET_URL = 'http://13.203.232.239:3000/';
// // // const CONNECTION_TIMEOUT = 15000;

// // // const SocketContext = createContext(null);
// // // const SocketStateContext = createContext(null);

// // // export const Socket = ({ children }) => {
// // //   const socketRef = useRef(null);

// // //   const [connectionState, setConnectionState] = useState('connecting');
// // //   const [isRegistered, setIsRegistered] = useState(false);

// // //   const appStateRef = useRef(AppState.currentState);

// // //   /* ==========================================
// // //      CREATE SOCKET INSTANCE ONCE
// // //   ========================================== */

// // //   if (!socketRef.current) {
// // //     socketRef.current = io(SOCKET_URL, {
// // //       transports: ['websocket'],
// // //       autoConnect: true,
// // //       reconnection: true,
// // //       reconnectionDelay: 1000,
// // //       reconnectionDelayMax: 5000,
// // //       timeout: CONNECTION_TIMEOUT,
// // //     });

// // //     const socket = socketRef.current;

// // //     /* ==========================================
// // //        REGISTER PLAYER FUNCTION
// // //     ========================================== */

// // //     const registerPlayer = async () => {
// // //       try {
// // //         const userData = await AsyncStorage.getItem('userData');

// // //         if (!userData) {
// // //           console.log('⏳ No user data yet, waiting for login...');
// // //           return;
// // //         }

// // //         const user = JSON.parse(userData);

// // //         console.log('📤 Registering player:', user.username);

// // //         socket.emit(
// // //           'register-player',
// // //           {
// // //             userId: user._id || user.id,
// // //             username: user.username,
// // //             email: user.email,
// // //             rating: user?.pr?.pvp?.medium || 1000,
// // //             diff: user.preferences?.defaultDifficulty || 'easy',
// // //             timer: user.preferences?.defaultTimer || 60,
// // //             symbol: user.preferences?.defaultSymbol || ['sum', 'difference'],
// // //           },
// // //           ack => {
// // //             if (ack?.success) {
// // //               console.log('✅ Player registered successfully');
// // //               setIsRegistered(true);
// // //             } else {
// // //               console.log('⚠️ Registration failed:', ack);
// // //             }
// // //           },
// // //         );
// // //       } catch (error) {
// // //         console.log('❌ Register player error:', error);
// // //       }
// // //     };

// // //     /* ==========================================
// // //        CONNECTION EVENTS
// // //     ========================================== */

// // //     socket.on('connect', async () => {
// // //       console.log('🟢 Socket connected:', socket.id);
// // //       setConnectionState('connected');
// // //       setIsRegistered(false); // 🔥 ADD THIS LINE

// // //       const userData = await AsyncStorage.getItem('userData');

// // //       if (userData) {
// // //         registerPlayer();
// // //       } else {
// // //         console.log('⏳ Waiting for login to register player');
// // //       }
// // //     });

// // //     socket.on('disconnect', reason => {
// // //       console.log('🔴 Socket disconnected:', reason);
// // //       setConnectionState('disconnected');
// // //       setIsRegistered(false);
// // //     });

// // //     socket.on('connect_error', error => {
// // //       console.log('❌ Socket error:', error.message);
// // //       setConnectionState('error');
// // //     });

// // //     socket.on('reconnect', () => {
// // //       console.log('🔁 Reconnected to server');
// // //       registerPlayer();
// // //     });

// // //     socket.on('player-registered', () => {
// // //       console.log('🎉 Server confirmed registration');
// // //       setIsRegistered(true);
// // //     });
// // //   }

// // //   /* ==========================================
// // //      APP FOREGROUND HANDLING
// // //   ========================================== */

// // //   useEffect(() => {
// // //     const handleAppStateChange = nextState => {
// // //       const prevState = appStateRef.current;
// // //       appStateRef.current = nextState;

// // //       const cameToForeground =
// // //         prevState.match(/inactive|background/) &&
// // //         nextState === 'active';

// // //       if (cameToForeground) {
// // //         console.log('📱 App foreground');

// // //         if (!socketRef.current.connected) {
// // //           socketRef.current.connect();
// // //         }
// // //       }
// // //     };

// // //     const sub = AppState.addEventListener('change', handleAppStateChange);

// // //     return () => sub.remove();
// // //   }, []);

// // //   /* ==========================================
// // //      CLEANUP
// // //   ========================================== */

// // //   useEffect(() => {
// // //     return () => {
// // //       if (socketRef.current) {
// // //         socketRef.current.removeAllListeners();
// // //         socketRef.current.disconnect();
// // //       }
// // //     };
// // //   }, []);

// // //   /* ==========================================
// // //      STABLE SOCKET
// // //   ========================================== */

// // //   const stableSocket = useMemo(() => socketRef.current, []);

// // //   return (
// // //     <SocketContext.Provider value={stableSocket}>
// // //       <SocketStateContext.Provider
// // //         value={{ connectionState, isRegistered }}>
// // //         {children}
// // //       </SocketStateContext.Provider>
// // //     </SocketContext.Provider>
// // //   );
// // // };

// // // /* ==========================================
// // //    HOOKS
// // // ========================================== */

// // // export const useSocket = () => {
// // //   const socket = useContext(SocketContext);

// // //   if (!socket) {
// // //     throw new Error('useSocket must be used inside <Socket>');
// // //   }

// // //   return socket;
// // // };

// // // export const useSocketState = () => {
// // //   const state = useContext(SocketStateContext);

// // //   if (!state) {
// // //     throw new Error('useSocketState must be used inside <Socket>');
// // //   }

// // //   return state;
// // // };


// // import React, {
// //   createContext,
// //   useContext,
// //   useRef,
// //   useState,
// //   useEffect,
// //   useMemo,
// // } from 'react';
// // import { AppState } from 'react-native';
// // import { io } from 'socket.io-client';
// // import axios from 'axios';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import { forceLogout } from '../api/axiosInstance';

// // const SOCKET_URL = 'http://13.203.232.239:3000/';
// // const BASE_URL = 'http://13.203.232.239:3000';
// // const CONNECTION_TIMEOUT = 15000;

// // const SocketContext = createContext(null);
// // const SocketStateContext = createContext(null);

// // export const Socket = ({ children }) => {
// //   const socketRef = useRef(null);

// //   const [connectionState, setConnectionState] = useState('connecting');
// //   const [isRegistered, setIsRegistered] = useState(false);

// //   const appStateRef = useRef(AppState.currentState);

// //   /* ==========================================
// //      CREATE SOCKET INSTANCE ONCE
// //   ========================================== */

// //   if (!socketRef.current) {
// //     socketRef.current = io(SOCKET_URL, {
// //       transports: ['websocket'],
// //       autoConnect: true,
// //       reconnection: true,
// //       reconnectionDelay: 1000,
// //       reconnectionDelayMax: 5000,
// //       timeout: CONNECTION_TIMEOUT,
// //     });

// //     const socket = socketRef.current;

// //     /* ==========================================
// //        REGISTER PLAYER FUNCTION
// //     ========================================== */

// //     const registerPlayer = async () => {
// //       try {
// //         const userData = await AsyncStorage.getItem('userData');

// //         if (!userData) {
// //           console.log('⏳ No user data yet, waiting for login...');
// //           return;
// //         }

// //         const user = JSON.parse(userData);

// //         console.log('📤 Registering player:', user.username);

// //         socket.emit(
// //           'register-player',
// //           {
// //             userId: user._id || user.id,
// //             username: user.username,
// //             email: user.email,
// //             rating: user?.pr?.pvp?.medium || 1000,
// //             diff: user.preferences?.defaultDifficulty || 'easy',
// //             timer: user.preferences?.defaultTimer || 60,
// //             symbol: user.preferences?.defaultSymbol || ['sum', 'difference'],
// //           },
// //           ack => {
// //             if (ack?.success) {
// //               console.log('✅ Player registered successfully');
// //               setIsRegistered(true);
// //             } else {
// //               console.log('⚠️ Registration failed:', ack);
// //             }
// //           },
// //         );
// //       } catch (error) {
// //         console.log('❌ Register player error:', error);
// //       }
// //     };

// //     /* ==========================================
// //        AUTHENTICATE SOCKET (w/ refresh on expiry)
// //        Same pattern as ComputerGameSocket.js — plain
// //        axios refresh call, NOT the http-interceptor
// //        trick (that one only fires if a parallel REST
// //        call also 401s, which isn't guaranteed).
// //     ========================================== */

// //     const authenticateSocket = (token) => {
// //       return new Promise((resolve, reject) => {
// //         socket.emit('authenticate', token, async (response) => {
// //           if (response?.success) {
// //             resolve();
// //             return;
// //           }

// //           if (response?.code === 'TOKEN_EXPIRED') {
// //             try {
// //               const refreshToken = await AsyncStorage.getItem('refreshToken');

// //               if (!refreshToken) {
// //                 reject(new Error('NO_REFRESH_TOKEN'));
// //                 return;
// //               }

// //               const res = await axios.post(`${BASE_URL}/api/auth/refresh-token`, {
// //                 refreshToken,
// //               }
          
// //             );

// //               const { accessToken: newAccess, refreshToken: newRefresh } = res.data;

// //               await AsyncStorage.setItem('accessToken', newAccess);
// //               await AsyncStorage.setItem('refreshToken', newRefresh);

// //               socket.emit('authenticate', newAccess, (retry) => {
// //                 if (retry?.success) {
// //                   resolve();
// //                 } else {
// //                   reject(new Error('AUTH_FAILED_AFTER_REFRESH'));
// //                 }
// //               });
// //             } catch (err) {
// //               reject(err);
// //             }
// //           } else {
// //             reject(new Error(response?.error || 'AUTH_FAILED'));
// //           }
// //         });
// //       });
// //     };

// //     /* ==========================================
// //        CONNECTION EVENTS
// //     ========================================== */

// //     socket.on('connect', async () => {
// //       console.log('🟢 Socket connected:', socket.id);
// //       setConnectionState('connected');
// //       setIsRegistered(false);

// //       const userData = await AsyncStorage.getItem('userData');
// //       const token = await AsyncStorage.getItem('accessToken');

// //       if (!userData || !token) {
// //         console.log('⏳ Waiting for login to register player');
// //         return;
// //       }

// //       try {
// //         await authenticateSocket(token);
// //         registerPlayer();
// //       } catch (err) {
// //         console.log('❌ Socket auth failed:', err.message);
// //         // refresh token dead/invalid — kick to login same as REST side
// //         await forceLogout();
// //       }
// //     });

// //     socket.on('disconnect', reason => {
// //       console.log('🔴 Socket disconnected:', reason);
// //       setConnectionState('disconnected');
// //       setIsRegistered(false);
// //     });

// //     socket.on('connect_error', error => {
// //       console.log('❌ Socket error:', error.message);
// //       setConnectionState('error');
// //     });

// //     socket.on('reconnect', () => {
// //       console.log('🔁 Reconnected to server');
// //       // re-auth happens in 'connect' handler above (fires on every reconnect too)
// //     });

// //     socket.on('player-registered', () => {
// //       console.log('🎉 Server confirmed registration');
// //       setIsRegistered(true);
// //     });
// //   }

// //   /* ==========================================
// //      APP FOREGROUND HANDLING
// //   ========================================== */

// //   useEffect(() => {
// //     const handleAppStateChange = nextState => {
// //       const prevState = appStateRef.current;
// //       appStateRef.current = nextState;

// //       const cameToForeground =
// //         prevState.match(/inactive|background/) &&
// //         nextState === 'active';

// //       if (cameToForeground) {
// //         console.log('📱 App foreground');

// //         if (!socketRef.current.connected) {
// //           socketRef.current.connect();
// //         }
// //       }
// //     };

// //     const sub = AppState.addEventListener('change', handleAppStateChange);

// //     return () => sub.remove();
// //   }, []);

// //   /* ==========================================
// //      CLEANUP
// //   ========================================== */

// //   useEffect(() => {
// //     return () => {
// //       if (socketRef.current) {
// //         socketRef.current.removeAllListeners();
// //         socketRef.current.disconnect();
// //       }
// //     };
// //   }, []);

// //   /* ==========================================
// //      STABLE SOCKET
// //   ========================================== */

// //   const stableSocket = useMemo(() => socketRef.current, []);

// //   return (
// //     <SocketContext.Provider value={stableSocket}>
// //       <SocketStateContext.Provider
// //         value={{ connectionState, isRegistered }}>
// //         {children}
// //       </SocketStateContext.Provider>
// //     </SocketContext.Provider>
// //   );
// // };

// // /* ==========================================
// //    HOOKS
// // ========================================== */

// // export const useSocket = () => {
// //   const socket = useContext(SocketContext);

// //   if (!socket) {
// //     throw new Error('useSocket must be used inside <Socket>');
// //   }

// //   return socket;
// // };

// // export const useSocketState = () => {
// //   const state = useContext(SocketStateContext);

// //   if (!state) {
// //     throw new Error('useSocketState must be used inside <Socket>');
// //   }

// //   return state;
// // };


// import React, {
//   createContext,
//   useContext,
//   useRef,
//   useState,
//   useEffect,
//   useMemo,
// } from 'react';
// import { AppState } from 'react-native';
// import { io } from 'socket.io-client';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { forceLogout } from '../api/axiosInstance';

// const SOCKET_URL = 'http://13.203.232.239:3000/';
// const BASE_URL = 'http://13.203.232.239:3000';
// const CONNECTION_TIMEOUT = 15000;

// const SocketContext = createContext(null);
// const SocketStateContext = createContext(null);

// export const Socket = ({ children }) => {
//   const socketRef = useRef(null);

//   const [connectionState, setConnectionState] = useState('connecting');
//   const [isRegistered, setIsRegistered] = useState(false);

//   const appStateRef = useRef(AppState.currentState);

//   /* ==========================================
//      CREATE SOCKET INSTANCE ONCE
//   ========================================== */

//   if (!socketRef.current) {
//     console.log('[SOCKET] 🚀 Creating socket instance for first time');
//     console.log('[SOCKET] SOCKET_URL:', SOCKET_URL);
    
//     socketRef.current = io(SOCKET_URL, {
//       transports: ['websocket'],
//       autoConnect: true,
//       reconnection: true,
//       reconnectionDelay: 1000,
//       reconnectionDelayMax: 5000,
//       timeout: CONNECTION_TIMEOUT,
//     });

//     console.log('[SOCKET] ✅ Socket instance created');
//     const socket = socketRef.current;

//     /* ==========================================
//        REGISTER PLAYER FUNCTION
//     ========================================== */

//     const registerPlayer = async () => {
//       console.log('[SOCKET] 📤 registerPlayer() called');
//       try {
//         const userData = await AsyncStorage.getItem('userData');

//         if (!userData) {
//           console.log('[SOCKET] ⏳ No user data in AsyncStorage yet, waiting for login...');
//           return;
//         }

//         const user = JSON.parse(userData);
//         console.log('[SOCKET] ✅ User data retrieved:', {
//           userId: user._id || user.id,
//           username: user.username,
//           rating: user?.pr?.pvp?.medium || 1000,
//         });

//         console.log('[SOCKET] 📤 Emitting register-player event...');
//         const payload = {
//           userId: user._id || user.id,
//           username: user.username,
//           email: user.email,
//           rating: user?.pr?.pvp?.medium || 1000,
//           diff: user.preferences?.defaultDifficulty || 'easy',
//           timer: user.preferences?.defaultTimer || 60,
//           symbol: user.preferences?.defaultSymbol || ['sum', 'difference'],
//         };
//         console.log('[SOCKET] Payload:', payload);
        
//         socket.emit('register-player', payload);
//         console.log('[SOCKET] ✅ register-player emitted, waiting for player-registered event...');
//         // isRegistered is set by the 'player-registered' listener below
//       } catch (error) {
//         console.log('[SOCKET] ❌ Register player error:', error.message);
//       }
//     };

//     /* ==========================================
//        CONNECTION EVENTS
//     ========================================== */

//     socket.on('connect', async () => {
//       console.log('[SOCKET] 🟢 Socket connected successfully');
//       console.log('[SOCKET] Socket ID:', socket.id);
//       console.log('[SOCKET] Socket connected state:', socket.connected);
      
//       setConnectionState('connected');
//       console.log('[SOCKET] ✅ connectionState set to: connected');
      
//       setIsRegistered(false);
//       console.log('[SOCKET] 🔄 isRegistered reset to: false (awaiting player-registered event)');

//       const userData = await AsyncStorage.getItem('userData');
//       console.log('[SOCKET] userData from AsyncStorage:', userData ? 'EXISTS' : 'NOT_FOUND');

//       if (!userData) {
//         console.log('[SOCKET] ⏳ No user data found. Waiting for login to register player.');
//         return;
//       }

//       console.log('[SOCKET] 📞 Calling registerPlayer() from connect handler...');
//       registerPlayer();
//     });

//     socket.on('disconnect', reason => {
//       console.log('[SOCKET] 🔴 Socket disconnected');
//       console.log('[SOCKET] Disconnect reason:', reason);
//       setConnectionState('disconnected');
//       setIsRegistered(false);
//       console.log('[SOCKET] ✅ connectionState set to: disconnected');
//       console.log('[SOCKET] ✅ isRegistered set to: false');
//     });

//     socket.on('connect_error', error => {
//       console.log('[SOCKET] ❌ Socket connection error:', error.message);
//       console.log('[SOCKET] Error details:', error);
//       setConnectionState('error');
//       console.log('[SOCKET] ✅ connectionState set to: error');
//     });

//     socket.on('reconnect', () => {
//       console.log('[SOCKET] 🔁 Reconnected to server');
//       console.log('[SOCKET] Reconnect event fired - connect handler will re-auth');
//     });

//     socket.on('player-registered', (data) => {
//       console.log('[SOCKET] 🎉 Server confirmed registration');
//       console.log('[SOCKET] Player-registered data received:', data);
//       setIsRegistered(true);
//       console.log('[SOCKET] ✅ isRegistered set to: TRUE');
//     });

//     // Socket error handler for any emitted errors
//     socket.on('error', (error) => {
//       console.log('[SOCKET] ⚠️ Socket error event:', error);
//     });

//     // Exposed so screens (Login/SignUp) can trigger registration right
//     // after login, in case the socket connected before login finished.
//     socketRef.current.registerNow = () => {
//       console.log('[SOCKET] 🔄 registerNow() called from Login/SignUp');
//       return new Promise((resolve) => {
//         if (!socket.connected) {
//           console.log('[SOCKET] Socket not connected, attempting to connect...');
//           socket.connect();
//           resolve();
//           return;
//         }
//         console.log('[SOCKET] Socket connected, disconnecting and reconnecting...');
//         socket.once('disconnect', () => {
//           console.log('[SOCKET] Disconnected, reconnecting...');
//           socket.connect();
//           resolve();
//         });
//         socket.disconnect();
//       });
//     };
//   }

//   /* ==========================================
//      APP FOREGROUND HANDLING
//   ========================================== */

//   useEffect(() => {
//     const handleAppStateChange = nextState => {
//       const prevState = appStateRef.current;
//       appStateRef.current = nextState;

//       const cameToForeground =
//         prevState.match(/inactive|background/) &&
//         nextState === 'active';

//       if (cameToForeground) {
//         console.log('📱 App foreground');

//         if (!socketRef.current.connected) {
//           socketRef.current.connect();
//         }
//       }
//     };

//     const sub = AppState.addEventListener('change', handleAppStateChange);

//     return () => sub.remove();
//   }, []);

//   /* ==========================================
//      CLEANUP
//   ========================================== */

//   useEffect(() => {
//     return () => {
//       if (socketRef.current) {
//         socketRef.current.removeAllListeners();
//         socketRef.current.disconnect();
//       }
//     };
//   }, []);

//   /* ==========================================
//      STABLE SOCKET
//   ========================================== */

//   const stableSocket = useMemo(() => socketRef.current, []);

//   return (
//     <SocketContext.Provider value={stableSocket}>
//       <SocketStateContext.Provider
//         value={{ connectionState, isRegistered }}>
//         {children}
//       </SocketStateContext.Provider>
//     </SocketContext.Provider>
//   );
// };

// /* ==========================================
//    HOOKS
// ========================================== */

// export const useSocket = () => {
//   const socket = useContext(SocketContext);

//   if (!socket) {
//     throw new Error('useSocket must be used inside <Socket>');
//   }

//   return socket;
// };

// export const useSocketState = () => {
//   const state = useContext(SocketStateContext);

//   if (!state) {
//     throw new Error('useSocketState must be used inside <Socket>');
//   }

//   return state;
// };


import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useMemo,
} from 'react';
import { AppState } from 'react-native';
import { io } from 'socket.io-client';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { forceLogout } from '../api/axiosInstance';

const SOCKET_URL = 'http://13.203.232.239:3000/';
const BASE_URL = 'http://13.203.232.239:3000';
const CONNECTION_TIMEOUT = 15000;

const SocketContext = createContext(null);
const SocketStateContext = createContext(null);

export const Socket = ({ children }) => {
  const socketRef = useRef(null);

  const [connectionState, setConnectionState] = useState('connecting');
  const [isRegistered, setIsRegistered] = useState(false);

  const appStateRef = useRef(AppState.currentState);

  /* ==========================================
     CREATE SOCKET INSTANCE ONCE
  ========================================== */

  if (!socketRef.current) {
    console.log('[SOCKET] 🚀 Creating socket instance for first time');
    console.log('[SOCKET] SOCKET_URL:', SOCKET_URL);
    
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: CONNECTION_TIMEOUT,
    });

    console.log('[SOCKET] ✅ Socket instance created');
    const socket = socketRef.current;

    // ✅ Storage for rejoin-game data that arrives before Home mounts
    // Home.js reads this on mount and navigates if data exists
    socket._pendingRejoinData = null;

    /* ==========================================
       REGISTER PLAYER FUNCTION
    ========================================== */

    const registerPlayer = async () => {
      console.log('[SOCKET] 📤 registerPlayer() called');
      try {
        const userData = await AsyncStorage.getItem('userData');

        if (!userData) {
          console.log('[SOCKET] ⏳ No user data in AsyncStorage yet, waiting for login...');
          return;
        }

        const user = JSON.parse(userData);
        console.log('[SOCKET] ✅ User data retrieved:', {
          userId: user._id || user.id,
          username: user.username,
          rating: user?.pr?.pvp?.medium || 1000,
        });

        console.log('[SOCKET] 📤 Emitting register-player event...');
        const payload = {
          userId: user._id || user.id,
          username: user.username,
          email: user.email,
          rating: user?.pr?.pvp?.medium || 1000,
          diff: user.preferences?.defaultDifficulty || 'easy',
          timer: user.preferences?.defaultTimer || 60,
          symbol: user.preferences?.defaultSymbol || ['sum', 'difference'],
        };
        console.log('[SOCKET] Payload:', payload);
        
        socket.emit('register-player', payload);
        console.log('[SOCKET] ✅ register-player emitted, waiting for player-registered event...');
      } catch (error) {
        console.log('[SOCKET] ❌ Register player error:', error.message);
      }
    };

    /* ==========================================
       CONNECTION EVENTS
    ========================================== */

    socket.on('connect', async () => {
      console.log('[SOCKET] 🟢 Socket connected successfully');
      console.log('[SOCKET] Socket ID:', socket.id);
      console.log('[SOCKET] Socket connected state:', socket.connected);
      
      setConnectionState('connected');
      console.log('[SOCKET] ✅ connectionState set to: connected');
      
      setIsRegistered(false);
      console.log('[SOCKET] 🔄 isRegistered reset to: false (awaiting player-registered event)');

      const userData = await AsyncStorage.getItem('userData');
      console.log('[SOCKET] userData from AsyncStorage:', userData ? 'EXISTS' : 'NOT_FOUND');

      if (!userData) {
        console.log('[SOCKET] ⏳ No user data found. Waiting for login to register player.');
        return;
      }

      console.log('[SOCKET] 📞 Calling registerPlayer() from connect handler...');
      registerPlayer();
    });

    socket.on('disconnect', reason => {
      console.log('[SOCKET] 🔴 Socket disconnected');
      console.log('[SOCKET] Disconnect reason:', reason);
      setConnectionState('disconnected');
      setIsRegistered(false);
      console.log('[SOCKET] ✅ connectionState set to: disconnected');
      console.log('[SOCKET] ✅ isRegistered set to: false');
    });

    socket.on('connect_error', error => {
      console.log('[SOCKET] ❌ Socket connection error:', error.message);
      console.log('[SOCKET] Error details:', error);
      setConnectionState('error');
      console.log('[SOCKET] ✅ connectionState set to: error');
    });

    socket.on('reconnect', () => {
      console.log('[SOCKET] 🔁 Reconnected to server');
      console.log('[SOCKET] Reconnect event fired - connect handler will re-auth');
    });

    socket.on('player-registered', (data) => {
      console.log('[SOCKET] 🎉 Server confirmed registration');
      console.log('[SOCKET] Player-registered data received:', data);
      setIsRegistered(true);
      console.log('[SOCKET] ✅ isRegistered set to: TRUE');
    });

    // ✅ Store rejoin-game data at context level so Home.js can read it
    // even if rejoin-game fires before Home screen mounts (Splash → Home flow)
    socket.on('rejoin-game', (data) => {
      console.log('[SOCKET] 🔄 rejoin-game received at context level — storing as pending');
      socket._pendingRejoinData = data;
    });

    // Socket error handler for any emitted errors
    socket.on('error', (error) => {
      console.log('[SOCKET] ⚠️ Socket error event:', error);
    });

    // Exposed so screens (Login/SignUp) can trigger registration right
    // after login, in case the socket connected before login finished.
    socketRef.current.registerNow = () => {
      console.log('[SOCKET] 🔄 registerNow() called from Login/SignUp');
      return new Promise((resolve) => {
        if (!socket.connected) {
          console.log('[SOCKET] Socket not connected, attempting to connect...');
          socket.connect();
          resolve();
          return;
        }
        console.log('[SOCKET] Socket connected, disconnecting and reconnecting...');
        socket.once('disconnect', () => {
          console.log('[SOCKET] Disconnected, reconnecting...');
          socket.connect();
          resolve();
        });
        socket.disconnect();
      });
    };
  }

  /* ==========================================
     APP FOREGROUND HANDLING
  ========================================== */

  useEffect(() => {
    const handleAppStateChange = nextState => {
      const prevState = appStateRef.current;
      appStateRef.current = nextState;

      const cameToForeground =
        prevState.match(/inactive|background/) &&
        nextState === 'active';

      if (cameToForeground) {
        console.log('📱 App foreground');

        if (!socketRef.current.connected) {
          socketRef.current.connect();
        }
      }
    };

    const sub = AppState.addEventListener('change', handleAppStateChange);

    return () => sub.remove();
  }, []);

  /* ==========================================
     CLEANUP
  ========================================== */

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
      }
    };
  }, []);

  /* ==========================================
     STABLE SOCKET
  ========================================== */

  const stableSocket = useMemo(() => socketRef.current, []);

  return (
    <SocketContext.Provider value={stableSocket}>
      <SocketStateContext.Provider
        value={{ connectionState, isRegistered }}>
        {children}
      </SocketStateContext.Provider>
    </SocketContext.Provider>
  );
};

/* ==========================================
   HOOKS
========================================== */

export const useSocket = () => {
  const socket = useContext(SocketContext);

  if (!socket) {
    throw new Error('useSocket must be used inside <Socket>');
  }

  return socket;
};

export const useSocketState = () => {
  const state = useContext(SocketStateContext);

  if (!state) {
    throw new Error('useSocketState must be used inside <Socket>');
  }

  return state;
};
