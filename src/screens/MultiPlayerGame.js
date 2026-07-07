
// // import React, { useState, useEffect, useRef, useCallback } from 'react';
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   StyleSheet,
// //   Dimensions,
// //   PixelRatio,
// //   Animated,
// //   AppState,
// //   Alert,
// //   BackHandler,
// //   ScrollView,
// //   Image,
// //   ActivityIndicator,
// // } from 'react-native';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import Icon from 'react-native-vector-icons/Ionicons';
// // import {
// //   useNavigation,
// //   useRoute,
// //   useFocusEffect,
// // } from '@react-navigation/native';
// // import LinearGradient from 'react-native-linear-gradient';
// // import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// // import { useSocket } from '../context/Socket';
// // import { useSafeAreaInsets } from 'react-native-safe-area-context';
// // import { useTheme } from '../context/ThemeContext';
// // import { useSound } from '../context/SoundContext';
// // import { KEYPAD_LAYOUTS } from '../utils/keyboardLayouts';
// // import { initSound, playEffect, stopEffect } from '../utils/SoundManager';
// // import { useAppTranslation } from '../context/TranslationContext';
// // import BadgePopup from './BadgePopup';
// // import OfflineBadgesModal from './OfflineBadgesModal';
// // import { useBadge } from '../context/BadgeContext';
// // import { authFetch as fetch } from '../utils/authFetch'; // auto-refresh wrapper for expired access tokens

// // Text.defaultProps = Text.defaultProps || {};
// // Text.defaultProps.allowFontScaling = false;

// // const { width, height } = Dimensions.get('window');

// // const FONT_SCALE = Math.min(PixelRatio.getFontScale(), 1.0);
// // const scaleFont = size => size * FONT_SCALE;

// // const KEY_BTN_WIDTH = Math.min(width * 0.2, 78);
// // const KEY_BTN_HEIGHT = Math.min(height * 0.085, 68);

// // const REACTIONS = ['😄', '🔥', '🎯', '😅', '👏', '💪', '⚡', '🚀'];

// // const getMathSymbol = symbol => {
// //   const map = {
// //     Sum: '+',
// //     Difference: '-',
// //     Subtract: '-',
// //     Product: '×',
// //     Multiply: '×',
// //     Quotient: '÷',
// //     Divide: '÷',
// //     Modulus: '%',
// //     Exponent: '^',
// //   };
// //   return map[symbol] || symbol;
// // };

// // const pickRandomSymbol = (symbolString) => {
// //   if (!symbolString) return 'Sum';
// //   const parts = symbolString.split(',').map(s => {
// //     const trimmed = s.trim();
// //     return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
// //   });
// //   return parts[Math.floor(Math.random() * parts.length)];
// // };

// // function deriveDiffCode(difficulty, symbolString) {
// //   const letter =
// //     difficulty === 'easy' ? 'E' : difficulty === 'hard' ? 'H' : 'M';
// //   const count = symbolString ? symbolString.split(',').length : 2;
// //   const num = count >= 4 ? '4' : '2';
// //   return `${letter}${num}`;
// // }

// // const MultiPlayerGame = () => {
// //   const socket = useSocket();
// //   const insets = useSafeAreaInsets();
// //   const navigation = useNavigation();
// //   const route = useRoute();
// //   const { theme, keyboardTheme } = useTheme();
// //   const { isSoundOn, toggleSound } = useSound();
// //   const { t } = useAppTranslation();

// //   const {
// //     earnedBadges,
// //     setEarnedBadges,
// //     offlineBadges,
// //     setOfflineBadges,
// //     showBadges,
// //   } = useBadge();

// //   const {
// //     currentQuestion,
// //     timer,
// //     difficulty,
// //     opponent,
// //     myMongoId,
// //     isComputer,
// //     symbol,
// //     diffCode: routeDiffCode,
// //     selectedSymbols: routeSelectedSymbols,
// //     gameRoomId: routeGameRoomId,
// //     restoredMyScore,       // ✅ FIX 1 — restored scores from Lobby reconnect
// //     restoredOpponentScore, // ✅ FIX 1
// //     gameStartedAt: routeGameStartedAt,   // ✅ TIMER FIX — server anchor ms
// //     totalGameTime: routeTotalGameTime,   // ✅ TIMER FIX — total game duration ms
// //   } = route.params || {};

// //   const diffCode = routeDiffCode || deriveDiffCode(difficulty, symbol);

// //   const selectedSymbols = routeSelectedSymbols
// //     || (symbol ? symbol.split(',').map(s => s.trim()) : ['sum', 'difference']);

// //   const currentLayout = KEYPAD_LAYOUTS[keyboardTheme] || KEYPAD_LAYOUTS.type1;

// //   /* ================= STATE ================= */
// //   const [input, setInput] = useState('');
// //   const [question, setQuestion] = useState('');
// //   const [correctAnswer, setCorrectAnswer] = useState('');
// //   const [loading, setLoading] = useState(true);
// //   const [user, setUser] = useState(null);
// //   const [isReverse, setIsReverse] = useState(false);
// //   const [feedback, setFeedback] = useState(null);
// //   const [awaitingResult, setAwaitingResult] = useState(false);
// //   const [isConnected, setIsConnected] = useState(true);
// //   const [gameEnded, setGameEnded] = useState(false);
// //   const [questionIndex, setQuestionIndex] = useState(1);
// //   const [bonusText, setBonusText] = useState('');

// //   const [minutes, setMinutes] = useState(Math.floor((timer ?? 60) / 60));
// //   const [seconds, setSeconds] = useState((timer ?? 60) % 60);
// //   const [timeRemaining, setTimeRemaining] = useState((timer ?? 60) * 1000);
// //   const [animateWatch] = useState(new Animated.Value(1));
// //   const [isThirtySecPhase, setIsThirtySecPhase] = useState(false);
// //   const [isPaused, setIsPaused] = useState(false);

// //   const [score, setScore] = useState(0);
// //   const [opponentScore, setOpponentScore] = useState(0);
// //   const [correctAnswers, setCorrectAnswers] = useState(0);
// //   const [skippedCount, setSkippedCount] = useState(0);
// //   const [answerHistory, setAnswerHistory] = useState([]);
// //   const [opponentHistory, setOpponentHistory] = useState([]);

// //   const [opponentEmoji, setOpponentEmoji] = useState(null);
// //   const [isReactionPickerOpen, setIsReactionPickerOpen] = useState(false);
// //   const [emojiDisabled, setEmojiDisabled] = useState(false);

// //   const [graceCountdown, setGraceCountdown] = useState(null);

// //   const [showResultModal, setShowResultModal] = useState(false);
// //   const [resultData, setResultData] = useState(null);
// //   const [resultFadeAnim] = useState(new Animated.Value(0));
// //   const [resultScaleAnim] = useState(new Animated.Value(0.8));

// //   const [rematchState, setRematchState] = useState('idle');
// //   const [rematchCountdown, setRematchCountdown] = useState(3);

// //   const [showPostGameBadges, setShowPostGameBadges] = useState(false);

// //   // Profile image state — seeded from route params, updated via socket events
// //   const [opponentProfileImage, setOpponentProfileImage] = useState(
// //   opponent?.profilePic || opponent?.profileImage || null
// // );
// // // ✅ ADD temporarily to debug
// // console.log('[MultiPlayerGame] opponent object:', JSON.stringify(opponent));
// // console.log('[MultiPlayerGame] seeded opponentProfileImage:', opponent?.profilePic || opponent?.profileImage);
// //   const [myProfileImage, setMyProfileImage] = useState(null);

// //   /* ================= REFS ================= */
// //   const socketRef = useRef(null);
// //   const totalTimeRef = useRef(timer ?? 60);
// //   const scoreRef = useRef(0);
// //   const correctAnswersRef = useRef(0);
// //   const incorrectCountRef = useRef(0);
// //   const skippedCountRef = useRef(0);
// //   const opponentScoreRef = useRef(0);
// //   const isSoundOnRef = useRef(isSoundOn);
// //   const last10PlayedRef = useRef(false);
// //   const appState = useRef(AppState.currentState);
// //   const hasNavigatedToResultRef = useRef(false);
// //   const myMongoIdRef = useRef(myMongoId);
// //   const opponentMongoIdRef = useRef(opponent?.id);
// //   const revScale = useRef(new Animated.Value(1)).current;
// //   const emojiCooldownRef = useRef(0);
// //   const graceIntervalRef = useRef(null);
// //   const rematchCountdownRef = useRef(null);
// //   const gameStartedHandledRef = useRef(false);
// //   const isComputerRef = useRef(!!isComputer);
// //   const symbolListRef = useRef(symbol);
// //   const correctAnswerRef = useRef('');
// //   const resultModalReadyRef = useRef(false);

// //   const questionHistoryRef = useRef([]);
// //   const questionStartTimeRef = useRef(Date.now());

// //   const currentQuestionMetaRef = useRef({
// //     symbol: currentQuestion?.symbol || 'Sum',
// //     difficulty: currentQuestion?.difficulty || difficulty || 'easy',
// //     qm: currentQuestion?.qm || 1,
// //     finalLevel: currentQuestion?.finalLevel || 1,
// //   });

// //   const computerAwaitingRef = useRef(false);
// //   const rematchStateRef = useRef('idle');

// //   // Ref mirrors for profile images — avoids stale closures in socket handlers
// //   const opponentProfileImageRef = useRef(opponent?.profilePic || opponent?.profileImage || null);
// //   const myProfileImageRef = useRef(null);

// //   // gameRoomId kept around opportunistically (used for rematch nav forwarding)
// //   const gameRoomIdRef = useRef(routeGameRoomId ?? null);

// //   // ✅ TIMER FIX — server-anchored timer refs
// //   const gameStartedAtRef = useRef(routeGameStartedAt ?? null);
// //   const totalGameTimeRef = useRef(routeTotalGameTime ?? (timer ?? 60) * 1000);
// //   const anchorTimerIntervalRef = useRef(null);

// //   /* ================= HELPERS ================= */
// //   const hasAnsweredAtLeastOne = useCallback(() => {
// //     return (
// //       correctAnswersRef.current +
// //       incorrectCountRef.current +
// //       skippedCountRef.current
// //     ) >= 1;
// //   }, []);

// //   const resetQuestionTimer = useCallback(() => {
// //     questionStartTimeRef.current = Date.now();
// //   }, []);

// //   const updateOpponentProfileImage = useCallback((url) => {
// //     if (!url) return;
// //     opponentProfileImageRef.current = url;
// //     setOpponentProfileImage(url);
// //   }, []);

// //   const updateMyProfileImage = useCallback((url) => {
// //     if (!url) return;
// //     myProfileImageRef.current = url;
// //     setMyProfileImage(url);
// //   }, []);

// //   const extractFromPlayerProfiles = useCallback((playerProfiles) => {
// //     if (!playerProfiles || typeof playerProfiles !== 'object') {
// //       return { myPic: null, opponentPic: null };
// //     }
// //     const myPic = playerProfiles[myMongoIdRef.current] ?? null;
// //     const opponentPic = playerProfiles[opponentMongoIdRef.current] ?? null;
// //     return { myPic, opponentPic };
// //   }, []);

// //   const captureGameRoomId = useCallback((data) => {
// //     const id = data?.gameRoomId || data?.roomId || data?.gameRoom?.id || data?.gameRoom?._id;
// //     if (id) gameRoomIdRef.current = id;
// //   }, []);

// //   // ✅ TIMER FIX — derive remaining seconds from server anchor, never decrement a variable
// //   const computeRemainingSeconds = useCallback(() => {
// //     if (!gameStartedAtRef.current) return totalTimeRef.current;
// //     const ms = totalGameTimeRef.current - (Date.now() - gameStartedAtRef.current);
// //     return Math.ceil(ms / 1000);
// //   }, []);

// //   const stopAnchorTimer = useCallback(() => {
// //     if (anchorTimerIntervalRef.current) {
// //       clearInterval(anchorTimerIntervalRef.current);
// //       anchorTimerIntervalRef.current = null;
// //     }
// //   }, []);

// //   const startTimerFromAnchor = useCallback(() => {
// //     stopAnchorTimer();

// //     anchorTimerIntervalRef.current = setInterval(() => {
// //       if (isPaused) return;
// //       const remaining = computeRemainingSeconds();
// //       totalTimeRef.current = remaining;
// //       setMinutes(Math.floor(Math.max(remaining, 0) / 60));
// //       setSeconds(Math.max(remaining, 0) % 60);

// //       if (remaining <= 10 && remaining > 0 && !last10PlayedRef.current) {
// //         playEffect('ticktock', isSoundOnRef.current);
// //         last10PlayedRef.current = true;
// //       }

// //       if (remaining <= 10 && remaining > 0) {
// //         Animated.sequence([
// //           Animated.timing(animateWatch, { toValue: 1.4, duration: 300, useNativeDriver: true }),
// //           Animated.timing(animateWatch, { toValue: 1, duration: 300, useNativeDriver: true }),
// //         ]).start();
// //       }

// //       if (remaining % 30 === 0 && remaining !== timer && remaining > 0) {
// //         setIsThirtySecPhase(true);
// //         playEffect('timer', isSoundOnRef.current);
// //         Animated.sequence([
// //           Animated.timing(animateWatch, { toValue: 1.4, duration: 300, useNativeDriver: true }),
// //           Animated.timing(animateWatch, { toValue: 1, duration: 300, useNativeDriver: true }),
// //         ]).start(() => setIsThirtySecPhase(false));
// //       }

// //       if (remaining <= 0) {
// //         stopAnchorTimer();
// //         handleTimeUp();
// //       }
// //     }, 1000);
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [isPaused, timer, computeRemainingSeconds, animateWatch, stopAnchorTimer]);

// //   /* ================= showResult ================= */
// //   const showResult = useCallback(
// //     data => {
// //       if (hasNavigatedToResultRef.current) return;
// //       hasNavigatedToResultRef.current = true;

// //       setGameEnded(true);
// //       stopEffect('ticktock');

// //       if (graceIntervalRef.current) {
// //         clearInterval(graceIntervalRef.current);
// //         graceIntervalRef.current = null;
// //       }

// //       resultFadeAnim.setValue(0);
// //       resultScaleAnim.setValue(0.8);
// //       setResultData(data);
// //       setShowResultModal(true);

// //       setTimeout(() => {
// //         Animated.parallel([
// //           Animated.timing(resultFadeAnim, {
// //             toValue: 1,
// //             duration: 500,
// //             useNativeDriver: true,
// //           }),
// //           Animated.spring(resultScaleAnim, {
// //             toValue: 1,
// //             friction: 5,
// //             useNativeDriver: true,
// //           }),
// //         ]).start(() => {
// //           resultModalReadyRef.current = true;
// //           // badge:earned socket event fires automatically when game ends — no manual check needed
// //           setShowPostGameBadges(true);
// //         });
// //       }, 50);
// //     },
// //     [resultFadeAnim, resultScaleAnim],
// //   );

// //   /* ================= buildResultData ================= */
// //   const buildResultData = useCallback(
// //     (overrides = {}) => {
// //       const attempts = correctAnswersRef.current + incorrectCountRef.current;
// //       const acc =
// //         attempts > 0
// //           ? Math.round((correctAnswersRef.current / attempts) * 100)
// //           : 0;

// //       const my = scoreRef.current;
// //       const opp = opponentScoreRef.current || 0;
// //       let gameResult = 'draw';
// //       if (my > opp) gameResult = 'win';
// //       else if (my < opp) gameResult = 'lose';

// //       const history = questionHistoryRef.current;
// //       console.log('🔍 Question History Length:', history.length);
// //       if (history.length > 0) {
// //         console.log('🔍 Sample Response:', history[0]);
// //         console.log('🔍 Correct:',   history.filter(r => r.isCorrect === true).length);
// //         console.log('🔍 Incorrect:', history.filter(r => r.isCorrect === false).length);
// //         console.log('🔍 Skipped:',   history.filter(r => r.isCorrect === null).length);
// //       }

// //       return {
// //         gameResult,
// //         totalScore: my,
// //         opponentScore: opp,
// //         correctCount: correctAnswersRef.current,
// //         inCorrectCount: incorrectCountRef.current,
// //         skippedQuestions: skippedCountRef.current,
// //         correctPercentage: acc,
// //         durationSeconds: timer,
// //         diffCode,
// //         questionHistory: history,
// //         opponentProfileImage: opponentProfileImageRef.current,
// //         myProfileImage: myProfileImageRef.current,
// //         ...overrides,
// //       };
// //     },
// //     [timer, diffCode],
// //   );

// //   /* ================= SUBMIT ANSWER (COMPUTER MODE) ================= */
// //   const submitAnswerToAPI = useCallback(async givenAnswer => {
// //     try {
// //       const token = await AsyncStorage.getItem('accessToken');
// //       if (!token) return null;

// //       const meta = currentQuestionMetaRef.current;
// //       const randomSymbol = pickRandomSymbol(symbolListRef.current);

// //       const payload = {
// //         playerRating: user?.rating || 900,
// //         currentScore: scoreRef.current,
// //         givenAnswer,
// //         symbol: randomSymbol,
// //         qm: meta.qm || 1,
// //         streak: correctAnswersRef.current,
// //         question: {
// //           difficulty: meta.difficulty || 'easy',
// //           answer: correctAnswerRef.current,
// //           finalLevel: meta.finalLevel || 1,
// //         },
// //       };

// //       const response = await fetch(
// //         'http://13.203.232.239:3000/api/question/submitAnswer',
// //         {
// //           method: 'POST',
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //             'Content-Type': 'application/json',
// //           },
// //           body: JSON.stringify(payload),
// //         },
// //       );

// //       const data = await response.json();

// //       if (response.ok && data.nextQuestion) {
// //         const q = data.nextQuestion;
// //         const mSym = getMathSymbol(q.symbol);
// //         const qText = `${q.input1} ${mSym} ${q.input2}`;

// //         currentQuestionMetaRef.current = {
// //           symbol: q.symbol || currentQuestionMetaRef.current.symbol,
// //           difficulty: q.difficulty || currentQuestionMetaRef.current.difficulty,
// //           qm: q.qm || currentQuestionMetaRef.current.qm,
// //           finalLevel: q.finalLevel || currentQuestionMetaRef.current.finalLevel,
// //         };

// //         setQuestion(qText);
// //         correctAnswerRef.current = String(q.answer);
// //         setCorrectAnswer(String(q.answer));
// //         setInput('');
// //         setLoading(false);
// //         setFeedback(null);
// //         console.log('[submitAnswerToAPI] cleared feedback after API nextQuestion; remaining:', totalTimeRef.current);
// //         setQuestionIndex(prev => prev + 1);
// //         computerAwaitingRef.current = false;
// //         resetQuestionTimer();

// //         if (data.newlyEarned && data.newlyEarned.length > 0) {
// //           showBadges(data.newlyEarned);
// //         }

// //         return data;
// //       }

// //       computerAwaitingRef.current = false;
// //       return null;
// //     } catch (err) {
// //       console.error('submitAnswerToAPI error:', err);
// //       computerAwaitingRef.current = false;
// //       return null;
// //     }
// //   }, [user, showBadges, resetQuestionTimer]);

// //   /* ================= COMPUTER AI LOGIC ================= */
// //   useEffect(() => {
// //     if (!isComputerRef.current) return;
// //     if (gameEnded) return;
// //     if (!question) return;
// //     if (computerAwaitingRef.current) return;

// //     const computerDelay = Math.random() * 2000 + 1000;

// //     const timeout = setTimeout(async () => {
// //       const isCorrect = Math.random() > 0.5;
// //       const currentCorrectAnswer = correctAnswerRef.current;
// //       const computerAnswer = isCorrect
// //         ? currentCorrectAnswer
// //         : String(Math.floor(Math.random() * 100));

// //       if (isCorrect) {
// //         opponentScoreRef.current += 1;
// //         setOpponentScore(opponentScoreRef.current);
// //       }
// //       setOpponentHistory(prev => [{ isCorrect }, ...prev].slice(0, 8));

// //       computerAwaitingRef.current = true;
// //       await submitAnswerToAPI(computerAnswer);
// //     }, computerDelay);

// //     return () => clearTimeout(timeout);
// //   }, [question, gameEnded, submitAnswerToAPI]);

// //   /* ================= INIT FIRST QUESTION ================= */
// //   useEffect(() => {
// //     if (currentQuestion) {
// //       const mSym = getMathSymbol(currentQuestion.symbol);
// //       const qText = `${currentQuestion.input1} ${mSym} ${currentQuestion.input2}`;
// //       currentQuestionMetaRef.current = {
// //         symbol: currentQuestion.symbol || 'Sum',
// //         difficulty: currentQuestion.difficulty || difficulty || 'easy',
// //         qm: currentQuestion.qm || 1,
// //         finalLevel: currentQuestion.finalLevel || 1,
// //       };
// //       setQuestion(qText);
// //       correctAnswerRef.current = String(currentQuestion.answer);
// //       setCorrectAnswer(String(currentQuestion.answer));
// //       setLoading(false);
// //       setQuestionIndex(1);
// //       resetQuestionTimer();
// //     }

// //     // ✅ FIX 1 — restore scores when navigated here via game-reconnected from Lobby
// //     if (restoredMyScore !== undefined) {
// //       scoreRef.current = restoredMyScore;
// //       setScore(restoredMyScore);
// //     }
// //     if (restoredOpponentScore !== undefined) {
// //       opponentScoreRef.current = restoredOpponentScore;
// //       setOpponentScore(restoredOpponentScore);
// //     }
// //   // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);

// //   /* ================= EFFECTS ================= */
// //   useEffect(() => {
// //     return () => {
// //       if (!isComputerRef.current && socketRef.current?.connected && !hasNavigatedToResultRef.current) {
// //         const history = questionHistoryRef.current;
// //         const payload = hasAnsweredAtLeastOne()
// //           ? { reason: 'abandon', loserId: myMongoIdRef.current, questionHistory: history }
// //           : { reason: 'abort' };
// //         socketRef.current.emit('game-ended', payload);
// //       }
// //       stopEffect('ticktock');
// //       if (graceIntervalRef.current) clearInterval(graceIntervalRef.current);
// //       if (rematchCountdownRef.current) clearInterval(rematchCountdownRef.current);
// //       stopAnchorTimer();
// //     };
// //   }, [hasAnsweredAtLeastOne, stopAnchorTimer]);

// //   useEffect(() => {
// //     isSoundOnRef.current = isSoundOn;
// //     if (!isSoundOn) {
// //       stopEffect('ticktock');
// //       stopEffect('timer');
// //       last10PlayedRef.current = false;
// //     }
// //   }, [isSoundOn]);

// //   useFocusEffect(
// //     useCallback(() => {
// //       initSound('correct', 'rightanswer.mp3');
// //       initSound('incorrect', 'wronganswerr.mp3');
// //       initSound('skipped', 'skip.mp3');
// //       initSound('timer', 'every30second.wav');
// //       initSound('ticktock', 'ticktock.mp3');
// //     }, []),
// //   );

// //   useEffect(() => {
// //     const sub = AppState.addEventListener('change', state => {
// //       if (state !== 'active') {
// //         stopEffect('ticktock');
// //       } else if (state === 'active' && appState.current !== 'active') {
// //         if (!isComputerRef.current && socketRef.current?.connected) {
// //           console.log('[AppState] App foreground - requesting timer sync');
// //           socketRef.current.emit('sync-timer');
// //         }
// //       }
// //       if (state === 'active' && totalTimeRef.current <= 10 && totalTimeRef.current > 0) {
// //         playEffect('ticktock', isSoundOnRef.current);
// //       }
// //       appState.current = state;
// //     });
// //     return () => sub.remove();
// //   }, []);

// //   useEffect(() => {
// //     const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
// //       if (!gameEnded) {
// //         Alert.alert(
// //           t('Leave Game?'),
// //           t('Are you sure you want to leave? You will lose the match.'),
// //           [
// //             { text: t('Cancel'), style: 'cancel' },
// //             { text: t('Leave'), style: 'destructive', onPress: handleGameExit },
// //           ],
// //         );
// //         return true;
// //       }
// //       return false;
// //     });
// //     return () => backHandler.remove();
// //   // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [gameEnded]);

// //   useEffect(() => {
// //     if (isReverse) {
// //       Animated.loop(
// //         Animated.sequence([
// //           Animated.timing(revScale, { toValue: 1.05, duration: 800, useNativeDriver: true }),
// //           Animated.timing(revScale, { toValue: 1, duration: 800, useNativeDriver: true }),
// //         ]),
// //       ).start();
// //     } else {
// //       revScale.setValue(1);
// //     }
// //   }, [isReverse, revScale]);

// //   useEffect(() => {
// //     AsyncStorage.getItem('userData')
// //       .then(stored => {
// //         if (stored) {
// //           const userData = JSON.parse(stored);
// //           setUser(userData);
// //          if (!myMongoIdRef.current) {
// //   myMongoIdRef.current = userData.id || userData._id;
// // }
// // // ✅ seed myProfileImage from AsyncStorage — match-found fires in Lobby
// // // before this screen mounts so socket handler here never catches it
// // if (userData.profilePic || userData.profileImage) {
// //   updateMyProfileImage(userData.profilePic || userData.profileImage);
// // }
// //         }
// //       })
// //       .catch(console.error);
// //       const opImg =
// //     opponent?.profilePic ||
// //     opponent?.profileImage ||
// //     opponent?.avatar ||
// //     opponent?.photo ||
// //     null;
// //   if (opImg) {
// //     updateOpponentProfileImage(opImg);
// //   }
// //   }, []);

// //   /* ================= SOCKET SETUP ================= */
// //   useEffect(() => {
// //     if (isComputerRef.current) return;
// //     if (!socket) return;

// //     socketRef.current = socket;
// //     if (opponent?.id) opponentMongoIdRef.current = opponent.id;

// //     const originalEmit = socket.emit.bind(socket);
// //     socket.emit = function(event, ...args) {
// //       if (['leave-game'].includes(event)) {
// //         console.log(`📤 EMITTING: ${event}`, args);
// //       }
// //       return originalEmit(event, ...args);
// //     };

// //     // ✅ FIX 2 — removed register-player emit here.
// //     // Socket.js already emits register-player on connect.
// //     // Lobby.js handles rejoin-game + reconnect-to-game after player-registered fires.
// //     // Emitting here caused double register-player → double rejoin-game → grace period exhausted.
// //     const handleConnect = () => {
// //       setIsConnected(true);
// //       console.log('🟢 Connected/Reconnected to socket — register-player handled by Socket.js');
// //     };

// //     const handleDisconnect = reason => {
// //       console.log('Disconnected:', reason);
// //       setIsConnected(false);
// //     };

// //     const handleConnectError = error => {
// //       console.error('Connection error:', error);
// //       setIsConnected(false);
// //     };

// //     const handleMatchFound = data => {
// //       console.log('[match-found] seeding profile images early');
// //       captureGameRoomId(data);
// //       if (data?.myProfileImage) {
// //         updateMyProfileImage(data.myProfileImage);
// //       }
// //       if (data?.opponent?.profileImage) {
// //         updateOpponentProfileImage(data.opponent.profileImage);
// //       }
// //       if (Array.isArray(data?.gameRoom?.players)) {
// //         const myId = myMongoIdRef.current;
// //         data.gameRoom.players.forEach(p => {
// //           if (p.id === myId || p._id === myId) {
// //             if (p.profileImage) updateMyProfileImage(p.profileImage);
// //           } else {
// //             if (p.profileImage) updateOpponentProfileImage(p.profileImage);
// //           }
// //         });
// //       }
// //     };

// //     const handleNewQuestion = q => {
// //       captureGameRoomId(q);
// //       const mSym = getMathSymbol(q.symbol);
// //       const qText = `${q.input1} ${mSym} ${q.input2}`;
// //       currentQuestionMetaRef.current = {
// //         symbol: q.symbol || currentQuestionMetaRef.current.symbol,
// //         difficulty: q.difficulty || currentQuestionMetaRef.current.difficulty,
// //         qm: q.qm || currentQuestionMetaRef.current.qm,
// //         finalLevel: q.finalLevel || currentQuestionMetaRef.current.finalLevel,
// //       };
// //       setQuestion(qText);
// //       correctAnswerRef.current = String(q.answer);
// //       setCorrectAnswer(String(q.answer));
// //       setInput('');
// //       setLoading(false);
// //       setFeedback(null);
// //       console.log('[new-question] clearing feedback; scores:', { score: scoreRef.current, opponentScore: opponentScoreRef.current, minutes: totalTimeRef.current });
// //       setAwaitingResult(false);
// //       console.log('[new-question] awaitingResult cleared');
// //       setQuestionIndex(prev => prev + 1);
// //       resetQuestionTimer();
// //     };

// //     const handleNextQuestion = data => {
// //       captureGameRoomId(data);
// //       const q = data.question;
// //       const mSym = getMathSymbol(q.symbol);
// //       const qText = `${q.input1} ${mSym} ${q.input2}`;
// //       currentQuestionMetaRef.current = {
// //         symbol: q.symbol || currentQuestionMetaRef.current.symbol,
// //         difficulty: q.difficulty || currentQuestionMetaRef.current.difficulty,
// //         qm: q.qm || currentQuestionMetaRef.current.qm,
// //         finalLevel: q.finalLevel || currentQuestionMetaRef.current.finalLevel,
// //       };
// //       setQuestion(qText);
// //       correctAnswerRef.current = String(q.answer);
// //       setCorrectAnswer(String(q.answer));
// //       setInput('');
// //       setLoading(false);
// //       setFeedback(null);
// //       setAwaitingResult(false);
// //       console.log('[next-question] awaitingResult cleared; questionIndex about to increment; remaining:', totalTimeRef.current);
// //       setQuestionIndex(prev => prev + 1);
// //       resetQuestionTimer();

// //       if (data.gameState?.playerScores) {
// //         const pScores = data.gameState.playerScores;
// //         if (opponentMongoIdRef.current && pScores[opponentMongoIdRef.current] !== undefined) {
// //           const opData = pScores[opponentMongoIdRef.current];
// //           const opScore = typeof opData === 'object' ? opData.score : opData;
// //           setOpponentScore(opScore);
// //           opponentScoreRef.current = opScore;
// //           console.log('[next-question] opponent score updated from server:', opScore);
// //         }
// //         if (myMongoIdRef.current && pScores[myMongoIdRef.current] !== undefined) {
// //           const myData = pScores[myMongoIdRef.current];
// //           const myScore = typeof myData === 'object' ? myData.score : myData;
// //           if (myScore !== scoreRef.current) {
// //             scoreRef.current = myScore;
// //             setScore(myScore);
// //             console.log('[next-question] my score synced from server:', myScore);
// //           }
// //         }
// //       }
// //     };

// //     const handleOpponentScoreUpdate = data => {
// //       if (data.opponentId === opponentMongoIdRef.current) {
// //         setOpponentScore(data.score);
// //         opponentScoreRef.current = data.score;
// //         console.log('[opponent-score-update] opponentId:', data.opponentId, 'score:', data.score, 'remaining:', totalTimeRef.current);
// //         if (data.history && Array.isArray(data.history)) {
// //           setOpponentHistory(data.history);
// //         }
// //       }
// //     };

// //     const handleGameEnded = data => {
// //       showResult(buildResultData({ winner: data?.winner }));
// //     };

// //     const handlePostGameStarted = data => {
// //       if (hasNavigatedToResultRef.current) return;
// //       if (totalTimeRef.current >= (timer ?? 60) - 2) return;
// //       console.log('[post-game-started] raw data:', JSON.stringify(data, null, 2));

// //       const { myPic, opponentPic } = extractFromPlayerProfiles(data?.playerProfiles);

// //       if (myPic) updateMyProfileImage(myPic);
// //       if (opponentPic) updateOpponentProfileImage(opponentPic);

// //       showResult(buildResultData({
// //         winner: data?.winner,
// //         opponentProfileImage: opponentPic ?? opponentProfileImageRef.current,
// //         myProfileImage: myPic ?? myProfileImageRef.current,
// //       }));
// //     };

// //     const handleOpponentDisconnected = (data) => {
// //       console.log('⚠️ handleOpponentDisconnected called', data);
// //       if (hasNavigatedToResultRef.current) {
// //         console.log('🛑 Already handled disconnect');
// //         return;
// //       }
// //       console.log('⏳ Waiting for grace period or opponent-left-game event');
// //     };

// //     const handleGracePeriod = data => {
// //       captureGameRoomId(data);
// //       const countdown = data?.graceCountdown ?? 15;
// //       setGraceCountdown(countdown);
// //       let remaining = countdown;
// //       if (graceIntervalRef.current) clearInterval(graceIntervalRef.current);
// //       graceIntervalRef.current = setInterval(() => {
// //         remaining -= 1;
// //         setGraceCountdown(remaining);
// //         if (remaining <= 0) {
// //           clearInterval(graceIntervalRef.current);
// //           graceIntervalRef.current = null;
// //         }
// //       }, 1000);
// //     };

// //     const handleGracePeriodExpired = (data) => {
// //       if (graceIntervalRef.current) {
// //         clearInterval(graceIntervalRef.current);
// //         graceIntervalRef.current = null;
// //       }
// //       setGraceCountdown(null);
// //       console.log('[grace-period-expired] raw data:', JSON.stringify(data, null, 2));

// //       const { myPic, opponentPic } = extractFromPlayerProfiles(data?.playerProfiles);

// //       if (myPic) updateMyProfileImage(myPic);
// //       if (opponentPic) updateOpponentProfileImage(opponentPic);

// //       if (!hasNavigatedToResultRef.current) {
// //         showResult(buildResultData({
// //           gameResult: 'win',
// //           opponentDisconnected: true,
// //           winner: myMongoIdRef.current,
// //           opponentProfileImage: opponentPic ?? opponentProfileImageRef.current,
// //           myProfileImage: myPic ?? myProfileImageRef.current,
// //         }));
// //       }
// //     };

// //     const handleOpponentReconnected = data => {
// //       if (graceIntervalRef.current) {
// //         clearInterval(graceIntervalRef.current);
// //         graceIntervalRef.current = null;
// //       }
// //       setGraceCountdown(null);
// //       Alert.alert(t('Reconnected'), data?.message || t('Opponent has reconnected!'));
// //     };

// //     const handleOpponentEmoji = data => {
// //       if (data?.emoji) {
// //         setOpponentEmoji(data.emoji);
// //         setTimeout(() => setOpponentEmoji(null), 3000);
// //       }
// //     };

// //     const handleEmojiInvalid = data => {
// //       console.warn('Invalid emoji:', data?.message);
// //     };

// //     const handleEmojiRateLimited = () => {
// //       setEmojiDisabled(true);
// //       setTimeout(() => setEmojiDisabled(false), 2000);
// //     };

// //     // ✅ TIMER FIX — timer-synced now prefers server anchor (gameStartedAt/totalGameTime),
// //     // falls back to old timeRemaining math if anchor fields aren't present.
// //     const handleTimerSynced = (data) => {
// //       if (!data) return;

// //       if (typeof data.gameStartedAt === 'number' && typeof data.totalGameTime === 'number') {
// //         gameStartedAtRef.current = data.gameStartedAt;
// //         totalGameTimeRef.current = data.totalGameTime;
// //         const remaining = computeRemainingSeconds();
// //         totalTimeRef.current = remaining;
// //         setMinutes(Math.floor(Math.max(remaining, 0) / 60));
// //         setSeconds(Math.max(remaining, 0) % 60);
// //         setTimeRemaining(totalGameTimeRef.current - (Date.now() - gameStartedAtRef.current));
// //         startTimerFromAnchor(); // resync interval cleanly on the same anchor
// //         console.log('[timer-synced] resynced from server anchor:', {
// //           gameStartedAt: gameStartedAtRef.current,
// //           totalGameTime: totalGameTimeRef.current,
// //           remaining,
// //         });
// //       } else if (typeof data.timeRemaining === 'number') {
// //         // old fallback path — no anchor fields sent
// //         console.log('[timer-synced] no anchor fields, falling back to timeRemaining:', data.timeRemaining);
// //         const serverSecondsRemaining = Math.ceil(data.timeRemaining / 1000);
// //         totalTimeRef.current = serverSecondsRemaining;
// //         setTimeRemaining(data.timeRemaining);
// //         setMinutes(Math.floor(serverSecondsRemaining / 60));
// //         setSeconds(serverSecondsRemaining % 60);
// //       }

// //       if (data.playerScores) {
// //         const pScores = data.playerScores;
// //         if (myMongoIdRef.current && pScores[myMongoIdRef.current] !== undefined) {
// //           const myScore = typeof pScores[myMongoIdRef.current] === 'object'
// //             ? pScores[myMongoIdRef.current].score
// //             : pScores[myMongoIdRef.current];
// //           scoreRef.current = myScore;
// //           setScore(myScore);
// //         }
// //         if (opponentMongoIdRef.current && pScores[opponentMongoIdRef.current] !== undefined) {
// //           const opScore = typeof pScores[opponentMongoIdRef.current] === 'object'
// //             ? pScores[opponentMongoIdRef.current].score
// //             : pScores[opponentMongoIdRef.current];
// //           opponentScoreRef.current = opScore;
// //           setOpponentScore(opScore);
// //         }
// //       }

// //       if (data.currentQuestion) {
// //         const q = data.currentQuestion;
// //         const mSym = getMathSymbol(q.symbol);
// //         const qText = `${q.input1} ${mSym} ${q.input2}`;
// //         currentQuestionMetaRef.current = {
// //           symbol: q.symbol || currentQuestionMetaRef.current.symbol,
// //           difficulty: q.difficulty || currentQuestionMetaRef.current.difficulty,
// //           qm: q.qm || currentQuestionMetaRef.current.qm,
// //           finalLevel: q.finalLevel || currentQuestionMetaRef.current.finalLevel,
// //         };
// //         setQuestion(qText);
// //         correctAnswerRef.current = String(q.answer);
// //         setCorrectAnswer(String(q.answer));
// //       }
// //     };

// //     const handleRematchRequested = data => {
// //       // ✅ Robust check: never alert the requester themselves
// //       if (data?.requesterId && data.requesterId === myMongoIdRef.current) {
// //         console.log('[rematch-requested] ignoring — I am the requester');
// //         return;
// //       }

// //       // ✅ Only show the alert if we're truly idle. Blocks duplicate/late
// //       // 'rematch-requested' events from re-popping the alert after the
// //       // receiver has already accepted/declined (state would be 'waiting',
// //       // 'countdown', 'declined', etc. — never show again in those cases).
// //       if (rematchStateRef.current !== 'idle') {
// //         console.log('[rematch-requested] ignoring duplicate — current state:', rematchStateRef.current);
// //         return;
// //       }

// //       // Mark as "pending decision" immediately so a duplicate event arriving
// //       // before the Alert is dismissed can't double-fire it either.
// //       rematchStateRef.current = 'pending_decision';

// //       Alert.alert(
// //         t('Rematch Request'),
// //         `${data?.requesterName || t('Opponent')} ${t('wants a rematch!')}`,
// //         [
// //           {
// //             text: t('Decline'),
// //             style: 'cancel',
// //             onPress: () => {
// //               socketRef.current?.emit('decline-rematch');
// //               rematchStateRef.current = 'idle';
// //               setRematchState('idle');
// //             },
// //           },
// //           {
// //             text: t('Accept'),
// //             onPress: () => {
// //               socketRef.current?.emit('accept-rematch');
// //               rematchStateRef.current = 'waiting';
// //               setRematchState('waiting');
// //             },
// //           },
// //         ],
// //       );
// //     };

// //     const handleRematchAccepted = data => {
// //       if (data?.opponent?.profileImage) {
// //         updateOpponentProfileImage(data.opponent.profileImage);
// //       }
// //       const secs = data?.countdownSeconds ?? 3;
// //       setRematchCountdown(secs);
// //       rematchStateRef.current = 'countdown';
// //       setRematchState('countdown');
// //       let remaining = secs;
// //       if (rematchCountdownRef.current) clearInterval(rematchCountdownRef.current);
// //       rematchCountdownRef.current = setInterval(() => {
// //         remaining -= 1;
// //         setRematchCountdown(remaining);
// //         if (remaining <= 0) {
// //           clearInterval(rematchCountdownRef.current);
// //           rematchCountdownRef.current = null;
// //         }
// //       }, 1000);
// //     };

// //     const handleRematchDeclined = () => {
// //       if (rematchCountdownRef.current) clearInterval(rematchCountdownRef.current);
// //       rematchStateRef.current = 'declined';
// //       setRematchState('declined');
// //     };

// //     const handleGameStarted = data => {
// //       const currentRematchState = rematchStateRef.current;
// //       if (currentRematchState !== 'countdown' && currentRematchState !== 'waiting') return;
// //       if (gameStartedHandledRef.current) return;
// //       gameStartedHandledRef.current = true;
// //       if (rematchCountdownRef.current) clearInterval(rematchCountdownRef.current);

// //       navigation.replace('MultiPlayerGame', {
// //         currentQuestion: data.firstQuestion || data.currentQuestion,
// //         timer: data.timer ?? timer,
// //         difficulty: data.difficulty ?? difficulty,
// //         diffCode: data.diffCode ?? diffCode,
// //         gameRoomId: data.gameRoomId || data.roomId || gameRoomIdRef.current,
// //         // ✅ TIMER FIX — forward server anchor so rematch screen starts in sync too
// //         gameStartedAt: data.gameState?.gameStartedAt ?? data.gameStartedAt,
// //         totalGameTime: data.gameState?.totalGameTime ?? data.totalGameTime,
// //         opponent: {
// //           id: opponentMongoIdRef.current,
// //           username: opponent?.username,
// //           profilePic: opponentProfileImageRef.current,
// //         },
// //         myMongoId: myMongoIdRef.current,
// //         isComputer: false,
// //       });
// //     };

// //     const handleOpponentLeftLobby = () => {
// //       rematchStateRef.current = 'opponent_left';
// //       setRematchState('opponent_left');
// //     };

// //     const handleExitedPostGame = () => {
// //       navigation.replace('BottomTab');
// //     };

// //     const handleLeftGame = data => {
// //       console.log('👋 left-game:', data);
// //       if (hasNavigatedToResultRef.current) {
// //         console.log('🛑 Already navigated away, ignoring');
// //         return;
// //       }
// //       stopEffect('ticktock');
// //       totalTimeRef.current = 0;
// //       Alert.alert(
// //         t('Game Forfeited'),
// //         data.message || t('You have left the game. You forfeit this match.'),
// //         [
// //           {
// //             text: t('OK'),
// //             onPress: () => {
// //               navigation.replace('BottomTab');
// //             },
// //           },
// //         ],
// //       );
// //     };

// //     const handleOpponentLeftGame = data => {
// //       console.log('🏆 opponent-left-game received:', data);
// //       if (hasNavigatedToResultRef.current) {
// //         console.log('🛑 Already navigated to results, ignoring');
// //         return;
// //       }
// //       console.log('✅ Processing opponent left game...');
// //       stopEffect('ticktock');
// //       totalTimeRef.current = 0;
// //       if (graceIntervalRef.current) {
// //         clearInterval(graceIntervalRef.current);
// //         graceIntervalRef.current = null;
// //       }
// //       setGraceCountdown(null);

// //       const { myPic, opponentPic } = extractFromPlayerProfiles(data?.playerProfiles);
// //       if (myPic) {
// //         console.log('📸 Updating my profile image');
// //         updateMyProfileImage(myPic);
// //       }
// //       if (opponentPic) {
// //         console.log('📸 Updating opponent profile image');
// //         updateOpponentProfileImage(opponentPic);
// //       }

// //       const resultData = buildResultData({
// //         winner: myMongoIdRef.current,
// //         opponentLeft: true,
// //         gameResults: data?.gameResults,
// //         gameResult: 'win',
// //         opponentProfileImage: opponentPic ?? opponentProfileImageRef.current,
// //         myProfileImage: myPic ?? myProfileImageRef.current,
// //       });
// //       console.log('📊 Result data prepared for opponent-left-game. Calling showResult...');
// //       showResult(resultData);
// //     };

// //     const handleGameAbortedNoStart = (data) => {
// //       console.log('🚫 game-aborted-no-start received:', data);
// //       if (hasNavigatedToResultRef.current) {
// //         console.log('🛑 Already navigated away, ignoring abort');
// //         return;
// //       }
// //       hasNavigatedToResultRef.current = true;
// //       stopEffect('ticktock');
// //       setGameEnded(true);
// //       Alert.alert(
// //         t('Game Aborted'),
// //         data?.message || t('Game aborted. No player answered within 15 seconds. No rating change.'),
// //         [
// //           {
// //             text: t('OK'),
// //             onPress: () => {
// //               navigation.replace('BottomTab');
// //             },
// //           },
// //         ],
// //       );
// //     };

// //     // ✅ FIX 3 — Lobby.js handles rejoin-game and emits reconnect-to-game.
// //     // This stale MultiPlayerGame instance must NOT also emit it — causes double
// //     // reconnect-to-game which exhausts grace period and triggers reconnect-failed.
// //     const handleRejoinGame = (data) => {
// //       console.log('🔄 rejoin-game received in stale MultiPlayerGame — Lobby handles this, ignoring');
// //     };

// //     // ✅ FIX 3 — Lobby.js handles game-reconnected and navigates to a fresh
// //     // MultiPlayerGame. This old instance must do nothing here.
// //     const handleGameReconnected = (data) => {
// //       console.log('✅ game-reconnected in stale MultiPlayerGame — Lobby is handling navigation, ignoring');
// //     };

// //     const handleReconnectFailed = (data) => {
// //       console.log('❌ reconnect-failed - grace period expired');
// //       if (hasNavigatedToResultRef.current) {
// //         console.log('🛑 Already navigated away, ignoring reconnect-failed');
// //         return;
// //       }
// //       hasNavigatedToResultRef.current = true;
// //       stopEffect('ticktock');
// //       setGameEnded(true);
// //       Alert.alert(
// //         t('Reconnection Failed'),
// //         data?.message || t('Grace period expired. Game has ended. Returning to home.'),
// //         [
// //           {
// //             text: t('OK'),
// //             onPress: () => {
// //               navigation.replace('BottomTab');
// //             },
// //           },
// //         ],
// //       );
// //     };

// //     const handleError = data => {
// //       console.error('Socket error:', data);
// //     };

// //     socket.on('connect', handleConnect);
// //     socket.on('disconnect', handleDisconnect);
// //     socket.on('connect_error', handleConnectError);
// //     socket.on('match-found', handleMatchFound);
// //     socket.on('new-question', handleNewQuestion);
// //     socket.on('next-question', handleNextQuestion);
// //     socket.on('opponent-score-update', handleOpponentScoreUpdate);
// //     socket.on('game-ended', handleGameEnded);
// //     socket.on('post-game-started', handlePostGameStarted);
// //     socket.on('opponent-disconnected', handleOpponentDisconnected);
// //     socket.on('opponent-emoji-received', handleOpponentEmoji);
// //     socket.on('emoji-invalid', handleEmojiInvalid);
// //     socket.on('emoji-rate-limited', handleEmojiRateLimited);
// //     socket.on('game-in-grace-period', handleGracePeriod);
// //     socket.on('grace-period-expired', handleGracePeriodExpired);
// //     socket.on('opponent-reconnected', handleOpponentReconnected);
// //     socket.on('timer-synced', handleTimerSynced);
// //     socket.on('game-aborted-no-start', handleGameAbortedNoStart);
// //     socket.on('rejoin-game', handleRejoinGame);
// //     socket.on('game-reconnected', handleGameReconnected);
// //     socket.on('reconnect-failed', handleReconnectFailed);
// //     socket.on('rematch-requested', handleRematchRequested);
// //     socket.on('rematch-accepted', handleRematchAccepted);
// //     socket.on('rematch-declined', handleRematchDeclined);
// //     socket.on('game-started', handleGameStarted);
// //     socket.on('opponent-left-lobby', handleOpponentLeftLobby);
// //     socket.on('exited-post-game', handleExitedPostGame);
// //     socket.on('left-game', handleLeftGame);
// //     socket.on('opponent-left-game', handleOpponentLeftGame);
// //     socket.on('error', handleError);

// //     return () => {
// //       socket.off('connect', handleConnect);
// //       socket.off('disconnect', handleDisconnect);
// //       socket.off('connect_error', handleConnectError);
// //       socket.off('match-found', handleMatchFound);
// //       socket.off('new-question', handleNewQuestion);
// //       socket.off('next-question', handleNextQuestion);
// //       socket.off('opponent-score-update', handleOpponentScoreUpdate);
// //       socket.off('game-ended', handleGameEnded);
// //       socket.off('post-game-started', handlePostGameStarted);
// //       socket.off('opponent-disconnected', handleOpponentDisconnected);
// //       socket.off('opponent-emoji-received', handleOpponentEmoji);
// //       socket.off('emoji-invalid', handleEmojiInvalid);
// //       socket.off('emoji-rate-limited', handleEmojiRateLimited);
// //       socket.off('game-in-grace-period', handleGracePeriod);
// //       socket.off('grace-period-expired', handleGracePeriodExpired);
// //       socket.off('opponent-reconnected', handleOpponentReconnected);
// //       socket.off('timer-synced', handleTimerSynced);
// //       socket.off('game-aborted-no-start', handleGameAbortedNoStart);
// //       socket.off('rejoin-game', handleRejoinGame);
// //       socket.off('game-reconnected', handleGameReconnected);
// //       socket.off('reconnect-failed', handleReconnectFailed);
// //       socket.off('rematch-requested', handleRematchRequested);
// //       socket.off('rematch-accepted', handleRematchAccepted);
// //       socket.off('rematch-declined', handleRematchDeclined);
// //       socket.off('game-started', handleGameStarted);
// //       socket.off('opponent-left-lobby', handleOpponentLeftLobby);
// //       socket.off('exited-post-game', handleExitedPostGame);
// //       socket.off('left-game', handleLeftGame);
// //       socket.off('opponent-left-game', handleOpponentLeftGame);
// //       socket.off('error', handleError);
// //     };
// //   }, [
// //     socket,
// //     opponent,
// //     difficulty,
// //     timer,
// //     navigation,
// //     showResult,
// //     buildResultData,
// //     showBadges,
// //     diffCode,
// //     resetQuestionTimer,
// //     extractFromPlayerProfiles,
// //     updateMyProfileImage,
// //     updateOpponentProfileImage,
// //     captureGameRoomId,
// //     computeRemainingSeconds,
// //     startTimerFromAnchor,
// //   ]);

// //   /* ================= TIMER ================= */
// //   // ✅ TIMER FIX — if a server anchor is present (PvP games), derive remaining
// //   // time from gameStartedAt/totalGameTime every tick (never decrement a variable).
// //   // Computer-mode games have no server anchor, so they keep the old local countdown.
// //   useEffect(() => {
// //     if (gameEnded) return;

// //     if (!isComputerRef.current && gameStartedAtRef.current) {
// //       startTimerFromAnchor();
// //       return () => stopAnchorTimer();
// //     }

// //     const interval = setInterval(() => {
// //       if (!isPaused) {
// //         totalTimeRef.current -= 1;
// //         const remaining = totalTimeRef.current;
// //         setMinutes(Math.floor(remaining / 60));
// //         setSeconds(remaining % 60);
// //         if (remaining === 60) {
// //           console.log('[timer] hit 60 seconds remaining (1 minute). state snapshot:', {
// //             remaining,
// //             minutes: Math.floor(remaining / 60),
// //             seconds: remaining % 60,
// //             score: scoreRef.current,
// //             opponentScore: opponentScoreRef.current,
// //             feedback,
// //             awaitingResult,
// //           });
// //         }
// //         if (remaining < 60 && remaining >= 0) {
// //           console.log('[timer] <60s remaining:', { remaining, minutes: Math.floor(remaining / 60), seconds: remaining % 60 });
// //         }

// //         if (remaining <= 10 && remaining > 0 && !last10PlayedRef.current) {
// //           playEffect('ticktock', isSoundOnRef.current);
// //           last10PlayedRef.current = true;
// //         }

// //         if (remaining <= 10 && remaining > 0) {
// //           Animated.sequence([
// //             Animated.timing(animateWatch, { toValue: 1.4, duration: 300, useNativeDriver: true }),
// //             Animated.timing(animateWatch, { toValue: 1, duration: 300, useNativeDriver: true }),
// //           ]).start();
// //         }

// //         if (remaining % 30 === 0 && remaining !== timer && remaining > 0) {
// //           setIsThirtySecPhase(true);
// //           playEffect('timer', isSoundOnRef.current);
// //           Animated.sequence([
// //             Animated.timing(animateWatch, { toValue: 1.4, duration: 300, useNativeDriver: true }),
// //             Animated.timing(animateWatch, { toValue: 1, duration: 300, useNativeDriver: true }),
// //           ]).start(() => setIsThirtySecPhase(false));
// //         }

// //         if (remaining <= 0) {
// //           clearInterval(interval);
// //           handleTimeUp();
// //         }
// //       }
// //     }, 1000);

// //     return () => clearInterval(interval);
// //   // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [isPaused, timer, gameEnded, startTimerFromAnchor, stopAnchorTimer]);

// //   /* ================= HANDLERS ================= */
// //   const handleTimeUp = useCallback(() => {
// //     if (!isComputerRef.current && socketRef.current?.connected) {
// //       socketRef.current.emit('game-ended', {
// //         reason: 'timeout',
// //         questionHistory: questionHistoryRef.current,
// //       });
// //     }
// //     showResult(buildResultData());
// //   }, [showResult, buildResultData]);

// //   const handleGameExit = useCallback(() => {
// //     stopEffect('ticktock');
// //     hasNavigatedToResultRef.current = true;
// //     setGameEnded(true);

// //     if (!isComputerRef.current && socketRef.current?.connected) {
// //       console.log('🚪 Player exiting - emitting leave-game');
// //       socketRef.current.emit('leave-game');
// //     }

// //     navigation.replace('BottomTab');
// //   }, [navigation]);

// //   const handleToggleSound = () => {
// //     toggleSound();
// //     const newVal = !isSoundOn;
// //     isSoundOnRef.current = newVal;
// //     if (!newVal) {
// //       stopEffect('ticktock');
// //     } else if (totalTimeRef.current <= 10 && totalTimeRef.current > 0) {
// //       last10PlayedRef.current = false;
// //       playEffect('ticktock', true);
// //     }
// //   };

// //   const handleToggleReactions = () => {
// //     if (!emojiDisabled) {
// //       setIsReactionPickerOpen(prev => !prev);
// //     }
// //   };

// //   const handleSelectReaction = emoji => {
// //     setIsReactionPickerOpen(false);
// //     if (!REACTIONS.includes(emoji)) return;
// //     const now = Date.now();
// //     if (now - emojiCooldownRef.current < 2000) return;
// //     if (isComputerRef.current) return;
// //     if (!socketRef.current?.connected) return;
// //     socketRef.current.emit('send-emoji', { emoji });
// //     emojiCooldownRef.current = now;
// //     setEmojiDisabled(true);
// //     setTimeout(() => setEmojiDisabled(false), 2000);
// //   };

// //   const handleRematch = () => {
// //     if (isComputerRef.current) {
// //       handleNewGame();
// //       return;
// //     }
// //     if (!socketRef.current?.connected) {
// //       Alert.alert(t('Error'), t('Not connected to server.'));
// //       return;
// //     }
// //     socketRef.current.emit('request-rematch');
// //     rematchStateRef.current = 'requesting';
// //     setRematchState('requesting');
// //   };

// //   const handleNewGame = () => {
// //     if (!isComputerRef.current) {
// //       socketRef.current?.emit('exit-post-game');
// //     }
// //     navigation.navigate('ChallengeScreen');
// //   };

// //   const handleCloseResults = () => {
// //     if (!isComputerRef.current) {
// //       socketRef.current?.emit('exit-post-game');
// //     }
// //     navigation.navigate('BottomTab');
// //   };

// //   /* ================= HANDLE PRESS (answer submission) ================= */
// //   const handlePress = async value => {
// //     if (loading || awaitingResult || totalTimeRef.current <= 0 || feedback || gameEnded) return;

// //     const key = value.toString().toLowerCase();

// //     if (key === 'clear' || key === 'clr') return setInput('');
// //     if (key === '⌫' || key === 'del') return setInput(prev => prev.slice(0, -1));
// //     if (key === 'reverse' || key === 'rev') return setIsReverse(prev => !prev);
// //     if (key === 'pm') {
// //       return setInput(prev => (prev.startsWith('-') ? prev.slice(1) : '-' + prev));
// //     }

// //     if (key === 'skip') {
// //       const timeSpent = Date.now() - questionStartTimeRef.current;
// //       skippedCountRef.current += 1;
// //       setSkippedCount(skippedCountRef.current);
// //       setFeedback('skipped');
// //       playEffect('skipped', isSoundOnRef.current);
// //       setAnswerHistory(prev => [{ isCorrect: null }, ...prev].slice(0, 8));
// //       questionHistoryRef.current.push({
// //         isCorrect: null,
// //         timeSpent,
// //         answer: null,
// //       });
// //       if (!isComputerRef.current) {
// //         socketRef.current?.emit('submit-answer', {
// //           answer: null,
// //           playerId: myMongoIdRef.current,
// //           timeSpent,
// //           skipped: true,
// //         });
// //       }
// //       setTimeout(() => setFeedback(null), 900);
// //       return;
// //     }

// //     const newInput = isReverse ? value + input : input + value;
// //     setInput(newInput);

// //     const currentCorrect = correctAnswerRef.current;
// //     const answerIsBlank = currentCorrect === '' || currentCorrect === null || currentCorrect === undefined;

// //     if (answerIsBlank || newInput.length >= currentCorrect.length) {
// //       const timeSpent = Date.now() - questionStartTimeRef.current;
// //       const isCorrect = !answerIsBlank && newInput === currentCorrect;
// //       setFeedback(isCorrect ? 'correct' : 'incorrect');
// //       console.log('[handlePress] answer submitted:', { newInput, isCorrect, remaining: totalTimeRef.current });
// //       playEffect(isCorrect ? 'correct' : 'incorrect', isSoundOnRef.current);
// //       setAnswerHistory(prev => [{ isCorrect }, ...prev].slice(0, 8));
// //       questionHistoryRef.current.push({
// //         isCorrect,
// //         timeSpent,
// //         answer: newInput,
// //       });

// //       if (isCorrect) {
// //         setBonusText('+4 Bonus');
// //         scoreRef.current += 1;
// //         setScore(scoreRef.current);
// //         console.log('[handlePress] incremented score ->', scoreRef.current);
// //         correctAnswersRef.current += 1;
// //         setCorrectAnswers(correctAnswersRef.current);
// //       } else {
// //         setBonusText('');
// //         incorrectCountRef.current += 1;
// //       }

// //       if (!isComputerRef.current) {
// //         socketRef.current?.emit('submit-answer', {
// //           answer: newInput,
// //           playerId: myMongoIdRef.current,
// //           timeSpent,
// //         });
// //         setAwaitingResult(true);
// //         console.log('[handlePress] awaiting result set true; remaining:', totalTimeRef.current);
// //         setTimeout(() => {
// //           setAwaitingResult(false);
// //           setFeedback(null);
// //           setBonusText('');
// //           console.log('[handlePress] awaiting result cleared by timeout; remaining:', totalTimeRef.current);
// //         }, 5000);
// //       } else {
// //         setAwaitingResult(true);
// //         const result = await submitAnswerToAPI(newInput);
// //         setAwaitingResult(false);
// //         setFeedback(null);
// //         setBonusText('');
// //         if (!result) {
// //           console.error('Failed to get next question from API');
// //         }
// //       }
// //     }
// //   };

// //   /* ================= RENDER ================= */
// //   const content = (
// //     <View style={[styles.container, { paddingTop: insets.top + 30 }]}>

// //       {/* TOP BAR */}
// //       <View style={[styles.topBar, { backgroundColor: theme.cardBackground || '#1E293B' }]}>
// //         <TouchableOpacity
// //           onPress={() => {
// //             if (!gameEnded) {
// //               Alert.alert(
// //                 t('Leave Game?'),
// //                 t('Are you sure you want to leave? You will lose the match.'),
// //                 [
// //                   { text: t('Cancel'), style: 'cancel' },
// //                   { text: t('Leave'), style: 'destructive', onPress: handleGameExit },
// //                 ],
// //               );
// //             } else {
// //               stopEffect('ticktock');
// //               navigation.goBack();
// //             }
// //           }}
// //           style={styles.iconButton}
// //           hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
// //         >
// //           <Icon name="caret-back-outline" size={24} color="#fff" />
// //         </TouchableOpacity>

// //         <View style={styles.timerContainer}>
// //           <Animated.Image
// //             source={require('../assets/Stopwatch.png')}
// //             style={[
// //               styles.timerIcon,
// //               {
// //                 transform: [{ scale: animateWatch }],
// //                 tintColor: minutes * 60 + seconds <= 10 || isThirtySecPhase ? 'red' : '#fff',
// //               },
// //             ]}
// //           />
// //           <Text style={styles.timerText}>{`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}</Text>
// //         </View>

// //         <TouchableOpacity onPress={handleToggleSound} style={styles.iconButton1}>
// //           <Icon name={isSoundOn ? 'volume-high' : 'volume-mute'} size={24} color="#fff" />
// //         </TouchableOpacity>
// //       </View>

// //       {/* OPPONENT HEADER */}
// //       <View style={styles.opponentHeader}>
// //         <View style={styles.headerLeft}>
// //           <View style={styles.opponentAvatarContainer}>
// //             <View style={[styles.avatarCircle, { backgroundColor: '#0F766E', width: 40, height: 40, borderRadius: 8 }]}>
// //               {opponentProfileImage ? (
// //                 <Image
// //                   source={{ uri: opponentProfileImage }}
// //                   style={{ width: 40, height: 40, borderRadius: 8 }}
// //                   onError={() => setOpponentProfileImage(null)}
// //                 />
// //               ) : (
// //                 <Text style={styles.avatarInitial}>
// //                   {opponent?.username?.charAt(0).toUpperCase() || (isComputerRef.current ? '🤖' : 'O')}
// //                 </Text>
// //               )}
// //             </View>
// //             {!isComputerRef.current && <View style={styles.onlineDot} />}

// //             {opponentEmoji && (
// //               <View style={styles.opponentEmojiBubble}>
// //                 <Text style={{ fontSize: 20 }}>{opponentEmoji}</Text>
// //               </View>
// //             )}

// //             {graceCountdown !== null && (
// //               <View style={styles.graceCountdownBubble}>
// //                 <Text style={styles.graceCountdownText}>⏳{graceCountdown}s</Text>
// //               </View>
// //             )}
// //           </View>

// //           <View style={styles.opponentInfo}>
// //             <Text style={styles.opponentName} numberOfLines={1}>
// //               {opponent?.username || (isComputerRef.current ? 'Computer 🤖' : t('Opponent'))}
// //             </Text>
// //             {graceCountdown !== null && (
// //               <Text style={styles.reconnectingText}>{t('Waiting to reconnect...')}</Text>
// //             )}
// //             <View style={styles.historyContainer}>
// //               <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.historyScrollContent}>
// //                 {opponentHistory.map((item, index) => {
// //                   const isRight = typeof item === 'object' && item !== null ? item.isCorrect : item;
// //                   return (
// //                     <Icon
// //                       key={index}
// //                       name={isRight ? 'checkmark' : 'close'}
// //                       size={16}
// //                       color={isRight ? '#10B981' : '#EF4444'}
// //                       style={{ marginRight: 4 }}
// //                     />
// //                   );
// //                 })}
// //               </ScrollView>
// //             </View>
// //           </View>
// //         </View>

// //         <View style={styles.headerRight}>
// //           <Text style={styles.scoreLabel}>{t('Pts')}</Text>
// //           <Text style={styles.scoreValue}>{opponentScore}</Text>
// //         </View>
// //       </View>

// //       {/* Disconnected banner */}
// //       {!isComputerRef.current && !isConnected && (
// //         <View style={styles.disconnectedBanner}>
// //           <Text style={styles.disconnectedText}>⚠️ {t('Reconnecting...')}</Text>
// //         </View>
// //       )}

// //       {/* MY DATA */}
// //       <View style={styles.myDataContainer}>
// //         <View style={styles.headerLeft}>
// //           <View style={styles.opponentAvatarContainer}>
// //             <View style={[styles.avatarCircle, { width: 42, height: 42, backgroundColor: '#4F46E5', borderRadius: 8 }]}>
// //               {(myProfileImage || user?.profilePic) ? (
// //                 <Image
// //                   source={{ uri: myProfileImage || user.profilePic }}
// //                   style={{ width: 42, height: 42, borderRadius: 8 }}
// //                 />
// //               ) : (
// //                 <Text style={styles.avatarInitial}>{user?.username?.charAt(0).toUpperCase() || 'Y'}</Text>
// //               )}
// //             </View>
// //             <View style={styles.youBadge}>
// //               <Text style={styles.youBadgeText}>{t('YOU')}</Text>
// //             </View>
// //           </View>

// //           <View style={styles.opponentInfo}>
// //             <Text style={styles.playerName} numberOfLines={1}>
// //               {user?.username || t('You')}
// //             </Text>
// //             <View style={styles.historyContainer}>
// //               <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.historyScrollContent}>
// //                 {answerHistory.map((item, index) => (
// //                   <Icon
// //                     key={index}
// //                     name={item.isCorrect === null ? 'close' : item.isCorrect ? 'checkmark' : 'close'}
// //                     size={16}
// //                     color={item.isCorrect === null ? '#FF6B6B' : item.isCorrect ? '#10B981' : '#EF4444'}
// //                     style={{ marginRight: 4 }}
// //                   />
// //                 ))}
// //               </ScrollView>
// //             </View>
// //           </View>
// //         </View>

// //         <View style={styles.headerRight}>
// //           <Text style={styles.scoreLabel}>{t('Pts')}</Text>
// //           <Text style={styles.scoreValue}>{score}</Text>
// //         </View>
// //       </View>

// //       {/* QUESTION AREA */}
// //       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
// //         <Text style={styles.question}>{loading ? t('Loading...') : question}</Text>

// //         <View style={[
// //           styles.answerBox,
// //           { backgroundColor: theme.cardBackground || '#1E293B' },
// //           feedback === 'correct'   ? { borderColor: 'green',  borderWidth: 2 } :
// //           feedback === 'incorrect' ? { borderColor: 'red',    borderWidth: 2 } :
// //           feedback === 'skipped'   ? { borderColor: 'orange', borderWidth: 2 } : {},
// //         ]}>
// //           <Text style={[
// //             styles.answerText,
// //             feedback === 'correct'   ? { color: 'green'  } :
// //             feedback === 'incorrect' ? { color: 'red'    } :
// //             feedback === 'skipped'   ? { color: 'orange' } : {},
// //           ]}>
// //             {input || (
// //               feedback === 'correct'   ? t('Correct')   :
// //               feedback === 'incorrect' ? t('Incorrect') :
// //               feedback === 'skipped'   ? t('Skipped')   :
// //               ''
// //             )}
// //           </Text>
// //         </View>

// //         {!isComputerRef.current && (
// //           <TouchableOpacity
// //             style={[
// //               styles.speechBubble,
// //               { position: 'absolute', right: width * 0.1, top: '40%' },
// //               emojiDisabled && { opacity: 0.4 },
// //             ]}
// //             onPress={handleToggleReactions}
// //             activeOpacity={0.8}
// //             disabled={emojiDisabled}
// //           >
// //             <Icon name="chatbubble-ellipses" size={18} color="#fff" />
// //           </TouchableOpacity>
// //         )}
// //       </View>

// //       {/* REACTION PICKER */}
// //       {isReactionPickerOpen && (
// //         <View style={styles.reactionPanel}>
// //           {REACTIONS.map((emoji, index) => (
// //             <TouchableOpacity
// //               key={index}
// //               onPress={() => handleSelectReaction(emoji)}
// //               style={styles.reactionItem}
// //             >
// //               <Text style={styles.reactionText}>{emoji}</Text>
// //             </TouchableOpacity>
// //           ))}
// //         </View>
// //       )}

// //       {/* KEYPAD */}
// //       <View style={styles.keypadContainer}>
// //         {currentLayout.map((row, rowIndex) => (
// //           <View key={rowIndex} style={styles.keypadRow}>
// //             {row.map((item, index) => {
// //               const strItem = item.toString().toLowerCase();
// //               const isSpecial = ['clear', 'clr', '⌫', 'del', 'ref', 'pm', 'skip', '.', 'reverse'].includes(strItem);
// //               const isNa = strItem === 'na';

// //               if (isNa) return <View key={index} style={{ width: KEY_BTN_WIDTH, height: KEY_BTN_HEIGHT }} />;

// //               let keyContent;
// //               if (strItem === 'del' || strItem === '⌫') {
// //                 keyContent = <MaterialIcons name="backspace" size={22} color="#fff" />;
// //               } else if (strItem === 'ref' || strItem === 'reverse') {
// //                 keyContent = (
// //                   <Text style={[styles.keyText, { fontSize: scaleFont(14), fontWeight: '800', fontStyle: 'italic' }]}>
// //                     {t('REV')}
// //                   </Text>
// //                 );
// //               } else if (strItem === 'pm') {
// //                 keyContent = <Text style={[styles.keyText, { color: '#fff' }]}>+/-</Text>;
// //               } else if (strItem === 'clr' || strItem === 'clear') {
// //                 keyContent = <Text style={[styles.keyText, { color: '#fff' }]}>{t('Clear')}</Text>;
// //               } else if (strItem === 'skip') {
// //                 keyContent = (
// //                   <View style={{ alignItems: 'center', flexDirection: 'row' }}>
// //                     <Text style={[styles.keyText, { fontSize: scaleFont(12) }]}>{t('Skip')}</Text>
// //                     <MaterialIcons name="skip-next" size={20} color="#fff" />
// //                   </View>
// //                 );
// //               } else {
// //                 keyContent = <Text style={styles.keyText}>{item.toUpperCase()}</Text>;
// //               }

// //               return (
// //                 <TouchableOpacity
// //                   key={index}
// //                   onPress={() => handlePress(strItem === 'ref' ? 'reverse' : item)}
// //                   disabled={gameEnded}
// //                   style={[
// //                     styles.keyButton,
// //                     { borderBottomWidth: 4, borderBottomColor: 'rgba(0,0,0,0.3)' },
// //                     (isSpecial || strItem === '-') ? styles.specialKey : null,
// //                     ((strItem === 'ref' || strItem === 'reverse') && isReverse) && {
// //                       borderBottomColor: 'rgba(0,0,0,0.5)',
// //                       borderWidth: 0,
// //                       borderBottomWidth: 4,
// //                       elevation: 10,
// //                       shadowColor: theme.primaryColor || '#595CFF',
// //                       shadowOffset: { width: 0, height: 4 },
// //                       shadowOpacity: 0.5,
// //                       shadowRadius: 8,
// //                       transform: [{ scale: revScale }],
// //                     },
// //                     gameEnded && { opacity: 0.5 },
// //                   ]}
// //                 >
// //                   {(strItem === 'ref' || strItem === 'reverse') && isReverse ? (
// //                     <LinearGradient
// //                       colors={theme.buttonGradient || [theme.primaryColor || '#595CFF', theme.secondaryColor || '#87AEE9']}
// //                       style={styles.gradientButton}
// //                     >
// //                       {keyContent}
// //                     </LinearGradient>
// //                   ) : !isSpecial && strItem !== '-' ? (
// //                     <LinearGradient
// //                       colors={theme.buttonGradient || [theme.primaryColor || '#595CFF', theme.secondaryColor || '#87AEE9']}
// //                       style={styles.gradientButton}
// //                     >
// //                       {keyContent}
// //                     </LinearGradient>
// //                   ) : (
// //                     <View style={{ alignItems: 'center', justifyContent: 'center' }}>{keyContent}</View>
// //                   )}
// //                 </TouchableOpacity>
// //               );
// //             })}
// //           </View>
// //         ))}
// //       </View>

// //       {/* ================= RESULT MODAL ================= */}
// //       {showResultModal && resultData && (
// //         <View style={styles.modalOverlay}>
// //           <Animated.View
// //             style={[
// //               styles.resultCard,
// //               {
// //                 opacity: resultFadeAnim,
// //                 transform: [{ scale: resultScaleAnim }],
// //                 borderColor:
// //                   resultData.gameResult === 'win'  ? '#4ade80' :
// //                   resultData.gameResult === 'lose' ? '#f87171' : '#fbbf24',
// //               },
// //             ]}
// //           >
// //             <View style={styles.modalHeader}>
// //               <TouchableOpacity
// //                 onPress={() => console.log('Share')}
// //                 hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
// //               >
// //                 <Icon name="share-social-outline" size={24} color="#fff" />
// //               </TouchableOpacity>

// //               <TouchableOpacity
// //                 onPress={handleCloseResults}
// //                 hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
// //               >
// //                 <Icon name="close" size={28} color="#fff" />
// //               </TouchableOpacity>
// //             </View>

// //             <View style={styles.resultContent}>
// //               <View style={[
// //                 styles.resultBadge,
// //                 {
// //                   backgroundColor:
// //                     resultData.gameResult === 'win'  ? '#4ade80' :
// //                     resultData.gameResult === 'lose' ? '#f87171' : '#fbbf24',
// //                 },
// //               ]}>
// //                 <Text style={styles.resultBadgeText}>
// //                   {resultData.gameResult === 'win'  ? t('VICTORY') :
// //                    resultData.gameResult === 'lose' ? t('DEFEAT')  : t('DRAW')}
// //                 </Text>
// //               </View>

// //               <Text style={[
// //                 styles.resultTitle,
// //                 {
// //                   color:
// //                     resultData.gameResult === 'win'  ? '#4ade80' :
// //                     resultData.gameResult === 'lose' ? '#f87171' : '#fbbf24',
// //                 },
// //               ]}>
// //                 {resultData.gameResult === 'win'  ? t('You Won!') :
// //                  resultData.gameResult === 'lose' ? t('You Lost!') : t('Draw!')}
// //               </Text>

// //               {resultData.diffCode && (
// //                 <View style={styles.diffCodeBadge}>
// //                   <Text style={styles.diffCodeText}>{resultData.diffCode}</Text>
// //                 </View>
// //               )}

// //               <View style={styles.modalPlayersContainer}>
// //                 <View style={styles.modalPlayer}>
// //                   <View style={[styles.avatarCircle, { width: 60, height: 60, backgroundColor: '#4F46E5', marginBottom: 8, borderRadius: 10 }]}>
// //                     {(resultData.myProfileImage || user?.profilePic) ? (
// //                       <Image
// //                         source={{ uri: resultData.myProfileImage || user.profilePic }}
// //                         style={{ width: 60, height: 60, borderRadius: 10 }}
// //                       />
// //                     ) : (
// //                       <Text style={[styles.avatarInitial, { fontSize: 24 }]}>
// //                         {user?.username?.charAt(0).toUpperCase() || 'Y'}
// //                       </Text>
// //                     )}
// //                   </View>
// //                   <Text style={styles.modalPlayerName}>{t('You')}</Text>
// //                   <Text style={[styles.mainScore, { fontSize: 28 }]}>{resultData.totalScore}</Text>
// //                 </View>

// //                 <View style={styles.vsContainer}>
// //                   <Text style={styles.modalVsText}>{t('VS')}</Text>
// //                 </View>

// //                 <View style={styles.modalPlayer}>
// //                   <View style={[styles.avatarCircle, { width: 60, height: 60, backgroundColor: '#0F766E', marginBottom: 8, borderRadius: 10 }]}>
// //                     {resultData.opponentProfileImage ? (
// //                       <Image
// //                         source={{ uri: resultData.opponentProfileImage }}
// //                         style={{ width: 60, height: 60, borderRadius: 10 }}
// //                         onError={() => {
// //                           setResultData(prev => prev ? { ...prev, opponentProfileImage: null } : prev);
// //                         }}
// //                       />
// //                     ) : (
// //                       <Text style={[styles.avatarInitial, { fontSize: 24 }]}>
// //                         {isComputerRef.current ? '🤖' : (opponent?.username?.charAt(0).toUpperCase() || 'O')}
// //                       </Text>
// //                     )}
// //                   </View>
// //                   <Text style={styles.modalPlayerName}>{opponent?.username || (isComputerRef.current ? 'Computer' : t('Opponent'))}</Text>
// //                   <Text style={[styles.mainScore, { fontSize: 28 }]}>{resultData.opponentScore}</Text>
// //                 </View>
// //               </View>

// //               <Text style={{ fontSize: 40, marginTop: 10 }}>
// //                 {resultData.gameResult === 'win' ? '🏆' : resultData.gameResult === 'lose' ? '😥' : '🤝'}
// //               </Text>
// //             </View>

// //             <View style={styles.modalActions}>
// //               {!isComputerRef.current && rematchState === 'idle' && (
// //                 <TouchableOpacity
// //                   style={[styles.actionButton, styles.rematchButton]}
// //                   onPress={handleRematch}
// //                 >
// //                   <Text style={styles.actionButtonText}>{t('Rematch')}</Text>
// //                 </TouchableOpacity>
// //               )}

// //               {!isComputerRef.current && rematchState === 'requesting' && (
// //                 <View style={[styles.actionButton, styles.rematchButton, styles.rematchWaiting]}>
// //                   <ActivityIndicator size="small" color="#fff" style={{ marginRight: 6 }} />
// //                   <Text style={styles.actionButtonText}>{t('Waiting...')}</Text>
// //                 </View>
// //               )}

// //               {!isComputerRef.current && rematchState === 'waiting' && (
// //                 <View style={[styles.actionButton, styles.rematchButton, styles.rematchWaiting]}>
// //                   <ActivityIndicator size="small" color="#fff" style={{ marginRight: 6 }} />
// //                   <Text style={styles.actionButtonText}>{t('Starting...')}</Text>
// //                 </View>
// //               )}

// //               {!isComputerRef.current && rematchState === 'countdown' && (
// //                 <View style={[styles.actionButton, styles.rematchCountdownBtn]}>
// //                   <Text style={styles.rematchCountdownText}>
// //                     {t('Starting in')} {rematchCountdown}...
// //                   </Text>
// //                 </View>
// //               )}

// //               {!isComputerRef.current && (rematchState === 'declined' || rematchState === 'opponent_left') && (
// //                 <View style={[styles.actionButton, styles.rematchDeclinedBtn]}>
// //                   <Text style={styles.actionButtonText}>
// //                     {rematchState === 'declined' ? `❌ ${t('Declined')}` : `🚪 ${t('Left')}`}
// //                   </Text>
// //                 </View>
// //               )}

// //               <TouchableOpacity
// //                 style={[styles.actionButton, styles.newGameButton]}
// //                 onPress={handleNewGame}
// //               >
// //                 <Text style={styles.actionButtonText}>{t('New Game')}</Text>
// //               </TouchableOpacity>
// //             </View>

// //             {!isComputerRef.current && (rematchState === 'declined' || rematchState === 'opponent_left') && (
// //               <Text style={styles.rematchStatusText}>
// //                 {rematchState === 'declined'
// //                   ? t('Opponent declined the rematch.')
// //                   : t('Opponent has left the lobby.')}
// //               </Text>
// //             )}
// //           </Animated.View>
// //         </View>
// //       )}
// //     </View>
// //   );

// //   const badgeLayer = (
// //     <>
// //       {earnedBadges.length > 0 && (
// //         <BadgePopup
// //           badges={[earnedBadges[0]]}
// //           onFinish={() => setEarnedBadges((prev) => prev.slice(1))}
// //         />
// //       )}

// //       {offlineBadges.length > 0 && (
// //         <OfflineBadgesModal
// //           badges={offlineBadges}
// //           onDismiss={() => setOfflineBadges([])}
// //         />
// //       )}
// //     </>
// //   );

// //   return theme.backgroundGradient ? (
// //     <LinearGradient colors={theme.backgroundGradient} style={{ flex: 1 }}>
// //       {content}
// //       {badgeLayer}
// //     </LinearGradient>
// //   ) : (
// //     <View style={{ flex: 1, backgroundColor: theme.backgroundColor || '#0B1220' }}>
// //       {content}
// //       {badgeLayer}
// //     </View>
// //   );
// // };

// // export default MultiPlayerGame;

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
//   Image,
//   ActivityIndicator,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Icon from 'react-native-vector-icons/Ionicons';
// import {
//   useNavigation,
//   useRoute,
//   useFocusEffect,
// } from '@react-navigation/native';
// import LinearGradient from 'react-native-linear-gradient';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { useSocket } from '../context/Socket';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useTheme } from '../context/ThemeContext';
// import { useSound } from '../context/SoundContext';
// import { KEYPAD_LAYOUTS } from '../utils/keyboardLayouts';
// import { initSound, playEffect, stopEffect } from '../utils/SoundManager';
// import { useAppTranslation } from '../context/TranslationContext';
// import { useBadge } from '../context/BadgeContext';
// import { authFetch as fetch } from '../utils/authFetch';

// Text.defaultProps = Text.defaultProps || {};
// Text.defaultProps.allowFontScaling = false;

// const { width, height } = Dimensions.get('window');

// const FONT_SCALE = Math.min(PixelRatio.getFontScale(), 1.0);
// const scaleFont = size => size * FONT_SCALE;

// const KEY_BTN_WIDTH = Math.min(width * 0.2, 78);
// const KEY_BTN_HEIGHT = Math.min(height * 0.085, 68);

// const REACTIONS = ['😄', '🔥', '🎯', '😅', '👏', '💪', '⚡', '🚀'];

// const getMathSymbol = symbol => {
//   const map = {
//     Sum: '+',
//     Difference: '-',
//     Subtract: '-',
//     Product: '×',
//     Multiply: '×',
//     Quotient: '÷',
//     Divide: '÷',
//     Modulus: '%',
//     Exponent: '^',
//   };
//   return map[symbol] || symbol;
// };

// const pickRandomSymbol = (symbolString) => {
//   if (!symbolString) return 'Sum';
//   const parts = symbolString.split(',').map(s => {
//     const trimmed = s.trim();
//     return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
//   });
//   return parts[Math.floor(Math.random() * parts.length)];
// };

// function deriveDiffCode(difficulty, symbolString) {
//   const letter =
//     difficulty === 'easy' ? 'E' : difficulty === 'hard' ? 'H' : 'M';
//   const count = symbolString ? symbolString.split(',').length : 2;
//   const num = count >= 4 ? '4' : '2';
//   return `${letter}${num}`;
// }

// const MultiPlayerGame = () => {
//   const socket = useSocket();
//   const insets = useSafeAreaInsets();
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { theme, keyboardTheme } = useTheme();
//   const { isSoundOn, toggleSound } = useSound();
//   const { t } = useAppTranslation();

//   // ── Only showBadges needed — BadgePopupController handles display globally
//   const { showBadges } = useBadge();

//   const {
//     currentQuestion,
//     timer,
//     difficulty,
//     opponent,
//     myMongoId,
//     isComputer,
//     symbol,
//     diffCode: routeDiffCode,
//     selectedSymbols: routeSelectedSymbols,
//     gameRoomId: routeGameRoomId,
//     restoredMyScore,
//     restoredOpponentScore,
//     gameStartedAt: routeGameStartedAt,
//     totalGameTime: routeTotalGameTime,
//   } = route.params || {};

//   const diffCode = routeDiffCode || deriveDiffCode(difficulty, symbol);

//   const selectedSymbols = routeSelectedSymbols
//     || (symbol ? symbol.split(',').map(s => s.trim()) : ['sum', 'difference']);

//   const currentLayout = KEYPAD_LAYOUTS[keyboardTheme] || KEYPAD_LAYOUTS.type1;

//   /* ================= STATE ================= */
//   const [input, setInput] = useState('');
//   const [question, setQuestion] = useState('');
//   const [correctAnswer, setCorrectAnswer] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState(null);
//   const [isReverse, setIsReverse] = useState(false);
//   const [feedback, setFeedback] = useState(null);
//   const [awaitingResult, setAwaitingResult] = useState(false);
//   const [isConnected, setIsConnected] = useState(true);
//   const [gameEnded, setGameEnded] = useState(false);
//   const [questionIndex, setQuestionIndex] = useState(1);
//   const [bonusText, setBonusText] = useState('');

//   const [minutes, setMinutes] = useState(Math.floor((timer ?? 60) / 60));
//   const [seconds, setSeconds] = useState((timer ?? 60) % 60);
//   const [timeRemaining, setTimeRemaining] = useState((timer ?? 60) * 1000);
//   const [animateWatch] = useState(new Animated.Value(1));
//   const [isThirtySecPhase, setIsThirtySecPhase] = useState(false);
//   const [isPaused, setIsPaused] = useState(false);

//   const [score, setScore] = useState(0);
//   const [opponentScore, setOpponentScore] = useState(0);
//   const [correctAnswers, setCorrectAnswers] = useState(0);
//   const [skippedCount, setSkippedCount] = useState(0);
//   const [answerHistory, setAnswerHistory] = useState([]);
//   const [opponentHistory, setOpponentHistory] = useState([]);

//   const [opponentEmoji, setOpponentEmoji] = useState(null);
//   const [isReactionPickerOpen, setIsReactionPickerOpen] = useState(false);
//   const [emojiDisabled, setEmojiDisabled] = useState(false);

//   const [graceCountdown, setGraceCountdown] = useState(null);

//   const [showResultModal, setShowResultModal] = useState(false);
//   const [resultData, setResultData] = useState(null);
//   const [resultFadeAnim] = useState(new Animated.Value(0));
//   const [resultScaleAnim] = useState(new Animated.Value(0.8));

//   const [rematchState, setRematchState] = useState('idle');
//   const [rematchCountdown, setRematchCountdown] = useState(3);

//   const [showPostGameBadges, setShowPostGameBadges] = useState(false);
// const anchorFirstTickLoggedRef = useRef(false);
//   const resolveProfileImage = useCallback((source) => {
//     if (!source || typeof source !== 'object') return null;
//     return (
//       source?.profilePic ||
//       source?.profileImage ||
//       source?.avatar ||
//       source?.photo ||
//       null
//     );
//   }, []);

//   const initialOpponentProfileImage = resolveProfileImage(opponent);
//   const [opponentProfileImage, setOpponentProfileImage] = useState(initialOpponentProfileImage);
//   console.log('[MultiPlayerGame] opponent object:', JSON.stringify(opponent));
//   console.log('[MultiPlayerGame] seeded opponentProfileImage:', initialOpponentProfileImage);
//   const [myProfileImage, setMyProfileImage] = useState(null);

//   /* ================= REFS ================= */
//   const socketRef = useRef(null);
//   const totalTimeRef = useRef(timer ?? 60);
//   const scoreRef = useRef(0);
//   const correctAnswersRef = useRef(0);
//   const incorrectCountRef = useRef(0);
//   const skippedCountRef = useRef(0);
//   const opponentScoreRef = useRef(0);
//   const isSoundOnRef = useRef(isSoundOn);
//   const last10PlayedRef = useRef(false);
//   const appState = useRef(AppState.currentState);
//   const hasNavigatedToResultRef = useRef(false);
//   const myMongoIdRef = useRef(myMongoId);
//   const opponentMongoIdRef = useRef(opponent?.id);
//   const revScale = useRef(new Animated.Value(1)).current;
//   const emojiCooldownRef = useRef(0);
//   const graceIntervalRef = useRef(null);
//   const rematchCountdownRef = useRef(null);
//   const gameStartedHandledRef = useRef(false);
//   const isComputerRef = useRef(!!isComputer);
//   const symbolListRef = useRef(symbol);
//   const correctAnswerRef = useRef('');
//   const resultModalReadyRef = useRef(false);

//   const questionHistoryRef = useRef([]);
//   const questionStartTimeRef = useRef(Date.now());

//   const currentQuestionMetaRef = useRef({
//     symbol: currentQuestion?.symbol || 'Sum',
//     difficulty: currentQuestion?.difficulty || difficulty || 'easy',
//     qm: currentQuestion?.qm || 1,
//     finalLevel: currentQuestion?.finalLevel || 1,
//   });

//   const computerAwaitingRef = useRef(false);
//   const rematchStateRef = useRef('idle');

//   const opponentProfileImageRef = useRef(initialOpponentProfileImage);
//   const myProfileImageRef = useRef(null);

//   const gameRoomIdRef = useRef(routeGameRoomId ?? null);

//   const gameStartedAtRef = useRef(routeGameStartedAt ?? null);
//   const totalGameTimeRef = useRef(routeTotalGameTime ?? (timer ?? 60) * 1000);
//   const anchorTimerIntervalRef = useRef(null);

//   /* ================= HELPERS ================= */
//   const hasAnsweredAtLeastOne = useCallback(() => {
//     return (
//       correctAnswersRef.current +
//       incorrectCountRef.current +
//       skippedCountRef.current
//     ) >= 1;
//   }, []);

//   const resetQuestionTimer = useCallback(() => {
//     questionStartTimeRef.current = Date.now();
//   }, []);

//   const updateOpponentProfileImage = useCallback((url) => {
//     if (!url) return;
//     opponentProfileImageRef.current = url;
//     setOpponentProfileImage(url);
//   }, []);

//   const updateMyProfileImage = useCallback((url) => {
//     if (!url) return;
//     myProfileImageRef.current = url;
//     setMyProfileImage(url);
//   }, []);

//   const extractFromPlayerProfiles = useCallback((playerProfiles) => {
//     if (!playerProfiles || typeof playerProfiles !== 'object') {
//       return { myPic: null, opponentPic: null };
//     }
//     const myPic = playerProfiles[myMongoIdRef.current] ?? null;
//     const opponentPic = playerProfiles[opponentMongoIdRef.current] ?? null;
//     return { myPic, opponentPic };
//   }, []);

//   const captureGameRoomId = useCallback((data) => {
//     const id = data?.gameRoomId || data?.roomId || data?.gameRoom?.id || data?.gameRoom?._id;
//     if (id) gameRoomIdRef.current = id;
//   }, []);

//   const computeRemainingSeconds = useCallback(() => {
//     if (!gameStartedAtRef.current) return totalTimeRef.current;
//     const ms = totalGameTimeRef.current - (Date.now() - gameStartedAtRef.current);
//     return Math.ceil(ms / 1000);
//   }, []);

//   const stopAnchorTimer = useCallback(() => {
//     if (anchorTimerIntervalRef.current) {
//       clearInterval(anchorTimerIntervalRef.current);
//       anchorTimerIntervalRef.current = null;
//     }
//   }, []);

//   const startTimerFromAnchor = useCallback(() => {
//     stopAnchorTimer();

//    anchorTimerIntervalRef.current = setInterval(() => {
//       if (isPaused) return;
//       if (!anchorFirstTickLoggedRef.current) {
//         anchorFirstTickLoggedRef.current = true;
//         console.log('[DEBUG anchor-first-tick] gameStartedAt:', gameStartedAtRef.current, 'totalGameTime:', totalGameTimeRef.current, 'now:', Date.now(), 'computedRemaining:', computeRemainingSeconds());
//       }
//       const remaining = computeRemainingSeconds();
//       totalTimeRef.current = remaining;
//       setMinutes(Math.floor(Math.max(remaining, 0) / 60));
//       setSeconds(Math.max(remaining, 0) % 60);

//       if (remaining <= 10 && remaining > 0 && !last10PlayedRef.current) {
//         playEffect('ticktock', isSoundOnRef.current);
//         last10PlayedRef.current = true;
//       }

//       if (remaining <= 10 && remaining > 0) {
//         Animated.sequence([
//           Animated.timing(animateWatch, { toValue: 1.4, duration: 300, useNativeDriver: true }),
//           Animated.timing(animateWatch, { toValue: 1, duration: 300, useNativeDriver: true }),
//         ]).start();
//       }

//       if (remaining % 30 === 0 && remaining !== timer && remaining > 0) {
//         setIsThirtySecPhase(true);
//         playEffect('timer', isSoundOnRef.current);
//         Animated.sequence([
//           Animated.timing(animateWatch, { toValue: 1.4, duration: 300, useNativeDriver: true }),
//           Animated.timing(animateWatch, { toValue: 1, duration: 300, useNativeDriver: true }),
//         ]).start(() => setIsThirtySecPhase(false));
//       }

//       if (remaining <= 0) {
//         stopAnchorTimer();
//         handleTimeUp();
//       }
//     }, 1000);
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isPaused, timer, computeRemainingSeconds, animateWatch, stopAnchorTimer]);

//   /* ================= showResult ================= */
//   const showResult = useCallback(
//     data => {
//       if (hasNavigatedToResultRef.current) return;
//       hasNavigatedToResultRef.current = true;

//       setGameEnded(true);
//       stopEffect('ticktock');

//       if (graceIntervalRef.current) {
//         clearInterval(graceIntervalRef.current);
//         graceIntervalRef.current = null;
//       }

//       resultFadeAnim.setValue(0);
//       resultScaleAnim.setValue(0.8);
//       setResultData(data);
//       setShowResultModal(true);

//       setTimeout(() => {
//         Animated.parallel([
//           Animated.timing(resultFadeAnim, {
//             toValue: 1,
//             duration: 500,
//             useNativeDriver: true,
//           }),
//           Animated.spring(resultScaleAnim, {
//             toValue: 1,
//             friction: 5,
//             useNativeDriver: true,
//           }),
//         ]).start(() => {
//           resultModalReadyRef.current = true;
//           setShowPostGameBadges(true);
//         });
//       }, 50);
//     },
//     [resultFadeAnim, resultScaleAnim],
//   );

//   /* ================= buildResultData ================= */
//   const buildResultData = useCallback(
//     (overrides = {}) => {
//       const attempts = correctAnswersRef.current + incorrectCountRef.current;
//       const acc =
//         attempts > 0
//           ? Math.round((correctAnswersRef.current / attempts) * 100)
//           : 0;

//       const my = scoreRef.current;
//       const opp = opponentScoreRef.current || 0;
//       let gameResult = 'draw';
//       if (my > opp) gameResult = 'win';
//       else if (my < opp) gameResult = 'lose';

//       const history = questionHistoryRef.current;
//       console.log('🔍 Question History Length:', history.length);
//       if (history.length > 0) {
//         console.log('🔍 Sample Response:', history[0]);
//         console.log('🔍 Correct:',   history.filter(r => r.isCorrect === true).length);
//         console.log('🔍 Incorrect:', history.filter(r => r.isCorrect === false).length);
//         console.log('🔍 Skipped:',   history.filter(r => r.isCorrect === null).length);
//       }

//       return {
//         gameResult,
//         totalScore: my,
//         opponentScore: opp,
//         correctCount: correctAnswersRef.current,
//         inCorrectCount: incorrectCountRef.current,
//         skippedQuestions: skippedCountRef.current,
//         correctPercentage: acc,
//         durationSeconds: timer,
//         diffCode,
//         questionHistory: history,
//         opponentProfileImage: opponentProfileImageRef.current,
//         myProfileImage: myProfileImageRef.current,
//         ...overrides,
//       };
//     },
//     [timer, diffCode],
//   );

//   /* ================= SUBMIT ANSWER (COMPUTER MODE) ================= */
//   const submitAnswerToAPI = useCallback(async givenAnswer => {
//     try {
//       const token = await AsyncStorage.getItem('accessToken');
//       if (!token) return null;

//       const meta = currentQuestionMetaRef.current;
//       const randomSymbol = pickRandomSymbol(symbolListRef.current);

//       const payload = {
//         playerRating: user?.rating || 900,
//         currentScore: scoreRef.current,
//         givenAnswer,
//         symbol: randomSymbol,
//         qm: meta.qm || 1,
//         streak: correctAnswersRef.current,
//         question: {
//           difficulty: meta.difficulty || 'easy',
//           answer: correctAnswerRef.current,
//           finalLevel: meta.finalLevel || 1,
//         },
//       };

//       const response = await fetch(
//         'http://13.203.232.239:3000/api/question/submitAnswer',
//         {
//           method: 'POST',
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(payload),
//         },
//       );

//       const data = await response.json();

//       if (response.ok && data.nextQuestion) {
//         const q = data.nextQuestion;
//         const mSym = getMathSymbol(q.symbol);
//         const qText = `${q.input1} ${mSym} ${q.input2}`;

//         currentQuestionMetaRef.current = {
//           symbol: q.symbol || currentQuestionMetaRef.current.symbol,
//           difficulty: q.difficulty || currentQuestionMetaRef.current.difficulty,
//           qm: q.qm || currentQuestionMetaRef.current.qm,
//           finalLevel: q.finalLevel || currentQuestionMetaRef.current.finalLevel,
//         };

//         setQuestion(qText);
//         correctAnswerRef.current = String(q.answer);
//         setCorrectAnswer(String(q.answer));
//         setInput('');
//         setLoading(false);
//         setFeedback(null);
//         console.log('[submitAnswerToAPI] cleared feedback after API nextQuestion; remaining:', totalTimeRef.current);
//         setQuestionIndex(prev => prev + 1);
//         computerAwaitingRef.current = false;
//         resetQuestionTimer();

//         if (data.newlyEarned && data.newlyEarned.length > 0) {
//           showBadges(data.newlyEarned);
//         }

//         return data;
//       }

//       computerAwaitingRef.current = false;
//       return null;
//     } catch (err) {
//       console.error('submitAnswerToAPI error:', err);
//       computerAwaitingRef.current = false;
//       return null;
//     }
//   }, [user, showBadges, resetQuestionTimer]);

//   /* ================= COMPUTER AI LOGIC ================= */
//   useEffect(() => {
//     if (!isComputerRef.current) return;
//     if (gameEnded) return;
//     if (!question) return;
//     if (computerAwaitingRef.current) return;

//     const computerDelay = Math.random() * 2000 + 1000;

//     const timeout = setTimeout(async () => {
//       const isCorrect = Math.random() > 0.5;
//       const currentCorrectAnswer = correctAnswerRef.current;
//       const computerAnswer = isCorrect
//         ? currentCorrectAnswer
//         : String(Math.floor(Math.random() * 100));

//       if (isCorrect) {
//         opponentScoreRef.current += 1;
//         setOpponentScore(opponentScoreRef.current);
//       }
//       setOpponentHistory(prev => [{ isCorrect }, ...prev].slice(0, 8));

//       computerAwaitingRef.current = true;
//       await submitAnswerToAPI(computerAnswer);
//     }, computerDelay);

//     return () => clearTimeout(timeout);
//   }, [question, gameEnded, submitAnswerToAPI]);

//   /* ================= INIT FIRST QUESTION ================= */
//   useEffect(() => {
//     if (currentQuestion) {
//       const mSym = getMathSymbol(currentQuestion.symbol);
//       const qText = `${currentQuestion.input1} ${mSym} ${currentQuestion.input2}`;
//       currentQuestionMetaRef.current = {
//         symbol: currentQuestion.symbol || 'Sum',
//         difficulty: currentQuestion.difficulty || difficulty || 'easy',
//         qm: currentQuestion.qm || 1,
//         finalLevel: currentQuestion.finalLevel || 1,
//       };
//       setQuestion(qText);
//       correctAnswerRef.current = String(currentQuestion.answer);
//       setCorrectAnswer(String(currentQuestion.answer));
//       setLoading(false);
//       setQuestionIndex(1);
//       resetQuestionTimer();
//     }

//     if (restoredMyScore !== undefined) {
//       scoreRef.current = restoredMyScore;
//       setScore(restoredMyScore);
//     }
//     if (restoredOpponentScore !== undefined) {
//       opponentScoreRef.current = restoredOpponentScore;
//       setOpponentScore(restoredOpponentScore);
//     }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   /* ================= EFFECTS ================= */
//   useEffect(() => {
//     return () => {
//       if (!isComputerRef.current && socketRef.current?.connected && !hasNavigatedToResultRef.current) {
//         const history = questionHistoryRef.current;
//         const payload = hasAnsweredAtLeastOne()
//           ? { reason: 'abandon', loserId: myMongoIdRef.current, questionHistory: history }
//           : { reason: 'abort' };
//         socketRef.current.emit('game-ended', payload);
//       }
//       stopEffect('ticktock');
//       if (graceIntervalRef.current) clearInterval(graceIntervalRef.current);
//       if (rematchCountdownRef.current) clearInterval(rematchCountdownRef.current);
//       stopAnchorTimer();
//     };
//   }, [hasAnsweredAtLeastOne, stopAnchorTimer]);

//   useEffect(() => {
//     isSoundOnRef.current = isSoundOn;
//     if (!isSoundOn) {
//       stopEffect('ticktock');
//       stopEffect('timer');
//       last10PlayedRef.current = false;
//     }
//   }, [isSoundOn]);

//   useFocusEffect(
//     useCallback(() => {
//       initSound('correct', 'rightanswer.mp3');
//       initSound('incorrect', 'wronganswerr.mp3');
//       initSound('skipped', 'skip.mp3');
//       initSound('timer', 'every30second.wav');
//       initSound('ticktock', 'ticktock.mp3');
//     }, []),
//   );

//   useEffect(() => {
//     const sub = AppState.addEventListener('change', state => {
//       if (state !== 'active') {
//         stopEffect('ticktock');
//       } else if (state === 'active' && appState.current !== 'active') {
//         if (!isComputerRef.current && socketRef.current?.connected) {
//           console.log('[AppState] App foreground - requesting timer sync');
//           socketRef.current.emit('sync-timer');
//         }
//       }
//       if (state === 'active' && totalTimeRef.current <= 10 && totalTimeRef.current > 0) {
//         playEffect('ticktock', isSoundOnRef.current);
//       }
//       appState.current = state;
//     });
//     return () => sub.remove();
//   }, []);

//   useEffect(() => {
//     const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
//       if (!gameEnded) {
//         Alert.alert(
//           t('Leave Game?'),
//           t('Are you sure you want to leave? You will lose the match.'),
//           [
//             { text: t('Cancel'), style: 'cancel' },
//             { text: t('Leave'), style: 'destructive', onPress: handleGameExit },
//           ],
//         );
//         return true;
//       }
//       return false;
//     });
//     return () => backHandler.remove();
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [gameEnded]);

//   useEffect(() => {
//     if (isReverse) {
//       Animated.loop(
//         Animated.sequence([
//           Animated.timing(revScale, { toValue: 1.05, duration: 800, useNativeDriver: true }),
//           Animated.timing(revScale, { toValue: 1, duration: 800, useNativeDriver: true }),
//         ]),
//       ).start();
//     } else {
//       revScale.setValue(1);
//     }
//   }, [isReverse, revScale]);

//   useEffect(() => {
//     AsyncStorage.getItem('userData')
//       .then(stored => {
//         if (stored) {
//           const userData = JSON.parse(stored);
//           setUser(userData);
//           if (!myMongoIdRef.current) {
//             myMongoIdRef.current = userData.id || userData._id;
//           }
//           if (userData.profilePic || userData.profileImage) {
//             updateMyProfileImage(userData.profilePic || userData.profileImage);
//           }
//         }
//       })
//       .catch(console.error);
//     const opImg = resolveProfileImage(opponent);
//     if (opImg) {
//       updateOpponentProfileImage(opImg);
//     }
//   }, []);

//   /* ================= SOCKET SETUP ================= */
//   useEffect(() => {
//     if (isComputerRef.current) return;
//     if (!socket) return;

//     socketRef.current = socket;
//     if (opponent?.id) opponentMongoIdRef.current = opponent.id;

//     const originalEmit = socket.emit.bind(socket);
//     socket.emit = function(event, ...args) {
//       if (['leave-game'].includes(event)) {
//         console.log(`📤 EMITTING: ${event}`, args);
//       }
//       return originalEmit(event, ...args);
//     };

//     const handleConnect = () => {
//       setIsConnected(true);
//       console.log('🟢 Connected/Reconnected to socket — register-player handled by Socket.js');
//     };

//     const handleDisconnect = reason => {
//       console.log('Disconnected:', reason);
//       setIsConnected(false);
//     };

//     const handleConnectError = error => {
//       console.error('Connection error:', error);
//       setIsConnected(false);
//     };

//     const handleMatchFound = data => {
//       console.log('[match-found] seeding profile images early');
//       captureGameRoomId(data);
//       if (data?.myProfileImage) {
//         updateMyProfileImage(data.myProfileImage);
//       }
//       if (data?.opponent?.profileImage) {
//         updateOpponentProfileImage(data.opponent.profileImage);
//       }
//       if (Array.isArray(data?.gameRoom?.players)) {
//         const myId = myMongoIdRef.current;
//         data.gameRoom.players.forEach(p => {
//           if (p.id === myId || p._id === myId) {
//             if (p.profileImage) updateMyProfileImage(p.profileImage);
//           } else {
//             if (p.profileImage) updateOpponentProfileImage(p.profileImage);
//           }
//         });
//       }
//     };

//     const handleNewQuestion = q => {
//       captureGameRoomId(q);
//       const mSym = getMathSymbol(q.symbol);
//       const qText = `${q.input1} ${mSym} ${q.input2}`;
//       currentQuestionMetaRef.current = {
//         symbol: q.symbol || currentQuestionMetaRef.current.symbol,
//         difficulty: q.difficulty || currentQuestionMetaRef.current.difficulty,
//         qm: q.qm || currentQuestionMetaRef.current.qm,
//         finalLevel: q.finalLevel || currentQuestionMetaRef.current.finalLevel,
//       };
//       setQuestion(qText);
//       correctAnswerRef.current = String(q.answer);
//       setCorrectAnswer(String(q.answer));
//       setInput('');
//       setLoading(false);
//       setFeedback(null);
//       console.log('[new-question] clearing feedback; scores:', { score: scoreRef.current, opponentScore: opponentScoreRef.current, minutes: totalTimeRef.current });
//       setAwaitingResult(false);
//       console.log('[new-question] awaitingResult cleared');
//       setQuestionIndex(prev => prev + 1);
//       resetQuestionTimer();
//     };

//     const handleNextQuestion = data => {
//       captureGameRoomId(data);
//       const q = data.question;
//       const mSym = getMathSymbol(q.symbol);
//       const qText = `${q.input1} ${mSym} ${q.input2}`;
//       currentQuestionMetaRef.current = {
//         symbol: q.symbol || currentQuestionMetaRef.current.symbol,
//         difficulty: q.difficulty || currentQuestionMetaRef.current.difficulty,
//         qm: q.qm || currentQuestionMetaRef.current.qm,
//         finalLevel: q.finalLevel || currentQuestionMetaRef.current.finalLevel,
//       };
//       setQuestion(qText);
//       correctAnswerRef.current = String(q.answer);
//       setCorrectAnswer(String(q.answer));
//       setInput('');
//       setLoading(false);
//       setFeedback(null);
//       setAwaitingResult(false);
//       console.log('[next-question] awaitingResult cleared; questionIndex about to increment; remaining:', totalTimeRef.current);
//       setQuestionIndex(prev => prev + 1);
//       resetQuestionTimer();

//       if (data.gameState?.playerScores) {
//         const pScores = data.gameState.playerScores;
//         if (opponentMongoIdRef.current && pScores[opponentMongoIdRef.current] !== undefined) {
//           const opData = pScores[opponentMongoIdRef.current];
//           const opScore = typeof opData === 'object' ? opData.score : opData;
//           setOpponentScore(opScore);
//           opponentScoreRef.current = opScore;
//           console.log('[next-question] opponent score updated from server:', opScore);
//         }
//         if (myMongoIdRef.current && pScores[myMongoIdRef.current] !== undefined) {
//           const myData = pScores[myMongoIdRef.current];
//           const myScore = typeof myData === 'object' ? myData.score : myData;
//           if (myScore !== scoreRef.current) {
//             scoreRef.current = myScore;
//             setScore(myScore);
//             console.log('[next-question] my score synced from server:', myScore);
//           }
//         }
//       }
//     };

//     const handleOpponentScoreUpdate = data => {
//       if (data.opponentId === opponentMongoIdRef.current) {
//         setOpponentScore(data.score);
//         opponentScoreRef.current = data.score;
//         console.log('[opponent-score-update] opponentId:', data.opponentId, 'score:', data.score, 'remaining:', totalTimeRef.current);
//         if (data.history && Array.isArray(data.history)) {
//           setOpponentHistory(data.history);
//         }
//       }
//     };

//     const handleGameEnded = data => {
//       showResult(buildResultData({ winner: data?.winner }));
//     };

//     const handlePostGameStarted = data => {
//       if (hasNavigatedToResultRef.current) return;
//       if (totalTimeRef.current >= (timer ?? 60) - 2) return;
//       console.log('[post-game-started] raw data:', JSON.stringify(data, null, 2));

//       const { myPic, opponentPic } = extractFromPlayerProfiles(data?.playerProfiles);

//       if (myPic) updateMyProfileImage(myPic);
//       if (opponentPic) updateOpponentProfileImage(opponentPic);

//       showResult(buildResultData({
//         winner: data?.winner,
//         opponentProfileImage: opponentPic ?? opponentProfileImageRef.current,
//         myProfileImage: myPic ?? myProfileImageRef.current,
//       }));
//     };

//     const handleOpponentDisconnected = (data) => {
//       console.log('⚠️ handleOpponentDisconnected called', data);
//       if (hasNavigatedToResultRef.current) {
//         console.log('🛑 Already handled disconnect');
//         return;
//       }
//       console.log('⏳ Waiting for grace period or opponent-left-game event');
//     };

//     const handleGracePeriod = data => {
//       captureGameRoomId(data);
//       const countdown = data?.graceCountdown ?? 15;
//       setGraceCountdown(countdown);
//       let remaining = countdown;
//       if (graceIntervalRef.current) clearInterval(graceIntervalRef.current);
//       graceIntervalRef.current = setInterval(() => {
//         remaining -= 1;
//         setGraceCountdown(remaining);
//         if (remaining <= 0) {
//           clearInterval(graceIntervalRef.current);
//           graceIntervalRef.current = null;
//         }
//       }, 1000);
//     };

//     const handleGracePeriodExpired = (data) => {
//       if (graceIntervalRef.current) {
//         clearInterval(graceIntervalRef.current);
//         graceIntervalRef.current = null;
//       }
//       setGraceCountdown(null);
//       console.log('[grace-period-expired] raw data:', JSON.stringify(data, null, 2));

//       const { myPic, opponentPic } = extractFromPlayerProfiles(data?.playerProfiles);

//       if (myPic) updateMyProfileImage(myPic);
//       if (opponentPic) updateOpponentProfileImage(opponentPic);

//       if (!hasNavigatedToResultRef.current) {
//         showResult(buildResultData({
//           gameResult: 'win',
//           opponentDisconnected: true,
//           winner: myMongoIdRef.current,
//           opponentProfileImage: opponentPic ?? opponentProfileImageRef.current,
//           myProfileImage: myPic ?? myProfileImageRef.current,
//         }));
//       }
//     };

//     const handleOpponentReconnected = data => {
//       if (graceIntervalRef.current) {
//         clearInterval(graceIntervalRef.current);
//         graceIntervalRef.current = null;
//       }
//       setGraceCountdown(null);
//       Alert.alert(t('Reconnected'), data?.message || t('Opponent has reconnected!'));
//     };

//     const handleOpponentEmoji = data => {
//       if (data?.emoji) {
//         setOpponentEmoji(data.emoji);
//         setTimeout(() => setOpponentEmoji(null), 3000);
//       }
//     };

//     const handleEmojiInvalid = data => {
//       console.warn('Invalid emoji:', data?.message);
//     };

//     const handleEmojiRateLimited = () => {
//       setEmojiDisabled(true);
//       setTimeout(() => setEmojiDisabled(false), 2000);
//     };

//     const handleTimerSynced = (data) => {
//       if (!data) return;

//       if (typeof data.gameStartedAt === 'number' && typeof data.totalGameTime === 'number') {
//         gameStartedAtRef.current = data.gameStartedAt;
//         totalGameTimeRef.current = data.totalGameTime;
//         const remaining = computeRemainingSeconds();
//         totalTimeRef.current = remaining;
//         setMinutes(Math.floor(Math.max(remaining, 0) / 60));
//         setSeconds(Math.max(remaining, 0) % 60);
//         setTimeRemaining(totalGameTimeRef.current - (Date.now() - gameStartedAtRef.current));
//         startTimerFromAnchor();
//         console.log('[timer-synced] resynced from server anchor:', {
//           gameStartedAt: gameStartedAtRef.current,
//           totalGameTime: totalGameTimeRef.current,
//           remaining,
//         });
//       } else if (typeof data.timeRemaining === 'number') {
//         console.log('[timer-synced] no anchor fields, falling back to timeRemaining:', data.timeRemaining);
//         const serverSecondsRemaining = Math.ceil(data.timeRemaining / 1000);
//         totalTimeRef.current = serverSecondsRemaining;
//         setTimeRemaining(data.timeRemaining);
//         setMinutes(Math.floor(serverSecondsRemaining / 60));
//         setSeconds(serverSecondsRemaining % 60);
//       }

//       if (data.playerScores) {
//         const pScores = data.playerScores;
//         if (myMongoIdRef.current && pScores[myMongoIdRef.current] !== undefined) {
//           const myScore = typeof pScores[myMongoIdRef.current] === 'object'
//             ? pScores[myMongoIdRef.current].score
//             : pScores[myMongoIdRef.current];
//           scoreRef.current = myScore;
//           setScore(myScore);
//         }
//         if (opponentMongoIdRef.current && pScores[opponentMongoIdRef.current] !== undefined) {
//           const opScore = typeof pScores[opponentMongoIdRef.current] === 'object'
//             ? pScores[opponentMongoIdRef.current].score
//             : pScores[opponentMongoIdRef.current];
//           opponentScoreRef.current = opScore;
//           setOpponentScore(opScore);
//         }
//       }

//       if (data.currentQuestion) {
//         const q = data.currentQuestion;
//         const mSym = getMathSymbol(q.symbol);
//         const qText = `${q.input1} ${mSym} ${q.input2}`;
//         currentQuestionMetaRef.current = {
//           symbol: q.symbol || currentQuestionMetaRef.current.symbol,
//           difficulty: q.difficulty || currentQuestionMetaRef.current.difficulty,
//           qm: q.qm || currentQuestionMetaRef.current.qm,
//           finalLevel: q.finalLevel || currentQuestionMetaRef.current.finalLevel,
//         };
//         setQuestion(qText);
//         correctAnswerRef.current = String(q.answer);
//         setCorrectAnswer(String(q.answer));
//       }
//     };

//     const handleRematchRequested = data => {
//       if (data?.requesterId && data.requesterId === myMongoIdRef.current) {
//         console.log('[rematch-requested] ignoring — I am the requester');
//         return;
//       }
//       if (rematchStateRef.current !== 'idle') {
//         console.log('[rematch-requested] ignoring duplicate — current state:', rematchStateRef.current);
//         return;
//       }
//       rematchStateRef.current = 'pending_decision';

//       Alert.alert(
//         t('Rematch Request'),
//         `${data?.requesterName || t('Opponent')} ${t('wants a rematch!')}`,
//         [
//           {
//             text: t('Decline'),
//             style: 'cancel',
//             onPress: () => {
//               socketRef.current?.emit('decline-rematch');
//               rematchStateRef.current = 'idle';
//               setRematchState('idle');
//             },
//           },
//           {
//             text: t('Accept'),
//             onPress: () => {
//               socketRef.current?.emit('accept-rematch');
//               rematchStateRef.current = 'waiting';
//               setRematchState('waiting');
//             },
//           },
//         ],
//       );
//     };

//     const handleRematchAccepted = data => {
//       if (data?.opponent?.profileImage) {
//         updateOpponentProfileImage(data.opponent.profileImage);
//       }
//       const secs = data?.countdownSeconds ?? 3;
//       setRematchCountdown(secs);
//       rematchStateRef.current = 'countdown';
//       setRematchState('countdown');
//       let remaining = secs;
//       if (rematchCountdownRef.current) clearInterval(rematchCountdownRef.current);
//       rematchCountdownRef.current = setInterval(() => {
//         remaining -= 1;
//         setRematchCountdown(remaining);
//         if (remaining <= 0) {
//           clearInterval(rematchCountdownRef.current);
//           rematchCountdownRef.current = null;
//         }
//       }, 1000);
//     };

//     const handleRematchDeclined = () => {
//       if (rematchCountdownRef.current) clearInterval(rematchCountdownRef.current);
//       rematchStateRef.current = 'declined';
//       setRematchState('declined');
//     };

//     const handleGameStarted = data => {
//       const currentRematchState = rematchStateRef.current;
//       if (currentRematchState !== 'countdown' && currentRematchState !== 'waiting') return;
//       if (gameStartedHandledRef.current) return;
//       gameStartedHandledRef.current = true;
//       if (rematchCountdownRef.current) clearInterval(rematchCountdownRef.current);

//       const gsa = data.gameState?.gameStartedAt ?? data.gameStartedAt;
//       console.log('[DEBUG game-started] gameStartedAt:', gsa, 'now:', Date.now(), 'alreadyElapsedMs:', Date.now() - gsa);

//       navigation.replace('MultiPlayerGame', {
//         currentQuestion: data.firstQuestion || data.currentQuestion,
//         timer: data.timer ?? timer,
//         difficulty: data.difficulty ?? difficulty,
//         diffCode: data.diffCode ?? diffCode,
//         gameRoomId: data.gameRoomId || data.roomId || gameRoomIdRef.current,
//         gameStartedAt: data.gameState?.gameStartedAt ?? data.gameStartedAt,
//         totalGameTime: data.gameState?.totalGameTime ?? data.totalGameTime,
//         opponent: {
//           id: opponentMongoIdRef.current,
//           username: opponent?.username,
//           profilePic: opponentProfileImageRef.current,
//         },
//         myMongoId: myMongoIdRef.current,
//         isComputer: false,
//       });
//     };

//     const handleOpponentLeftLobby = () => {
//       rematchStateRef.current = 'opponent_left';
//       setRematchState('opponent_left');
//     };

//     const handleExitedPostGame = () => {
//       navigation.replace('BottomTab');
//     };

//     const handleLeftGame = data => {
//       console.log('👋 left-game:', data);
//       if (hasNavigatedToResultRef.current) {
//         console.log('🛑 Already navigated away, ignoring');
//         return;
//       }
//       stopEffect('ticktock');
//       totalTimeRef.current = 0;
//       Alert.alert(
//         t('Game Forfeited'),
//         data.message || t('You have left the game. You forfeit this match.'),
//         [
//           {
//             text: t('OK'),
//             onPress: () => {
//               navigation.replace('BottomTab');
//             },
//           },
//         ],
//       );
//     };

//     const handleOpponentLeftGame = data => {
//       console.log('🏆 opponent-left-game received:', data);
//       if (hasNavigatedToResultRef.current) {
//         console.log('🛑 Already navigated to results, ignoring');
//         return;
//       }
//       console.log('✅ Processing opponent left game...');
//       stopEffect('ticktock');
//       totalTimeRef.current = 0;
//       if (graceIntervalRef.current) {
//         clearInterval(graceIntervalRef.current);
//         graceIntervalRef.current = null;
//       }
//       setGraceCountdown(null);

//       const { myPic, opponentPic } = extractFromPlayerProfiles(data?.playerProfiles);
//       if (myPic) {
//         console.log('📸 Updating my profile image');
//         updateMyProfileImage(myPic);
//       }
//       if (opponentPic) {
//         console.log('📸 Updating opponent profile image');
//         updateOpponentProfileImage(opponentPic);
//       }

//       const resultData = buildResultData({
//         winner: myMongoIdRef.current,
//         opponentLeft: true,
//         gameResults: data?.gameResults,
//         gameResult: 'win',
//         opponentProfileImage: opponentPic ?? opponentProfileImageRef.current,
//         myProfileImage: myPic ?? myProfileImageRef.current,
//       });
//       console.log('📊 Result data prepared for opponent-left-game. Calling showResult...');
//       showResult(resultData);
//     };

//     const handleGameAbortedNoStart = (data) => {
//       console.log('🚫 game-aborted-no-start received:', data);
//       if (hasNavigatedToResultRef.current) {
//         console.log('🛑 Already navigated away, ignoring abort');
//         return;
//       }
//       hasNavigatedToResultRef.current = true;
//       stopEffect('ticktock');
//       setGameEnded(true);
//       Alert.alert(
//         t('Game Aborted'),
//         data?.message || t('Game aborted. No player answered within 15 seconds. No rating change.'),
//         [
//           {
//             text: t('OK'),
//             onPress: () => {
//               navigation.replace('BottomTab');
//             },
//           },
//         ],
//       );
//     };

//     const handleRejoinGame = (data) => {
//       console.log('🔄 rejoin-game received in stale MultiPlayerGame — Lobby handles this, ignoring');
//     };

//     const handleGameReconnected = (data) => {
//       console.log('✅ game-reconnected in stale MultiPlayerGame — Lobby is handling navigation, ignoring');
//     };

//     const handleReconnectFailed = (data) => {
//       console.log('❌ reconnect-failed - grace period expired');
//       if (hasNavigatedToResultRef.current) {
//         console.log('🛑 Already navigated away, ignoring reconnect-failed');
//         return;
//       }
//       hasNavigatedToResultRef.current = true;
//       stopEffect('ticktock');
//       setGameEnded(true);
//       Alert.alert(
//         t('Reconnection Failed'),
//         data?.message || t('Grace period expired. Game has ended. Returning to home.'),
//         [
//           {
//             text: t('OK'),
//             onPress: () => {
//               navigation.replace('BottomTab');
//             },
//           },
//         ],
//       );
//     };

//     const handleError = data => {
//       console.error('Socket error:', data);
//     };

//     socket.on('connect', handleConnect);
//     socket.on('disconnect', handleDisconnect);
//     socket.on('connect_error', handleConnectError);
//     socket.on('match-found', handleMatchFound);
//     socket.on('new-question', handleNewQuestion);
//     socket.on('next-question', handleNextQuestion);
//     socket.on('opponent-score-update', handleOpponentScoreUpdate);
//     socket.on('game-ended', handleGameEnded);
//     socket.on('post-game-started', handlePostGameStarted);
//     socket.on('opponent-disconnected', handleOpponentDisconnected);
//     socket.on('opponent-emoji-received', handleOpponentEmoji);
//     socket.on('emoji-invalid', handleEmojiInvalid);
//     socket.on('emoji-rate-limited', handleEmojiRateLimited);
//     socket.on('game-in-grace-period', handleGracePeriod);
//     socket.on('grace-period-expired', handleGracePeriodExpired);
//     socket.on('opponent-reconnected', handleOpponentReconnected);
//     socket.on('timer-synced', handleTimerSynced);
//     socket.on('game-aborted-no-start', handleGameAbortedNoStart);
//     socket.on('rejoin-game', handleRejoinGame);
//     socket.on('game-reconnected', handleGameReconnected);
//     socket.on('reconnect-failed', handleReconnectFailed);
//     socket.on('rematch-requested', handleRematchRequested);
//     socket.on('rematch-accepted', handleRematchAccepted);
//     socket.on('rematch-declined', handleRematchDeclined);
//     socket.on('game-started', handleGameStarted);
//     socket.on('opponent-left-lobby', handleOpponentLeftLobby);
//     socket.on('exited-post-game', handleExitedPostGame);
//     socket.on('left-game', handleLeftGame);
//     socket.on('opponent-left-game', handleOpponentLeftGame);
//     socket.on('error', handleError);

//     return () => {
//       socket.off('connect', handleConnect);
//       socket.off('disconnect', handleDisconnect);
//       socket.off('connect_error', handleConnectError);
//       socket.off('match-found', handleMatchFound);
//       socket.off('new-question', handleNewQuestion);
//       socket.off('next-question', handleNextQuestion);
//       socket.off('opponent-score-update', handleOpponentScoreUpdate);
//       socket.off('game-ended', handleGameEnded);
//       socket.off('post-game-started', handlePostGameStarted);
//       socket.off('opponent-disconnected', handleOpponentDisconnected);
//       socket.off('opponent-emoji-received', handleOpponentEmoji);
//       socket.off('emoji-invalid', handleEmojiInvalid);
//       socket.off('emoji-rate-limited', handleEmojiRateLimited);
//       socket.off('game-in-grace-period', handleGracePeriod);
//       socket.off('grace-period-expired', handleGracePeriodExpired);
//       socket.off('opponent-reconnected', handleOpponentReconnected);
//       socket.off('timer-synced', handleTimerSynced);
//       socket.off('game-aborted-no-start', handleGameAbortedNoStart);
//       socket.off('rejoin-game', handleRejoinGame);
//       socket.off('game-reconnected', handleGameReconnected);
//       socket.off('reconnect-failed', handleReconnectFailed);
//       socket.off('rematch-requested', handleRematchRequested);
//       socket.off('rematch-accepted', handleRematchAccepted);
//       socket.off('rematch-declined', handleRematchDeclined);
//       socket.off('game-started', handleGameStarted);
//       socket.off('opponent-left-lobby', handleOpponentLeftLobby);
//       socket.off('exited-post-game', handleExitedPostGame);
//       socket.off('left-game', handleLeftGame);
//       socket.off('opponent-left-game', handleOpponentLeftGame);
//       socket.off('error', handleError);
//     };
//   }, [
//     socket,
//     opponent,
//     difficulty,
//     timer,
//     navigation,
//     showResult,
//     buildResultData,
//     showBadges,
//     diffCode,
//     resetQuestionTimer,
//     extractFromPlayerProfiles,
//     updateMyProfileImage,
//     updateOpponentProfileImage,
//     captureGameRoomId,
//     computeRemainingSeconds,
//     startTimerFromAnchor,
//   ]);

//   /* ================= TIMER ================= */
//   useEffect(() => {
//     if (gameEnded) return;

//     if (!isComputerRef.current && gameStartedAtRef.current) {
//       startTimerFromAnchor();
//       return () => stopAnchorTimer();
//     }

//     const interval = setInterval(() => {
//       if (!isPaused) {
//         totalTimeRef.current -= 1;
//         const remaining = totalTimeRef.current;
//         setMinutes(Math.floor(remaining / 60));
//         setSeconds(remaining % 60);
//         if (remaining === 60) {
//           console.log('[timer] hit 60 seconds remaining (1 minute). state snapshot:', {
//             remaining,
//             minutes: Math.floor(remaining / 60),
//             seconds: remaining % 60,
//             score: scoreRef.current,
//             opponentScore: opponentScoreRef.current,
//             feedback,
//             awaitingResult,
//           });
//         }
//         if (remaining < 60 && remaining >= 0) {
//           console.log('[timer] <60s remaining:', { remaining, minutes: Math.floor(remaining / 60), seconds: remaining % 60 });
//         }

//         if (remaining <= 10 && remaining > 0 && !last10PlayedRef.current) {
//           playEffect('ticktock', isSoundOnRef.current);
//           last10PlayedRef.current = true;
//         }

//         if (remaining <= 10 && remaining > 0) {
//           Animated.sequence([
//             Animated.timing(animateWatch, { toValue: 1.4, duration: 300, useNativeDriver: true }),
//             Animated.timing(animateWatch, { toValue: 1, duration: 300, useNativeDriver: true }),
//           ]).start();
//         }

//         if (remaining % 30 === 0 && remaining !== timer && remaining > 0) {
//           setIsThirtySecPhase(true);
//           playEffect('timer', isSoundOnRef.current);
//           Animated.sequence([
//             Animated.timing(animateWatch, { toValue: 1.4, duration: 300, useNativeDriver: true }),
//             Animated.timing(animateWatch, { toValue: 1, duration: 300, useNativeDriver: true }),
//           ]).start(() => setIsThirtySecPhase(false));
//         }

//         if (remaining <= 0) {
//           clearInterval(interval);
//           handleTimeUp();
//         }
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isPaused, timer, gameEnded, startTimerFromAnchor, stopAnchorTimer]);

//   /* ================= HANDLERS ================= */
//   const handleTimeUp = useCallback(() => {
//     if (!isComputerRef.current && socketRef.current?.connected) {
//       socketRef.current.emit('game-ended', {
//         reason: 'timeout',
//         questionHistory: questionHistoryRef.current,
//       });
//     }
//     showResult(buildResultData());
//   }, [showResult, buildResultData]);

//   const handleGameExit = useCallback(() => {
//     stopEffect('ticktock');
//     hasNavigatedToResultRef.current = true;
//     setGameEnded(true);

//     if (!isComputerRef.current && socketRef.current?.connected) {
//       console.log('🚪 Player exiting - emitting leave-game');
//       socketRef.current.emit('leave-game');
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

//   const handleToggleReactions = () => {
//     if (!emojiDisabled) {
//       setIsReactionPickerOpen(prev => !prev);
//     }
//   };

//   const handleSelectReaction = emoji => {
//     setIsReactionPickerOpen(false);
//     if (!REACTIONS.includes(emoji)) return;
//     const now = Date.now();
//     if (now - emojiCooldownRef.current < 2000) return;
//     if (isComputerRef.current) return;
//     if (!socketRef.current?.connected) return;
//     socketRef.current.emit('send-emoji', { emoji });
//     emojiCooldownRef.current = now;
//     setEmojiDisabled(true);
//     setTimeout(() => setEmojiDisabled(false), 2000);
//   };

//   const handleRematch = () => {
//     if (isComputerRef.current) {
//       handleNewGame();
//       return;
//     }
//     if (!socketRef.current?.connected) {
//       Alert.alert(t('Error'), t('Not connected to server.'));
//       return;
//     }
//     socketRef.current.emit('request-rematch');
//     rematchStateRef.current = 'requesting';
//     setRematchState('requesting');
//   };

//   const handleNewGame = () => {
//     if (!isComputerRef.current) {
//       socketRef.current?.emit('exit-post-game');
//     }
//     navigation.navigate('ChallengeScreen');
//   };

//   const handleCloseResults = () => {
//     if (!isComputerRef.current) {
//       socketRef.current?.emit('exit-post-game');
//     }
//     navigation.navigate('BottomTab');
//   };
// const handleViewAnalysis = () => {
//   navigation.navigate('GameAnalysisScreen', {
//     questionHistory: resultData?.questionHistory || questionHistoryRef.current,
//     myScore: resultData?.totalScore,
//     opponentScore: resultData?.opponentScore,
//     diffCode: resultData?.diffCode,
//   });
// };
//   /* ================= HANDLE PRESS (answer submission) ================= */
//   const handlePress = async value => {
//     if (loading || awaitingResult || totalTimeRef.current <= 0 || feedback || gameEnded) return;

//     const key = value.toString().toLowerCase();

//     if (key === 'clear' || key === 'clr') return setInput('');
//     if (key === '⌫' || key === 'del') return setInput(prev => prev.slice(0, -1));
//     if (key === 'reverse' || key === 'rev') return setIsReverse(prev => !prev);
//     if (key === 'pm') {
//       return setInput(prev => (prev.startsWith('-') ? prev.slice(1) : '-' + prev));
//     }

//     if (key === 'skip') {
//       const timeSpent = Date.now() - questionStartTimeRef.current;
//       skippedCountRef.current += 1;
//       setSkippedCount(skippedCountRef.current);
//       setFeedback('skipped');
//       playEffect('skipped', isSoundOnRef.current);
//       setAnswerHistory(prev => [{ isCorrect: null }, ...prev].slice(0, 8));
//       questionHistoryRef.current.push({
//         isCorrect: null,
//         timeSpent,
//         answer: null,
//       });
//       if (!isComputerRef.current) {
//         socketRef.current?.emit('submit-answer', {
//           answer: null,
//           playerId: myMongoIdRef.current,
//           timeSpent,
//           skipped: true,
//         });
//       }
//       setTimeout(() => setFeedback(null), 900);
//       return;
//     }

//     const newInput = isReverse ? value + input : input + value;
//     setInput(newInput);

//     const currentCorrect = correctAnswerRef.current;
//     const answerIsBlank = currentCorrect === '' || currentCorrect === null || currentCorrect === undefined;

//     if (answerIsBlank || newInput.length >= currentCorrect.length) {
//       const timeSpent = Date.now() - questionStartTimeRef.current;
//       const isCorrect = !answerIsBlank && newInput === currentCorrect;
//       setFeedback(isCorrect ? 'correct' : 'incorrect');
//       console.log('[handlePress] answer submitted:', { newInput, isCorrect, remaining: totalTimeRef.current });
//       playEffect(isCorrect ? 'correct' : 'incorrect', isSoundOnRef.current);
//       setAnswerHistory(prev => [{ isCorrect }, ...prev].slice(0, 8));
//       questionHistoryRef.current.push({
//         isCorrect,
//         timeSpent,
//         answer: newInput,
//       });

//       if (isCorrect) {
//         setBonusText('+4 Bonus');
//         scoreRef.current += 1;
//         setScore(scoreRef.current);
//         console.log('[handlePress] incremented score ->', scoreRef.current);
//         correctAnswersRef.current += 1;
//         setCorrectAnswers(correctAnswersRef.current);
//       } else {
//         setBonusText('');
//         incorrectCountRef.current += 1;
//       }

//       if (!isComputerRef.current) {
//         socketRef.current?.emit('submit-answer', {
//           answer: newInput,
//           playerId: myMongoIdRef.current,
//           timeSpent,
//         });
//         setAwaitingResult(true);
//         console.log('[handlePress] awaiting result set true; remaining:', totalTimeRef.current);
//         setTimeout(() => {
//           setAwaitingResult(false);
//           setFeedback(null);
//           setBonusText('');
//           console.log('[handlePress] awaiting result cleared by timeout; remaining:', totalTimeRef.current);
//         }, 5000);
//       } else {
//         setAwaitingResult(true);
//         const result = await submitAnswerToAPI(newInput);
//         setAwaitingResult(false);
//         setFeedback(null);
//         setBonusText('');
//         if (!result) {
//           console.error('Failed to get next question from API');
//         }
//       }
//     }
//   };

//   /* ================= RENDER ================= */
//   const content = (
//     <View style={[styles.container, { paddingTop: insets.top + 30 }]}>

//       {/* TOP BAR */}
//       <View style={[styles.topBar, { backgroundColor: theme.cardBackground || '#1E293B' }]}>
//         <TouchableOpacity
//           onPress={() => {
//             if (!gameEnded) {
//               Alert.alert(
//                 t('Leave Game?'),
//                 t('Are you sure you want to leave? You will lose the match.'),
//                 [
//                   { text: t('Cancel'), style: 'cancel' },
//                   { text: t('Leave'), style: 'destructive', onPress: handleGameExit },
//                 ],
//               );
//             } else {
//               stopEffect('ticktock');
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
//                 tintColor: minutes * 60 + seconds <= 10 || isThirtySecPhase ? 'red' : '#fff',
//               },
//             ]}
//           />
//           <Text style={styles.timerText}>{`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}</Text>
//         </View>

//         <TouchableOpacity onPress={handleToggleSound} style={styles.iconButton1}>
//           <Icon name={isSoundOn ? 'volume-high' : 'volume-mute'} size={24} color="#fff" />
//         </TouchableOpacity>
//       </View>

//       {/* OPPONENT HEADER */}
//       <View style={styles.opponentHeader}>
//         <View style={styles.headerLeft}>
//           <View style={styles.opponentAvatarContainer}>
//             <View style={[styles.avatarCircle, { backgroundColor: '#0F766E', width: 40, height: 40, borderRadius: 8 }]}>
//               {opponentProfileImage ? (
//                 <Image
//                   source={{ uri: opponentProfileImage }}
//                   style={{ width: 40, height: 40, borderRadius: 8 }}
//                   onError={() => setOpponentProfileImage(null)}
//                 />
//               ) : (
//                 <Text style={styles.avatarInitial}>
//                   {opponent?.username?.charAt(0).toUpperCase() || (isComputerRef.current ? '🤖' : 'O')}
//                 </Text>
//               )}
//             </View>
//             {!isComputerRef.current && <View style={styles.onlineDot} />}

//             {opponentEmoji && (
//               <View style={styles.opponentEmojiBubble}>
//                 <Text style={{ fontSize: 20 }}>{opponentEmoji}</Text>
//               </View>
//             )}

//             {graceCountdown !== null && (
//               <View style={styles.graceCountdownBubble}>
//                 <Text style={styles.graceCountdownText}>⏳{graceCountdown}s</Text>
//               </View>
//             )}
//           </View>

//           <View style={styles.opponentInfo}>
//             <Text style={styles.opponentName} numberOfLines={1}>
//               {opponent?.username || (isComputerRef.current ? 'Computer 🤖' : t('Opponent'))}
//             </Text>
//             {graceCountdown !== null && (
//               <Text style={styles.reconnectingText}>{t('Waiting to reconnect...')}</Text>
//             )}
//             <View style={styles.historyContainer}>
//               <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.historyScrollContent}>
//                 {opponentHistory.map((item, index) => {
//                   const isRight = typeof item === 'object' && item !== null ? item.isCorrect : item;
//                   return (
//                     <Icon
//                       key={index}
//                       name={isRight ? 'checkmark' : 'close'}
//                       size={16}
//                       color={isRight ? '#10B981' : '#EF4444'}
//                       style={{ marginRight: 4 }}
//                     />
//                   );
//                 })}
//               </ScrollView>
//             </View>
//           </View>
//         </View>

//         <View style={styles.headerRight}>
//           <Text style={styles.scoreLabel}>{t('Pts')}</Text>
//           <Text style={styles.scoreValue}>{opponentScore}</Text>
//         </View>
//       </View>

//       {/* Disconnected banner */}
//       {!isComputerRef.current && !isConnected && (
//         <View style={styles.disconnectedBanner}>
//           <Text style={styles.disconnectedText}>⚠️ {t('Reconnecting...')}</Text>
//         </View>
//       )}

//       {/* MY DATA */}
//       <View style={styles.myDataContainer}>
//         <View style={styles.headerLeft}>
//           <View style={styles.opponentAvatarContainer}>
//             <View style={[styles.avatarCircle, { width: 42, height: 42, backgroundColor: '#4F46E5', borderRadius: 8 }]}>
//               {(myProfileImage || user?.profilePic) ? (
//                 <Image
//                   source={{ uri: myProfileImage || user.profilePic }}
//                   style={{ width: 42, height: 42, borderRadius: 8 }}
//                 />
//               ) : (
//                 <Text style={styles.avatarInitial}>{user?.username?.charAt(0).toUpperCase() || 'Y'}</Text>
//               )}
//             </View>
//             <View style={styles.youBadge}>
//               <Text style={styles.youBadgeText}>{t('YOU')}</Text>
//             </View>
//           </View>

//           <View style={styles.opponentInfo}>
//             <Text style={styles.playerName} numberOfLines={1}>
//               {user?.username || t('You')}
//             </Text>
//             <View style={styles.historyContainer}>
//               <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.historyScrollContent}>
//                 {answerHistory.map((item, index) => (
//                   <Icon
//                     key={index}
//                     name={item.isCorrect === null ? 'close' : item.isCorrect ? 'checkmark' : 'close'}
//                     size={16}
//                     color={item.isCorrect === null ? '#FF6B6B' : item.isCorrect ? '#10B981' : '#EF4444'}
//                     style={{ marginRight: 4 }}
//                   />
//                 ))}
//               </ScrollView>
//             </View>
//           </View>
//         </View>

//         <View style={styles.headerRight}>
//           <Text style={styles.scoreLabel}>{t('Pts')}</Text>
//           <Text style={styles.scoreValue}>{score}</Text>
//         </View>
//       </View>

//       {/* QUESTION AREA */}
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
//         <Text style={styles.question}>{loading ? t('Loading...') : question}</Text>

//         <View style={[
//           styles.answerBox,
//           { backgroundColor: theme.cardBackground || '#1E293B' },
//           feedback === 'correct'   ? { borderColor: 'green',  borderWidth: 2 } :
//           feedback === 'incorrect' ? { borderColor: 'red',    borderWidth: 2 } :
//           feedback === 'skipped'   ? { borderColor: 'orange', borderWidth: 2 } : {},
//         ]}>
//           <Text style={[
//             styles.answerText,
//             feedback === 'correct'   ? { color: 'green'  } :
//             feedback === 'incorrect' ? { color: 'red'    } :
//             feedback === 'skipped'   ? { color: 'orange' } : {},
//           ]}>
//             {input || (
//               feedback === 'correct'   ? t('Correct')   :
//               feedback === 'incorrect' ? t('Incorrect') :
//               feedback === 'skipped'   ? t('Skipped')   :
//               ''
//             )}
//           </Text>
//         </View>

//         {!isComputerRef.current && (
//           <TouchableOpacity
//             style={[
//               styles.speechBubble,
//               { position: 'absolute', right: width * 0.1, top: '40%' },
//               emojiDisabled && { opacity: 0.4 },
//             ]}
//             onPress={handleToggleReactions}
//             activeOpacity={0.8}
//             disabled={emojiDisabled}
//           >
//             <Icon name="chatbubble-ellipses" size={18} color="#fff" />
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* REACTION PICKER */}
//       {isReactionPickerOpen && (
//         <View style={styles.reactionPanel}>
//           {REACTIONS.map((emoji, index) => (
//             <TouchableOpacity
//               key={index}
//               onPress={() => handleSelectReaction(emoji)}
//               style={styles.reactionItem}
//             >
//               <Text style={styles.reactionText}>{emoji}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       )}

//       {/* KEYPAD */}
//       <View style={styles.keypadContainer}>
//         {currentLayout.map((row, rowIndex) => (
//           <View key={rowIndex} style={styles.keypadRow}>
//             {row.map((item, index) => {
//               const strItem = item.toString().toLowerCase();
//               const isSpecial = ['clear', 'clr', '⌫', 'del', 'ref', 'pm', 'skip', '.', 'reverse'].includes(strItem);
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
//               } else {
//                 keyContent = <Text style={styles.keyText}>{item.toUpperCase()}</Text>;
//               }

//               return (
//                 <TouchableOpacity
//                   key={index}
//                   onPress={() => handlePress(strItem === 'ref' ? 'reverse' : item)}
//                   disabled={gameEnded}
//                   style={[
//                     styles.keyButton,
//                     { borderBottomWidth: 4, borderBottomColor: 'rgba(0,0,0,0.3)' },
//                     (isSpecial || strItem === '-') ? styles.specialKey : null,
//                     ((strItem === 'ref' || strItem === 'reverse') && isReverse) && {
//                       borderBottomColor: 'rgba(0,0,0,0.5)',
//                       borderWidth: 0,
//                       borderBottomWidth: 4,
//                       elevation: 10,
//                       shadowColor: theme.primaryColor || '#595CFF',
//                       shadowOffset: { width: 0, height: 4 },
//                       shadowOpacity: 0.5,
//                       shadowRadius: 8,
//                       transform: [{ scale: revScale }],
//                     },
//                     gameEnded && { opacity: 0.5 },
//                   ]}
//                 >
//                   {(strItem === 'ref' || strItem === 'reverse') && isReverse ? (
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

//       {/* ================= RESULT MODAL ================= */}
//       {showResultModal && resultData && (
//         <View style={styles.modalOverlay}>
//           <Animated.View
//             style={[
//               styles.resultCard,
//               {
//                 opacity: resultFadeAnim,
//                 transform: [{ scale: resultScaleAnim }],
//                 borderColor:
//                   resultData.gameResult === 'win'  ? '#4ade80' :
//                   resultData.gameResult === 'lose' ? '#f87171' : '#fbbf24',
//               },
//             ]}
//           >
//             <View style={styles.modalHeader}>
//               <TouchableOpacity
//                 onPress={() => console.log('Share')}
//                 hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
//               >
//                 <Icon name="share-social-outline" size={24} color="#fff" />
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={handleCloseResults}
//                 hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
//               >
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
//                 {resultData.gameResult === 'win'  ? t('You Won!') :
//                  resultData.gameResult === 'lose' ? t('You Lost!') : t('Draw!')}
//               </Text>

//               {resultData.diffCode && (
//                 <View style={styles.diffCodeBadge}>
//                   <Text style={styles.diffCodeText}>{resultData.diffCode}</Text>
//                 </View>
//               )}

//               <View style={styles.modalPlayersContainer}>
//                 <View style={styles.modalPlayer}>
//                   <View style={[styles.avatarCircle, { width: 60, height: 60, backgroundColor: '#4F46E5', marginBottom: 8, borderRadius: 10 }]}>
//                     {(resultData.myProfileImage || user?.profilePic) ? (
//                       <Image
//                         source={{ uri: resultData.myProfileImage || user.profilePic }}
//                         style={{ width: 60, height: 60, borderRadius: 10 }}
//                       />
//                     ) : (
//                       <Text style={[styles.avatarInitial, { fontSize: 24 }]}>
//                         {user?.username?.charAt(0).toUpperCase() || 'Y'}
//                       </Text>
//                     )}
//                   </View>
//                   <Text style={styles.modalPlayerName}>{t('You')}</Text>
//                   <Text style={[styles.mainScore, { fontSize: 28 }]}>{resultData.totalScore}</Text>
//                 </View>

//                 <View style={styles.vsContainer}>
//                   <Text style={styles.modalVsText}>{t('VS')}</Text>
//                 </View>

//                 <View style={styles.modalPlayer}>
//                   <View style={[styles.avatarCircle, { width: 60, height: 60, backgroundColor: '#0F766E', marginBottom: 8, borderRadius: 10 }]}>
//                     {resultData.opponentProfileImage ? (
//                       <Image
//                         source={{ uri: resultData.opponentProfileImage }}
//                         style={{ width: 60, height: 60, borderRadius: 10 }}
//                         onError={() => {
//                           setResultData(prev => prev ? { ...prev, opponentProfileImage: null } : prev);
//                         }}
//                       />
//                     ) : (
//                       <Text style={[styles.avatarInitial, { fontSize: 24 }]}>
//                         {isComputerRef.current ? '🤖' : (opponent?.username?.charAt(0).toUpperCase() || 'O')}
//                       </Text>
//                     )}
//                   </View>
//                   <Text style={styles.modalPlayerName}>{opponent?.username || (isComputerRef.current ? 'Computer' : t('Opponent'))}</Text>
//                   <Text style={[styles.mainScore, { fontSize: 28 }]}>{resultData.opponentScore}</Text>
//                 </View>
//               </View>

//               <Text style={{ fontSize: 40, marginTop: 10 }}>
//                 {resultData.gameResult === 'win' ? '🏆' : resultData.gameResult === 'lose' ? '😥' : '🤝'}
//               </Text>
//             </View>
// {/* ANALYSIS BUTTON */}
// {/* ANALYSIS BUTTON */}
// <TouchableOpacity
//   style={{
//     backgroundColor: '#334155',
//     width: '100%',
//     marginBottom: 1,
//     marginTop: 12,
//     paddingVertical: 12,
//     borderRadius: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   }}
//   onPress={handleViewAnalysis}
//   activeOpacity={0.8}
// >
//   <Icon name="search" size={18} color="#fff" style={{ marginRight: 6 }} />
//   <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
//     View Analysis
//   </Text>
// </TouchableOpacity>


//             <View style={styles.modalActions}>
//               {!isComputerRef.current && rematchState === 'idle' && (
//                 <TouchableOpacity
//                   style={[styles.actionButton, styles.rematchButton]}
//                   onPress={handleRematch}
//                 >
//                   <Text style={styles.actionButtonText}>{t('Rematch')}</Text>
//                 </TouchableOpacity>
//               )}

//               {!isComputerRef.current && rematchState === 'requesting' && (
//                 <View style={[styles.actionButton, styles.rematchButton, styles.rematchWaiting]}>
//                   <ActivityIndicator size="small" color="#fff" style={{ marginRight: 6 }} />
//                   <Text style={styles.actionButtonText}>{t('Waiting...')}</Text>
//                 </View>
//               )}

//               {!isComputerRef.current && rematchState === 'waiting' && (
//                 <View style={[styles.actionButton, styles.rematchButton, styles.rematchWaiting]}>
//                   <ActivityIndicator size="small" color="#fff" style={{ marginRight: 6 }} />
//                   <Text style={styles.actionButtonText}>{t('Starting...')}</Text>
//                 </View>
//               )}

//               {!isComputerRef.current && rematchState === 'countdown' && (
//                 <View style={[styles.actionButton, styles.rematchCountdownBtn]}>
//                   <Text style={styles.rematchCountdownText}>
//                     {t('Starting in')} {rematchCountdown}...
//                   </Text>
//                 </View>
//               )}

//               {!isComputerRef.current && (rematchState === 'declined' || rematchState === 'opponent_left') && (
//                 <View style={[styles.actionButton, styles.rematchDeclinedBtn]}>
//                   <Text style={styles.actionButtonText}>
//                     {rematchState === 'declined' ? `❌ ${t('Declined')}` : `🚪 ${t('Left')}`}
//                   </Text>
//                 </View>
//               )}

//               <TouchableOpacity
//                 style={[styles.actionButton, styles.newGameButton]}
//                 onPress={handleNewGame}
//               >
//                 <Text style={styles.actionButtonText}>{t('New Game')}</Text>
//               </TouchableOpacity>
//             </View>

//             {!isComputerRef.current && (rematchState === 'declined' || rematchState === 'opponent_left') && (
//               <Text style={styles.rematchStatusText}>
//                 {rematchState === 'declined'
//                   ? t('Opponent declined the rematch.')
//                   : t('Opponent has left the lobby.')}
//               </Text>
//             )}
//           </Animated.View>
//         </View>
//       )}
//     </View>
//   );

//   return theme.backgroundGradient ? (
//     <LinearGradient colors={theme.backgroundGradient} style={{ flex: 1 }}>
//       {content}
//     </LinearGradient>
//   ) : (
//     <View style={{ flex: 1, backgroundColor: theme.backgroundColor || '#0B1220' }}>
//       {content}
//     </View>
//   );
// };

// export default MultiPlayerGame;


// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   topBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: width * 0.04,
//     borderBottomEndRadius: 15,
//     borderBottomStartRadius: 15,
//     height: 60,
//   },
//   iconButton: {
//     width: width * 0.35,
//     height: 48,
//     justifyContent: 'center',
//     alignItems: 'flex-start',
//   },
//   iconButton1: {
//     width: width * 0.35,
//     height: 48,
//     justifyContent: 'center',
//     alignItems: 'flex-end',
//   },
//   timerContainer: { flexDirection: 'row', alignItems: 'center', gap: 5 },
//   timerText: { color: '#fff', fontSize: scaleFont(13), fontWeight: '600', opacity: 0.7 },
//   timerIcon: { width: 18, height: 18 },
//   opponentHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginHorizontal: width * 0.04,
//     marginTop: height * 0.01,
//     padding: 10,
//   },
//   headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
//   opponentAvatarContainer: { position: 'relative' },
//   onlineDot: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     backgroundColor: '#10B981',
//     borderWidth: 2,
//     borderColor: '#fff',
//   },
//   opponentEmojiBubble: {
//     position: 'absolute',
//     top: -24,
//     left: -4,
//     backgroundColor: 'rgba(0,0,0,0.8)',
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 10,
//     zIndex: 10,
//   },
//   graceCountdownBubble: {
//     position: 'absolute',
//     bottom: -20,
//     left: -4,
//     backgroundColor: '#F59E0B',
//     paddingHorizontal: 5,
//     paddingVertical: 2,
//     borderRadius: 6,
//     zIndex: 10,
//   },
//   graceCountdownText: { fontSize: scaleFont(9), color: '#000', fontWeight: '900' },
//   opponentInfo: { flex: 1, justifyContent: 'center' },
//   opponentName: { fontSize: scaleFont(14), fontWeight: 'bold', color: '#fff', marginBottom: 2 },
//   reconnectingText: { fontSize: scaleFont(10), color: '#F59E0B', marginBottom: 2 },
//   historyContainer: { height: 20, width: '100%' },
//   historyScrollContent: { alignItems: 'center' },
//   headerRight: { alignItems: 'flex-end', justifyContent: 'center', paddingLeft: 10 },
//   scoreLabel: { fontSize: scaleFont(10), color: '#CBD5E1', fontWeight: '600' },
//   scoreValue: { fontSize: scaleFont(18), fontWeight: 'bold', color: '#fff' },
//   avatarCircle: {
//     width: 34,
//     height: 34,
//     borderRadius: 4,
//     backgroundColor: '#0F172A',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   avatarInitial: { color: '#fff', fontSize: scaleFont(14), fontWeight: '700' },
//   myDataContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginHorizontal: width * 0.04,
//     marginTop: height * 0.02,
//     marginBottom: height * 0.02,
//     padding: 10,
//   },
//   playerName: {
//     fontSize: scaleFont(16),
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 2,
//     letterSpacing: 0.5,
//   },
//   youBadge: {
//     position: 'absolute',
//     bottom: -8,
//     right: -10,
//     backgroundColor: '#F59E0B',
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 8,
//     borderWidth: 1.5,
//     borderColor: '#0F172A',
//   },
//   youBadgeText: { fontSize: 8, color: '#000', fontWeight: '900' },
//   question: {
//     fontSize: scaleFont(22),
//     color: '#fff',
//     textAlign: 'center',
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   answerBox: {
//     width: width * 0.6,
//     minHeight: 50,
//     maxHeight: 60,
//     backgroundColor: '#1E293B',
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     alignSelf: 'center',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//   },
//   answerText: { fontSize: scaleFont(18), color: '#fff', fontWeight: '600' },
//   keypadContainer: { width: '100%', paddingBottom: height * 0.02 },
//   keypadRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: height * 0.015,
//     paddingHorizontal: width * 0.05,
//   },
//   keyButton: {
//     width: KEY_BTN_WIDTH,
//     height: KEY_BTN_HEIGHT,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 10,
//     backgroundColor: '#1C2433',
//   },
//   specialKey: { backgroundColor: '#1C2433' },
//   gradientButton: {
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 10,
//   },
//   keyText: {
//     fontSize: scaleFont(17),
//     color: '#fff',
//     fontWeight: '600',
//   },
//   disconnectedBanner: {
//     backgroundColor: '#EF4444',
//     padding: 4,
//     alignItems: 'center',
//     marginHorizontal: width * 0.04,
//     marginTop: 8,
//     borderRadius: 4,
//   },
//   disconnectedText: { color: '#fff', fontSize: scaleFont(12), fontWeight: '600' },
//   reactionPanel: {
//     position: 'absolute',
//     right: width * 0.08,
//     top: height * 0.17,
//     backgroundColor: '#0F172A',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#FFFFFF',
//     paddingVertical: 6,
//     paddingHorizontal: 8,
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     maxWidth: width * 0.6,
//     zIndex: 20,
//     elevation: 8,
//   },
//   reactionItem: { paddingHorizontal: 4, paddingVertical: 2 },
//   reactionText: { fontSize: scaleFont(18) },
//   speechBubble: {
//     backgroundColor: 'rgba(255,255,255,0.15)',
//     padding: 8,
//     borderRadius: 20,
//   },
//   modalOverlay: {
//     position: 'absolute',
//     top: 0, left: 0, right: 0, bottom: 0,
//     backgroundColor: 'rgba(0,0,0,0.9)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 999,
//     elevation: 50,
//   },
//   resultCard: {
//     width: '90%',
//     backgroundColor: '#111827',
//     borderRadius: 24,
//     padding: 20,
//     borderWidth: 2,
//     alignItems: 'center',
//   },
//   modalHeader: {
//     width: '100%',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
//   resultContent: { alignItems: 'center', width: '100%' },
//   resultBadge: {
//     paddingHorizontal: 16,
//     paddingVertical: 6,
//     borderRadius: 16,
//     marginBottom: 10,
//   },
//   resultBadgeText: { color: '#fff', fontWeight: 'bold', fontSize: 12, letterSpacing: 1 },
//   resultTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
//   mainScore: { fontSize: 36, fontWeight: 'bold', color: '#fff' },
//   modalActions: {
//     flexDirection: 'row',
//     width: '100%',
//     justifyContent: 'space-between',
//     gap: 10,
//     marginTop: 20,
//   },
//   actionButton: {
//     flex: 1,
//     paddingVertical: 12,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   rematchButton: { backgroundColor: '#8B5CF6' },
//   newGameButton: { backgroundColor: '#3B82F6' },
//   actionButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
//   rematchWaiting: { flexDirection: 'row', justifyContent: 'center', opacity: 0.8 },
//   rematchCountdownBtn: {
//     backgroundColor: '#F59E0B',
//     flex: 1,
//     paddingVertical: 12,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   rematchCountdownText: { color: '#000', fontSize: 14, fontWeight: '900' },
//   rematchDeclinedBtn: {
//     backgroundColor: '#374151',
//     flex: 1,
//     paddingVertical: 12,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   rematchStatusText: {
//     color: '#94a3b8',
//     fontSize: scaleFont(12),
//     textAlign: 'center',
//     marginTop: 8,
//   },
//   modalPlayersContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     width: '100%',
//     paddingHorizontal: 10,
//     marginVertical: 15,
//   },
//   modalPlayer: { alignItems: 'center', width: '35%' },
//   modalPlayerName: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '600',
//     marginBottom: 5,
//     textAlign: 'center',
//   },
//   vsContainer: { justifyContent: 'center', alignItems: 'center' },
//   modalVsText: { fontSize: 24, fontWeight: '900', color: '#64748b', fontStyle: 'italic' },
// });









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
//   Image,
//   ActivityIndicator,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Icon from 'react-native-vector-icons/Ionicons';
// import {
//   useNavigation,
//   useRoute,
//   useFocusEffect,
// } from '@react-navigation/native';
// import LinearGradient from 'react-native-linear-gradient';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { useSocket } from '../context/Socket';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useTheme } from '../context/ThemeContext';
// import { useSound } from '../context/SoundContext';
// import { KEYPAD_LAYOUTS } from '../utils/keyboardLayouts';
// import { initSound, playEffect, stopEffect } from '../utils/SoundManager';
// import { useAppTranslation } from '../context/TranslationContext';
// import BadgePopup from './BadgePopup';
// import OfflineBadgesModal from './OfflineBadgesModal';
// import { useBadge } from '../context/BadgeContext';
// import { authFetch as fetch } from '../utils/authFetch'; // auto-refresh wrapper for expired access tokens

// Text.defaultProps = Text.defaultProps || {};
// Text.defaultProps.allowFontScaling = false;

// const { width, height } = Dimensions.get('window');

// const FONT_SCALE = Math.min(PixelRatio.getFontScale(), 1.0);
// const scaleFont = size => size * FONT_SCALE;

// const KEY_BTN_WIDTH = Math.min(width * 0.2, 78);
// const KEY_BTN_HEIGHT = Math.min(height * 0.085, 68);

// const REACTIONS = ['😄', '🔥', '🎯', '😅', '👏', '💪', '⚡', '🚀'];

// const getMathSymbol = symbol => {
//   const map = {
//     Sum: '+',
//     Difference: '-',
//     Subtract: '-',
//     Product: '×',
//     Multiply: '×',
//     Quotient: '÷',
//     Divide: '÷',
//     Modulus: '%',
//     Exponent: '^',
//   };
//   return map[symbol] || symbol;
// };

// const pickRandomSymbol = (symbolString) => {
//   if (!symbolString) return 'Sum';
//   const parts = symbolString.split(',').map(s => {
//     const trimmed = s.trim();
//     return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
//   });
//   return parts[Math.floor(Math.random() * parts.length)];
// };

// function deriveDiffCode(difficulty, symbolString) {
//   const letter =
//     difficulty === 'easy' ? 'E' : difficulty === 'hard' ? 'H' : 'M';
//   const count = symbolString ? symbolString.split(',').length : 2;
//   const num = count >= 4 ? '4' : '2';
//   return `${letter}${num}`;
// }

// const MultiPlayerGame = () => {
//   const socket = useSocket();
//   const insets = useSafeAreaInsets();
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { theme, keyboardTheme } = useTheme();
//   const { isSoundOn, toggleSound } = useSound();
//   const { t } = useAppTranslation();

//   const {
//     earnedBadges,
//     setEarnedBadges,
//     offlineBadges,
//     setOfflineBadges,
//     showBadges,
//   } = useBadge();

//   const {
//     currentQuestion,
//     timer,
//     difficulty,
//     opponent,
//     myMongoId,
//     isComputer,
//     symbol,
//     diffCode: routeDiffCode,
//     selectedSymbols: routeSelectedSymbols,
//     gameRoomId: routeGameRoomId,
//     restoredMyScore,       // ✅ FIX 1 — restored scores from Lobby reconnect
//     restoredOpponentScore, // ✅ FIX 1
//     gameStartedAt: routeGameStartedAt,   // ✅ TIMER FIX — server anchor ms
//     totalGameTime: routeTotalGameTime,   // ✅ TIMER FIX — total game duration ms
//   } = route.params || {};

//   const diffCode = routeDiffCode || deriveDiffCode(difficulty, symbol);

//   const selectedSymbols = routeSelectedSymbols
//     || (symbol ? symbol.split(',').map(s => s.trim()) : ['sum', 'difference']);

//   const currentLayout = KEYPAD_LAYOUTS[keyboardTheme] || KEYPAD_LAYOUTS.type1;

//   /* ================= STATE ================= */
//   const [input, setInput] = useState('');
//   const [question, setQuestion] = useState('');
//   const [correctAnswer, setCorrectAnswer] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState(null);
//   const [isReverse, setIsReverse] = useState(false);
//   const [feedback, setFeedback] = useState(null);
//   const [awaitingResult, setAwaitingResult] = useState(false);
//   const [isConnected, setIsConnected] = useState(true);
//   const [gameEnded, setGameEnded] = useState(false);
//   const [questionIndex, setQuestionIndex] = useState(1);
//   const [bonusText, setBonusText] = useState('');

//   const [minutes, setMinutes] = useState(Math.floor((timer ?? 60) / 60));
//   const [seconds, setSeconds] = useState((timer ?? 60) % 60);
//   const [timeRemaining, setTimeRemaining] = useState((timer ?? 60) * 1000);
//   const [animateWatch] = useState(new Animated.Value(1));
//   const [isThirtySecPhase, setIsThirtySecPhase] = useState(false);
//   const [isPaused, setIsPaused] = useState(false);

//   const [score, setScore] = useState(0);
//   const [opponentScore, setOpponentScore] = useState(0);
//   const [correctAnswers, setCorrectAnswers] = useState(0);
//   const [skippedCount, setSkippedCount] = useState(0);
//   const [answerHistory, setAnswerHistory] = useState([]);
//   const [opponentHistory, setOpponentHistory] = useState([]);

//   const [opponentEmoji, setOpponentEmoji] = useState(null);
//   const [isReactionPickerOpen, setIsReactionPickerOpen] = useState(false);
//   const [emojiDisabled, setEmojiDisabled] = useState(false);

//   const [graceCountdown, setGraceCountdown] = useState(null);

//   const [showResultModal, setShowResultModal] = useState(false);
//   const [resultData, setResultData] = useState(null);
//   const [resultFadeAnim] = useState(new Animated.Value(0));
//   const [resultScaleAnim] = useState(new Animated.Value(0.8));

//   const [rematchState, setRematchState] = useState('idle');
//   const [rematchCountdown, setRematchCountdown] = useState(3);

//   const [showPostGameBadges, setShowPostGameBadges] = useState(false);

//   // Profile image state — seeded from route params, updated via socket events
//   const [opponentProfileImage, setOpponentProfileImage] = useState(
//   opponent?.profilePic || opponent?.profileImage || null
// );
// // ✅ ADD temporarily to debug
// console.log('[MultiPlayerGame] opponent object:', JSON.stringify(opponent));
// console.log('[MultiPlayerGame] seeded opponentProfileImage:', opponent?.profilePic || opponent?.profileImage);
//   const [myProfileImage, setMyProfileImage] = useState(null);

//   /* ================= REFS ================= */
//   const socketRef = useRef(null);
//   const totalTimeRef = useRef(timer ?? 60);
//   const scoreRef = useRef(0);
//   const correctAnswersRef = useRef(0);
//   const incorrectCountRef = useRef(0);
//   const skippedCountRef = useRef(0);
//   const opponentScoreRef = useRef(0);
//   const isSoundOnRef = useRef(isSoundOn);
//   const last10PlayedRef = useRef(false);
//   const appState = useRef(AppState.currentState);
//   const hasNavigatedToResultRef = useRef(false);
//   const myMongoIdRef = useRef(myMongoId);
//   const opponentMongoIdRef = useRef(opponent?.id);
//   const revScale = useRef(new Animated.Value(1)).current;
//   const emojiCooldownRef = useRef(0);
//   const graceIntervalRef = useRef(null);
//   const rematchCountdownRef = useRef(null);
//   const gameStartedHandledRef = useRef(false);
//   const isComputerRef = useRef(!!isComputer);
//   const symbolListRef = useRef(symbol);
//   const correctAnswerRef = useRef('');
//   const resultModalReadyRef = useRef(false);

//   const questionHistoryRef = useRef([]);
//   const questionStartTimeRef = useRef(Date.now());

//   const currentQuestionMetaRef = useRef({
//     symbol: currentQuestion?.symbol || 'Sum',
//     difficulty: currentQuestion?.difficulty || difficulty || 'easy',
//     qm: currentQuestion?.qm || 1,
//     finalLevel: currentQuestion?.finalLevel || 1,
//   });

//   const computerAwaitingRef = useRef(false);
//   const rematchStateRef = useRef('idle');

//   // Ref mirrors for profile images — avoids stale closures in socket handlers
//   const opponentProfileImageRef = useRef(opponent?.profilePic || opponent?.profileImage || null);
//   const myProfileImageRef = useRef(null);

//   // gameRoomId kept around opportunistically (used for rematch nav forwarding)
//   const gameRoomIdRef = useRef(routeGameRoomId ?? null);

//   // ✅ TIMER FIX — server-anchored timer refs
//   const gameStartedAtRef = useRef(routeGameStartedAt ?? null);
//   const totalGameTimeRef = useRef(routeTotalGameTime ?? (timer ?? 60) * 1000);
//   const anchorTimerIntervalRef = useRef(null);

//   /* ================= HELPERS ================= */
//   const hasAnsweredAtLeastOne = useCallback(() => {
//     return (
//       correctAnswersRef.current +
//       incorrectCountRef.current +
//       skippedCountRef.current
//     ) >= 1;
//   }, []);

//   const resetQuestionTimer = useCallback(() => {
//     questionStartTimeRef.current = Date.now();
//   }, []);

//   const updateOpponentProfileImage = useCallback((url) => {
//     if (!url) return;
//     opponentProfileImageRef.current = url;
//     setOpponentProfileImage(url);
//   }, []);

//   const updateMyProfileImage = useCallback((url) => {
//     if (!url) return;
//     myProfileImageRef.current = url;
//     setMyProfileImage(url);
//   }, []);

//   const extractFromPlayerProfiles = useCallback((playerProfiles) => {
//     if (!playerProfiles || typeof playerProfiles !== 'object') {
//       return { myPic: null, opponentPic: null };
//     }
//     const myPic = playerProfiles[myMongoIdRef.current] ?? null;
//     const opponentPic = playerProfiles[opponentMongoIdRef.current] ?? null;
//     return { myPic, opponentPic };
//   }, []);

//   const captureGameRoomId = useCallback((data) => {
//     const id = data?.gameRoomId || data?.roomId || data?.gameRoom?.id || data?.gameRoom?._id;
//     if (id) gameRoomIdRef.current = id;
//   }, []);

//   // ✅ TIMER FIX — derive remaining seconds from server anchor, never decrement a variable
//   const computeRemainingSeconds = useCallback(() => {
//     if (!gameStartedAtRef.current) return totalTimeRef.current;
//     const ms = totalGameTimeRef.current - (Date.now() - gameStartedAtRef.current);
//     return Math.ceil(ms / 1000);
//   }, []);

//   const stopAnchorTimer = useCallback(() => {
//     if (anchorTimerIntervalRef.current) {
//       clearInterval(anchorTimerIntervalRef.current);
//       anchorTimerIntervalRef.current = null;
//     }
//   }, []);

//   const startTimerFromAnchor = useCallback(() => {
//     stopAnchorTimer();

//     anchorTimerIntervalRef.current = setInterval(() => {
//       if (isPaused) return;
//       const remaining = computeRemainingSeconds();
//       totalTimeRef.current = remaining;
//       setMinutes(Math.floor(Math.max(remaining, 0) / 60));
//       setSeconds(Math.max(remaining, 0) % 60);

//       if (remaining <= 10 && remaining > 0 && !last10PlayedRef.current) {
//         playEffect('ticktock', isSoundOnRef.current);
//         last10PlayedRef.current = true;
//       }

//       if (remaining <= 10 && remaining > 0) {
//         Animated.sequence([
//           Animated.timing(animateWatch, { toValue: 1.4, duration: 300, useNativeDriver: true }),
//           Animated.timing(animateWatch, { toValue: 1, duration: 300, useNativeDriver: true }),
//         ]).start();
//       }

//       if (remaining % 30 === 0 && remaining !== timer && remaining > 0) {
//         setIsThirtySecPhase(true);
//         playEffect('timer', isSoundOnRef.current);
//         Animated.sequence([
//           Animated.timing(animateWatch, { toValue: 1.4, duration: 300, useNativeDriver: true }),
//           Animated.timing(animateWatch, { toValue: 1, duration: 300, useNativeDriver: true }),
//         ]).start(() => setIsThirtySecPhase(false));
//       }

//       if (remaining <= 0) {
//         stopAnchorTimer();
//         handleTimeUp();
//       }
//     }, 1000);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isPaused, timer, computeRemainingSeconds, animateWatch, stopAnchorTimer]);

//   /* ================= showResult ================= */
//   const showResult = useCallback(
//     data => {
//       if (hasNavigatedToResultRef.current) return;
//       hasNavigatedToResultRef.current = true;

//       setGameEnded(true);
//       stopEffect('ticktock');

//       if (graceIntervalRef.current) {
//         clearInterval(graceIntervalRef.current);
//         graceIntervalRef.current = null;
//       }

//       resultFadeAnim.setValue(0);
//       resultScaleAnim.setValue(0.8);
//       setResultData(data);
//       setShowResultModal(true);

//       setTimeout(() => {
//         Animated.parallel([
//           Animated.timing(resultFadeAnim, {
//             toValue: 1,
//             duration: 500,
//             useNativeDriver: true,
//           }),
//           Animated.spring(resultScaleAnim, {
//             toValue: 1,
//             friction: 5,
//             useNativeDriver: true,
//           }),
//         ]).start(() => {
//           resultModalReadyRef.current = true;
//           // badge:earned socket event fires automatically when game ends — no manual check needed
//           setShowPostGameBadges(true);
//         });
//       }, 50);
//     },
//     [resultFadeAnim, resultScaleAnim],
//   );

//   /* ================= buildResultData ================= */
//   const buildResultData = useCallback(
//     (overrides = {}) => {
//       const attempts = correctAnswersRef.current + incorrectCountRef.current;
//       const acc =
//         attempts > 0
//           ? Math.round((correctAnswersRef.current / attempts) * 100)
//           : 0;

//       const my = scoreRef.current;
//       const opp = opponentScoreRef.current || 0;
//       let gameResult = 'draw';
//       if (my > opp) gameResult = 'win';
//       else if (my < opp) gameResult = 'lose';

//       const history = questionHistoryRef.current;
//       console.log('🔍 Question History Length:', history.length);
//       if (history.length > 0) {
//         console.log('🔍 Sample Response:', history[0]);
//         console.log('🔍 Correct:',   history.filter(r => r.isCorrect === true).length);
//         console.log('🔍 Incorrect:', history.filter(r => r.isCorrect === false).length);
//         console.log('🔍 Skipped:',   history.filter(r => r.isCorrect === null).length);
//       }

//       return {
//         gameResult,
//         totalScore: my,
//         opponentScore: opp,
//         correctCount: correctAnswersRef.current,
//         inCorrectCount: incorrectCountRef.current,
//         skippedQuestions: skippedCountRef.current,
//         correctPercentage: acc,
//         durationSeconds: timer,
//         diffCode,
//         questionHistory: history,
//         opponentProfileImage: opponentProfileImageRef.current,
//         myProfileImage: myProfileImageRef.current,
//         ...overrides,
//       };
//     },
//     [timer, diffCode],
//   );

//   /* ================= SUBMIT ANSWER (COMPUTER MODE) ================= */
//   const submitAnswerToAPI = useCallback(async givenAnswer => {
//     try {
//       const token = await AsyncStorage.getItem('accessToken');
//       if (!token) return null;

//       const meta = currentQuestionMetaRef.current;
//       const randomSymbol = pickRandomSymbol(symbolListRef.current);

//       const payload = {
//         playerRating: user?.rating || 900,
//         currentScore: scoreRef.current,
//         givenAnswer,
//         symbol: randomSymbol,
//         qm: meta.qm || 1,
//         streak: correctAnswersRef.current,
//         question: {
//           difficulty: meta.difficulty || 'easy',
//           answer: correctAnswerRef.current,
//           finalLevel: meta.finalLevel || 1,
//         },
//       };

//       const response = await fetch(
//         'http://13.203.232.239:3000/api/question/submitAnswer',
//         {
//           method: 'POST',
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(payload),
//         },
//       );

//       const data = await response.json();

//       if (response.ok && data.nextQuestion) {
//         const q = data.nextQuestion;
//         const mSym = getMathSymbol(q.symbol);
//         const qText = `${q.input1} ${mSym} ${q.input2}`;

//         currentQuestionMetaRef.current = {
//           symbol: q.symbol || currentQuestionMetaRef.current.symbol,
//           difficulty: q.difficulty || currentQuestionMetaRef.current.difficulty,
//           qm: q.qm || currentQuestionMetaRef.current.qm,
//           finalLevel: q.finalLevel || currentQuestionMetaRef.current.finalLevel,
//         };

//         setQuestion(qText);
//         correctAnswerRef.current = String(q.answer);
//         setCorrectAnswer(String(q.answer));
//         setInput('');
//         setLoading(false);
//         setFeedback(null);
//         console.log('[submitAnswerToAPI] cleared feedback after API nextQuestion; remaining:', totalTimeRef.current);
//         setQuestionIndex(prev => prev + 1);
//         computerAwaitingRef.current = false;
//         resetQuestionTimer();

//         if (data.newlyEarned && data.newlyEarned.length > 0) {
//           showBadges(data.newlyEarned);
//         }

//         return data;
//       }

//       computerAwaitingRef.current = false;
//       return null;
//     } catch (err) {
//       console.error('submitAnswerToAPI error:', err);
//       computerAwaitingRef.current = false;
//       return null;
//     }
//   }, [user, showBadges, resetQuestionTimer]);

//   /* ================= COMPUTER AI LOGIC ================= */
//   useEffect(() => {
//     if (!isComputerRef.current) return;
//     if (gameEnded) return;
//     if (!question) return;
//     if (computerAwaitingRef.current) return;

//     const computerDelay = Math.random() * 2000 + 1000;

//     const timeout = setTimeout(async () => {
//       const isCorrect = Math.random() > 0.5;
//       const currentCorrectAnswer = correctAnswerRef.current;
//       const computerAnswer = isCorrect
//         ? currentCorrectAnswer
//         : String(Math.floor(Math.random() * 100));

//       if (isCorrect) {
//         opponentScoreRef.current += 1;
//         setOpponentScore(opponentScoreRef.current);
//       }
//       setOpponentHistory(prev => [{ isCorrect }, ...prev].slice(0, 8));

//       computerAwaitingRef.current = true;
//       await submitAnswerToAPI(computerAnswer);
//     }, computerDelay);

//     return () => clearTimeout(timeout);
//   }, [question, gameEnded, submitAnswerToAPI]);

//   /* ================= INIT FIRST QUESTION ================= */
//   useEffect(() => {
//     if (currentQuestion) {
//       const mSym = getMathSymbol(currentQuestion.symbol);
//       const qText = `${currentQuestion.input1} ${mSym} ${currentQuestion.input2}`;
//       currentQuestionMetaRef.current = {
//         symbol: currentQuestion.symbol || 'Sum',
//         difficulty: currentQuestion.difficulty || difficulty || 'easy',
//         qm: currentQuestion.qm || 1,
//         finalLevel: currentQuestion.finalLevel || 1,
//       };
//       setQuestion(qText);
//       correctAnswerRef.current = String(currentQuestion.answer);
//       setCorrectAnswer(String(currentQuestion.answer));
//       setLoading(false);
//       setQuestionIndex(1);
//       resetQuestionTimer();
//     }

//     // ✅ FIX 1 — restore scores when navigated here via game-reconnected from Lobby
//     if (restoredMyScore !== undefined) {
//       scoreRef.current = restoredMyScore;
//       setScore(restoredMyScore);
//     }
//     if (restoredOpponentScore !== undefined) {
//       opponentScoreRef.current = restoredOpponentScore;
//       setOpponentScore(restoredOpponentScore);
//     }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   /* ================= EFFECTS ================= */
//   useEffect(() => {
//     return () => {
//       if (!isComputerRef.current && socketRef.current?.connected && !hasNavigatedToResultRef.current) {
//         const history = questionHistoryRef.current;
//         const payload = hasAnsweredAtLeastOne()
//           ? { reason: 'abandon', loserId: myMongoIdRef.current, questionHistory: history }
//           : { reason: 'abort' };
//         socketRef.current.emit('game-ended', payload);
//       }
//       stopEffect('ticktock');
//       if (graceIntervalRef.current) clearInterval(graceIntervalRef.current);
//       if (rematchCountdownRef.current) clearInterval(rematchCountdownRef.current);
//       stopAnchorTimer();
//     };
//   }, [hasAnsweredAtLeastOne, stopAnchorTimer]);

//   useEffect(() => {
//     isSoundOnRef.current = isSoundOn;
//     if (!isSoundOn) {
//       stopEffect('ticktock');
//       stopEffect('timer');
//       last10PlayedRef.current = false;
//     }
//   }, [isSoundOn]);

//   useFocusEffect(
//     useCallback(() => {
//       initSound('correct', 'rightanswer.mp3');
//       initSound('incorrect', 'wronganswerr.mp3');
//       initSound('skipped', 'skip.mp3');
//       initSound('timer', 'every30second.wav');
//       initSound('ticktock', 'ticktock.mp3');
//     }, []),
//   );

//   useEffect(() => {
//     const sub = AppState.addEventListener('change', state => {
//       if (state !== 'active') {
//         stopEffect('ticktock');
//       } else if (state === 'active' && appState.current !== 'active') {
//         if (!isComputerRef.current && socketRef.current?.connected) {
//           console.log('[AppState] App foreground - requesting timer sync');
//           socketRef.current.emit('sync-timer');
//         }
//       }
//       if (state === 'active' && totalTimeRef.current <= 10 && totalTimeRef.current > 0) {
//         playEffect('ticktock', isSoundOnRef.current);
//       }
//       appState.current = state;
//     });
//     return () => sub.remove();
//   }, []);

//   useEffect(() => {
//     const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
//       if (!gameEnded) {
//         Alert.alert(
//           t('Leave Game?'),
//           t('Are you sure you want to leave? You will lose the match.'),
//           [
//             { text: t('Cancel'), style: 'cancel' },
//             { text: t('Leave'), style: 'destructive', onPress: handleGameExit },
//           ],
//         );
//         return true;
//       }
//       return false;
//     });
//     return () => backHandler.remove();
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [gameEnded]);

//   useEffect(() => {
//     if (isReverse) {
//       Animated.loop(
//         Animated.sequence([
//           Animated.timing(revScale, { toValue: 1.05, duration: 800, useNativeDriver: true }),
//           Animated.timing(revScale, { toValue: 1, duration: 800, useNativeDriver: true }),
//         ]),
//       ).start();
//     } else {
//       revScale.setValue(1);
//     }
//   }, [isReverse, revScale]);

//   useEffect(() => {
//     AsyncStorage.getItem('userData')
//       .then(stored => {
//         if (stored) {
//           const userData = JSON.parse(stored);
//           setUser(userData);
//          if (!myMongoIdRef.current) {
//   myMongoIdRef.current = userData.id || userData._id;
// }
// // ✅ seed myProfileImage from AsyncStorage — match-found fires in Lobby
// // before this screen mounts so socket handler here never catches it
// if (userData.profilePic || userData.profileImage) {
//   updateMyProfileImage(userData.profilePic || userData.profileImage);
// }
//         }
//       })
//       .catch(console.error);
//       const opImg =
//     opponent?.profilePic ||
//     opponent?.profileImage ||
//     opponent?.avatar ||
//     opponent?.photo ||
//     null;
//   if (opImg) {
//     updateOpponentProfileImage(opImg);
//   }
//   }, []);

//   /* ================= SOCKET SETUP ================= */
//   useEffect(() => {
//     if (isComputerRef.current) return;
//     if (!socket) return;

//     socketRef.current = socket;
//     if (opponent?.id) opponentMongoIdRef.current = opponent.id;

//     const originalEmit = socket.emit.bind(socket);
//     socket.emit = function(event, ...args) {
//       if (['leave-game'].includes(event)) {
//         console.log(`📤 EMITTING: ${event}`, args);
//       }
//       return originalEmit(event, ...args);
//     };

//     // ✅ FIX 2 — removed register-player emit here.
//     // Socket.js already emits register-player on connect.
//     // Lobby.js handles rejoin-game + reconnect-to-game after player-registered fires.
//     // Emitting here caused double register-player → double rejoin-game → grace period exhausted.
//     const handleConnect = () => {
//       setIsConnected(true);
//       console.log('🟢 Connected/Reconnected to socket — register-player handled by Socket.js');
//     };

//     const handleDisconnect = reason => {
//       console.log('Disconnected:', reason);
//       setIsConnected(false);
//     };

//     const handleConnectError = error => {
//       console.error('Connection error:', error);
//       setIsConnected(false);
//     };

//     const handleMatchFound = data => {
//       console.log('[match-found] seeding profile images early');
//       captureGameRoomId(data);
//       if (data?.myProfileImage) {
//         updateMyProfileImage(data.myProfileImage);
//       }
//       if (data?.opponent?.profileImage) {
//         updateOpponentProfileImage(data.opponent.profileImage);
//       }
//       if (Array.isArray(data?.gameRoom?.players)) {
//         const myId = myMongoIdRef.current;
//         data.gameRoom.players.forEach(p => {
//           if (p.id === myId || p._id === myId) {
//             if (p.profileImage) updateMyProfileImage(p.profileImage);
//           } else {
//             if (p.profileImage) updateOpponentProfileImage(p.profileImage);
//           }
//         });
//       }
//     };

//     const handleNewQuestion = q => {
//       captureGameRoomId(q);
//       const mSym = getMathSymbol(q.symbol);
//       const qText = `${q.input1} ${mSym} ${q.input2}`;
//       currentQuestionMetaRef.current = {
//         symbol: q.symbol || currentQuestionMetaRef.current.symbol,
//         difficulty: q.difficulty || currentQuestionMetaRef.current.difficulty,
//         qm: q.qm || currentQuestionMetaRef.current.qm,
//         finalLevel: q.finalLevel || currentQuestionMetaRef.current.finalLevel,
//       };
//       setQuestion(qText);
//       correctAnswerRef.current = String(q.answer);
//       setCorrectAnswer(String(q.answer));
//       setInput('');
//       setLoading(false);
//       setFeedback(null);
//       console.log('[new-question] clearing feedback; scores:', { score: scoreRef.current, opponentScore: opponentScoreRef.current, minutes: totalTimeRef.current });
//       setAwaitingResult(false);
//       console.log('[new-question] awaitingResult cleared');
//       setQuestionIndex(prev => prev + 1);
//       resetQuestionTimer();
//     };

//     const handleNextQuestion = data => {
//       captureGameRoomId(data);
//       const q = data.question;
//       const mSym = getMathSymbol(q.symbol);
//       const qText = `${q.input1} ${mSym} ${q.input2}`;
//       currentQuestionMetaRef.current = {
//         symbol: q.symbol || currentQuestionMetaRef.current.symbol,
//         difficulty: q.difficulty || currentQuestionMetaRef.current.difficulty,
//         qm: q.qm || currentQuestionMetaRef.current.qm,
//         finalLevel: q.finalLevel || currentQuestionMetaRef.current.finalLevel,
//       };
//       setQuestion(qText);
//       correctAnswerRef.current = String(q.answer);
//       setCorrectAnswer(String(q.answer));
//       setInput('');
//       setLoading(false);
//       setFeedback(null);
//       setAwaitingResult(false);
//       console.log('[next-question] awaitingResult cleared; questionIndex about to increment; remaining:', totalTimeRef.current);
//       setQuestionIndex(prev => prev + 1);
//       resetQuestionTimer();

//       if (data.gameState?.playerScores) {
//         const pScores = data.gameState.playerScores;
//         if (opponentMongoIdRef.current && pScores[opponentMongoIdRef.current] !== undefined) {
//           const opData = pScores[opponentMongoIdRef.current];
//           const opScore = typeof opData === 'object' ? opData.score : opData;
//           setOpponentScore(opScore);
//           opponentScoreRef.current = opScore;
//           console.log('[next-question] opponent score updated from server:', opScore);
//         }
//         if (myMongoIdRef.current && pScores[myMongoIdRef.current] !== undefined) {
//           const myData = pScores[myMongoIdRef.current];
//           const myScore = typeof myData === 'object' ? myData.score : myData;
//           if (myScore !== scoreRef.current) {
//             scoreRef.current = myScore;
//             setScore(myScore);
//             console.log('[next-question] my score synced from server:', myScore);
//           }
//         }
//       }
//     };

//     const handleOpponentScoreUpdate = data => {
//       if (data.opponentId === opponentMongoIdRef.current) {
//         setOpponentScore(data.score);
//         opponentScoreRef.current = data.score;
//         console.log('[opponent-score-update] opponentId:', data.opponentId, 'score:', data.score, 'remaining:', totalTimeRef.current);
//         if (data.history && Array.isArray(data.history)) {
//           setOpponentHistory(data.history);
//         }
//       }
//     };

//     const handleGameEnded = data => {
//       showResult(buildResultData({ winner: data?.winner }));
//     };

//     const handlePostGameStarted = data => {
//       if (hasNavigatedToResultRef.current) return;
//       if (totalTimeRef.current >= (timer ?? 60) - 2) return;
//       console.log('[post-game-started] raw data:', JSON.stringify(data, null, 2));

//       const { myPic, opponentPic } = extractFromPlayerProfiles(data?.playerProfiles);

//       if (myPic) updateMyProfileImage(myPic);
//       if (opponentPic) updateOpponentProfileImage(opponentPic);

//       showResult(buildResultData({
//         winner: data?.winner,
//         opponentProfileImage: opponentPic ?? opponentProfileImageRef.current,
//         myProfileImage: myPic ?? myProfileImageRef.current,
//       }));
//     };

//     const handleOpponentDisconnected = (data) => {
//       console.log('⚠️ handleOpponentDisconnected called', data);
//       if (hasNavigatedToResultRef.current) {
//         console.log('🛑 Already handled disconnect');
//         return;
//       }
//       console.log('⏳ Waiting for grace period or opponent-left-game event');
//     };

//     const handleGracePeriod = data => {
//       captureGameRoomId(data);
//       const countdown = data?.graceCountdown ?? 15;
//       setGraceCountdown(countdown);
//       let remaining = countdown;
//       if (graceIntervalRef.current) clearInterval(graceIntervalRef.current);
//       graceIntervalRef.current = setInterval(() => {
//         remaining -= 1;
//         setGraceCountdown(remaining);
//         if (remaining <= 0) {
//           clearInterval(graceIntervalRef.current);
//           graceIntervalRef.current = null;
//         }
//       }, 1000);
//     };

//     const handleGracePeriodExpired = (data) => {
//       if (graceIntervalRef.current) {
//         clearInterval(graceIntervalRef.current);
//         graceIntervalRef.current = null;
//       }
//       setGraceCountdown(null);
//       console.log('[grace-period-expired] raw data:', JSON.stringify(data, null, 2));

//       const { myPic, opponentPic } = extractFromPlayerProfiles(data?.playerProfiles);

//       if (myPic) updateMyProfileImage(myPic);
//       if (opponentPic) updateOpponentProfileImage(opponentPic);

//       if (!hasNavigatedToResultRef.current) {
//         showResult(buildResultData({
//           gameResult: 'win',
//           opponentDisconnected: true,
//           winner: myMongoIdRef.current,
//           opponentProfileImage: opponentPic ?? opponentProfileImageRef.current,
//           myProfileImage: myPic ?? myProfileImageRef.current,
//         }));
//       }
//     };

//     const handleOpponentReconnected = data => {
//       if (graceIntervalRef.current) {
//         clearInterval(graceIntervalRef.current);
//         graceIntervalRef.current = null;
//       }
//       setGraceCountdown(null);
//       Alert.alert(t('Reconnected'), data?.message || t('Opponent has reconnected!'));
//     };

//     const handleOpponentEmoji = data => {
//       if (data?.emoji) {
//         setOpponentEmoji(data.emoji);
//         setTimeout(() => setOpponentEmoji(null), 3000);
//       }
//     };

//     const handleEmojiInvalid = data => {
//       console.warn('Invalid emoji:', data?.message);
//     };

//     const handleEmojiRateLimited = () => {
//       setEmojiDisabled(true);
//       setTimeout(() => setEmojiDisabled(false), 2000);
//     };

//     // ✅ TIMER FIX — timer-synced now prefers server anchor (gameStartedAt/totalGameTime),
//     // falls back to old timeRemaining math if anchor fields aren't present.
//     const handleTimerSynced = (data) => {
//       if (!data) return;

//       if (typeof data.gameStartedAt === 'number' && typeof data.totalGameTime === 'number') {
//         gameStartedAtRef.current = data.gameStartedAt;
//         totalGameTimeRef.current = data.totalGameTime;
//         const remaining = computeRemainingSeconds();
//         totalTimeRef.current = remaining;
//         setMinutes(Math.floor(Math.max(remaining, 0) / 60));
//         setSeconds(Math.max(remaining, 0) % 60);
//         setTimeRemaining(totalGameTimeRef.current - (Date.now() - gameStartedAtRef.current));
//         startTimerFromAnchor(); // resync interval cleanly on the same anchor
//         console.log('[timer-synced] resynced from server anchor:', {
//           gameStartedAt: gameStartedAtRef.current,
//           totalGameTime: totalGameTimeRef.current,
//           remaining,
//         });
//       } else if (typeof data.timeRemaining === 'number') {
//         // old fallback path — no anchor fields sent
//         console.log('[timer-synced] no anchor fields, falling back to timeRemaining:', data.timeRemaining);
//         const serverSecondsRemaining = Math.ceil(data.timeRemaining / 1000);
//         totalTimeRef.current = serverSecondsRemaining;
//         setTimeRemaining(data.timeRemaining);
//         setMinutes(Math.floor(serverSecondsRemaining / 60));
//         setSeconds(serverSecondsRemaining % 60);
//       }

//       if (data.playerScores) {
//         const pScores = data.playerScores;
//         if (myMongoIdRef.current && pScores[myMongoIdRef.current] !== undefined) {
//           const myScore = typeof pScores[myMongoIdRef.current] === 'object'
//             ? pScores[myMongoIdRef.current].score
//             : pScores[myMongoIdRef.current];
//           scoreRef.current = myScore;
//           setScore(myScore);
//         }
//         if (opponentMongoIdRef.current && pScores[opponentMongoIdRef.current] !== undefined) {
//           const opScore = typeof pScores[opponentMongoIdRef.current] === 'object'
//             ? pScores[opponentMongoIdRef.current].score
//             : pScores[opponentMongoIdRef.current];
//           opponentScoreRef.current = opScore;
//           setOpponentScore(opScore);
//         }
//       }

//       if (data.currentQuestion) {
//         const q = data.currentQuestion;
//         const mSym = getMathSymbol(q.symbol);
//         const qText = `${q.input1} ${mSym} ${q.input2}`;
//         currentQuestionMetaRef.current = {
//           symbol: q.symbol || currentQuestionMetaRef.current.symbol,
//           difficulty: q.difficulty || currentQuestionMetaRef.current.difficulty,
//           qm: q.qm || currentQuestionMetaRef.current.qm,
//           finalLevel: q.finalLevel || currentQuestionMetaRef.current.finalLevel,
//         };
//         setQuestion(qText);
//         correctAnswerRef.current = String(q.answer);
//         setCorrectAnswer(String(q.answer));
//       }
//     };

//     const handleRematchRequested = data => {
//       // ✅ Robust check: never alert the requester themselves
//       if (data?.requesterId && data.requesterId === myMongoIdRef.current) {
//         console.log('[rematch-requested] ignoring — I am the requester');
//         return;
//       }

//       // ✅ Only show the alert if we're truly idle. Blocks duplicate/late
//       // 'rematch-requested' events from re-popping the alert after the
//       // receiver has already accepted/declined (state would be 'waiting',
//       // 'countdown', 'declined', etc. — never show again in those cases).
//       if (rematchStateRef.current !== 'idle') {
//         console.log('[rematch-requested] ignoring duplicate — current state:', rematchStateRef.current);
//         return;
//       }

//       // Mark as "pending decision" immediately so a duplicate event arriving
//       // before the Alert is dismissed can't double-fire it either.
//       rematchStateRef.current = 'pending_decision';

//       Alert.alert(
//         t('Rematch Request'),
//         `${data?.requesterName || t('Opponent')} ${t('wants a rematch!')}`,
//         [
//           {
//             text: t('Decline'),
//             style: 'cancel',
//             onPress: () => {
//               socketRef.current?.emit('decline-rematch');
//               rematchStateRef.current = 'idle';
//               setRematchState('idle');
//             },
//           },
//           {
//             text: t('Accept'),
//             onPress: () => {
//               socketRef.current?.emit('accept-rematch');
//               rematchStateRef.current = 'waiting';
//               setRematchState('waiting');
//             },
//           },
//         ],
//       );
//     };

//     const handleRematchAccepted = data => {
//       if (data?.opponent?.profileImage) {
//         updateOpponentProfileImage(data.opponent.profileImage);
//       }
//       const secs = data?.countdownSeconds ?? 3;
//       setRematchCountdown(secs);
//       rematchStateRef.current = 'countdown';
//       setRematchState('countdown');
//       let remaining = secs;
//       if (rematchCountdownRef.current) clearInterval(rematchCountdownRef.current);
//       rematchCountdownRef.current = setInterval(() => {
//         remaining -= 1;
//         setRematchCountdown(remaining);
//         if (remaining <= 0) {
//           clearInterval(rematchCountdownRef.current);
//           rematchCountdownRef.current = null;
//         }
//       }, 1000);
//     };

//     const handleRematchDeclined = () => {
//       if (rematchCountdownRef.current) clearInterval(rematchCountdownRef.current);
//       rematchStateRef.current = 'declined';
//       setRematchState('declined');
//     };

//     const handleGameStarted = data => {
//       const currentRematchState = rematchStateRef.current;
//       if (currentRematchState !== 'countdown' && currentRematchState !== 'waiting') return;
//       if (gameStartedHandledRef.current) return;
//       gameStartedHandledRef.current = true;
//       if (rematchCountdownRef.current) clearInterval(rematchCountdownRef.current);

//       navigation.replace('MultiPlayerGame', {
//         currentQuestion: data.firstQuestion || data.currentQuestion,
//         timer: data.timer ?? timer,
//         difficulty: data.difficulty ?? difficulty,
//         diffCode: data.diffCode ?? diffCode,
//         gameRoomId: data.gameRoomId || data.roomId || gameRoomIdRef.current,
//         // ✅ TIMER FIX — forward server anchor so rematch screen starts in sync too
//         gameStartedAt: data.gameState?.gameStartedAt ?? data.gameStartedAt,
//         totalGameTime: data.gameState?.totalGameTime ?? data.totalGameTime,
//         opponent: {
//           id: opponentMongoIdRef.current,
//           username: opponent?.username,
//           profilePic: opponentProfileImageRef.current,
//         },
//         myMongoId: myMongoIdRef.current,
//         isComputer: false,
//       });
//     };

//     const handleOpponentLeftLobby = () => {
//       rematchStateRef.current = 'opponent_left';
//       setRematchState('opponent_left');
//     };

//     const handleExitedPostGame = () => {
//       navigation.replace('BottomTab');
//     };

//     const handleLeftGame = data => {
//       console.log('👋 left-game:', data);
//       if (hasNavigatedToResultRef.current) {
//         console.log('🛑 Already navigated away, ignoring');
//         return;
//       }
//       stopEffect('ticktock');
//       totalTimeRef.current = 0;
//       Alert.alert(
//         t('Game Forfeited'),
//         data.message || t('You have left the game. You forfeit this match.'),
//         [
//           {
//             text: t('OK'),
//             onPress: () => {
//               navigation.replace('BottomTab');
//             },
//           },
//         ],
//       );
//     };

//     const handleOpponentLeftGame = data => {
//       console.log('🏆 opponent-left-game received:', data);
//       if (hasNavigatedToResultRef.current) {
//         console.log('🛑 Already navigated to results, ignoring');
//         return;
//       }
//       console.log('✅ Processing opponent left game...');
//       stopEffect('ticktock');
//       totalTimeRef.current = 0;
//       if (graceIntervalRef.current) {
//         clearInterval(graceIntervalRef.current);
//         graceIntervalRef.current = null;
//       }
//       setGraceCountdown(null);

//       const { myPic, opponentPic } = extractFromPlayerProfiles(data?.playerProfiles);
//       if (myPic) {
//         console.log('📸 Updating my profile image');
//         updateMyProfileImage(myPic);
//       }
//       if (opponentPic) {
//         console.log('📸 Updating opponent profile image');
//         updateOpponentProfileImage(opponentPic);
//       }

//       const resultData = buildResultData({
//         winner: myMongoIdRef.current,
//         opponentLeft: true,
//         gameResults: data?.gameResults,
//         gameResult: 'win',
//         opponentProfileImage: opponentPic ?? opponentProfileImageRef.current,
//         myProfileImage: myPic ?? myProfileImageRef.current,
//       });
//       console.log('📊 Result data prepared for opponent-left-game. Calling showResult...');
//       showResult(resultData);
//     };

//     const handleGameAbortedNoStart = (data) => {
//       console.log('🚫 game-aborted-no-start received:', data);
//       if (hasNavigatedToResultRef.current) {
//         console.log('🛑 Already navigated away, ignoring abort');
//         return;
//       }
//       hasNavigatedToResultRef.current = true;
//       stopEffect('ticktock');
//       setGameEnded(true);
//       Alert.alert(
//         t('Game Aborted'),
//         data?.message || t('Game aborted. No player answered within 15 seconds. No rating change.'),
//         [
//           {
//             text: t('OK'),
//             onPress: () => {
//               navigation.replace('BottomTab');
//             },
//           },
//         ],
//       );
//     };

//     // ✅ FIX 3 — Lobby.js handles rejoin-game and emits reconnect-to-game.
//     // This stale MultiPlayerGame instance must NOT also emit it — causes double
//     // reconnect-to-game which exhausts grace period and triggers reconnect-failed.
//     const handleRejoinGame = (data) => {
//       console.log('🔄 rejoin-game received in stale MultiPlayerGame — Lobby handles this, ignoring');
//     };

//     // ✅ FIX 3 — Lobby.js handles game-reconnected and navigates to a fresh
//     // MultiPlayerGame. This old instance must do nothing here.
//     const handleGameReconnected = (data) => {
//       console.log('✅ game-reconnected in stale MultiPlayerGame — Lobby is handling navigation, ignoring');
//     };

//     const handleReconnectFailed = (data) => {
//       console.log('❌ reconnect-failed - grace period expired');
//       if (hasNavigatedToResultRef.current) {
//         console.log('🛑 Already navigated away, ignoring reconnect-failed');
//         return;
//       }
//       hasNavigatedToResultRef.current = true;
//       stopEffect('ticktock');
//       setGameEnded(true);
//       Alert.alert(
//         t('Reconnection Failed'),
//         data?.message || t('Grace period expired. Game has ended. Returning to home.'),
//         [
//           {
//             text: t('OK'),
//             onPress: () => {
//               navigation.replace('BottomTab');
//             },
//           },
//         ],
//       );
//     };

//     const handleError = data => {
//       console.error('Socket error:', data);
//     };

//     socket.on('connect', handleConnect);
//     socket.on('disconnect', handleDisconnect);
//     socket.on('connect_error', handleConnectError);
//     socket.on('match-found', handleMatchFound);
//     socket.on('new-question', handleNewQuestion);
//     socket.on('next-question', handleNextQuestion);
//     socket.on('opponent-score-update', handleOpponentScoreUpdate);
//     socket.on('game-ended', handleGameEnded);
//     socket.on('post-game-started', handlePostGameStarted);
//     socket.on('opponent-disconnected', handleOpponentDisconnected);
//     socket.on('opponent-emoji-received', handleOpponentEmoji);
//     socket.on('emoji-invalid', handleEmojiInvalid);
//     socket.on('emoji-rate-limited', handleEmojiRateLimited);
//     socket.on('game-in-grace-period', handleGracePeriod);
//     socket.on('grace-period-expired', handleGracePeriodExpired);
//     socket.on('opponent-reconnected', handleOpponentReconnected);
//     socket.on('timer-synced', handleTimerSynced);
//     socket.on('game-aborted-no-start', handleGameAbortedNoStart);
//     socket.on('rejoin-game', handleRejoinGame);
//     socket.on('game-reconnected', handleGameReconnected);
//     socket.on('reconnect-failed', handleReconnectFailed);
//     socket.on('rematch-requested', handleRematchRequested);
//     socket.on('rematch-accepted', handleRematchAccepted);
//     socket.on('rematch-declined', handleRematchDeclined);
//     socket.on('game-started', handleGameStarted);
//     socket.on('opponent-left-lobby', handleOpponentLeftLobby);
//     socket.on('exited-post-game', handleExitedPostGame);
//     socket.on('left-game', handleLeftGame);
//     socket.on('opponent-left-game', handleOpponentLeftGame);
//     socket.on('error', handleError);

//     return () => {
//       socket.off('connect', handleConnect);
//       socket.off('disconnect', handleDisconnect);
//       socket.off('connect_error', handleConnectError);
//       socket.off('match-found', handleMatchFound);
//       socket.off('new-question', handleNewQuestion);
//       socket.off('next-question', handleNextQuestion);
//       socket.off('opponent-score-update', handleOpponentScoreUpdate);
//       socket.off('game-ended', handleGameEnded);
//       socket.off('post-game-started', handlePostGameStarted);
//       socket.off('opponent-disconnected', handleOpponentDisconnected);
//       socket.off('opponent-emoji-received', handleOpponentEmoji);
//       socket.off('emoji-invalid', handleEmojiInvalid);
//       socket.off('emoji-rate-limited', handleEmojiRateLimited);
//       socket.off('game-in-grace-period', handleGracePeriod);
//       socket.off('grace-period-expired', handleGracePeriodExpired);
//       socket.off('opponent-reconnected', handleOpponentReconnected);
//       socket.off('timer-synced', handleTimerSynced);
//       socket.off('game-aborted-no-start', handleGameAbortedNoStart);
//       socket.off('rejoin-game', handleRejoinGame);
//       socket.off('game-reconnected', handleGameReconnected);
//       socket.off('reconnect-failed', handleReconnectFailed);
//       socket.off('rematch-requested', handleRematchRequested);
//       socket.off('rematch-accepted', handleRematchAccepted);
//       socket.off('rematch-declined', handleRematchDeclined);
//       socket.off('game-started', handleGameStarted);
//       socket.off('opponent-left-lobby', handleOpponentLeftLobby);
//       socket.off('exited-post-game', handleExitedPostGame);
//       socket.off('left-game', handleLeftGame);
//       socket.off('opponent-left-game', handleOpponentLeftGame);
//       socket.off('error', handleError);
//     };
//   }, [
//     socket,
//     opponent,
//     difficulty,
//     timer,
//     navigation,
//     showResult,
//     buildResultData,
//     showBadges,
//     diffCode,
//     resetQuestionTimer,
//     extractFromPlayerProfiles,
//     updateMyProfileImage,
//     updateOpponentProfileImage,
//     captureGameRoomId,
//     computeRemainingSeconds,
//     startTimerFromAnchor,
//   ]);

//   /* ================= TIMER ================= */
//   // ✅ TIMER FIX — if a server anchor is present (PvP games), derive remaining
//   // time from gameStartedAt/totalGameTime every tick (never decrement a variable).
//   // Computer-mode games have no server anchor, so they keep the old local countdown.
//   useEffect(() => {
//     if (gameEnded) return;

//     if (!isComputerRef.current && gameStartedAtRef.current) {
//       startTimerFromAnchor();
//       return () => stopAnchorTimer();
//     }

//     const interval = setInterval(() => {
//       if (!isPaused) {
//         totalTimeRef.current -= 1;
//         const remaining = totalTimeRef.current;
//         setMinutes(Math.floor(remaining / 60));
//         setSeconds(remaining % 60);
//         if (remaining === 60) {
//           console.log('[timer] hit 60 seconds remaining (1 minute). state snapshot:', {
//             remaining,
//             minutes: Math.floor(remaining / 60),
//             seconds: remaining % 60,
//             score: scoreRef.current,
//             opponentScore: opponentScoreRef.current,
//             feedback,
//             awaitingResult,
//           });
//         }
//         if (remaining < 60 && remaining >= 0) {
//           console.log('[timer] <60s remaining:', { remaining, minutes: Math.floor(remaining / 60), seconds: remaining % 60 });
//         }

//         if (remaining <= 10 && remaining > 0 && !last10PlayedRef.current) {
//           playEffect('ticktock', isSoundOnRef.current);
//           last10PlayedRef.current = true;
//         }

//         if (remaining <= 10 && remaining > 0) {
//           Animated.sequence([
//             Animated.timing(animateWatch, { toValue: 1.4, duration: 300, useNativeDriver: true }),
//             Animated.timing(animateWatch, { toValue: 1, duration: 300, useNativeDriver: true }),
//           ]).start();
//         }

//         if (remaining % 30 === 0 && remaining !== timer && remaining > 0) {
//           setIsThirtySecPhase(true);
//           playEffect('timer', isSoundOnRef.current);
//           Animated.sequence([
//             Animated.timing(animateWatch, { toValue: 1.4, duration: 300, useNativeDriver: true }),
//             Animated.timing(animateWatch, { toValue: 1, duration: 300, useNativeDriver: true }),
//           ]).start(() => setIsThirtySecPhase(false));
//         }

//         if (remaining <= 0) {
//           clearInterval(interval);
//           handleTimeUp();
//         }
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isPaused, timer, gameEnded, startTimerFromAnchor, stopAnchorTimer]);

//   /* ================= HANDLERS ================= */
//   const handleTimeUp = useCallback(() => {
//     if (!isComputerRef.current && socketRef.current?.connected) {
//       socketRef.current.emit('game-ended', {
//         reason: 'timeout',
//         questionHistory: questionHistoryRef.current,
//       });
//     }
//     showResult(buildResultData());
//   }, [showResult, buildResultData]);

//   const handleGameExit = useCallback(() => {
//     stopEffect('ticktock');
//     hasNavigatedToResultRef.current = true;
//     setGameEnded(true);

//     if (!isComputerRef.current && socketRef.current?.connected) {
//       console.log('🚪 Player exiting - emitting leave-game');
//       socketRef.current.emit('leave-game');
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

//   const handleToggleReactions = () => {
//     if (!emojiDisabled) {
//       setIsReactionPickerOpen(prev => !prev);
//     }
//   };

//   const handleSelectReaction = emoji => {
//     setIsReactionPickerOpen(false);
//     if (!REACTIONS.includes(emoji)) return;
//     const now = Date.now();
//     if (now - emojiCooldownRef.current < 2000) return;
//     if (isComputerRef.current) return;
//     if (!socketRef.current?.connected) return;
//     socketRef.current.emit('send-emoji', { emoji });
//     emojiCooldownRef.current = now;
//     setEmojiDisabled(true);
//     setTimeout(() => setEmojiDisabled(false), 2000);
//   };

//   const handleRematch = () => {
//     if (isComputerRef.current) {
//       handleNewGame();
//       return;
//     }
//     if (!socketRef.current?.connected) {
//       Alert.alert(t('Error'), t('Not connected to server.'));
//       return;
//     }
//     socketRef.current.emit('request-rematch');
//     rematchStateRef.current = 'requesting';
//     setRematchState('requesting');
//   };

//   const handleNewGame = () => {
//     if (!isComputerRef.current) {
//       socketRef.current?.emit('exit-post-game');
//     }
//     navigation.navigate('ChallengeScreen');
//   };

//   const handleCloseResults = () => {
//     if (!isComputerRef.current) {
//       socketRef.current?.emit('exit-post-game');
//     }
//     navigation.navigate('BottomTab');
//   };

//   /* ================= HANDLE PRESS (answer submission) ================= */
//   const handlePress = async value => {
//     if (loading || awaitingResult || totalTimeRef.current <= 0 || feedback || gameEnded) return;

//     const key = value.toString().toLowerCase();

//     if (key === 'clear' || key === 'clr') return setInput('');
//     if (key === '⌫' || key === 'del') return setInput(prev => prev.slice(0, -1));
//     if (key === 'reverse' || key === 'rev') return setIsReverse(prev => !prev);
//     if (key === 'pm') {
//       return setInput(prev => (prev.startsWith('-') ? prev.slice(1) : '-' + prev));
//     }

//     if (key === 'skip') {
//       const timeSpent = Date.now() - questionStartTimeRef.current;
//       skippedCountRef.current += 1;
//       setSkippedCount(skippedCountRef.current);
//       setFeedback('skipped');
//       playEffect('skipped', isSoundOnRef.current);
//       setAnswerHistory(prev => [{ isCorrect: null }, ...prev].slice(0, 8));
//       questionHistoryRef.current.push({
//         isCorrect: null,
//         timeSpent,
//         answer: null,
//       });
//       if (!isComputerRef.current) {
//         socketRef.current?.emit('submit-answer', {
//           answer: null,
//           playerId: myMongoIdRef.current,
//           timeSpent,
//           skipped: true,
//         });
//       }
//       setTimeout(() => setFeedback(null), 900);
//       return;
//     }

//     const newInput = isReverse ? value + input : input + value;
//     setInput(newInput);

//     const currentCorrect = correctAnswerRef.current;
//     const answerIsBlank = currentCorrect === '' || currentCorrect === null || currentCorrect === undefined;

//     if (answerIsBlank || newInput.length >= currentCorrect.length) {
//       const timeSpent = Date.now() - questionStartTimeRef.current;
//       const isCorrect = !answerIsBlank && newInput === currentCorrect;
//       setFeedback(isCorrect ? 'correct' : 'incorrect');
//       console.log('[handlePress] answer submitted:', { newInput, isCorrect, remaining: totalTimeRef.current });
//       playEffect(isCorrect ? 'correct' : 'incorrect', isSoundOnRef.current);
//       setAnswerHistory(prev => [{ isCorrect }, ...prev].slice(0, 8));
//       questionHistoryRef.current.push({
//         isCorrect,
//         timeSpent,
//         answer: newInput,
//       });

//       if (isCorrect) {
//         setBonusText('+4 Bonus');
//         scoreRef.current += 1;
//         setScore(scoreRef.current);
//         console.log('[handlePress] incremented score ->', scoreRef.current);
//         correctAnswersRef.current += 1;
//         setCorrectAnswers(correctAnswersRef.current);
//       } else {
//         setBonusText('');
//         incorrectCountRef.current += 1;
//       }

//       if (!isComputerRef.current) {
//         socketRef.current?.emit('submit-answer', {
//           answer: newInput,
//           playerId: myMongoIdRef.current,
//           timeSpent,
//         });
//         setAwaitingResult(true);
//         console.log('[handlePress] awaiting result set true; remaining:', totalTimeRef.current);
//         setTimeout(() => {
//           setAwaitingResult(false);
//           setFeedback(null);
//           setBonusText('');
//           console.log('[handlePress] awaiting result cleared by timeout; remaining:', totalTimeRef.current);
//         }, 5000);
//       } else {
//         setAwaitingResult(true);
//         const result = await submitAnswerToAPI(newInput);
//         setAwaitingResult(false);
//         setFeedback(null);
//         setBonusText('');
//         if (!result) {
//           console.error('Failed to get next question from API');
//         }
//       }
//     }
//   };

//   /* ================= RENDER ================= */
//   const content = (
//     <View style={[styles.container, { paddingTop: insets.top + 30 }]}>

//       {/* TOP BAR */}
//       <View style={[styles.topBar, { backgroundColor: theme.cardBackground || '#1E293B' }]}>
//         <TouchableOpacity
//           onPress={() => {
//             if (!gameEnded) {
//               Alert.alert(
//                 t('Leave Game?'),
//                 t('Are you sure you want to leave? You will lose the match.'),
//                 [
//                   { text: t('Cancel'), style: 'cancel' },
//                   { text: t('Leave'), style: 'destructive', onPress: handleGameExit },
//                 ],
//               );
//             } else {
//               stopEffect('ticktock');
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
//                 tintColor: minutes * 60 + seconds <= 10 || isThirtySecPhase ? 'red' : '#fff',
//               },
//             ]}
//           />
//           <Text style={styles.timerText}>{`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}</Text>
//         </View>

//         <TouchableOpacity onPress={handleToggleSound} style={styles.iconButton1}>
//           <Icon name={isSoundOn ? 'volume-high' : 'volume-mute'} size={24} color="#fff" />
//         </TouchableOpacity>
//       </View>

//       {/* OPPONENT HEADER */}
//       <View style={styles.opponentHeader}>
//         <View style={styles.headerLeft}>
//           <View style={styles.opponentAvatarContainer}>
//             <View style={[styles.avatarCircle, { backgroundColor: '#0F766E', width: 40, height: 40, borderRadius: 8 }]}>
//               {opponentProfileImage ? (
//                 <Image
//                   source={{ uri: opponentProfileImage }}
//                   style={{ width: 40, height: 40, borderRadius: 8 }}
//                   onError={() => setOpponentProfileImage(null)}
//                 />
//               ) : (
//                 <Text style={styles.avatarInitial}>
//                   {opponent?.username?.charAt(0).toUpperCase() || (isComputerRef.current ? '🤖' : 'O')}
//                 </Text>
//               )}
//             </View>
//             {!isComputerRef.current && <View style={styles.onlineDot} />}

//             {opponentEmoji && (
//               <View style={styles.opponentEmojiBubble}>
//                 <Text style={{ fontSize: 20 }}>{opponentEmoji}</Text>
//               </View>
//             )}

//             {graceCountdown !== null && (
//               <View style={styles.graceCountdownBubble}>
//                 <Text style={styles.graceCountdownText}>⏳{graceCountdown}s</Text>
//               </View>
//             )}
//           </View>

//           <View style={styles.opponentInfo}>
//             <Text style={styles.opponentName} numberOfLines={1}>
//               {opponent?.username || (isComputerRef.current ? 'Computer 🤖' : t('Opponent'))}
//             </Text>
//             {graceCountdown !== null && (
//               <Text style={styles.reconnectingText}>{t('Waiting to reconnect...')}</Text>
//             )}
//             <View style={styles.historyContainer}>
//               <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.historyScrollContent}>
//                 {opponentHistory.map((item, index) => {
//                   const isRight = typeof item === 'object' && item !== null ? item.isCorrect : item;
//                   return (
//                     <Icon
//                       key={index}
//                       name={isRight ? 'checkmark' : 'close'}
//                       size={16}
//                       color={isRight ? '#10B981' : '#EF4444'}
//                       style={{ marginRight: 4 }}
//                     />
//                   );
//                 })}
//               </ScrollView>
//             </View>
//           </View>
//         </View>

//         <View style={styles.headerRight}>
//           <Text style={styles.scoreLabel}>{t('Pts')}</Text>
//           <Text style={styles.scoreValue}>{opponentScore}</Text>
//         </View>
//       </View>

//       {/* Disconnected banner */}
//       {!isComputerRef.current && !isConnected && (
//         <View style={styles.disconnectedBanner}>
//           <Text style={styles.disconnectedText}>⚠️ {t('Reconnecting...')}</Text>
//         </View>
//       )}

//       {/* MY DATA */}
//       <View style={styles.myDataContainer}>
//         <View style={styles.headerLeft}>
//           <View style={styles.opponentAvatarContainer}>
//             <View style={[styles.avatarCircle, { width: 42, height: 42, backgroundColor: '#4F46E5', borderRadius: 8 }]}>
//               {(myProfileImage || user?.profilePic) ? (
//                 <Image
//                   source={{ uri: myProfileImage || user.profilePic }}
//                   style={{ width: 42, height: 42, borderRadius: 8 }}
//                 />
//               ) : (
//                 <Text style={styles.avatarInitial}>{user?.username?.charAt(0).toUpperCase() || 'Y'}</Text>
//               )}
//             </View>
//             <View style={styles.youBadge}>
//               <Text style={styles.youBadgeText}>{t('YOU')}</Text>
//             </View>
//           </View>

//           <View style={styles.opponentInfo}>
//             <Text style={styles.playerName} numberOfLines={1}>
//               {user?.username || t('You')}
//             </Text>
//             <View style={styles.historyContainer}>
//               <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.historyScrollContent}>
//                 {answerHistory.map((item, index) => (
//                   <Icon
//                     key={index}
//                     name={item.isCorrect === null ? 'close' : item.isCorrect ? 'checkmark' : 'close'}
//                     size={16}
//                     color={item.isCorrect === null ? '#FF6B6B' : item.isCorrect ? '#10B981' : '#EF4444'}
//                     style={{ marginRight: 4 }}
//                   />
//                 ))}
//               </ScrollView>
//             </View>
//           </View>
//         </View>

//         <View style={styles.headerRight}>
//           <Text style={styles.scoreLabel}>{t('Pts')}</Text>
//           <Text style={styles.scoreValue}>{score}</Text>
//         </View>
//       </View>

//       {/* QUESTION AREA */}
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
//         <Text style={styles.question}>{loading ? t('Loading...') : question}</Text>

//         <View style={[
//           styles.answerBox,
//           { backgroundColor: theme.cardBackground || '#1E293B' },
//           feedback === 'correct'   ? { borderColor: 'green',  borderWidth: 2 } :
//           feedback === 'incorrect' ? { borderColor: 'red',    borderWidth: 2 } :
//           feedback === 'skipped'   ? { borderColor: 'orange', borderWidth: 2 } : {},
//         ]}>
//           <Text style={[
//             styles.answerText,
//             feedback === 'correct'   ? { color: 'green'  } :
//             feedback === 'incorrect' ? { color: 'red'    } :
//             feedback === 'skipped'   ? { color: 'orange' } : {},
//           ]}>
//             {input || (
//               feedback === 'correct'   ? t('Correct')   :
//               feedback === 'incorrect' ? t('Incorrect') :
//               feedback === 'skipped'   ? t('Skipped')   :
//               ''
//             )}
//           </Text>
//         </View>

//         {!isComputerRef.current && (
//           <TouchableOpacity
//             style={[
//               styles.speechBubble,
//               { position: 'absolute', right: width * 0.1, top: '40%' },
//               emojiDisabled && { opacity: 0.4 },
//             ]}
//             onPress={handleToggleReactions}
//             activeOpacity={0.8}
//             disabled={emojiDisabled}
//           >
//             <Icon name="chatbubble-ellipses" size={18} color="#fff" />
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* REACTION PICKER */}
//       {isReactionPickerOpen && (
//         <View style={styles.reactionPanel}>
//           {REACTIONS.map((emoji, index) => (
//             <TouchableOpacity
//               key={index}
//               onPress={() => handleSelectReaction(emoji)}
//               style={styles.reactionItem}
//             >
//               <Text style={styles.reactionText}>{emoji}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       )}

//       {/* KEYPAD */}
//       <View style={styles.keypadContainer}>
//         {currentLayout.map((row, rowIndex) => (
//           <View key={rowIndex} style={styles.keypadRow}>
//             {row.map((item, index) => {
//               const strItem = item.toString().toLowerCase();
//               const isSpecial = ['clear', 'clr', '⌫', 'del', 'ref', 'pm', 'skip', '.', 'reverse'].includes(strItem);
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
//               } else {
//                 keyContent = <Text style={styles.keyText}>{item.toUpperCase()}</Text>;
//               }

//               return (
//                 <TouchableOpacity
//                   key={index}
//                   onPress={() => handlePress(strItem === 'ref' ? 'reverse' : item)}
//                   disabled={gameEnded}
//                   style={[
//                     styles.keyButton,
//                     { borderBottomWidth: 4, borderBottomColor: 'rgba(0,0,0,0.3)' },
//                     (isSpecial || strItem === '-') ? styles.specialKey : null,
//                     ((strItem === 'ref' || strItem === 'reverse') && isReverse) && {
//                       borderBottomColor: 'rgba(0,0,0,0.5)',
//                       borderWidth: 0,
//                       borderBottomWidth: 4,
//                       elevation: 10,
//                       shadowColor: theme.primaryColor || '#595CFF',
//                       shadowOffset: { width: 0, height: 4 },
//                       shadowOpacity: 0.5,
//                       shadowRadius: 8,
//                       transform: [{ scale: revScale }],
//                     },
//                     gameEnded && { opacity: 0.5 },
//                   ]}
//                 >
//                   {(strItem === 'ref' || strItem === 'reverse') && isReverse ? (
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

//       {/* ================= RESULT MODAL ================= */}
//       {showResultModal && resultData && (
//         <View style={styles.modalOverlay}>
//           <Animated.View
//             style={[
//               styles.resultCard,
//               {
//                 opacity: resultFadeAnim,
//                 transform: [{ scale: resultScaleAnim }],
//                 borderColor:
//                   resultData.gameResult === 'win'  ? '#4ade80' :
//                   resultData.gameResult === 'lose' ? '#f87171' : '#fbbf24',
//               },
//             ]}
//           >
//             <View style={styles.modalHeader}>
//               <TouchableOpacity
//                 onPress={() => console.log('Share')}
//                 hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
//               >
//                 <Icon name="share-social-outline" size={24} color="#fff" />
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={handleCloseResults}
//                 hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
//               >
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
//                 {resultData.gameResult === 'win'  ? t('You Won!') :
//                  resultData.gameResult === 'lose' ? t('You Lost!') : t('Draw!')}
//               </Text>

//               {resultData.diffCode && (
//                 <View style={styles.diffCodeBadge}>
//                   <Text style={styles.diffCodeText}>{resultData.diffCode}</Text>
//                 </View>
//               )}

//               <View style={styles.modalPlayersContainer}>
//                 <View style={styles.modalPlayer}>
//                   <View style={[styles.avatarCircle, { width: 60, height: 60, backgroundColor: '#4F46E5', marginBottom: 8, borderRadius: 10 }]}>
//                     {(resultData.myProfileImage || user?.profilePic) ? (
//                       <Image
//                         source={{ uri: resultData.myProfileImage || user.profilePic }}
//                         style={{ width: 60, height: 60, borderRadius: 10 }}
//                       />
//                     ) : (
//                       <Text style={[styles.avatarInitial, { fontSize: 24 }]}>
//                         {user?.username?.charAt(0).toUpperCase() || 'Y'}
//                       </Text>
//                     )}
//                   </View>
//                   <Text style={styles.modalPlayerName}>{t('You')}</Text>
//                   <Text style={[styles.mainScore, { fontSize: 28 }]}>{resultData.totalScore}</Text>
//                 </View>

//                 <View style={styles.vsContainer}>
//                   <Text style={styles.modalVsText}>{t('VS')}</Text>
//                 </View>

//                 <View style={styles.modalPlayer}>
//                   <View style={[styles.avatarCircle, { width: 60, height: 60, backgroundColor: '#0F766E', marginBottom: 8, borderRadius: 10 }]}>
//                     {resultData.opponentProfileImage ? (
//                       <Image
//                         source={{ uri: resultData.opponentProfileImage }}
//                         style={{ width: 60, height: 60, borderRadius: 10 }}
//                         onError={() => {
//                           setResultData(prev => prev ? { ...prev, opponentProfileImage: null } : prev);
//                         }}
//                       />
//                     ) : (
//                       <Text style={[styles.avatarInitial, { fontSize: 24 }]}>
//                         {isComputerRef.current ? '🤖' : (opponent?.username?.charAt(0).toUpperCase() || 'O')}
//                       </Text>
//                     )}
//                   </View>
//                   <Text style={styles.modalPlayerName}>{opponent?.username || (isComputerRef.current ? 'Computer' : t('Opponent'))}</Text>
//                   <Text style={[styles.mainScore, { fontSize: 28 }]}>{resultData.opponentScore}</Text>
//                 </View>
//               </View>

//               <Text style={{ fontSize: 40, marginTop: 10 }}>
//                 {resultData.gameResult === 'win' ? '🏆' : resultData.gameResult === 'lose' ? '😥' : '🤝'}
//               </Text>
//             </View>

//             <View style={styles.modalActions}>
//               {!isComputerRef.current && rematchState === 'idle' && (
//                 <TouchableOpacity
//                   style={[styles.actionButton, styles.rematchButton]}
//                   onPress={handleRematch}
//                 >
//                   <Text style={styles.actionButtonText}>{t('Rematch')}</Text>
//                 </TouchableOpacity>
//               )}

//               {!isComputerRef.current && rematchState === 'requesting' && (
//                 <View style={[styles.actionButton, styles.rematchButton, styles.rematchWaiting]}>
//                   <ActivityIndicator size="small" color="#fff" style={{ marginRight: 6 }} />
//                   <Text style={styles.actionButtonText}>{t('Waiting...')}</Text>
//                 </View>
//               )}

//               {!isComputerRef.current && rematchState === 'waiting' && (
//                 <View style={[styles.actionButton, styles.rematchButton, styles.rematchWaiting]}>
//                   <ActivityIndicator size="small" color="#fff" style={{ marginRight: 6 }} />
//                   <Text style={styles.actionButtonText}>{t('Starting...')}</Text>
//                 </View>
//               )}

//               {!isComputerRef.current && rematchState === 'countdown' && (
//                 <View style={[styles.actionButton, styles.rematchCountdownBtn]}>
//                   <Text style={styles.rematchCountdownText}>
//                     {t('Starting in')} {rematchCountdown}...
//                   </Text>
//                 </View>
//               )}

//               {!isComputerRef.current && (rematchState === 'declined' || rematchState === 'opponent_left') && (
//                 <View style={[styles.actionButton, styles.rematchDeclinedBtn]}>
//                   <Text style={styles.actionButtonText}>
//                     {rematchState === 'declined' ? `❌ ${t('Declined')}` : `🚪 ${t('Left')}`}
//                   </Text>
//                 </View>
//               )}

//               <TouchableOpacity
//                 style={[styles.actionButton, styles.newGameButton]}
//                 onPress={handleNewGame}
//               >
//                 <Text style={styles.actionButtonText}>{t('New Game')}</Text>
//               </TouchableOpacity>
//             </View>

//             {!isComputerRef.current && (rematchState === 'declined' || rematchState === 'opponent_left') && (
//               <Text style={styles.rematchStatusText}>
//                 {rematchState === 'declined'
//                   ? t('Opponent declined the rematch.')
//                   : t('Opponent has left the lobby.')}
//               </Text>
//             )}
//           </Animated.View>
//         </View>
//       )}
//     </View>
//   );

//   const badgeLayer = (
//     <>
//       {earnedBadges.length > 0 && (
//         <BadgePopup
//           badges={[earnedBadges[0]]}
//           onFinish={() => setEarnedBadges((prev) => prev.slice(1))}
//         />
//       )}

//       {offlineBadges.length > 0 && (
//         <OfflineBadgesModal
//           badges={offlineBadges}
//           onDismiss={() => setOfflineBadges([])}
//         />
//       )}
//     </>
//   );

//   return theme.backgroundGradient ? (
//     <LinearGradient colors={theme.backgroundGradient} style={{ flex: 1 }}>
//       {content}
//       {badgeLayer}
//     </LinearGradient>
//   ) : (
//     <View style={{ flex: 1, backgroundColor: theme.backgroundColor || '#0B1220' }}>
//       {content}
//       {badgeLayer}
//     </View>
//   );
// };

// export default MultiPlayerGame;

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
  Image,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSocket } from '../context/Socket';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useSound } from '../context/SoundContext';
import { KEYPAD_LAYOUTS } from '../utils/keyboardLayouts';
import { initSound, playEffect, stopEffect } from '../utils/SoundManager';
import { useAppTranslation } from '../context/TranslationContext';
import { useBadge } from '../context/BadgeContext';
import { authFetch as fetch } from '../utils/authFetch';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

const { width, height } = Dimensions.get('window');

const FONT_SCALE = Math.min(PixelRatio.getFontScale(), 1.0);
const scaleFont = size => size * FONT_SCALE;

const KEY_BTN_WIDTH = Math.min(width * 0.2, 78);
const KEY_BTN_HEIGHT = Math.min(height * 0.085, 68);

const REACTIONS = ['😄', '🔥', '🎯', '😅', '👏', '💪', '⚡', '🚀'];

const getMathSymbol = symbol => {
  const map = {
    Sum: '+',
    Difference: '-',
    Subtract: '-',
    Product: '×',
    Multiply: '×',
    Quotient: '÷',
    Divide: '÷',
    Modulus: '%',
    Exponent: '^',
  };
  return map[symbol] || symbol;
};

const pickRandomSymbol = (symbolString) => {
  if (!symbolString) return 'Sum';
  const parts = symbolString.split(',').map(s => {
    const trimmed = s.trim();
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
  });
  return parts[Math.floor(Math.random() * parts.length)];
};

function deriveDiffCode(difficulty, symbolString) {
  const letter =
    difficulty === 'easy' ? 'E' : difficulty === 'hard' ? 'H' : 'M';
  const count = symbolString ? symbolString.split(',').length : 2;
  const num = count >= 4 ? '4' : '2';
  return `${letter}${num}`;
}

const MultiPlayerGame = () => {
  const socket = useSocket();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const { theme, keyboardTheme } = useTheme();
  const { isSoundOn, toggleSound } = useSound();
  const { t } = useAppTranslation();

  // ── Only showBadges needed — BadgePopupController handles display globally
  const { showBadges } = useBadge();

  const {
    currentQuestion,
    timer,
    difficulty,
    opponent,
    myMongoId,
    isComputer,
    symbol,
    diffCode: routeDiffCode,
    selectedSymbols: routeSelectedSymbols,
    gameRoomId: routeGameRoomId,
    restoredMyScore,
    restoredOpponentScore,
    gameStartedAt: routeGameStartedAt,
    totalGameTime: routeTotalGameTime,
  } = route.params || {};

  const diffCode = routeDiffCode || deriveDiffCode(difficulty, symbol);

  const selectedSymbols = routeSelectedSymbols
    || (symbol ? symbol.split(',').map(s => s.trim()) : ['sum', 'difference']);

  const currentLayout = KEYPAD_LAYOUTS[keyboardTheme] || KEYPAD_LAYOUTS.type1;

  /* ================= STATE ================= */
  const [input, setInput] = useState('');
  const [question, setQuestion] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isReverse, setIsReverse] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [awaitingResult, setAwaitingResult] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [gameEnded, setGameEnded] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(1);
  const [bonusText, setBonusText] = useState('');

  const [minutes, setMinutes] = useState(Math.floor((timer ?? 60) / 60));
  const [seconds, setSeconds] = useState((timer ?? 60) % 60);
  const [timeRemaining, setTimeRemaining] = useState((timer ?? 60) * 1000);
  const [animateWatch] = useState(new Animated.Value(1));
  const [isThirtySecPhase, setIsThirtySecPhase] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [score, setScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [answerHistory, setAnswerHistory] = useState([]);
  const [opponentHistory, setOpponentHistory] = useState([]);

  const [opponentEmoji, setOpponentEmoji] = useState(null);
  const [isReactionPickerOpen, setIsReactionPickerOpen] = useState(false);
  const [emojiDisabled, setEmojiDisabled] = useState(false);

  const [graceCountdown, setGraceCountdown] = useState(null);

  const [showResultModal, setShowResultModal] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [resultFadeAnim] = useState(new Animated.Value(0));
  const [resultScaleAnim] = useState(new Animated.Value(0.8));

  const [rematchState, setRematchState] = useState('idle');
  const [rematchCountdown, setRematchCountdown] = useState(3);

  const [showPostGameBadges, setShowPostGameBadges] = useState(false);

  const [opponentProfileImage, setOpponentProfileImage] = useState(
    opponent?.profilePic || opponent?.profileImage || null
  );
  console.log('[MultiPlayerGame] opponent object:', JSON.stringify(opponent));
  console.log('[MultiPlayerGame] seeded opponentProfileImage:', opponent?.profilePic || opponent?.profileImage);
  const [myProfileImage, setMyProfileImage] = useState(null);

  /* ================= REFS ================= */
  const socketRef = useRef(null);
  const totalTimeRef = useRef(timer ?? 60);
  const scoreRef = useRef(0);
  const correctAnswersRef = useRef(0);
  const incorrectCountRef = useRef(0);
  const skippedCountRef = useRef(0);
  const opponentScoreRef = useRef(0);
  const isSoundOnRef = useRef(isSoundOn);
  const last10PlayedRef = useRef(false);
  const appState = useRef(AppState.currentState);
  const hasNavigatedToResultRef = useRef(false);
  const myMongoIdRef = useRef(myMongoId);
  const opponentMongoIdRef = useRef(opponent?.id);
  const revScale = useRef(new Animated.Value(1)).current;
  const emojiCooldownRef = useRef(0);
  const graceIntervalRef = useRef(null);
  const rematchCountdownRef = useRef(null);
  const gameStartedHandledRef = useRef(false);
  const isComputerRef = useRef(!!isComputer);
  const symbolListRef = useRef(symbol);
  const correctAnswerRef = useRef('');
  const resultModalReadyRef = useRef(false);

  const questionHistoryRef = useRef([]);
  const questionStartTimeRef = useRef(Date.now());

  const currentQuestionMetaRef = useRef({
    symbol: currentQuestion?.symbol || 'Sum',
    difficulty: currentQuestion?.difficulty || difficulty || 'easy',
    qm: currentQuestion?.qm || 1,
    finalLevel: currentQuestion?.finalLevel || 1,
  });

  const computerAwaitingRef = useRef(false);
  const rematchStateRef = useRef('idle');

  const opponentProfileImageRef = useRef(opponent?.profilePic || opponent?.profileImage || null);
  const myProfileImageRef = useRef(null);

  const gameRoomIdRef = useRef(routeGameRoomId ?? null);

  const gameStartedAtRef = useRef(routeGameStartedAt ?? null);
  const totalGameTimeRef = useRef(routeTotalGameTime ?? (timer ?? 60) * 1000);
  const anchorTimerIntervalRef = useRef(null);

  /* ================= HELPERS ================= */
  const hasAnsweredAtLeastOne = useCallback(() => {
    return (
      correctAnswersRef.current +
      incorrectCountRef.current +
      skippedCountRef.current
    ) >= 1;
  }, []);

  const resetQuestionTimer = useCallback(() => {
    questionStartTimeRef.current = Date.now();
  }, []);

  const updateOpponentProfileImage = useCallback((url) => {
    if (!url) return;
    opponentProfileImageRef.current = url;
    setOpponentProfileImage(url);
  }, []);

  const updateMyProfileImage = useCallback((url) => {
    if (!url) return;
    myProfileImageRef.current = url;
    setMyProfileImage(url);
  }, []);

  const extractFromPlayerProfiles = useCallback((playerProfiles) => {
    if (!playerProfiles || typeof playerProfiles !== 'object') {
      return { myPic: null, opponentPic: null };
    }
    const myPic = playerProfiles[myMongoIdRef.current] ?? null;
    const opponentPic = playerProfiles[opponentMongoIdRef.current] ?? null;
    return { myPic, opponentPic };
  }, []);

  const captureGameRoomId = useCallback((data) => {
    const id = data?.gameRoomId || data?.roomId || data?.gameRoom?.id || data?.gameRoom?._id;
    if (id) gameRoomIdRef.current = id;
  }, []);

  const computeRemainingSeconds = useCallback(() => {
    if (!gameStartedAtRef.current) return totalTimeRef.current;
    const ms = totalGameTimeRef.current - (Date.now() - gameStartedAtRef.current);
    return Math.ceil(ms / 1000);
  }, []);

  const stopAnchorTimer = useCallback(() => {
    if (anchorTimerIntervalRef.current) {
      clearInterval(anchorTimerIntervalRef.current);
      anchorTimerIntervalRef.current = null;
    }
  }, []);

  const startTimerFromAnchor = useCallback(() => {
    stopAnchorTimer();

    anchorTimerIntervalRef.current = setInterval(() => {
      if (isPaused) return;
      const remaining = computeRemainingSeconds();
      totalTimeRef.current = remaining;
      setMinutes(Math.floor(Math.max(remaining, 0) / 60));
      setSeconds(Math.max(remaining, 0) % 60);

      if (remaining <= 10 && remaining > 0 && !last10PlayedRef.current) {
        playEffect('ticktock', isSoundOnRef.current);
        last10PlayedRef.current = true;
      }

      if (remaining <= 10 && remaining > 0) {
        Animated.sequence([
          Animated.timing(animateWatch, { toValue: 1.4, duration: 300, useNativeDriver: true }),
          Animated.timing(animateWatch, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]).start();
      }

      if (remaining % 30 === 0 && remaining !== timer && remaining > 0) {
        setIsThirtySecPhase(true);
        playEffect('timer', isSoundOnRef.current);
        Animated.sequence([
          Animated.timing(animateWatch, { toValue: 1.4, duration: 300, useNativeDriver: true }),
          Animated.timing(animateWatch, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]).start(() => setIsThirtySecPhase(false));
      }

      if (remaining <= 0) {
        stopAnchorTimer();
        handleTimeUp();
      }
    }, 1000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaused, timer, computeRemainingSeconds, animateWatch, stopAnchorTimer]);

  /* ================= showResult ================= */
  const showResult = useCallback(
    data => {
      if (hasNavigatedToResultRef.current) return;
      hasNavigatedToResultRef.current = true;

      setGameEnded(true);
      stopEffect('ticktock');

      if (graceIntervalRef.current) {
        clearInterval(graceIntervalRef.current);
        graceIntervalRef.current = null;
      }

      resultFadeAnim.setValue(0);
      resultScaleAnim.setValue(0.8);
      setResultData(data);
      setShowResultModal(true);

      setTimeout(() => {
        Animated.parallel([
          Animated.timing(resultFadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.spring(resultScaleAnim, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true,
          }),
        ]).start(() => {
          resultModalReadyRef.current = true;
          setShowPostGameBadges(true);
        });
      }, 50);
    },
    [resultFadeAnim, resultScaleAnim],
  );

  /* ================= buildResultData ================= */
  const buildResultData = useCallback(
    (overrides = {}) => {
      const attempts = correctAnswersRef.current + incorrectCountRef.current;
      const acc =
        attempts > 0
          ? Math.round((correctAnswersRef.current / attempts) * 100)
          : 0;

      const my = scoreRef.current;
      const opp = opponentScoreRef.current || 0;
      let gameResult = 'draw';
      if (my > opp) gameResult = 'win';
      else if (my < opp) gameResult = 'lose';

      const history = questionHistoryRef.current;
      console.log('🔍 Question History Length:', history.length);
      if (history.length > 0) {
        console.log('🔍 Sample Response:', history[0]);
        console.log('🔍 Correct:',   history.filter(r => r.isCorrect === true).length);
        console.log('🔍 Incorrect:', history.filter(r => r.isCorrect === false).length);
        console.log('🔍 Skipped:',   history.filter(r => r.isCorrect === null).length);
      }

      return {
        gameResult,
        totalScore: my,
        opponentScore: opp,
        correctCount: correctAnswersRef.current,
        inCorrectCount: incorrectCountRef.current,
        skippedQuestions: skippedCountRef.current,
        correctPercentage: acc,
        durationSeconds: timer,
        diffCode,
        questionHistory: history,
        opponentProfileImage: opponentProfileImageRef.current,
        myProfileImage: myProfileImageRef.current,
        ...overrides,
      };
    },
    [timer, diffCode],
  );

  /* ================= SUBMIT ANSWER (COMPUTER MODE) ================= */
  const submitAnswerToAPI = useCallback(async givenAnswer => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return null;

      const meta = currentQuestionMetaRef.current;
      const randomSymbol = pickRandomSymbol(symbolListRef.current);

      const payload = {
        playerRating: user?.rating || 900,
        currentScore: scoreRef.current,
        givenAnswer,
        symbol: randomSymbol,
        qm: meta.qm || 1,
        streak: correctAnswersRef.current,
        question: {
          difficulty: meta.difficulty || 'easy',
          answer: correctAnswerRef.current,
          finalLevel: meta.finalLevel || 1,
        },
      };

      const response = await fetch(
        'http://13.203.232.239:3000/api/question/submitAnswer',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (response.ok && data.nextQuestion) {
        const q = data.nextQuestion;
        const mSym = getMathSymbol(q.symbol);
        const qText = `${q.input1} ${mSym} ${q.input2}`;

        currentQuestionMetaRef.current = {
          symbol: q.symbol || currentQuestionMetaRef.current.symbol,
          difficulty: q.difficulty || currentQuestionMetaRef.current.difficulty,
          qm: q.qm || currentQuestionMetaRef.current.qm,
          finalLevel: q.finalLevel || currentQuestionMetaRef.current.finalLevel,
        };

        setQuestion(qText);
        correctAnswerRef.current = String(q.answer);
        setCorrectAnswer(String(q.answer));
        setInput('');
        setLoading(false);
        setFeedback(null);
        console.log('[submitAnswerToAPI] cleared feedback after API nextQuestion; remaining:', totalTimeRef.current);
        setQuestionIndex(prev => prev + 1);
        computerAwaitingRef.current = false;
        resetQuestionTimer();

        if (data.newlyEarned && data.newlyEarned.length > 0) {
          showBadges(data.newlyEarned);
        }

        return data;
      }

      computerAwaitingRef.current = false;
      return null;
    } catch (err) {
      console.error('submitAnswerToAPI error:', err);
      computerAwaitingRef.current = false;
      return null;
    }
  }, [user, showBadges, resetQuestionTimer]);

  /* ================= COMPUTER AI LOGIC ================= */
  useEffect(() => {
    if (!isComputerRef.current) return;
    if (gameEnded) return;
    if (!question) return;
    if (computerAwaitingRef.current) return;

    const computerDelay = Math.random() * 2000 + 1000;

    const timeout = setTimeout(async () => {
      const isCorrect = Math.random() > 0.5;
      const currentCorrectAnswer = correctAnswerRef.current;
      const computerAnswer = isCorrect
        ? currentCorrectAnswer
        : String(Math.floor(Math.random() * 100));

      if (isCorrect) {
        opponentScoreRef.current += 1;
        setOpponentScore(opponentScoreRef.current);
      }
      setOpponentHistory(prev => [{ isCorrect }, ...prev].slice(0, 8));

      computerAwaitingRef.current = true;
      await submitAnswerToAPI(computerAnswer);
    }, computerDelay);

    return () => clearTimeout(timeout);
  }, [question, gameEnded, submitAnswerToAPI]);

  /* ================= INIT FIRST QUESTION ================= */
  useEffect(() => {
    if (currentQuestion) {
      const mSym = getMathSymbol(currentQuestion.symbol);
      const qText = `${currentQuestion.input1} ${mSym} ${currentQuestion.input2}`;
      currentQuestionMetaRef.current = {
        symbol: currentQuestion.symbol || 'Sum',
        difficulty: currentQuestion.difficulty || difficulty || 'easy',
        qm: currentQuestion.qm || 1,
        finalLevel: currentQuestion.finalLevel || 1,
      };
      setQuestion(qText);
      correctAnswerRef.current = String(currentQuestion.answer);
      setCorrectAnswer(String(currentQuestion.answer));
      setLoading(false);
      setQuestionIndex(1);
      resetQuestionTimer();
    }

    if (restoredMyScore !== undefined) {
      scoreRef.current = restoredMyScore;
      setScore(restoredMyScore);
    }
    if (restoredOpponentScore !== undefined) {
      opponentScoreRef.current = restoredOpponentScore;
      setOpponentScore(restoredOpponentScore);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ================= EFFECTS ================= */
  useEffect(() => {
    return () => {
      if (!isComputerRef.current && socketRef.current?.connected && !hasNavigatedToResultRef.current) {
        const history = questionHistoryRef.current;
        const payload = hasAnsweredAtLeastOne()
          ? { reason: 'abandon', loserId: myMongoIdRef.current, questionHistory: history }
          : { reason: 'abort' };
        socketRef.current.emit('game-ended', payload);
      }
      stopEffect('ticktock');
      if (graceIntervalRef.current) clearInterval(graceIntervalRef.current);
      if (rematchCountdownRef.current) clearInterval(rematchCountdownRef.current);
      stopAnchorTimer();
    };
  }, [hasAnsweredAtLeastOne, stopAnchorTimer]);

  useEffect(() => {
    isSoundOnRef.current = isSoundOn;
    if (!isSoundOn) {
      stopEffect('ticktock');
      stopEffect('timer');
      last10PlayedRef.current = false;
    }
  }, [isSoundOn]);

  useFocusEffect(
    useCallback(() => {
      initSound('correct', 'rightanswer.mp3');
      initSound('incorrect', 'wronganswerr.mp3');
      initSound('skipped', 'skip.mp3');
      initSound('timer', 'every30second.wav');
      initSound('ticktock', 'ticktock.mp3');
    }, []),
  );

  useEffect(() => {
    const sub = AppState.addEventListener('change', state => {
      if (state !== 'active') {
        stopEffect('ticktock');
      } else if (state === 'active' && appState.current !== 'active') {
        if (!isComputerRef.current && socketRef.current?.connected) {
          console.log('[AppState] App foreground - requesting timer sync');
          socketRef.current.emit('sync-timer');
        }
      }
      if (state === 'active' && totalTimeRef.current <= 10 && totalTimeRef.current > 0) {
        playEffect('ticktock', isSoundOnRef.current);
      }
      appState.current = state;
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!gameEnded) {
        Alert.alert(
          t('Leave Game?'),
          t('Are you sure you want to leave? You will lose the match.'),
          [
            { text: t('Cancel'), style: 'cancel' },
            { text: t('Leave'), style: 'destructive', onPress: handleGameExit },
          ],
        );
        return true;
      }
      return false;
    });
    return () => backHandler.remove();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameEnded]);

  useEffect(() => {
    if (isReverse) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(revScale, { toValue: 1.05, duration: 800, useNativeDriver: true }),
          Animated.timing(revScale, { toValue: 1, duration: 800, useNativeDriver: true }),
        ]),
      ).start();
    } else {
      revScale.setValue(1);
    }
  }, [isReverse, revScale]);

  useEffect(() => {
    AsyncStorage.getItem('userData')
      .then(stored => {
        if (stored) {
          const userData = JSON.parse(stored);
          setUser(userData);
          if (!myMongoIdRef.current) {
            myMongoIdRef.current = userData.id || userData._id;
          }
          if (userData.profilePic || userData.profileImage) {
            updateMyProfileImage(userData.profilePic || userData.profileImage);
          }
        }
      })
      .catch(console.error);
    const opImg =
      opponent?.profilePic ||
      opponent?.profileImage ||
      opponent?.avatar ||
      opponent?.photo ||
      null;
    if (opImg) {
      updateOpponentProfileImage(opImg);
    }
  }, []);

  /* ================= SOCKET SETUP ================= */
  useEffect(() => {
    if (isComputerRef.current) return;
    if (!socket) return;

    socketRef.current = socket;
    if (opponent?.id) opponentMongoIdRef.current = opponent.id;

    const originalEmit = socket.emit.bind(socket);
    socket.emit = function(event, ...args) {
      if (['leave-game'].includes(event)) {
        console.log(`📤 EMITTING: ${event}`, args);
      }
      return originalEmit(event, ...args);
    };

    const handleConnect = () => {
      setIsConnected(true);
      console.log('🟢 Connected/Reconnected to socket — register-player handled by Socket.js');
    };

    const handleDisconnect = reason => {
      console.log('Disconnected:', reason);
      setIsConnected(false);
    };

    const handleConnectError = error => {
      console.error('Connection error:', error);
      setIsConnected(false);
    };

    const handleMatchFound = data => {
      console.log('[match-found] seeding profile images early');
      captureGameRoomId(data);
      if (data?.myProfileImage) {
        updateMyProfileImage(data.myProfileImage);
      }
      if (data?.opponent?.profileImage) {
        updateOpponentProfileImage(data.opponent.profileImage);
      }
      if (Array.isArray(data?.gameRoom?.players)) {
        const myId = myMongoIdRef.current;
        data.gameRoom.players.forEach(p => {
          if (p.id === myId || p._id === myId) {
            if (p.profileImage) updateMyProfileImage(p.profileImage);
          } else {
            if (p.profileImage) updateOpponentProfileImage(p.profileImage);
          }
        });
      }
    };

    const handleNewQuestion = q => {
      captureGameRoomId(q);
      const mSym = getMathSymbol(q.symbol);
      const qText = `${q.input1} ${mSym} ${q.input2}`;
      currentQuestionMetaRef.current = {
        symbol: q.symbol || currentQuestionMetaRef.current.symbol,
        difficulty: q.difficulty || currentQuestionMetaRef.current.difficulty,
        qm: q.qm || currentQuestionMetaRef.current.qm,
        finalLevel: q.finalLevel || currentQuestionMetaRef.current.finalLevel,
      };
      setQuestion(qText);
      correctAnswerRef.current = String(q.answer);
      setCorrectAnswer(String(q.answer));
      setInput('');
      setLoading(false);
      setFeedback(null);
      console.log('[new-question] clearing feedback; scores:', { score: scoreRef.current, opponentScore: opponentScoreRef.current, minutes: totalTimeRef.current });
      setAwaitingResult(false);
      console.log('[new-question] awaitingResult cleared');
      setQuestionIndex(prev => prev + 1);
      resetQuestionTimer();
    };

    const handleNextQuestion = data => {
      captureGameRoomId(data);
      const q = data.question;
      const mSym = getMathSymbol(q.symbol);
      const qText = `${q.input1} ${mSym} ${q.input2}`;
      currentQuestionMetaRef.current = {
        symbol: q.symbol || currentQuestionMetaRef.current.symbol,
        difficulty: q.difficulty || currentQuestionMetaRef.current.difficulty,
        qm: q.qm || currentQuestionMetaRef.current.qm,
        finalLevel: q.finalLevel || currentQuestionMetaRef.current.finalLevel,
      };
      setQuestion(qText);
      correctAnswerRef.current = String(q.answer);
      setCorrectAnswer(String(q.answer));
      setInput('');
      setLoading(false);
      setFeedback(null);
      setAwaitingResult(false);
      console.log('[next-question] awaitingResult cleared; questionIndex about to increment; remaining:', totalTimeRef.current);
      setQuestionIndex(prev => prev + 1);
      resetQuestionTimer();

      if (data.gameState?.playerScores) {
        const pScores = data.gameState.playerScores;
        if (opponentMongoIdRef.current && pScores[opponentMongoIdRef.current] !== undefined) {
          const opData = pScores[opponentMongoIdRef.current];
          const opScore = typeof opData === 'object' ? opData.score : opData;
          setOpponentScore(opScore);
          opponentScoreRef.current = opScore;
          console.log('[next-question] opponent score updated from server:', opScore);
        }
        if (myMongoIdRef.current && pScores[myMongoIdRef.current] !== undefined) {
          const myData = pScores[myMongoIdRef.current];
          const myScore = typeof myData === 'object' ? myData.score : myData;
          if (myScore !== scoreRef.current) {
            scoreRef.current = myScore;
            setScore(myScore);
            console.log('[next-question] my score synced from server:', myScore);
          }
        }
      }
    };

    const handleOpponentScoreUpdate = data => {
      if (data.opponentId === opponentMongoIdRef.current) {
        setOpponentScore(data.score);
        opponentScoreRef.current = data.score;
        console.log('[opponent-score-update] opponentId:', data.opponentId, 'score:', data.score, 'remaining:', totalTimeRef.current);
        if (data.history && Array.isArray(data.history)) {
          setOpponentHistory(data.history);
        }
      }
    };

    const handleGameEnded = data => {
      showResult(buildResultData({ winner: data?.winner }));
    };

    const handlePostGameStarted = data => {
      if (hasNavigatedToResultRef.current) return;
      if (totalTimeRef.current >= (timer ?? 60) - 2) return;
      console.log('[post-game-started] raw data:', JSON.stringify(data, null, 2));

      const { myPic, opponentPic } = extractFromPlayerProfiles(data?.playerProfiles);

      if (myPic) updateMyProfileImage(myPic);
      if (opponentPic) updateOpponentProfileImage(opponentPic);

      showResult(buildResultData({
        winner: data?.winner,
        opponentProfileImage: opponentPic ?? opponentProfileImageRef.current,
        myProfileImage: myPic ?? myProfileImageRef.current,
      }));
    };

    const handleOpponentDisconnected = (data) => {
      console.log('⚠️ handleOpponentDisconnected called', data);
      if (hasNavigatedToResultRef.current) {
        console.log('🛑 Already handled disconnect');
        return;
      }
      console.log('⏳ Waiting for grace period or opponent-left-game event');
    };

    const handleGracePeriod = data => {
      captureGameRoomId(data);
      const countdown = data?.graceCountdown ?? 15;
      setGraceCountdown(countdown);
      let remaining = countdown;
      if (graceIntervalRef.current) clearInterval(graceIntervalRef.current);
      graceIntervalRef.current = setInterval(() => {
        remaining -= 1;
        setGraceCountdown(remaining);
        if (remaining <= 0) {
          clearInterval(graceIntervalRef.current);
          graceIntervalRef.current = null;
        }
      }, 1000);
    };

    const handleGracePeriodExpired = (data) => {
      if (graceIntervalRef.current) {
        clearInterval(graceIntervalRef.current);
        graceIntervalRef.current = null;
      }
      setGraceCountdown(null);
      console.log('[grace-period-expired] raw data:', JSON.stringify(data, null, 2));

      const { myPic, opponentPic } = extractFromPlayerProfiles(data?.playerProfiles);

      if (myPic) updateMyProfileImage(myPic);
      if (opponentPic) updateOpponentProfileImage(opponentPic);

      if (!hasNavigatedToResultRef.current) {
        showResult(buildResultData({
          gameResult: 'win',
          opponentDisconnected: true,
          winner: myMongoIdRef.current,
          opponentProfileImage: opponentPic ?? opponentProfileImageRef.current,
          myProfileImage: myPic ?? myProfileImageRef.current,
        }));
      }
    };

    const handleOpponentReconnected = data => {
      if (graceIntervalRef.current) {
        clearInterval(graceIntervalRef.current);
        graceIntervalRef.current = null;
      }
      setGraceCountdown(null);
      Alert.alert(t('Reconnected'), data?.message || t('Opponent has reconnected!'));
    };

    const handleOpponentEmoji = data => {
      if (data?.emoji) {
        setOpponentEmoji(data.emoji);
        setTimeout(() => setOpponentEmoji(null), 3000);
      }
    };

    const handleEmojiInvalid = data => {
      console.warn('Invalid emoji:', data?.message);
    };

    const handleEmojiRateLimited = () => {
      setEmojiDisabled(true);
      setTimeout(() => setEmojiDisabled(false), 2000);
    };

    const handleTimerSynced = (data) => {
      if (!data) return;

      if (typeof data.gameStartedAt === 'number' && typeof data.totalGameTime === 'number') {
        gameStartedAtRef.current = data.gameStartedAt;
        totalGameTimeRef.current = data.totalGameTime;
        const remaining = computeRemainingSeconds();
        totalTimeRef.current = remaining;
        setMinutes(Math.floor(Math.max(remaining, 0) / 60));
        setSeconds(Math.max(remaining, 0) % 60);
        setTimeRemaining(totalGameTimeRef.current - (Date.now() - gameStartedAtRef.current));
        startTimerFromAnchor();
        console.log('[timer-synced] resynced from server anchor:', {
          gameStartedAt: gameStartedAtRef.current,
          totalGameTime: totalGameTimeRef.current,
          remaining,
        });
      } else if (typeof data.timeRemaining === 'number') {
        console.log('[timer-synced] no anchor fields, falling back to timeRemaining:', data.timeRemaining);
        const serverSecondsRemaining = Math.ceil(data.timeRemaining / 1000);
        totalTimeRef.current = serverSecondsRemaining;
        setTimeRemaining(data.timeRemaining);
        setMinutes(Math.floor(serverSecondsRemaining / 60));
        setSeconds(serverSecondsRemaining % 60);
      }

      if (data.playerScores) {
        const pScores = data.playerScores;
        if (myMongoIdRef.current && pScores[myMongoIdRef.current] !== undefined) {
          const myScore = typeof pScores[myMongoIdRef.current] === 'object'
            ? pScores[myMongoIdRef.current].score
            : pScores[myMongoIdRef.current];
          scoreRef.current = myScore;
          setScore(myScore);
        }
        if (opponentMongoIdRef.current && pScores[opponentMongoIdRef.current] !== undefined) {
          const opScore = typeof pScores[opponentMongoIdRef.current] === 'object'
            ? pScores[opponentMongoIdRef.current].score
            : pScores[opponentMongoIdRef.current];
          opponentScoreRef.current = opScore;
          setOpponentScore(opScore);
        }
      }

      if (data.currentQuestion) {
        const q = data.currentQuestion;
        const mSym = getMathSymbol(q.symbol);
        const qText = `${q.input1} ${mSym} ${q.input2}`;
        currentQuestionMetaRef.current = {
          symbol: q.symbol || currentQuestionMetaRef.current.symbol,
          difficulty: q.difficulty || currentQuestionMetaRef.current.difficulty,
          qm: q.qm || currentQuestionMetaRef.current.qm,
          finalLevel: q.finalLevel || currentQuestionMetaRef.current.finalLevel,
        };
        setQuestion(qText);
        correctAnswerRef.current = String(q.answer);
        setCorrectAnswer(String(q.answer));
      }
    };

    const handleRematchRequested = data => {
      if (data?.requesterId && data.requesterId === myMongoIdRef.current) {
        console.log('[rematch-requested] ignoring — I am the requester');
        return;
      }
      if (rematchStateRef.current !== 'idle') {
        console.log('[rematch-requested] ignoring duplicate — current state:', rematchStateRef.current);
        return;
      }
      rematchStateRef.current = 'pending_decision';

      Alert.alert(
        t('Rematch Request'),
        `${data?.requesterName || t('Opponent')} ${t('wants a rematch!')}`,
        [
          {
            text: t('Decline'),
            style: 'cancel',
            onPress: () => {
              socketRef.current?.emit('decline-rematch');
              rematchStateRef.current = 'idle';
              setRematchState('idle');
            },
          },
          {
            text: t('Accept'),
            onPress: () => {
              socketRef.current?.emit('accept-rematch');
              rematchStateRef.current = 'waiting';
              setRematchState('waiting');
            },
          },
        ],
      );
    };

    const handleRematchAccepted = data => {
      if (data?.opponent?.profileImage) {
        updateOpponentProfileImage(data.opponent.profileImage);
      }
      const secs = data?.countdownSeconds ?? 3;
      setRematchCountdown(secs);
      rematchStateRef.current = 'countdown';
      setRematchState('countdown');
      let remaining = secs;
      if (rematchCountdownRef.current) clearInterval(rematchCountdownRef.current);
      rematchCountdownRef.current = setInterval(() => {
        remaining -= 1;
        setRematchCountdown(remaining);
        if (remaining <= 0) {
          clearInterval(rematchCountdownRef.current);
          rematchCountdownRef.current = null;
        }
      }, 1000);
    };

    const handleRematchDeclined = () => {
      if (rematchCountdownRef.current) clearInterval(rematchCountdownRef.current);
      rematchStateRef.current = 'declined';
      setRematchState('declined');
    };

    const handleGameStarted = data => {
      const currentRematchState = rematchStateRef.current;
      if (currentRematchState !== 'countdown' && currentRematchState !== 'waiting') return;
      if (gameStartedHandledRef.current) return;
      gameStartedHandledRef.current = true;
      if (rematchCountdownRef.current) clearInterval(rematchCountdownRef.current);

      navigation.replace('MultiPlayerGame', {
        currentQuestion: data.firstQuestion || data.currentQuestion,
        timer: data.timer ?? timer,
        difficulty: data.difficulty ?? difficulty,
        diffCode: data.diffCode ?? diffCode,
        gameRoomId: data.gameRoomId || data.roomId || gameRoomIdRef.current,
        gameStartedAt: data.gameState?.gameStartedAt ?? data.gameStartedAt,
        totalGameTime: data.gameState?.totalGameTime ?? data.totalGameTime,
        opponent: {
          id: opponentMongoIdRef.current,
          username: opponent?.username,
          profilePic: opponentProfileImageRef.current,
        },
        myMongoId: myMongoIdRef.current,
        isComputer: false,
      });
    };

    const handleOpponentLeftLobby = () => {
      rematchStateRef.current = 'opponent_left';
      setRematchState('opponent_left');
    };

    const handleExitedPostGame = () => {
      navigation.replace('BottomTab');
    };

    const handleLeftGame = data => {
      console.log('👋 left-game:', data);
      if (hasNavigatedToResultRef.current) {
        console.log('🛑 Already navigated away, ignoring');
        return;
      }
      stopEffect('ticktock');
      totalTimeRef.current = 0;
      Alert.alert(
        t('Game Forfeited'),
        data.message || t('You have left the game. You forfeit this match.'),
        [
          {
            text: t('OK'),
            onPress: () => {
              navigation.replace('BottomTab');
            },
          },
        ],
      );
    };

    const handleOpponentLeftGame = data => {
      console.log('🏆 opponent-left-game received:', data);
      if (hasNavigatedToResultRef.current) {
        console.log('🛑 Already navigated to results, ignoring');
        return;
      }
      console.log('✅ Processing opponent left game...');
      stopEffect('ticktock');
      totalTimeRef.current = 0;
      if (graceIntervalRef.current) {
        clearInterval(graceIntervalRef.current);
        graceIntervalRef.current = null;
      }
      setGraceCountdown(null);

      const { myPic, opponentPic } = extractFromPlayerProfiles(data?.playerProfiles);
      if (myPic) {
        console.log('📸 Updating my profile image');
        updateMyProfileImage(myPic);
      }
      if (opponentPic) {
        console.log('📸 Updating opponent profile image');
        updateOpponentProfileImage(opponentPic);
      }

      const resultData = buildResultData({
        winner: myMongoIdRef.current,
        opponentLeft: true,
        gameResults: data?.gameResults,
        gameResult: 'win',
        opponentProfileImage: opponentPic ?? opponentProfileImageRef.current,
        myProfileImage: myPic ?? myProfileImageRef.current,
      });
      console.log('📊 Result data prepared for opponent-left-game. Calling showResult...');
      showResult(resultData);
    };

    const handleGameAbortedNoStart = (data) => {
      console.log('🚫 game-aborted-no-start received:', data);
      if (hasNavigatedToResultRef.current) {
        console.log('🛑 Already navigated away, ignoring abort');
        return;
      }
      hasNavigatedToResultRef.current = true;
      stopEffect('ticktock');
      setGameEnded(true);
      Alert.alert(
        t('Game Aborted'),
        data?.message || t('Game aborted. No player answered within 15 seconds. No rating change.'),
        [
          {
            text: t('OK'),
            onPress: () => {
              navigation.replace('BottomTab');
            },
          },
        ],
      );
    };

    const handleRejoinGame = (data) => {
      console.log('🔄 rejoin-game received in stale MultiPlayerGame — Lobby handles this, ignoring');
    };

    const handleGameReconnected = (data) => {
      console.log('✅ game-reconnected in stale MultiPlayerGame — Lobby is handling navigation, ignoring');
    };

    const handleReconnectFailed = (data) => {
      console.log('❌ reconnect-failed - grace period expired');
      if (hasNavigatedToResultRef.current) {
        console.log('🛑 Already navigated away, ignoring reconnect-failed');
        return;
      }
      hasNavigatedToResultRef.current = true;
      stopEffect('ticktock');
      setGameEnded(true);
      Alert.alert(
        t('Reconnection Failed'),
        data?.message || t('Grace period expired. Game has ended. Returning to home.'),
        [
          {
            text: t('OK'),
            onPress: () => {
              navigation.replace('BottomTab');
            },
          },
        ],
      );
    };

    const handleError = data => {
      console.error('Socket error:', data);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('match-found', handleMatchFound);
    socket.on('new-question', handleNewQuestion);
    socket.on('next-question', handleNextQuestion);
    socket.on('opponent-score-update', handleOpponentScoreUpdate);
    socket.on('game-ended', handleGameEnded);
    socket.on('post-game-started', handlePostGameStarted);
    socket.on('opponent-disconnected', handleOpponentDisconnected);
    socket.on('opponent-emoji-received', handleOpponentEmoji);
    socket.on('emoji-invalid', handleEmojiInvalid);
    socket.on('emoji-rate-limited', handleEmojiRateLimited);
    socket.on('game-in-grace-period', handleGracePeriod);
    socket.on('grace-period-expired', handleGracePeriodExpired);
    socket.on('opponent-reconnected', handleOpponentReconnected);
    socket.on('timer-synced', handleTimerSynced);
    socket.on('game-aborted-no-start', handleGameAbortedNoStart);
    socket.on('rejoin-game', handleRejoinGame);
    socket.on('game-reconnected', handleGameReconnected);
    socket.on('reconnect-failed', handleReconnectFailed);
    socket.on('rematch-requested', handleRematchRequested);
    socket.on('rematch-accepted', handleRematchAccepted);
    socket.on('rematch-declined', handleRematchDeclined);
    socket.on('game-started', handleGameStarted);
    socket.on('opponent-left-lobby', handleOpponentLeftLobby);
    socket.on('exited-post-game', handleExitedPostGame);
    socket.on('left-game', handleLeftGame);
    socket.on('opponent-left-game', handleOpponentLeftGame);
    socket.on('error', handleError);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('match-found', handleMatchFound);
      socket.off('new-question', handleNewQuestion);
      socket.off('next-question', handleNextQuestion);
      socket.off('opponent-score-update', handleOpponentScoreUpdate);
      socket.off('game-ended', handleGameEnded);
      socket.off('post-game-started', handlePostGameStarted);
      socket.off('opponent-disconnected', handleOpponentDisconnected);
      socket.off('opponent-emoji-received', handleOpponentEmoji);
      socket.off('emoji-invalid', handleEmojiInvalid);
      socket.off('emoji-rate-limited', handleEmojiRateLimited);
      socket.off('game-in-grace-period', handleGracePeriod);
      socket.off('grace-period-expired', handleGracePeriodExpired);
      socket.off('opponent-reconnected', handleOpponentReconnected);
      socket.off('timer-synced', handleTimerSynced);
      socket.off('game-aborted-no-start', handleGameAbortedNoStart);
      socket.off('rejoin-game', handleRejoinGame);
      socket.off('game-reconnected', handleGameReconnected);
      socket.off('reconnect-failed', handleReconnectFailed);
      socket.off('rematch-requested', handleRematchRequested);
      socket.off('rematch-accepted', handleRematchAccepted);
      socket.off('rematch-declined', handleRematchDeclined);
      socket.off('game-started', handleGameStarted);
      socket.off('opponent-left-lobby', handleOpponentLeftLobby);
      socket.off('exited-post-game', handleExitedPostGame);
      socket.off('left-game', handleLeftGame);
      socket.off('opponent-left-game', handleOpponentLeftGame);
      socket.off('error', handleError);
    };
  }, [
    socket,
    opponent,
    difficulty,
    timer,
    navigation,
    showResult,
    buildResultData,
    showBadges,
    diffCode,
    resetQuestionTimer,
    extractFromPlayerProfiles,
    updateMyProfileImage,
    updateOpponentProfileImage,
    captureGameRoomId,
    computeRemainingSeconds,
    startTimerFromAnchor,
  ]);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (gameEnded) return;

    if (!isComputerRef.current && gameStartedAtRef.current) {
      startTimerFromAnchor();
      return () => stopAnchorTimer();
    }

    const interval = setInterval(() => {
      if (!isPaused) {
        totalTimeRef.current -= 1;
        const remaining = totalTimeRef.current;
        setMinutes(Math.floor(remaining / 60));
        setSeconds(remaining % 60);
        if (remaining === 60) {
          console.log('[timer] hit 60 seconds remaining (1 minute). state snapshot:', {
            remaining,
            minutes: Math.floor(remaining / 60),
            seconds: remaining % 60,
            score: scoreRef.current,
            opponentScore: opponentScoreRef.current,
            feedback,
            awaitingResult,
          });
        }
        if (remaining < 60 && remaining >= 0) {
          console.log('[timer] <60s remaining:', { remaining, minutes: Math.floor(remaining / 60), seconds: remaining % 60 });
        }

        if (remaining <= 10 && remaining > 0 && !last10PlayedRef.current) {
          playEffect('ticktock', isSoundOnRef.current);
          last10PlayedRef.current = true;
        }

        if (remaining <= 10 && remaining > 0) {
          Animated.sequence([
            Animated.timing(animateWatch, { toValue: 1.4, duration: 300, useNativeDriver: true }),
            Animated.timing(animateWatch, { toValue: 1, duration: 300, useNativeDriver: true }),
          ]).start();
        }

        if (remaining % 30 === 0 && remaining !== timer && remaining > 0) {
          setIsThirtySecPhase(true);
          playEffect('timer', isSoundOnRef.current);
          Animated.sequence([
            Animated.timing(animateWatch, { toValue: 1.4, duration: 300, useNativeDriver: true }),
            Animated.timing(animateWatch, { toValue: 1, duration: 300, useNativeDriver: true }),
          ]).start(() => setIsThirtySecPhase(false));
        }

        if (remaining <= 0) {
          clearInterval(interval);
          handleTimeUp();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaused, timer, gameEnded, startTimerFromAnchor, stopAnchorTimer]);

  /* ================= HANDLERS ================= */
  const handleTimeUp = useCallback(() => {
    if (!isComputerRef.current && socketRef.current?.connected) {
      socketRef.current.emit('game-ended', {
        reason: 'timeout',
        questionHistory: questionHistoryRef.current,
      });
    }
    showResult(buildResultData());
  }, [showResult, buildResultData]);

  const handleGameExit = useCallback(() => {
    stopEffect('ticktock');
    hasNavigatedToResultRef.current = true;
    setGameEnded(true);

    if (!isComputerRef.current && socketRef.current?.connected) {
      console.log('🚪 Player exiting - emitting leave-game');
      socketRef.current.emit('leave-game');
    }

    navigation.replace('BottomTab');
  }, [navigation]);

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

  const handleToggleReactions = () => {
    if (!emojiDisabled) {
      setIsReactionPickerOpen(prev => !prev);
    }
  };

  const handleSelectReaction = emoji => {
    setIsReactionPickerOpen(false);
    if (!REACTIONS.includes(emoji)) return;
    const now = Date.now();
    if (now - emojiCooldownRef.current < 2000) return;
    if (isComputerRef.current) return;
    if (!socketRef.current?.connected) return;
    socketRef.current.emit('send-emoji', { emoji });
    emojiCooldownRef.current = now;
    setEmojiDisabled(true);
    setTimeout(() => setEmojiDisabled(false), 2000);
  };

  const handleRematch = () => {
    if (isComputerRef.current) {
      handleNewGame();
      return;
    }
    if (!socketRef.current?.connected) {
      Alert.alert(t('Error'), t('Not connected to server.'));
      return;
    }
    socketRef.current.emit('request-rematch');
    rematchStateRef.current = 'requesting';
    setRematchState('requesting');
  };

  const handleNewGame = () => {
    if (!isComputerRef.current) {
      socketRef.current?.emit('exit-post-game');
    }
    navigation.navigate('ChallengeScreen');
  };

  const handleCloseResults = () => {
    if (!isComputerRef.current) {
      socketRef.current?.emit('exit-post-game');
    }
    navigation.navigate('BottomTab');
  };

  /* ================= HANDLE PRESS (answer submission) ================= */
  const handlePress = async value => {
    if (loading || awaitingResult || totalTimeRef.current <= 0 || feedback || gameEnded) return;

    const key = value.toString().toLowerCase();

    if (key === 'clear' || key === 'clr') return setInput('');
    if (key === '⌫' || key === 'del') return setInput(prev => prev.slice(0, -1));
    if (key === 'reverse' || key === 'rev') return setIsReverse(prev => !prev);
    if (key === 'pm') {
      return setInput(prev => (prev.startsWith('-') ? prev.slice(1) : '-' + prev));
    }

    if (key === 'skip') {
      const timeSpent = Date.now() - questionStartTimeRef.current;
      skippedCountRef.current += 1;
      setSkippedCount(skippedCountRef.current);
      setFeedback('skipped');
      playEffect('skipped', isSoundOnRef.current);
      setAnswerHistory(prev => [{ isCorrect: null }, ...prev].slice(0, 8));
      questionHistoryRef.current.push({
        isCorrect: null,
        timeSpent,
        answer: null,
      });
      if (!isComputerRef.current) {
        socketRef.current?.emit('submit-answer', {
          answer: null,
          playerId: myMongoIdRef.current,
          timeSpent,
          skipped: true,
        });
      }
      setTimeout(() => setFeedback(null), 900);
      return;
    }

    const newInput = isReverse ? value + input : input + value;
    setInput(newInput);

    const currentCorrect = correctAnswerRef.current;
    const answerIsBlank = currentCorrect === '' || currentCorrect === null || currentCorrect === undefined;

    if (answerIsBlank || newInput.length >= currentCorrect.length) {
      const timeSpent = Date.now() - questionStartTimeRef.current;
      const isCorrect = !answerIsBlank && newInput === currentCorrect;
      setFeedback(isCorrect ? 'correct' : 'incorrect');
      console.log('[handlePress] answer submitted:', { newInput, isCorrect, remaining: totalTimeRef.current });
      playEffect(isCorrect ? 'correct' : 'incorrect', isSoundOnRef.current);
      setAnswerHistory(prev => [{ isCorrect }, ...prev].slice(0, 8));
      questionHistoryRef.current.push({
        isCorrect,
        timeSpent,
        answer: newInput,
      });

      if (isCorrect) {
        setBonusText('+4 Bonus');
        scoreRef.current += 1;
        setScore(scoreRef.current);
        console.log('[handlePress] incremented score ->', scoreRef.current);
        correctAnswersRef.current += 1;
        setCorrectAnswers(correctAnswersRef.current);
      } else {
        setBonusText('');
        incorrectCountRef.current += 1;
      }

      if (!isComputerRef.current) {
        socketRef.current?.emit('submit-answer', {
          answer: newInput,
          playerId: myMongoIdRef.current,
          timeSpent,
        });
        setAwaitingResult(true);
        console.log('[handlePress] awaiting result set true; remaining:', totalTimeRef.current);
        setTimeout(() => {
          setAwaitingResult(false);
          setFeedback(null);
          setBonusText('');
          console.log('[handlePress] awaiting result cleared by timeout; remaining:', totalTimeRef.current);
        }, 5000);
      } else {
        setAwaitingResult(true);
        const result = await submitAnswerToAPI(newInput);
        setAwaitingResult(false);
        setFeedback(null);
        setBonusText('');
        if (!result) {
          console.error('Failed to get next question from API');
        }
      }
    }
  };

  /* ================= RENDER ================= */
  const content = (
    <View style={[styles.container, { paddingTop: insets.top + 30 }]}>

      {/* TOP BAR */}
      <View style={[styles.topBar, { backgroundColor: theme.cardBackground || '#1E293B' }]}>
        <TouchableOpacity
          onPress={() => {
            if (!gameEnded) {
              Alert.alert(
                t('Leave Game?'),
                t('Are you sure you want to leave? You will lose the match.'),
                [
                  { text: t('Cancel'), style: 'cancel' },
                  { text: t('Leave'), style: 'destructive', onPress: handleGameExit },
                ],
              );
            } else {
              stopEffect('ticktock');
              navigation.goBack();
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
                tintColor: minutes * 60 + seconds <= 10 || isThirtySecPhase ? 'red' : '#fff',
              },
            ]}
          />
          <Text style={styles.timerText}>{`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}</Text>
        </View>

        <TouchableOpacity onPress={handleToggleSound} style={styles.iconButton1}>
          <Icon name={isSoundOn ? 'volume-high' : 'volume-mute'} size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* OPPONENT HEADER */}
      <View style={styles.opponentHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.opponentAvatarContainer}>
            <View style={[styles.avatarCircle, { backgroundColor: '#0F766E', width: 40, height: 40, borderRadius: 8 }]}>
              {opponentProfileImage ? (
                <Image
                  source={{ uri: opponentProfileImage }}
                  style={{ width: 40, height: 40, borderRadius: 8 }}
                  onError={() => setOpponentProfileImage(null)}
                />
              ) : (
                <Text style={styles.avatarInitial}>
                  {opponent?.username?.charAt(0).toUpperCase() || (isComputerRef.current ? '🤖' : 'O')}
                </Text>
              )}
            </View>
            {!isComputerRef.current && <View style={styles.onlineDot} />}

            {opponentEmoji && (
              <View style={styles.opponentEmojiBubble}>
                <Text style={{ fontSize: 20 }}>{opponentEmoji}</Text>
              </View>
            )}

            {graceCountdown !== null && (
              <View style={styles.graceCountdownBubble}>
                <Text style={styles.graceCountdownText}>⏳{graceCountdown}s</Text>
              </View>
            )}
          </View>

          <View style={styles.opponentInfo}>
            <Text style={styles.opponentName} numberOfLines={1}>
              {opponent?.username || (isComputerRef.current ? 'Computer 🤖' : t('Opponent'))}
            </Text>
            {graceCountdown !== null && (
              <Text style={styles.reconnectingText}>{t('Waiting to reconnect...')}</Text>
            )}
            <View style={styles.historyContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.historyScrollContent}>
                {opponentHistory.map((item, index) => {
                  const isRight = typeof item === 'object' && item !== null ? item.isCorrect : item;
                  return (
                    <Icon
                      key={index}
                      name={isRight ? 'checkmark' : 'close'}
                      size={16}
                      color={isRight ? '#10B981' : '#EF4444'}
                      style={{ marginRight: 4 }}
                    />
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </View>

        <View style={styles.headerRight}>
          <Text style={styles.scoreLabel}>{t('Pts')}</Text>
          <Text style={styles.scoreValue}>{opponentScore}</Text>
        </View>
      </View>

      {/* Disconnected banner */}
      {!isComputerRef.current && !isConnected && (
        <View style={styles.disconnectedBanner}>
          <Text style={styles.disconnectedText}>⚠️ {t('Reconnecting...')}</Text>
        </View>
      )}

      {/* MY DATA */}
      <View style={styles.myDataContainer}>
        <View style={styles.headerLeft}>
          <View style={styles.opponentAvatarContainer}>
            <View style={[styles.avatarCircle, { width: 42, height: 42, backgroundColor: '#4F46E5', borderRadius: 8 }]}>
              {(myProfileImage || user?.profilePic) ? (
                <Image
                  source={{ uri: myProfileImage || user.profilePic }}
                  style={{ width: 42, height: 42, borderRadius: 8 }}
                />
              ) : (
                <Text style={styles.avatarInitial}>{user?.username?.charAt(0).toUpperCase() || 'Y'}</Text>
              )}
            </View>
            <View style={styles.youBadge}>
              <Text style={styles.youBadgeText}>{t('YOU')}</Text>
            </View>
          </View>

          <View style={styles.opponentInfo}>
            <Text style={styles.playerName} numberOfLines={1}>
              {user?.username || t('You')}
            </Text>
            <View style={styles.historyContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.historyScrollContent}>
                {answerHistory.map((item, index) => (
                  <Icon
                    key={index}
                    name={item.isCorrect === null ? 'close' : item.isCorrect ? 'checkmark' : 'close'}
                    size={16}
                    color={item.isCorrect === null ? '#FF6B6B' : item.isCorrect ? '#10B981' : '#EF4444'}
                    style={{ marginRight: 4 }}
                  />
                ))}
              </ScrollView>
            </View>
          </View>
        </View>

        <View style={styles.headerRight}>
          <Text style={styles.scoreLabel}>{t('Pts')}</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>
      </View>

      {/* QUESTION AREA */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <Text style={styles.question}>{loading ? t('Loading...') : question}</Text>

        <View style={[
          styles.answerBox,
          { backgroundColor: theme.cardBackground || '#1E293B' },
          feedback === 'correct'   ? { borderColor: 'green',  borderWidth: 2 } :
          feedback === 'incorrect' ? { borderColor: 'red',    borderWidth: 2 } :
          feedback === 'skipped'   ? { borderColor: 'orange', borderWidth: 2 } : {},
        ]}>
          <Text style={[
            styles.answerText,
            feedback === 'correct'   ? { color: 'green'  } :
            feedback === 'incorrect' ? { color: 'red'    } :
            feedback === 'skipped'   ? { color: 'orange' } : {},
          ]}>
            {input || (
              feedback === 'correct'   ? t('Correct')   :
              feedback === 'incorrect' ? t('Incorrect') :
              feedback === 'skipped'   ? t('Skipped')   :
              ''
            )}
          </Text>
        </View>

        {!isComputerRef.current && (
          <TouchableOpacity
            style={[
              styles.speechBubble,
              { position: 'absolute', right: width * 0.1, top: '40%' },
              emojiDisabled && { opacity: 0.4 },
            ]}
            onPress={handleToggleReactions}
            activeOpacity={0.8}
            disabled={emojiDisabled}
          >
            <Icon name="chatbubble-ellipses" size={18} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* REACTION PICKER */}
      {isReactionPickerOpen && (
        <View style={styles.reactionPanel}>
          {REACTIONS.map((emoji, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelectReaction(emoji)}
              style={styles.reactionItem}
            >
              <Text style={styles.reactionText}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* KEYPAD */}
      <View style={styles.keypadContainer}>
        {currentLayout.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keypadRow}>
            {row.map((item, index) => {
              const strItem = item.toString().toLowerCase();
              const isSpecial = ['clear', 'clr', '⌫', 'del', 'ref', 'pm', 'skip', '.', 'reverse'].includes(strItem);
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
              } else {
                keyContent = <Text style={styles.keyText}>{item.toUpperCase()}</Text>;
              }

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handlePress(strItem === 'ref' ? 'reverse' : item)}
                  disabled={gameEnded}
                  style={[
                    styles.keyButton,
                    { borderBottomWidth: 4, borderBottomColor: 'rgba(0,0,0,0.3)' },
                    (isSpecial || strItem === '-') ? styles.specialKey : null,
                    ((strItem === 'ref' || strItem === 'reverse') && isReverse) && {
                      borderBottomColor: 'rgba(0,0,0,0.5)',
                      borderWidth: 0,
                      borderBottomWidth: 4,
                      elevation: 10,
                      shadowColor: theme.primaryColor || '#595CFF',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.5,
                      shadowRadius: 8,
                      transform: [{ scale: revScale }],
                    },
                    gameEnded && { opacity: 0.5 },
                  ]}
                >
                  {(strItem === 'ref' || strItem === 'reverse') && isReverse ? (
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

      {/* ================= RESULT MODAL ================= */}
      {showResultModal && resultData && (
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.resultCard,
              {
                opacity: resultFadeAnim,
                transform: [{ scale: resultScaleAnim }],
                borderColor:
                  resultData.gameResult === 'win'  ? '#4ade80' :
                  resultData.gameResult === 'lose' ? '#f87171' : '#fbbf24',
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => console.log('Share')}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              >
                <Icon name="share-social-outline" size={24} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCloseResults}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              >
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
                {resultData.gameResult === 'win'  ? t('You Won!') :
                 resultData.gameResult === 'lose' ? t('You Lost!') : t('Draw!')}
              </Text>

              {resultData.diffCode && (
                <View style={styles.diffCodeBadge}>
                  <Text style={styles.diffCodeText}>{resultData.diffCode}</Text>
                </View>
              )}

              <View style={styles.modalPlayersContainer}>
                <View style={styles.modalPlayer}>
                  <View style={[styles.avatarCircle, { width: 60, height: 60, backgroundColor: '#4F46E5', marginBottom: 8, borderRadius: 10 }]}>
                    {(resultData.myProfileImage || user?.profilePic) ? (
                      <Image
                        source={{ uri: resultData.myProfileImage || user.profilePic }}
                        style={{ width: 60, height: 60, borderRadius: 10 }}
                      />
                    ) : (
                      <Text style={[styles.avatarInitial, { fontSize: 24 }]}>
                        {user?.username?.charAt(0).toUpperCase() || 'Y'}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.modalPlayerName}>{t('You')}</Text>
                  <Text style={[styles.mainScore, { fontSize: 28 }]}>{resultData.totalScore}</Text>
                </View>

                <View style={styles.vsContainer}>
                  <Text style={styles.modalVsText}>{t('VS')}</Text>
                </View>

                <View style={styles.modalPlayer}>
                  <View style={[styles.avatarCircle, { width: 60, height: 60, backgroundColor: '#0F766E', marginBottom: 8, borderRadius: 10 }]}>
                    {resultData.opponentProfileImage ? (
                      <Image
                        source={{ uri: resultData.opponentProfileImage }}
                        style={{ width: 60, height: 60, borderRadius: 10 }}
                        onError={() => {
                          setResultData(prev => prev ? { ...prev, opponentProfileImage: null } : prev);
                        }}
                      />
                    ) : (
                      <Text style={[styles.avatarInitial, { fontSize: 24 }]}>
                        {isComputerRef.current ? '🤖' : (opponent?.username?.charAt(0).toUpperCase() || 'O')}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.modalPlayerName}>{opponent?.username || (isComputerRef.current ? 'Computer' : t('Opponent'))}</Text>
                  <Text style={[styles.mainScore, { fontSize: 28 }]}>{resultData.opponentScore}</Text>
                </View>
              </View>

              <Text style={{ fontSize: 40, marginTop: 10 }}>
                {resultData.gameResult === 'win' ? '🏆' : resultData.gameResult === 'lose' ? '😥' : '🤝'}
              </Text>
            </View>

            <View style={styles.modalActions}>
              {!isComputerRef.current && rematchState === 'idle' && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.rematchButton]}
                  onPress={handleRematch}
                >
                  <Text style={styles.actionButtonText}>{t('Rematch')}</Text>
                </TouchableOpacity>
              )}

              {!isComputerRef.current && rematchState === 'requesting' && (
                <View style={[styles.actionButton, styles.rematchButton, styles.rematchWaiting]}>
                  <ActivityIndicator size="small" color="#fff" style={{ marginRight: 6 }} />
                  <Text style={styles.actionButtonText}>{t('Waiting...')}</Text>
                </View>
              )}

              {!isComputerRef.current && rematchState === 'waiting' && (
                <View style={[styles.actionButton, styles.rematchButton, styles.rematchWaiting]}>
                  <ActivityIndicator size="small" color="#fff" style={{ marginRight: 6 }} />
                  <Text style={styles.actionButtonText}>{t('Starting...')}</Text>
                </View>
              )}

              {!isComputerRef.current && rematchState === 'countdown' && (
                <View style={[styles.actionButton, styles.rematchCountdownBtn]}>
                  <Text style={styles.rematchCountdownText}>
                    {t('Starting in')} {rematchCountdown}...
                  </Text>
                </View>
              )}

              {!isComputerRef.current && (rematchState === 'declined' || rematchState === 'opponent_left') && (
                <View style={[styles.actionButton, styles.rematchDeclinedBtn]}>
                  <Text style={styles.actionButtonText}>
                    {rematchState === 'declined' ? `❌ ${t('Declined')}` : `🚪 ${t('Left')}`}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={[styles.actionButton, styles.newGameButton]}
                onPress={handleNewGame}
              >
                <Text style={styles.actionButtonText}>{t('New Game')}</Text>
              </TouchableOpacity>
            </View>

            {!isComputerRef.current && (rematchState === 'declined' || rematchState === 'opponent_left') && (
              <Text style={styles.rematchStatusText}>
                {rematchState === 'declined'
                  ? t('Opponent declined the rematch.')
                  : t('Opponent has left the lobby.')}
              </Text>
            )}
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

export default MultiPlayerGame;


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
  iconButton: {
    width: width * 0.35,
    height: 48,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  iconButton1: {
    width: width * 0.35,
    height: 48,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
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
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  opponentAvatarContainer: { position: 'relative' },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#fff',
  },
  opponentEmojiBubble: {
    position: 'absolute',
    top: -24,
    left: -4,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    zIndex: 10,
  },
  graceCountdownBubble: {
    position: 'absolute',
    bottom: -20,
    left: -4,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
    zIndex: 10,
  },
  graceCountdownText: { fontSize: scaleFont(9), color: '#000', fontWeight: '900' },
  opponentInfo: { flex: 1, justifyContent: 'center' },
  opponentName: { fontSize: scaleFont(14), fontWeight: 'bold', color: '#fff', marginBottom: 2 },
  reconnectingText: { fontSize: scaleFont(10), color: '#F59E0B', marginBottom: 2 },
  historyContainer: { height: 20, width: '100%' },
  historyScrollContent: { alignItems: 'center' },
  headerRight: { alignItems: 'flex-end', justifyContent: 'center', paddingLeft: 10 },
  scoreLabel: { fontSize: scaleFont(10), color: '#CBD5E1', fontWeight: '600' },
  scoreValue: { fontSize: scaleFont(18), fontWeight: 'bold', color: '#fff' },
  avatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 4,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: { color: '#fff', fontSize: scaleFont(14), fontWeight: '700' },
  myDataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: width * 0.04,
    marginTop: height * 0.02,
    marginBottom: height * 0.02,
    padding: 10,
  },
  playerName: {
    fontSize: scaleFont(16),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  youBadge: {
    position: 'absolute',
    bottom: -8,
    right: -10,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#0F172A',
  },
  youBadgeText: { fontSize: 8, color: '#000', fontWeight: '900' },
  question: {
    fontSize: scaleFont(22),
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  answerBox: {
    width: width * 0.6,
    minHeight: 50,
    maxHeight: 60,
    backgroundColor: '#1E293B',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  answerText: { fontSize: scaleFont(18), color: '#fff', fontWeight: '600' },
  keypadContainer: { width: '100%', paddingBottom: height * 0.02 },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.015,
    paddingHorizontal: width * 0.05,
  },
  keyButton: {
    width: KEY_BTN_WIDTH,
    height: KEY_BTN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#1C2433',
  },
  specialKey: { backgroundColor: '#1C2433' },
  gradientButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  keyText: {
    fontSize: scaleFont(17),
    color: '#fff',
    fontWeight: '600',
  },
  disconnectedBanner: {
    backgroundColor: '#EF4444',
    padding: 4,
    alignItems: 'center',
    marginHorizontal: width * 0.04,
    marginTop: 8,
    borderRadius: 4,
  },
  disconnectedText: { color: '#fff', fontSize: scaleFont(12), fontWeight: '600' },
  reactionPanel: {
    position: 'absolute',
    right: width * 0.08,
    top: height * 0.17,
    backgroundColor: '#0F172A',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    maxWidth: width * 0.6,
    zIndex: 20,
    elevation: 8,
  },
  reactionItem: { paddingHorizontal: 4, paddingVertical: 2 },
  reactionText: { fontSize: scaleFont(18) },
  speechBubble: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 8,
    borderRadius: 20,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    elevation: 50,
  },
  resultCard: {
    width: '90%',
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 20,
    borderWidth: 2,
    alignItems: 'center',
  },
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  resultContent: { alignItems: 'center', width: '100%' },
  resultBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 10,
  },
  resultBadgeText: { color: '#fff', fontWeight: 'bold', fontSize: 12, letterSpacing: 1 },
  resultTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  mainScore: { fontSize: 36, fontWeight: 'bold', color: '#fff' },
  modalActions: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  rematchButton: { backgroundColor: '#8B5CF6' },
  newGameButton: { backgroundColor: '#3B82F6' },
  actionButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  rematchWaiting: { flexDirection: 'row', justifyContent: 'center', opacity: 0.8 },
  rematchCountdownBtn: {
    backgroundColor: '#F59E0B',
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  rematchCountdownText: { color: '#000', fontSize: 14, fontWeight: '900' },
  rematchDeclinedBtn: {
    backgroundColor: '#374151',
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  rematchStatusText: {
    color: '#94a3b8',
    fontSize: scaleFont(12),
    textAlign: 'center',
    marginTop: 8,
  },
  modalPlayersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
    marginVertical: 15,
  },
  modalPlayer: { alignItems: 'center', width: '35%' },
  modalPlayerName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    textAlign: 'center',
  },
  vsContainer: { justifyContent: 'center', alignItems: 'center' },
  modalVsText: { fontSize: 24, fontWeight: '900', color: '#64748b', fontStyle: 'italic' },
});