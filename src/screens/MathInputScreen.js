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
// // } from 'react-native';
// // import Icon from 'react-native-vector-icons/Ionicons';
// // import LinearGradient from 'react-native-linear-gradient';
// // import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// // import { useSafeAreaInsets } from 'react-native-safe-area-context';
// // import {
// //   useFocusEffect,
// //   useNavigation,
// //   useRoute,
// // } from '@react-navigation/native';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import { stopBackgroundMusic } from '../utils/playBackgroundMusic';
// // import {
// //   initSound,
// //   playEffect,
// //   stopEffect,
// //   releaseAll,
// // } from '../utils/SoundManager';
// // import { useTheme } from '../context/ThemeContext';
// // import { useSound } from '../context/SoundContext';
// // import { KEYPAD_LAYOUTS } from '../utils/keyboardLayouts';
// // import { useAppTranslation } from '../context/TranslationContext';

// // const { width, height } = Dimensions.get('window');
// // const scaleFont = size => size * PixelRatio.getFontScale();

// // const getMathSymbol = word =>
// // ({
// //   Sum: '+',
// //   Difference: '-',
// //   Product: '*',
// //   Quotient: '/',
// //   Modulus: '%',
// //   Exponent: '^',
// // }[word] || word);

// // const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// // const MathInputScreen = () => {
// //   const appState = useRef(AppState.currentState);
// //   const startTimeRef = useRef(null);
// //   const isMounted = useRef(true);

// //   const insets = useSafeAreaInsets();
// //   const navigation = useNavigation();
// //   const route = useRoute();
// //   const { theme, keyboardTheme } = useTheme();
// //   // ✅ NEW — receive diffCode from PlayGame (e.g. "M2", "E4")
// //   const { difficulty, symbol, timer, qm, diffCode } = route.params;
// //   const { t } = useAppTranslation();

// //   const currentLayout = KEYPAD_LAYOUTS[keyboardTheme] || KEYPAD_LAYOUTS.type1;
// //   const isCustomKeyboard = keyboardTheme === 'type1' || keyboardTheme === 'type2';

// //   const [input, setInput] = useState('');
// //   const [isReverse, setIsReverse] = useState(false);
// //   const [question, setQuestion] = useState('');
// //   const [correctAnswer, setCorrectAnswer] = useState('');
// //   const [feedback, setFeedback] = useState(null);
// //   const [isPaused, setIsPaused] = useState(false);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [minutes, setMinutes] = useState(Math.floor(timer / 60));
// //   const [seconds, setSeconds] = useState(timer % 60);
// //   const [animateWatch] = useState(new Animated.Value(1));
// //   const { isSoundOn, toggleSound } = useSound();
// //   const [isThirtySecPhase, setIsThirtySecPhase] = useState(false);

// //   const totalTimeRef = useRef(timer);
// //   const scoreRef = useRef(0);
// //   const correctAnswersRef = useRef(0);
// //   const skippedCountRef = useRef(0);
// //   const incorrectCountRef = useRef(0);
// //   const isSoundOnRef = useRef(true);
// //   const last10PlayedRef = useRef(false);

// //   const [score, setScore] = useState(0);
// //   const [correctAnswers, setCorrectAnswers] = useState(0);
// //   const [skippedCount, setSkippedCount] = useState(0);
// //   const [qmState, setQmState] = useState(parseInt(qm, 10));
// //   const revScale = useRef(new Animated.Value(1)).current;

// //   useEffect(() => {
// //     return () => {
// //       isMounted.current = false;
// //     };
// //   }, []);

// //   const getKeyButtonWidth = () => width * 0.2;
// //   const getKeyButtonHeight = () => height * 0.1;

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

// //   // ✅ NEW — derive diffCode defensively if it wasn't passed through params
// //   // Letter: E/M/H from difficulty; Number: 2 or 4 from symbol count
// //   const resolvedDiffCode = (() => {
// //     if (diffCode) return diffCode;
// //     const letter =
// //       difficulty === 'easy' ? 'E' : difficulty === 'hard' ? 'H' : 'M';
// //     const symbolCount = symbol ? symbol.split(',').length : 2;
// //     const num = symbolCount >= 4 ? '4' : '2';
// //     return `${letter}${num}`;
// //   })();

// //   useEffect(() => {
// //     fetchQuestion();
// //     startTimeRef.current = Date.now();

// //     const interval = setInterval(() => {
// //       if (!isMounted.current) {
// //         clearInterval(interval);
// //         return;
// //       }

// //       const now = Date.now();
// //       const elapsed = Math.floor((now - startTimeRef.current) / 1000);
// //       const remaining = timer - elapsed;
// //       totalTimeRef.current = remaining;

// //       if (!isMounted.current) return;
// //       setMinutes(Math.floor(remaining / 60));
// //       setSeconds(remaining % 60);

// //       if (remaining <= 10 && remaining > 0) {
// //         if (!last10PlayedRef.current) {
// //           playEffect('ticktock', isSoundOnRef.current);
// //           last10PlayedRef.current = true;
// //         }
// //         Animated.sequence([
// //           Animated.timing(animateWatch, { toValue: 1.4, duration: 300, useNativeDriver: true }),
// //           Animated.timing(animateWatch, { toValue: 1, duration: 300, useNativeDriver: true }),
// //         ]).start();
// //       }

// //       if (remaining % 30 === 0 && remaining !== timer && remaining > 0) {
// //         if (!isMounted.current) return;
// //         setIsThirtySecPhase(true);
// //         playEffect('timer', isSoundOnRef.current);
// //         Animated.sequence([
// //           Animated.timing(animateWatch, { toValue: 1.4, duration: 300, useNativeDriver: true }),
// //           Animated.timing(animateWatch, { toValue: 1, duration: 300, useNativeDriver: true }),
// //         ]).start(() => {
// //           if (isMounted.current) setIsThirtySecPhase(false);
// //         });
// //       }

// //       if (remaining <= 0) {
// //         clearInterval(interval);
// //         stopEffect('ticktock');

// //         const incorrectCount = incorrectCountRef.current;
// //         const attempted = correctAnswersRef.current + incorrectCount;
// //         const correctPercentage =
// //           attempted > 0 ? Math.round((correctAnswersRef.current / attempted) * 100) : 0;

// //         // ✅ NEW — call endMatch API with diffCode before navigating away
// //         postPracticeEndMatch({
// //           correctCount: correctAnswersRef.current,
// //           incorrectCount,
// //           skippedCount: skippedCountRef.current,
// //         });

// //         navigation.replace('WellDoneScreen', {
// //           totalScore: scoreRef.current,
// //           correctCount: correctAnswersRef.current,
// //           inCorrectCount: incorrectCount,
// //           skippedQuestions: skippedCountRef.current,
// //           correctPercentage,
// //           difficulty,
// //         });
// //       }
// //     }, 1000);

// //     return () => clearInterval(interval);
// //   }, []);

// //   // ✅ NEW — posts practice session result using diffCode instead of difficulty
// //   // Change 4: POST /api/practice/endMatch now requires diffCode field
// //   const postPracticeEndMatch = async ({ correctCount, incorrectCount, skippedCount }) => {
// //     try {
// //       const token = await AsyncStorage.getItem('accessToken');
// //       if (!token) return;

// //       const body = {
// //         // ✅ NEW — replaces old `difficulty` field
// //         diffCode: resolvedDiffCode,
// //         correctCount,
// //         incorrectCount,
// //         skippedCount,
// //       };

// //       console.log('📤 Practice endMatch payload:', body);

// //       const response = await fetch('http://13.203.232.239:3000/api/practice/endMatch', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           Authorization: `Bearer ${token}`,
// //         },
// //         body: JSON.stringify(body),
// //       });

// //       if (!response.ok) {
// //         console.error('❌ endMatch API error:', response.status);
// //         return;
// //       }

// //       const data = await response.json();
// //       console.log('✅ Practice endMatch response:', data);
// //     } catch (err) {
// //       console.error('❌ postPracticeEndMatch error:', err);
// //     }
// //   };

// //   useEffect(() => {
// //     if (isReverse) {
// //       Animated.loop(
// //         Animated.sequence([
// //           Animated.timing(revScale, { toValue: 1.05, duration: 800, useNativeDriver: true }),
// //           Animated.timing(revScale, { toValue: 1, duration: 800, useNativeDriver: true }),
// //         ])
// //       ).start();
// //     } else {
// //       revScale.setValue(1);
// //     }
// //   }, [isReverse]);

// //   useEffect(() => {
// //     const sub = AppState.addEventListener('change', state => {
// //       if (state !== 'active') {
// //         stopEffect('ticktock');
// //       } else {
// //         if (totalTimeRef.current <= 10 && totalTimeRef.current > 0) {
// //           playEffect('ticktock', isSoundOnRef.current);
// //         }
// //       }
// //     });
// //     return () => sub.remove();
// //   }, []);

// //   useEffect(() => {
// //     const subscription = AppState.addEventListener('change', nextState => {
// //       if (nextState === 'active') {
// //         const now = Date.now();
// //         const elapsed = Math.floor((now - startTimeRef.current) / 1000);
// //         const remaining = timer - elapsed;
// //         totalTimeRef.current = remaining;
// //         if (isMounted.current) {
// //           setMinutes(Math.floor(remaining / 60));
// //           setSeconds(remaining % 60);
// //         }
// //       }
// //       appState.current = nextState;
// //     });
// //     return () => subscription.remove();
// //   }, []);

// //   const fetchQuestion = async () => {
// //     if (!isMounted.current) return;
// //     setIsLoading(true);
// //     setFeedback(null);
// //     try {
// //       const token = await AsyncStorage.getItem('accessToken');
// //       if (!token) {
// //         if (isMounted.current) setQuestion(t('Authorization token missing'));
// //         return;
// //       }
// //       const params = new URLSearchParams({ difficulty, symbol, qm: qmState.toString() });
// //       const response = await fetch(
// //         `http://13.203.232.239:3000/api/question?${params}`,
// //         {
// //           method: 'GET',
// //           headers: {
// //             'Content-Type': 'application/json',
// //             Authorization: `Bearer ${token}`,
// //           },
// //         },
// //       );
// //       if (!response.ok) throw new Error(`Status: ${response.status}`);
// //       const data = await response.json();
// //       const q = data.question;
// //       if (isMounted.current) {
// //         setQuestion(`${String(q.input1)} ${getMathSymbol(q.symbol)} ${String(q.input2)}`);
// //         setCorrectAnswer(String(q.answer));
// //       }
// //     } catch {
// //       if (isMounted.current) setQuestion(t('Failed to load question.'));
// //     } finally {
// //       if (isMounted.current) {
// //         setInput('');
// //         setIsLoading(false);
// //       }
// //     }
// //   };

// //   const handleToggleSound = () => {
// //     toggleSound();
// //     const newVal = !isSoundOn;
// //     isSoundOnRef.current = newVal;
// //     if (!newVal) {
// //       stopEffect('ticktock');
// //     } else {
// //       if (totalTimeRef.current <= 10 && totalTimeRef.current > 0) {
// //         last10PlayedRef.current = false;
// //         playEffect('ticktock', true);
// //       }
// //     }
// //   };

// //   const handlePress = value => {
// //     if (isPaused || totalTimeRef.current <= 0 || isLoading || feedback) return;

// //     const key = value.toString().toLowerCase();

// //     if (key === 'clear' || key === 'clr') return setInput('');

// //     if (key === '⌫' || key === 'del') {
// //       return setInput(prev => prev.slice(0, -1));
// //     }

// //     if (key === 'reverse' || key === 'rev') {
// //       return setIsReverse(prev => !prev);
// //     }

// //     if (key === 'skip') {
// //       setFeedback('skipped');
// //       playEffect('skipped', isSoundOnRef.current);
// //       setSkippedCount(prev => {
// //         skippedCountRef.current = prev + 1;
// //         return prev + 1;
// //       });
// //       return setTimeout(() => {
// //         if (isMounted.current) {
// //           fetchQuestion();
// //           setFeedback(null);
// //         }
// //       }, 1000);
// //     }

// //     if (key === 'pm') {
// //       return setInput(prev => (prev.startsWith('-') ? prev.slice(1) : '-' + prev));
// //     }

// //     const newInput = isReverse ? value + input : input + value;
// //     setInput(newInput);

// //     if (newInput.length >= correctAnswer.length) {
// //       const isCorrect = newInput === correctAnswer;
// //       setFeedback(isCorrect ? 'correct' : 'incorrect');
// //       playEffect(isCorrect ? 'correct' : 'incorrect', isSoundOnRef.current);

// //       setTimeout(() => {
// //         if (!isMounted.current) return;
// //         if (isCorrect) {
// //           scoreRef.current += 2;
// //           correctAnswersRef.current += 1;
// //           setScore(scoreRef.current);
// //           setCorrectAnswers(correctAnswersRef.current);
// //           setQmState(qmState + 2);
// //         } else {
// //           scoreRef.current -= 1;
// //           incorrectCountRef.current += 1;
// //           setScore(scoreRef.current);
// //           if (
// //             (difficulty === 'easy' && qmState > 0) ||
// //             (difficulty === 'medium' && qmState > 6) ||
// //             (difficulty === 'hard' && qmState > 18)
// //           ) {
// //             setQmState(qmState - 1);
// //           }
// //         }
// //         fetchQuestion();
// //         setFeedback(null);
// //       }, 1500);
// //     }
// //   };

// //   const getFeedbackText = () => {
// //     if (feedback === 'correct') return t('Correct');
// //     if (feedback === 'incorrect') return t('Incorrect');
// //     if (feedback === 'skipped') return t('Skipped');
// //     return '';
// //   };

// //   const Content = () => (
// //     <View style={[styles.container, { paddingTop: insets.top + 30 }]}>
// //       {/* Top bar */}
// //       <View style={[styles.topBar, { backgroundColor: theme.cardBackground || '#1E293B' }]}>
// //         <TouchableOpacity
// //           onPress={() => { stopEffect('ticktock'); navigation.goBack(); }}
// //           style={styles.iconButton}
// //           hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
// //         >
// //           <Icon name="caret-back-outline" size={scaleFont(24)} color="#fff" />
// //         </TouchableOpacity>

// //         <View style={styles.timerContainer}>
// //           <Animated.Image
// //             source={require('../assets/Stopwatch.png')}
// //             style={[
// //               styles.timerIcon,
// //               {
// //                 transform: [{ scale: animateWatch }],
// //                 tintColor:
// //                   minutes * 60 + seconds <= 10 || isThirtySecPhase ? 'red' : '#fff',
// //               },
// //             ]}
// //           />
// //           <Text style={styles.timerText}>
// //             {`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}
// //           </Text>
// //         </View>

// //         <TouchableOpacity onPress={handleToggleSound} style={styles.iconButton1}>
// //           <Icon name={isSoundOn ? 'volume-high' : 'volume-mute'} size={24} color="#fff" />
// //         </TouchableOpacity>
// //       </View>

// //       {/* Question + Answer area */}
// //       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
// //         <Text style={styles.question}>{question}</Text>

// //         <View
// //           style={[
// //             styles.answerBox,
// //             { backgroundColor: theme.cardBackground || '#1E293B' },
// //             feedback === 'correct'   ? { borderColor: 'green',  borderWidth: 2 } :
// //             feedback === 'incorrect' ? { borderColor: 'red',    borderWidth: 2 } :
// //             feedback === 'skipped'   ? { borderColor: 'orange', borderWidth: 2 } : {},
// //           ]}
// //         >
// //           <Text
// //             style={[
// //               styles.answerText,
// //               feedback === 'correct'   ? { color: 'green'  } :
// //               feedback === 'incorrect' ? { color: 'red'    } :
// //               feedback === 'skipped'   ? { color: 'orange' } : {},
// //             ]}
// //           >
// //             {input || getFeedbackText()}
// //           </Text>
// //         </View>
// //       </View>

// //       {/* Keypad */}
// //       <View style={styles.keypadContainer}>
// //         {currentLayout.map((row, rowIndex) => (
// //           <View key={rowIndex} style={styles.keypadRow}>
// //             {row.map((item, index) => {
// //               const strItem = item.toString().toLowerCase();
// //               const isSpecial = ['clear', 'clr', '⌫', 'del', 'ref', 'pm', 'skip', '.', 'reverse'].includes(strItem);
// //               const isNa = strItem === 'na';

// //               if (isNa) return (
// //                 <View key={index} style={{ width: getKeyButtonWidth(), height: getKeyButtonHeight() }} />
// //               );

// //               let content;
// //               if (strItem === 'del' || strItem === '⌫') {
// //                 content = <MaterialIcons name="backspace" size={24} color="#fff" />;
// //               } else if (strItem === 'ref' || strItem === 'reverse') {
// //                 content = (
// //                   <Text style={[styles.keyText, { fontSize: scaleFont(16), fontWeight: '800', fontStyle: 'italic' }]}>
// //                     {t('REV')}
// //                   </Text>
// //                 );
// //               } else if (strItem === 'pm') {
// //                 content = <Text style={[styles.keyText, { color: '#fff' }]}>+/-</Text>;
// //               } else if (strItem === 'clr' || strItem === 'clear') {
// //                 content = (
// //                   <Text style={[styles.keyText, { color: '#fff' }]}>
// //                     {t('Clear')}
// //                   </Text>
// //                 );
// //               } else if (strItem === 'skip') {
// //                 content = (
// //                   <View style={{ alignItems: 'center', flexDirection: 'row' }}>
// //                     <Text style={[styles.keyText, { fontSize: scaleFont(14) }]}>
// //                       {t('Skip')}
// //                     </Text>
// //                     <MaterialIcons name="skip-next" size={24} color="#fff" />
// //                   </View>
// //                 );
// //               } else {
// //                 content = <Text style={styles.keyText}>{item.toUpperCase()}</Text>;
// //               }

// //               return (
// //                 <AnimatedTouchableOpacity
// //                   key={index}
// //                   onPress={() => handlePress(strItem === 'ref' ? 'reverse' : item)}
// //                   style={[
// //                     styles.keyButton,
// //                     {
// //                       width: getKeyButtonWidth(),
// //                       height: getKeyButtonHeight(),
// //                       borderBottomWidth: 4,
// //                       borderBottomColor: 'rgba(0,0,0,0.3)',
// //                     },
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
// //                   ]}
// //                 >
// //                   {(strItem === 'ref' || strItem === 'reverse') && isReverse ? (
// //                     <LinearGradient
// //                       colors={theme.buttonGradient || [theme.primaryColor || '#595CFF', theme.secondaryColor || '#87AEE9']}
// //                       style={styles.gradientButton}
// //                     >
// //                       {content}
// //                     </LinearGradient>
// //                   ) : !isSpecial && strItem !== '-' ? (
// //                     <LinearGradient
// //                       colors={theme.buttonGradient || [theme.primaryColor || '#595CFF', theme.secondaryColor || '#87AEE9']}
// //                       style={styles.gradientButton}
// //                     >
// //                       {content}
// //                     </LinearGradient>
// //                   ) : (
// //                     <View style={{ alignItems: 'center', justifyContent: 'center' }}>
// //                       {content}
// //                     </View>
// //                   )}
// //                 </AnimatedTouchableOpacity>
// //               );
// //             })}
// //           </View>
// //         ))}
// //       </View>
// //     </View>
// //   );

// //   return theme.backgroundGradient ? (
// //     <LinearGradient colors={theme.backgroundGradient} style={{ flex: 1 }}>
// //       <Content />
// //     </LinearGradient>
// //   ) : (
// //     <View style={{ flex: 1, backgroundColor: theme.backgroundColor || '#0B1220' }}>
// //       <Content />
// //     </View>
// //   );
// // };

// // export default MathInputScreen;

// // const styles = StyleSheet.create({
// //   container: { flex: 1 },
// //   topBar: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     paddingHorizontal: width * 0.04,
// //     borderBottomEndRadius: 15,
// //     borderBottomStartRadius: 15,
// //     height: 60,
// //   },
// //   iconButton: {
// //     width: width * 0.35,
// //     height: width * 0.12,
// //     justifyContent: 'center',
// //     alignItems: 'flex-start',
// //   },
// //   iconButton1: {
// //     width: width * 0.35,
// //     height: width * 0.12,
// //     justifyContent: 'center',
// //     alignItems: 'flex-end',
// //   },
// //   timerContainer: { flexDirection: 'row', alignItems: 'center', gap: 5 },
// //   timerText: {
// //     color: '#fff',
// //     fontSize: scaleFont(13),
// //     fontWeight: '600',
// //     opacity: 0.7,
// //   },
// //   timerIcon: { width: 18, height: 18 },
// //   question: {
// //     fontSize: scaleFont(22),
// //     color: '#fff',
// //     textAlign: 'center',
// //     fontWeight: 'bold',
// //     marginBottom: 20,
// //   },
// //   answerBox: {
// //     width: width * 0.6,
// //     height: height * 0.06,
// //     backgroundColor: '#1E293B',
// //     borderRadius: 10,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     alignSelf: 'center',
// //   },
// //   answerText: { fontSize: scaleFont(18), color: '#fff', fontWeight: '600' },
// //   keypadContainer: {
// //     width: '100%',
// //     paddingBottom: height * 0.02,
// //   },
// //   keypadRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     marginBottom: height * 0.02,
// //     paddingHorizontal: width * 0.05,
// //   },
// //   keyButton: {
// //     width: width * 0.2,
// //     height: height * 0.1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderRadius: 10,
// //     backgroundColor: '#1C2433',
// //   },
// //   specialKey: { backgroundColor: '#1C2433' },
// //   gradientButton: {
// //     width: '100%',
// //     height: '100%',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderRadius: 10,
// //   },
// //   keyText: { fontSize: scaleFont(18), color: '#fff', fontWeight: '600' },
// // });

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
// // } from 'react-native';
// // import Icon from 'react-native-vector-icons/Ionicons';
// // import LinearGradient from 'react-native-linear-gradient';
// // import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// // import { useSafeAreaInsets } from 'react-native-safe-area-context';
// // import {
// //   useFocusEffect,
// //   useNavigation,
// //   useRoute,
// // } from '@react-navigation/native';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import { stopBackgroundMusic } from '../utils/playBackgroundMusic';
// // import {
// //   initSound,
// //   playEffect,
// //   stopEffect,
// //   releaseAll,
// // } from '../utils/SoundManager';
// // import { useTheme } from '../context/ThemeContext';
// // import { useSound } from '../context/SoundContext';
// // import { KEYPAD_LAYOUTS } from '../utils/keyboardLayouts';
// // import { useAppTranslation } from '../context/TranslationContext';

// // const { width, height } = Dimensions.get('window');
// // const scaleFont = size => size * PixelRatio.getFontScale();

// // const getMathSymbol = word =>
// // ({
// //   Sum: '+',
// //   Difference: '-',
// //   Product: '*',
// //   Quotient: '/',
// //   Modulus: '%',
// //   Exponent: '^',
// // }[word] || word);

// // const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// // const MathInputScreen = () => {
// //   const appState = useRef(AppState.currentState);
// //   const startTimeRef = useRef(null);
// //   const isMounted = useRef(true);

// //   const insets = useSafeAreaInsets();
// //   const navigation = useNavigation();
// //   const route = useRoute();
// //   const { theme, keyboardTheme } = useTheme();
// //   const { difficulty, symbol, timer, qm, diffCode } = route.params;
// //   const { t } = useAppTranslation();

// //   const currentLayout = KEYPAD_LAYOUTS[keyboardTheme] || KEYPAD_LAYOUTS.type1;
// //   const isCustomKeyboard = keyboardTheme === 'type1' || keyboardTheme === 'type2';

// //   const [input, setInput] = useState('');
// //   const [isReverse, setIsReverse] = useState(false);
// //   const [question, setQuestion] = useState('');
// //   const [correctAnswer, setCorrectAnswer] = useState('');
// //   const [feedback, setFeedback] = useState(null);
// //   const [isPaused, setIsPaused] = useState(false);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [minutes, setMinutes] = useState(Math.floor(timer / 60));
// //   const [seconds, setSeconds] = useState(timer % 60);
// //   const [animateWatch] = useState(new Animated.Value(1));
// //   const { isSoundOn, toggleSound } = useSound();
// //   const [isThirtySecPhase, setIsThirtySecPhase] = useState(false);

// //   const totalTimeRef = useRef(timer);
// //   const scoreRef = useRef(0);
// //   const correctAnswersRef = useRef(0);
// //   const skippedCountRef = useRef(0);
// //   const incorrectCountRef = useRef(0);
// //   const isSoundOnRef = useRef(true);
// //   const last10PlayedRef = useRef(false);

// //   const [score, setScore] = useState(0);
// //   const [correctAnswers, setCorrectAnswers] = useState(0);
// //   const [skippedCount, setSkippedCount] = useState(0);
// //   const [qmState, setQmState] = useState(parseInt(qm, 10));
// //   const revScale = useRef(new Animated.Value(1)).current;

// //   // ── ✅ NEW: track every question response for backend stats ──────────────
// //   // Each entry: { playerResponse: { isCorrect, timeSpent, skipped, answer } }
// //   const questionHistoryRef = useRef([]);
// //   // Timestamp (ms) when the current question was shown to the player
// //   const questionStartTimeRef = useRef(Date.now());
// //   // ─────────────────────────────────────────────────────────────────────────

// //   useEffect(() => {
// //     return () => {
// //       isMounted.current = false;
// //     };
// //   }, []);

// //   const getKeyButtonWidth = () => width * 0.2;
// //   const getKeyButtonHeight = () => height * 0.1;

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

// //   // Derive diffCode defensively if it wasn't passed through params
// //   const resolvedDiffCode = (() => {
// //     if (diffCode) return diffCode;
// //     const letter =
// //       difficulty === 'easy' ? 'E' : difficulty === 'hard' ? 'H' : 'M';
// //     const symbolCount = symbol ? symbol.split(',').length : 2;
// //     const num = symbolCount >= 4 ? '4' : '2';
// //     return `${letter}${num}`;
// //   })();

// //   useEffect(() => {
// //     fetchQuestion();
// //     startTimeRef.current = Date.now();
// //     // ✅ NEW: start per-question timer from the very first question
// //     questionStartTimeRef.current = Date.now();

// //     const interval = setInterval(() => {
// //       if (!isMounted.current) {
// //         clearInterval(interval);
// //         return;
// //       }

// //       const now = Date.now();
// //       const elapsed = Math.floor((now - startTimeRef.current) / 1000);
// //       const remaining = timer - elapsed;
// //       totalTimeRef.current = remaining;

// //       if (!isMounted.current) return;
// //       setMinutes(Math.floor(remaining / 60));
// //       setSeconds(remaining % 60);

// //       if (remaining <= 10 && remaining > 0) {
// //         if (!last10PlayedRef.current) {
// //           playEffect('ticktock', isSoundOnRef.current);
// //           last10PlayedRef.current = true;
// //         }
// //         Animated.sequence([
// //           Animated.timing(animateWatch, { toValue: 1.4, duration: 300, useNativeDriver: true }),
// //           Animated.timing(animateWatch, { toValue: 1, duration: 300, useNativeDriver: true }),
// //         ]).start();
// //       }

// //       if (remaining % 30 === 0 && remaining !== timer && remaining > 0) {
// //         if (!isMounted.current) return;
// //         setIsThirtySecPhase(true);
// //         playEffect('timer', isSoundOnRef.current);
// //         Animated.sequence([
// //           Animated.timing(animateWatch, { toValue: 1.4, duration: 300, useNativeDriver: true }),
// //           Animated.timing(animateWatch, { toValue: 1, duration: 300, useNativeDriver: true }),
// //         ]).start(() => {
// //           if (isMounted.current) setIsThirtySecPhase(false);
// //         });
// //       }

// //       if (remaining <= 0) {
// //         clearInterval(interval);
// //         stopEffect('ticktock');

// //         const incorrectCount = incorrectCountRef.current;
// //         const attempted = correctAnswersRef.current + incorrectCount;
// //         const correctPercentage =
// //           attempted > 0 ? Math.round((correctAnswersRef.current / attempted) * 100) : 0;

// //         // ✅ NEW: pass full questionHistory to endMatch
// //         postPracticeEndMatch({
// //           correctCount:   correctAnswersRef.current,
// //           incorrectCount,
// //           skippedCount:   skippedCountRef.current,
// //           questionHistory: questionHistoryRef.current,
// //         });

// //         navigation.replace('WellDoneScreen', {
// //           totalScore:         scoreRef.current,
// //           correctCount:       correctAnswersRef.current,
// //           inCorrectCount:     incorrectCount,
// //           skippedQuestions:   skippedCountRef.current,
// //           correctPercentage,
// //           difficulty,
// //         });
// //       }
// //     }, 1000);

// //     return () => clearInterval(interval);
// //   }, []);

// //   // ── ✅ NEW: postPracticeEndMatch now includes questionHistory ─────────────
// //   const postPracticeEndMatch = async ({
// //     correctCount,
// //     incorrectCount,
// //     skippedCount,
// //     questionHistory,
// //   }) => {
// //     try {
// //       const token = await AsyncStorage.getItem('accessToken');
// //       if (!token) return;

// //       // Debug logging (matches doc format)
// //       console.log('🔍 Question History Length:', questionHistory.length);
// //       if (questionHistory.length > 0) {
// //         console.log('🔍 Sample Response:', questionHistory[0]);
// //         console.log(
// //           '🔍 Correct:',
// //           questionHistory.filter(r => r.playerResponse.isCorrect === true).length,
// //         );
// //         console.log(
// //           '🔍 Incorrect:',
// //           questionHistory.filter(
// //             r => r.playerResponse.isCorrect === false && !r.playerResponse.skipped,
// //           ).length,
// //         );
// //         console.log(
// //           '🔍 Skipped:',
// //           questionHistory.filter(r => r.playerResponse.skipped === true).length,
// //         );
// //       }

// //       const body = {
// //         diffCode:        resolvedDiffCode,
// //         correctCount,
// //         incorrectCount,
// //         skippedCount,
// //         // ✅ NEW: full per-question history in the shape the backend expects
// //         questionHistory,
// //         gameDuration:    timer,
// //       };

// //       console.log('📤 Practice endMatch payload:', JSON.stringify(body, null, 2));

// //       const response = await fetch('http://13.203.232.239:3000/api/practice/endMatch', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           Authorization:  `Bearer ${token}`,
// //         },
// //         body: JSON.stringify(body),
// //       });
// //       const rawText = await response.text();
// // console.log('🔍 RAW RESPONSE:', rawText);
// // console.log('🔍 STATUS:', response.status);

// // const data2 = JSON.parse(rawText);

// //       if (!response.ok) {
// //         console.error('❌ endMatch API error:', response.status);
// //         return;
// //       }

// //       const data = await response.json();
// //       console.log('✅ Practice endMatch response:', data);
// //     } catch (err) {
// //       console.error('❌ postPracticeEndMatch error:', err);
// //     }
// //   };
// //   // ─────────────────────────────────────────────────────────────────────────

// //   useEffect(() => {
// //     if (isReverse) {
// //       Animated.loop(
// //         Animated.sequence([
// //           Animated.timing(revScale, { toValue: 1.05, duration: 800, useNativeDriver: true }),
// //           Animated.timing(revScale, { toValue: 1, duration: 800, useNativeDriver: true }),
// //         ])
// //       ).start();
// //     } else {
// //       revScale.setValue(1);
// //     }
// //   }, [isReverse]);

// //   useEffect(() => {
// //     const sub = AppState.addEventListener('change', state => {
// //       if (state !== 'active') {
// //         stopEffect('ticktock');
// //       } else {
// //         if (totalTimeRef.current <= 10 && totalTimeRef.current > 0) {
// //           playEffect('ticktock', isSoundOnRef.current);
// //         }
// //       }
// //     });
// //     return () => sub.remove();
// //   }, []);

// //   useEffect(() => {
// //     const subscription = AppState.addEventListener('change', nextState => {
// //       if (nextState === 'active') {
// //         const now = Date.now();
// //         const elapsed = Math.floor((now - startTimeRef.current) / 1000);
// //         const remaining = timer - elapsed;
// //         totalTimeRef.current = remaining;
// //         if (isMounted.current) {
// //           setMinutes(Math.floor(remaining / 60));
// //           setSeconds(remaining % 60);
// //         }
// //       }
// //       appState.current = nextState;
// //     });
// //     return () => subscription.remove();
// //   }, []);

// //   // ── ✅ NEW: reset per-question timer whenever a fresh question is loaded ──
// //   const fetchQuestion = async () => {
// //     if (!isMounted.current) return;
// //     setIsLoading(true);
// //     setFeedback(null);
// //     try {
// //       const token = await AsyncStorage.getItem('accessToken');
// //       if (!token) {
// //         if (isMounted.current) setQuestion(t('Authorization token missing'));
// //         return;
// //       }
// //       const params = new URLSearchParams({ diffCode: resolvedDiffCode, symbol, qm: qmState.toString() });
// //       const response = await fetch(
// //         `http://13.203.232.239:3000/api/question?${params}`,
// //         {
// //           method: 'GET',
// //           headers: {
// //             'Content-Type': 'application/json',
// //             Authorization:  `Bearer ${token}`,
// //           },
// //         },
// //       );
// //       if (!response.ok) throw new Error(`Status: ${response.status}`);
// //       const data = await response.json();
// //       const q = data.question;
// //       if (isMounted.current) {
// //         setQuestion(`${String(q.input1)} ${getMathSymbol(q.symbol)} ${String(q.input2)}`);
// //         setCorrectAnswer(String(q.answer));
// //         // ✅ NEW: start timing for this new question
// //         questionStartTimeRef.current = Date.now();
// //       }
// //     } catch {
// //       if (isMounted.current) setQuestion(t('Failed to load question.'));
// //     } finally {
// //       if (isMounted.current) {
// //         setInput('');
// //         setIsLoading(false);
// //       }
// //     }
// //   };

// //   const handleToggleSound = () => {
// //     toggleSound();
// //     const newVal = !isSoundOn;
// //     isSoundOnRef.current = newVal;
// //     if (!newVal) {
// //       stopEffect('ticktock');
// //     } else {
// //       if (totalTimeRef.current <= 10 && totalTimeRef.current > 0) {
// //         last10PlayedRef.current = false;
// //         playEffect('ticktock', true);
// //       }
// //     }
// //   };

// //   const handlePress = value => {
// //     if (isPaused || totalTimeRef.current <= 0 || isLoading || feedback) return;

// //     const key = value.toString().toLowerCase();

// //     if (key === 'clear' || key === 'clr') return setInput('');

// //     if (key === '⌫' || key === 'del') {
// //       return setInput(prev => prev.slice(0, -1));
// //     }

// //     if (key === 'reverse' || key === 'rev') {
// //       return setIsReverse(prev => !prev);
// //     }

// //     if (key === 'skip') {
// //       // ✅ NEW: measure time spent and record skip in history
// //       const timeSpent = Date.now() - questionStartTimeRef.current;
// //       questionHistoryRef.current.push({
// //         playerResponse: {
// //           isCorrect: false,
// //           timeSpent,
// //           skipped:   true,
// //           answer:    null,
// //         },
// //       });

// //       setFeedback('skipped');
// //       playEffect('skipped', isSoundOnRef.current);
// //       setSkippedCount(prev => {
// //         skippedCountRef.current = prev + 1;
// //         return prev + 1;
// //       });
// //       return setTimeout(() => {
// //         if (isMounted.current) {
// //           fetchQuestion(); // resets questionStartTimeRef internally
// //           setFeedback(null);
// //         }
// //       }, 1000);
// //     }

// //     if (key === 'pm') {
// //       return setInput(prev => (prev.startsWith('-') ? prev.slice(1) : '-' + prev));
// //     }

// //     const newInput = isReverse ? value + input : input + value;
// //     setInput(newInput);

// //     if (newInput.length === correctAnswer.length) {
// //       const isCorrect = newInput === correctAnswer;

// //       // ✅ NEW: measure time spent and record answer in history
// //       const timeSpent = Date.now() - questionStartTimeRef.current;
// //       questionHistoryRef.current.push({
// //         playerResponse: {
// //           isCorrect,
// //           timeSpent,
// //           skipped: false,
// //           answer:  newInput,
// //         },
// //       });

// //       setFeedback(isCorrect ? 'correct' : 'incorrect');
// //       playEffect(isCorrect ? 'correct' : 'incorrect', isSoundOnRef.current);

// //       setTimeout(() => {
// //         if (!isMounted.current) return;
// //         if (isCorrect) {
// //           scoreRef.current += 2;
// //           correctAnswersRef.current += 1;
// //           setScore(scoreRef.current);
// //           setCorrectAnswers(correctAnswersRef.current);
// //           setQmState(qmState + 2);
// //         } else {
// //           scoreRef.current -= 1;
// //           incorrectCountRef.current += 1;
// //           setScore(scoreRef.current);
// //           if (
// //             (difficulty === 'easy'   && qmState > 0)  ||
// //             (difficulty === 'medium' && qmState > 6)  ||
// //             (difficulty === 'hard'   && qmState > 18)
// //           ) {
// //             setQmState(qmState - 1);
// //           }
// //         }
// //         fetchQuestion(); // resets questionStartTimeRef internally
// //         setFeedback(null);
// //       }, 1500);
// //     }
// //   };

// //   const getFeedbackText = () => {
// //     if (feedback === 'correct')   return t('Correct');
// //     if (feedback === 'incorrect') return t('Incorrect');
// //     if (feedback === 'skipped')   return t('Skipped');
// //     return '';
// //   };

// //   const Content = () => (
// //     <View style={[styles.container, { paddingTop: insets.top + 30 }]}>
// //       {/* Top bar */}
// //       <View style={[styles.topBar, { backgroundColor: theme.cardBackground || '#1E293B' }]}>
// //         <TouchableOpacity
// //           onPress={() => { stopEffect('ticktock'); navigation.goBack(); }}
// //           style={styles.iconButton}
// //           hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
// //         >
// //           <Icon name="caret-back-outline" size={scaleFont(24)} color="#fff" />
// //         </TouchableOpacity>

// //         <View style={styles.timerContainer}>
// //           <Animated.Image
// //             source={require('../assets/Stopwatch.png')}
// //             style={[
// //               styles.timerIcon,
// //               {
// //                 transform: [{ scale: animateWatch }],
// //                 tintColor:
// //                   minutes * 60 + seconds <= 10 || isThirtySecPhase ? 'red' : '#fff',
// //               },
// //             ]}
// //           />
// //           <Text style={styles.timerText}>
// //             {`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}
// //           </Text>
// //         </View>

// //         <TouchableOpacity onPress={handleToggleSound} style={styles.iconButton1}>
// //           <Icon name={isSoundOn ? 'volume-high' : 'volume-mute'} size={24} color="#fff" />
// //         </TouchableOpacity>
// //       </View>

// //       {/* Question + Answer area */}
// //       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
// //         <Text style={styles.question}>{question}</Text>

// //         <View
// //           style={[
// //             styles.answerBox,
// //             { backgroundColor: theme.cardBackground || '#1E293B' },
// //             feedback === 'correct'   ? { borderColor: 'green',  borderWidth: 2 } :
// //             feedback === 'incorrect' ? { borderColor: 'red',    borderWidth: 2 } :
// //             feedback === 'skipped'   ? { borderColor: 'orange', borderWidth: 2 } : {},
// //           ]}
// //         >
// //           <Text
// //             style={[
// //               styles.answerText,
// //               feedback === 'correct'   ? { color: 'green'  } :
// //               feedback === 'incorrect' ? { color: 'red'    } :
// //               feedback === 'skipped'   ? { color: 'orange' } : {},
// //             ]}
// //           >
// //             {input || getFeedbackText()}
// //           </Text>
// //         </View>
// //       </View>

// //       {/* Keypad */}
// //       <View style={styles.keypadContainer}>
// //         {currentLayout.map((row, rowIndex) => (
// //           <View key={rowIndex} style={styles.keypadRow}>
// //             {row.map((item, index) => {
// //               const strItem = item.toString().toLowerCase();
// //               const isSpecial = ['clear', 'clr', '⌫', 'del', 'ref', 'pm', 'skip', '.', 'reverse'].includes(strItem);
// //               const isNa = strItem === 'na';

// //               if (isNa) return (
// //                 <View key={index} style={{ width: getKeyButtonWidth(), height: getKeyButtonHeight() }} />
// //               );

// //               let content;
// //               if (strItem === 'del' || strItem === '⌫') {
// //                 content = <MaterialIcons name="backspace" size={24} color="#fff" />;
// //               } else if (strItem === 'ref' || strItem === 'reverse') {
// //                 content = (
// //                   <Text style={[styles.keyText, { fontSize: scaleFont(16), fontWeight: '800', fontStyle: 'italic' }]}>
// //                     {t('REV')}
// //                   </Text>
// //                 );
// //               } else if (strItem === 'pm') {
// //                 content = <Text style={[styles.keyText, { color: '#fff' }]}>+/-</Text>;
// //               } else if (strItem === 'clr' || strItem === 'clear') {
// //                 content = (
// //                   <Text style={[styles.keyText, { color: '#fff' }]}>
// //                     {t('Clear')}
// //                   </Text>
// //                 );
// //               } else if (strItem === 'skip') {
// //                 content = (
// //                   <View style={{ alignItems: 'center', flexDirection: 'row' }}>
// //                     <Text style={[styles.keyText, { fontSize: scaleFont(14) }]}>
// //                       {t('Skip')}
// //                     </Text>
// //                     <MaterialIcons name="skip-next" size={24} color="#fff" />
// //                   </View>
// //                 );
// //               } else {
// //                 content = <Text style={styles.keyText}>{item.toUpperCase()}</Text>;
// //               }

// //               return (
// //                 <AnimatedTouchableOpacity
// //                   key={index}
// //                   onPress={() => handlePress(strItem === 'ref' ? 'reverse' : item)}
// //                   style={[
// //                     styles.keyButton,
// //                     {
// //                       width:            getKeyButtonWidth(),
// //                       height:           getKeyButtonHeight(),
// //                       borderBottomWidth: 4,
// //                       borderBottomColor: 'rgba(0,0,0,0.3)',
// //                     },
// //                     (isSpecial || strItem === '-') ? styles.specialKey : null,
// //                     ((strItem === 'ref' || strItem === 'reverse') && isReverse) && {
// //                       borderBottomColor: 'rgba(0,0,0,0.5)',
// //                       borderWidth:       0,
// //                       borderBottomWidth: 4,
// //                       elevation:         10,
// //                       shadowColor:       theme.primaryColor || '#595CFF',
// //                       shadowOffset:      { width: 0, height: 4 },
// //                       shadowOpacity:     0.5,
// //                       shadowRadius:      8,
// //                       transform:         [{ scale: revScale }],
// //                     },
// //                   ]}
// //                 >
// //                   {(strItem === 'ref' || strItem === 'reverse') && isReverse ? (
// //                     <LinearGradient
// //                       colors={theme.buttonGradient || [theme.primaryColor || '#595CFF', theme.secondaryColor || '#87AEE9']}
// //                       style={styles.gradientButton}
// //                     >
// //                       {content}
// //                     </LinearGradient>
// //                   ) : !isSpecial && strItem !== '-' ? (
// //                     <LinearGradient
// //                       colors={theme.buttonGradient || [theme.primaryColor || '#595CFF', theme.secondaryColor || '#87AEE9']}
// //                       style={styles.gradientButton}
// //                     >
// //                       {content}
// //                     </LinearGradient>
// //                   ) : (
// //                     <View style={{ alignItems: 'center', justifyContent: 'center' }}>
// //                       {content}
// //                     </View>
// //                   )}
// //                 </AnimatedTouchableOpacity>
// //               );
// //             })}
// //           </View>
// //         ))}
// //       </View>
// //     </View>
// //   );

// //   return theme.backgroundGradient ? (
// //     <LinearGradient colors={theme.backgroundGradient} style={{ flex: 1 }}>
// //       <Content />
// //     </LinearGradient>
// //   ) : (
// //     <View style={{ flex: 1, backgroundColor: theme.backgroundColor || '#0B1220' }}>
// //       <Content />
// //     </View>
// //   );
// // };

// // export default MathInputScreen;
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
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import LinearGradient from 'react-native-linear-gradient';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import {
//   useFocusEffect,
//   useNavigation,
//   useRoute,
// } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { stopBackgroundMusic } from '../utils/playBackgroundMusic';
// import {
//   initSound,
//   playEffect,
//   stopEffect,
//   releaseAll,
// } from '../utils/SoundManager';
// import { useTheme } from '../context/ThemeContext';
// import { useSound } from '../context/SoundContext';
// import { KEYPAD_LAYOUTS } from '../utils/keyboardLayouts';
// import { useAppTranslation } from '../context/TranslationContext';
// import { authFetch as fetch } from '../utils/authFetch'; // auto-refresh wrapper for expired access tokens

// const { width, height } = Dimensions.get('window');
// const scaleFont = size => size * PixelRatio.getFontScale();

// const getMathSymbol = word =>
// ({
//   Sum: '+',
//   Difference: '-',
//   Product: '*',
//   Quotient: '/',
//   Modulus: '%',
//   Exponent: '^',
// }[word] || word);

// const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// const MathInputScreen = () => {
//   const appState = useRef(AppState.currentState);
//   const startTimeRef = useRef(null);
//   const isMounted = useRef(true);

//   const insets = useSafeAreaInsets();
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { theme, keyboardTheme } = useTheme();
//   const { difficulty, symbol, timer, qm, diffCode } = route.params;
//   const { t } = useAppTranslation();

//   const currentLayout = KEYPAD_LAYOUTS[keyboardTheme] || KEYPAD_LAYOUTS.type1;

//   const [input, setInput] = useState('');
//   const [isReverse, setIsReverse] = useState(false);
//   const [question, setQuestion] = useState('');
//   const [feedback, setFeedback] = useState(null);
//   const [isPaused, setIsPaused] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [minutes, setMinutes] = useState(Math.floor(timer / 60));
//   const [seconds, setSeconds] = useState(timer % 60);
//   const [animateWatch] = useState(new Animated.Value(1));
//   const { isSoundOn, toggleSound } = useSound();
//   const [isThirtySecPhase, setIsThirtySecPhase] = useState(false);

//   const totalTimeRef = useRef(timer);
//   const scoreRef = useRef(0);
//   const finalScoreRef = useRef(0);
//   const correctAnswersRef = useRef(0);
//   const skippedCountRef = useRef(0);
//   const incorrectCountRef = useRef(0);
//   const isSoundOnRef = useRef(true);
//   const last10PlayedRef = useRef(false);
//   const questionHistoryRef = useRef([]);
//   const questionStartTimeRef = useRef(Date.now());

//   const sessionQMRef = useRef(parseInt(qm, 10));
//   const sessionCeilingRef = useRef(null);
//   const currentQuestionRef = useRef(null);
//   const streakRef = useRef(0);
//   const isSubmittingRef = useRef(false);

//   const [score, setScore] = useState(0);
//   const [correctAnswers, setCorrectAnswers] = useState(0);
//   const [skippedCount, setSkippedCount] = useState(0);
//   const revScale = useRef(new Animated.Value(1)).current;

//   useEffect(() => {
//     return () => { isMounted.current = false; };
//   }, []);

//   const getKeyButtonWidth = () => width * 0.2;
//   const getKeyButtonHeight = () => height * 0.1;

//   const resolvedDiffCode = (() => {
//     if (diffCode) return diffCode;
//     const letter = difficulty === 'easy' ? 'E' : difficulty === 'hard' ? 'H' : 'M';
//     const symbolCount = symbol ? symbol.split(',').length : 2;
//     const num = symbolCount >= 4 ? '4' : '2';
//     return `${letter}${num}`;
//   })();

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
//     fetchQuestion();
//     startTimeRef.current = Date.now();
//     questionStartTimeRef.current = Date.now();

//     const interval = setInterval(() => {
//       if (!isMounted.current) { clearInterval(interval); return; }

//       const now = Date.now();
//       const elapsed = Math.floor((now - startTimeRef.current) / 1000);
//       const remaining = timer - elapsed;
//       totalTimeRef.current = remaining;

//       if (!isMounted.current) return;
//       setMinutes(Math.floor(remaining / 60));
//       setSeconds(remaining % 60);

//       if (remaining <= 10 && remaining > 0) {
//         if (!last10PlayedRef.current) {
//           playEffect('ticktock', isSoundOnRef.current);
//           last10PlayedRef.current = true;
//         }
//         Animated.sequence([
//           Animated.timing(animateWatch, { toValue: 1.4, duration: 300, useNativeDriver: true }),
//           Animated.timing(animateWatch, { toValue: 1, duration: 300, useNativeDriver: true }),
//         ]).start();
//       }

//       if (remaining % 30 === 0 && remaining !== timer && remaining > 0) {
//         if (!isMounted.current) return;
//         setIsThirtySecPhase(true);
//         playEffect('timer', isSoundOnRef.current);
//         Animated.sequence([
//           Animated.timing(animateWatch, { toValue: 1.4, duration: 300, useNativeDriver: true }),
//           Animated.timing(animateWatch, { toValue: 1, duration: 300, useNativeDriver: true }),
//         ]).start(() => { if (isMounted.current) setIsThirtySecPhase(false); });
//       }

//       if (remaining <= 0) {
//         clearInterval(interval);
//         stopEffect('ticktock');

//         const incorrectCount = incorrectCountRef.current;
//         const attempted = correctAnswersRef.current + incorrectCount;
//         const correctPercentage =
//           attempted > 0 ? Math.round((correctAnswersRef.current / attempted) * 100) : 0;

//         postPracticeEndMatch({
//           correctCount: correctAnswersRef.current,
//           incorrectCount,
//           skippedCount: skippedCountRef.current,
//           questionHistory: questionHistoryRef.current,
//         });

//         navigation.replace('WellDoneScreen', {
//           totalScore: scoreRef.current,
//           correctCount: correctAnswersRef.current,
//           inCorrectCount: incorrectCount,
//           skippedQuestions: skippedCountRef.current,
//           correctPercentage,
//           difficulty,
//         });
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     if (isReverse) {
//       Animated.loop(
//         Animated.sequence([
//           Animated.timing(revScale, { toValue: 1.05, duration: 800, useNativeDriver: true }),
//           Animated.timing(revScale, { toValue: 1, duration: 800, useNativeDriver: true }),
//         ])
//       ).start();
//     } else {
//       revScale.setValue(1);
//     }
//   }, [isReverse]);

//   useEffect(() => {
//     const sub = AppState.addEventListener('change', state => {
//       if (state !== 'active') {
//         stopEffect('ticktock');
//       } else {
//         if (totalTimeRef.current <= 10 && totalTimeRef.current > 0) {
//           playEffect('ticktock', isSoundOnRef.current);
//         }
//       }
//     });
//     return () => sub.remove();
//   }, []);

//   useEffect(() => {
//     const subscription = AppState.addEventListener('change', nextState => {
//       if (nextState === 'active') {
//         const now = Date.now();
//         const elapsed = Math.floor((now - startTimeRef.current) / 1000);
//         const remaining = timer - elapsed;
//         totalTimeRef.current = remaining;
//         if (isMounted.current) {
//           setMinutes(Math.floor(remaining / 60));
//           setSeconds(remaining % 60);
//         }
//       }
//       appState.current = nextState;
//     });
//     return () => subscription.remove();
//   }, []);

//   // ── FETCH FIRST QUESTION ──────────────────────────────────────────────────
//   const fetchQuestion = async () => {
//     if (!isMounted.current) return;
//     setIsLoading(true);
//     setFeedback(null);
//     isSubmittingRef.current = false;
//     try {
//       const token = await AsyncStorage.getItem('accessToken');
//       if (!token) {
//         if (isMounted.current) setQuestion(t('Authorization token missing'));
//         return;
//       }
//       const params = new URLSearchParams({ diffCode: resolvedDiffCode, symbol });
//       const response = await fetch(
//         `http://13.203.232.239:3000/api/question?${params}`,
//         {
//           method: 'GET',
//           headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
//         },
//       );
      
//       if (!response.ok) throw new Error(`Status: ${response.status}`);
//       const data = await response.json();
//       const q = data.question;
//       console.log('📥 fetchQuestion response:', JSON.stringify(q));

//       if (sessionCeilingRef.current === null) {
//         sessionCeilingRef.current = data.ceiling;
//         sessionQMRef.current = data.initQM;
//       }

//       currentQuestionRef.current = q;

//       if (isMounted.current) {
//         setQuestion(`${String(q.input1)} ${getMathSymbol(q.symbol)} ${String(q.input2)}`);
//         questionStartTimeRef.current = Date.now();
//       }
//     } catch (e) {
//       console.error('❌ fetchQuestion error:', e);
//       if (isMounted.current) setQuestion(t('Failed to load question.'));
//     } finally {
//       if (isMounted.current) {
//         setInput('');
//         setIsLoading(false);
//       }
//     }
//   };

//   // ── LOAD NEXT QUESTION FROM submitAnswer response ─────────────────────────
//   const loadNextQuestion = (nq, nextQM) => {
//     currentQuestionRef.current = nq;
//     sessionQMRef.current = nextQM;
//     isSubmittingRef.current = false;
//     if (isMounted.current) {
//       setQuestion(`${String(nq.input1)} ${getMathSymbol(nq.symbol)} ${String(nq.input2)}`);
//       setInput('');
//       setFeedback(null);
//       setIsLoading(false);
//       questionStartTimeRef.current = Date.now();
//     }
//   };

//   // ── SUBMIT ANSWER ─────────────────────────────────────────────────────────
//   const submitAnswer = async (givenAnswer) => {
//     if (isSubmittingRef.current) return;
//     isSubmittingRef.current = true;

//     try {
//       const token = await AsyncStorage.getItem('accessToken');
//       if (!token) return;

//       const q = currentQuestionRef.current;

//       const body = {
//         diffCode: resolvedDiffCode,
//         currentScore: scoreRef.current,
//         givenAnswer: String(givenAnswer),
//         questionKey: q.questionKey,
//         question: { answer: givenAnswer, difficulty: q.difficulty, finalLevel: q.finalLevel},
//         symbol,
//         qm: sessionQMRef.current,
//         streak: streakRef.current,
//       };

//       console.log('📤 submitAnswer payload:', JSON.stringify(body));
//       console.log(givenAnswer);

//       const response = await fetch('http://13.203.232.239:3000/api/question/submitAnswer', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
//         body: JSON.stringify(body),
//       });

//       const responseText = await response.text();
//       console.log('📥 submitAnswer raw response:', responseText, '| status:', response.status);

//       if (!response.ok) {
//         throw new Error(`submitAnswer status: ${response.status} | ${responseText}`);
//       }

//       const data = JSON.parse(responseText);
//       console.log('✅ submitAnswer response:', data);

//       const isCorrect = data.correct;
//       sessionQMRef.current = data.nextQM ?? sessionQMRef.current;

//       const timeSpent = Date.now() - questionStartTimeRef.current;
//       questionHistoryRef.current.push({
//         playerResponse: { isCorrect, timeSpent, skipped: false, answer: givenAnswer },
//       });

//       setFeedback(isCorrect ? 'correct' : 'incorrect');
//       playEffect(isCorrect ? 'correct' : 'incorrect', isSoundOnRef.current);

//       if (isCorrect) {
//         streakRef.current += 1;
//         scoreRef.current = data.updatedScore ?? scoreRef.current + 2;
//         finalScoreRef.current = data.updatedScore ?? scoreRef.current;
//         correctAnswersRef.current += 1;
//         setScore(scoreRef.current);
//         setCorrectAnswers(correctAnswersRef.current);
//       } else {
//         streakRef.current = 0;
//         incorrectCountRef.current += 1;
//         setScore(scoreRef.current);
//       }

//       setTimeout(() => {
//         if (!isMounted.current) return;
//         if (data.nextQuestion?.input1 !== undefined) {
//           loadNextQuestion(data.nextQuestion, data.nextQM);
//         } else {
//           fetchQuestion();
//           setFeedback(null);
//         }
//       }, 1500);

//     } catch (err) {
//       console.error('❌ submitAnswer error:', err);
//       isSubmittingRef.current = false;
//       fetchQuestion();
//       if (isMounted.current) setFeedback(null);
//     }
//   };

//   // ── END MATCH ─────────────────────────────────────────────────────────────
//   const postPracticeEndMatch = async ({ correctCount, incorrectCount, skippedCount, questionHistory }) => {
//     try {
//       const token = await AsyncStorage.getItem('accessToken');
//       if (!token) return;

//       const body = {
//         diffCode: resolvedDiffCode,
//         correctCount,
//         incorrectCount,
//         skippedCount,
//         questionHistory,
//         gameDuration: timer,
//         finalScore: finalScoreRef.current,
//       };

//       console.log('📤 endMatch payload:', JSON.stringify(body, null, 2));

//       const response = await fetch('http://13.203.232.239:3000/api/practice/endMatch', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
//         body: JSON.stringify(body),
//       });

//       const rawText = await response.text();
//       console.log('🔍 endMatch RAW:', rawText, '| status:', response.status);

//       const data = JSON.parse(rawText);
//       console.log('✅ endMatch response:', data);
//     } catch (err) {
//       console.error('❌ postPracticeEndMatch error:', err);
//     }
//   };

//   const handleToggleSound = () => {
//     toggleSound();
//     const newVal = !isSoundOn;
//     isSoundOnRef.current = newVal;
//     if (!newVal) {
//       stopEffect('ticktock');
//     } else {
//       if (totalTimeRef.current <= 10 && totalTimeRef.current > 0) {
//         last10PlayedRef.current = false;
//         playEffect('ticktock', true);
//       }
//     }
//   };

//   // ── HANDLE KEYPRESS ───────────────────────────────────────────────────────
//   const handlePress = value => {
//     if (isPaused || totalTimeRef.current <= 0 || isLoading || feedback || isSubmittingRef.current) return;

//     const key = value.toString().toLowerCase();

//     if (key === 'clear' || key === 'clr') return setInput('');

//     if (key === '⌫' || key === 'del') {
//       return setInput(prev => prev.slice(0, -1));
//     }

//     if (key === 'reverse' || key === 'rev') {
//       return setIsReverse(prev => !prev);
//     }

//     if (key === 'skip') {
//       const timeSpent = Date.now() - questionStartTimeRef.current;
//       questionHistoryRef.current.push({
//         playerResponse: { isCorrect: false, timeSpent, skipped: true, answer: null },
//       });
//       setFeedback('skipped');
//       playEffect('skipped', isSoundOnRef.current);
//       setSkippedCount(prev => {
//         skippedCountRef.current = prev + 1;
//         return prev + 1;
//       });
//       return setTimeout(() => {
//         if (isMounted.current) {
//           fetchQuestion();
//           setFeedback(null);
//         }
//       }, 1000);
//     }

//     if (key === 'pm') {
//       return setInput(prev => (prev.startsWith('-') ? prev.slice(1) : '-' + prev));
//     }

//     const newInput = isReverse ? value + input : input + value;
//     setInput(newInput);

//     const q = currentQuestionRef.current;
//     if (q) {
//       try {
//         const op = getMathSymbol(q.symbol);
//         let expectedAnswer;
//         if (op === '%') {
//           expectedAnswer = String(q.input1 % q.input2);
//         } else if (op === '^') {
//           expectedAnswer = String(Math.pow(q.input1, q.input2));
//         } else {
//           // eslint-disable-next-line no-eval
//           expectedAnswer = String(eval(`${q.input1} ${op} ${q.input2}`));
//         }
//         const expectedLen = expectedAnswer.replace('-', '').length;
//         const inputLen = newInput.replace('-', '').length;

//         if (inputLen >= expectedLen) {
//           submitAnswer(newInput);
//         }
//       } catch (e) {
//         console.error('❌ auto-submit length calc error:', e);
//       }
//     }
//   };

//   const getFeedbackText = () => {
//     if (feedback === 'correct')   return t('Correct');
//     if (feedback === 'incorrect') return t('Incorrect');
//     if (feedback === 'skipped')   return t('Skipped');
//     return '';
//   };

//   const Content = () => (
//     <View style={[styles.container, { paddingTop: insets.top + 30 }]}>
//       <View style={[styles.topBar, { backgroundColor: theme.cardBackground || '#1E293B' }]}>
//         <TouchableOpacity
//           onPress={() => { stopEffect('ticktock'); navigation.goBack(); }}
//           style={styles.iconButton}
//           hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
//         >
//           <Icon name="caret-back-outline" size={scaleFont(24)} color="#fff" />
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
//           <Text style={styles.timerText}>
//             {`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}
//           </Text>
//         </View>

//         <TouchableOpacity onPress={handleToggleSound} style={styles.iconButton1}>
//           <Icon name={isSoundOn ? 'volume-high' : 'volume-mute'} size={24} color="#fff" />
//         </TouchableOpacity>
//       </View>

//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
//         <Text style={styles.question}>{question}</Text>

//         <View
//           style={[
//             styles.answerBox,
//             { backgroundColor: theme.cardBackground || '#1E293B' },
//             feedback === 'correct'   ? { borderColor: 'green',  borderWidth: 2 } :
//             feedback === 'incorrect' ? { borderColor: 'red',    borderWidth: 2 } :
//             feedback === 'skipped'   ? { borderColor: 'orange', borderWidth: 2 } : {},
//           ]}
//         >
//           <Text
//             style={[
//               styles.answerText,
//               feedback === 'correct'   ? { color: 'green'  } :
//               feedback === 'incorrect' ? { color: 'red'    } :
//               feedback === 'skipped'   ? { color: 'orange' } : {},
//             ]}
//           >
//             {input || getFeedbackText()}
//           </Text>
//         </View>
//       </View>

//       <View style={styles.keypadContainer}>
//         {currentLayout.map((row, rowIndex) => (
//           <View key={rowIndex} style={styles.keypadRow}>
//             {row.map((item, index) => {
//               const strItem = item.toString().toLowerCase();
//               const isSpecial = ['clear', 'clr', '⌫', 'del', 'ref', 'pm', 'skip', '.', 'reverse'].includes(strItem);
//               const isNa = strItem === 'na';

//               if (isNa) return (
//                 <View key={index} style={{ width: getKeyButtonWidth(), height: getKeyButtonHeight() }} />
//               );

//               let content;
//               if (strItem === 'del' || strItem === '⌫') {
//                 content = <MaterialIcons name="backspace" size={24} color="#fff" />;
//               } else if (strItem === 'ref' || strItem === 'reverse') {
//                 content = (
//                   <Text style={[styles.keyText, { fontSize: scaleFont(16), fontWeight: '800', fontStyle: 'italic' }]}>
//                     {t('REV')}
//                   </Text>
//                 );
//               } else if (strItem === 'pm') {
//                 content = <Text style={[styles.keyText, { color: '#fff' }]}>+/-</Text>;
//               } else if (strItem === 'clr' || strItem === 'clear') {
//                 content = <Text style={[styles.keyText, { color: '#fff' }]}>{t('Clear')}</Text>;
//               } else if (strItem === 'skip') {
//                 content = (
//                   <View style={{ alignItems: 'center', flexDirection: 'row' }}>
//                     <Text style={[styles.keyText, { fontSize: scaleFont(14) }]}>{t('Skip')}</Text>
//                     <MaterialIcons name="skip-next" size={24} color="#fff" />
//                   </View>
//                 );
//               } else {
//                 content = <Text style={styles.keyText}>{item.toUpperCase()}</Text>;
//               }

//               return (
//                 <AnimatedTouchableOpacity
//                   key={index}
//                   onPress={() => handlePress(strItem === 'ref' ? 'reverse' : item)}
//                   style={[
//                     styles.keyButton,
//                     {
//                       width: getKeyButtonWidth(),
//                       height: getKeyButtonHeight(),
//                       borderBottomWidth: 4,
//                       borderBottomColor: 'rgba(0,0,0,0.3)',
//                     },
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
//                   ]}
//                 >
//                   {(strItem === 'ref' || strItem === 'reverse') && isReverse ? (
//                     <LinearGradient
//                       colors={theme.buttonGradient || [theme.primaryColor || '#595CFF', theme.secondaryColor || '#87AEE9']}
//                       style={styles.gradientButton}
//                     >
//                       {content}
//                     </LinearGradient>
//                   ) : !isSpecial && strItem !== '-' ? (
//                     <LinearGradient
//                       colors={theme.buttonGradient || [theme.primaryColor || '#595CFF', theme.secondaryColor || '#87AEE9']}
//                       style={styles.gradientButton}
//                     >
//                       {content}
//                     </LinearGradient>
//                   ) : (
//                     <View style={{ alignItems: 'center', justifyContent: 'center' }}>
//                       {content}
//                     </View>
//                   )}
//                 </AnimatedTouchableOpacity>
//               );
//             })}
//           </View>
//         ))}
//       </View>
//     </View>
//   );

//   return theme.backgroundGradient ? (
//     <LinearGradient colors={theme.backgroundGradient} style={{ flex: 1 }}>
//       <Content />
//     </LinearGradient>
//   ) : (
//     <View style={{ flex: 1, backgroundColor: theme.backgroundColor || '#0B1220' }}>
//       <Content />
//     </View>
//   );
// };

// export default MathInputScreen;
// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   topBar: {
//     flexDirection:        'row',
//     justifyContent:       'space-between',
//     alignItems:           'center',
//     paddingHorizontal:    width * 0.04,
//     borderBottomEndRadius:   15,
//     borderBottomStartRadius: 15,
//     height: 60,
//   },
//   iconButton: {
//     width:          width * 0.35,
//     height:         width * 0.12,
//     justifyContent: 'center',
//     alignItems:     'flex-start',
//   },
//   iconButton1: {
//     width:          width * 0.35,
//     height:         width * 0.12,
//     justifyContent: 'center',
//     alignItems:     'flex-end',
//   },
//   timerContainer: { flexDirection: 'row', alignItems: 'center', gap: 5 },
//   timerText: {
//     color:      '#fff',
//     fontSize:   scaleFont(13),
//     fontWeight: '600',
//     opacity:    0.7,
//   },
//   timerIcon: { width: 18, height: 18 },
//   question: {
//     fontSize:     scaleFont(22),
//     color:        '#fff',
//     textAlign:    'center',
//     fontWeight:   'bold',
//     marginBottom: 20,
//   },
//   answerBox: {
//     width:          width * 0.6,
//     height:         height * 0.06,
//     backgroundColor: '#1E293B',
//     borderRadius:   10,
//     justifyContent: 'center',
//     alignItems:     'center',
//     alignSelf:      'center',
//   },
//   answerText: { fontSize: scaleFont(18), color: '#fff', fontWeight: '600' },
//   keypadContainer: {
//     width:       '100%',
//     paddingBottom: height * 0.02,
//   },
//   keypadRow: {
//     flexDirection:   'row',
//     justifyContent:  'space-between',
//     marginBottom:    height * 0.02,
//     paddingHorizontal: width * 0.05,
//   },
//   keyButton: {
//     width:          width * 0.2,
//     height:         height * 0.1,
//     justifyContent: 'center',
//     alignItems:     'center',
//     borderRadius:   10,
//     backgroundColor: '#1C2433',
//   },
//   specialKey: { backgroundColor: '#1C2433' },
//   gradientButton: {
//     width:          '100%',
//     height:         '100%',
//     justifyContent: 'center',
//     alignItems:     'center',
//     borderRadius:   10,
//   },
//   keyText: { fontSize: scaleFont(18), color: '#fff', fontWeight: '600' },
// }); 

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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { stopBackgroundMusic } from '../utils/playBackgroundMusic';
import {
  initSound,
  playEffect,
  stopEffect,
  releaseAll,
} from '../utils/SoundManager';
import { useTheme } from '../context/ThemeContext';
import { useSound } from '../context/SoundContext';
import { KEYPAD_LAYOUTS } from '../utils/keyboardLayouts';
import { useAppTranslation } from '../context/TranslationContext';
import { authFetch as fetch } from '../utils/authFetch'; // auto-refresh wrapper for expired access tokens
import TutorialSpot from '../components/TutorialSpot'; // ✅ tutorial coach-marks

const { width, height } = Dimensions.get('window');
const scaleFont = size => size * PixelRatio.getFontScale();

const getMathSymbol = word =>
({
  Sum: '+',
  Difference: '-',
  Product: '*',
  Quotient: '/',
  Modulus: '%',
  Exponent: '^',
}[word] || word);

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const MathInputScreen = () => {
  const appState = useRef(AppState.currentState);
  const startTimeRef = useRef(null);
  const isMounted = useRef(true);

  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const { theme, keyboardTheme } = useTheme();
  const { difficulty, symbol, timer, qm, diffCode } = route.params;
  const { t } = useAppTranslation();

  const currentLayout = KEYPAD_LAYOUTS[keyboardTheme] || KEYPAD_LAYOUTS.type1;

  const [input, setInput] = useState('');
  const [isReverse, setIsReverse] = useState(false);
  const [question, setQuestion] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [minutes, setMinutes] = useState(Math.floor(timer / 60));
  const [seconds, setSeconds] = useState(timer % 60);
  const [animateWatch] = useState(new Animated.Value(1));
  const { isSoundOn, toggleSound } = useSound();
  const [isThirtySecPhase, setIsThirtySecPhase] = useState(false);

  const totalTimeRef = useRef(timer);
  const scoreRef = useRef(0);
  const finalScoreRef = useRef(0);
  const correctAnswersRef = useRef(0);
  const skippedCountRef = useRef(0);
  const incorrectCountRef = useRef(0);
  const isSoundOnRef = useRef(true);
  const last10PlayedRef = useRef(false);
  const questionHistoryRef = useRef([]);
  const questionStartTimeRef = useRef(Date.now());

  const sessionQMRef = useRef(parseInt(qm, 10));
  const sessionCeilingRef = useRef(null);
  const currentQuestionRef = useRef(null);
  const streakRef = useRef(0);
  const isSubmittingRef = useRef(false);

  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const revScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  const getKeyButtonWidth = () => width * 0.2;
  const getKeyButtonHeight = () => height * 0.1;

  const resolvedDiffCode = (() => {
    if (diffCode) return diffCode;
    const letter = difficulty === 'easy' ? 'E' : difficulty === 'hard' ? 'H' : 'M';
    const symbolCount = symbol ? symbol.split(',').length : 2;
    const num = symbolCount >= 4 ? '4' : '2';
    return `${letter}${num}`;
  })();

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
    fetchQuestion();
    startTimeRef.current = Date.now();
    questionStartTimeRef.current = Date.now();

    const interval = setInterval(() => {
      if (!isMounted.current) { clearInterval(interval); return; }

      const now = Date.now();
      const elapsed = Math.floor((now - startTimeRef.current) / 1000);
      const remaining = timer - elapsed;
      totalTimeRef.current = remaining;

      if (!isMounted.current) return;
      setMinutes(Math.floor(remaining / 60));
      setSeconds(remaining % 60);

      if (remaining <= 10 && remaining > 0) {
        if (!last10PlayedRef.current) {
          playEffect('ticktock', isSoundOnRef.current);
          last10PlayedRef.current = true;
        }
        Animated.sequence([
          Animated.timing(animateWatch, { toValue: 1.4, duration: 300, useNativeDriver: true }),
          Animated.timing(animateWatch, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]).start();
      }

      if (remaining % 30 === 0 && remaining !== timer && remaining > 0) {
        if (!isMounted.current) return;
        setIsThirtySecPhase(true);
        playEffect('timer', isSoundOnRef.current);
        Animated.sequence([
          Animated.timing(animateWatch, { toValue: 1.4, duration: 300, useNativeDriver: true }),
          Animated.timing(animateWatch, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]).start(() => { if (isMounted.current) setIsThirtySecPhase(false); });
      }

      if (remaining <= 0) {
        clearInterval(interval);
        stopEffect('ticktock');

        const incorrectCount = incorrectCountRef.current;
        const attempted = correctAnswersRef.current + incorrectCount;
        const correctPercentage =
          attempted > 0 ? Math.round((correctAnswersRef.current / attempted) * 100) : 0;

        postPracticeEndMatch({
          correctCount: correctAnswersRef.current,
          incorrectCount,
          skippedCount: skippedCountRef.current,
          questionHistory: questionHistoryRef.current,
        });

        navigation.replace('WellDoneScreen', {
          totalScore: scoreRef.current,
          correctCount: correctAnswersRef.current,
          inCorrectCount: incorrectCount,
          skippedQuestions: skippedCountRef.current,
          correctPercentage,
          difficulty,
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isReverse) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(revScale, { toValue: 1.05, duration: 800, useNativeDriver: true }),
          Animated.timing(revScale, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    } else {
      revScale.setValue(1);
    }
  }, [isReverse]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', state => {
      if (state !== 'active') {
        stopEffect('ticktock');
      } else {
        if (totalTimeRef.current <= 10 && totalTimeRef.current > 0) {
          playEffect('ticktock', isSoundOnRef.current);
        }
      }
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      if (nextState === 'active') {
        const now = Date.now();
        const elapsed = Math.floor((now - startTimeRef.current) / 1000);
        const remaining = timer - elapsed;
        totalTimeRef.current = remaining;
        if (isMounted.current) {
          setMinutes(Math.floor(remaining / 60));
          setSeconds(remaining % 60);
        }
      }
      appState.current = nextState;
    });
    return () => subscription.remove();
  }, []);

  // ── FETCH FIRST QUESTION ──────────────────────────────────────────────────
  const fetchQuestion = async () => {
    if (!isMounted.current) return;
    setIsLoading(true);
    setFeedback(null);
    isSubmittingRef.current = false;
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        if (isMounted.current) setQuestion(t('Authorization token missing'));
        return;
      }
      const params = new URLSearchParams({ diffCode: resolvedDiffCode, symbol });
      const response = await fetch(
        `http://13.203.232.239:3000/api/question?${params}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) throw new Error(`Status: ${response.status}`);
      const data = await response.json();
      const q = data.question;
      console.log('📥 fetchQuestion response:', JSON.stringify(q));

      if (sessionCeilingRef.current === null) {
        sessionCeilingRef.current = data.ceiling;
        sessionQMRef.current = data.initQM;
      }

      currentQuestionRef.current = q;

      if (isMounted.current) {
        setQuestion(`${String(q.input1)} ${getMathSymbol(q.symbol)} ${String(q.input2)}`);
        questionStartTimeRef.current = Date.now();
      }
    } catch (e) {
      console.error('❌ fetchQuestion error:', e);
      if (isMounted.current) setQuestion(t('Failed to load question.'));
    } finally {
      if (isMounted.current) {
        setInput('');
        setIsLoading(false);
      }
    }
  };

  // ── LOAD NEXT QUESTION FROM submitAnswer response ─────────────────────────
  const loadNextQuestion = (nq, nextQM) => {
    currentQuestionRef.current = nq;
    sessionQMRef.current = nextQM;
    isSubmittingRef.current = false;
    if (isMounted.current) {
      setQuestion(`${String(nq.input1)} ${getMathSymbol(nq.symbol)} ${String(nq.input2)}`);
      setInput('');
      setFeedback(null);
      setIsLoading(false);
      questionStartTimeRef.current = Date.now();
    }
  };

  // ── SUBMIT ANSWER ─────────────────────────────────────────────────────────
  const submitAnswer = async (givenAnswer) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return;

      const q = currentQuestionRef.current;

      const body = {
        diffCode: resolvedDiffCode,
        currentScore: scoreRef.current,
        givenAnswer: String(givenAnswer),
        questionKey: q.questionKey,
        question: { answer: givenAnswer, difficulty: q.difficulty, finalLevel: q.finalLevel},
        symbol,
        qm: sessionQMRef.current,
        streak: streakRef.current,
      };

      console.log('📤 submitAnswer payload:', JSON.stringify(body));
      console.log(givenAnswer);

      const response = await fetch('http://13.203.232.239:3000/api/question/submitAnswer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });

      const responseText = await response.text();
      console.log('📥 submitAnswer raw response:', responseText, '| status:', response.status);

      if (!response.ok) {
        throw new Error(`submitAnswer status: ${response.status} | ${responseText}`);
      }

      const data = JSON.parse(responseText);
      console.log('✅ submitAnswer response:', data);

      const isCorrect = data.correct;
      sessionQMRef.current = data.nextQM ?? sessionQMRef.current;

      const timeSpent = Date.now() - questionStartTimeRef.current;
      questionHistoryRef.current.push({
        playerResponse: { isCorrect, timeSpent, skipped: false, answer: givenAnswer },
      });

      setFeedback(isCorrect ? 'correct' : 'incorrect');
      playEffect(isCorrect ? 'correct' : 'incorrect', isSoundOnRef.current);

      if (isCorrect) {
        streakRef.current += 1;
        scoreRef.current = data.updatedScore ?? scoreRef.current + 2;
        finalScoreRef.current = data.updatedScore ?? scoreRef.current;
        correctAnswersRef.current += 1;
        setScore(scoreRef.current);
        setCorrectAnswers(correctAnswersRef.current);
      } else {
        streakRef.current = 0;
        incorrectCountRef.current += 1;
        setScore(scoreRef.current);
      }

      setTimeout(() => {
        if (!isMounted.current) return;
        if (data.nextQuestion?.input1 !== undefined) {
          loadNextQuestion(data.nextQuestion, data.nextQM);
        } else {
          fetchQuestion();
          setFeedback(null);
        }
      }, 1500);

    } catch (err) {
      console.error('❌ submitAnswer error:', err);
      isSubmittingRef.current = false;
      fetchQuestion();
      if (isMounted.current) setFeedback(null);
    }
  };

  // ── END MATCH ─────────────────────────────────────────────────────────────
  const postPracticeEndMatch = async ({ correctCount, incorrectCount, skippedCount, questionHistory }) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return;

      const body = {
        diffCode: resolvedDiffCode,
        correctCount,
        incorrectCount,
        skippedCount,
        questionHistory,
        gameDuration: timer,
        finalScore: finalScoreRef.current,
      };

      console.log('📤 endMatch payload:', JSON.stringify(body, null, 2));

      const response = await fetch('http://13.203.232.239:3000/api/practice/endMatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });

      const rawText = await response.text();
      console.log('🔍 endMatch RAW:', rawText, '| status:', response.status);

      const data = JSON.parse(rawText);
      console.log('✅ endMatch response:', data);
    } catch (err) {
      console.error('❌ postPracticeEndMatch error:', err);
    }
  };

  const handleToggleSound = () => {
    toggleSound();
    const newVal = !isSoundOn;
    isSoundOnRef.current = newVal;
    if (!newVal) {
      stopEffect('ticktock');
    } else {
      if (totalTimeRef.current <= 10 && totalTimeRef.current > 0) {
        last10PlayedRef.current = false;
        playEffect('ticktock', true);
      }
    }
  };

  // ── HANDLE KEYPRESS ───────────────────────────────────────────────────────
  const handlePress = value => {
    if (isPaused || totalTimeRef.current <= 0 || isLoading || feedback || isSubmittingRef.current) return;

    const key = value.toString().toLowerCase();

    if (key === 'clear' || key === 'clr') return setInput('');

    if (key === '⌫' || key === 'del') {
      return setInput(prev => prev.slice(0, -1));
    }

    if (key === 'reverse' || key === 'rev') {
      return setIsReverse(prev => !prev);
    }

    if (key === 'skip') {
      const timeSpent = Date.now() - questionStartTimeRef.current;
      questionHistoryRef.current.push({
        playerResponse: { isCorrect: false, timeSpent, skipped: true, answer: null },
      });
      setFeedback('skipped');
      playEffect('skipped', isSoundOnRef.current);
      setSkippedCount(prev => {
        skippedCountRef.current = prev + 1;
        return prev + 1;
      });
      return setTimeout(() => {
        if (isMounted.current) {
          fetchQuestion();
          setFeedback(null);
        }
      }, 1000);
    }

    if (key === 'pm') {
      return setInput(prev => (prev.startsWith('-') ? prev.slice(1) : '-' + prev));
    }

    const newInput = isReverse ? value + input : input + value;
    setInput(newInput);

    const q = currentQuestionRef.current;
    if (q) {
      try {
        const op = getMathSymbol(q.symbol);
        let expectedAnswer;
        if (op === '%') {
          expectedAnswer = String(q.input1 % q.input2);
        } else if (op === '^') {
          expectedAnswer = String(Math.pow(q.input1, q.input2));
        } else {
          // eslint-disable-next-line no-eval
          expectedAnswer = String(eval(`${q.input1} ${op} ${q.input2}`));
        }
        const expectedLen = expectedAnswer.replace('-', '').length;
        const inputLen = newInput.replace('-', '').length;

        if (inputLen >= expectedLen) {
          submitAnswer(newInput);
        }
      } catch (e) {
        console.error('❌ auto-submit length calc error:', e);
      }
    }
  };

  const getFeedbackText = () => {
    if (feedback === 'correct')   return t('Correct');
    if (feedback === 'incorrect') return t('Incorrect');
    if (feedback === 'skipped')   return t('Skipped');
    return '';
  };

  const Content = () => (
    <View style={[styles.container, { paddingTop: insets.top + 30 }]}>
      <View style={[styles.topBar, { backgroundColor: theme.cardBackground || '#1E293B' }]}>
        <TouchableOpacity
          onPress={() => { stopEffect('ticktock'); navigation.goBack(); }}
          style={styles.iconButton}
          hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
        >
          <Icon name="caret-back-outline" size={scaleFont(24)} color="#fff" />
        </TouchableOpacity>

        <TutorialSpot
          screenKey="PRACTICE"
          stepKey="timer"
          text="Watch the clock! Answer before time runs out"
        >
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
            <Text style={styles.timerText}>
              {`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}
            </Text>
          </View>
        </TutorialSpot>

        <TouchableOpacity onPress={handleToggleSound} style={styles.iconButton1}>
          <Icon name={isSoundOn ? 'volume-high' : 'volume-mute'} size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <Text style={styles.question}>{question}</Text>

        <View
          style={[
            styles.answerBox,
            { backgroundColor: theme.cardBackground || '#1E293B' },
            feedback === 'correct'   ? { borderColor: 'green',  borderWidth: 2 } :
            feedback === 'incorrect' ? { borderColor: 'red',    borderWidth: 2 } :
            feedback === 'skipped'   ? { borderColor: 'orange', borderWidth: 2 } : {},
          ]}
        >
          <Text
            style={[
              styles.answerText,
              feedback === 'correct'   ? { color: 'green'  } :
              feedback === 'incorrect' ? { color: 'red'    } :
              feedback === 'skipped'   ? { color: 'orange' } : {},
            ]}
          >
            {input || getFeedbackText()}
          </Text>
        </View>
      </View>

      <TutorialSpot
        screenKey="PRACTICE"
        stepKey="keypad"
        text="Type your answer here — it submits automatically once complete"
        isLast
      >
        <View style={styles.keypadContainer}>
          {currentLayout.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.keypadRow}>
              {row.map((item, index) => {
                const strItem = item.toString().toLowerCase();
                const isSpecial = ['clear', 'clr', '⌫', 'del', 'ref', 'pm', 'skip', '.', 'reverse'].includes(strItem);
                const isNa = strItem === 'na';

                if (isNa) return (
                  <View key={index} style={{ width: getKeyButtonWidth(), height: getKeyButtonHeight() }} />
                );

                let content;
                if (strItem === 'del' || strItem === '⌫') {
                  content = <MaterialIcons name="backspace" size={24} color="#fff" />;
                } else if (strItem === 'ref' || strItem === 'reverse') {
                  content = (
                    <Text style={[styles.keyText, { fontSize: scaleFont(16), fontWeight: '800', fontStyle: 'italic' }]}>
                      {t('REV')}
                    </Text>
                  );
                } else if (strItem === 'pm') {
                  content = <Text style={[styles.keyText, { color: '#fff' }]}>+/-</Text>;
                } else if (strItem === 'clr' || strItem === 'clear') {
                  content = <Text style={[styles.keyText, { color: '#fff' }]}>{t('Clear')}</Text>;
                } else if (strItem === 'skip') {
                  content = (
                    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                      <Text style={[styles.keyText, { fontSize: scaleFont(14) }]}>{t('Skip')}</Text>
                      <MaterialIcons name="skip-next" size={24} color="#fff" />
                    </View>
                  );
                } else {
                  content = <Text style={styles.keyText}>{item.toUpperCase()}</Text>;
                }

                return (
                  <AnimatedTouchableOpacity
                    key={index}
                    onPress={() => handlePress(strItem === 'ref' ? 'reverse' : item)}
                    style={[
                      styles.keyButton,
                      {
                        width: getKeyButtonWidth(),
                        height: getKeyButtonHeight(),
                        borderBottomWidth: 4,
                        borderBottomColor: 'rgba(0,0,0,0.3)',
                      },
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
                    ]}
                  >
                    {(strItem === 'ref' || strItem === 'reverse') && isReverse ? (
                      <LinearGradient
                        colors={theme.buttonGradient || [theme.primaryColor || '#595CFF', theme.secondaryColor || '#87AEE9']}
                        style={styles.gradientButton}
                      >
                        {content}
                      </LinearGradient>
                    ) : !isSpecial && strItem !== '-' ? (
                      <LinearGradient
                        colors={theme.buttonGradient || [theme.primaryColor || '#595CFF', theme.secondaryColor || '#87AEE9']}
                        style={styles.gradientButton}
                      >
                        {content}
                      </LinearGradient>
                    ) : (
                      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        {content}
                      </View>
                    )}
                  </AnimatedTouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </TutorialSpot>
    </View>
  );

  return theme.backgroundGradient ? (
    <LinearGradient colors={theme.backgroundGradient} style={{ flex: 1 }}>
      <Content />
    </LinearGradient>
  ) : (
    <View style={{ flex: 1, backgroundColor: theme.backgroundColor || '#0B1220' }}>
      <Content />
    </View>
  );
};

export default MathInputScreen;
const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection:        'row',
    justifyContent:       'space-between',
    alignItems:           'center',
    paddingHorizontal:    width * 0.04,
    borderBottomEndRadius:   15,
    borderBottomStartRadius: 15,
    height: 60,
  },
  iconButton: {
    width:          width * 0.35,
    height:         width * 0.12,
    justifyContent: 'center',
    alignItems:     'flex-start',
  },
  iconButton1: {
    width:          width * 0.35,
    height:         width * 0.12,
    justifyContent: 'center',
    alignItems:     'flex-end',
  },
  timerContainer: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  timerText: {
    color:      '#fff',
    fontSize:   scaleFont(13),
    fontWeight: '600',
    opacity:    0.7,
  },
  timerIcon: { width: 18, height: 18 },
  question: {
    fontSize:     scaleFont(22),
    color:        '#fff',
    textAlign:    'center',
    fontWeight:   'bold',
    marginBottom: 20,
  },
  answerBox: {
    width:          width * 0.6,
    height:         height * 0.06,
    backgroundColor: '#1E293B',
    borderRadius:   10,
    justifyContent: 'center',
    alignItems:     'center',
    alignSelf:      'center',
  },
  answerText: { fontSize: scaleFont(18), color: '#fff', fontWeight: '600' },
  keypadContainer: {
    width:       '100%',
    paddingBottom: height * 0.02,
  },
  keypadRow: {
    flexDirection:   'row',
    justifyContent:  'space-between',
    marginBottom:    height * 0.02,
    paddingHorizontal: width * 0.05,
  },
  keyButton: {
    width:          width * 0.2,
    height:         height * 0.1,
    justifyContent: 'center',
    alignItems:     'center',
    borderRadius:   10,
    backgroundColor: '#1C2433',
  },
  specialKey: { backgroundColor: '#1C2433' },
  gradientButton: {
    width:          '100%',
    height:         '100%',
    justifyContent: 'center',
    alignItems:     'center',
    borderRadius:   10,
  },
  keyText: { fontSize: scaleFont(18), color: '#fff', fontWeight: '600' },
});