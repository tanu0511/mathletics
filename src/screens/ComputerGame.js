

// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   PixelRatio,
//   Animated,
//   AppState,
//   Alert,
//   BackHandler,
//   ScrollView,
//   ActivityIndicator,
//   Image,                // ← CHANGE 1: added Image import
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Icon from 'react-native-vector-icons/Ionicons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import {
//   useNavigation,
//   useRoute,
//   useFocusEffect,
// } from '@react-navigation/native';
// import LinearGradient from 'react-native-linear-gradient';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useTheme } from '../context/ThemeContext';
// import { useSound } from '../context/SoundContext';
// import { KEYPAD_LAYOUTS } from '../utils/keyboardLayouts';
// import { initSound, playEffect, stopEffect } from '../utils/SoundManager';
// import { useAppTranslation } from '../context/TranslationContext';
// import OfflineBadgesModal from './OfflineBadgesModal';
// import { useBadge } from '../context/BadgeContext';
// import ComputerGameSocket from '../utils/ComputerGameSocket';

// Text.defaultProps = Text.defaultProps || {};
// Text.defaultProps.allowFontScaling = false;

// const { width, height } = Dimensions.get('window');
// const FONT_SCALE = Math.min(PixelRatio.getFontScale(), 1.0);
// const scaleFont = size => size * FONT_SCALE;

// const KEY_BTN_WIDTH  = Math.min(width * 0.2, 78);
// const KEY_BTN_HEIGHT = Math.min(height * 0.085, 68);



// // ─── helpers ────────────────────────────────────────────────────────────────

// const getMathSymbol = symbol => {
//   const map = {
//     Sum: '+', Difference: '-', Subtract: '-',
//     Product: '×', Multiply: '×',
//     Quotient: '÷', Divide: '÷',
//     Modulus: '%', Exponent: '^',
//   };
//   return map[symbol] || symbol;
// };

// const formatQuestion = (q) => {
//   if (!q) return '';
//   const sym = getMathSymbol(q.symbol);
//   return `${q.input1} ${sym} ${q.input2}`;
// };

// const getExpectedAnswer = (q) => {
//   if (!q) return null;
//   const sym = (q.symbol || '').toLowerCase();
//   switch (sym) {
//     case 'sum':
//       return String(q.input1 + q.input2);
//     case 'difference':
//     case 'subtract':
//       return String(q.input1 - q.input2);
//     case 'product':
//     case 'multiply':
//       return String(q.input1 * q.input2);
//     case 'quotient':
//     case 'divide':
//       return q.input2 !== 0
//         ? String(q.input1 / q.input2)
//         : null;
//     default:
//       return null;
//   }
// };

// // ────────────────────────────────────────────────────────────────────────────

// const ComputerGame = () => {
//   const insets      = useSafeAreaInsets();
//   const navigation  = useNavigation();
//   const route       = useRoute();
//   const { theme, keyboardTheme } = useTheme();
//   const { isSoundOn, toggleSound } = useSound();
//   const { t }       = useAppTranslation();
//   // checkSilentBadges removed — dead fn no longer exists on BadgeContext.
//   // Game-end badges arrive via the gameEnded socket payload (newlyEarned)
//   // and are queued with showBadges() in onGameEnded below; no REST
//   // safety-net call is needed.
//   const { showBadges } = useBadge();

//   // ── Route params ────────────────────────────────────────────────────────
//   const {
//     gameId:           initGameId,
//     computerLevel,
//     computerDisplayName,
//     difficulty,
//     diffCode,
//     selectedSymbols,
//     firstQuestion,
//     initialGameState,
//     timer,
//     myMongoId:        routeMyMongoId,
//   } = route.params || {};

//   console.log('🎮 [COMPUTER GAME] ========== COMPONENT MOUNTED ==========');
//   console.log('🎮 [COMPUTER GAME] Route params received:', {
//     gameId: initGameId,
//     computerLevel,
//     computerDisplayName,
//     difficulty,
//     diffCode,
//     selectedSymbols,
//     timer,
//   });
//   console.log('🎮 [COMPUTER GAME] Initial game state:', initialGameState);
//   console.log('🎮 [COMPUTER GAME] 📊 INITIAL PLAYER SCORE:', initialGameState?.playerScore ?? 0);
//   console.log('🎮 [COMPUTER GAME] 📊 INITIAL COMPUTER SCORE:', initialGameState?.computerScore ?? 0);
//   console.log('🎮 [COMPUTER GAME] 📊 INITIAL PLAYER METER:', initialGameState?.playerMeter ?? 5);
//   console.log('🎮 [COMPUTER GAME] 📊 DIFF CODE:', diffCode);

//   const currentLayout = KEYPAD_LAYOUTS[keyboardTheme] || KEYPAD_LAYOUTS.type1;

//   // ── Socket ref ───────────────────────────────────────────────────────────
//   const socketRef = useRef(null);

//   // ── Game state ──────────────────────────────────────────────────────────
//   const [gameId]            = useState(initGameId);
//   const [currentQ, setCurrentQ]             = useState(firstQuestion);
//   const [questionText, setQuestionText]     = useState(formatQuestion(firstQuestion));
//   const [questionIndex, setQuestionIndex]   = useState((firstQuestion?.index ?? 0) + 1);

//   const [input,    setInput]    = useState('');
//   const [feedback, setFeedback] = useState(null);
//   const [submitted, setSubmitted] = useState(false);
//   const [awaitingComputer, setAwaitingComputer] = useState(false);
//   const [gameEnded, setGameEnded] = useState(false);
//   const [loading,   setLoading]  = useState(false);

//   const gameEndedRef = useRef(false);

//   // Player stats
//   const [playerScore,  setPlayerScore]  = useState(initialGameState?.playerScore  ?? 0);
//   const [playerMeter,  setPlayerMeter]  = useState(initialGameState?.playerMeter  ?? 5);
//   const [playerStreak, setPlayerStreak] = useState(initialGameState?.playerStreak ?? 0);

//   // Computer stats
//   const [computerScore,  setComputerScore]  = useState(initialGameState?.computerScore  ?? 0);
//   const [computerMeter,  setComputerMeter]  = useState(initialGameState?.computerMeter  ?? 5);
//   const [computerStreak, setComputerStreak] = useState(initialGameState?.computerStreak ?? 0);

//   // History dots
//   const [playerHistory,   setPlayerHistory]   = useState([]);
//   const [computerHistory, setComputerHistory] = useState([]);

//   // Computer answer feedback
//   const [computerFeedback, setComputerFeedback] = useState(null);

//   // Timer
//   const totalTimeRef = useRef(parseInt(timer ?? 60, 10));
//   const [timeLeft, setTimeLeft] = useState(totalTimeRef.current);
//   const minutes = Math.floor(timeLeft / 60);
//   const seconds = timeLeft % 60;

//   const [animateWatch] = useState(new Animated.Value(1));
//   const [isThirtySecPhase, setIsThirtySecPhase] = useState(false);
//   const [isPaused, setIsPaused] = useState(false);

//   // Result modal
//   const [showResultModal,  setShowResultModal]  = useState(false);
//   const [resultData,       setResultData]       = useState(null);
//   const [resultFadeAnim]   = useState(new Animated.Value(0));
//   const [resultScaleAnim]  = useState(new Animated.Value(0.8));
//   const [showPostGameBadges, setShowPostGameBadges] = useState(false);

//   const [offlineBadges, setOfflineBadges] = useState([]);

//   // Misc refs
//   const isSoundOnRef          = useRef(isSoundOn);
//   const last10PlayedRef       = useRef(false);
//   const appState              = useRef(AppState.currentState);
//   const hasNavigatedToResult  = useRef(false);
//   const gameIdRef             = useRef(initGameId);
//   const questionStartTimeRef  = useRef(Date.now());
//   const isSkipRef             = useRef(false);  // Track if current submission is a skip
//   const [isRevMode, setIsRevMode] = useState(false);
//   const revScale = useRef(new Animated.Value(1)).current;

//   // ── Keep gameEndedRef in sync ────────────────────────────────────────────
//   useEffect(() => {
//     gameEndedRef.current = gameEnded;
//   }, [gameEnded]);

//   // ── Attach socket ────────────────────────────────────────────────────────
//   useEffect(() => {
//     console.log('🎮 [COMPUTER GAME] Attempting to get socket from ComputerGameSocket singleton');
//     const sock = ComputerGameSocket.get();
//     if (!sock) {
//       console.error('🎮 [COMPUTER GAME] ❌ NO SOCKET FOUND - Game session lost');
//       Alert.alert('Error', 'Game session lost. Please try again.', [
//         { text: 'OK', onPress: () => navigation.replace('BottomTab') },
//       ]);
//       return;
//     }
//     console.log('🎮 [COMPUTER GAME] ✅ Socket retrieved successfully');
//     socketRef.current = sock;
//   }, [navigation]);

//   // ── Sound init ───────────────────────────────────────────────────────────
//   useFocusEffect(
//     useCallback(() => {
//       initSound('correct',   'rightanswer.mp3');
//       initSound('incorrect', 'wronganswerr.mp3');
//       initSound('skipped',   'skip.mp3');
//       initSound('timer',     'every30second.wav');
//       initSound('ticktock',  'ticktock.mp3');
//     }, [])
//   );

//   useEffect(() => {
//     isSoundOnRef.current = isSoundOn;
//     if (!isSoundOn) {
//       stopEffect('ticktock');
//       last10PlayedRef.current = false;
//     }
//   }, [isSoundOn]);

//   // ── App state ────────────────────────────────────────────────────────────
//   useEffect(() => {
//     const sub = AppState.addEventListener('change', state => {
//       if (state !== 'active') stopEffect('ticktock');
//       else if (totalTimeRef.current <= 10 && totalTimeRef.current > 0) {
//         playEffect('ticktock', isSoundOnRef.current);
//       }
//       appState.current = state;
//     });
//     return () => sub.remove();
//   }, []);

//   // ── Hardware back ────────────────────────────────────────────────────────
//   useEffect(() => {
//     const handler = BackHandler.addEventListener('hardwareBackPress', () => {
//       if (!gameEndedRef.current) {
//         Alert.alert(
//           t('Leave Game?'),
//           t('Are you sure you want to leave?'),
//           [
//             { text: t('Cancel'), style: 'cancel' },
//             { text: t('Leave'), style: 'destructive', onPress: handleExit },
//           ]
//         );
//         return true;
//       }
//       return false;
//     });
//     return () => handler.remove();
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ── Cleanup on unmount ───────────────────────────────────────────────────
//   useEffect(() => {
//     return () => {
//       stopEffect('ticktock');
//       if (!hasNavigatedToResult.current && socketRef.current?.connected) {
//         socketRef.current.emit('leaveGame', gameIdRef.current);
//         ComputerGameSocket.clear();
//       }
//     };
//   }, []);

//   // ── Result Data Logging ───────────────────────────────────────────────────
//   useEffect(() => {
//     if (resultData) {
//       console.log('🎮 [COMPUTER GAME] resultData updated - DISPLAYING RESULT MODAL');
//       console.log('🎮 [COMPUTER GAME] 📊 FINAL RATING DISPLAY:');
//       console.log('  - Before:', resultData.ratingBefore);
//       console.log('  - After:', resultData.ratingAfter);
//       console.log('  - Change:', (resultData.ratingChange >= 0 ? '+' : '') + resultData.ratingChange);
//       console.log('  - DiffCode/Bucket:', resultData.diffCode);
//       console.log('  - Game Result:', resultData.gameResult);
//       console.log('  - Player Score:', resultData.totalScore);
//       console.log('  - Computer Score:', resultData.opponentScore);
//     }
//   }, [resultData]);

//   // ── showResult ───────────────────────────────────────────────────────────
//   const showResult = useCallback((data) => {
//     console.log('🎮 [COMPUTER GAME] showResult() called with data:', JSON.stringify(data, null, 2));
//     console.log('🎮 [COMPUTER GAME] 📊 RESULT MODAL DATA - Game Result:', data.gameResult);
//     console.log('🎮 [COMPUTER GAME] 📊 RESULT MODAL - Rating Change:', (data.ratingChange >= 0 ? '+' : '') + data.ratingChange);
//     console.log('🎮 [COMPUTER GAME] 📊 RESULT MODAL - Final Rating:', data.ratingAfter);
//     console.log('🎮 [COMPUTER GAME] 📊 RESULT MODAL - DiffCode (bucket):', data.diffCode);

//     if (hasNavigatedToResult.current) {
//       console.log('🎮 [COMPUTER GAME] ⚠️ Already navigated to result, returning early');
//       return;
//     }
//     hasNavigatedToResult.current = true;

//     gameEndedRef.current = true;

//     setGameEnded(true);
//     stopEffect('ticktock');

//     resultFadeAnim.setValue(0);
//     resultScaleAnim.setValue(0.8);
//     setResultData(data);
//     setShowResultModal(true);

//     // Badges from this match were already queued in onGameEnded() via
//     // showBadges(data.newlyEarned) — that's the single source of truth now.
//     // This callback only handles the result-modal entrance animation, then
//     // flips showPostGameBadges so the post-game badge UI can render.
//     setTimeout(() => {
//       Animated.parallel([
//         Animated.timing(resultFadeAnim,  { toValue: 1, duration: 500, useNativeDriver: true }),
//         Animated.spring(resultScaleAnim, { toValue: 1, friction: 5,   useNativeDriver: true }),
//       ]).start(() => {
//         setTimeout(() => {
//           setShowPostGameBadges(true);
//         }, 3000);
//       });
//     }, 50);
//   }, [resultFadeAnim, resultScaleAnim]);

//   // ── Socket event listeners ────────────────────────────────────────────────
//   useEffect(() => {
//     const sock = socketRef.current;
//     if (!sock) return;

//     const onPlayerAnswerResult = (data) => {
//       console.log('🎮 [COMPUTER GAME] playerAnswerResult event received:', data);
//       console.log('🎮 [COMPUTER GAME] 📊 PLAYER ANSWER RESULT - isCorrect:', data.isCorrect);
//       console.log('🎮 [COMPUTER GAME] 📊 New player score:', data.playerScore);
//       console.log('🎮 [COMPUTER GAME] 📊 New player meter:', data.playerMeter);
//       console.log('🎮 [COMPUTER GAME] 📊 New player streak:', data.playerStreak);

//       setPlayerScore(data.playerScore);
//       setPlayerMeter(data.playerMeter);
//       setPlayerStreak(data.playerStreak);

//       // Determine feedback: check if this was a skip first
//       let fb;
//       if (isSkipRef.current) {
//         fb = 'skipped';
//         setPlayerHistory(prev => [{ isCorrect: false, skipped: true }, ...prev].slice(0, 8));
//       } else {
//         fb = data.isCorrect ? 'correct' : 'incorrect';
//         setPlayerHistory(prev => [{ isCorrect: data.isCorrect }, ...prev].slice(0, 8));
//       }

//       setFeedback(fb);
//       playEffect(fb, isSoundOnRef.current);

//       setSubmitted(true);
//       setAwaitingComputer(true);
//       isSkipRef.current = false;  // Reset skip flag
//     };

//     const onComputerAnswerResult = (data) => {
//       console.log('🎮 [COMPUTER GAME] computerAnswerResult event received:', data);
//       console.log('🎮 [COMPUTER GAME] 📊 COMPUTER ANSWER - isCorrect:', data.isCorrect, 'skipped:', data.skipped);
//       console.log('🎮 [COMPUTER GAME] 📊 New computer score:', data.computerScore);
//       console.log('🎮 [COMPUTER GAME] 📊 New computer meter:', data.computerMeter);
//       console.log('🎮 [COMPUTER GAME] 📊 New computer streak:', data.computerStreak);

//       setComputerScore(data.computerScore);
//       setComputerMeter(data.computerMeter);
//       setComputerStreak(data.computerStreak);

//       if (data.skipped) {
//         setComputerFeedback('skipped');
//         setComputerHistory(prev => [{ isCorrect: false, skipped: true }, ...prev].slice(0, 8));
//       } else {
//         setComputerFeedback(data.isCorrect ? 'correct' : 'incorrect');
//         setComputerHistory(prev => [{ isCorrect: data.isCorrect }, ...prev].slice(0, 8));
//       }

//       setTimeout(() => setComputerFeedback(null), 1200);
//     };

//     const onNextQuestion = (data) => {
//       setCurrentQ(data);
//       setQuestionText(formatQuestion(data));
//       setInput('');
//       setFeedback(null);
//       setSubmitted(false);
//       setAwaitingComputer(false);
//       setLoading(false);
//       setQuestionIndex(data.index + 1);
//       questionStartTimeRef.current = Date.now();
//     };

//     const onGameEnded = (data) => {
//       console.log('🎮 [COMPUTER GAME] ========== GAME ENDED EVENT RECEIVED ==========');
//       console.log('🎮 [COMPUTER GAME] Game end data:', JSON.stringify(data, null, 2));
//       console.log('🎮 [COMPUTER GAME] 🏁 GAME RESULT:', data.result);
//       console.log('🎮 [COMPUTER GAME] 📊 FINAL PLAYER SCORE:', data.playerScore);
//       console.log('🎮 [COMPUTER GAME] 📊 FINAL COMPUTER SCORE:', data.computerScore);
//       console.log('🎮 [COMPUTER GAME] 📊 RATING CHANGE DATA:', {
//         before: data.ratingBefore,
//         after: data.ratingAfter,
//         change: data.ratingChange,
//         diffCode: diffCode,
//       });
//       console.log('🎮 [COMPUTER GAME] 💰 RATING BEFORE:', data.ratingBefore);
//       console.log('🎮 [COMPUTER GAME] 💰 RATING AFTER:', data.ratingAfter);
//       console.log('🎮 [COMPUTER GAME] 💰 RATING CHANGE:', (data.ratingChange >= 0 ? '+' : '') + data.ratingChange);
//       console.log('🎮 [COMPUTER GAME] 📊 STATS:', data.stats);
//       console.log('🎮 [COMPUTER GAME] 📊 END REASON:', data.endReason);

//       gameEndedRef.current = true;

//       if (data.newlyEarned?.length > 0) {
//         console.log('🎮 [COMPUTER GAME] 🏅 NEW BADGES EARNED:', data.newlyEarned);
//         showBadges(data.newlyEarned);
//       }

//       let gameResult = 'draw';
//       if (data.result === 'PlayerWon')   gameResult = 'win';
//       if (data.result === 'ComputerWon') gameResult = 'lose';

//       showResult({
//         gameResult,
//         totalScore:          data.playerScore,
//         opponentScore:       data.computerScore,
//         ratingBefore:        data.ratingBefore,
//         ratingAfter:         data.ratingAfter,
//         ratingChange:        data.ratingChange,
//         endReason:           data.endReason,
//         stats:               data.stats,
//         winner:              data.winner,
//         computerLevel,
//         computerDisplayName,
//         diffCode,
//         playerProfile:       data.playerProfile,  // ← already passing through
//       });

//       setTimeout(() => {
//         if (socketRef.current?.connected) {
//           ComputerGameSocket.clear();
//         }
//       }, 500);
//     };

//     const onConnectError = (err) => {
//       console.error('Computer game socket error:', err.message);
//       if (!hasNavigatedToResult.current) {
//         Alert.alert(
//           t('Connection Lost'),
//           t('Disconnected from game server.'),
//           [{ text: t('OK'), onPress: () => navigation.replace('BottomTab') }]
//         );
//       }
//     };

//     sock.on('playerAnswerResult',   onPlayerAnswerResult);
//     sock.on('computerAnswerResult', onComputerAnswerResult);
//     sock.on('nextQuestion',         onNextQuestion);
//     sock.on('gameEnded',            onGameEnded);
//     sock.on('connect_error',        onConnectError);

//     return () => {
//       sock.off('playerAnswerResult',   onPlayerAnswerResult);
//       sock.off('computerAnswerResult', onComputerAnswerResult);
//       sock.off('nextQuestion',         onNextQuestion);
//       sock.off('gameEnded',            onGameEnded);
//       sock.off('connect_error',        onConnectError);
//     };
//   }, [showResult, showBadges, computerLevel, computerDisplayName, navigation, t, diffCode]);

//   // ── Timer ─────────────────────────────────────────────────────────────────
//   useEffect(() => {
//     if (gameEnded) return;

//     const interval = setInterval(() => {
//       if (isPaused) return;

//       totalTimeRef.current -= 1;
//       const remaining = totalTimeRef.current;
//       setTimeLeft(remaining);

//       if (remaining <= 10 && remaining > 0 && !last10PlayedRef.current) {
//         playEffect('ticktock', isSoundOnRef.current);
//         last10PlayedRef.current = true;
//       }

//       if (remaining <= 10 && remaining > 0) {
//         Animated.sequence([
//           Animated.timing(animateWatch, { toValue: 1.4, duration: 300, useNativeDriver: true }),
//           Animated.timing(animateWatch, { toValue: 1,   duration: 300, useNativeDriver: true }),
//         ]).start();
//       }

//       if (remaining % 30 === 0 && remaining !== parseInt(timer ?? 60, 10) && remaining > 0) {
//         setIsThirtySecPhase(true);
//         playEffect('timer', isSoundOnRef.current);
//         Animated.sequence([
//           Animated.timing(animateWatch, { toValue: 1.4, duration: 300, useNativeDriver: true }),
//           Animated.timing(animateWatch, { toValue: 1,   duration: 300, useNativeDriver: true }),
//         ]).start(() => setIsThirtySecPhase(false));
//       }

//       if (remaining <= 0) {
//         clearInterval(interval);
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isPaused, gameEnded]);

//   // ── Core submit function ──────────────────────────────────────────────────
//   const submitAnswer = useCallback((answerValue) => {
//     if (gameEndedRef.current) {
//       console.log('🎮 [COMPUTER GAME] submitAnswer blocked — game already ended');
//       return;
//     }
//     if (!socketRef.current?.connected) return;

//     const timeSpent = Date.now() - questionStartTimeRef.current;

//     socketRef.current.emit(
//       'submitAnswer',
//       {
//         gameId:        gameIdRef.current,
//         questionIndex: currentQ?.index ?? 0,
//         answer:        answerValue,
//         timeSpent,
//       },
//       (ack) => {
//         if (!ack?.success) {
//           console.error('submitAnswer ack error:', ack?.error);
//           if (!gameEndedRef.current) {
//             setSubmitted(false);
//             setAwaitingComputer(false);
//           }
//         }
//       }
//     );
//   }, [currentQ]);

//   // ── Handlers ─────────────────────────────────────────────────────────────

//   const handleExit = useCallback(() => {
//     stopEffect('ticktock');
//     hasNavigatedToResult.current = true;
//     gameEndedRef.current = true;
//     setGameEnded(true);

//     if (socketRef.current?.connected) {
//       socketRef.current.emit('leaveGame', gameIdRef.current);
//     }
//     if (socketRef.current) {
//       ComputerGameSocket.clear();
//     }
//     navigation.replace('BottomTab');
//   }, [navigation]);

//   const handleToggleSound = () => {
//     toggleSound();
//     const newVal = !isSoundOn;
//     isSoundOnRef.current = newVal;
//     if (!newVal) {
//       stopEffect('ticktock');
//     } else if (totalTimeRef.current <= 10 && totalTimeRef.current > 0) {
//       last10PlayedRef.current = false;
//       playEffect('ticktock', true);
//     }
//   };

//   const handlePress = useCallback((value) => {
//     if (gameEndedRef.current || submitted) return;

//     const key = value.toString().toLowerCase();

//     if (key === 'clear' || key === 'clr') {
//       setInput('');
//       return;
//     }

//     if (key === '⌫' || key === 'del') {
//       setInput(prev => prev.slice(0, -1));
//       return;
//     }

//     if (key === 'reverse' || key === 'ref') {
//       setIsRevMode(prev => !prev);
//       return;
//     }

//     if (key === 'pm') {
//       setInput(prev => prev.startsWith('-') ? prev.slice(1) : '-' + prev);
//       return;
//     }

//     if (key === 'skip') {
//       if (gameEndedRef.current) return;

//       isSkipRef.current = true;  // Mark this submission as a skip
//       playEffect('skipped', isSoundOnRef.current);
//       setFeedback('skipped');
//       setSubmitted(true);
//       setAwaitingComputer(true);

//       const timeSpent = Date.now() - questionStartTimeRef.current;
//       if (socketRef.current?.connected) {
//         socketRef.current.emit(
//           'submitAnswer',
//           {
//             gameId:        gameIdRef.current,
//             questionIndex: currentQ?.index ?? 0,
//             answer:        '',
//             timeSpent,
//           },
//           (ack) => {
//             if (!ack?.success) {
//               console.error('submitAnswer (skip) ack error:', ack?.error);
//             }
//           }
//         );
//       }
//       return;
//     }

//     if (key === 'enter' || key === '✓' || key === 'ok') {
//       if (input.length === 0) return;
//       if (gameEndedRef.current) return;
//       setSubmitted(true);
//       setAwaitingComputer(true);
//       submitAnswer(input);
//       return;
//     }

//     if (!/^[0-9.-]$/.test(value.toString())) return;

//     if (value === '.' && input.includes('.')) return;
//     if (value === '-' && input.length > 0) return;

//     const newInput = isRevMode
//       ? value.toString() + input
//       : input + value.toString();

//     setInput(newInput);

// const expected = getExpectedAnswer(currentQ);
// const isDecimal = expected !== null && expected.includes('.');

// if (expected !== null) {
//   const shouldSubmit = isDecimal
//     ? newInput.length === expected.length && newInput.includes('.')
//     : newInput.length === expected.length;

//   if (shouldSubmit) {
//     setTimeout(() => {
//       if (gameEndedRef.current) {
//         console.log('🎮 [COMPUTER GAME] Auto-submit blocked — game ended during delay');
//         return;
//       }
//       setSubmitted(prev => {
//         if (prev) return prev;
//         setAwaitingComputer(true);
//         submitAnswer(newInput);
//         return true;
//       });
//     }, 80);
//   }
// }
// }, [gameEnded, submitted, input, isRevMode, currentQ, submitAnswer]);
//   // ── Result handlers ──────────────────────────────────────────────────────

//   const handleNewGame = () => navigation.navigate('PlayGame', {
//     gametype: 'MULTIPLAYER',
//     computerLevel: computerLevel,
//   });
//   const handleCloseResults = () => navigation.navigate('BottomTab');

//   // ── Keypad disabled state ────────────────────────────────────────────────
//   const isKeypadDisabled = gameEnded || submitted;

//   // ────────────────────────────────────────────────────────────────────────
//   // RENDER
//   // ────────────────────────────────────────────────────────────────────────

//   const content = (
//     <View style={[styles.container, { paddingTop: insets.top + 30 }]}>

//       {/* TOP BAR */}
//       <View style={[styles.topBar, { backgroundColor: theme.cardBackground || '#1E293B' }]}>
//         <TouchableOpacity
//           onPress={() => {
//             if (!gameEndedRef.current) {
//               Alert.alert(
//                 t('Leave Game?'),
//                 t('Are you sure you want to leave? You will lose the match.'),
//                 [
//                   { text: t('Cancel'), style: 'cancel' },
//                   { text: t('Leave'), style: 'destructive', onPress: handleExit },
//                 ]
//               );
//             } else {
//               navigation.goBack();
//             }
//           }}
//           style={styles.iconButton}
//           hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
//         >
//           <Icon name="caret-back-outline" size={24} color="#fff" />
//         </TouchableOpacity>

//         <View style={styles.timerContainer}>
//           <Animated.Image
//             source={require('../assets/Stopwatch.png')}
//             style={[
//               styles.timerIcon,
//               {
//                 transform: [{ scale: animateWatch }],
//                 tintColor: timeLeft <= 10 || isThirtySecPhase ? 'red' : '#fff',
//               },
//             ]}
//           />
//           <Text style={styles.timerText}>
//             {`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}
//           </Text>
//         </View>

//         <TouchableOpacity onPress={handleToggleSound} style={styles.iconButton1}>
//           <Icon name={isSoundOn ? 'volume-high' : 'volume-mute'} size={24} color="#fff" />
//         </TouchableOpacity>
//       </View>

//       {/* ── COMPUTER OPPONENT HEADER ── */}
//       <View style={styles.opponentHeader}>
//         <View style={styles.headerLeft}>
//           <View style={styles.opponentAvatarContainer}>
//             <View style={[styles.avatarCircle, { backgroundColor: '#0F766E', width: 40, height: 40 }]}>
//               <Text style={{ fontSize: 22 }}>🤖</Text>
//             </View>
//             {computerFeedback && (
//               <View style={[
//                 styles.computerFeedbackBubble,
//                 {
//                   backgroundColor:
//                     computerFeedback === 'correct'   ? '#10B981' :
//                     computerFeedback === 'skipped'   ? '#F59E0B' : '#EF4444',
//                 },
//               ]}>
//                 <Text style={{ fontSize: 10, color: '#fff', fontWeight: '700' }}>
//                   {computerFeedback === 'correct' ? '✓' : computerFeedback === 'skipped' ? 'SKIP' : '✗'}
//                 </Text>
//               </View>
//             )}
//           </View>

//           <View style={styles.opponentInfo}>
//             <Text style={styles.opponentName}>
//               {computerDisplayName || 'Computer'} 🤖
//             </Text>
//             <Text style={[styles.levelBadge, { color: theme.primary || '#FB923C' }]}>
//               Level {computerLevel} · Streak {computerStreak}
//             </Text>
//             <View style={styles.historyContainer}>
//               <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.historyScrollContent}>
//                 {computerHistory.map((item, i) => (
//                   <Icon
//                     key={i}
//                     name={item.skipped ? 'remove' : item.isCorrect ? 'checkmark' : 'close'}
//                     size={14}
//                     color={item.skipped ? '#F59E0B' : item.isCorrect ? '#10B981' : '#EF4444'}
//                     style={{ marginRight: 3 }}
//                   />
//                 ))}
//               </ScrollView>
//             </View>
//           </View>
//         </View>

//         <View style={styles.headerRight}>
//           <Text style={styles.scoreLabel}>{t('Pts')}</Text>
//           <Text style={styles.scoreValue}>{computerScore}</Text>
//         </View>
//       </View>

//       {/* ── MY DATA ── */}
//       <View style={styles.myDataContainer}>
//         <View style={styles.headerLeft}>
//           <View style={styles.opponentAvatarContainer}>
//             <View style={[styles.avatarCircle, { width: 42, height: 42, backgroundColor: '#4F46E5' }]}>
//               <Text style={styles.avatarInitial}>Y</Text>
//             </View>
//             <View style={styles.youBadge}>
//               <Text style={styles.youBadgeText}>{t('YOU')}</Text>
//             </View>
//           </View>

//           <View style={styles.opponentInfo}>
//             <Text style={styles.playerName}>You · Streak {playerStreak}</Text>
//             <View style={styles.historyContainer}>
//               <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.historyScrollContent}>
//                 {playerHistory.map((item, i) => (
//                   <Icon
//                     key={i}
//                     name={item.isCorrect ? 'checkmark' : 'close'}
//                     size={14}
//                     color={item.isCorrect ? '#10B981' : '#EF4444'}
//                     style={{ marginRight: 3 }}
//                   />
//                 ))}
//               </ScrollView>
//             </View>
//           </View>
//         </View>

//         <View style={styles.headerRight}>
//           <Text style={styles.scoreLabel}>{t('Pts')}</Text>
//           <Text style={styles.scoreValue}>{playerScore}</Text>
//         </View>
//       </View>

//       {/* ── QUESTION AREA ── */}
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>

//         <Text style={styles.questionCounter}>
//           Q {questionIndex} / {initialGameState?.totalQuestions ?? 20}
//         </Text>

//         <Text style={styles.question}>
//           {loading ? t('Loading...') : questionText}
//         </Text>

//         <View style={[
//           styles.answerBox,
//           { backgroundColor: theme.cardBackground || '#1E293B' },
//           feedback === 'correct'   ? { borderColor: '#10B981', borderWidth: 2 } :
//           feedback === 'incorrect' ? { borderColor: '#EF4444', borderWidth: 2 } :
//           feedback === 'skipped'   ? { borderColor: '#F59E0B', borderWidth: 2 } : {},
//         ]}>
//           {submitted && !feedback ? (
//             <ActivityIndicator size="small" color={theme.primary || '#FB923C'} />
//           ) : (
//             <Text style={[
//               styles.answerText,
//               feedback === 'correct'   ? { color: '#10B981' } :
//               feedback === 'incorrect' ? { color: '#EF4444' } :
//               feedback === 'skipped'   ? { color: '#F59E0B' } : {},
//             ]}>
//               {feedback === 'correct'   ? t('Correct')   :
//                feedback === 'incorrect' ? t('Incorrect') :
//                feedback === 'skipped'   ? t('Skipped')   :
//                input || ''}
//             </Text>
//           )}
//         </View>

//         {awaitingComputer && feedback && (
//           <Text style={styles.waitingText}>Waiting for computer...</Text>
//         )}
//       </View>

//       {/* ── KEYPAD ── */}
//       <View style={styles.keypadContainer}>
//         {currentLayout.map((row, rowIndex) => (
//           <View key={rowIndex} style={styles.keypadRow}>
//             {row.map((item, index) => {
//               const strItem = item.toString().toLowerCase();
//               const isSpecial = ['clear','clr','⌫','del','ref','pm','skip','.','reverse','enter','✓','ok'].includes(strItem);
//               const isNa = strItem === 'na';

//               if (isNa) return <View key={index} style={{ width: KEY_BTN_WIDTH, height: KEY_BTN_HEIGHT }} />;

//               let keyContent;
//               if (strItem === 'del' || strItem === '⌫') {
//                 keyContent = <MaterialIcons name="backspace" size={22} color="#fff" />;
//               } else if (strItem === 'ref' || strItem === 'reverse') {
//                 keyContent = (
//                   <Text style={[styles.keyText, { fontSize: scaleFont(14), fontWeight: '800', fontStyle: 'italic' }]}>
//                     {t('REV')}
//                   </Text>
//                 );
//               } else if (strItem === 'pm') {
//                 keyContent = <Text style={[styles.keyText, { color: '#fff' }]}>+/-</Text>;
//               } else if (strItem === 'clr' || strItem === 'clear') {
//                 keyContent = <Text style={[styles.keyText, { color: '#fff' }]}>{t('Clear')}</Text>;
//               } else if (strItem === 'skip') {
//                 keyContent = (
//                   <View style={{ alignItems: 'center', flexDirection: 'row' }}>
//                     <Text style={[styles.keyText, { fontSize: scaleFont(12) }]}>{t('Skip')}</Text>
//                     <MaterialIcons name="skip-next" size={20} color="#fff" />
//                   </View>
//                 );
//               } else if (strItem === 'enter' || strItem === '✓' || strItem === 'ok') {
//                 keyContent = (
//                   <View style={{ alignItems: 'center', justifyContent: 'center' }}>
//                     <Icon name="checkmark-circle" size={24} color="#10B981" />
//                   </View>
//                 );
//               } else {
//                 keyContent = <Text style={styles.keyText}>{item.toUpperCase ? item.toUpperCase() : item}</Text>;
//               }

//               const isRevActive = (strItem === 'ref' || strItem === 'reverse') && isRevMode;

//               return (
//                 <TouchableOpacity
//                   key={index}
//                   onPress={() => handlePress(strItem === 'ref' ? 'reverse' : item)}
//                   disabled={isKeypadDisabled}
//                   style={[
//                     styles.keyButton,
//                     { borderBottomWidth: 4, borderBottomColor: 'rgba(0,0,0,0.3)' },
//                     (isSpecial || strItem === '-') ? styles.specialKey : null,
//                     isRevActive && {
//                       shadowColor: theme.primaryColor || '#595CFF',
//                       shadowOffset: { width: 0, height: 4 },
//                       shadowOpacity: 0.5,
//                       shadowRadius: 8,
//                       transform: [{ scale: revScale }],
//                     },
//                     isKeypadDisabled && { opacity: 0.5 },
//                   ]}
//                 >
//                   {isRevActive ? (
//                     <LinearGradient
//                       colors={theme.buttonGradient || [theme.primaryColor || '#595CFF', theme.secondaryColor || '#87AEE9']}
//                       style={styles.gradientButton}
//                     >
//                       {keyContent}
//                     </LinearGradient>
//                   ) : !isSpecial && strItem !== '-' ? (
//                     <LinearGradient
//                       colors={theme.buttonGradient || [theme.primaryColor || '#595CFF', theme.secondaryColor || '#87AEE9']}
//                       style={styles.gradientButton}
//                     >
//                       {keyContent}
//                     </LinearGradient>
//                   ) : (
//                     <View style={{ alignItems: 'center', justifyContent: 'center' }}>{keyContent}</View>
//                   )}
//                 </TouchableOpacity>
//               );
//             })}
//           </View>
//         ))}
//       </View>

//       {/* ── RESULT MODAL ── */}
//       {showResultModal && resultData && (
//         <View style={styles.modalOverlay}>
//           <Animated.View
//             style={[
//               styles.resultCard,
//               {
//                 opacity:   resultFadeAnim,
//                 transform: [{ scale: resultScaleAnim }],
//                 borderColor:
//                   resultData.gameResult === 'win'  ? '#4ade80' :
//                   resultData.gameResult === 'lose' ? '#f87171' : '#fbbf24',
//               },
//             ]}
//           >
//             <View style={styles.modalHeader}>
//               <TouchableOpacity onPress={handleCloseResults} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
//                 <Icon name="close" size={28} color="#fff" />
//               </TouchableOpacity>
//             </View>

//             <View style={styles.resultContent}>
//               <View style={[
//                 styles.resultBadge,
//                 {
//                   backgroundColor:
//                     resultData.gameResult === 'win'  ? '#4ade80' :
//                     resultData.gameResult === 'lose' ? '#f87171' : '#fbbf24',
//                 },
//               ]}>
//                 <Text style={styles.resultBadgeText}>
//                   {resultData.gameResult === 'win'  ? t('VICTORY') :
//                    resultData.gameResult === 'lose' ? t('DEFEAT')  : t('DRAW')}
//                 </Text>
//               </View>

//               <Text style={[
//                 styles.resultTitle,
//                 {
//                   color:
//                     resultData.gameResult === 'win'  ? '#4ade80' :
//                     resultData.gameResult === 'lose' ? '#f87171' : '#fbbf24',
//                 },
//               ]}>
//                 {resultData.gameResult === 'win'  ? t('You Won!')  :
//                  resultData.gameResult === 'lose' ? t('You Lost!') : t('Draw!')}
//               </Text>

//               {/* ── SCORES ── */}
//               <View style={styles.modalPlayersContainer}>

//                 {/* ── CHANGE 2: Player avatar — real image or fallback initial ── */}
//                 <View style={styles.modalPlayer}>
//                   {resultData.playerProfile?.profileImage ? (
//                     <Image
//                       source={{ uri: resultData.playerProfile.profileImage }}
//                       style={styles.modalAvatar}
//                     />
//                   ) : (
//                     <View style={[styles.modalAvatar, { backgroundColor: '#4F46E5', justifyContent: 'center', alignItems: 'center' }]}>
//                       <Text style={[styles.avatarInitial, { fontSize: 24 }]}>
//                         {resultData.playerProfile?.username?.[0]?.toUpperCase() ?? 'Y'}
//                       </Text>
//                     </View>
//                   )}
//                   {/* ── CHANGE 3: Show real username or fallback to 'You' ── */}
//                   <Text style={styles.modalPlayerName}>
//                     {resultData.playerProfile?.username ?? t('You')}
//                   </Text>
//                   <Text style={styles.mainScore}>{resultData.totalScore}</Text>
//                 </View>

//                 <View style={styles.vsContainer}>
//                   <Text style={styles.modalVsText}>{t('VS')}</Text>
//                 </View>

//                 <View style={styles.modalPlayer}>
//                   <View style={[styles.modalAvatar, { backgroundColor: '#0F766E', justifyContent: 'center', alignItems: 'center' }]}>
//                     <Text style={{ fontSize: 30 }}>🤖</Text>
//                   </View>
//                   <Text style={styles.modalPlayerName}>{resultData.computerDisplayName || 'Computer'}</Text>
//                   <Text style={styles.mainScore}>{resultData.opponentScore}</Text>
//                 </View>

//               </View>

//               {/* Rating change
//               {/* {resultData.ratingChange !== undefined && (
//                 <View style={styles.ratingChangeRow}>
//                   <Text style={styles.ratingChangeLabel}>
//                     {t('Rating Change')}{resultData.diffCode ? ` (${resultData.diffCode})` : ''}
//                   </Text>
//                   <Text style={[
//                     styles.ratingChangeValue,
//                     { color: resultData.ratingChange >= 0 ? '#4ade80' : '#f87171' },
//                   ]}>
//                     {resultData.ratingChange >= 0 ? '+' : ''}{resultData.ratingChange}
//                     {' '}({resultData.ratingBefore} → {resultData.ratingAfter})
//                   </Text>
//                 </View>
//               )} */} 

//               {/* Stats */}
//               {resultData.stats && (
//                 <View style={styles.statsRow}>
//                   <View style={styles.statItem}>
//                     <Text style={styles.statValue}>{resultData.stats.gamesPlayed ?? 0}</Text>
//                     <Text style={styles.statLabel}>Played</Text>
//                   </View>
//                   <View style={styles.statItem}>
//                     <Text style={styles.statValue}>{resultData.stats.wins ?? 0}</Text>
//                     <Text style={styles.statLabel}>Wins</Text>
//                   </View>
//                   <View style={styles.statItem}>
//                     <Text style={styles.statValue}>{resultData.stats.winRate ?? 0}%</Text>
//                     <Text style={styles.statLabel}>Win Rate</Text>
//                   </View>
//                   <View style={styles.statItem}>
//                     <Text style={styles.statValue}>{resultData.stats.bestStreak ?? 0}</Text>
//                     <Text style={styles.statLabel}>Best Streak</Text>
//                   </View>
//                 </View>
//               )}

//               <Text style={{ fontSize: 38, marginTop: 8 }}>
//                 {resultData.gameResult === 'win' ? '🏆' : resultData.gameResult === 'lose' ? '😥' : '🤝'}
//               </Text>
//             </View>

//             {/* Action buttons */}
//             <View style={styles.modalActions}>
//               <TouchableOpacity
//                 style={[styles.actionButton, { backgroundColor: '#8B5CF6' }]}
//                 onPress={handleNewGame}
//               >
//                 <Text style={styles.actionButtonText}>{t('Play Again')}</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[styles.actionButton, { backgroundColor: '#3B82F6' }]}
//                 onPress={handleCloseResults}
//               >
//                 <Text style={styles.actionButtonText}>{t('Home')}</Text>
//               </TouchableOpacity>
//             </View>
//           </Animated.View>
//         </View>
//       )}

//     </View>
//   );

//   // ── Badge layer ──────────────────────────────────────────────────────────
  
//  // ✅ return becomes:
// return theme.backgroundGradient ? (
//   <LinearGradient colors={theme.backgroundGradient} style={{ flex: 1 }}>
//     {content}
//     {offlineBadges.length > 0 && (
//       <OfflineBadgesModal badges={offlineBadges} onDismiss={() => setOfflineBadges([])} />
//     )}
//   </LinearGradient>
// ) : (
//   <View style={{ flex: 1, backgroundColor: theme.backgroundColor || '#0B1220' }}>
//     {content}
//     {offlineBadges.length > 0 && (
//       <OfflineBadgesModal badges={offlineBadges} onDismiss={() => setOfflineBadges([])} />
//     )}
//   </View>
// );
// };

// export default ComputerGame;


// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   PixelRatio,
//   Animated,
//   AppState,
//   Alert,
//   BackHandler,
//   ScrollView,
//   ActivityIndicator,
//   Image,                // ← CHANGE 1: added Image import
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Icon from 'react-native-vector-icons/Ionicons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import {
//   useNavigation,
//   useRoute,
//   useFocusEffect,
// } from '@react-navigation/native';
// import LinearGradient from 'react-native-linear-gradient';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useTheme } from '../context/ThemeContext';
// import { useSound } from '../context/SoundContext';
// import { KEYPAD_LAYOUTS } from '../utils/keyboardLayouts';
// import { initSound, playEffect, stopEffect } from '../utils/SoundManager';
// import { useAppTranslation } from '../context/TranslationContext';
// import { useBadge } from '../context/BadgeContext';
// import ComputerGameSocket from '../utils/ComputerGameSocket';

// Text.defaultProps = Text.defaultProps || {};
// Text.defaultProps.allowFontScaling = false;

// const { width, height } = Dimensions.get('window');
// const FONT_SCALE = Math.min(PixelRatio.getFontScale(), 1.0);
// const scaleFont = size => size * FONT_SCALE;

// const KEY_BTN_WIDTH  = Math.min(width * 0.2, 78);
// const KEY_BTN_HEIGHT = Math.min(height * 0.085, 68);



// // ─── helpers ────────────────────────────────────────────────────────────────

// const getMathSymbol = symbol => {
//   const map = {
//     Sum: '+', Difference: '-', Subtract: '-',
//     Product: '×', Multiply: '×',
//     Quotient: '÷', Divide: '÷',
//     Modulus: '%', Exponent: '^',
//   };
//   return map[symbol] || symbol;
// };

// const formatQuestion = (q) => {
//   if (!q) return '';
//   const sym = getMathSymbol(q.symbol);
//   return `${q.input1} ${sym} ${q.input2}`;
// };

// const getExpectedAnswer = (q) => {
//   if (!q) return null;
//   const sym = (q.symbol || '').toLowerCase();
//   switch (sym) {
//     case 'sum':
//       return String(q.input1 + q.input2);
//     case 'difference':
//     case 'subtract':
//       return String(q.input1 - q.input2);
//     case 'product':
//     case 'multiply':
//       return String(q.input1 * q.input2);
//     case 'quotient':
//     case 'divide':
//       return q.input2 !== 0
//         ? String(q.input1 / q.input2)
//         : null;
//     default:
//       return null;
//   }
// };

// // ────────────────────────────────────────────────────────────────────────────

// const ComputerGame = () => {
//   const insets      = useSafeAreaInsets();
//   const navigation  = useNavigation();
//   const route       = useRoute();
//   const { theme, keyboardTheme } = useTheme();
//   const { isSoundOn, toggleSound } = useSound();
//   const { t }       = useAppTranslation();
//   // const newlyEarnedRef = useRef([]);
//   // // checkSilentBadges removed — dead fn no longer exists on BadgeContext.
//   // // Game-end badges arrive via the gameEnded socket payload (newlyEarned)
//   // // and are queued with showBadges() in onGameEnded below; no REST
//   // // safety-net call is needed.
//   const { showBadges } = useBadge();

// // newlyEarnedRef.current = data.newlyEarned;
//   // ── Route params ────────────────────────────────────────────────────────
//   const {
//     gameId:           initGameId,
//     computerLevel,
//     computerDisplayName,
//     difficulty,
//     diffCode,
//     selectedSymbols,
//     firstQuestion,
//     initialGameState,
//     timer,
//     myMongoId:        routeMyMongoId,
//   } = route.params || {};

//   console.log('🎮 [COMPUTER GAME] ========== COMPONENT MOUNTED ==========');
//   console.log('🎮 [COMPUTER GAME] Route params received:', {
//     gameId: initGameId,
//     computerLevel,
//     computerDisplayName,
//     difficulty,
//     diffCode,
//     selectedSymbols,
//     timer,
//   });
//   console.log('🎮 [COMPUTER GAME] Initial game state:', initialGameState);
//   console.log('🎮 [COMPUTER GAME] 📊 INITIAL PLAYER SCORE:', initialGameState?.playerScore ?? 0);
//   console.log('🎮 [COMPUTER GAME] 📊 INITIAL COMPUTER SCORE:', initialGameState?.computerScore ?? 0);
//   console.log('🎮 [COMPUTER GAME] 📊 INITIAL PLAYER METER:', initialGameState?.playerMeter ?? 5);
//   console.log('🎮 [COMPUTER GAME] 📊 DIFF CODE:', diffCode);

//   const currentLayout = KEYPAD_LAYOUTS[keyboardTheme] || KEYPAD_LAYOUTS.type1;

//   // ── Socket ref ───────────────────────────────────────────────────────────
//   const socketRef = useRef(null);

//   // ── Game state ──────────────────────────────────────────────────────────
//   const [gameId]            = useState(initGameId);
//   const [currentQ, setCurrentQ]             = useState(firstQuestion);
//   const [questionText, setQuestionText]     = useState(formatQuestion(firstQuestion));
//   const [questionIndex, setQuestionIndex]   = useState((firstQuestion?.index ?? 0) + 1);

//   const [input,    setInput]    = useState('');
//   const [feedback, setFeedback] = useState(null);
//   const [submitted, setSubmitted] = useState(false);
//   const [awaitingComputer, setAwaitingComputer] = useState(false);
//   const [gameEnded, setGameEnded] = useState(false);
//   const [loading,   setLoading]  = useState(false);

//   const gameEndedRef = useRef(false);

//   // Player stats
//   const [playerScore,  setPlayerScore]  = useState(initialGameState?.playerScore  ?? 0);
//   const [playerMeter,  setPlayerMeter]  = useState(initialGameState?.playerMeter  ?? 5);
//   const [playerStreak, setPlayerStreak] = useState(initialGameState?.playerStreak ?? 0);

//   // Computer stats
//   const [computerScore,  setComputerScore]  = useState(initialGameState?.computerScore  ?? 0);
//   const [computerMeter,  setComputerMeter]  = useState(initialGameState?.computerMeter  ?? 5);
//   const [computerStreak, setComputerStreak] = useState(initialGameState?.computerStreak ?? 0);

//   // History dots
//   const [playerHistory,   setPlayerHistory]   = useState([]);
//   const [computerHistory, setComputerHistory] = useState([]);

//   // Computer answer feedback
//   const [computerFeedback, setComputerFeedback] = useState(null);

//   // Timer
//   const totalTimeRef = useRef(parseInt(timer ?? 60, 10));
//   const [timeLeft, setTimeLeft] = useState(totalTimeRef.current);
//   const minutes = Math.floor(timeLeft / 60);
//   const seconds = timeLeft % 60;

//   const [animateWatch] = useState(new Animated.Value(1));
//   const [isThirtySecPhase, setIsThirtySecPhase] = useState(false);
//   const [isPaused, setIsPaused] = useState(false);

//   // Result modal
//   const [showResultModal,  setShowResultModal]  = useState(false);
//   const [resultData,       setResultData]       = useState(null);
//   const [resultFadeAnim]   = useState(new Animated.Value(0));
//   const [resultScaleAnim]  = useState(new Animated.Value(0.8));
//   const [showPostGameBadges, setShowPostGameBadges] = useState(false);

//   // const [offlineBadges, setOfflineBadges] = useState([]);

//   // Misc refs
//   const isSoundOnRef          = useRef(isSoundOn);
//   const last10PlayedRef       = useRef(false);
//   const appState              = useRef(AppState.currentState);
//   const hasNavigatedToResult  = useRef(false);
//   const gameIdRef             = useRef(initGameId);
//   const questionStartTimeRef  = useRef(Date.now());
//   const isSkipRef             = useRef(false);  // Track if current submission is a skip
//   const [isRevMode, setIsRevMode] = useState(false);
//   const revScale = useRef(new Animated.Value(1)).current;

//   // ── Keep gameEndedRef in sync ────────────────────────────────────────────
//   useEffect(() => {
//     gameEndedRef.current = gameEnded;
//   }, [gameEnded]);

//   // ── Attach socket ────────────────────────────────────────────────────────
// useEffect(() => {
//   console.log('🎮 [COMPUTER GAME] Attempting to get socket from ComputerGameSocket singleton');
//   const sock = ComputerGameSocket.get();
//   if (!sock) {
//     console.error('🎮 [COMPUTER GAME] ❌ NO SOCKET FOUND - Game session lost');
//     // Delay alert until screen is fully attached
//     setTimeout(() => {
//       Alert.alert('Error', 'Game session lost. Please try again.', [
//         { text: 'OK', onPress: () => navigation.replace('BottomTab') },
//       ]);
//     }, 500);
//     return;
//   }
//   console.log('🎮 [COMPUTER GAME] ✅ Socket retrieved successfully');
//   socketRef.current = sock;
// }, [navigation]);

//   // ── Sound init ───────────────────────────────────────────────────────────
//   useFocusEffect(
//     useCallback(() => {
//       initSound('correct',   'rightanswer.mp3');
//       initSound('incorrect', 'wronganswerr.mp3');
//       initSound('skipped',   'skip.mp3');
//       initSound('timer',     'every30second.wav');
//       initSound('ticktock',  'ticktock.mp3');
//     }, [])
//   );

//   useEffect(() => {
//     isSoundOnRef.current = isSoundOn;
//     if (!isSoundOn) {
//       stopEffect('ticktock');
//       last10PlayedRef.current = false;
//     }
//   }, [isSoundOn]);

//   // ── App state ────────────────────────────────────────────────────────────
//   useEffect(() => {
//     const sub = AppState.addEventListener('change', state => {
//       if (state !== 'active') stopEffect('ticktock');
//       else if (totalTimeRef.current <= 10 && totalTimeRef.current > 0) {
//         playEffect('ticktock', isSoundOnRef.current);
//       }
//       appState.current = state;
//     });
//     return () => sub.remove();
//   }, []);

//   // ── Hardware back ────────────────────────────────────────────────────────
//   useEffect(() => {
//   const handler = BackHandler.addEventListener('hardwareBackPress', () => {
//     if (!gameEndedRef.current) {
//       setTimeout(() => {
//         Alert.alert(
//           t('Leave Game?'),
//           t('Are you sure you want to leave?'),
//           [
//             { text: t('Cancel'), style: 'cancel' },
//             { text: t('Leave'), style: 'destructive', onPress: handleExit },
//           ]
//         );
//       }, 100);
//       return true;
//     }
//     return false;
//   });
//   return () => handler.remove();
// }, []);

//   // ── Cleanup on unmount ───────────────────────────────────────────────────
//   useEffect(() => {
//     return () => {
//       stopEffect('ticktock');
//       if (!hasNavigatedToResult.current && socketRef.current?.connected) {
//         socketRef.current.emit('leaveGame', gameIdRef.current);
//         ComputerGameSocket.clear();
//       }
//     };
//   }, []);

//   // ── Result Data Logging ───────────────────────────────────────────────────
//   useEffect(() => {
//     if (resultData) {
//       console.log('🎮 [COMPUTER GAME] resultData updated - DISPLAYING RESULT MODAL');
//       console.log('🎮 [COMPUTER GAME] 📊 FINAL RATING DISPLAY:');
//       console.log('  - Before:', resultData.ratingBefore);
//       console.log('  - After:', resultData.ratingAfter);
//       console.log('  - Change:', (resultData.ratingChange >= 0 ? '+' : '') + resultData.ratingChange);
//       console.log('  - DiffCode/Bucket:', resultData.diffCode);
//       console.log('  - Game Result:', resultData.gameResult);
//       console.log('  - Player Score:', resultData.totalScore);
//       console.log('  - Computer Score:', resultData.opponentScore);
//     }
//   }, [resultData]);

//   // ── showResult ───────────────────────────────────────────────────────────
//   const showResult = useCallback((data) => {
//     console.log('🎮 [COMPUTER GAME] showResult() called with data:', JSON.stringify(data, null, 2));
//     console.log('🎮 [COMPUTER GAME] 📊 RESULT MODAL DATA - Game Result:', data.gameResult);
//     console.log('🎮 [COMPUTER GAME] 📊 RESULT MODAL - Rating Change:', (data.ratingChange >= 0 ? '+' : '') + data.ratingChange);
//     console.log('🎮 [COMPUTER GAME] 📊 RESULT MODAL - Final Rating:', data.ratingAfter);
//     console.log('🎮 [COMPUTER GAME] 📊 RESULT MODAL - DiffCode (bucket):', data.diffCode);

//     if (hasNavigatedToResult.current) {
//       console.log('🎮 [COMPUTER GAME] ⚠️ Already navigated to result, returning early');
//       return;
//     }
//     hasNavigatedToResult.current = true;

//     gameEndedRef.current = true;

//     setGameEnded(true);
//     stopEffect('ticktock');

//     resultFadeAnim.setValue(0);
//     resultScaleAnim.setValue(0.8);
//     setResultData(data);
//     setShowResultModal(true);

//     // Badges from this match were already queued in onGameEnded() via
//     // showBadges(data.newlyEarned) — that's the single source of truth now.
//     // This callback only handles the result-modal entrance animation, then
//     // flips showPostGameBadges so the post-game badge UI can render.
//     setTimeout(() => {
//       Animated.parallel([
//         Animated.timing(resultFadeAnim,  { toValue: 1, duration: 500, useNativeDriver: true }),
//         Animated.spring(resultScaleAnim, { toValue: 1, friction: 5,   useNativeDriver: true }),
//       ]).start(() => {
//         setTimeout(() => {
//           setShowPostGameBadges(true);
//         }, 3000);
//       });
//     }, 50);
//   }, [resultFadeAnim, resultScaleAnim]);

//   // ── Socket event listeners ────────────────────────────────────────────────
//   useEffect(() => {
//     const sock = socketRef.current;
//     if (!sock) return;

//     const onPlayerAnswerResult = (data) => {
//       console.log('🎮 [COMPUTER GAME] playerAnswerResult event received:', data);
//       console.log('🎮 [COMPUTER GAME] 📊 PLAYER ANSWER RESULT - isCorrect:', data.isCorrect);
//       console.log('🎮 [COMPUTER GAME] 📊 New player score:', data.playerScore);
//       console.log('🎮 [COMPUTER GAME] 📊 New player meter:', data.playerMeter);
//       console.log('🎮 [COMPUTER GAME] 📊 New player streak:', data.playerStreak);

//       setPlayerScore(data.playerScore);
//       setPlayerMeter(data.playerMeter);
//       setPlayerStreak(data.playerStreak);

//       // Determine feedback: check if this was a skip first
//       let fb;
//       if (isSkipRef.current) {
//         fb = 'skipped';
//         setPlayerHistory(prev => [{ isCorrect: false, skipped: true }, ...prev].slice(0, 8));
//       } else {
//         fb = data.isCorrect ? 'correct' : 'incorrect';
//         setPlayerHistory(prev => [{ isCorrect: data.isCorrect }, ...prev].slice(0, 8));
//       }

//       setFeedback(fb);
//       playEffect(fb, isSoundOnRef.current);

//       setSubmitted(true);
//       setAwaitingComputer(true);
//       isSkipRef.current = false;  // Reset skip flag
//     };

//     const onComputerAnswerResult = (data) => {
//       console.log('🎮 [COMPUTER GAME] computerAnswerResult event received:', data);
//       console.log('🎮 [COMPUTER GAME] 📊 COMPUTER ANSWER - isCorrect:', data.isCorrect, 'skipped:', data.skipped);
//       console.log('🎮 [COMPUTER GAME] 📊 New computer score:', data.computerScore);
//       console.log('🎮 [COMPUTER GAME] 📊 New computer meter:', data.computerMeter);
//       console.log('🎮 [COMPUTER GAME] 📊 New computer streak:', data.computerStreak);

//       setComputerScore(data.computerScore);
//       setComputerMeter(data.computerMeter);
//       setComputerStreak(data.computerStreak);

//       if (data.skipped) {
//         setComputerFeedback('skipped');
//         setComputerHistory(prev => [{ isCorrect: false, skipped: true }, ...prev].slice(0, 8));
//       } else {
//         setComputerFeedback(data.isCorrect ? 'correct' : 'incorrect');
//         setComputerHistory(prev => [{ isCorrect: data.isCorrect }, ...prev].slice(0, 8));
//       }

//       setTimeout(() => setComputerFeedback(null), 1200);
//     };

//     const onNextQuestion = (data) => {
//       setCurrentQ(data);
//       setQuestionText(formatQuestion(data));
//       setInput('');
//       setFeedback(null);
//       setSubmitted(false);
//       setAwaitingComputer(false);
//       setLoading(false);
//       setQuestionIndex(data.index + 1);
//       questionStartTimeRef.current = Date.now();
//     };

//     const onGameEnded = (data) => {
//       console.log('🎮 [COMPUTER GAME] ========== GAME ENDED EVENT RECEIVED ==========');
//       console.log('🎮 [COMPUTER GAME] Game end data:', JSON.stringify(data, null, 2));
//       console.log('🎮 [COMPUTER GAME] 🏁 GAME RESULT:', data.result);
//       console.log('🎮 [COMPUTER GAME] 📊 FINAL PLAYER SCORE:', data.playerScore);
//       console.log('🎮 [COMPUTER GAME] 📊 FINAL COMPUTER SCORE:', data.computerScore);
//       console.log('🎮 [COMPUTER GAME] 📊 RATING CHANGE DATA:', {
//         before: data.ratingBefore,
//         after: data.ratingAfter,
//         change: data.ratingChange,
//         diffCode: diffCode,
//       });
//       console.log('🎮 [COMPUTER GAME] 💰 RATING BEFORE:', data.ratingBefore);
//       console.log('🎮 [COMPUTER GAME] 💰 RATING AFTER:', data.ratingAfter);
//       console.log('🎮 [COMPUTER GAME] 💰 RATING CHANGE:', (data.ratingChange >= 0 ? '+' : '') + data.ratingChange);
//       console.log('🎮 [COMPUTER GAME] 📊 STATS:', data.stats);
//       console.log('🎮 [COMPUTER GAME] 📊 END REASON:', data.endReason);

//       gameEndedRef.current = true;

//       if (data.newlyEarned?.length > 0) {
//         console.log('🎮 [COMPUTER GAME] 🏅 NEW BADGES EARNED:', data.newlyEarned);
//         showBadges(data.newlyEarned);
//       }

//       let gameResult = 'draw';
//       if (data.result === 'PlayerWon')   gameResult = 'win';
//       if (data.result === 'ComputerWon') gameResult = 'lose';

//       showResult({
//         gameResult,
//         totalScore:          data.playerScore,
//         opponentScore:       data.computerScore,
//         ratingBefore:        data.ratingBefore,
//         ratingAfter:         data.ratingAfter,
//         ratingChange:        data.ratingChange,
//         endReason:           data.endReason,
//         stats:               data.stats,
//         winner:              data.winner,
//         computerLevel,
//         computerDisplayName,
//         diffCode,
//         playerProfile:       data.playerProfile,  // ← already passing through
//       });

//       setTimeout(() => {
//         if (socketRef.current?.connected) {
//           ComputerGameSocket.clear();
//         }
//       }, 500);
//     };

//     const onConnectError = (err) => {
//   console.error('Computer game socket error:', err.message);
//   if (!hasNavigatedToResult.current) {
//     setTimeout(() => {
//       Alert.alert(
//         t('Connection Lost'),
//         t('Disconnected from game server.'),
//         [{ text: t('OK'), onPress: () => navigation.replace('BottomTab') }]
//       );
//     }, 500);
//   }
// };

//     sock.on('playerAnswerResult',   onPlayerAnswerResult);
//     sock.on('computerAnswerResult', onComputerAnswerResult);
//     sock.on('nextQuestion',         onNextQuestion);
//     sock.on('gameEnded',            onGameEnded);
//     sock.on('connect_error',        onConnectError);

//     return () => {
//       sock.off('playerAnswerResult',   onPlayerAnswerResult);
//       sock.off('computerAnswerResult', onComputerAnswerResult);
//       sock.off('nextQuestion',         onNextQuestion);
//       sock.off('gameEnded',            onGameEnded);
//       sock.off('connect_error',        onConnectError);
//     };
//   }, [showResult, showBadges, computerLevel, computerDisplayName, navigation, t, diffCode]);

//   // ── Timer ─────────────────────────────────────────────────────────────────
//   useEffect(() => {
//     if (gameEnded) return;

//     const interval = setInterval(() => {
//       if (isPaused) return;

//       totalTimeRef.current -= 1;
//       const remaining = totalTimeRef.current;
//       setTimeLeft(remaining);

//       if (remaining <= 10 && remaining > 0 && !last10PlayedRef.current) {
//         playEffect('ticktock', isSoundOnRef.current);
//         last10PlayedRef.current = true;
//       }

//       if (remaining <= 10 && remaining > 0) {
//         Animated.sequence([
//           Animated.timing(animateWatch, { toValue: 1.4, duration: 300, useNativeDriver: true }),
//           Animated.timing(animateWatch, { toValue: 1,   duration: 300, useNativeDriver: true }),
//         ]).start();
//       }

//       if (remaining % 30 === 0 && remaining !== parseInt(timer ?? 60, 10) && remaining > 0) {
//         setIsThirtySecPhase(true);
//         playEffect('timer', isSoundOnRef.current);
//         Animated.sequence([
//           Animated.timing(animateWatch, { toValue: 1.4, duration: 300, useNativeDriver: true }),
//           Animated.timing(animateWatch, { toValue: 1,   duration: 300, useNativeDriver: true }),
//         ]).start(() => setIsThirtySecPhase(false));
//       }

//       if (remaining <= 0) {
//         clearInterval(interval);
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isPaused, gameEnded]);

//   // ── Core submit function ──────────────────────────────────────────────────
//   const submitAnswer = useCallback((answerValue) => {
//     if (gameEndedRef.current) {
//       console.log('🎮 [COMPUTER GAME] submitAnswer blocked — game already ended');
//       return;
//     }
//     if (!socketRef.current?.connected) return;

//     const timeSpent = Date.now() - questionStartTimeRef.current;

//     socketRef.current.emit(
//       'submitAnswer',
//       {
//         gameId:        gameIdRef.current,
//         questionIndex: currentQ?.index ?? 0,
//         answer:        answerValue,
//         timeSpent,
//       },
//       (ack) => {
//         if (!ack?.success) {
//           console.error('submitAnswer ack error:', ack?.error);
//           if (!gameEndedRef.current) {
//             setSubmitted(false);
//             setAwaitingComputer(false);
//           }
//         }
//       }
//     );
//   }, [currentQ]);

//   // ── Handlers ─────────────────────────────────────────────────────────────

//   const handleExit = useCallback(() => {
//     stopEffect('ticktock');
//     hasNavigatedToResult.current = true;
//     gameEndedRef.current = true;
//     setGameEnded(true);

//     if (socketRef.current?.connected) {
//       socketRef.current.emit('leaveGame', gameIdRef.current);
//     }
//     if (socketRef.current) {
//       ComputerGameSocket.clear();
//     }
//     navigation.replace('BottomTab');
//   }, [navigation]);

//   const handleToggleSound = () => {
//     toggleSound();
//     const newVal = !isSoundOn;
//     isSoundOnRef.current = newVal;
//     if (!newVal) {
//       stopEffect('ticktock');
//     } else if (totalTimeRef.current <= 10 && totalTimeRef.current > 0) {
//       last10PlayedRef.current = false;
//       playEffect('ticktock', true);
//     }
//   };

//   const handlePress = useCallback((value) => {
//     if (gameEndedRef.current || submitted) return;

//     const key = value.toString().toLowerCase();

//     if (key === 'clear' || key === 'clr') {
//       setInput('');
//       return;
//     }

//     if (key === '⌫' || key === 'del') {
//       setInput(prev => prev.slice(0, -1));
//       return;
//     }

//     if (key === 'reverse' || key === 'ref') {
//       setIsRevMode(prev => !prev);
//       return;
//     }

//     if (key === 'pm') {
//       setInput(prev => prev.startsWith('-') ? prev.slice(1) : '-' + prev);
//       return;
//     }

//     if (key === 'skip') {
//       if (gameEndedRef.current) return;

//       isSkipRef.current = true;  // Mark this submission as a skip
//       playEffect('skipped', isSoundOnRef.current);
//       setFeedback('skipped');
//       setSubmitted(true);
//       setAwaitingComputer(true);

//       const timeSpent = Date.now() - questionStartTimeRef.current;
//       if (socketRef.current?.connected) {
//         socketRef.current.emit(
//           'submitAnswer',
//           {
//             gameId:        gameIdRef.current,
//             questionIndex: currentQ?.index ?? 0,
//             answer:        '',
//             timeSpent,
//           },
//           (ack) => {
//             if (!ack?.success) {
//               console.error('submitAnswer (skip) ack error:', ack?.error);
//             }
//           }
//         );
//       }
//       return;
//     }

//     if (key === 'enter' || key === '✓' || key === 'ok') {
//       if (input.length === 0) return;
//       if (gameEndedRef.current) return;
//       setSubmitted(true);
//       setAwaitingComputer(true);
//       submitAnswer(input);
//       return;
//     }

//     if (!/^[0-9.-]$/.test(value.toString())) return;

//     if (value === '.' && input.includes('.')) return;
//     if (value === '-' && input.length > 0) return;

//     const newInput = isRevMode
//       ? value.toString() + input
//       : input + value.toString();

//     setInput(newInput);

// const expected = getExpectedAnswer(currentQ);
// const isDecimal = expected !== null && expected.includes('.');

// if (expected !== null) {
//   const shouldSubmit = isDecimal
//     ? newInput.length === expected.length && newInput.includes('.')
//     : newInput.length === expected.length;

//   if (shouldSubmit) {
//     setTimeout(() => {
//       if (gameEndedRef.current) {
//         console.log('🎮 [COMPUTER GAME] Auto-submit blocked — game ended during delay');
//         return;
//       }
//       setSubmitted(prev => {
//         if (prev) return prev;
//         setAwaitingComputer(true);
//         submitAnswer(newInput);
//         return true;
//       });
//     }, 80);
//   }
// }
// }, [gameEnded, submitted, input, isRevMode, currentQ, submitAnswer]);
//   // ── Result handlers ──────────────────────────────────────────────────────

//   const handleNewGame = () => navigation.navigate('PlayGame', {
//     gametype: 'MULTIPLAYER',
//     computerLevel: computerLevel,
//   });
//   const handleCloseResults = () => navigation.navigate('BottomTab');

//   // ── Keypad disabled state ────────────────────────────────────────────────
//   const isKeypadDisabled = gameEnded || submitted;

//   // ────────────────────────────────────────────────────────────────────────
//   // RENDER
//   // ────────────────────────────────────────────────────────────────────────

//   const content = (
//     <View style={[styles.container, { paddingTop: insets.top + 30 }]}>

//       {/* TOP BAR */}
//       <View style={[styles.topBar, { backgroundColor: theme.cardBackground || '#1E293B' }]}>
//         <TouchableOpacity
//           onPress={() => {
//   if (!gameEndedRef.current) {
//     setTimeout(() => {
//       Alert.alert(
//         t('Leave Game?'),
//         t('Are you sure you want to leave? You will lose the match.'),
//         [
//           { text: t('Cancel'), style: 'cancel' },
//           { text: t('Leave'), style: 'destructive', onPress: handleExit },
//         ]
//       );
//     }, 100);
//   } else {
//     navigation.goBack();
//   }
// }} 
//           style={styles.iconButton}
//           hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
//         >
//           <Icon name="caret-back-outline" size={24} color="#fff" />
//         </TouchableOpacity>

//         <View style={styles.timerContainer}>
//           <Animated.Image
//             source={require('../assets/Stopwatch.png')}
//             style={[
//               styles.timerIcon,
//               {
//                 transform: [{ scale: animateWatch }],
//                 tintColor: timeLeft <= 10 || isThirtySecPhase ? 'red' : '#fff',
//               },
//             ]}
//           />
//           <Text style={styles.timerText}>
//             {`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}
//           </Text>
//         </View>

//         <TouchableOpacity onPress={handleToggleSound} style={styles.iconButton1}>
//           <Icon name={isSoundOn ? 'volume-high' : 'volume-mute'} size={24} color="#fff" />
//         </TouchableOpacity>
//       </View>

//       {/* ── COMPUTER OPPONENT HEADER ── */}
//       <View style={styles.opponentHeader}>
//         <View style={styles.headerLeft}>
//           <View style={styles.opponentAvatarContainer}>
//             <View style={[styles.avatarCircle, { backgroundColor: '#0F766E', width: 40, height: 40 }]}>
//               <Text style={{ fontSize: 22 }}>🤖</Text>
//             </View>
//             {computerFeedback && (
//               <View style={[
//                 styles.computerFeedbackBubble,
//                 {
//                   backgroundColor:
//                     computerFeedback === 'correct'   ? '#10B981' :
//                     computerFeedback === 'skipped'   ? '#F59E0B' : '#EF4444',
//                 },
//               ]}>
//                 <Text style={{ fontSize: 10, color: '#fff', fontWeight: '700' }}>
//                   {computerFeedback === 'correct' ? '✓' : computerFeedback === 'skipped' ? 'SKIP' : '✗'}
//                 </Text>
//               </View>
//             )}
//           </View>

//           <View style={styles.opponentInfo}>
//             <Text style={styles.opponentName}>
//               {computerDisplayName || 'Computer'} 🤖
//             </Text>
//             <Text style={[styles.levelBadge, { color: theme.primary || '#FB923C' }]}>
//               Level {computerLevel} · Streak {computerStreak}
//             </Text>
//             <View style={styles.historyContainer}>
//               <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.historyScrollContent}>
//                 {computerHistory.map((item, i) => (
//                   <Icon
//                     key={i}
//                     name={item.skipped ? 'remove' : item.isCorrect ? 'checkmark' : 'close'}
//                     size={14}
//                     color={item.skipped ? '#F59E0B' : item.isCorrect ? '#10B981' : '#EF4444'}
//                     style={{ marginRight: 3 }}
//                   />
//                 ))}
//               </ScrollView>
//             </View>
//           </View>
//         </View>

//         <View style={styles.headerRight}>
//           <Text style={styles.scoreLabel}>{t('Pts')}</Text>
//           <Text style={styles.scoreValue}>{computerScore}</Text>
//         </View>
//       </View>

//       {/* ── MY DATA ── */}
//       <View style={styles.myDataContainer}>
//         <View style={styles.headerLeft}>
//           <View style={styles.opponentAvatarContainer}>
//             <View style={[styles.avatarCircle, { width: 42, height: 42, backgroundColor: '#4F46E5' }]}>
//               <Text style={styles.avatarInitial}>Y</Text>
//             </View>
//             <View style={styles.youBadge}>
//               <Text style={styles.youBadgeText}>{t('YOU')}</Text>
//             </View>
//           </View>

//           <View style={styles.opponentInfo}>
//             <Text style={styles.playerName}>You · Streak {playerStreak}</Text>
//             <View style={styles.historyContainer}>
//               <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.historyScrollContent}>
//                 {playerHistory.map((item, i) => (
//                   <Icon
//                     key={i}
//                     name={item.isCorrect ? 'checkmark' : 'close'}
//                     size={14}
//                     color={item.isCorrect ? '#10B981' : '#EF4444'}
//                     style={{ marginRight: 3 }}
//                   />
//                 ))}
//               </ScrollView>
//             </View>
//           </View>
//         </View>

//         <View style={styles.headerRight}>
//           <Text style={styles.scoreLabel}>{t('Pts')}</Text>
//           <Text style={styles.scoreValue}>{playerScore}</Text>
//         </View>
//       </View>

//       {/* ── QUESTION AREA ── */}
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>

//         <Text style={styles.questionCounter}>
//           Q {questionIndex} / {initialGameState?.totalQuestions ?? 20}
//         </Text>

//         <Text style={styles.question}>
//           {loading ? t('Loading...') : questionText}
//         </Text>

//         <View style={[
//           styles.answerBox,
//           { backgroundColor: theme.cardBackground || '#1E293B' },
//           feedback === 'correct'   ? { borderColor: '#10B981', borderWidth: 2 } :
//           feedback === 'incorrect' ? { borderColor: '#EF4444', borderWidth: 2 } :
//           feedback === 'skipped'   ? { borderColor: '#F59E0B', borderWidth: 2 } : {},
//         ]}>
//           {submitted && !feedback ? (
//             <ActivityIndicator size="small" color={theme.primary || '#FB923C'} />
//           ) : (
//             <Text style={[
//               styles.answerText,
//               feedback === 'correct'   ? { color: '#10B981' } :
//               feedback === 'incorrect' ? { color: '#EF4444' } :
//               feedback === 'skipped'   ? { color: '#F59E0B' } : {},
//             ]}>
//               {feedback === 'correct'   ? t('Correct')   :
//                feedback === 'incorrect' ? t('Incorrect') :
//                feedback === 'skipped'   ? t('Skipped')   :
//                input || ''}
//             </Text>
//           )}
//         </View>

//         {awaitingComputer && feedback && (
//           <Text style={styles.waitingText}>Waiting for computer...</Text>
//         )}
//       </View>

//       {/* ── KEYPAD ── */}
//       <View style={styles.keypadContainer}>
//         {currentLayout.map((row, rowIndex) => (
//           <View key={rowIndex} style={styles.keypadRow}>
//             {row.map((item, index) => {
//               const strItem = item.toString().toLowerCase();
//               const isSpecial = ['clear','clr','⌫','del','ref','pm','skip','.','reverse','enter','✓','ok'].includes(strItem);
//               const isNa = strItem === 'na';

//               if (isNa) return <View key={index} style={{ width: KEY_BTN_WIDTH, height: KEY_BTN_HEIGHT }} />;

//               let keyContent;
//               if (strItem === 'del' || strItem === '⌫') {
//                 keyContent = <MaterialIcons name="backspace" size={22} color="#fff" />;
//               } else if (strItem === 'ref' || strItem === 'reverse') {
//                 keyContent = (
//                   <Text style={[styles.keyText, { fontSize: scaleFont(14), fontWeight: '800', fontStyle: 'italic' }]}>
//                     {t('REV')}
//                   </Text>
//                 );
//               } else if (strItem === 'pm') {
//                 keyContent = <Text style={[styles.keyText, { color: '#fff' }]}>+/-</Text>;
//               } else if (strItem === 'clr' || strItem === 'clear') {
//                 keyContent = <Text style={[styles.keyText, { color: '#fff' }]}>{t('Clear')}</Text>;
//               } else if (strItem === 'skip') {
//                 keyContent = (
//                   <View style={{ alignItems: 'center', flexDirection: 'row' }}>
//                     <Text style={[styles.keyText, { fontSize: scaleFont(12) }]}>{t('Skip')}</Text>
//                     <MaterialIcons name="skip-next" size={20} color="#fff" />
//                   </View>
//                 );
//               } else if (strItem === 'enter' || strItem === '✓' || strItem === 'ok') {
//                 keyContent = (
//                   <View style={{ alignItems: 'center', justifyContent: 'center' }}>
//                     <Icon name="checkmark-circle" size={24} color="#10B981" />
//                   </View>
//                 );
//               } else {
//                 keyContent = <Text style={styles.keyText}>{item.toUpperCase ? item.toUpperCase() : item}</Text>;
//               }

//               const isRevActive = (strItem === 'ref' || strItem === 'reverse') && isRevMode;

//               return (
//                 <TouchableOpacity
//                   key={index}
//                   onPress={() => handlePress(strItem === 'ref' ? 'reverse' : item)}
//                   disabled={isKeypadDisabled}
//                   style={[
//                     styles.keyButton,
//                     { borderBottomWidth: 4, borderBottomColor: 'rgba(0,0,0,0.3)' },
//                     (isSpecial || strItem === '-') ? styles.specialKey : null,
//                     isRevActive && {
//                       shadowColor: theme.primaryColor || '#595CFF',
//                       shadowOffset: { width: 0, height: 4 },
//                       shadowOpacity: 0.5,
//                       shadowRadius: 8,
//                       transform: [{ scale: revScale }],
//                     },
//                     isKeypadDisabled && { opacity: 0.5 },
//                   ]}
//                 >
//                   {isRevActive ? (
//                     <LinearGradient
//                       colors={theme.buttonGradient || [theme.primaryColor || '#595CFF', theme.secondaryColor || '#87AEE9']}
//                       style={styles.gradientButton}
//                     >
//                       {keyContent}
//                     </LinearGradient>
//                   ) : !isSpecial && strItem !== '-' ? (
//                     <LinearGradient
//                       colors={theme.buttonGradient || [theme.primaryColor || '#595CFF', theme.secondaryColor || '#87AEE9']}
//                       style={styles.gradientButton}
//                     >
//                       {keyContent}
//                     </LinearGradient>
//                   ) : (
//                     <View style={{ alignItems: 'center', justifyContent: 'center' }}>{keyContent}</View>
//                   )}
//                 </TouchableOpacity>
//               );
//             })}
//           </View>
//         ))}
//       </View>

//       {/* ── RESULT MODAL ── */}
//       {showResultModal && resultData && (
//         <View style={styles.modalOverlay}>
//           <Animated.View
//             style={[
//               styles.resultCard,
//               {
//                 opacity:   resultFadeAnim,
//                 transform: [{ scale: resultScaleAnim }],
//                 borderColor:
//                   resultData.gameResult === 'win'  ? '#4ade80' :
//                   resultData.gameResult === 'lose' ? '#f87171' : '#fbbf24',
//               },
//             ]}
//           >
//             <View style={styles.modalHeader}>
//               <TouchableOpacity onPress={handleCloseResults} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
//                 <Icon name="close" size={28} color="#fff" />
//               </TouchableOpacity>
//             </View>

//             <View style={styles.resultContent}>
//               <View style={[
//                 styles.resultBadge,
//                 {
//                   backgroundColor:
//                     resultData.gameResult === 'win'  ? '#4ade80' :
//                     resultData.gameResult === 'lose' ? '#f87171' : '#fbbf24',
//                 },
//               ]}>
//                 <Text style={styles.resultBadgeText}>
//                   {resultData.gameResult === 'win'  ? t('VICTORY') :
//                    resultData.gameResult === 'lose' ? t('DEFEAT')  : t('DRAW')}
//                 </Text>
//               </View>

//               <Text style={[
//                 styles.resultTitle,
//                 {
//                   color:
//                     resultData.gameResult === 'win'  ? '#4ade80' :
//                     resultData.gameResult === 'lose' ? '#f87171' : '#fbbf24',
//                 },
//               ]}>
//                 {resultData.gameResult === 'win'  ? t('You Won!')  :
//                  resultData.gameResult === 'lose' ? t('You Lost!') : t('Draw!')}
//               </Text>

//               {/* ── SCORES ── */}
//               <View style={styles.modalPlayersContainer}>

//                 {/* ── CHANGE 2: Player avatar — real image or fallback initial ── */}
//                 <View style={styles.modalPlayer}>
//                   {resultData.playerProfile?.profileImage ? (
//                     <Image
//                       source={{ uri: resultData.playerProfile.profileImage }}
//                       style={styles.modalAvatar}
//                     />
//                   ) : (
//                     <View style={[styles.modalAvatar, { backgroundColor: '#4F46E5', justifyContent: 'center', alignItems: 'center' }]}>
//                       <Text style={[styles.avatarInitial, { fontSize: 24 }]}>
//                         {resultData.playerProfile?.username?.[0]?.toUpperCase() ?? 'Y'}
//                       </Text>
//                     </View>
//                   )}
//                   {/* ── CHANGE 3: Show real username or fallback to 'You' ── */}
//                   <Text style={styles.modalPlayerName}>
//                     {resultData.playerProfile?.username ?? t('You')}
//                   </Text>
//                   <Text style={styles.mainScore}>{resultData.totalScore}</Text>
//                 </View>

//                 <View style={styles.vsContainer}>
//                   <Text style={styles.modalVsText}>{t('VS')}</Text>
//                 </View>

//                 <View style={styles.modalPlayer}>
//                   <View style={[styles.modalAvatar, { backgroundColor: '#0F766E', justifyContent: 'center', alignItems: 'center' }]}>
//                     <Text style={{ fontSize: 30 }}>🤖</Text>
//                   </View>
//                   <Text style={styles.modalPlayerName}>{resultData.computerDisplayName || 'Computer'}</Text>
//                   <Text style={styles.mainScore}>{resultData.opponentScore}</Text>
//                 </View>

//               </View>

//               {/* Rating change
//               {/* {resultData.ratingChange !== undefined && (
//                 <View style={styles.ratingChangeRow}>
//                   <Text style={styles.ratingChangeLabel}>
//                     {t('Rating Change')}{resultData.diffCode ? ` (${resultData.diffCode})` : ''}
//                   </Text>
//                   <Text style={[
//                     styles.ratingChangeValue,
//                     { color: resultData.ratingChange >= 0 ? '#4ade80' : '#f87171' },
//                   ]}>
//                     {resultData.ratingChange >= 0 ? '+' : ''}{resultData.ratingChange}
//                     {' '}({resultData.ratingBefore} → {resultData.ratingAfter})
//                   </Text>
//                 </View>
//               )} */} 

//               {/* Stats */}
//               {resultData.stats && (
//                 <View style={styles.statsRow}>
//                   <View style={styles.statItem}>
//                     <Text style={styles.statValue}>{resultData.stats.gamesPlayed ?? 0}</Text>
//                     <Text style={styles.statLabel}>Played</Text>
//                   </View>
//                   <View style={styles.statItem}>
//                     <Text style={styles.statValue}>{resultData.stats.wins ?? 0}</Text>
//                     <Text style={styles.statLabel}>Wins</Text>
//                   </View>
//                   <View style={styles.statItem}>
//                     <Text style={styles.statValue}>{resultData.stats.winRate ?? 0}%</Text>
//                     <Text style={styles.statLabel}>Win Rate</Text>
//                   </View>
//                   <View style={styles.statItem}>
//                     <Text style={styles.statValue}>{resultData.stats.bestStreak ?? 0}</Text>
//                     <Text style={styles.statLabel}>Best Streak</Text>
//                   </View>
//                 </View>
//               )}

//               <Text style={{ fontSize: 38, marginTop: 8 }}>
//                 {resultData.gameResult === 'win' ? '🏆' : resultData.gameResult === 'lose' ? '😥' : '🤝'}
//               </Text>
//             </View>

//             {/* Action buttons */}
//             <View style={styles.modalActions}>
//               <TouchableOpacity
//                 style={[styles.actionButton, { backgroundColor: '#8B5CF6' }]}
//                 onPress={handleNewGame}
//               >
//                 <Text style={styles.actionButtonText}>{t('Play Again')}</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[styles.actionButton, { backgroundColor: '#3B82F6' }]}
//                 onPress={handleCloseResults}
//               >
//                 <Text style={styles.actionButtonText}>{t('Home')}</Text>
//               </TouchableOpacity>
//             </View>
//           </Animated.View>
//         </View>
//       )}

//     </View>
//   );

//   // ── Badge layer ──────────────────────────────────────────────────────────
  
//  // ✅ return becomes:
// return theme.backgroundGradient ? (
//   <LinearGradient colors={theme.backgroundGradient} style={{ flex: 1 }}>
//     {content}
//   </LinearGradient>
// ) : (
//   <View style={{ flex: 1, backgroundColor: theme.backgroundColor || '#0B1220' }}>
//     {content}
//   </View>
// );
// };

// export default ComputerGame;

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  PixelRatio,
  Animated,
  AppState,
  Alert,
  BackHandler,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useSound } from '../context/SoundContext';
import { KEYPAD_LAYOUTS } from '../utils/keyboardLayouts';
import { initSound, playEffect, stopEffect } from '../utils/SoundManager';
import { useAppTranslation } from '../context/TranslationContext';
import { useBadge } from '../context/BadgeContext';
import ComputerGameSocket from '../utils/ComputerGameSocket';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

const { width, height } = Dimensions.get('window');
const FONT_SCALE = Math.min(PixelRatio.getFontScale(), 1.0);
const scaleFont = size => size * FONT_SCALE;

const KEY_BTN_WIDTH  = Math.min(width * 0.2, 78);
const KEY_BTN_HEIGHT = Math.min(height * 0.085, 68);

// ─── helpers ────────────────────────────────────────────────────────────────

const getMathSymbol = symbol => {
  const map = {
    Sum: '+', Difference: '-', Subtract: '-',
    Product: '×', Multiply: '×',
    Quotient: '÷', Divide: '÷',
    Modulus: '%', Exponent: '^',
  };
  return map[symbol] || symbol;
};

const formatQuestion = (q) => {
  if (!q) return '';
  const sym = getMathSymbol(q.symbol);
  return `${q.input1} ${sym} ${q.input2}`;
};

const getExpectedAnswer = (q) => {
  if (!q) return null;
  const sym = (q.symbol || '').toLowerCase();
  switch (sym) {
    case 'sum':
      return String(q.input1 + q.input2);
    case 'difference':
    case 'subtract':
      return String(q.input1 - q.input2);
    case 'product':
    case 'multiply':
      return String(q.input1 * q.input2);
    case 'quotient':
    case 'divide':
      return q.input2 !== 0 ? String(q.input1 / q.input2) : null;
    default:
      return null;
  }
};

// ────────────────────────────────────────────────────────────────────────────

const ComputerGame = () => {
  const insets      = useSafeAreaInsets();
  const navigation  = useNavigation();
  const route       = useRoute();
  const { theme, keyboardTheme } = useTheme();
  const { isSoundOn, toggleSound } = useSound();
  const { t }       = useAppTranslation();
  const { showBadges } = useBadge();

  // ── Route params ────────────────────────────────────────────────────────
  const {
    gameId:           initGameId,
    computerLevel,
    computerDisplayName,
    difficulty,
    diffCode,
    selectedSymbols,
    firstQuestion,
    initialGameState,
    timer,
    myMongoId:        routeMyMongoId,
  } = route.params || {};

  console.log('🎮 [COMPUTER GAME] ========== COMPONENT MOUNTED ==========');
  console.log('🎮 [COMPUTER GAME] Route params received:', {
    gameId: initGameId,
    computerLevel,
    computerDisplayName,
    difficulty,
    diffCode,
    selectedSymbols,
    timer,
  });
  console.log('🎮 [COMPUTER GAME] Initial game state:', initialGameState);
  console.log('🎮 [COMPUTER GAME] 📊 INITIAL PLAYER SCORE:', initialGameState?.playerScore ?? 0);
  console.log('🎮 [COMPUTER GAME] 📊 INITIAL COMPUTER SCORE:', initialGameState?.computerScore ?? 0);
  console.log('🎮 [COMPUTER GAME] 📊 INITIAL PLAYER METER:', initialGameState?.playerMeter ?? 5);
  console.log('🎮 [COMPUTER GAME] 📊 DIFF CODE:', diffCode);

  const currentLayout = KEYPAD_LAYOUTS[keyboardTheme] || KEYPAD_LAYOUTS.type1;

  // ── Socket ref ───────────────────────────────────────────────────────────
  const socketRef = useRef(null);

  // ── Game state ──────────────────────────────────────────────────────────
  const [gameId]            = useState(initGameId);
  const [currentQ, setCurrentQ]             = useState(firstQuestion);
  const [questionText, setQuestionText]     = useState(formatQuestion(firstQuestion));
  const [questionIndex, setQuestionIndex]   = useState((firstQuestion?.index ?? 0) + 1);

  const [input,    setInput]    = useState('');
  const [feedback, setFeedback] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [awaitingComputer, setAwaitingComputer] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [loading,   setLoading]  = useState(false);

  const gameEndedRef = useRef(false);

  // Player stats
  const [playerScore,  setPlayerScore]  = useState(initialGameState?.playerScore  ?? 0);
  const [playerMeter,  setPlayerMeter]  = useState(initialGameState?.playerMeter  ?? 5);
  const [playerStreak, setPlayerStreak] = useState(initialGameState?.playerStreak ?? 0);

  // Computer stats
  const [computerScore,  setComputerScore]  = useState(initialGameState?.computerScore  ?? 0);
  const [computerMeter,  setComputerMeter]  = useState(initialGameState?.computerMeter  ?? 5);
  const [computerStreak, setComputerStreak] = useState(initialGameState?.computerStreak ?? 0);

  // History dots
  const [playerHistory,   setPlayerHistory]   = useState([]);
  const [computerHistory, setComputerHistory] = useState([]);

  // Computer answer feedback
  const [computerFeedback, setComputerFeedback] = useState(null);

  // Timer
  const totalTimeRef = useRef(parseInt(timer ?? 60, 10));
  const [timeLeft, setTimeLeft] = useState(totalTimeRef.current);
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const [animateWatch] = useState(new Animated.Value(1));
  const [isThirtySecPhase, setIsThirtySecPhase] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Result modal
  const [showResultModal,  setShowResultModal]  = useState(false);
  const [resultData,       setResultData]       = useState(null);
  const [resultFadeAnim]   = useState(new Animated.Value(0));
  const [resultScaleAnim]  = useState(new Animated.Value(0.8));
  const [showPostGameBadges, setShowPostGameBadges] = useState(false);

  // Misc refs
  const isSoundOnRef          = useRef(isSoundOn);
  const last10PlayedRef       = useRef(false);
  const appState              = useRef(AppState.currentState);
  const hasNavigatedToResult  = useRef(false);
  const gameIdRef             = useRef(initGameId);
  const questionStartTimeRef  = useRef(Date.now());
  const isSkipRef             = useRef(false);
  const [isRevMode, setIsRevMode] = useState(false);
  const revScale = useRef(new Animated.Value(1)).current;

  // ── Keep gameEndedRef in sync ────────────────────────────────────────────
  useEffect(() => {
    gameEndedRef.current = gameEnded;
  }, [gameEnded]);

  // ── Attach socket ────────────────────────────────────────────────────────
  useEffect(() => {
    console.log('🎮 [COMPUTER GAME] Attempting to get socket from ComputerGameSocket singleton');
    const sock = ComputerGameSocket.get();
    if (!sock) {
      console.error('🎮 [COMPUTER GAME] ❌ NO SOCKET FOUND - Game session lost');
      setTimeout(() => {
        Alert.alert('Error', 'Game session lost. Please try again.', [
          { text: 'OK', onPress: () => navigation.replace('BottomTab') },
        ]);
      }, 500);
      return;
    }
    console.log('🎮 [COMPUTER GAME] ✅ Socket retrieved successfully');
    socketRef.current = sock;
  }, [navigation]);

  // ── Sound init ───────────────────────────────────────────────────────────
  useFocusEffect(
    useCallback(() => {
      initSound('correct',   'rightanswer.mp3');
      initSound('incorrect', 'wronganswerr.mp3');
      initSound('skipped',   'skip.mp3');
      initSound('timer',     'every30second.wav');
      initSound('ticktock',  'ticktock.mp3');
    }, [])
  );

  useEffect(() => {
    isSoundOnRef.current = isSoundOn;
    if (!isSoundOn) {
      stopEffect('ticktock');
      last10PlayedRef.current = false;
    }
  }, [isSoundOn]);

  // ── App state ────────────────────────────────────────────────────────────
  useEffect(() => {
    const sub = AppState.addEventListener('change', state => {
      if (state !== 'active') stopEffect('ticktock');
      else if (totalTimeRef.current <= 10 && totalTimeRef.current > 0) {
        playEffect('ticktock', isSoundOnRef.current);
      }
      appState.current = state;
    });
    return () => sub.remove();
  }, []);

  // ── Cleanup on unmount ───────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      stopEffect('ticktock');
      if (!hasNavigatedToResult.current && socketRef.current?.connected) {
        socketRef.current.emit('leaveGame', gameIdRef.current);
        ComputerGameSocket.clear();
      }
    };
  }, []);

  // ── Result Data Logging ───────────────────────────────────────────────────
  useEffect(() => {
    if (resultData) {
      console.log('🎮 [COMPUTER GAME] resultData updated - DISPLAYING RESULT MODAL');
      console.log('  - Before:', resultData.ratingBefore);
      console.log('  - After:', resultData.ratingAfter);
      console.log('  - Change:', (resultData.ratingChange >= 0 ? '+' : '') + resultData.ratingChange);
      console.log('  - DiffCode/Bucket:', resultData.diffCode);
      console.log('  - Game Result:', resultData.gameResult);
      console.log('  - Player Score:', resultData.totalScore);
      console.log('  - Computer Score:', resultData.opponentScore);
    }
  }, [resultData]);

  // ── showResult ───────────────────────────────────────────────────────────
  const showResult = useCallback((data) => {
    console.log('🎮 [COMPUTER GAME] showResult() called');
    if (hasNavigatedToResult.current) {
      console.log('🎮 [COMPUTER GAME] ⚠️ Already navigated to result, returning early');
      return;
    }
    hasNavigatedToResult.current = true;
    gameEndedRef.current = true;
    setGameEnded(true);
    stopEffect('ticktock');

    resultFadeAnim.setValue(0);
    resultScaleAnim.setValue(0.8);
    setResultData(data);
    setShowResultModal(true);

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(resultFadeAnim,  { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(resultScaleAnim, { toValue: 1, friction: 5,   useNativeDriver: true }),
      ]).start(() => {
        setTimeout(() => {
          setShowPostGameBadges(true);
        }, 3000);
      });
    }, 50);
  }, [resultFadeAnim, resultScaleAnim]);

  // ── handleExit — defined BEFORE BackHandler useEffect ───────────────────
  const handleExit = useCallback(() => {
    stopEffect('ticktock');
    hasNavigatedToResult.current = true;
    gameEndedRef.current = true;
    setGameEnded(true);

    if (socketRef.current?.connected) {
      socketRef.current.emit('leaveGame', gameIdRef.current);
    }
    if (socketRef.current) {
      ComputerGameSocket.clear();
    }
    navigation.replace('BottomTab');
  }, [navigation]);

  // ── Hardware back ────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!gameEndedRef.current) {
        setTimeout(() => {
          Alert.alert(
            t('Leave Game?'),
            t('Are you sure you want to leave?'),
            [
              { text: t('Cancel'), style: 'cancel' },
              { text: t('Leave'), style: 'destructive', onPress: handleExit },
            ]
          );
        }, 100);
        return true;
      }
      return false;
    });
    return () => handler.remove();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleExit]);

  // ── Socket event listeners ────────────────────────────────────────────────
  useEffect(() => {
    const sock = socketRef.current;
    if (!sock) return;

    const onPlayerAnswerResult = (data) => {
      console.log('🎮 [COMPUTER GAME] playerAnswerResult:', data);
      setPlayerScore(data.playerScore);
      setPlayerMeter(data.playerMeter);
      setPlayerStreak(data.playerStreak);

      let fb;
      if (isSkipRef.current) {
        fb = 'skipped';
        setPlayerHistory(prev => [{ isCorrect: false, skipped: true }, ...prev].slice(0, 8));
      } else {
        fb = data.isCorrect ? 'correct' : 'incorrect';
        setPlayerHistory(prev => [{ isCorrect: data.isCorrect }, ...prev].slice(0, 8));
      }

      setFeedback(fb);
      playEffect(fb, isSoundOnRef.current);
      setSubmitted(true);
      setAwaitingComputer(true);
      isSkipRef.current = false;
    };

    const onComputerAnswerResult = (data) => {
      console.log('🎮 [COMPUTER GAME] computerAnswerResult:', data);
      setComputerScore(data.computerScore);
      setComputerMeter(data.computerMeter);
      setComputerStreak(data.computerStreak);

      if (data.skipped) {
        setComputerFeedback('skipped');
        setComputerHistory(prev => [{ isCorrect: false, skipped: true }, ...prev].slice(0, 8));
      } else {
        setComputerFeedback(data.isCorrect ? 'correct' : 'incorrect');
        setComputerHistory(prev => [{ isCorrect: data.isCorrect }, ...prev].slice(0, 8));
      }
      setTimeout(() => setComputerFeedback(null), 1200);
    };

    const onNextQuestion = (data) => {
      setCurrentQ(data);
      setQuestionText(formatQuestion(data));
      setInput('');
      setFeedback(null);
      setSubmitted(false);
      setAwaitingComputer(false);
      setLoading(false);
      setQuestionIndex(data.index + 1);
      questionStartTimeRef.current = Date.now();
    };

    const onGameEnded = (data) => {
      console.log('🎮 [COMPUTER GAME] ========== GAME ENDED ==========');
        console.log('🎮 FULL GAME ENDED PAYLOAD:', JSON.stringify(data, null, 2));

      console.log('🎮 [COMPUTER GAME] result:', data.result);
      gameEndedRef.current = true;

      if (data.newlyEarned?.length > 0) {
        console.log('🎮 [COMPUTER GAME] 🏅 NEW BADGES:', data.newlyEarned);
        showBadges(data.newlyEarned);
      }

      let gameResult = 'draw';
      if (data.result === 'PlayerWon')   gameResult = 'win';
      if (data.result === 'ComputerWon') gameResult = 'lose';

      showResult({
        gameResult,
        totalScore:          data.playerScore,
        opponentScore:       data.computerScore,
        ratingBefore:        data.ratingBefore,
        ratingAfter:         data.ratingAfter,
        ratingChange:        data.ratingChange,
        endReason:           data.endReason,
        stats:               data.stats,
        winner:              data.winner,
        computerLevel,
        computerDisplayName,
        diffCode,
        playerProfile:       data.playerProfile,
      });

      setTimeout(() => {
        if (socketRef.current?.connected) {
          ComputerGameSocket.clear();
        }
      }, 500);
    };

    const onConnectError = (err) => {
      console.error('Computer game socket error:', err.message);
      if (!hasNavigatedToResult.current) {
        setTimeout(() => {
          Alert.alert(
            t('Connection Lost'),
            t('Disconnected from game server.'),
            [{ text: t('OK'), onPress: () => navigation.replace('BottomTab') }]
          );
        }, 500);
      }
    };

    sock.on('playerAnswerResult',   onPlayerAnswerResult);
    sock.on('computerAnswerResult', onComputerAnswerResult);
    sock.on('nextQuestion',         onNextQuestion);
    sock.on('gameEnded',            onGameEnded);
    sock.on('connect_error',        onConnectError);

    return () => {
      sock.off('playerAnswerResult',   onPlayerAnswerResult);
      sock.off('computerAnswerResult', onComputerAnswerResult);
      sock.off('nextQuestion',         onNextQuestion);
      sock.off('gameEnded',            onGameEnded);
      sock.off('connect_error',        onConnectError);
    };
  }, [showResult, showBadges, computerLevel, computerDisplayName, navigation, t, diffCode]);

  // ── Timer ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (gameEnded) return;

    const interval = setInterval(() => {
      if (isPaused) return;

      totalTimeRef.current -= 1;
      const remaining = totalTimeRef.current;
      setTimeLeft(remaining);

      if (remaining <= 10 && remaining > 0 && !last10PlayedRef.current) {
        playEffect('ticktock', isSoundOnRef.current);
        last10PlayedRef.current = true;
      }

      if (remaining <= 10 && remaining > 0) {
        Animated.sequence([
          Animated.timing(animateWatch, { toValue: 1.4, duration: 300, useNativeDriver: true }),
          Animated.timing(animateWatch, { toValue: 1,   duration: 300, useNativeDriver: true }),
        ]).start();
      }

      if (remaining % 30 === 0 && remaining !== parseInt(timer ?? 60, 10) && remaining > 0) {
        setIsThirtySecPhase(true);
        playEffect('timer', isSoundOnRef.current);
        Animated.sequence([
          Animated.timing(animateWatch, { toValue: 1.4, duration: 300, useNativeDriver: true }),
          Animated.timing(animateWatch, { toValue: 1,   duration: 300, useNativeDriver: true }),
        ]).start(() => setIsThirtySecPhase(false));
      }

      if (remaining <= 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaused, gameEnded]);

  // ── Core submit function ──────────────────────────────────────────────────
  const submitAnswer = useCallback((answerValue) => {
    if (gameEndedRef.current) {
      console.log('🎮 [COMPUTER GAME] submitAnswer blocked — game already ended');
      return;
    }
    if (!socketRef.current?.connected) return;

    const timeSpent = Date.now() - questionStartTimeRef.current;

    socketRef.current.emit(
      'submitAnswer',
      {
        gameId:        gameIdRef.current,
        questionIndex: currentQ?.index ?? 0,
        answer:        answerValue,
        timeSpent,
      },
      (ack) => {
        if (!ack?.success) {
          console.error('submitAnswer ack error:', ack?.error);
          if (!gameEndedRef.current) {
            setSubmitted(false);
            setAwaitingComputer(false);
          }
        }
      }
    );
  }, [currentQ]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleToggleSound = () => {
    toggleSound();
    const newVal = !isSoundOn;
    isSoundOnRef.current = newVal;
    if (!newVal) {
      stopEffect('ticktock');
    } else if (totalTimeRef.current <= 10 && totalTimeRef.current > 0) {
      last10PlayedRef.current = false;
      playEffect('ticktock', true);
    }
  };

  const handlePress = useCallback((value) => {
    if (gameEndedRef.current || submitted) return;

    const key = value.toString().toLowerCase();

    if (key === 'clear' || key === 'clr') { setInput(''); return; }
    if (key === '⌫' || key === 'del') { setInput(prev => prev.slice(0, -1)); return; }
    if (key === 'reverse' || key === 'ref') { setIsRevMode(prev => !prev); return; }
    if (key === 'pm') {
      setInput(prev => prev.startsWith('-') ? prev.slice(1) : '-' + prev);
      return;
    }

    if (key === 'skip') {
      if (gameEndedRef.current) return;
      isSkipRef.current = true;
      playEffect('skipped', isSoundOnRef.current);
      setFeedback('skipped');
      setSubmitted(true);
      setAwaitingComputer(true);

      const timeSpent = Date.now() - questionStartTimeRef.current;
      if (socketRef.current?.connected) {
        socketRef.current.emit('submitAnswer', {
          gameId:        gameIdRef.current,
          questionIndex: currentQ?.index ?? 0,
          answer:        '',
          timeSpent,
        }, (ack) => {
          if (!ack?.success) console.error('submitAnswer (skip) ack error:', ack?.error);
        });
      }
      return;
    }

    if (key === 'enter' || key === '✓' || key === 'ok') {
      if (input.length === 0) return;
      if (gameEndedRef.current) return;
      setSubmitted(true);
      setAwaitingComputer(true);
      submitAnswer(input);
      return;
    }

    if (!/^[0-9.-]$/.test(value.toString())) return;
    if (value === '.' && input.includes('.')) return;
    if (value === '-' && input.length > 0) return;

    const newInput = isRevMode
      ? value.toString() + input
      : input + value.toString();

    setInput(newInput);

    const expected = getExpectedAnswer(currentQ);
    const isDecimal = expected !== null && expected.includes('.');

    if (expected !== null) {
      const shouldSubmit = isDecimal
        ? newInput.length === expected.length && newInput.includes('.')
        : newInput.length === expected.length;

      if (shouldSubmit) {
        setTimeout(() => {
          if (gameEndedRef.current) return;
          setSubmitted(prev => {
            if (prev) return prev;
            setAwaitingComputer(true);
            submitAnswer(newInput);
            return true;
          });
        }, 80);
      }
    }
  }, [gameEnded, submitted, input, isRevMode, currentQ, submitAnswer]);

  // ── Result handlers ──────────────────────────────────────────────────────
  const handleNewGame = () => navigation.navigate('PlayGame', {
    gametype: 'MULTIPLAYER',
    computerLevel: computerLevel,
  });
  const handleCloseResults = () => navigation.replace('BottomTab');

  // ── Keypad disabled state ────────────────────────────────────────────────
  const isKeypadDisabled = gameEnded || submitted;

  // ────────────────────────────────────────────────────────────────────────
  // RENDER
  // ────────────────────────────────────────────────────────────────────────

  const content = (
    <View style={[styles.container, { paddingTop: insets.top + 30 }]}>

      {/* TOP BAR */}
      <View style={[styles.topBar, { backgroundColor: theme.cardBackground || '#1E293B' }]}>
        <TouchableOpacity
          onPress={() => {
            if (!gameEndedRef.current) {
              setTimeout(() => {
                Alert.alert(
                  t('Leave Game?'),
                  t('Are you sure you want to leave? You will lose the match.'),
                  [
                    { text: t('Cancel'), style: 'cancel' },
                    { text: t('Leave'), style: 'destructive', onPress: handleExit },
                  ]
                );
              }, 100);
            } else {
              navigation.replace('BottomTab');
            }
          }}
          style={styles.iconButton}
          hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
        >
          <Icon name="caret-back-outline" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.timerContainer}>
          <Animated.Image
            source={require('../assets/Stopwatch.png')}
            style={[
              styles.timerIcon,
              {
                transform: [{ scale: animateWatch }],
                tintColor: timeLeft <= 10 || isThirtySecPhase ? 'red' : '#fff',
              },
            ]}
          />
          <Text style={styles.timerText}>
            {`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}
          </Text>
        </View>

        <TouchableOpacity onPress={handleToggleSound} style={styles.iconButton1}>
          <Icon name={isSoundOn ? 'volume-high' : 'volume-mute'} size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* ── COMPUTER OPPONENT HEADER ── */}
      <View style={styles.opponentHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.opponentAvatarContainer}>
            <View style={[styles.avatarCircle, { backgroundColor: '#0F766E', width: 40, height: 40 }]}>
              <Text style={{ fontSize: 22 }}>🤖</Text>
            </View>
            {computerFeedback && (
              <View style={[
                styles.computerFeedbackBubble,
                {
                  backgroundColor:
                    computerFeedback === 'correct'   ? '#10B981' :
                    computerFeedback === 'skipped'   ? '#F59E0B' : '#EF4444',
                },
              ]}>
                <Text style={{ fontSize: 10, color: '#fff', fontWeight: '700' }}>
                  {computerFeedback === 'correct' ? '✓' : computerFeedback === 'skipped' ? 'SKIP' : '✗'}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.opponentInfo}>
            <Text style={styles.opponentName}>
              {computerDisplayName || 'Computer'} 🤖
            </Text>
            <Text style={[styles.levelBadge, { color: theme.primary || '#FB923C' }]}>
              Level {computerLevel} · Streak {computerStreak}
            </Text>
            <View style={styles.historyContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.historyScrollContent}>
                {computerHistory.map((item, i) => (
                  <Icon
                    key={i}
                    name={item.skipped ? 'remove' : item.isCorrect ? 'checkmark' : 'close'}
                    size={14}
                    color={item.skipped ? '#F59E0B' : item.isCorrect ? '#10B981' : '#EF4444'}
                    style={{ marginRight: 3 }}
                  />
                ))}
              </ScrollView>
            </View>
          </View>
        </View>

        <View style={styles.headerRight}>
          <Text style={styles.scoreLabel}>{t('Pts')}</Text>
          <Text style={styles.scoreValue}>{computerScore}</Text>
        </View>
      </View>

      {/* ── MY DATA ── */}
      <View style={styles.myDataContainer}>
        <View style={styles.headerLeft}>
          <View style={styles.opponentAvatarContainer}>
            <View style={[styles.avatarCircle, { width: 42, height: 42, backgroundColor: '#4F46E5' }]}>
              <Text style={styles.avatarInitial}>Y</Text>
            </View>
            <View style={styles.youBadge}>
              <Text style={styles.youBadgeText}>{t('YOU')}</Text>
            </View>
          </View>

          <View style={styles.opponentInfo}>
            <Text style={styles.playerName}>You · Streak {playerStreak}</Text>
            <View style={styles.historyContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.historyScrollContent}>
                {playerHistory.map((item, i) => (
                  <Icon
                    key={i}
                    name={item.isCorrect ? 'checkmark' : 'close'}
                    size={14}
                    color={item.isCorrect ? '#10B981' : '#EF4444'}
                    style={{ marginRight: 3 }}
                  />
                ))}
              </ScrollView>
            </View>
          </View>
        </View>

        <View style={styles.headerRight}>
          <Text style={styles.scoreLabel}>{t('Pts')}</Text>
          <Text style={styles.scoreValue}>{playerScore}</Text>
        </View>
      </View>

      {/* ── QUESTION AREA ── */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <Text style={styles.questionCounter}>
          Q {questionIndex} / {initialGameState?.totalQuestions ?? 20}
        </Text>

        <Text style={styles.question}>
          {loading ? t('Loading...') : questionText}
        </Text>

        <View style={[
          styles.answerBox,
          { backgroundColor: theme.cardBackground || '#1E293B' },
          feedback === 'correct'   ? { borderColor: '#10B981', borderWidth: 2 } :
          feedback === 'incorrect' ? { borderColor: '#EF4444', borderWidth: 2 } :
          feedback === 'skipped'   ? { borderColor: '#F59E0B', borderWidth: 2 } : {},
        ]}>
          {submitted && !feedback ? (
            <ActivityIndicator size="small" color={theme.primary || '#FB923C'} />
          ) : (
            <Text style={[
              styles.answerText,
              feedback === 'correct'   ? { color: '#10B981' } :
              feedback === 'incorrect' ? { color: '#EF4444' } :
              feedback === 'skipped'   ? { color: '#F59E0B' } : {},
            ]}>
              {feedback === 'correct'   ? t('Correct')   :
               feedback === 'incorrect' ? t('Incorrect') :
               feedback === 'skipped'   ? t('Skipped')   :
               input || ''}
            </Text>
          )}
        </View>

        {awaitingComputer && feedback && (
          <Text style={styles.waitingText}>Waiting for computer...</Text>
        )}
      </View>

      {/* ── KEYPAD ── */}
      <View style={styles.keypadContainer}>
        {currentLayout.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keypadRow}>
            {row.map((item, index) => {
              const strItem = item.toString().toLowerCase();
              const isSpecial = ['clear','clr','⌫','del','ref','pm','skip','.','reverse','enter','✓','ok'].includes(strItem);
              const isNa = strItem === 'na';

              if (isNa) return <View key={index} style={{ width: KEY_BTN_WIDTH, height: KEY_BTN_HEIGHT }} />;

              let keyContent;
              if (strItem === 'del' || strItem === '⌫') {
                keyContent = <MaterialIcons name="backspace" size={22} color="#fff" />;
              } else if (strItem === 'ref' || strItem === 'reverse') {
                keyContent = (
                  <Text style={[styles.keyText, { fontSize: scaleFont(14), fontWeight: '800', fontStyle: 'italic' }]}>
                    {t('REV')}
                  </Text>
                );
              } else if (strItem === 'pm') {
                keyContent = <Text style={[styles.keyText, { color: '#fff' }]}>+/-</Text>;
              } else if (strItem === 'clr' || strItem === 'clear') {
                keyContent = <Text style={[styles.keyText, { color: '#fff' }]}>{t('Clear')}</Text>;
              } else if (strItem === 'skip') {
                keyContent = (
                  <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                    <Text style={[styles.keyText, { fontSize: scaleFont(12) }]}>{t('Skip')}</Text>
                    <MaterialIcons name="skip-next" size={20} color="#fff" />
                  </View>
                );
              } else if (strItem === 'enter' || strItem === '✓' || strItem === 'ok') {
                keyContent = (
                  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="checkmark-circle" size={24} color="#10B981" />
                  </View>
                );
              } else {
                keyContent = <Text style={styles.keyText}>{item.toUpperCase ? item.toUpperCase() : item}</Text>;
              }

              const isRevActive = (strItem === 'ref' || strItem === 'reverse') && isRevMode;

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handlePress(strItem === 'ref' ? 'reverse' : item)}
                  disabled={isKeypadDisabled}
                  style={[
                    styles.keyButton,
                    { borderBottomWidth: 4, borderBottomColor: 'rgba(0,0,0,0.3)' },
                    (isSpecial || strItem === '-') ? styles.specialKey : null,
                    isRevActive && {
                      shadowColor: theme.primaryColor || '#595CFF',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.5,
                      shadowRadius: 8,
                      transform: [{ scale: revScale }],
                    },
                    isKeypadDisabled && { opacity: 0.5 },
                  ]}
                >
                  {isRevActive ? (
                    <LinearGradient
                      colors={theme.buttonGradient || [theme.primaryColor || '#595CFF', theme.secondaryColor || '#87AEE9']}
                      style={styles.gradientButton}
                    >
                      {keyContent}
                    </LinearGradient>
                  ) : !isSpecial && strItem !== '-' ? (
                    <LinearGradient
                      colors={theme.buttonGradient || [theme.primaryColor || '#595CFF', theme.secondaryColor || '#87AEE9']}
                      style={styles.gradientButton}
                    >
                      {keyContent}
                    </LinearGradient>
                  ) : (
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>{keyContent}</View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      {/* ── RESULT MODAL ── */}
      {showResultModal && resultData && (
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.resultCard,
              {
                opacity:   resultFadeAnim,
                transform: [{ scale: resultScaleAnim }],
                borderColor:
                  resultData.gameResult === 'win'  ? '#4ade80' :
                  resultData.gameResult === 'lose' ? '#f87171' : '#fbbf24',
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={handleCloseResults} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                <Icon name="close" size={28} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.resultContent}>
              <View style={[
                styles.resultBadge,
                {
                  backgroundColor:
                    resultData.gameResult === 'win'  ? '#4ade80' :
                    resultData.gameResult === 'lose' ? '#f87171' : '#fbbf24',
                },
              ]}>
                <Text style={styles.resultBadgeText}>
                  {resultData.gameResult === 'win'  ? t('VICTORY') :
                   resultData.gameResult === 'lose' ? t('DEFEAT')  : t('DRAW')}
                </Text>
              </View>

              <Text style={[
                styles.resultTitle,
                {
                  color:
                    resultData.gameResult === 'win'  ? '#4ade80' :
                    resultData.gameResult === 'lose' ? '#f87171' : '#fbbf24',
                },
              ]}>
                {resultData.gameResult === 'win'  ? t('You Won!')  :
                 resultData.gameResult === 'lose' ? t('You Lost!') : t('Draw!')}
              </Text>

              {/* ── SCORES ── */}
              <View style={styles.modalPlayersContainer}>
                <View style={styles.modalPlayer}>
                  {resultData.playerProfile?.profileImage ? (
                    <Image
                      source={{ uri: resultData.playerProfile.profileImage }}
                      style={styles.modalAvatar}
                    />
                  ) : (
                    <View style={[styles.modalAvatar, { backgroundColor: '#4F46E5', justifyContent: 'center', alignItems: 'center' }]}>
                      <Text style={[styles.avatarInitial, { fontSize: 24 }]}>
                        {resultData.playerProfile?.username?.[0]?.toUpperCase() ?? 'Y'}
                      </Text>
                    </View>
                  )}
                  <Text style={styles.modalPlayerName}>
                    {resultData.playerProfile?.username ?? t('You')}
                  </Text>
                  <Text style={styles.mainScore}>{resultData.totalScore}</Text>
                </View>

                <View style={styles.vsContainer}>
                  <Text style={styles.modalVsText}>{t('VS')}</Text>
                </View>

                <View style={styles.modalPlayer}>
                  <View style={[styles.modalAvatar, { backgroundColor: '#0F766E', justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={{ fontSize: 30 }}>🤖</Text>
                  </View>
                  <Text style={styles.modalPlayerName}>{resultData.computerDisplayName || 'Computer'}</Text>
                  <Text style={styles.mainScore}>{resultData.opponentScore}</Text>
                </View>
              </View>

              {/* Stats */}
              {resultData.stats && (
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{resultData.stats.gamesPlayed ?? 0}</Text>
                    <Text style={styles.statLabel}>Played</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{resultData.stats.wins ?? 0}</Text>
                    <Text style={styles.statLabel}>Wins</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{resultData.stats.winRate ?? 0}%</Text>
                    <Text style={styles.statLabel}>Win Rate</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{resultData.stats.bestStreak ?? 0}</Text>
                    <Text style={styles.statLabel}>Best Streak</Text>
                  </View>
                </View>
              )}

              <Text style={{ fontSize: 38, marginTop: 8 }}>
                {resultData.gameResult === 'win' ? '🏆' : resultData.gameResult === 'lose' ? '😥' : '🤝'}
              </Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#8B5CF6' }]}
                onPress={handleNewGame}
              >
                <Text style={styles.actionButtonText}>{t('Play Again')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#3B82F6' }]}
                onPress={handleCloseResults}
              >
                <Text style={styles.actionButtonText}>{t('Home')}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}

    </View>
  );

  return theme.backgroundGradient ? (
    <LinearGradient colors={theme.backgroundGradient} style={{ flex: 1 }}>
      {content}
    </LinearGradient>
  ) : (
    <View style={{ flex: 1, backgroundColor: theme.backgroundColor || '#0B1220' }}>
      {content}
    </View>
  );
};

export default ComputerGame;
// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.04,
    borderBottomEndRadius: 15,
    borderBottomStartRadius: 15,
    height: 60,
  },
  iconButton:  { width: width * 0.35, height: 48, justifyContent: 'center', alignItems: 'flex-start' },
  iconButton1: { width: width * 0.35, height: 48, justifyContent: 'center', alignItems: 'flex-end' },
  timerContainer: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  timerText: { color: '#fff', fontSize: scaleFont(13), fontWeight: '600', opacity: 0.7 },
  timerIcon: { width: 18, height: 18 },
  opponentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: width * 0.04,
    marginTop: height * 0.01,
    padding: 10,
  },
  headerLeft:  { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  headerRight: { alignItems: 'flex-end', justifyContent: 'center', paddingLeft: 10 },
  opponentAvatarContainer: { position: 'relative' },
  computerFeedbackBubble: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  opponentInfo: { flex: 1, justifyContent: 'center' },
  opponentName: { fontSize: scaleFont(14), fontWeight: 'bold', color: '#fff', marginBottom: 2 },
  levelBadge:   { fontSize: scaleFont(11), fontWeight: '600', marginBottom: 2 },
  historyContainer: { height: 20, width: '100%' },
  historyScrollContent: { alignItems: 'center' },
  scoreLabel: { fontSize: scaleFont(10), color: '#CBD5E1', fontWeight: '600' },
  scoreValue: { fontSize: scaleFont(18), fontWeight: 'bold', color: '#fff', marginBottom: 2 },
  meterLabel: { fontSize: scaleFont(9), fontWeight: '600', marginBottom: 2 },
  meterBar: { flexDirection: 'row', gap: 2 },
  meterSegment: { width: 6, height: 10, borderRadius: 2 },
  avatarCircle: {
    width: 34, height: 34, borderRadius: 4,
    backgroundColor: '#0F172A',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarInitial: { color: '#fff', fontSize: scaleFont(14), fontWeight: '700' },
  myDataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: width * 0.04,
    marginTop: height * 0.015,
    marginBottom: height * 0.015,
    padding: 10,
  },
  playerName: { fontSize: scaleFont(14), fontWeight: 'bold', color: '#fff', marginBottom: 2 },
  youBadge: {
    position: 'absolute', bottom: -8, right: -10,
    backgroundColor: '#F59E0B', paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 8, borderWidth: 1.5, borderColor: '#0F172A',
  },
  youBadgeText: { fontSize: 8, color: '#000', fontWeight: '900' },
  questionCounter: {
    fontSize: scaleFont(11), color: '#64748b', fontWeight: '600', marginBottom: 6,
  },
  question: {
    fontSize: scaleFont(22), color: '#fff', textAlign: 'center',
    fontWeight: 'bold', marginBottom: 16,
  },
  answerBox: {
    width: width * 0.6, minHeight: 50, maxHeight: 60,
    borderRadius: 10, justifyContent: 'center', alignItems: 'center',
    alignSelf: 'center', paddingHorizontal: 12, paddingVertical: 8,
  },
  answerText: { fontSize: scaleFont(18), color: '#fff', fontWeight: '600' },
  waitingText: { color: '#64748b', fontSize: scaleFont(11), marginTop: 8 },
  keypadContainer: { width: '100%', paddingBottom: height * 0.02 },
  keypadRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginBottom: height * 0.015, paddingHorizontal: width * 0.05,
  },
  keyButton: {
    width: KEY_BTN_WIDTH, height: KEY_BTN_HEIGHT,
    justifyContent: 'center', alignItems: 'center',
    borderRadius: 10, backgroundColor: '#1C2433',
  },
  specialKey: { backgroundColor: '#1C2433' },
  gradientButton: {
    width: '100%', height: '100%',
    justifyContent: 'center', alignItems: 'center', borderRadius: 10,
  },
  keyText: { fontSize: scaleFont(17), color: '#fff', fontWeight: '600' },
  modalOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center', alignItems: 'center',
    zIndex: 999, elevation: 50,
  },
  resultCard: {
    width: '90%', backgroundColor: '#111827',
    borderRadius: 24, padding: 20, borderWidth: 2, alignItems: 'center',
  },
  modalHeader: {
    width: '100%', flexDirection: 'row',
    justifyContent: 'flex-end', marginBottom: 10,
  },
  resultContent: { alignItems: 'center', width: '100%' },
  resultBadge: {
    paddingHorizontal: 16, paddingVertical: 6,
    borderRadius: 16, marginBottom: 10,
  },
  resultBadgeText: { color: '#fff', fontWeight: 'bold', fontSize: 12, letterSpacing: 1 },
  resultTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  mainScore:   { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  modalPlayersContainer: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', width: '100%',
    paddingHorizontal: 10, marginVertical: 12,
  },
  modalPlayer:     { alignItems: 'center', width: '35%' },
  modalPlayerName: { color: '#fff', fontSize: 13, fontWeight: '600', marginBottom: 4, textAlign: 'center' },
  // ── CHANGE 2 (style): unified avatar size for result modal ──────────────
  modalAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,   // circle
    marginBottom: 8,
    overflow: 'hidden', // clips Image to the circle
  },
  vsContainer:     { justifyContent: 'center', alignItems: 'center' },
  modalVsText:     { fontSize: 22, fontWeight: '900', color: '#64748b', fontStyle: 'italic' },
  ratingChangeRow: { alignItems: 'center', marginVertical: 6 },
  ratingChangeLabel: { color: '#94a3b8', fontSize: scaleFont(11), fontWeight: '600' },
  ratingChangeValue: { fontSize: scaleFont(14), fontWeight: '700', marginTop: 2 },
  statsRow: {
    flexDirection: 'row', justifyContent: 'space-around',
    width: '100%', marginTop: 10,
    paddingVertical: 10,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)',
  },
  statItem:  { alignItems: 'center' },
  statValue: { color: '#fff', fontSize: scaleFont(14), fontWeight: '800' },
  statLabel: { color: '#94a3b8', fontSize: scaleFont(10), marginTop: 2 },
  modalActions: {
    flexDirection: 'row', width: '100%',
    justifyContent: 'space-between', gap: 10, marginTop: 16,
  },
  actionButton: {
    flex: 1, paddingVertical: 13,
    borderRadius: 12, alignItems: 'center',
  },
  actionButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
});
