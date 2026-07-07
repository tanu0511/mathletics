



/* eslint-disable react-hooks/exhaustive-deps */
// import React, { useState, useEffect, useRef } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     TouchableOpacity,
//     Animated,
//     Image,
//     Alert,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { Search, X, Users, Clock, Star } from 'lucide-react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useSocket, useSocketState } from '../context/Socket';
// import { useTheme } from '../context/ThemeContext';
// import { useAppTranslation } from '../context/TranslationContext';

// export default function Lobby() {
//     const socket = useSocket();
//     const { isRegistered } = useSocketState();
//     const { theme } = useTheme();
//     const route = useRoute();
//     const { difficulty, diffCode, digit, symbol, timer, qm } = route.params;
//     const navigation = useNavigation();
//     const { t } = useAppTranslation();

//     console.log('[LOBBY] 🎬 Lobby component mounted');
//     console.log('[LOBBY] Route params:', { difficulty, diffCode, digit, symbol, timer, qm });

//     /* ================= STATE ================= */
//     const [isSearching, setIsSearching] = useState(false);
//     const [player, setPlayer] = useState(null);
//     const [matchFound, setMatchFound] = useState(false);
//     const [opponentData, setOpponentData] = useState(null);
//     const [dummyIdx, setDummyIdx] = useState(0);

//     const DUMMY_AVATARS = [
//         'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg',
//         'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671122.jpg',
//         'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg',
//     ];

//     /* ================= REFS ================= */
//     const pulseAnim = useRef(new Animated.Value(1)).current;
//     const rotateAnim = useRef(new Animated.Value(0)).current;
//     const scaleAnim = useRef(new Animated.Value(1)).current;

//     const readyToNavigateRef = useRef(false);
//     const pendingGameStartData = useRef(null);
//     const hasNavigatedRef = useRef(false);
//     const socketRef = useRef(null);
//     const opponentRef = useRef(null);
//     const myMongoIdRef = useRef(null);

//     const isSearchingRef = useRef(false);
//     const handleGameStartedRef = useRef(null);
//     const handleMatchFoundRef = useRef(null);

//     const playerRatingRef = useRef(1000);

//     // ✅ FIX 1 — blocks join-lobby if server sent rejoin-game
//     const rejoinBlockedRef = useRef(false);

//     const getPlayerRating = (playerData) => {
//         if (!playerData) return 1000;
//         const byDiffCode = playerData?.pr?.pvpByDiffCode?.[diffCode];
//         if (byDiffCode !== undefined) {
//             if (typeof byDiffCode === 'number') return byDiffCode;
//         }
//         return playerData?.pr?.pvp?.[difficulty] || 1000;
//     };

//     /* ================= EFFECT 1: Load User Data ================= */
//     useEffect(() => {
//         const getUserData = async () => {
//             console.log('[LOBBY] 📊 EFFECT 1: Loading user data...');
//             try {
//                 const userData = await AsyncStorage.getItem('userData');
//                 if (userData) {
//                     const user = JSON.parse(userData);
//                     console.log('[LOBBY] ✅ User Info loaded:', {
//                         username: user.username,
//                         id: user._id || user.id,
//                     });
//                     console.log('[LOBBY] 💰 PR data:', JSON.stringify(user?.pr, null, 2));
//                     setPlayer(user);

//                     const mongoId = user._id || user.id;
//                     if (!mongoId) {
//                         console.error('[LOBBY] ❌ No MongoDB ID found in user data!');
//                         Alert.alert('Error', t('User ID not found. Please login again.'));
//                         navigation.goBack();
//                         return;
//                     }

//                     myMongoIdRef.current = mongoId;
//                     console.log('[LOBBY] ✅ MongoDB ID set:', mongoId);
//                 } else {
//                     console.error('[LOBBY] ❌ No user data in AsyncStorage');
//                     Alert.alert('Error', t('Please login first'));
//                     navigation.goBack();
//                 }
//             } catch (error) {
//                 console.error('[LOBBY] ❌ Error loading user data:', error);
//                 Alert.alert('Error', t('Failed to load user data'));
//             }
//         };
//         getUserData();
//     }, []);

//     /* ================= EFFECT: Sync playerRatingRef ================= */
//     useEffect(() => {
//         playerRatingRef.current = getPlayerRating(player);
//         console.log('[LOBBY] 🔄 EFFECT: playerRatingRef updated to:', playerRatingRef.current);
//         console.log('[LOBBY] Player state changed:', {
//             username: player?.username,
//             pvp: player?.pr?.pvp,
//             pvpByDiffCode: player?.pr?.pvpByDiffCode,
//         });
//     }, [player]);

//     /* ================= EFFECT: Auto Start Search ================= */
//     useEffect(() => {
//         console.log('[LOBBY] 🔍 EFFECT: Auto Start Search checking...');
//         console.log('[LOBBY] Conditions: player:', !!player, 'isRegistered:', isRegistered, 'isSearching:', isSearchingRef.current, 'rejoinBlocked:', rejoinBlockedRef.current);

//         if (player && isRegistered && !isSearchingRef.current && !rejoinBlockedRef.current) {
//             console.log('[LOBBY] ✅ All conditions met - Auto starting matchmaking...');
//             handleStartSearch();
//         } else {
//             console.log('[LOBBY] ⏳ Waiting - player:', !!player, 'isRegistered:', isRegistered, 'notSearching:', !isSearchingRef.current, 'rejoinBlocked:', rejoinBlockedRef.current);
//         }
//     }, [player, isRegistered]);

//     /* ================= EFFECT 2: Dummy Avatar Animation ================= */
//     useEffect(() => {
//         let dummyInterval;
//         let pulseAnimation;
//         let rotateAnimation;

//         if (isSearching && !matchFound) {
//             dummyInterval = setInterval(() => {
//                 setDummyIdx(prev => (prev + 1) % DUMMY_AVATARS.length);
//             }, 600);

//             pulseAnimation = Animated.loop(
//                 Animated.sequence([
//                     Animated.timing(pulseAnim, {
//                         toValue: 1.1,
//                         duration: 800,
//                         useNativeDriver: true,
//                     }),
//                     Animated.timing(pulseAnim, {
//                         toValue: 1,
//                         duration: 800,
//                         useNativeDriver: true,
//                     }),
//                 ]),
//             );

//             rotateAnimation = Animated.loop(
//                 Animated.timing(rotateAnim, {
//                     toValue: 1,
//                     duration: 2000,
//                     useNativeDriver: true,
//                 }),
//             );

//             pulseAnimation.start();
//             rotateAnimation.start();
//         }

//         return () => {
//             if (dummyInterval) clearInterval(dummyInterval);
//             if (pulseAnimation) pulseAnimation.stop();
//             if (rotateAnimation) rotateAnimation.stop();
//             pulseAnim.setValue(1);
//             rotateAnim.setValue(0);
//         };
//     }, [isSearching, matchFound, pulseAnim, rotateAnim]);

//     /* ================= EFFECT 3: Cleanup on Unmount ================= */
//     useEffect(() => {
//         console.log('[LOBBY] ⚙️ EFFECT 3: Mounted - Cleanup on unmount registered');

//         return () => {
//             console.log('[LOBBY] 🧹 EFFECT 3: Cleanup - Component unmounting');
//             if (isSearchingRef.current && socketRef.current?.connected) {
//                 console.log('[LOBBY] 🧹 Cancelling search on unmount');
//                 socketRef.current.emit('cancel_search');
//             }

//             readyToNavigateRef.current = false;
//             hasNavigatedRef.current = false;
//             pendingGameStartData.current = null;
//             opponentRef.current = null;
//             rejoinBlockedRef.current = false;
//             console.log('[LOBBY] ✅ Refs cleaned up');
//         };
//     }, []);

//     /* ================= EFFECT 4: Socket Listeners ================= */
//     useEffect(() => {
//         console.log('[LOBBY] 🔌 EFFECT 4: Socket Listeners - Setting up...');

//         if (!socket) {
//             console.warn('[LOBBY] ⚠️ Socket not available');
//             return;
//         }

//         console.log('[LOBBY] ✅ Socket available - socket.id:', socket.id);
//         socketRef.current = socket;
//         console.log('[LOBBY] ✅ socketRef.current set');

//         const handleConnect = () => {
//             console.log('[LOBBY] 🟢 Socket: connect event fired');
//             console.log('[LOBBY] Socket connected state:', socket.connected);
//             console.log('[LOBBY] Socket ID:', socket.id);
//         };

//         const handleDisconnect = reason => {
//             console.log('[LOBBY] 🔴 Socket: disconnect event fired');
//             console.log('[LOBBY] Disconnect reason:', reason);
//             if (isSearchingRef.current) {
//                 console.log('[LOBBY] ❌ Was searching - cancelling search due to disconnect');
//                 setIsSearching(false);
//                 isSearchingRef.current = false;
//                 setMatchFound(false);
//                 Alert.alert('Disconnected', t('Connection lost. Please try again.'));
//             }
//         };

//         const handleLobbyJoined = data => {
//             console.log('[LOBBY] 📥 Socket: lobby-joined event received');
//             console.log('[LOBBY] Lobby joined data:', data);
//             if (data.success && data.player?.id) {
//                 console.log('[LOBBY] ✅ My MongoDB ID confirmed:', data.player.id);
//                 myMongoIdRef.current = data.player.id;

//                 if (data.player?.rating !== undefined) {
//                     console.log('[LOBBY] ⭐ Rating from server:', data.player.rating);
//                     console.log('[LOBBY] Current diffCode:', diffCode);
//                     playerRatingRef.current = data.player.rating;
//                     setPlayer(prevPlayer => ({
//                         ...prevPlayer,
//                         pr: {
//                             ...prevPlayer?.pr,
//                             pvpByDiffCode: {
//                                 ...prevPlayer?.pr?.pvpByDiffCode,
//                                 [diffCode]: data.player.rating,
//                             },
//                             pvp: {
//                                 ...prevPlayer?.pr?.pvp,
//                                 [difficulty]: data.player.rating,
//                             },
//                         },
//                     }));
//                 }
//             } else {
//                 console.error('[LOBBY] ❌ Invalid lobby-joined response:', data);
//             }
//         };

//         const handleMatchFound = ({
//             gameRoom,
//             opponent,
//             myPlayerId,
//             initialQuestionMeter,
//         }) => {
//             console.log('[LOBBY] ✅ Socket: match-found event received');
//             console.log('[LOBBY] 📊 Match Data:', {
//                 opponent: opponent?.username,
//                 opponentId: opponent?.id,
//                 opponentRating: opponent?.rating,
//                 myPlayerId,
//                 initialQuestionMeter,
//             });

//             if (!opponent?.id || !opponent?.username) {
//                 console.error('[LOBBY] ❌ Invalid opponent data:', opponent);
//                 Alert.alert('Error', t('Invalid match data received'));
//                 setIsSearching(false);
//                 isSearchingRef.current = false;
//                 return;
//             }

//             const opponentInfo = {
//                 id: opponent.id,
//                 username: opponent.username,
//                 rating: opponent.rating || 1000,
//                 stats: opponent.stats || {
//                     wins: 0,
//                     losses: 0,
//                     winRate: 0,
//                     currentStreak: 0,
//                 },
//             };

//             myMongoIdRef.current = myPlayerId;
//             opponentRef.current = opponentInfo;

//             console.log('[LOBBY] ✅ Opponent data saved:', opponentInfo);

//             setOpponentData(opponentInfo);
//             setMatchFound(true);
//             hasNavigatedRef.current = false;

//             console.log('[LOBBY] ⏳ Starting 2s delay before navigation...');
//             setTimeout(() => {
//                 readyToNavigateRef.current = true;
//                 console.log('[LOBBY] ✅ readyToNavigateRef set to true');
//                 if (pendingGameStartData.current) {
//                     console.log('[LOBBY] 🚀 Navigating to Game (Delayed trigger)');
//                     navigateToGame(pendingGameStartData.current);
//                 } else {
//                     console.log('[LOBBY] ⏳ No pendingGameStartData yet, waiting for game-started event');
//                 }
//             }, 2000);
//         };

//         const handleGameStarted = data => {
//             console.log('[LOBBY] 🚀 Socket: game-started event received');
//             console.log('[LOBBY] Game started data:', data);

//             if (!data.currentQuestion) {
//                 console.error('[LOBBY] ❌ No current question in game-started:', data);
//                 Alert.alert('Error', t('Invalid game data received'));
//                 setIsSearching(false);
//                 isSearchingRef.current = false;
//                 setMatchFound(false);
//                 return;
//             }

//             console.log('[LOBBY] readyToNavigateRef:', readyToNavigateRef.current);
//             if (readyToNavigateRef.current) {
//                 console.log('[LOBBY] 🎮 readyToNavigateRef is true - navigating NOW');
//                 navigateToGame(data);
//             } else {
//                 console.log('[LOBBY] ⏳ Waiting for Match Found animation to complete...');
//                 pendingGameStartData.current = data;
//             }
//         };

//         // ✅ FIX 2 — handle rejoin-game: block join-lobby and navigate directly to game
//         const handleRejoinGame = data => {
//             console.log('[LOBBY] 🔄 Socket: rejoin-game received — player was in an active game');
//             console.log('[LOBBY] rejoin-game data:', data);

//             // Block join-lobby from firing
//             rejoinBlockedRef.current = true;

//             // Cancel any ongoing search state
//             setIsSearching(false);
//             isSearchingRef.current = false;
//             setMatchFound(false);

//             if (hasNavigatedRef.current) {
//                 console.log('[LOBBY] 🛑 Already navigated, ignoring rejoin-game');
//                 return;
//             }

//             // Tell server we're ready to reconnect to the game
//             console.log('[LOBBY] 📤 Emitting reconnect-to-game');
//             socket.emit('reconnect-to-game', {});
//         };

//         // ✅ FIX 3 — handle game-reconnected: restore game state and navigate
//         const handleGameReconnected = data => {
//             console.log('[LOBBY] ✅ Socket: game-reconnected received — restoring game');
//             console.log('[LOBBY] game-reconnected data:', JSON.stringify(data, null, 2));

//             if (hasNavigatedRef.current) {
//                 console.log('[LOBBY] 🛑 Already navigated, ignoring game-reconnected');
//                 return;
//             }

//             hasNavigatedRef.current = true;

//             // Extract opponent info from gameState if available
//             const gameState = data?.gameState || {};
//             const currentQuestion = data?.currentQuestion;
//             const myPlayerId = data?.myPlayerId || myMongoIdRef.current;

//             // Try to find opponent from playerScores keys
//             let opponentId = null;
//             if (gameState?.playerScores) {
//                 opponentId = Object.keys(gameState.playerScores).find(
//                     id => id !== myPlayerId,
//                 );
//             }

//             // Build minimal opponent object — username may not be available, fallback gracefully
//             const reconnectOpponent = opponentRef.current || {
//                 id: opponentId || 'unknown',
//                 username: data?.opponentUsername || t('Opponent'),
//                 rating: 1000,
//             };

//             if (!currentQuestion) {
//                 console.error('[LOBBY] ❌ game-reconnected has no currentQuestion — cannot restore game');
//                 rejoinBlockedRef.current = false;
//                 hasNavigatedRef.current = false;
//                 return;
//             }

//           console.log('[LOBBY] 🚀 Navigating to MultiPlayerGame via game-reconnected');
//             navigation.replace('MultiPlayerGame', {
//                 currentQuestion,
//                 timer,
//                 opponent: reconnectOpponent,
//                 myMongoId: myPlayerId,
//                 difficulty,
//                 diffCode,
//                 gameRoomId: data?.gameRoomId || data?.roomId || null,
//                 gameStartedAt: gameState?.gameStartedAt,
//                 totalGameTime: gameState?.totalGameTime,
//                 // Pass scores so MultiPlayerGame can restore them
//                 restoredMyScore: gameState?.playerScores?.[myPlayerId]?.score
//                     ?? gameState?.playerScores?.[myPlayerId]
//                     ?? 0,
//                 restoredOpponentScore: opponentId
//                     ? (gameState?.playerScores?.[opponentId]?.score
//                         ?? gameState?.playerScores?.[opponentId]
//                         ?? 0)
//                     : 0,
//             });
//         };

//         const handleError = error => {
//             console.error('[LOBBY] ❌ Socket error:', error);
//             Alert.alert('Error', error.message || 'An error occurred');
//             setIsSearching(false);
//             isSearchingRef.current = false;
//             setMatchFound(false);
//         };

//         const handlePlayerRegistered = data => {
//             console.log('[LOBBY] 📊 Socket: player-registered event received');
//             console.log('[LOBBY] Player registered data:', data);
//             if (data?.player?.rating !== undefined) {
//                 console.log('[LOBBY] ✅ Updating player with new rating:', data.player.rating);
//                 playerRatingRef.current = data.player.rating;
//                 setPlayer(prevPlayer => ({
//                     ...prevPlayer,
//                     pr: {
//                         ...prevPlayer?.pr,
//                         pvpByDiffCode: {
//                             ...prevPlayer?.pr?.pvpByDiffCode,
//                             [diffCode]: data.player.rating,
//                         },
//                         pvp: {
//                             ...prevPlayer?.pr?.pvp,
//                             [difficulty]: data.player.rating,
//                         },
//                     },
//                 }));
//             }
//         };

//         handleGameStartedRef.current = handleGameStarted;
//         handleMatchFoundRef.current = handleMatchFound;

//         console.log('[LOBBY] 🧹 Removing old socket listeners (if any)...');
//         socket.off('connect', handleConnect);
//         socket.off('disconnect', handleDisconnect);
//         socket.off('lobby-joined', handleLobbyJoined);
//         socket.off('match-found', handleMatchFound);
//         socket.off('game-started', handleGameStarted);
//         socket.off('player-registered', handlePlayerRegistered);
//         socket.off('rejoin-game', handleRejoinGame);
//         socket.off('game-reconnected', handleGameReconnected);
//         socket.off('error', handleError);

//         console.log('[LOBBY] 🔌 Adding new socket listeners...');
//         socket.on('connect', handleConnect);
//         socket.on('disconnect', handleDisconnect);
//         socket.on('lobby-joined', handleLobbyJoined);
//         socket.on('match-found', handleMatchFound);
//         socket.on('game-started', handleGameStarted);
//         socket.on('player-registered', handlePlayerRegistered);
//         socket.on('rejoin-game', handleRejoinGame);         // ✅ NEW
//         socket.on('game-reconnected', handleGameReconnected); // ✅ NEW
//         socket.on('error', handleError);

//         console.log('[LOBBY] ✅ All listeners attached');

//         return () => {
//             console.log('[LOBBY] 🧹 Cleanup: Removing all socket listeners');
//             socket.off('connect', handleConnect);
//             socket.off('disconnect', handleDisconnect);
//             socket.off('lobby-joined', handleLobbyJoined);
//             socket.off('match-found', handleMatchFound);
//             socket.off('game-started', handleGameStarted);
//             socket.off('player-registered', handlePlayerRegistered);
//             socket.off('rejoin-game', handleRejoinGame);
//             socket.off('game-reconnected', handleGameReconnected);
//             socket.off('error', handleError);
//         };
//     }, [socket]);

//     /* ================= NAVIGATION HELPER ================= */
//     const navigateToGame = ({ gameState, currentQuestion, myPlayerId }) => {
//         console.log('[LOBBY] 🎮 navigateToGame() called');

//         if (hasNavigatedRef.current) {
//             console.log('[LOBBY] 🛑 Already navigated to game, skipping duplicate.');
//             return;
//         }

//         if (!currentQuestion) {
//             console.error('[LOBBY] ❌ Cannot navigate: No current question');
//             Alert.alert('Error', 'Game data is missing');
//             setIsSearching(false);
//             isSearchingRef.current = false;
//             setMatchFound(false);
//             return;
//         }

//         const finalMongoId = myPlayerId || myMongoIdRef.current;
//         const finalOpponent = opponentRef.current;

//         if (!finalMongoId) {
//             console.error('[LOBBY] ❌ Cannot navigate: No MongoDB ID');
//             Alert.alert('Error', t('Player ID is missing'));
//             setIsSearching(false);
//             isSearchingRef.current = false;
//             setMatchFound(false);
//             return;
//         }

//         if (!finalOpponent?.id) {
//             console.error('[LOBBY] ❌ Cannot navigate: No opponent data');
//             Alert.alert('Error', t('Opponent data is missing'));
//             setIsSearching(false);
//             isSearchingRef.current = false;
//             setMatchFound(false);
//             return;
//         }

//         hasNavigatedRef.current = true;
//         console.log('[LOBBY] ✅ hasNavigatedRef set to true');

//         console.log('[LOBBY] 🎮 Navigation params:');
//         console.log('[LOBBY]   - My MongoDB ID:', finalMongoId);
//         console.log('[LOBBY]   - Opponent:', finalOpponent);
//         console.log('[LOBBY]   - Question present:', !!currentQuestion);
//         console.log('[LOBBY]   - diffCode:', diffCode);

//         if (socketRef.current) {
//             if (handleGameStartedRef.current) {
//                 console.log('[LOBBY] 🧹 Removing game-started listener');
//                 socketRef.current.off('game-started', handleGameStartedRef.current);
//             }
//             if (handleMatchFoundRef.current) {
//                 console.log('[LOBBY] 🧹 Removing match-found listener');
//                 socketRef.current.off('match-found', handleMatchFoundRef.current);
//             }
//         }

//         console.log('[LOBBY] 🚀 Navigating to MultiPlayerGame screen');
//         navigation.replace('MultiPlayerGame', {
//             currentQuestion,
//             timer,
//             opponent: finalOpponent,
//             myMongoId: finalMongoId,
//             difficulty,
//             diffCode,
//             gameStartedAt: gameState?.gameStartedAt,
//             totalGameTime: gameState?.totalGameTime,
//         });

//         setTimeout(() => {
//             setIsSearching(false);
//             isSearchingRef.current = false;
//             setMatchFound(false);
//             setOpponentData(null);
//             pendingGameStartData.current = null;
//             readyToNavigateRef.current = false;
//             hasNavigatedRef.current = false;
//             console.log('[LOBBY] ✅ Lobby cleanup complete after navigation');
//         }, 500);
//     };

//     /* ================= START SEARCH HANDLER ================= */
//     const handleStartSearch = () => {
//         console.log('[LOBBY] 🔍 handleStartSearch() called');

//         if (isSearchingRef.current) {
//             console.log('[LOBBY] ⚠️ Already searching, ignoring duplicate call');
//             return;
//         }

//         // ✅ FIX 4 — block join-lobby if rejoin-game was received
//         if (rejoinBlockedRef.current) {
//             console.log('[LOBBY] 🛑 join-lobby blocked — waiting for game-reconnected from server');
//             return;
//         }

//         if (!socketRef.current?.connected) {
//             console.error('[LOBBY] ❌ Socket not connected');
//             Alert.alert('Error', t('Socket not connected'));
//             return;
//         }

//         if (!isRegistered) {
//             console.error('[LOBBY] ❌ Player not registered');
//             Alert.alert('Error', t('Still connecting, please try again in a moment'));
//             return;
//         }

//         console.log('[LOBBY] ✅ All preconditions met - starting search');

//         setIsSearching(true);
//         isSearchingRef.current = true;
//         setMatchFound(false);
//         setOpponentData(null);
//         pendingGameStartData.current = null;
//         readyToNavigateRef.current = false;
//         hasNavigatedRef.current = false;

//         const playerRating = playerRatingRef.current;
//         console.log('[LOBBY] ⭐ Using rating for lobby join:', playerRating);

//         const lobbyData = {
//             diff: diffCode || difficulty,
//             timer: timer,
//             symbol: symbol,
//             rating: playerRating,
//             qm: qm,
//         };

//         console.log('[LOBBY] 🚪 Joining lobby with data:', lobbyData);
//         socketRef.current.emit('join-lobby', lobbyData);
//         console.log('[LOBBY] ✅ join-lobby emitted');

//         Animated.spring(scaleAnim, {
//             toValue: 0.95,
//             tension: 150,
//             friction: 4,
//             useNativeDriver: true,
//         }).start();
//     };

//     /* ================= CANCEL SEARCH HANDLER ================= */
//     const handleCancelSearch = () => {
//         console.log('[LOBBY] ❌ handleCancelSearch() called');

//         setIsSearching(false);
//         isSearchingRef.current = false;
//         setMatchFound(false);
//         setOpponentData(null);
//         pendingGameStartData.current = null;
//         readyToNavigateRef.current = false;

//         if (socketRef.current?.connected) {
//             console.log('[LOBBY] 📤 Emitting cancel_search event');
//             socketRef.current.emit('cancel_search');
//         } else {
//             console.log('[LOBBY] ⚠️ Socket not connected, cannot cancel search');
//         }

//         Animated.spring(scaleAnim, {
//             toValue: 1,
//             tension: 150,
//             friction: 4,
//             useNativeDriver: true,
//         }).start();
//     };

//     const displayRating = getPlayerRating(player);

//     console.log('[LOBBY] 📊 Render: Current UI state');
//     console.log('[LOBBY]   - isSearching:', isSearching);
//     console.log('[LOBBY]   - matchFound:', matchFound);
//     console.log('[LOBBY]   - displayRating:', displayRating);
//     console.log('[LOBBY]   - player:', player?.username);
//     console.log('[LOBBY]   - opponent:', opponentData?.username);

//     return (
//         <LinearGradient
//             colors={theme.backgroundGradient || ['#0B1220', '#0B1220']}
//             style={styles.container}>
//             <View style={styles.header}>
//                 <Text style={[styles.headerTitle, { color: theme.text || '#ffffff' }]}>
//                     {t('Game Lobby')}
//                 </Text>
//                 <TouchableOpacity onPress={() => navigation.goBack()}>
//                     <X color={theme.text || '#ffffff'} size={24} />
//                 </TouchableOpacity>
//             </View>

//             <Animated.View
//                 style={[styles.content, { transform: [{ scale: scaleAnim }] }]}>
//                 <View
//                     style={[
//                         styles.playerCard,
//                         {
//                             backgroundColor:
//                                 theme.cardBackground || 'rgba(255, 255, 255, 0.1)',
//                             borderColor: theme.borderColor || 'rgba(255, 255, 255, 0.2)',
//                         },
//                     ]}>
//                     <View style={styles.ratingSection}>
//                         <Star color="#ffd700" size={20} />
//                         <Text style={[styles.ratingText, { color: theme.text || '#ffffff' }]}>
//                             {`${t('Rating')}: ${displayRating}`}
//                             {diffCode ? `  [${diffCode}]` : ''}
//                         </Text>
//                     </View>
//                     <Text
//                         style={[
//                             styles.playerName,
//                             { color: theme.secondaryText || '#90caf9' },
//                         ]}>
//                         {player?.username || t('Player')}
//                     </Text>
//                 </View>

//                 <View
//                     style={[
//                         styles.matchCard,
//                         {
//                             backgroundColor:
//                                 theme.cardBackground || 'rgba(255, 255, 255, 0.05)',
//                             borderColor: theme.borderColor || 'rgba(255, 255, 255, 0.1)',
//                         },
//                     ]}>
//                     {!isSearching ? (
//                         <View style={styles.readyState}>
//                             <View
//                                 style={[
//                                     styles.iconContainer,
//                                     { backgroundColor: theme.iconBg || 'rgba(144, 202, 249, 0.1)' },
//                                 ]}>
//                                 <Search color={theme.secondaryText || '#90caf9'} size={48} />
//                             </View>
//                             <Text
//                                 style={[styles.statusTitle, { color: theme.text || '#ffffff' }]}>
//                                 {t('Ready to Find Match')}
//                             </Text>
//                             <Text
//                                 style={[
//                                     styles.statusSubtitle,
//                                     { color: theme.secondaryText || '#90caf9' },
//                                 ]}>
//                                 {t("You'll be matched with players of similar rating")}
//                             </Text>

//                             <TouchableOpacity
//                                 style={[
//                                     styles.searchButton,
//                                     { backgroundColor: theme.primary || '#FB923C' },
//                                 ]}
//                                 onPress={handleStartSearch}>
//                                 <Text
//                                     style={[
//                                         styles.searchButtonText,
//                                         { color: theme.buttonText || '#ffffff' },
//                                     ]}>
//                                     {t('Find Match')}
//                                 </Text>
//                             </TouchableOpacity>
//                         </View>
//                     ) : (
//                         <View style={styles.searchingState}>
//                             <Animated.View
//                                 style={[
//                                     styles.searchIconContainer,
//                                     !matchFound && {
//                                         transform: [{ scale: pulseAnim }],
//                                     },
//                                     { backgroundColor: theme.iconBg || 'rgba(144, 202, 249, 0.1)' },
//                                 ]}>
//                                 {matchFound && opponentData ? (
//                                     <Animated.Image
//                                         source={{
//                                             uri: DUMMY_AVATARS[0],
//                                         }}
//                                         style={[
//                                             styles.avatarImage,
//                                             { opacity: 1, borderColor: theme.success || '#4ade80' },
//                                         ]}
//                                     />
//                                 ) : (
//                                     <Animated.Image
//                                         key={dummyIdx}
//                                         source={{ uri: DUMMY_AVATARS[dummyIdx] }}
//                                         style={styles.avatarImage}
//                                     />
//                                 )}
//                             </Animated.View>

//                             <Text
//                                 style={[
//                                     styles.searchingTitle,
//                                     { color: theme.text || '#ffffff' },
//                                 ]}>
//                                 {matchFound ? t('Opponent Found!') : t('Finding opponent...')}
//                             </Text>
//                             <Text
//                                 style={[
//                                     styles.searchingSubtitle,
//                                     { color: theme.secondaryText || '#90caf9' },
//                                 ]}>
//                                 {matchFound
//                                     ? `${t('Playing against')} ${opponentData?.username || t('Opponent')}`
//                                     : `${t('Looking for players with rating')} ${displayRating - 100} - ${displayRating + 100}`}
//                             </Text>

//                             {matchFound && (
//                                 <Text
//                                     style={{
//                                         color: theme.success || '#4ade80',
//                                         fontSize: 16,
//                                         fontWeight: 'bold',
//                                         marginTop: 10,
//                                     }}>
//                                     {t('Ready to Battle...')}
//                                 </Text>
//                             )}

//                             {!matchFound && (
//                                 <TouchableOpacity
//                                     style={[
//                                         styles.cancelButton,
//                                         {
//                                             borderColor: theme.warning || '#ff9800',
//                                             backgroundColor: (theme.warning || '#ff9800') + '33',
//                                         },
//                                     ]}
//                                     onPress={handleCancelSearch}>
//                                     <Text
//                                         style={[
//                                             styles.cancelButtonText,
//                                             { color: theme.warning || '#ff9800' },
//                                         ]}>
//                                         {t('Cancel Search')}
//                                     </Text>
//                                 </TouchableOpacity>
//                             )}
//                         </View>
//                     )}
//                 </View>
//             </Animated.View>
//         </LinearGradient>
//     );
// }


// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { useState, useEffect, useRef } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     TouchableOpacity,
//     Animated,
//     Image,
//     Alert,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { Search, X, Users, Clock, Star } from 'lucide-react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useSocket, useSocketState } from '../context/Socket';
// import { useTheme } from '../context/ThemeContext';
// import { useAppTranslation } from '../context/TranslationContext';

// export default function Lobby() {
//     const socket = useSocket();
//     const { isRegistered } = useSocketState();
//     const { theme } = useTheme();
//     const route = useRoute();
//     const { difficulty, diffCode, digit, symbol, timer, qm } = route.params;
//     const navigation = useNavigation();
//     const { t } = useAppTranslation();

//     console.log('[LOBBY] 🎬 Lobby component mounted');
//     console.log('[LOBBY] Route params:', { difficulty, diffCode, digit, symbol, timer, qm });

//     /* ================= STATE ================= */
//     const [isSearching, setIsSearching] = useState(false);
//     const [player, setPlayer] = useState(null);
//     const [matchFound, setMatchFound] = useState(false);
//     const [opponentData, setOpponentData] = useState(null);
//     const [dummyIdx, setDummyIdx] = useState(0);

//     const [isRejoining, setIsRejoining] = useState(false);

//     // ✅ FIX: New state to track when player-registered has been processed.
//     // Auto-search is gated on this so join-lobby is never emitted before
//     // the backend confirms whether an active game exists (hasActiveGame).
//     // ✅ FIX 2: Initialize to isRegistered — if player-registered already
//     // fired before Lobby mounted (common on warm start), we don't hang forever
//     // waiting for an event that already passed. In that case hasActiveGame
//     // would be false (or backend would re-push rejoin-game), so it's safe
//     // to proceed directly to matchmaking.
//     const [playerRegistered, setPlayerRegistered] = useState(isRegistered);

//     const DUMMY_AVATARS = [
//         'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg',
//         'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671122.jpg',
//         'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg',
//     ];

//     /* ================= REFS ================= */
//     const pulseAnim = useRef(new Animated.Value(1)).current;
//     const rotateAnim = useRef(new Animated.Value(0)).current;
//     const scaleAnim = useRef(new Animated.Value(1)).current;

//     const readyToNavigateRef = useRef(false);
//     const pendingGameStartData = useRef(null);
//     const hasNavigatedRef = useRef(false);
//     const socketRef = useRef(null);
//     const opponentRef = useRef(null);
//     const myMongoIdRef = useRef(null);

//     const isSearchingRef = useRef(false);
//     const handleGameStartedRef = useRef(null);
//     const handleMatchFoundRef = useRef(null);

//     const playerRatingRef = useRef(1000);

//     const rejoinBlockedRef = useRef(false);
//     const activeGameIdRef = useRef(null);

//     // ✅ FIX: Ref mirror of playerRegistered state so handleStartSearch
//     // can read it synchronously without stale closure issues.
//     // ✅ FIX 2: Initialize to isRegistered for same reason as state above.
//     const playerRegisteredRef = useRef(isRegistered);

//     const getPlayerRating = (playerData) => {
//         if (!playerData) return 1000;
//         const byDiffCode = playerData?.pr?.pvpByDiffCode?.[diffCode];
//         if (byDiffCode !== undefined) {
//             if (typeof byDiffCode === 'number') return byDiffCode;
//         }
//         return playerData?.pr?.pvp?.[difficulty] || 1000;
//     };

//     /* ================= EFFECT 1: Load User Data ================= */
//     useEffect(() => {
//         const getUserData = async () => {
//             console.log('[LOBBY] 📊 EFFECT 1: Loading user data...');
//             try {
//                 const userData = await AsyncStorage.getItem('userData');
//                 if (userData) {
//                     const user = JSON.parse(userData);
//                     console.log('[LOBBY] ✅ User Info loaded:', {
//                         username: user.username,
//                         id: user._id || user.id,
//                     });
//                     console.log('[LOBBY] 💰 PR data:', JSON.stringify(user?.pr, null, 2));
//                     setPlayer(user);

//                     const mongoId = user._id || user.id;
//                     if (!mongoId) {
//                         console.error('[LOBBY] ❌ No MongoDB ID found in user data!');
//                         Alert.alert('Error', t('User ID not found. Please login again.'));
//                         navigation.goBack();
//                         return;
//                     }

//                     myMongoIdRef.current = mongoId;
//                     console.log('[LOBBY] ✅ MongoDB ID set:', mongoId);
//                 } else {
//                     console.error('[LOBBY] ❌ No user data in AsyncStorage');
//                     Alert.alert('Error', t('Please login first'));
//                     navigation.goBack();
//                 }
//             } catch (error) {
//                 console.error('[LOBBY] ❌ Error loading user data:', error);
//                 Alert.alert('Error', t('Failed to load user data'));
//             }
//         };
//         getUserData();
//     }, []);

//     /* ================= EFFECT: Sync playerRatingRef ================= */
//     useEffect(() => {
//         playerRatingRef.current = getPlayerRating(player);
//         console.log('[LOBBY] 🔄 EFFECT: playerRatingRef updated to:', playerRatingRef.current);
//         console.log('[LOBBY] Player state changed:', {
//             username: player?.username,
//             pvp: player?.pr?.pvp,
//             pvpByDiffCode: player?.pr?.pvpByDiffCode,
//         });
//     }, [player]);

//     /* ================= EFFECT: Auto Start Search ================= */
//     // ✅ FIX: Added `playerRegistered` as a dependency and guard condition.
//     // This ensures auto-search only fires AFTER player-registered event
//     // has been processed, so rejoinBlockedRef is guaranteed to be set
//     // correctly before join-lobby is ever emitted. Eliminates the race
//     // where isRegistered flipped true but player-registered hadn't arrived yet.
//     useEffect(() => {
//         console.log('[LOBBY] 🔍 EFFECT: Auto Start Search checking...');
//         console.log('[LOBBY] Conditions: player:', !!player, 'isRegistered:', isRegistered, 'playerRegistered:', playerRegistered, 'isRejoining:', isRejoining, 'isSearching:', isSearchingRef.current, 'rejoinBlocked:', rejoinBlockedRef.current);

//         if (player && isRegistered && playerRegistered && !isRejoining && !isSearchingRef.current && !rejoinBlockedRef.current) {
//             console.log('[LOBBY] ✅ All conditions met - Auto starting matchmaking...');
//             handleStartSearch();
//         } else {
//             console.log('[LOBBY] ⏳ Waiting - player:', !!player, 'isRegistered:', isRegistered, 'playerRegistered:', playerRegistered, 'isRejoining:', isRejoining, 'notSearching:', !isSearchingRef.current, 'rejoinBlocked:', rejoinBlockedRef.current);
//         }
//     }, [player, isRegistered, playerRegistered, isRejoining]); // ✅ FIX: added playerRegistered dep

//     /* ================= EFFECT 2: Dummy Avatar Animation ================= */
//     useEffect(() => {
//         let dummyInterval;
//         let pulseAnimation;
//         let rotateAnimation;

//         if (isSearching && !matchFound) {
//             dummyInterval = setInterval(() => {
//                 setDummyIdx(prev => (prev + 1) % DUMMY_AVATARS.length);
//             }, 600);

//             pulseAnimation = Animated.loop(
//                 Animated.sequence([
//                     Animated.timing(pulseAnim, {
//                         toValue: 1.1,
//                         duration: 800,
//                         useNativeDriver: true,
//                     }),
//                     Animated.timing(pulseAnim, {
//                         toValue: 1,
//                         duration: 800,
//                         useNativeDriver: true,
//                     }),
//                 ]),
//             );

//             rotateAnimation = Animated.loop(
//                 Animated.timing(rotateAnim, {
//                     toValue: 1,
//                     duration: 2000,
//                     useNativeDriver: true,
//                 }),
//             );

//             pulseAnimation.start();
//             rotateAnimation.start();
//         }

//         return () => {
//             if (dummyInterval) clearInterval(dummyInterval);
//             if (pulseAnimation) pulseAnimation.stop();
//             if (rotateAnimation) rotateAnimation.stop();
//             pulseAnim.setValue(1);
//             rotateAnim.setValue(0);
//         };
//     }, [isSearching, matchFound, pulseAnim, rotateAnim]);

//     /* ================= EFFECT 3: Cleanup on Unmount ================= */
//     useEffect(() => {
//         console.log('[LOBBY] ⚙️ EFFECT 3: Mounted - Cleanup on unmount registered');

//         return () => {
//             console.log('[LOBBY] 🧹 EFFECT 3: Cleanup - Component unmounting');
//             if (isSearchingRef.current && socketRef.current?.connected) {
//                 console.log('[LOBBY] 🧹 Cancelling search on unmount');
//                 socketRef.current.emit('cancel_search');
//             }

//             readyToNavigateRef.current = false;
//             hasNavigatedRef.current = false;
//             pendingGameStartData.current = null;
//             opponentRef.current = null;
//             rejoinBlockedRef.current = false;
//             activeGameIdRef.current = null;
//             // ✅ FIX: also reset playerRegisteredRef on unmount
//             playerRegisteredRef.current = false;
//             console.log('[LOBBY] ✅ Refs cleaned up');
//         };
//     }, []);

//     /* ================= EFFECT 4: Socket Listeners ================= */
//     useEffect(() => {
//         console.log('[LOBBY] 🔌 EFFECT 4: Socket Listeners - Setting up...');

//         if (!socket) {
//             console.warn('[LOBBY] ⚠️ Socket not available');
//             return;
//         }

//         console.log('[LOBBY] ✅ Socket available - socket.id:', socket.id);
//         socketRef.current = socket;
//         console.log('[LOBBY] ✅ socketRef.current set');

//         const handleConnect = () => {
//             console.log('[LOBBY] 🟢 Socket: connect event fired');
//             console.log('[LOBBY] Socket connected state:', socket.connected);
//             console.log('[LOBBY] Socket ID:', socket.id);
//         };

//         const handleDisconnect = reason => {
//             console.log('[LOBBY] 🔴 Socket: disconnect event fired');
//             console.log('[LOBBY] Disconnect reason:', reason);
//             if (isSearchingRef.current) {
//                 console.log('[LOBBY] ❌ Was searching - cancelling search due to disconnect');
//                 setIsSearching(false);
//                 isSearchingRef.current = false;
//                 setMatchFound(false);
//                 Alert.alert('Disconnected', t('Connection lost. Please try again.'));
//             }
//         };

//         const handleLobbyJoined = data => {
//             console.log('[LOBBY] 📥 Socket: lobby-joined event received');
//             console.log('[LOBBY] Lobby joined data:', data);
//             if (data.success && data.player?.id) {
//                 console.log('[LOBBY] ✅ My MongoDB ID confirmed:', data.player.id);
//                 myMongoIdRef.current = data.player.id;

//                 if (data.player?.rating !== undefined) {
//                     console.log('[LOBBY] ⭐ Rating from server:', data.player.rating);
//                     console.log('[LOBBY] Current diffCode:', diffCode);
//                     playerRatingRef.current = data.player.rating;
//                     setPlayer(prevPlayer => ({
//                         ...prevPlayer,
//                         pr: {
//                             ...prevPlayer?.pr,
//                             pvpByDiffCode: {
//                                 ...prevPlayer?.pr?.pvpByDiffCode,
//                                 [diffCode]: data.player.rating,
//                             },
//                             pvp: {
//                                 ...prevPlayer?.pr?.pvp,
//                                 [difficulty]: data.player.rating,
//                             },
//                         },
//                     }));
//                 }
//             } else {
//                 console.error('[LOBBY] ❌ Invalid lobby-joined response:', data);
//             }
//         };

//         const handleMatchFound = ({
//             gameRoom,
//             opponent,
//             myPlayerId,
//             initialQuestionMeter,
//         }) => {
//             console.log('[LOBBY] ✅ Socket: match-found event received');
//             console.log('[LOBBY] 📊 Match Data:', {
//                 opponent: opponent?.username,
//                 opponentId: opponent?.id,
//                 opponentRating: opponent?.rating,
//                 myPlayerId,
//                 initialQuestionMeter,
//             });

//             if (!opponent?.id || !opponent?.username) {
//                 console.error('[LOBBY] ❌ Invalid opponent data:', opponent);
//                 Alert.alert('Error', t('Invalid match data received'));
//                 setIsSearching(false);
//                 isSearchingRef.current = false;
//                 return;
//             }

//             const opponentInfo = {
//                 id: opponent.id,
//                 username: opponent.username,
//                 rating: opponent.rating || 1000,
//                   profilePic: opponent.profileImage || opponent.profilePic || opponent.avatar || null, // ✅ ADD THIS

//                 stats: opponent.stats || {
//                     wins: 0,
//                     losses: 0,
//                     winRate: 0,
//                     currentStreak: 0,
//                 },
//             };

//             myMongoIdRef.current = myPlayerId;
//             opponentRef.current = opponentInfo;

//             console.log('[LOBBY] ✅ Opponent data saved:', opponentInfo);

//             setOpponentData(opponentInfo);
//             setMatchFound(true);
//             hasNavigatedRef.current = false;

//             console.log('[LOBBY] ⏳ Starting 2s delay before navigation...');
//             setTimeout(() => {
//                 readyToNavigateRef.current = true;
//                 console.log('[LOBBY] ✅ readyToNavigateRef set to true');
//                 if (pendingGameStartData.current) {
//                     console.log('[LOBBY] 🚀 Navigating to Game (Delayed trigger)');
//                     navigateToGame(pendingGameStartData.current);
//                 } else {
//                     console.log('[LOBBY] ⏳ No pendingGameStartData yet, waiting for game-started event');
//                 }
//             }, 2000);
//         };

//         const handleGameStarted = data => {
//             console.log('[LOBBY] 🚀 Socket: game-started event received');
//             console.log('[LOBBY] Game started data:', data);

//             if (!data.currentQuestion) {
//                 console.error('[LOBBY] ❌ No current question in game-started:', data);
//                 Alert.alert('Error', t('Invalid game data received'));
//                 setIsSearching(false);
//                 isSearchingRef.current = false;
//                 setMatchFound(false);
//                 return;
//             }

//             console.log('[LOBBY] readyToNavigateRef:', readyToNavigateRef.current);
//             if (readyToNavigateRef.current) {
//                 console.log('[LOBBY] 🎮 readyToNavigateRef is true - navigating NOW');
//                 navigateToGame(data);
//             } else {
//                 console.log('[LOBBY] ⏳ Waiting for Match Found animation to complete...');
//                 pendingGameStartData.current = data;
//             }
//         };

//         // ✅ FIX: handlePlayerRegistered now sets playerRegisteredRef + calls
//         // setPlayerRegistered(true) so the auto-search effect re-runs only
//         // after this event is fully processed — rejoinBlockedRef is guaranteed
//         // to be correct before auto-search can ever call handleStartSearch.
// const handlePlayerRegisteredForwarded = data => {
//             console.log('[LOBBY] 📊 Socket: player-registered event received');
//             console.log('[LOBBY] Player registered data:', data);

//             if (data?.player?.rating !== undefined) {
//                 console.log('[LOBBY] ✅ Updating player with new rating:', data.player.rating);
//                 playerRatingRef.current = data.player.rating;
//                 setPlayer(prevPlayer => ({
//                     ...prevPlayer,
//                     pr: {
//                         ...prevPlayer?.pr,
//                         pvpByDiffCode: {
//                             ...prevPlayer?.pr?.pvpByDiffCode,
//                             [diffCode]: data.player.rating,
//                         },
//                         pvp: {
//                             ...prevPlayer?.pr?.pvp,
//                             [difficulty]: data.player.rating,
//                         },
//                     },
//                 }));
//             }

//             if (data?.hasActiveGame) {
//                 console.log('[LOBBY] 🎮 hasActiveGame=true — gameId:', data.gameId, '— waiting for rejoin-game push');
//                 rejoinBlockedRef.current = true;
//                 activeGameIdRef.current = data.gameId || null;
//                 setIsRejoining(true);
//             } else {
//                 console.log('[LOBBY] ✅ hasActiveGame=false — normal matchmaking flow');
//                 rejoinBlockedRef.current = false;
//                 activeGameIdRef.current = null;
//                 setIsRejoining(false);
//             }

//             // ✅ FIX: Mark player-registered as processed AFTER rejoinBlockedRef
//             // is already set above — state update triggers auto-search effect
//             // re-run only now, so rejoinBlockedRef check inside the effect
//             // and inside handleStartSearch will always see the correct value.
//             playerRegisteredRef.current = true;
//             setPlayerRegistered(true);
//         };

//         const handleRejoinGame = data => {
//             console.log('[LOBBY] 🔄 Socket: rejoin-game received');
//             console.log('[LOBBY] rejoin-game data:', data);

//             if (!rejoinBlockedRef.current) {
//                 console.log('[LOBBY] 🛑 rejoin-game received but hasActiveGame was never confirmed true — ignoring');
//                 return;
//             }

//             setIsSearching(false);
//             isSearchingRef.current = false;
//             setMatchFound(false);

//             if (hasNavigatedRef.current) {
//                 console.log('[LOBBY] 🛑 Already navigated, ignoring rejoin-game');
//                 return;
//             }

//             console.log('[LOBBY] 📤 Emitting reconnect-to-game');
//             socket.emit('reconnect-to-game', { gameId: data?.gameId || activeGameIdRef.current });
//         };

//         const handleGameReconnected = data => {
//             console.log('[LOBBY] ✅ Socket: game-reconnected received — restoring game');
//             console.log('[LOBBY] game-reconnected data:', JSON.stringify(data, null, 2));

//             if (hasNavigatedRef.current) {
//                 console.log('[LOBBY] 🛑 Already navigated, ignoring game-reconnected');
//                 return;
//             }

//             hasNavigatedRef.current = true;

//             const gameState = data?.gameState || {};
//             const currentQuestion = data?.currentQuestion;
//             const myPlayerId = data?.myPlayerId || myMongoIdRef.current;

//             let opponentId = null;
//             if (gameState?.playerScores) {
//                 opponentId = Object.keys(gameState.playerScores).find(
//                     id => id !== myPlayerId,
//                 );
//             }

//             const reconnectOpponent = opponentRef.current || {
//                 id: opponentId || 'unknown',
//                 username: data?.opponentUsername || t('Opponent'),
//                 rating: 1000,
//             };

//             if (!currentQuestion) {
//                 console.error('[LOBBY] ❌ game-reconnected has no currentQuestion — cannot restore game');
//                 rejoinBlockedRef.current = false;
//                 activeGameIdRef.current = null;
//                 hasNavigatedRef.current = false;
//                 setIsRejoining(false);
//                 return;
//             }

//             console.log('[LOBBY] 🚀 Navigating to MultiPlayerGame via game-reconnected');
//             navigation.replace('MultiPlayerGame', {
//                 currentQuestion,
//                 timer,
//                 opponent: reconnectOpponent,
//                 myMongoId: myPlayerId,
//                 difficulty,
//                 diffCode,
//                 gameRoomId: data?.gameRoomId || data?.roomId || activeGameIdRef.current || null,
//                 gameStartedAt: gameState?.gameStartedAt,
//                 totalGameTime: gameState?.totalGameTime,
//                 restoredMyScore: gameState?.playerScores?.[myPlayerId]?.score
//                     ?? gameState?.playerScores?.[myPlayerId]
//                     ?? 0,
//                 restoredOpponentScore: opponentId
//                     ? (gameState?.playerScores?.[opponentId]?.score
//                         ?? gameState?.playerScores?.[opponentId]
//                         ?? 0)
//                     : 0,
//             });
//         };

//         const handleReconnectFailed = data => {
//             console.log('[LOBBY] ❌ Socket: reconnect-failed received:', data);
//             if (hasNavigatedRef.current) return;
//             rejoinBlockedRef.current = false;
//             activeGameIdRef.current = null;
//             setIsRejoining(false);
//         };

//         const handleError = error => {
//             console.error('[LOBBY] ❌ Socket error:', error);
//             Alert.alert('Error', error.message || 'An error occurred');
//             setIsSearching(false);
//             isSearchingRef.current = false;
//             setMatchFound(false);
//         };
        

//         handleGameStartedRef.current = handleGameStarted;
//         handleMatchFoundRef.current = handleMatchFound;

//         console.log('[LOBBY] 🧹 Removing old socket listeners (if any)...');
//         socket.off('connect', handleConnect);
//         socket.off('disconnect', handleDisconnect);
//         socket.off('lobby-joined', handleLobbyJoined);
//         socket.off('match-found', handleMatchFound);
//         socket.off('game-started', handleGameStarted);
//        socket.off('_player-registered-forwarded', handlePlayerRegisteredForwarded);
//         socket.off('rejoin-game', handleRejoinGame);
//         socket.off('game-reconnected', handleGameReconnected);
//         socket.off('reconnect-failed', handleReconnectFailed);
//         socket.off('error', handleError);

//         console.log('[LOBBY] 🔌 Adding new socket listeners...');
//         socket.on('connect', handleConnect);
//         socket.on('disconnect', handleDisconnect);
//         socket.on('lobby-joined', handleLobbyJoined);
//         socket.on('match-found', handleMatchFound);
//         socket.on('game-started', handleGameStarted);
//         socket.on('_player-registered-forwarded', handlePlayerRegisteredForwarded);
//         socket.on('rejoin-game', handleRejoinGame);
//         socket.on('game-reconnected', handleGameReconnected);
//         socket.on('reconnect-failed', handleReconnectFailed);
//         socket.on('error', handleError);

//         console.log('[LOBBY] ✅ All listeners attached');

//         return () => {
//             console.log('[LOBBY] 🧹 Cleanup: Removing all socket listeners');
//             socket.off('connect', handleConnect);
//             socket.off('disconnect', handleDisconnect);
//             socket.off('lobby-joined', handleLobbyJoined);
//             socket.off('match-found', handleMatchFound);
//             socket.off('game-started', handleGameStarted);
//             socket.off('_player-registered-forwarded', handlePlayerRegisteredForwarded);
//             socket.off('rejoin-game', handleRejoinGame);
//             socket.off('game-reconnected', handleGameReconnected);
//             socket.off('reconnect-failed', handleReconnectFailed);
//             socket.off('error', handleError);
//         };
//     }, [socket]);

//     /* ================= NAVIGATION HELPER ================= */
//     const navigateToGame = ({ gameState, currentQuestion, myPlayerId }) => {
//         console.log('[LOBBY] 🎮 navigateToGame() called');

//         if (hasNavigatedRef.current) {
//             console.log('[LOBBY] 🛑 Already navigated to game, skipping duplicate.');
//             return;
//         }

//         if (!currentQuestion) {
//             console.error('[LOBBY] ❌ Cannot navigate: No current question');
//             Alert.alert('Error', 'Game data is missing');
//             setIsSearching(false);
//             isSearchingRef.current = false;
//             setMatchFound(false);
//             return;
//         }

//         const finalMongoId = myPlayerId || myMongoIdRef.current;
//         const finalOpponent = opponentRef.current;

//         if (!finalMongoId) {
//             console.error('[LOBBY] ❌ Cannot navigate: No MongoDB ID');
//             Alert.alert('Error', t('Player ID is missing'));
//             setIsSearching(false);
//             isSearchingRef.current = false;
//             setMatchFound(false);
//             return;
//         }

//         if (!finalOpponent?.id) {
//             console.error('[LOBBY] ❌ Cannot navigate: No opponent data');
//             Alert.alert('Error', t('Opponent data is missing'));
//             setIsSearching(false);
//             isSearchingRef.current = false;
//             setMatchFound(false);
//             return;
//         }

//         hasNavigatedRef.current = true;
//         console.log('[LOBBY] ✅ hasNavigatedRef set to true');

//         console.log('[LOBBY] 🎮 Navigation params:');
//         console.log('[LOBBY]   - My MongoDB ID:', finalMongoId);
//         console.log('[LOBBY]   - Opponent:', finalOpponent);
//         console.log('[LOBBY]   - Question present:', !!currentQuestion);
//         console.log('[LOBBY]   - diffCode:', diffCode);

//         if (socketRef.current) {
//             if (handleGameStartedRef.current) {
//                 console.log('[LOBBY] 🧹 Removing game-started listener');
//                 socketRef.current.off('game-started', handleGameStartedRef.current);
//             }
//             if (handleMatchFoundRef.current) {
//                 console.log('[LOBBY] 🧹 Removing match-found listener');
//                 socketRef.current.off('match-found', handleMatchFoundRef.current);
//             }
//         }

//         console.log('[LOBBY] 🚀 Navigating to MultiPlayerGame screen');
//         navigation.replace('MultiPlayerGame', {
//             currentQuestion,
//             timer,
//             opponent: finalOpponent,
//             myMongoId: finalMongoId,
//             difficulty,
//             diffCode,
//             gameStartedAt: gameState?.gameStartedAt,
//             totalGameTime: gameState?.totalGameTime,
//         });

//         setTimeout(() => {
//             setIsSearching(false);
//             isSearchingRef.current = false;
//             setMatchFound(false);
//             setOpponentData(null);
//             pendingGameStartData.current = null;
//             readyToNavigateRef.current = false;
//             hasNavigatedRef.current = false;
//             console.log('[LOBBY] ✅ Lobby cleanup complete after navigation');
//         }, 500);
//     };

//     /* ================= START SEARCH HANDLER ================= */
//     const handleStartSearch = () => {
//         console.log('[LOBBY] 🔍 handleStartSearch() called');

//         if (isSearchingRef.current) {
//             console.log('[LOBBY] ⚠️ Already searching, ignoring duplicate call');
//             return;
//         }

//         if (rejoinBlockedRef.current) {
//             console.log('[LOBBY] 🛑 join-lobby blocked — active game pending reconnect');
//             return;
//         }

//         // ✅ FIX: Also guard on playerRegisteredRef so if handleStartSearch
//         // is ever called manually before player-registered arrives, it bails
//         // out safely instead of emitting join-lobby with an uncertain state.
//         if (!playerRegisteredRef.current) {
//             console.log('[LOBBY] 🛑 join-lobby blocked — player-registered not yet received');
//             return;
//         }

//         if (!socketRef.current?.connected) {
//             console.error('[LOBBY] ❌ Socket not connected');
//             Alert.alert('Error', t('Socket not connected'));
//             return;
//         }

//         if (!isRegistered) {
//             console.error('[LOBBY] ❌ Player not registered');
//             Alert.alert('Error', t('Still connecting, please try again in a moment'));
//             return;
//         }

//         console.log('[LOBBY] ✅ All preconditions met - starting search');

//         setIsSearching(true);
//         isSearchingRef.current = true;
//         setMatchFound(false);
//         setOpponentData(null);
//         pendingGameStartData.current = null;
//         readyToNavigateRef.current = false;
//         hasNavigatedRef.current = false;

//         const playerRating = playerRatingRef.current;
//         console.log('[LOBBY] ⭐ Using rating for lobby join:', playerRating);

//         const lobbyData = {
//             diff: diffCode || difficulty,
//             timer: timer,
//             symbol: symbol,
//             rating: playerRating,
//             qm: qm,
//         };

//         console.log('[LOBBY] 🚪 Joining lobby with data:', lobbyData);
//         socketRef.current.emit('join-lobby', lobbyData);
//         console.log('[LOBBY] ✅ join-lobby emitted');

//         Animated.spring(scaleAnim, {
//             toValue: 0.95,
//             tension: 150,
//             friction: 4,
//             useNativeDriver: true,
//         }).start();
//     };

//     /* ================= CANCEL SEARCH HANDLER ================= */
//     const handleCancelSearch = () => {
//         console.log('[LOBBY] ❌ handleCancelSearch() called');

//         setIsSearching(false);
//         isSearchingRef.current = false;
//         setMatchFound(false);
//         setOpponentData(null);
//         pendingGameStartData.current = null;
//         readyToNavigateRef.current = false;

//         if (socketRef.current?.connected) {
//             console.log('[LOBBY] 📤 Emitting cancel_search event');
//             socketRef.current.emit('cancel_search');
//         } else {
//             console.log('[LOBBY] ⚠️ Socket not connected, cannot cancel search');
//         }

//         Animated.spring(scaleAnim, {
//             toValue: 1,
//             tension: 150,
//             friction: 4,
//             useNativeDriver: true,
//         }).start();
//     };

//     const displayRating = getPlayerRating(player);

//     console.log('[LOBBY] 📊 Render: Current UI state');
//     console.log('[LOBBY]   - isSearching:', isSearching);
//     console.log('[LOBBY]   - matchFound:', matchFound);
//     console.log('[LOBBY]   - isRejoining:', isRejoining);
//     console.log('[LOBBY]   - displayRating:', displayRating);
//     console.log('[LOBBY]   - player:', player?.username);
//     console.log('[LOBBY]   - opponent:', opponentData?.username);

//     /* ================= REJOIN SCREEN ================= */
//     if (isRejoining) {
//         return (
//             <LinearGradient
//                 colors={theme.backgroundGradient || ['#0B1220', '#0B1220']}
//                 style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//                 <Text style={{ color: theme.text || '#ffffff', fontSize: 18, fontWeight: '700' }}>
//                     {t('Reconnecting to your game...')}
//                 </Text>
//                 <Text style={{ color: theme.secondaryText || '#90caf9', marginTop: 8 }}>
//                     {t('Please wait')}
//                 </Text>
//             </LinearGradient>
//         );
//     }

//     return (
//         <LinearGradient
//             colors={theme.backgroundGradient || ['#0B1220', '#0B1220']}
//             style={styles.container}>
//             <View style={styles.header}>
//                 <Text style={[styles.headerTitle, { color: theme.text || '#ffffff' }]}>
//                     {t('Game Lobby')}
//                 </Text>
//                 <TouchableOpacity onPress={() => navigation.goBack()}>
//                     <X color={theme.text || '#ffffff'} size={24} />
//                 </TouchableOpacity>
//             </View>

//             <Animated.View
//                 style={[styles.content, { transform: [{ scale: scaleAnim }] }]}>
//                 <View
//                     style={[
//                         styles.playerCard,
//                         {
//                             backgroundColor:
//                                 theme.cardBackground || 'rgba(255, 255, 255, 0.1)',
//                             borderColor: theme.borderColor || 'rgba(255, 255, 255, 0.2)',
//                         },
//                     ]}>
//                     <View style={styles.ratingSection}>
//                         <Star color="#ffd700" size={20} />
//                         <Text style={[styles.ratingText, { color: theme.text || '#ffffff' }]}>
//                             {`${t('Rating')}: ${displayRating}`}
//                             {diffCode ? `  [${diffCode}]` : ''}
//                         </Text>
//                     </View>
//                     <Text
//                         style={[
//                             styles.playerName,
//                             { color: theme.secondaryText || '#90caf9' },
//                         ]}>
//                         {player?.username || t('Player')}
//                     </Text>
//                 </View>

//                 <View
//                     style={[
//                         styles.matchCard,
//                         {
//                             backgroundColor:
//                                 theme.cardBackground || 'rgba(255, 255, 255, 0.05)',
//                             borderColor: theme.borderColor || 'rgba(255, 255, 255, 0.1)',
//                         },
//                     ]}>
//                     {!isSearching ? (
//                         <View style={styles.readyState}>
//                             <View
//                                 style={[
//                                     styles.iconContainer,
//                                     { backgroundColor: theme.iconBg || 'rgba(144, 202, 249, 0.1)' },
//                                 ]}>
//                                 <Search color={theme.secondaryText || '#90caf9'} size={48} />
//                             </View>
//                             <Text
//                                 style={[styles.statusTitle, { color: theme.text || '#ffffff' }]}>
//                                 {t('Ready to Find Match')}
//                             </Text>
//                             <Text
//                                 style={[
//                                     styles.statusSubtitle,
//                                     { color: theme.secondaryText || '#90caf9' },
//                                 ]}>
//                                 {t("You'll be matched with players of similar rating")}
//                             </Text>

//                             <TouchableOpacity
//                                 style={[
//                                     styles.searchButton,
//                                     { backgroundColor: theme.primary || '#FB923C' },
//                                 ]}
//                                 onPress={handleStartSearch}>
//                                 <Text
//                                     style={[
//                                         styles.searchButtonText,
//                                         { color: theme.buttonText || '#ffffff' },
//                                     ]}>
//                                     {t('Find Match')}
//                                 </Text>
//                             </TouchableOpacity>
//                         </View>
//                     ) : (
//                         <View style={styles.searchingState}>
//                             <Animated.View
//                                 style={[
//                                     styles.searchIconContainer,
//                                     !matchFound && {
//                                         transform: [{ scale: pulseAnim }],
//                                     },
//                                     { backgroundColor: theme.iconBg || 'rgba(144, 202, 249, 0.1)' },
//                                 ]}>
//                                 {matchFound && opponentData ? (
//                                     <Animated.Image
//                                         source={{
//                                             uri: DUMMY_AVATARS[0],
//                                         }}
//                                         style={[
//                                             styles.avatarImage,
//                                             { opacity: 1, borderColor: theme.success || '#4ade80' },
//                                         ]}
//                                     />
//                                 ) : (
//                                     <Animated.Image
//                                         key={dummyIdx}
//                                         source={{ uri: DUMMY_AVATARS[dummyIdx] }}
//                                         style={styles.avatarImage}
//                                     />
//                                 )}
//                             </Animated.View>

//                             <Text
//                                 style={[
//                                     styles.searchingTitle,
//                                     { color: theme.text || '#ffffff' },
//                                 ]}>
//                                 {matchFound ? t('Opponent Found!') : t('Finding opponent...')}
//                             </Text>
//                             <Text
//                                 style={[
//                                     styles.searchingSubtitle,
//                                     { color: theme.secondaryText || '#90caf9' },
//                                 ]}>
//                                 {matchFound
//                                     ? `${t('Playing against')} ${opponentData?.username || t('Opponent')}`
//                                     : `${t('Looking for players with rating')} ${displayRating - 100} - ${displayRating + 100}`}
//                             </Text>

//                             {matchFound && (
//                                 <Text
//                                     style={{
//                                         color: theme.success || '#4ade80',
//                                         fontSize: 16,
//                                         fontWeight: 'bold',
//                                         marginTop: 10,
//                                     }}>
//                                     {t('Ready to Battle...')}
//                                 </Text>
//                             )}

//                             {!matchFound && (
//                                 <TouchableOpacity
//                                     style={[
//                                         styles.cancelButton,
//                                         {
//                                             borderColor: theme.warning || '#ff9800',
//                                             backgroundColor: (theme.warning || '#ff9800') + '33',
//                                         },
//                                     ]}
//                                     onPress={handleCancelSearch}>
//                                     <Text
//                                         style={[
//                                             styles.cancelButtonText,
//                                             { color: theme.warning || '#ff9800' },
//                                         ]}>
//                                         {t('Cancel Search')}
//                                     </Text>
//                                 </TouchableOpacity>
//                             )}
//                         </View>
//                     )}
//                 </View>
//             </Animated.View>
//         </LinearGradient>
//     );
// }




/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Image,
    Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Search, X, Users, Clock, Star } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSocket, useSocketState } from '../context/Socket';
import { useTheme } from '../context/ThemeContext';
import { useAppTranslation } from '../context/TranslationContext';

export default function Lobby() {
    const socket = useSocket();
    const { isRegistered } = useSocketState();
    const { theme } = useTheme();
    const route = useRoute();
    const { difficulty, diffCode, digit, symbol, timer, qm } = route.params;
    const navigation = useNavigation();
    const { t } = useAppTranslation();

    console.log('[LOBBY] 🎬 Lobby component mounted');
    console.log('[LOBBY] Route params:', { difficulty, diffCode, digit, symbol, timer, qm });

    /* ================= STATE ================= */
    const [isSearching, setIsSearching] = useState(false);
    const [player, setPlayer] = useState(null);
    const [matchFound, setMatchFound] = useState(false);
    const [opponentData, setOpponentData] = useState(null);
    const [dummyIdx, setDummyIdx] = useState(0);
    const [isRejoining, setIsRejoining] = useState(false);
    const [playerRegistered, setPlayerRegistered] = useState(isRegistered);

    const DUMMY_AVATARS = [
        'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg',
        'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671122.jpg',
        'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg',
    ];

    /* ================= REFS ================= */
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const readyToNavigateRef = useRef(false);
    const pendingGameStartData = useRef(null);
    const hasNavigatedRef = useRef(false);
    const socketRef = useRef(null);
    const opponentRef = useRef(null);
    const myMongoIdRef = useRef(null);

    const isSearchingRef = useRef(false);
    const handleGameStartedRef = useRef(null);
    const handleMatchFoundRef = useRef(null);

    const playerRatingRef = useRef(1000);
    const rejoinBlockedRef = useRef(false);
    const activeGameIdRef = useRef(null);
    const playerRegisteredRef = useRef(isRegistered);

    const getPlayerRating = (playerData) => {
        if (!playerData) return 1000;
        const byDiffCode = playerData?.pr?.pvpByDiffCode?.[diffCode];
        if (byDiffCode !== undefined) {
            if (typeof byDiffCode === 'number') return byDiffCode;
        }
        return playerData?.pr?.pvp?.[difficulty] || 1000;
    };

    /* ================= EFFECT 0: Early rejoin-game listener ================= */
    // Must be registered BEFORE register-player fires (which happens in Socket
    // context on connect). Effect 4 is too late — this catches the event on
    // cold/warm start within the 15-second rejoin window.
    useEffect(() => {
        if (!socket) return;

        const handleEarlyRejoin = data => {
            console.log('[LOBBY] 🔄 EARLY rejoin-game received:', data);
            rejoinBlockedRef.current = true;
            activeGameIdRef.current = data?.gameId || null;
            setIsRejoining(true);
            socket.emit('reconnect-to-game', {
                gameId: data?.gameId || activeGameIdRef.current,
            });
        };

        socket.on('rejoin-game', handleEarlyRejoin);

        return () => {
            socket.off('rejoin-game', handleEarlyRejoin);
        };
    }, [socket]);

    /* ================= EFFECT 1: Load User Data ================= */
    useEffect(() => {
        const getUserData = async () => {
            console.log('[LOBBY] 📊 EFFECT 1: Loading user data...');
            try {
                const userData = await AsyncStorage.getItem('userData');
                if (userData) {
                    const user = JSON.parse(userData);
                    console.log('[LOBBY] ✅ User Info loaded:', {
                        username: user.username,
                        id: user._id || user.id,
                    });
                    console.log('[LOBBY] 💰 PR data:', JSON.stringify(user?.pr, null, 2));
                    setPlayer(user);

                    const mongoId = user._id || user.id;
                    if (!mongoId) {
                        console.error('[LOBBY] ❌ No MongoDB ID found in user data!');
                        Alert.alert('Error', t('User ID not found. Please login again.'));
                        navigation.goBack();
                        return;
                    }

                    myMongoIdRef.current = mongoId;
                    console.log('[LOBBY] ✅ MongoDB ID set:', mongoId);
                } else {
                    console.error('[LOBBY] ❌ No user data in AsyncStorage');
                    Alert.alert('Error', t('Please login first'));
                    navigation.goBack();
                }
            } catch (error) {
                console.error('[LOBBY] ❌ Error loading user data:', error);
                Alert.alert('Error', t('Failed to load user data'));
            }
        };
        getUserData();
    }, []);

    /* ================= EFFECT: Sync playerRatingRef ================= */
    useEffect(() => {
        playerRatingRef.current = getPlayerRating(player);
        console.log('[LOBBY] 🔄 EFFECT: playerRatingRef updated to:', playerRatingRef.current);
        console.log('[LOBBY] Player state changed:', {
            username: player?.username,
            pvp: player?.pr?.pvp,
            pvpByDiffCode: player?.pr?.pvpByDiffCode,
        });
    }, [player]);

    /* ================= EFFECT: Auto Start Search ================= */
    useEffect(() => {
        console.log('[LOBBY] 🔍 EFFECT: Auto Start Search checking...');
        console.log('[LOBBY] Conditions: player:', !!player, 'isRegistered:', isRegistered, 'playerRegistered:', playerRegistered, 'isRejoining:', isRejoining, 'isSearching:', isSearchingRef.current, 'rejoinBlocked:', rejoinBlockedRef.current);

        if (player && isRegistered && playerRegistered && !isRejoining && !isSearchingRef.current && !rejoinBlockedRef.current) {
            console.log('[LOBBY] ✅ All conditions met - Auto starting matchmaking...');
            handleStartSearch();
        } else {
            console.log('[LOBBY] ⏳ Waiting - player:', !!player, 'isRegistered:', isRegistered, 'playerRegistered:', playerRegistered, 'isRejoining:', isRejoining, 'notSearching:', !isSearchingRef.current, 'rejoinBlocked:', rejoinBlockedRef.current);
        }
    }, [player, isRegistered, playerRegistered, isRejoining]);

    /* ================= EFFECT 2: Dummy Avatar Animation ================= */
    useEffect(() => {
        let dummyInterval;
        let pulseAnimation;
        let rotateAnimation;

        if (isSearching && !matchFound) {
            dummyInterval = setInterval(() => {
                setDummyIdx(prev => (prev + 1) % DUMMY_AVATARS.length);
            }, 600);

            pulseAnimation = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ]),
            );

            rotateAnimation = Animated.loop(
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            );

            pulseAnimation.start();
            rotateAnimation.start();
        }

        return () => {
            if (dummyInterval) clearInterval(dummyInterval);
            if (pulseAnimation) pulseAnimation.stop();
            if (rotateAnimation) rotateAnimation.stop();
            pulseAnim.setValue(1);
            rotateAnim.setValue(0);
        };
    }, [isSearching, matchFound, pulseAnim, rotateAnim]);

    /* ================= EFFECT 3: Cleanup on Unmount ================= */
    useEffect(() => {
        console.log('[LOBBY] ⚙️ EFFECT 3: Mounted - Cleanup on unmount registered');

        return () => {
            console.log('[LOBBY] 🧹 EFFECT 3: Cleanup - Component unmounting');
            if (isSearchingRef.current && socketRef.current?.connected) {
                console.log('[LOBBY] 🧹 Cancelling search on unmount');
                socketRef.current.emit('cancel_search');
            }

            readyToNavigateRef.current = false;
            hasNavigatedRef.current = false;
            pendingGameStartData.current = null;
            opponentRef.current = null;
            rejoinBlockedRef.current = false;
            activeGameIdRef.current = null;
            playerRegisteredRef.current = false;
            console.log('[LOBBY] ✅ Refs cleaned up');
        };
    }, []);

    /* ================= EFFECT 4: Socket Listeners ================= */
    useEffect(() => {
        console.log('[LOBBY] 🔌 EFFECT 4: Socket Listeners - Setting up...');

        if (!socket) {
            console.warn('[LOBBY] ⚠️ Socket not available');
            return;
        }

        console.log('[LOBBY] ✅ Socket available - socket.id:', socket.id);
        socketRef.current = socket;
        console.log('[LOBBY] ✅ socketRef.current set');

        const handleConnect = () => {
            console.log('[LOBBY] 🟢 Socket: connect event fired');
            console.log('[LOBBY] Socket connected state:', socket.connected);
            console.log('[LOBBY] Socket ID:', socket.id);
        };

        const handleDisconnect = reason => {
            console.log('[LOBBY] 🔴 Socket: disconnect event fired');
            console.log('[LOBBY] Disconnect reason:', reason);
            if (isSearchingRef.current) {
                console.log('[LOBBY] ❌ Was searching - cancelling search due to disconnect');
                setIsSearching(false);
                isSearchingRef.current = false;
                setMatchFound(false);
                Alert.alert('Disconnected', t('Connection lost. Please try again.'));
            }
        };

        const handleLobbyJoined = data => {
            console.log('[LOBBY] 📥 Socket: lobby-joined event received');
            console.log('[LOBBY] Lobby joined data:', data);
            if (data.success && data.player?.id) {
                console.log('[LOBBY] ✅ My MongoDB ID confirmed:', data.player.id);
                myMongoIdRef.current = data.player.id;

                if (data.player?.rating !== undefined) {
                    console.log('[LOBBY] ⭐ Rating from server:', data.player.rating);
                    console.log('[LOBBY] Current diffCode:', diffCode);
                    playerRatingRef.current = data.player.rating;
                    setPlayer(prevPlayer => ({
                        ...prevPlayer,
                        pr: {
                            ...prevPlayer?.pr,
                            pvpByDiffCode: {
                                ...prevPlayer?.pr?.pvpByDiffCode,
                                [diffCode]: data.player.rating,
                            },
                            pvp: {
                                ...prevPlayer?.pr?.pvp,
                                [difficulty]: data.player.rating,
                            },
                        },
                    }));
                }
            } else {
                console.error('[LOBBY] ❌ Invalid lobby-joined response:', data);
            }
        };

        const handleMatchFound = ({
            gameRoom,
            opponent,
            myPlayerId,
            initialQuestionMeter,
        }) => {
            console.log('[LOBBY] ✅ Socket: match-found event received');
            console.log('[LOBBY] 📊 Match Data:', {
                opponent: opponent?.username,
                opponentId: opponent?.id,
                opponentRating: opponent?.rating,
                myPlayerId,
                initialQuestionMeter,
            });

            if (!opponent?.id || !opponent?.username) {
                console.error('[LOBBY] ❌ Invalid opponent data:', opponent);
                Alert.alert('Error', t('Invalid match data received'));
                setIsSearching(false);
                isSearchingRef.current = false;
                return;
            }

            const opponentInfo = {
                id: opponent.id,
                username: opponent.username,
                rating: opponent.rating || 1000,
                profilePic: opponent.profileImage || opponent.profilePic || opponent.avatar || null,
                stats: opponent.stats || {
                    wins: 0,
                    losses: 0,
                    winRate: 0,
                    currentStreak: 0,
                },
            };

            myMongoIdRef.current = myPlayerId;
            opponentRef.current = opponentInfo;

            console.log('[LOBBY] ✅ Opponent data saved:', opponentInfo);

            setOpponentData(opponentInfo);
            setMatchFound(true);
            hasNavigatedRef.current = false;

            console.log('[LOBBY] ⏳ Starting 2s delay before navigation...');
            setTimeout(() => {
                readyToNavigateRef.current = true;
                console.log('[LOBBY] ✅ readyToNavigateRef set to true');
                if (pendingGameStartData.current) {
                    console.log('[LOBBY] 🚀 Navigating to Game (Delayed trigger)');
                    navigateToGame(pendingGameStartData.current);
                } else {
                    console.log('[LOBBY] ⏳ No pendingGameStartData yet, waiting for game-started event');
                }
            }, 2000);
        };

        const handleGameStarted = data => {
            console.log('[LOBBY] 🚀 Socket: game-started event received');
            console.log('[LOBBY] Game started data:', data);

            if (!data.currentQuestion) {
                console.error('[LOBBY] ❌ No current question in game-started:', data);
                Alert.alert('Error', t('Invalid game data received'));
                setIsSearching(false);
                isSearchingRef.current = false;
                setMatchFound(false);
                return;
            }

            console.log('[LOBBY] readyToNavigateRef:', readyToNavigateRef.current);
            if (readyToNavigateRef.current) {
                console.log('[LOBBY] 🎮 readyToNavigateRef is true - navigating NOW');
                navigateToGame(data);
            } else {
                console.log('[LOBBY] ⏳ Waiting for Match Found animation to complete...');
                pendingGameStartData.current = data;
            }
        };

        const handlePlayerRegisteredForwarded = data => {
            console.log('[LOBBY] 📊 Socket: player-registered event received');
            console.log('[LOBBY] Player registered data:', data);

            if (data?.player?.rating !== undefined) {
                console.log('[LOBBY] ✅ Updating player with new rating:', data.player.rating);
                playerRatingRef.current = data.player.rating;
                setPlayer(prevPlayer => ({
                    ...prevPlayer,
                    pr: {
                        ...prevPlayer?.pr,
                        pvpByDiffCode: {
                            ...prevPlayer?.pr?.pvpByDiffCode,
                            [diffCode]: data.player.rating,
                        },
                        pvp: {
                            ...prevPlayer?.pr?.pvp,
                            [difficulty]: data.player.rating,
                        },
                    },
                }));
            }

            if (data?.hasActiveGame) {
                console.log('[LOBBY] 🎮 hasActiveGame=true — gameId:', data.gameId, '— waiting for rejoin-game push');
                rejoinBlockedRef.current = true;
                activeGameIdRef.current = data.gameId || null;
                setIsRejoining(true);
            } else {
                console.log('[LOBBY] ✅ hasActiveGame=false — normal matchmaking flow');
                rejoinBlockedRef.current = false;
                activeGameIdRef.current = null;
                setIsRejoining(false);
            }

            playerRegisteredRef.current = true;
            setPlayerRegistered(true);
        };

        const handleRejoinGame = data => {
            console.log('[LOBBY] 🔄 Socket: rejoin-game received (Effect 4)');

            if (hasNavigatedRef.current) {
                console.log('[LOBBY] 🛑 Already navigated, ignoring rejoin-game');
                return;
            }

            if (!rejoinBlockedRef.current) {
                console.log('[LOBBY] 🛑 rejoin-game: not blocked by hasActiveGame — ignoring');
                return;
            }

            setIsSearching(false);
            isSearchingRef.current = false;
            setMatchFound(false);

            console.log('[LOBBY] 📤 Emitting reconnect-to-game (Effect 4 path)');
            socket.emit('reconnect-to-game', {
                gameId: data?.gameId || activeGameIdRef.current,
            });
        };

        const handleGameReconnected = data => {
            console.log('[LOBBY] ✅ Socket: game-reconnected received — restoring game');
            console.log('[LOBBY] game-reconnected data:', JSON.stringify(data, null, 2));

            if (hasNavigatedRef.current) {
                console.log('[LOBBY] 🛑 Already navigated, ignoring game-reconnected');
                return;
            }

            hasNavigatedRef.current = true;

            const gameState = data?.gameState || {};
            const currentQuestion = data?.currentQuestion;
            const myPlayerId = data?.myPlayerId || myMongoIdRef.current;

            let opponentId = null;
            if (gameState?.playerScores) {
                opponentId = Object.keys(gameState.playerScores).find(
                    id => id !== myPlayerId,
                );
            }

            const reconnectOpponent = opponentRef.current || {
                id: opponentId || 'unknown',
                username: data?.opponentUsername || t('Opponent'),
                rating: 1000,
            };

            if (!currentQuestion) {
                console.error('[LOBBY] ❌ game-reconnected has no currentQuestion — cannot restore game');
                rejoinBlockedRef.current = false;
                activeGameIdRef.current = null;
                hasNavigatedRef.current = false;
                setIsRejoining(false);
                return;
            }

            console.log('[LOBBY] 🚀 Navigating to MultiPlayerGame via game-reconnected');
            navigation.replace('MultiPlayerGame', {
                currentQuestion,
                timer,
                opponent: reconnectOpponent,
                myMongoId: myPlayerId,
                difficulty,
                diffCode,
                gameRoomId: data?.gameRoomId || data?.roomId || activeGameIdRef.current || null,
                gameStartedAt: gameState?.gameStartedAt,
                totalGameTime: gameState?.totalGameTime,
                restoredMyScore: gameState?.playerScores?.[myPlayerId]?.score
                    ?? gameState?.playerScores?.[myPlayerId]
                    ?? 0,
                restoredOpponentScore: opponentId
                    ? (gameState?.playerScores?.[opponentId]?.score
                        ?? gameState?.playerScores?.[opponentId]
                        ?? 0)
                    : 0,
            });
        };

        const handleReconnectFailed = data => {
            console.log('[LOBBY] ❌ Socket: reconnect-failed received:', data);
            if (hasNavigatedRef.current) return;
            rejoinBlockedRef.current = false;
            activeGameIdRef.current = null;
            setIsRejoining(false);
        };

        const handleError = error => {
            console.error('[LOBBY] ❌ Socket error:', error);
            Alert.alert('Error', error.message || 'An error occurred');
            setIsSearching(false);
            isSearchingRef.current = false;
            setMatchFound(false);
        };

        handleGameStartedRef.current = handleGameStarted;
        handleMatchFoundRef.current = handleMatchFound;

        console.log('[LOBBY] 🧹 Removing old socket listeners (if any)...');
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
        socket.off('lobby-joined', handleLobbyJoined);
        socket.off('match-found', handleMatchFound);
        socket.off('game-started', handleGameStarted);
        socket.off('_player-registered-forwarded', handlePlayerRegisteredForwarded);
        socket.off('rejoin-game', handleRejoinGame);
        socket.off('game-reconnected', handleGameReconnected);
        socket.off('reconnect-failed', handleReconnectFailed);
        socket.off('error', handleError);

        console.log('[LOBBY] 🔌 Adding new socket listeners...');
        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);
        socket.on('lobby-joined', handleLobbyJoined);
        socket.on('match-found', handleMatchFound);
        socket.on('game-started', handleGameStarted);
        socket.on('_player-registered-forwarded', handlePlayerRegisteredForwarded);
        socket.on('rejoin-game', handleRejoinGame);
        socket.on('game-reconnected', handleGameReconnected);
        socket.on('reconnect-failed', handleReconnectFailed);
        socket.on('error', handleError);

        console.log('[LOBBY] ✅ All listeners attached');

        return () => {
            console.log('[LOBBY] 🧹 Cleanup: Removing all socket listeners');
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
            socket.off('lobby-joined', handleLobbyJoined);
            socket.off('match-found', handleMatchFound);
            socket.off('game-started', handleGameStarted);
            socket.off('_player-registered-forwarded', handlePlayerRegisteredForwarded);
            socket.off('rejoin-game', handleRejoinGame);
            socket.off('game-reconnected', handleGameReconnected);
            socket.off('reconnect-failed', handleReconnectFailed);
            socket.off('error', handleError);
        };
    }, [socket]);

    /* ================= NAVIGATION HELPER ================= */
    const navigateToGame = ({ gameState, currentQuestion, myPlayerId }) => {
        console.log('[LOBBY] 🎮 navigateToGame() called');

        if (hasNavigatedRef.current) {
            console.log('[LOBBY] 🛑 Already navigated to game, skipping duplicate.');
            return;
        }

        if (!currentQuestion) {
            console.error('[LOBBY] ❌ Cannot navigate: No current question');
            Alert.alert('Error', 'Game data is missing');
            setIsSearching(false);
            isSearchingRef.current = false;
            setMatchFound(false);
            return;
        }

        const finalMongoId = myPlayerId || myMongoIdRef.current;
        const finalOpponent = opponentRef.current;

        if (!finalMongoId) {
            console.error('[LOBBY] ❌ Cannot navigate: No MongoDB ID');
            Alert.alert('Error', t('Player ID is missing'));
            setIsSearching(false);
            isSearchingRef.current = false;
            setMatchFound(false);
            return;
        }

        if (!finalOpponent?.id) {
            console.error('[LOBBY] ❌ Cannot navigate: No opponent data');
            Alert.alert('Error', t('Opponent data is missing'));
            setIsSearching(false);
            isSearchingRef.current = false;
            setMatchFound(false);
            return;
        }

        hasNavigatedRef.current = true;
        console.log('[LOBBY] ✅ hasNavigatedRef set to true');

        console.log('[LOBBY] 🎮 Navigation params:');
        console.log('[LOBBY]   - My MongoDB ID:', finalMongoId);
        console.log('[LOBBY]   - Opponent:', finalOpponent);
        console.log('[LOBBY]   - Question present:', !!currentQuestion);
        console.log('[LOBBY]   - diffCode:', diffCode);

        if (socketRef.current) {
            if (handleGameStartedRef.current) {
                console.log('[LOBBY] 🧹 Removing game-started listener');
                socketRef.current.off('game-started', handleGameStartedRef.current);
            }
            if (handleMatchFoundRef.current) {
                console.log('[LOBBY] 🧹 Removing match-found listener');
                socketRef.current.off('match-found', handleMatchFoundRef.current);
            }
        }

        console.log('[LOBBY] 🚀 Navigating to MultiPlayerGame screen');
        navigation.replace('MultiPlayerGame', {
            currentQuestion,
            timer,
            opponent: finalOpponent,
            myMongoId: finalMongoId,
            difficulty,
            diffCode,
            gameStartedAt: gameState?.gameStartedAt,
            totalGameTime: gameState?.totalGameTime,
        });

        setTimeout(() => {
            setIsSearching(false);
            isSearchingRef.current = false;
            setMatchFound(false);
            setOpponentData(null);
            pendingGameStartData.current = null;
            readyToNavigateRef.current = false;
            hasNavigatedRef.current = false;
            console.log('[LOBBY] ✅ Lobby cleanup complete after navigation');
        }, 500);
    };

    /* ================= START SEARCH HANDLER ================= */
    const handleStartSearch = () => {
        console.log('[LOBBY] 🔍 handleStartSearch() called');

        if (isSearchingRef.current) {
            console.log('[LOBBY] ⚠️ Already searching, ignoring duplicate call');
            return;
        }

        if (rejoinBlockedRef.current) {
            console.log('[LOBBY] 🛑 join-lobby blocked — active game pending reconnect');
            return;
        }

        if (!playerRegisteredRef.current) {
            console.log('[LOBBY] 🛑 join-lobby blocked — player-registered not yet received');
            return;
        }

        if (!socketRef.current?.connected) {
            console.error('[LOBBY] ❌ Socket not connected');
            Alert.alert('Error', t('Socket not connected'));
            return;
        }

        if (!isRegistered) {
            console.error('[LOBBY] ❌ Player not registered');
            Alert.alert('Error', t('Still connecting, please try again in a moment'));
            return;
        }

        console.log('[LOBBY] ✅ All preconditions met - starting search');

        setIsSearching(true);
        isSearchingRef.current = true;
        setMatchFound(false);
        setOpponentData(null);
        pendingGameStartData.current = null;
        readyToNavigateRef.current = false;
        hasNavigatedRef.current = false;

        const playerRating = playerRatingRef.current;
        console.log('[LOBBY] ⭐ Using rating for lobby join:', playerRating);

        const lobbyData = {
            diff: diffCode || difficulty,
            timer: timer,
            symbol: symbol,
            rating: playerRating,
            qm: qm,
        };

        console.log('[LOBBY] 🚪 Joining lobby with data:', lobbyData);
        socketRef.current.emit('join-lobby', lobbyData);
        console.log('[LOBBY] ✅ join-lobby emitted');

        Animated.spring(scaleAnim, {
            toValue: 0.95,
            tension: 150,
            friction: 4,
            useNativeDriver: true,
        }).start();
    };

    /* ================= CANCEL SEARCH HANDLER ================= */
    const handleCancelSearch = () => {
        console.log('[LOBBY] ❌ handleCancelSearch() called');

        setIsSearching(false);
        isSearchingRef.current = false;
        setMatchFound(false);
        setOpponentData(null);
        pendingGameStartData.current = null;
        readyToNavigateRef.current = false;

        if (socketRef.current?.connected) {
            console.log('[LOBBY] 📤 Emitting cancel_search event');
            socketRef.current.emit('cancel_search');
        } else {
            console.log('[LOBBY] ⚠️ Socket not connected, cannot cancel search');
        }

        Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 150,
            friction: 4,
            useNativeDriver: true,
        }).start();
    };

    const displayRating = getPlayerRating(player);

    console.log('[LOBBY] 📊 Render: Current UI state');
    console.log('[LOBBY]   - isSearching:', isSearching);
    console.log('[LOBBY]   - matchFound:', matchFound);
    console.log('[LOBBY]   - isRejoining:', isRejoining);
    console.log('[LOBBY]   - displayRating:', displayRating);
    console.log('[LOBBY]   - player:', player?.username);
    console.log('[LOBBY]   - opponent:', opponentData?.username);

    /* ================= REJOIN SCREEN ================= */
    if (isRejoining) {
        return (
            <LinearGradient
                colors={theme.backgroundGradient || ['#0B1220', '#0B1220']}
                style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: theme.text || '#ffffff', fontSize: 18, fontWeight: '700' }}>
                    {t('Reconnecting to your game...')}
                </Text>
                <Text style={{ color: theme.secondaryText || '#90caf9', marginTop: 8 }}>
                    {t('Please wait')}
                </Text>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient
            colors={theme.backgroundGradient || ['#0B1220', '#0B1220']}
            style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.text || '#ffffff' }]}>
                    {t('Game Lobby')}
                </Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <X color={theme.text || '#ffffff'} size={24} />
                </TouchableOpacity>
            </View>

            <Animated.View
                style={[styles.content, { transform: [{ scale: scaleAnim }] }]}>
                <View
                    style={[
                        styles.playerCard,
                        {
                            backgroundColor:
                                theme.cardBackground || 'rgba(255, 255, 255, 0.1)',
                            borderColor: theme.borderColor || 'rgba(255, 255, 255, 0.2)',
                        },
                    ]}>
                    <View style={styles.ratingSection}>
                        <Star color="#ffd700" size={20} />
                        <Text style={[styles.ratingText, { color: theme.text || '#ffffff' }]}>
                            {`${t('Rating')}: ${displayRating}`}
                            {diffCode ? `  [${diffCode}]` : ''}
                        </Text>
                    </View>
                    <Text
                        style={[
                            styles.playerName,
                            { color: theme.secondaryText || '#90caf9' },
                        ]}>
                        {player?.username || t('Player')}
                    </Text>
                </View>

                <View
                    style={[
                        styles.matchCard,
                        {
                            backgroundColor:
                                theme.cardBackground || 'rgba(255, 255, 255, 0.05)',
                            borderColor: theme.borderColor || 'rgba(255, 255, 255, 0.1)',
                        },
                    ]}>
                    {!isSearching ? (
                        <View style={styles.readyState}>
                            <View
                                style={[
                                    styles.iconContainer,
                                    { backgroundColor: theme.iconBg || 'rgba(144, 202, 249, 0.1)' },
                                ]}>
                                <Search color={theme.secondaryText || '#90caf9'} size={48} />
                            </View>
                            <Text
                                style={[styles.statusTitle, { color: theme.text || '#ffffff' }]}>
                                {t('Ready to Find Match')}
                            </Text>
                            <Text
                                style={[
                                    styles.statusSubtitle,
                                    { color: theme.secondaryText || '#90caf9' },
                                ]}>
                                {t("You'll be matched with players of similar rating")}
                            </Text>

                            <TouchableOpacity
                                style={[
                                    styles.searchButton,
                                    { backgroundColor: theme.primary || '#FB923C' },
                                ]}
                                onPress={handleStartSearch}>
                                <Text
                                    style={[
                                        styles.searchButtonText,
                                        { color: theme.buttonText || '#ffffff' },
                                    ]}>
                                    {t('Find Match')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.searchingState}>
                            <Animated.View
                                style={[
                                    styles.searchIconContainer,
                                    !matchFound && {
                                        transform: [{ scale: pulseAnim }],
                                    },
                                    { backgroundColor: theme.iconBg || 'rgba(144, 202, 249, 0.1)' },
                                ]}>
                                {matchFound && opponentData ? (
                                    <Animated.Image
                                        source={{
                                            uri: DUMMY_AVATARS[0],
                                        }}
                                        style={[
                                            styles.avatarImage,
                                            { opacity: 1, borderColor: theme.success || '#4ade80' },
                                        ]}
                                    />
                                ) : (
                                    <Animated.Image
                                        key={dummyIdx}
                                        source={{ uri: DUMMY_AVATARS[dummyIdx] }}
                                        style={styles.avatarImage}
                                    />
                                )}
                            </Animated.View>

                            <Text
                                style={[
                                    styles.searchingTitle,
                                    { color: theme.text || '#ffffff' },
                                ]}>
                                {matchFound ? t('Opponent Found!') : t('Finding opponent...')}
                            </Text>
                            <Text
                                style={[
                                    styles.searchingSubtitle,
                                    { color: theme.secondaryText || '#90caf9' },
                                ]}>
                                {matchFound
                                    ? `${t('Playing against')} ${opponentData?.username || t('Opponent')}`
                                    : `${t('Looking for players with rating')} ${displayRating - 100} - ${displayRating + 100}`}
                            </Text>

                            {matchFound && (
                                <Text
                                    style={{
                                        color: theme.success || '#4ade80',
                                        fontSize: 16,
                                        fontWeight: 'bold',
                                        marginTop: 10,
                                    }}>
                                    {t('Ready to Battle...')}
                                </Text>
                            )}

                            {!matchFound && (
                                <TouchableOpacity
                                    style={[
                                        styles.cancelButton,
                                        {
                                            borderColor: theme.warning || '#ff9800',
                                            backgroundColor: (theme.warning || '#ff9800') + '33',
                                        },
                                    ]}
                                    onPress={handleCancelSearch}>
                                    <Text
                                        style={[
                                            styles.cancelButtonText,
                                            { color: theme.warning || '#ff9800' },
                                        ]}>
                                        {t('Cancel Search')}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>
            </Animated.View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    playerCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    ratingSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    ratingText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    playerName: {
        color: '#90caf9',
        fontSize: 14,
        opacity: 0.8,
    },
    matchCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 20,
        padding: 30,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
    },
    readyState: { alignItems: 'center' },
    iconContainer: {
        backgroundColor: 'rgba(144, 202, 249, 0.1)',
        borderRadius: 40,
        padding: 20,
        marginBottom: 20,
    },
    statusTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
        textAlign: 'center',
    },
    statusSubtitle: {
        fontSize: 16,
        color: '#90caf9',
        textAlign: 'center',
        marginBottom: 24,
        opacity: 0.8,
    },
    searchButton: {
        backgroundColor: '#FB923C',
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    searchButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    searchingState: { alignItems: 'center' },
    searchIconContainer: {
        backgroundColor: 'rgba(144, 202, 249, 0.1)',
        borderRadius: 40,
        padding: 20,
        marginBottom: 20,
    },
    searchingTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
        textAlign: 'center',
    },
    searchingSubtitle: {
        fontSize: 14,
        color: '#90caf9',
        textAlign: 'center',
        marginBottom: 24,
        opacity: 0.8,
    },
    cancelButton: {
        backgroundColor: 'rgba(255, 152, 0, 0.2)',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ff9800',
    },
    cancelButtonText: {
        color: '#ff9800',
        fontSize: 16,
        fontWeight: '600',
    },
    avatarImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#4ade80',
        marginBottom: 20,
    },
});