


// // // // import React, {
// // // //   createContext,
// // // //   useCallback,
// // // //   useContext,
// // // //   useEffect,
// // // //   useRef,
// // // //   useState,
// // // // } from 'react';
// // // // import { io } from 'socket.io-client';
// // // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // // import { authFetch as fetch } from '../utils/authFetch'; // auto-refresh wrapper for expired access tokens

// // // // const BASE_URL = 'http://13.203.232.239:3000';
// // // // const BADGE_API  = `${BASE_URL}/api/badges`;

// // // // // ─── Context ──────────────────────────────────────────────────────────────────
// // // // const BadgeContext = createContext(null);

// // // // export const useBadge = () => useContext(BadgeContext);

// // // // // ─── Provider ─────────────────────────────────────────────────────────────────
// // // // export const BadgeProvider = ({ children }) => {
// // // //   // Badges to show in the <BadgePopup> (real-time + REST fallback)
// // // //   const [earnedBadges, setEarnedBadges] = useState([]);

// // // //   // Badges earned while offline — shown in the modal on Home
// // // //   const [offlineBadges, setOfflineBadges] = useState([]);

// // // //   // Socket instance (singleton)
// // // //   const socketRef = useRef(null);

// // // //   // Track badge IDs already shown EVER (persisted) so we never double-show,
// // // //   // even across logout/login or app reinstall-free restarts.
// // // //   const shownBadgeKeysRef = useRef(new Set());
// // // //   const shownKeysLoadedRef = useRef(false);
// // // //   const SHOWN_BADGES_STORAGE_KEY = 'shownBadgeKeys';

// // // //   // Snapshot of badge IDs at login time — used by diff check
// // // //   const snapshotIdsRef = useRef(new Set());

// // // //   // ─── Load persisted shown-keys once on mount ──────────────────────────────
// // // //   const loadShownKeys = useCallback(async () => {
// // // //     if (shownKeysLoadedRef.current) return;
// // // //     try {
// // // //       const raw = await AsyncStorage.getItem(SHOWN_BADGES_STORAGE_KEY);
// // // //       if (raw) {
// // // //         shownBadgeKeysRef.current = new Set(JSON.parse(raw));
// // // //       }
// // // //     } catch (err) {
// // // //       console.error('[BadgeContext] loadShownKeys error:', err);
// // // //     } finally {
// // // //       shownKeysLoadedRef.current = true;
// // // //     }
// // // //   }, []);

// // // //   const persistShownKeys = useCallback(() => {
// // // //     AsyncStorage.setItem(
// // // //       SHOWN_BADGES_STORAGE_KEY,
// // // //       JSON.stringify([...shownBadgeKeysRef.current]),
// // // //     ).catch((err) =>
// // // //       console.error('[BadgeContext] persistShownKeys error:', err),
// // // //     );
// // // //   }, []);

// // // //   // ─── Dedup helper ────────────────────────────────────────────────────────
// // // //   // key = `${badgeId}-${earnedAt}` so the same badge earned twice on different
// // // //   // days is still shown both times, but a socket + REST duplicate is suppressed.
// // // //   const makeKey = (badge) =>
// // // //     `${badge.badgeId ?? badge.id}-${badge.earnedAt ?? ''}`;

// // // //   const filterNew = useCallback((badges) => {
// // // //     const fresh = badges.filter((b) => {
// // // //       const k = makeKey(b);
// // // //       if (shownBadgeKeysRef.current.has(k)) return false;
// // // //       shownBadgeKeysRef.current.add(k);
// // // //       return true;
// // // //     });
// // // //     if (fresh.length > 0) persistShownKeys();
// // // //     return fresh;
// // // //   }, [persistShownKeys]);

// // // //   // ─── Load persisted dedup memory on app cold start ────────────────────────
// // // //   useEffect(() => {
// // // //     loadShownKeys();
// // // //   }, [loadShownKeys]);

// // // //   // ─── Add badges to the popup queue ───────────────────────────────────────
// // // //   const addEarnedBadges = useCallback(
// // // //     (badges) => {
// // // //       if (!badges || badges.length === 0) return;
// // // //       const fresh = filterNew(badges);
// // // //       if (fresh.length === 0) return;
// // // //       console.log('[BadgeContext] 🏅 New badges to show:', fresh.map((b) => b.title));
// // // //       setEarnedBadges((prev) => [...prev, ...fresh]);
// // // //     },
// // // //     [filterNew],
// // // //   );

// // // //   // ─── Snapshot current badge IDs (call before login API) ──────────────────
// // // //   const snapshotBadgeIds = useCallback(async () => {
// // // //     try {
// // // //       const token = await AsyncStorage.getItem('accessToken');
// // // //       if (!token) return;
// // // //       const res = await fetch(`${BADGE_API}/my/earned`, {
// // // //         headers: { Authorization: `Bearer ${token}` },
// // // //       });
// // // //       if (!res.ok) return;
// // // //       const data = await res.json();
// // // //       snapshotIdsRef.current = new Set(
// // // //         (data.badges || []).map((b) => b.badgeId),
// // // //       );
// // // //       console.log(
// // // //         '[BadgeContext] 📸 Snapshot taken:',
// // // //         snapshotIdsRef.current.size,
// // // //         'badges',
// // // //       );
// // // //     } catch (err) {
// // // //       console.error('[BadgeContext] snapshot error:', err);
// // // //     }
// // // //   }, []);

// // // //   // ─── Diff check: compare current earned vs snapshot (REST fallback) ───────
// // // //   const checkBadgesDiff = useCallback(async () => {
// // // //     try {
// // // //       const token = await AsyncStorage.getItem('accessToken');
// // // //       if (!token) return;
// // // //       const res = await fetch(`${BADGE_API}/my/earned`, {
// // // //         headers: { Authorization: `Bearer ${token}` },
// // // //       });
// // // //       if (!res.ok) return;
// // // //       const data = await res.json();
// // // //       const newBadges = (data.badges || []).filter(
// // // //         (b) => !snapshotIdsRef.current.has(b.badgeId),
// // // //       );
// // // //       if (newBadges.length > 0) {
// // // //         console.log('[BadgeContext] 🔍 Diff found new badges:', newBadges.length);
// // // //         addEarnedBadges(newBadges);
// // // //       }
// // // //     } catch (err) {
// // // //       console.error('[BadgeContext] diff check error:', err);
// // // //     }
// // // //   }, [addEarnedBadges]);

// // // //   // ─── Silent REST check: badges earned in the last 60 s ───────────────────
// // // //   // Called by Home on first focus as a safety net in case the socket event
// // // //   // fired before the frontend listener was attached.
// // // //   const checkSilentBadges = useCallback(async () => {
// // // //     try {
// // // //       const token = await AsyncStorage.getItem('accessToken');
// // // //       if (!token) return;

// // // //       // POST app-opened — this also awards streak / loyalty badges
// // // //       const appOpenRes = await fetch(`${BADGE_API}/event/app-opened`, {
// // // //         method: 'POST',
// // // //         headers: {
// // // //           'Content-Type': 'application/json',
// // // //           Authorization: `Bearer ${token}`,
// // // //         },
// // // //         body: JSON.stringify({}),
// // // //       });

// // // //       if (appOpenRes.ok) {
// // // //         const appOpenData = await appOpenRes.json();
// // // //         if (appOpenData.newlyEarned?.length > 0) {
// // // //           console.log(
// // // //             '[BadgeContext] 🎉 app-opened badges:',
// // // //             appOpenData.newlyEarned.length,
// // // //           );
// // // //           addEarnedBadges(appOpenData.newlyEarned);
// // // //         }
// // // //       }
// // // //     } catch (err) {
// // // //       console.error('[BadgeContext] silent badge check error:', err);
// // // //     }
// // // //   }, [addEarnedBadges]);

// // // //   // ─── checkNewUserBadges: REST fallback after first / Google login ─────────
// // // //   // Called from Login.jsx ~2s after login so the socket has time to fire first.
// // // //   // If the socket already delivered badges, dedup via shownBadgeKeysRef prevents
// // // //   // double-showing. If not, this REST call catches them.
// // // //   const checkNewUserBadges = useCallback(async () => {
// // // //     try {
// // // //       const token = await AsyncStorage.getItem('accessToken');
// // // //       if (!token) return;

// // // //       const res = await fetch(`${BADGE_API}/my/earned`, {
// // // //         headers: { Authorization: `Bearer ${token}` },
// // // //       });
// // // //       if (!res.ok) return;

// // // //       const data = await res.json();
// // // //       const badges = data.badges || [];

// // // //       // Make sure persisted shown-keys are loaded before filtering, since
// // // //       // this can run very early after a fresh login (before mount effects).
// // // //       await loadShownKeys();

// // // //       // addEarnedBadges internally dedupes against shownBadgeKeysRef (now
// // // //       // persisted to AsyncStorage), so old/already-shown badges from past
// // // //       // logins will NOT replay here — only genuinely new ones will.
// // // //       if (badges.length > 0) {
// // // //         console.log('[BadgeContext] 🎉 checkNewUserBadges fetched:', badges.length, 'badge(s) — filtering for new');
// // // //         addEarnedBadges(badges);
// // // //       } else {
// // // //         console.log('[BadgeContext] checkNewUserBadges: no badges found');
// // // //       }
// // // //     } catch (err) {
// // // //       console.error('[BadgeContext] checkNewUserBadges error:', err);
// // // //     }
// // // //   }, [addEarnedBadges]);

// // // //   // ─── Attach socket event listeners ───────────────────────────────────────
// // // //   const attachListeners = useCallback(
// // // //     (socket, userId) => {
// // // //       // Remove any previous listeners first (safe to call on new socket)
// // // //       socket.off('connect');
// // // //       socket.off('badge-socket-registered');
// // // //       socket.off('badge:earned');
// // // //       socket.off('badges:offline');
// // // //       socket.off('badge-socket-error');
// // // //       socket.off('reconnect');

// // // //       socket.on('connect', () => {
// // // //         console.log('[BadgeContext] ✅ Badge socket connected:', socket.id);
// // // //         socket.emit('register-badge-socket', { userId });
// // // //       });

// // // //       socket.on('badge-socket-registered', (data) => {
// // // //         console.log('[BadgeContext] ✅ Registered:', data);
// // // //         if (data.offlineBadgesCount > 0) {
// // // //           console.log(
// // // //             `[BadgeContext] 📬 ${data.offlineBadgesCount} offline badges pending`,
// // // //           );
// // // //         }
// // // //       });

// // // //       // Real-time badge(s) — backend sends an array
// // // //       socket.on('badge:earned', (data) => {
// // // //         console.log('[BadgeContext] 🏅 badge:earned received');
// // // //         const badges = Array.isArray(data) ? data : data?.badges ?? [data];
// // // //         addEarnedBadges(badges);
// // // //       });

// // // //       // Offline badges on reconnect — queue as popups (one at a time via BadgePopup)
// // // //       socket.on('badges:offline', (data) => {
// // // //         console.log(
// // // //           '[BadgeContext] 📬 badges:offline received:',
// // // //           data?.badges?.length,
// // // //         );
// // // //         const badges = data?.badges ?? [];
// // // //         if (badges.length > 0) {
// // // //           addEarnedBadges(badges); // show as popup queue, same as badge:earned
// // // //         }
// // // //       });

// // // //       // Re-register after auto-reconnect
// // // //       socket.on('reconnect', () => {
// // // //         console.log('[BadgeContext] 🔄 Badge socket reconnected, re-registering...');
// // // //         socket.emit('register-badge-socket', { userId });
// // // //       });

// // // //       socket.on('badge-socket-error', (err) => {
// // // //         console.error('[BadgeContext] ❌ Badge socket error:', err?.message);
// // // //       });
// // // //     },
// // // //     [addEarnedBadges],
// // // //   );

// // // //   // ─── reinitSocket: call this after every login ────────────────────────────
// // // //   // Login.js calls this immediately after login() + registerSocket().
// // // //   const reinitSocket = useCallback(async () => {
// // // //     try {
// // // //       await loadShownKeys(); // ensure persisted dedup memory is ready before any badge events fire

// // // //       const userData = await AsyncStorage.getItem('userData');
// // // //       const user = userData ? JSON.parse(userData) : null;
// // // //       const userId = user?._id || user?.id;

// // // //       if (!userId) {
// // // //         console.warn('[BadgeContext] reinitSocket: no userId found in storage');
// // // //         return;
// // // //       }

// // // //       console.log('[BadgeContext] 🔌 Initing badge socket for user:', userId);

// // // //       // Disconnect stale socket if any
// // // //       if (socketRef.current) {
// // // //         socketRef.current.removeAllListeners();
// // // //         socketRef.current.disconnect();
// // // //         socketRef.current = null;
// // // //       }

// // // //       const socket = io(BASE_URL, {
// // // //         reconnection: true,
// // // //         reconnectionDelay: 1000,
// // // //         reconnectionDelayMax: 5000,
// // // //         reconnectionAttempts: 10,
// // // //         transports: ['websocket'],
// // // //       });

// // // //       socketRef.current = socket;
// // // //       attachListeners(socket, userId);
// // // //     } catch (err) {
// // // //       console.error('[BadgeContext] reinitSocket error:', err);
// // // //     }
// // // //   }, [attachListeners, loadShownKeys]);

// // // //   // ─── disconnectSocket: call on logout ─────────────────────────────────────
// // // //   const disconnectSocket = useCallback(() => {
// // // //     if (socketRef.current) {
// // // //       socketRef.current.removeAllListeners();
// // // //       socketRef.current.disconnect();
// // // //       socketRef.current = null;
// // // //       console.log('[BadgeContext] 👋 Badge socket disconnected on logout');
// // // //     }
// // // //     // Reset only transient UI/session state. Do NOT clear shownBadgeKeysRef —
// // // //     // it's persisted to AsyncStorage on purpose so badges already shown to
// // // //     // this device never replay on next login. snapshotIdsRef is per-action
// // // //     // scratch state, safe to clear.
// // // //     setEarnedBadges([]);
// // // //     setOfflineBadges([]);
// // // //     snapshotIdsRef.current.clear();
// // // //   }, []);

// // // //   // ─── Context value ────────────────────────────────────────────────────────
// // // //   const value = {
// // // //     // State
// // // //     earnedBadges,
// // // //     setEarnedBadges,
// // // //     offlineBadges,
// // // //     setOfflineBadges,

// // // //     // Socket
// // // //     reinitSocket,
// // // //     disconnectSocket,

// // // //     // REST helpers
// // // //     checkSilentBadges,
// // // //     snapshotBadgeIds,
// // // //     checkBadgesDiff,

// // // //     // ✅ NEW: used by ComputerGame / MultiPlayerGame to queue badges
// // // //     showBadges: addEarnedBadges,

// // // //     // ✅ NEW: used by Login after first / Google login to catch welcome badges
// // // //     checkNewUserBadges,
// // // //   };

// // // //   return (
// // // //     <BadgeContext.Provider value={value}>{children}</BadgeContext.Provider>
// // // //   );
// // // // };

// // // // export default BadgeContext;


// // // import React, {
// // //   createContext,
// // //   useCallback,
// // //   useContext,
// // //   useEffect,
// // //   useRef,
// // //   useState,
// // // } from 'react';
// // // import { io } from 'socket.io-client';
// // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // import { authFetch as fetch } from '../utils/authFetch';

// // // const BASE_URL = 'http://13.203.232.239:3000';
// // // const BADGE_API = `${BASE_URL}/api/badges`;

// // // const BadgeContext = createContext(null);
// // // export const useBadge = () => useContext(BadgeContext);

// // // export const BadgeProvider = ({ children }) => {
// // //   const [earnedBadges, setEarnedBadges] = useState([]);
// // //   const [offlineBadges, setOfflineBadges] = useState([]);
// // //   const socketRef = useRef(null);

// // //   // ─── Popup queue add — socket is ONLY caller now. Backend guarantees
// // //   // exactly-once delivery, so no frontend dedup needed. ──────────────────
// // //   const addEarnedBadges = useCallback((badges) => {
// // //     if (!badges || badges.length === 0) return;
// // //     console.log('[BadgeContext] 🏅 New badges to show:', badges.map((b) => b.title));
// // //     setEarnedBadges((prev) => [...prev, ...badges]);
// // //   }, []);

// // //   const attachListeners = useCallback(
// // //     (socket, userId) => {
// // //       socket.off('connect');
// // //       socket.off('badge-socket-registered');
// // //       socket.off('badge:earned');
// // //       socket.off('badges:offline');
// // //       socket.off('badge-socket-error');
// // //       socket.off('reconnect');

// // //       socket.on('connect', () => {
// // //         console.log('[BadgeContext] ✅ Badge socket connected:', socket.id);
// // //         socket.emit('register-badge-socket', { userId });
// // //       });

// // //       socket.on('badge-socket-registered', (data) => {
// // //         console.log('[BadgeContext] ✅ Registered:', data);
// // //       });

// // //       socket.on('badge:earned', (data) => {
// // //         console.log('[BadgeContext] 🏅 badge:earned received');
// // //         const badges = Array.isArray(data) ? data : data?.badges ?? [data];
// // //         addEarnedBadges(badges);
// // //       });

// // //       socket.on('badges:offline', (data) => {
// // //         console.log('[BadgeContext] 📬 badges:offline received:', data?.badges?.length);
// // //         const badges = data?.badges ?? [];
// // //         if (badges.length > 0) addEarnedBadges(badges);
// // //       });

// // //       socket.on('reconnect', () => {
// // //         console.log('[BadgeContext] 🔄 Badge socket reconnected, re-registering...');
// // //         socket.emit('register-badge-socket', { userId });
// // //       });

// // //       socket.on('badge-socket-error', (err) => {
// // //         console.error('[BadgeContext] ❌ Badge socket error:', err?.message);
// // //       });
// // //     },
// // //     [addEarnedBadges],
// // //   );

// // //   // ─── reinitSocket: call after login ──────────────────────────────────────
// // //   // Order per backend guide: connect → POST app-opened → register-badge-socket
// // //   const reinitSocket = useCallback(async () => {
// // //     try {
// // //       const userData = await AsyncStorage.getItem('userData');
// // //       const user = userData ? JSON.parse(userData) : null;
// // //       const userId = user?._id || user?.id;

// // //       if (!userId) {
// // //         console.warn('[BadgeContext] reinitSocket: no userId found in storage');
// // //         return;
// // //       }

// // //       if (socketRef.current) {
// // //         socketRef.current.removeAllListeners();
// // //         socketRef.current.disconnect();
// // //         socketRef.current = null;
// // //       }

// // //       const socket = io(BASE_URL, {
// // //         reconnection: true,
// // //         reconnectionDelay: 1000,
// // //         reconnectionDelayMax: 5000,
// // //         reconnectionAttempts: 10,
// // //         transports: ['websocket'],
// // //       });

// // //       socketRef.current = socket;
// // //       attachListeners(socket, userId);

// // //       // Fire-and-forget: backend awards streak/loyalty badges here, delivery
// // //       // comes back via socket (badge:earned or badges:offline), not this response.
// // //       const token = await AsyncStorage.getItem('accessToken');
// // //       if (token) {
// // //         fetch(`${BADGE_API}/event/app-opened`, {
// // //           method: 'POST',
// // //           headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
// // //           body: JSON.stringify({}),
// // //         }).catch((err) => console.error('[BadgeContext] app-opened error:', err));
// // //       }
// // //     } catch (err) {
// // //       console.error('[BadgeContext] reinitSocket error:', err);
// // //     }
// // //   }, [attachListeners]);

// // //   const disconnectSocket = useCallback(() => {
// // //     if (socketRef.current) {
// // //       socketRef.current.removeAllListeners();
// // //       socketRef.current.disconnect();
// // //       socketRef.current = null;
// // //       console.log('[BadgeContext] 👋 Badge socket disconnected on logout');
// // //     }
// // //     setEarnedBadges([]);
// // //     setOfflineBadges([]);
// // //   }, []);

// // //   const value = {
// // //     earnedBadges,
// // //     setEarnedBadges,
// // //     offlineBadges,
// // //     setOfflineBadges,
// // //     reinitSocket,
// // //     disconnectSocket,
// // //     showBadges: addEarnedBadges, // used by ComputerGame / MultiPlayerGame
// // //   };

// // //   return <BadgeContext.Provider value={value}>{children}</BadgeContext.Provider>;
// // // };

// // // export default BadgeContext;



// // import React, {
// //   createContext,
// //   useCallback,
// //   useContext,
// //   useRef,
// //   useState,
// // } from 'react';
// // import { io } from 'socket.io-client';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import { authFetch as fetch } from '../utils/authFetch';

// // const BASE_URL = 'http://13.203.232.239:3000';
// // const BADGE_API = `${BASE_URL}/api/badges`;

// // const BadgeContext = createContext(null);
// // export const useBadge = () => useContext(BadgeContext);

// // export const BadgeProvider = ({ children }) => {
// //   const [earnedBadges, setEarnedBadges] = useState([]);
// //   const [offlineBadges, setOfflineBadges] = useState([]);
// //   const socketRef = useRef(null);

// //   // Adds badges to the popup queue. Socket is the only caller —
// //   // backend guarantees exactly-once delivery.
// //   const addEarnedBadges = useCallback((badges) => {
// //     if (!badges || badges.length === 0) return;
// //     console.log('[BadgeContext] 🏅 New badges to show:', badges.map((b) => b.title));
// //     setEarnedBadges((prev) => [...prev, ...badges]);
// //   }, []);

// //   const attachListeners = useCallback(
// //     (socket, userId) => {
// //       socket.off('connect');
// //       socket.off('badge-socket-registered');
// //       // FIX 1: Listen for 'badges-earned' (hyphen, plural) — matches what
// //       //         the server actually emits per the API docs.
// //       socket.off('badges-earned');
// //       socket.off('badge:earned');
// //       socket.off('badges:offline');
// //       socket.off('badge-socket-error');
// //       socket.off('reconnect');

// //       socket.on('connect', () => {
// //         console.log('[BadgeContext] ✅ Badge socket connected:', socket.id);
// //         socket.emit('register-badge-socket', { userId });
// //       });

// //       socket.on('badge-socket-registered', (data) => {
// //         console.log('[BadgeContext] ✅ Registered:', data);

// //         // FIX 3: Call app-opened AFTER the socket is registered so the
// //         //         server can deliver any streak/loyalty badges back on this
// //         //         already-registered socket rather than a not-yet-registered one.
// //         AsyncStorage.getItem('accessToken').then((token) => {
// //           if (!token) return;
// //           fetch(`${BADGE_API}/event/app-opened`, {
// //             method: 'POST',
// //             headers: {
// //               'Content-Type': 'application/json',
// //               Authorization: `Bearer ${token}`,
// //             },
// //             body: JSON.stringify({}),
// //           }).catch((err) => console.error('[BadgeContext] app-opened error:', err));
// //         });
// //       });

// //       // FIX 1: Primary listener — 'badges-earned' is what the API docs say
// //       //         the server emits for live-game badge events.
// //       socket.on('badges-earned', (data) => {
// //         console.log('[BadgeContext] 🏅 badges-earned received');
// //         const badges = Array.isArray(data) ? data : data?.badges ?? [data];
// //         addEarnedBadges(badges);
// //       });

// //       // Keep 'badge:earned' as a fallback in case the backend uses both names.
// //       socket.on('badge:earned', (data) => {
// //         console.log('[BadgeContext] 🏅 badge:earned received (fallback)');
// //         const badges = Array.isArray(data) ? data : data?.badges ?? [data];
// //         addEarnedBadges(badges);
// //       });

// //       socket.on('badges:offline', (data) => {
// //         console.log('[BadgeContext] 📬 badges:offline received:', data?.badges?.length);
// //         const badges = data?.badges ?? [];
// //         if (badges.length > 0) addEarnedBadges(badges);
// //       });

// //       socket.on('reconnect', () => {
// //         console.log('[BadgeContext] 🔄 Badge socket reconnected, re-registering...');
// //         socket.emit('register-badge-socket', { userId });
// //       });

// //       socket.on('badge-socket-error', (err) => {
// //         console.error('[BadgeContext] ❌ Badge socket error:', err?.message);
// //       });
// //     },
// //     [addEarnedBadges],
// //   );

// //   // Call this immediately after every successful login.
// //   const reinitSocket = useCallback(async () => {
// //     try {
// //       const userData = await AsyncStorage.getItem('userData');
// //       const user = userData ? JSON.parse(userData) : null;
// //       const userId = user?._id || user?.id;

// //       if (!userId) {
// //         console.warn('[BadgeContext] reinitSocket: no userId found in storage');
// //         return;
// //       }

// //       if (socketRef.current) {
// //         socketRef.current.removeAllListeners();
// //         socketRef.current.disconnect();
// //         socketRef.current = null;
// //       }

// //       const socket = io(BASE_URL, {
// //         reconnection: true,
// //         reconnectionDelay: 1000,
// //         reconnectionDelayMax: 5000,
// //         reconnectionAttempts: 10,
// //         transports: ['websocket'],
// //       });

// //       socketRef.current = socket;
// //       // FIX 3: app-opened is now fired inside badge-socket-registered (above),
// //       //         not here, so the socket is guaranteed to be registered before
// //       //         the server tries to deliver any newly awarded badges.
// //       attachListeners(socket, userId);
// //     } catch (err) {
// //       console.error('[BadgeContext] reinitSocket error:', err);
// //     }
// //   }, [attachListeners]);

// //   const disconnectSocket = useCallback(() => {
// //     if (socketRef.current) {
// //       socketRef.current.removeAllListeners();
// //       socketRef.current.disconnect();
// //       socketRef.current = null;
// //       console.log('[BadgeContext] 👋 Badge socket disconnected on logout');
// //     }
// //     setEarnedBadges([]);
// //     setOfflineBadges([]);
// //   }, []);

// //   // FIX 4: Expose a helper so screens can fire page-visited events and
// //   //         surface any newly awarded navigation badges through the normal
// //   //         earnedBadges queue.
// //   const trackPageVisit = useCallback(async (page) => {
// //     try {
// //       const token = await AsyncStorage.getItem('accessToken');
// //       if (!token) return;
// //       const res = await fetch(`${BADGE_API}/event/page-visited`, {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           Authorization: `Bearer ${token}`,
// //         },
// //         body: JSON.stringify({ page }),
// //       });
// //       const json = await res.json();
// //       if (json?.newlyEarned?.length > 0) {
// //         addEarnedBadges(json.newlyEarned);
// //       }
// //     } catch (err) {
// //       console.error('[BadgeContext] trackPageVisit error:', err);
// //     }
// //   }, [addEarnedBadges]);

// //   const value = {
// //     earnedBadges,
// //     setEarnedBadges,
// //     offlineBadges,
// //     setOfflineBadges,
// //     reinitSocket,
// //     disconnectSocket,
// //     showBadges: addEarnedBadges,  // used by ComputerGame / MultiPlayerGame
// //     trackPageVisit,               // call on Stats, Leaderboard, Theme, Analysis screens
// //   };

// //   return <BadgeContext.Provider value={value}>{children}</BadgeContext.Provider>;
// // };

// // export default BadgeContext;




// import React, {
//   createContext,
//   useCallback,
//   useContext,
//   useRef,
//   useState,
// } from 'react';
// import { io } from 'socket.io-client';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { authFetch as fetch } from '../utils/authFetch';

// const BASE_URL = 'http://13.203.232.239:3000';
// const BADGE_API = `${BASE_URL}/api/badges`;

// const BadgeContext = createContext(null);
// export const useBadge = () => useContext(BadgeContext);

// export const BadgeProvider = ({ children }) => {
//   const [earnedBadges, setEarnedBadges] = useState([]);
//   const [offlineBadges, setOfflineBadges] = useState([]);
//   const socketRef = useRef(null);

//   const addEarnedBadges = useCallback((badges) => {
//     if (!badges || badges.length === 0) return;
//     console.log('[BadgeContext] 🏅 New badges to show:', badges.map((b) => b.title));
//     setEarnedBadges((prev) => [...prev, ...badges]);
//   }, []);

//   const attachListeners = useCallback(
//     (socket, userId) => {
//       socket.off('connect');
//       socket.off('badge-socket-registered');
//       socket.off('badge:earned');
//       socket.off('badges:offline');
//       socket.off('badge-socket-error');
//       socket.off('reconnect');

//       socket.on('connect', () => {
//         console.log('[BadgeContext] ✅ Badge socket connected:', socket.id);
//         socket.emit('register-badge-socket', { userId });
//       });

//       socket.on('badge-socket-registered', (data) => {
//         console.log('[BadgeContext] ✅ Registered:', data);
//         AsyncStorage.getItem('accessToken').then((token) => {
//           if (!token) return;
//           fetch(`${BADGE_API}/event/app-opened`, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify({}),
//           }).catch((err) => console.error('[BadgeContext] app-opened error:', err));
//         });
//       });

//       socket.on('badge:earned', (badge) => {
//         console.log('[BadgeContext] 🏅 badge:earned received:', badge?.title);
//         if (badge) addEarnedBadges([badge]);
//       });

//       socket.on('badges:offline', ({ badges }) => {
//         console.log('[BadgeContext] 📬 badges:offline received:', badges?.length);
//         if (badges?.length > 0) addEarnedBadges(badges);
//       });

//       socket.on('reconnect', () => {
//         console.log('[BadgeContext] 🔄 Reconnected, re-registering...');
//         socket.emit('register-badge-socket', { userId });
//       });

//       socket.on('badge-socket-error', (err) => {
//         console.error('[BadgeContext] ❌ Badge socket error:', err?.message);
//       });
//     },
//     [addEarnedBadges],
//   );

//   const reinitSocket = useCallback(async () => {
//     try {
//       const userData = await AsyncStorage.getItem('userData');
//       const user = userData ? JSON.parse(userData) : null;
//       const userId = user?._id || user?.id;

//       if (!userId) {
//         console.warn('[BadgeContext] reinitSocket: no userId found in storage');
//         return;
//       }

//       if (socketRef.current) {
//         socketRef.current.removeAllListeners();
//         socketRef.current.disconnect();
//         socketRef.current = null;
//       }

//       const socket = io(BASE_URL, {
//         reconnection: true,
//         reconnectionDelay: 1000,
//         reconnectionDelayMax: 5000,
//         reconnectionAttempts: 10,
//         transports: ['websocket'],
//       });

//       socketRef.current = socket;
//       attachListeners(socket, userId);
//     } catch (err) {
//       console.error('[BadgeContext] reinitSocket error:', err);
//     }
//   }, [attachListeners]);

//   const disconnectSocket = useCallback(() => {
//     if (socketRef.current) {
//       socketRef.current.removeAllListeners();
//       socketRef.current.disconnect();
//       socketRef.current = null;
//       console.log('[BadgeContext] 👋 Badge socket disconnected on logout');
//     }
//     setEarnedBadges([]);
//     setOfflineBadges([]);
//   }, []);

//   const trackPageVisit = useCallback(async (page) => {
//     try {
//       const token = await AsyncStorage.getItem('accessToken');
//       if (!token) return;
//       const res = await fetch(`${BADGE_API}/event/page-visited`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ page }),
//       });
//       const json = await res.json();
//       if (json?.newlyEarned?.length > 0) {
//         addEarnedBadges(json.newlyEarned);
//       }
//     } catch (err) {
//       console.error('[BadgeContext] trackPageVisit error:', err);
//     }
//   }, [addEarnedBadges]);

//   const value = {
//     earnedBadges,
//     setEarnedBadges,
//     offlineBadges,
//     setOfflineBadges,
//     reinitSocket,
//     disconnectSocket,
//     showBadges: addEarnedBadges,
//     trackPageVisit,
//   };

//   return <BadgeContext.Provider value={value}>{children}</BadgeContext.Provider>;
// };

// export default BadgeContext;

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authFetch as fetch } from '../utils/authFetch';
import { useSocket, useSocketState } from './Socket';

const BASE_URL = 'http://13.203.232.239:3000';
const BADGE_API = `${BASE_URL}/api/badges`;

const BadgeContext = createContext(null);
export const useBadge = () => useContext(BadgeContext);

export const BadgeProvider = ({ children }) => {
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [offlineBadges, setOfflineBadges] = useState([]);

  // ✅ Shared main socket — no separate connection anymore
  const socket = useSocket();
  const { isRegistered } = useSocketState();

  const registeredUserIdRef = useRef(null);

  const addEarnedBadges = useCallback((badges) => {
    if (!badges || badges.length === 0) return;
    console.log('[BadgeContext] 🏅 New badges to show:', badges.map((b) => b.title));
    setEarnedBadges((prev) => [...prev, ...badges]);
  }, []);

  const sendAppOpened = useCallback(() => {
    AsyncStorage.getItem('accessToken').then((token) => {
      if (!token) return;
      fetch(`${BADGE_API}/event/app-opened`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      }).catch((err) => console.error('[BadgeContext] app-opened error:', err));
    });
  }, []);

  /* ==========================================
     ATTACH BADGE LISTENERS ON SHARED SOCKET
     Fires once per (socket, userId) — re-runs on
     reconnect because isRegistered flips false→true
     again via Socket.js's own connect/disconnect flow.
  ========================================== */
  useEffect(() => {
    if (!socket) return;

    const handleBadgeRegistered = (data) => {
      console.log('[BadgeContext] ✅ Registered:', data);
      sendAppOpened();
    };

    const handleBadgeEarned = (badge) => {
      console.log('[BadgeContext] 🏅 badge:earned received:', badge?.title);
      if (badge) addEarnedBadges([badge]);
    };

    const handleBadgesOffline = ({ badges }) => {
      console.log('[BadgeContext] 📬 badges:offline received:', badges?.length);
      if (badges?.length > 0) addEarnedBadges(badges);
    };

    const handleBadgeSocketError = (err) => {
      console.error('[BadgeContext] ❌ Badge socket error:', err?.message);
    };

    socket.on('badge-socket-registered', handleBadgeRegistered);
    socket.on('badge:earned', handleBadgeEarned);
    socket.on('badges:offline', handleBadgesOffline);
    socket.on('badge-socket-error', handleBadgeSocketError);

    return () => {
      socket.off('badge-socket-registered', handleBadgeRegistered);
      socket.off('badge:earned', handleBadgeEarned);
      socket.off('badges:offline', handleBadgesOffline);
      socket.off('badge-socket-error', handleBadgeSocketError);
    };
  }, [socket, addEarnedBadges, sendAppOpened]);

  /* ==========================================
     REGISTER FOR BADGES — piggybacks on main
     socket's player-registered confirmation.
     Re-fires automatically whenever isRegistered
     flips true (covers reconnect case too, since
     Socket.js sets isRegistered false on disconnect
     and true again on next player-registered).
  ========================================== */
  useEffect(() => {
    if (!socket || !isRegistered) return;

    AsyncStorage.getItem('userData').then((userData) => {
      if (!userData) return;
      const user = JSON.parse(userData);
      const userId = user?._id || user?.id;
      if (!userId) return;

      registeredUserIdRef.current = userId;
      console.log('[BadgeContext] 📤 Emitting register-badge-socket for', userId);
      socket.emit('register-badge-socket', { userId });
    });
  }, [socket, isRegistered]);

  /* ==========================================
     LOGOUT — just clear local badge state.
     Do NOT touch the shared socket; other
     screens (Lobby, MultiPlayerGame, Home) still
     need it alive.
  ========================================== */
  const disconnectSocket = useCallback(() => {
    registeredUserIdRef.current = null;
    setEarnedBadges([]);
    setOfflineBadges([]);
    console.log('[BadgeContext] 👋 Badge state cleared on logout');
  }, []);

  // Kept for backwards compatibility with screens that call this after
  // login (e.g. Login.js) — now a no-op since registration is automatic
  // off isRegistered, but safe to keep calling.
  const reinitSocket = useCallback(async () => {
    console.log('[BadgeContext] reinitSocket() — no-op, using shared socket now');
  }, []);

  const trackPageVisit = useCallback(async (page) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return;
      const res = await fetch(`${BADGE_API}/event/page-visited`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ page }),
      });
      const json = await res.json();
      if (json?.newlyEarned?.length > 0) {
        addEarnedBadges(json.newlyEarned);
      }
    } catch (err) {
      console.error('[BadgeContext] trackPageVisit error:', err);
    }
  }, [addEarnedBadges]);

  const value = {
    earnedBadges,
    setEarnedBadges,
    offlineBadges,
    setOfflineBadges,
    reinitSocket,
    disconnectSocket,
    showBadges: addEarnedBadges,
    trackPageVisit,
  };

  return <BadgeContext.Provider value={value}>{children}</BadgeContext.Provider>;
};

export default BadgeContext;