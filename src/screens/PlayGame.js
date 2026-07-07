// // // import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
// // // import React, { useCallback, useEffect, useRef, useState } from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   TouchableOpacity,
// // //   StyleSheet,
// // //   Dimensions,
// // //   ScrollView,
// // //   PixelRatio,
// // //   StatusBar,
// // // } from 'react-native';
// // // import LinearGradient from 'react-native-linear-gradient';
// // // import Icon from 'react-native-vector-icons/Ionicons';
// // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // import { useSafeAreaInsets } from 'react-native-safe-area-context';
// // // import Sound from 'react-native-sound';
// // // import {
// // //   playBackgroundMusic,
// // //   stopBackgroundMusic,
// // // } from '../utils/playBackgroundMusic';
// // // import { useTheme } from '../context/ThemeContext';
// // // import CustomHeader from '../components/CustomHeader';
// // // import { useAppTranslation } from '../context/TranslationContext';
// // // import TutorialSpot from '../components/TutorialSpot'; // ✅ tutorial coach-marks

// // // const { width, height } = Dimensions.get('window');
// // // const scaleFont = size => size * PixelRatio.getFontScale();

// // // // ✅ NEW — derives a diffCode string from difficulty tier + symbol selection
// // // // Letter: E = easy, M = medium, H = hard
// // // // Number: 2 = 2-symbol mode (sum,difference), 4 = 4-symbol mode (all four)
// // // function getDiffCode(difficulty, symbolValue) {
// // //   const letter =
// // //     difficulty === 'easy' ? 'E' : difficulty === 'hard' ? 'H' : 'M';
// // //   // symbolValue is e.g. "sum,difference" or "sum,difference,product,quotient"
// // //   const symbolCount = symbolValue.split(',').length;
// // //   const num = symbolCount >= 4 ? '4' : '2';
// // //   return `${letter}${num}`;
// // // }

// // // const PlayGame = () => {
// // //   const insets = useSafeAreaInsets();
// // //   const navigation = useNavigation();
// // //   const route = useRoute();
// // //   // const { gametype } = route.params || {};

// // // const { gametype, computerLevel: routeComputerLevel } = route.params || {};
// // // const [computerLevel, setComputerLevel] = useState(routeComputerLevel || null);

// // // useEffect(() => {
// // //   if (routeComputerLevel) {
// // //     setComputerLevel(routeComputerLevel);
// // //   } else {
// // //     AsyncStorage.getItem('mathetics_last_computer_level').then(val => {
// // //       if (val) setComputerLevel(Number(val));
// // //     });
// // //   }
// // // }, [routeComputerLevel]);
// // //   const { theme } = useTheme();
// // //   const { t } = useAppTranslation();

// // //   const [selectedDifficulty, setSelectedDifficulty] = useState('easy');
// // //   const [selectedTimer, setSelectedTimer] = useState('1 Minute');
// // //   const [selectedSymbol, setSelectedSymbol] = useState('(+), (-), (x) and (/)');
// // //   const [selectedOpponent, setSelectedOpponent] = useState('Random');
// // //   const [isFirstLoad, setIsFirstLoad] = useState(true);

// // //   const gameMusicRef = useRef(null);

// // //   useEffect(() => {
// // //     const loadSettingsAndNavigate = async () => {
// // //       try {
// // //         const diff = await AsyncStorage.getItem('diff');
// // //         const timer = await AsyncStorage.getItem('timer');
// // //         const symbol = await AsyncStorage.getItem('symbol');
// // //         const previousMode = await AsyncStorage.getItem('previousMode');

// // //         setSelectedDifficulty(diff || 'easy');
// // //         setSelectedTimer(timer || '1 Minute');
// // //         setSelectedSymbol(symbol || '(+), (-), (x) and (/)');

// // //         if (previousMode && isFirstLoad && gametype !== 'PRACTICE') {
// // //           if (previousMode === 'Computer') {
// // //             setSelectedOpponent('Computer');
// // //           } else if (previousMode === 'Random') {
// // //             setSelectedOpponent('Random');
// // //           } else if (previousMode === 'Friend') {
// // //             setSelectedOpponent('Random');
// // //           }
// // //         }

// // //         if (route.params?.selectedOpponent) {
// // //           setSelectedOpponent(route.params.selectedOpponent);
// // //         }

// // //         setIsFirstLoad(false);
// // //       } catch (error) {
// // //         console.error('Error loading settings:', error);
// // //         setIsFirstLoad(false);
// // //       }
// // //     };

// // //     loadSettingsAndNavigate();
// // //   }, [isFirstLoad, gametype, navigation]);

// // //   const renderOption = (label, selected, onPress) => (
// // //     <TouchableOpacity onPress={onPress}>
// // //       {selected ? (
// // //         <LinearGradient
// // //           colors={theme.buttonGradient || ['#595CFF', '#87AEE9']}
// // //           style={styles.selectedOptionButton}>
// // //           <Text style={styles.selectedOptionText}>{t(label)}</Text>
// // //         </LinearGradient>
// // //       ) : (
// // //         <View
// // //           style={[
// // //             styles.optionButton,
// // //             { backgroundColor: theme.cardBackground || '#1E293B' },
// // //           ]}>
// // //           <Text style={styles.optionText}>{t(label)}</Text>
// // //         </View>
// // //       )}
// // //     </TouchableOpacity>
// // //   );

// // //   useEffect(() => {
// // //     if (route.params?.selectedOpponent) {
// // //       setSelectedOpponent(route.params.selectedOpponent);
// // //     }
// // //   }, [route.params?.selectedOpponent]);

// // //   // ✅ Shared helper — resolves timer, symbolValue, storedQm, and diffCode
// // //   // from current selections so handlePlayPress and the VS navigator stay in sync.
// // //   const resolveGameConfig = async () => {
// // //     let timerInSeconds = 60;
// // //     if (selectedTimer === '2 Minute') timerInSeconds = 120;
// // //     else if (selectedTimer === '3 Minute') timerInSeconds = 180;

// // //     let symbolValue = 'sum,difference';
// // //     if (selectedSymbol === '(+), (-), (x) and (/)')
// // //       symbolValue = 'sum,difference,product,quotient';

// // //     let storedQm = '0';
// // //     if (selectedDifficulty === 'medium') storedQm = '6';
// // //     else if (selectedDifficulty === 'hard') storedQm = '18';

// // //     await AsyncStorage.setItem('qm', storedQm);

// // //     // ✅ NEW — compute diffCode once here and thread it everywhere
// // //     const diffCode = getDiffCode(selectedDifficulty, symbolValue);

// // //     return { timerInSeconds, symbolValue, storedQm, diffCode };
// // //   };

// // //   const handlePlayPress = async () => {
// // //     try {
// // //       const { timerInSeconds, symbolValue, storedQm, diffCode } =
// // //         await resolveGameConfig();

// // //       if (gametype === 'PRACTICE') {
// // //         navigation.navigate('MathInputScreen', {
// // //           difficulty: selectedDifficulty,
// // //           symbol: symbolValue,
// // //           qm: parseInt(storedQm),
// // //           timer: timerInSeconds,
// // //           // ✅ NEW — practice screen needs diffCode for endMatch API
// // //           diffCode,
// // //         });
// // //         return;
// // //       }

// // //       await AsyncStorage.setItem('previousMode', selectedOpponent);

// // //       const gameConfig = {
// // //         difficulty: selectedDifficulty,
// // //         symbol: symbolValue,
// // //         qm: parseInt(storedQm),
// // //         timer: timerInSeconds,
// // //         // ✅ NEW
// // //         diffCode,
// // //       };

// // //       if (selectedOpponent === 'Random') {
// // //         navigation.navigate('Lobby', {
// // //           difficulty: selectedDifficulty,
// // //           // ✅ NEW — send diffCode so Lobby can use it in join-lobby emit
// // //           diffCode,
// // //           digit: 2,
// // //           symbol: symbolValue.split(','),
// // //           timer: timerInSeconds,
// // //           qm: parseInt(storedQm),
// // //         });
// // //       } else if (selectedOpponent === 'Computer') {
// // //   // ✅ computerLevel was set by LevelSelectionScreen, go directly to WaitingForOpponent
// // //   navigation.navigate('WaitingForOpponent', {
// // //     challengedUser: { username: 'Computer' },
// // //     diff: selectedDifficulty,
// // //     diffCode,
// // //     selectedSymbols: symbolValue.split(','),
// // //     timer: timerInSeconds,
// // //     symbol: symbolValue,
// // //     isComputer: true,
// // //     selectedLevel: computerLevel,  // ✅ level chosen in LevelSelectionScreen
// // //   });
// // // } else if (selectedOpponent === 'Friends') {
// // //         navigation.navigate('ChallengeFriends', {
// // //           gameConfig,
// // //         });
// // //       }
// // //     } catch (error) {
// // //       console.error('❌ Error during handlePlayPress:', error);
// // //     }
// // //   };

// // //   const Content = () => (
// // //     <View style={{ flex: 1, paddingTop: insets.top + 30 }}>
// // //       <CustomHeader
// // //         title={t(gametype === 'PRACTICE' ? 'Practice Game' : 'Play Game')}
// // //         onBack={() => navigation.goBack()}
// // //       />
// // //       <ScrollView contentContainerStyle={[styles.container]}>

// // //         {/* Difficulty Section */}
// // //         <Text style={styles.sectionTitle}>{t('Select Difficulty')}</Text>
// // //         <TutorialSpot screenKey="PLAYGAME" stepKey="difficulty" text="Pick your challenge">
// // //         <View style={styles.row}>
// // //           {renderOption('Easy', selectedDifficulty === 'easy', async () => {
// // //             await AsyncStorage.setItem('diff', 'easy');
// // //             setSelectedDifficulty('easy');
// // //           })}
// // //           {renderOption('Medium', selectedDifficulty === 'medium', async () => {
// // //             await AsyncStorage.setItem('diff', 'medium');
// // //             setSelectedDifficulty('medium');
// // //           })}
// // //           {renderOption('Hard', selectedDifficulty === 'hard', async () => {
// // //             await AsyncStorage.setItem('diff', 'hard');
// // //             setSelectedDifficulty('hard');
// // //           })}
// // //         </View>
// // //         </TutorialSpot>

// // //         {/* Timer Section */}
// // //         <Text style={styles.sectionTitle}>{t('Timer')}</Text>
// // //         <TutorialSpot screenKey="PLAYGAME" stepKey="timer" text="Choose your match length">
// // //         <View style={styles.row}>
// // //           {renderOption('1 Minute', selectedTimer === '1 Minute', async () => {
// // //             await AsyncStorage.setItem('timer', '1 Minute');
// // //             setSelectedTimer('1 Minute');
// // //           })}
// // //           {renderOption('2 Minute', selectedTimer === '2 Minute', async () => {
// // //             await AsyncStorage.setItem('timer', '2 Minute');
// // //             setSelectedTimer('2 Minute');
// // //           })}
// // //           {renderOption('3 Minute', selectedTimer === '3 Minute', async () => {
// // //             await AsyncStorage.setItem('timer', '3 Minute');
// // //             setSelectedTimer('3 Minute');
// // //           })}
// // //         </View>
// // //         </TutorialSpot>

// // //         {/* Symbol Section */}
// // //         <Text style={styles.sectionTitle}>{t('Symbol')}</Text>
// // //         <TutorialSpot screenKey="PLAYGAME" stepKey="symbols" text="More symbols, tougher maths">
// // //         <View style={styles.row1}>
// // //           {renderOption('(+) and (-)', selectedSymbol === '(+) and (-)', async () => {
// // //             await AsyncStorage.setItem('symbol', '(+) and (-)');
// // //             setSelectedSymbol('(+) and (-)');
// // //           })}
// // //           {renderOption(
// // //             '(+), (-), (x) and (/)',
// // //             selectedSymbol === '(+), (-), (x) and (/)',
// // //             async () => {
// // //               await AsyncStorage.setItem('symbol', '(+), (-), (x) and (/)');
// // //               setSelectedSymbol('(+), (-), (x) and (/)');
// // //             }
// // //           )}
// // //         </View>
// // //         </TutorialSpot>

// // //         {/* VS / Opponent Section */}
// // //         {gametype !== 'PRACTICE' && (
// // //           <>
// // //             <Text style={styles.sectionTitle}>{t('VS')}</Text>
// // //             <TutorialSpot screenKey="PLAYGAME" stepKey="vs" text="Face a random player, a friend or the computer">
// // //             <TouchableOpacity
// // //               onPress={async () => {
// // //                 try {
// // //                   const { timerInSeconds, symbolValue, storedQm, diffCode } =
// // //                     await resolveGameConfig();

// // //                   const gameConfig = {
// // //                     difficulty: selectedDifficulty,
// // //                     symbol: symbolValue,
// // //                     qm: parseInt(storedQm),
// // //                     timer: timerInSeconds,
// // //                     // ✅ NEW
// // //                     diffCode,
// // //                   };

// // //                   navigation.navigate('SelectOpponent', {
// // //                     gametype,
// // //                     gameConfig,
// // //                     preSelectedOpponent: selectedOpponent,
// // //                   });
// // //                 } catch (error) {
// // //                   console.error('❌ Error navigating to SelectOpponent:', error);
// // //                 }
// // //               }}
// // //               style={[
// // //                 styles.dropdownButton,
// // //                 { backgroundColor: theme.cardBackground || '#1E293B' },
// // //               ]}>
// // //               <Text style={styles.dropdownText}>{t(selectedOpponent)}</Text>
// // //               <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
// // //                 {selectedOpponent === 'Computer' && computerLevel && (
// // //                   <Text style={[styles.computerLevelSubtitle, { color: theme.primary || '#FB923C' }]}>
// // //                     Level {computerLevel}
// // //                   </Text>
// // //                 )}
// // //                 <Icon name="chevron-down" size={20} color="#fff" />
// // //               </View>
// // //             </TouchableOpacity>
// // //             </TutorialSpot>
// // //           </>
// // //         )}

// // //         {/* Play Button */}
// // //         <TouchableOpacity onPress={handlePlayPress}>
// // //           <LinearGradient
// // //             colors={[theme.primary || '#FB923C', theme.primary || '#FF7F50']}
// // //             style={styles.playButton}>
// // //             <View style={{ width: '100%', alignItems: 'center' }}>
// // //               <Text style={styles.playButtonText}>
// // //                 {t(gametype === 'PRACTICE' ? 'Start Practice' : 'Start Game')}
// // //               </Text>
// // //             </View>
// // //           </LinearGradient>
// // //         </TouchableOpacity>

// // //       </ScrollView>
// // //     </View>
// // //   );

// // //   return theme.backgroundGradient ? (
// // //     <LinearGradient colors={theme.backgroundGradient} style={{ flex: 1 }}>
// // //       <Content />
// // //     </LinearGradient>
// // //   ) : (
// // //     <View style={{ flex: 1, backgroundColor: '#0B1220' }}>
// // //       <Content />
// // //     </View>
// // //   );
// // // };

// // // export default PlayGame;

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flexGrow: 1,
// // //     padding: width * 0.06,
// // //     paddingBottom: height * 0.07,
// // //   },
// // //   iconButton: {
// // //     width: width * 0.06,
// // //     height: width * 0.07,
// // //     borderRadius: 8,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   heading: {
// // //     fontSize: scaleFont(25),
// // //     color: '#fff',
// // //     fontWeight: 'bold',
// // //     alignSelf: 'center',
// // //     marginBottom: height * 0.04,
// // //     marginTop: height * -0.04,
// // //     fontFamily: 'jaro',
// // //   },
// // //   sectionTitle: {
// // //     fontSize: scaleFont(16),
// // //     color: '#fff',
// // //     marginBottom: height * 0.012,
// // //     fontWeight: '600',
// // //   },
// // //   row: {
// // //     flexDirection: 'row',
// // //     flexWrap: 'wrap',
// // //     marginBottom: height * 0.015,
// // //     justifyContent: 'space-between',
// // //   },
// // //   row1: {
// // //     flexDirection: 'row',
// // //     flexWrap: 'wrap',
// // //     gap: width * 0.025,
// // //     marginBottom: height * 0.015,
// // //   },
// // //   optionButton: {
// // //     backgroundColor: '#1E293B',
// // //     paddingVertical: height * 0.015,
// // //     paddingHorizontal: width * 0.052,
// // //     borderRadius: 0,
// // //     marginRight: width * 0.025,
// // //     marginTop: height * 0.01,
// // //   },
// // //   optionText: {
// // //     color: '#ccc',
// // //     fontSize: scaleFont(14),
// // //   },
// // //   selectedOptionButton: {
// // //     paddingVertical: height * 0.014,
// // //     paddingHorizontal: width * 0.04,
// // //     borderRadius: 0,
// // //     marginRight: width * 0.020,
// // //     marginTop: height * 0.01,
// // //   },
// // //   selectedOptionText: {
// // //     color: '#fff',
// // //     fontWeight: '700',
// // //     fontSize: scaleFont(14),
// // //   },
// // //   dropdownButton: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     backgroundColor: '#1E293B',
// // //     paddingVertical: height * 0.015,
// // //     paddingHorizontal: width * 0.04,
// // //     borderRadius: 8,
// // //     marginBottom: height * 0.015,
// // //   },
// // //   dropdownText: {
// // //     color: '#fff',
// // //     fontSize: scaleFont(14),
// // //     fontWeight: '600',
// // //   },
// // //   playButton: {
// // //     marginTop: height * 0.05,
// // //     paddingVertical: height * 0.015,
// // //     borderRadius: 20,
// // //     width: width * 0.6,
// // //     alignSelf: 'center',
// // //     alignItems: 'center',
// // //     overflow: 'hidden',
// // //   },
// // //   playButtonText: {
// // //     color: '#fff',
// // //     fontSize: scaleFont(18),
// // //     fontWeight: '700',
// // //   },
// // //   vsButton: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'space-between',
// // //     backgroundColor: '#1E293B',
// // //     padding: width * 0.04,
// // //     borderRadius: 12,
// // //     marginBottom: height * 0.025,
// // //     borderWidth: 1,
// // //     borderColor: 'rgba(255,255,255,0.1)',
// // //   },
// // //   vsText: {
// // //     color: '#fff',
// // //     fontSize: scaleFont(16),
// // //     fontWeight: '600',
// // //   },
// // //   computerLevelSubtitle: {
// // //     fontSize: scaleFont(12),
// // //     fontWeight: '600',
// // //   },
// // // });

// // import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
// // import React, { useCallback, useEffect, useRef, useState } from 'react';
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   StyleSheet,
// //   Dimensions,
// //   ScrollView,
// //   PixelRatio,
// //   StatusBar,
// // } from 'react-native';
// // import LinearGradient from 'react-native-linear-gradient';
// // import Icon from 'react-native-vector-icons/Ionicons';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import { useSafeAreaInsets } from 'react-native-safe-area-context';
// // import Sound from 'react-native-sound';
// // import {
// //   playBackgroundMusic,
// //   stopBackgroundMusic,
// // } from '../utils/playBackgroundMusic';
// // import { useTheme } from '../context/ThemeContext';
// // import CustomHeader from '../components/CustomHeader';
// // import { useAppTranslation } from '../context/TranslationContext';
// // import TutorialSpot from '../components/TutorialSpot'; // ✅ tutorial coach-marks

// // const { width, height } = Dimensions.get('window');
// // const scaleFont = size => size * PixelRatio.getFontScale();

// // // ✅ NEW — derives a diffCode string from difficulty tier + symbol selection
// // // Letter: E = easy, M = medium, H = hard
// // // Number: 2 = 2-symbol mode (sum,difference), 4 = 4-symbol mode (all four)
// // function getDiffCode(difficulty, symbolValue) {
// //   const letter =
// //     difficulty === 'easy' ? 'E' : difficulty === 'hard' ? 'H' : 'M';
// //   // symbolValue is e.g. "sum,difference" or "sum,difference,product,quotient"
// //   const symbolCount = symbolValue.split(',').length;
// //   const num = symbolCount >= 4 ? '4' : '2';
// //   return `${letter}${num}`;
// // }

// // const PlayGame = () => {
// //   const insets = useSafeAreaInsets();
// //   const navigation = useNavigation();
// //   const route = useRoute();
// //   // const { gametype } = route.params || {};

// // const { gametype, computerLevel: routeComputerLevel } = route.params || {};
// // const [computerLevel, setComputerLevel] = useState(routeComputerLevel || null);

// // useEffect(() => {
// //   if (routeComputerLevel) {
// //     setComputerLevel(routeComputerLevel);
// //   } else {
// //     AsyncStorage.getItem('mathetics_last_computer_level').then(val => {
// //       if (val) setComputerLevel(Number(val));
// //     });
// //   }
// // }, [routeComputerLevel]);
// //   const { theme } = useTheme();
// //   const { t } = useAppTranslation();

// //   const [selectedDifficulty, setSelectedDifficulty] = useState('easy');
// //   const [selectedTimer, setSelectedTimer] = useState('1 Minute');
// //   const [selectedSymbol, setSelectedSymbol] = useState('(+), (-), (x) and (/)');
// //   const [selectedOpponent, setSelectedOpponent] = useState('Random');
// //   const [isFirstLoad, setIsFirstLoad] = useState(true);
// //   const [tooltipVisible, setTooltipVisible] = useState(false);
// //   const [tooltipMessage, setTooltipMessage] = useState('');

// //   const gameMusicRef = useRef(null);

// //   useEffect(() => {
// //     const loadSettingsAndNavigate = async () => {
// //       try {
// //         const diff = await AsyncStorage.getItem('diff');
// //         const timer = await AsyncStorage.getItem('timer');
// //         const symbol = await AsyncStorage.getItem('symbol');
// //         const previousMode = await AsyncStorage.getItem('previousMode');

// //         setSelectedDifficulty(diff || 'easy');
// //         setSelectedTimer(timer || '1 Minute');
// //         setSelectedSymbol(symbol || '(+), (-), (x) and (/)');

// //         if (previousMode && isFirstLoad && gametype !== 'PRACTICE') {
// //           if (previousMode === 'Computer') {
// //             setSelectedOpponent('Computer');
// //           } else if (previousMode === 'Random') {
// //             setSelectedOpponent('Random');
// //           } else if (previousMode === 'Friend') {
// //             setSelectedOpponent('Random');
// //           }
// //         }

// //         if (route.params?.selectedOpponent) {
// //           setSelectedOpponent(route.params.selectedOpponent);
// //         }

// //         setIsFirstLoad(false);
// //       } catch (error) {
// //         console.error('Error loading settings:', error);
// //         setIsFirstLoad(false);
// //       }
// //     };

// //     loadSettingsAndNavigate();
// //   }, [isFirstLoad, gametype, navigation]);

// //   const renderOption = (label, selected, onPress) => (
// //     <TouchableOpacity onPress={onPress}>
// //       {selected ? (
// //         <LinearGradient
// //           colors={theme.buttonGradient || ['#595CFF', '#87AEE9']}
// //           style={styles.selectedOptionButton}>
// //           <Text style={styles.selectedOptionText}>{t(label)}</Text>
// //         </LinearGradient>
// //       ) : (
// //         <View
// //           style={[
// //             styles.optionButton,
// //             { backgroundColor: theme.cardBackground || '#1E293B' },
// //           ]}>
// //           <Text style={styles.optionText}>{t(label)}</Text>
// //         </View>
// //       )}
// //     </TouchableOpacity>
// //   );

// //   useEffect(() => {
// //     if (route.params?.selectedOpponent) {
// //       setSelectedOpponent(route.params.selectedOpponent);
// //     }
// //   }, [route.params?.selectedOpponent]);

// //   // ✅ Shared helper — resolves timer, symbolValue, storedQm, and diffCode
// //   // from current selections so handlePlayPress and the VS navigator stay in sync.
// //   const resolveGameConfig = async () => {
// //     let timerInSeconds = 60;
// //     if (selectedTimer === '2 Minute') timerInSeconds = 120;
// //     else if (selectedTimer === '3 Minute') timerInSeconds = 180;

// //     let symbolValue = 'sum,difference';
// //     if (selectedSymbol === '(+), (-), (x) and (/)')
// //       symbolValue = 'sum,difference,product,quotient';

// //     let storedQm = '0';
// //     if (selectedDifficulty === 'medium') storedQm = '6';
// //     else if (selectedDifficulty === 'hard') storedQm = '18';

// //     await AsyncStorage.setItem('qm', storedQm);

// //     // ✅ NEW — compute diffCode once here and thread it everywhere
// //     const diffCode = getDiffCode(selectedDifficulty, symbolValue);

// //     return { timerInSeconds, symbolValue, storedQm, diffCode };
// //   };

// //   const handlePlayPress = async () => {
// //     try {
// //       const { timerInSeconds, symbolValue, storedQm, diffCode } =
// //         await resolveGameConfig();

// //       if (gametype === 'PRACTICE') {
// //         setTooltipMessage('Practice session starting...');
// //         setTooltipVisible(true);

// //         setTimeout(() => {
// //           setTooltipVisible(false);
// //           navigation.navigate('MathInputScreen', {
// //             difficulty: selectedDifficulty,
// //             symbol: symbolValue,
// //             qm: parseInt(storedQm),
// //             timer: timerInSeconds,
// //             // ✅ NEW — practice screen needs diffCode for endMatch API
// //             diffCode,
// //           });
// //         }, 700);
// //         return;
// //       }

// //       await AsyncStorage.setItem('previousMode', selectedOpponent);

// //       const gameConfig = {
// //         difficulty: selectedDifficulty,
// //         symbol: symbolValue,
// //         qm: parseInt(storedQm),
// //         timer: timerInSeconds,
// //         // ✅ NEW
// //         diffCode,
// //       };

// //       if (selectedOpponent === 'Random') {
// //         navigation.navigate('Lobby', {
// //           difficulty: selectedDifficulty,
// //           // ✅ NEW — send diffCode so Lobby can use it in join-lobby emit
// //           diffCode,
// //           digit: 2,
// //           symbol: symbolValue.split(','),
// //           timer: timerInSeconds,
// //           qm: parseInt(storedQm),
// //         });
// //       } else if (selectedOpponent === 'Computer') {
// //   // ✅ computerLevel was set by LevelSelectionScreen, go directly to WaitingForOpponent
// //   navigation.navigate('WaitingForOpponent', {
// //     challengedUser: { username: 'Computer' },
// //     diff: selectedDifficulty,
// //     diffCode,
// //     selectedSymbols: symbolValue.split(','),
// //     timer: timerInSeconds,
// //     symbol: symbolValue,
// //     isComputer: true,
// //     selectedLevel: computerLevel,  // ✅ level chosen in LevelSelectionScreen
// //   });
// // } else if (selectedOpponent === 'Friends') {
// //         navigation.navigate('ChallengeFriends', {
// //           gameConfig,
// //         });
// //       }
// //     } catch (error) {
// //       console.error('❌ Error during handlePlayPress:', error);
// //     }
// //   };

// //   const Content = () => (
// //     <View style={{ flex: 1, paddingTop: insets.top + 30 }}>
// //       <CustomHeader
// //         title={t(gametype === 'PRACTICE' ? 'Practice Game' : 'Play Game')}
// //         onBack={() => navigation.goBack()}
// //       />
// //       <ScrollView
// //         contentContainerStyle={[styles.container]}
// //         removeClippedSubviews={false}
// //       >
// //         {tooltipVisible && (
// //           <View pointerEvents="none" style={styles.tooltip}>
// //             <Text style={styles.tooltipText}>{tooltipMessage}</Text>
// //           </View>
// //         )}

// //         {/* Difficulty Section */}
// //         <Text style={styles.sectionTitle}>{t('Select Difficulty')}</Text>
// //         <TutorialSpot screenKey="PLAYGAME" stepKey="difficulty" text="Pick your challenge">
// //         <View style={styles.row}>
// //           {renderOption('Easy', selectedDifficulty === 'easy', async () => {
// //             await AsyncStorage.setItem('diff', 'easy');
// //             setSelectedDifficulty('easy');
// //           })}
// //           {renderOption('Medium', selectedDifficulty === 'medium', async () => {
// //             await AsyncStorage.setItem('diff', 'medium');
// //             setSelectedDifficulty('medium');
// //           })}
// //           {renderOption('Hard', selectedDifficulty === 'hard', async () => {
// //             await AsyncStorage.setItem('diff', 'hard');
// //             setSelectedDifficulty('hard');
// //           })}
// //         </View>
// //         </TutorialSpot>

// //         {/* Timer Section */}
// //         <Text style={styles.sectionTitle}>{t('Timer')}</Text>
// //         <TutorialSpot screenKey="PLAYGAME" stepKey="timer" text="Choose your match length">
// //         <View style={styles.row}>
// //           {renderOption('1 Minute', selectedTimer === '1 Minute', async () => {
// //             await AsyncStorage.setItem('timer', '1 Minute');
// //             setSelectedTimer('1 Minute');
// //           })}
// //           {renderOption('2 Minute', selectedTimer === '2 Minute', async () => {
// //             await AsyncStorage.setItem('timer', '2 Minute');
// //             setSelectedTimer('2 Minute');
// //           })}
// //           {renderOption('3 Minute', selectedTimer === '3 Minute', async () => {
// //             await AsyncStorage.setItem('timer', '3 Minute');
// //             setSelectedTimer('3 Minute');
// //           })}
// //         </View>
// //         </TutorialSpot>

// //         {/* Symbol Section */}
// //         <Text style={styles.sectionTitle}>{t('Symbol')}</Text>
// //         <TutorialSpot screenKey="PLAYGAME" stepKey="symbols" text="More symbols, tougher maths">
// //         <View style={styles.row1}>
// //           {renderOption('(+) and (-)', selectedSymbol === '(+) and (-)', async () => {
// //             await AsyncStorage.setItem('symbol', '(+) and (-)');
// //             setSelectedSymbol('(+) and (-)');
// //           })}
// //           {renderOption(
// //             '(+), (-), (x) and (/)',
// //             selectedSymbol === '(+), (-), (x) and (/)',
// //             async () => {
// //               await AsyncStorage.setItem('symbol', '(+), (-), (x) and (/)');
// //               setSelectedSymbol('(+), (-), (x) and (/)');
// //             }
// //           )}
// //         </View>
// //         </TutorialSpot>

// //         {/* VS / Opponent Section */}
// //         {gametype !== 'PRACTICE' && (
// //           <>
// //             <Text style={styles.sectionTitle}>{t('VS')}</Text>
// //             <TutorialSpot screenKey="PLAYGAME" stepKey="vs" text="Face a random player, a friend or the computer">
// //             <TouchableOpacity
// //               onPress={async () => {
// //                 try {
// //                   const { timerInSeconds, symbolValue, storedQm, diffCode } =
// //                     await resolveGameConfig();

// //                   const gameConfig = {
// //                     difficulty: selectedDifficulty,
// //                     symbol: symbolValue,
// //                     qm: parseInt(storedQm),
// //                     timer: timerInSeconds,
// //                     // ✅ NEW
// //                     diffCode,
// //                   };

// //                   navigation.navigate('SelectOpponent', {
// //                     gametype,
// //                     gameConfig,
// //                     preSelectedOpponent: selectedOpponent,
// //                   });
// //                 } catch (error) {
// //                   console.error('❌ Error navigating to SelectOpponent:', error);
// //                 }
// //               }}
// //               style={[
// //                 styles.dropdownButton,
// //                 { backgroundColor: theme.cardBackground || '#1E293B' },
// //               ]}>
// //               <Text style={styles.dropdownText}>{t(selectedOpponent)}</Text>
// //               <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
// //                 {selectedOpponent === 'Computer' && computerLevel && (
// //                   <Text style={[styles.computerLevelSubtitle, { color: theme.primary || '#FB923C' }]}>
// //                     Level {computerLevel}
// //                   </Text>
// //                 )}
// //                 <Icon name="chevron-down" size={20} color="#fff" />
// //               </View>
// //             </TouchableOpacity>
// //             </TutorialSpot>
// //           </>
// //         )}

// //         {/* Play Button */}
// //         <TouchableOpacity onPress={handlePlayPress}>
// //           <LinearGradient
// //             colors={[theme.primary || '#FB923C', theme.primary || '#FF7F50']}
// //             style={styles.playButton}>
// //             <View style={{ width: '100%', alignItems: 'center' }}>
// //               <Text style={styles.playButtonText}>
// //                 {t(gametype === 'PRACTICE' ? 'Start Practice' : 'Start Game')}
// //               </Text>
// //             </View>
// //           </LinearGradient>
// //         </TouchableOpacity>

// //       </ScrollView>
// //     </View>
// //   );

// //   return theme.backgroundGradient ? (
// //     <LinearGradient colors={theme.backgroundGradient} style={{ flex: 1 }}>
// //       <Content />
// //     </LinearGradient>
// //   ) : (
// //     <View style={{ flex: 1, backgroundColor: '#0B1220' }}>
// //       <Content />
// //     </View>
// //   );
// // };

// // export default PlayGame;

// // const styles = StyleSheet.create({
// //   container: {
// //     flexGrow: 1,
// //     padding: width * 0.06,
// //     paddingBottom: height * 0.07,
// //   },
// //   iconButton: {
// //     width: width * 0.06,
// //     height: width * 0.07,
// //     borderRadius: 8,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   heading: {
// //     fontSize: scaleFont(25),
// //     color: '#fff',
// //     fontWeight: 'bold',
// //     alignSelf: 'center',
// //     marginBottom: height * 0.04,
// //     marginTop: height * -0.04,
// //     fontFamily: 'jaro',
// //   },
// //   sectionTitle: {
// //     fontSize: scaleFont(16),
// //     color: '#fff',
// //     marginBottom: height * 0.012,
// //     fontWeight: '600',
// //   },
// //   row: {
// //     flexDirection: 'row',
// //     flexWrap: 'wrap',
// //     marginBottom: height * 0.015,
// //     justifyContent: 'space-between',
// //   },
// //   row1: {
// //     flexDirection: 'row',
// //     flexWrap: 'wrap',
// //     gap: width * 0.025,
// //     marginBottom: height * 0.015,
// //   },
// //   optionButton: {
// //     backgroundColor: '#1E293B',
// //     paddingVertical: height * 0.015,
// //     paddingHorizontal: width * 0.052,
// //     borderRadius: 0,
// //     marginRight: width * 0.025,
// //     marginTop: height * 0.01,
// //   },
// //   optionText: {
// //     color: '#ccc',
// //     fontSize: scaleFont(14),
// //   },
// //   selectedOptionButton: {
// //     paddingVertical: height * 0.014,
// //     paddingHorizontal: width * 0.04,
// //     borderRadius: 0,
// //     marginRight: width * 0.020,
// //     marginTop: height * 0.01,
// //   },
// //   selectedOptionText: {
// //     color: '#fff',
// //     fontWeight: '700',
// //     fontSize: scaleFont(14),
// //   },
// //   dropdownButton: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     backgroundColor: '#1E293B',
// //     paddingVertical: height * 0.015,
// //     paddingHorizontal: width * 0.04,
// //     borderRadius: 8,
// //     marginBottom: height * 0.015,
// //   },
// //   dropdownText: {
// //     color: '#fff',
// //     fontSize: scaleFont(14),
// //     fontWeight: '600',
// //   },
// //   playButton: {
// //     marginTop: height * 0.05,
// //     paddingVertical: height * 0.015,
// //     borderRadius: 20,
// //     width: width * 0.6,
// //     alignSelf: 'center',
// //     alignItems: 'center',
// //     overflow: 'hidden',
// //   },
// //   tooltip: {
// //     position: 'absolute',
// //     bottom: height * 0.02,
// //     left: width * 0.06,
// //     right: width * 0.06,
// //     zIndex: 999,
// //     backgroundColor: 'rgba(11, 18, 32, 0.92)',
// //     borderColor: '#FB923C',
// //     borderWidth: 1,
// //     borderRadius: 12,
// //     paddingVertical: 10,
// //     paddingHorizontal: 14,
// //     alignItems: 'center',
// //   },
// //   tooltipText: {
// //     color: '#fff',
// //     fontSize: scaleFont(13),
// //     fontWeight: '600',
// //     textAlign: 'center',
// //   },
// //   playButtonText: {
// //     color: '#fff',
// //     fontSize: scaleFont(18),
// //     fontWeight: '700',
// //   },
// //   vsButton: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     backgroundColor: '#1E293B',
// //     padding: width * 0.04,
// //     borderRadius: 12,
// //     marginBottom: height * 0.025,
// //     borderWidth: 1,
// //     borderColor: 'rgba(255,255,255,0.1)',
// //   },
// //   vsText: {
// //     color: '#fff',
// //     fontSize: scaleFont(16),
// //     fontWeight: '600',
// //   },
// //   computerLevelSubtitle: {
// //     fontSize: scaleFont(12),
// //     fontWeight: '600',
// //   },
// // });

// import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   ScrollView,
//   PixelRatio,
//   StatusBar,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/Ionicons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import Sound from 'react-native-sound';
// import {
//   playBackgroundMusic,
//   stopBackgroundMusic,
// } from '../utils/playBackgroundMusic';
// import { useTheme } from '../context/ThemeContext';
// import CustomHeader from '../components/CustomHeader';
// import { useAppTranslation } from '../context/TranslationContext';
// import { TutorialTarget } from '../components/TutorialSpot'; // ✅ tutorial coach-marks (single block target)

// const { width, height } = Dimensions.get('window');
// const scaleFont = size => size * PixelRatio.getFontScale();

// // ✅ NEW — derives a diffCode string from difficulty tier + symbol selection
// // Letter: E = easy, M = medium, H = hard
// // Number: 2 = 2-symbol mode (sum,difference), 4 = 4-symbol mode (all four)
// function getDiffCode(difficulty, symbolValue) {
//   const letter =
//     difficulty === 'easy' ? 'E' : difficulty === 'hard' ? 'H' : 'M';
//   // symbolValue is e.g. "sum,difference" or "sum,difference,product,quotient"
//   const symbolCount = symbolValue.split(',').length;
//   const num = symbolCount >= 4 ? '4' : '2';
//   return `${letter}${num}`;
// }

// const PlayGame = () => {
//   const insets = useSafeAreaInsets();
//   const navigation = useNavigation();
//   const route = useRoute();
//   // const { gametype } = route.params || {};

// const { gametype, computerLevel: routeComputerLevel } = route.params || {};
// const [computerLevel, setComputerLevel] = useState(routeComputerLevel || null);

// useEffect(() => {
//   if (routeComputerLevel) {
//     setComputerLevel(routeComputerLevel);
//   } else {
//     AsyncStorage.getItem('mathetics_last_computer_level').then(val => {
//       if (val) setComputerLevel(Number(val));
//     });
//   }
// }, [routeComputerLevel]);
//   const { theme } = useTheme();
//   const { t } = useAppTranslation();

//   const [selectedDifficulty, setSelectedDifficulty] = useState('easy');
//   const [selectedTimer, setSelectedTimer] = useState('1 Minute');
//   const [selectedSymbol, setSelectedSymbol] = useState('(+), (-), (x) and (/)');
//   const [selectedOpponent, setSelectedOpponent] = useState('Random');
//   const [isFirstLoad, setIsFirstLoad] = useState(true);
//   const [tooltipVisible, setTooltipVisible] = useState(false);
//   const [tooltipMessage, setTooltipMessage] = useState('');

//   const gameMusicRef = useRef(null);

//   useEffect(() => {
//     const loadSettingsAndNavigate = async () => {
//       try {
//         const diff = await AsyncStorage.getItem('diff');
//         const timer = await AsyncStorage.getItem('timer');
//         const symbol = await AsyncStorage.getItem('symbol');
//         const previousMode = await AsyncStorage.getItem('previousMode');

//         setSelectedDifficulty(diff || 'easy');
//         setSelectedTimer(timer || '1 Minute');
//         setSelectedSymbol(symbol || '(+), (-), (x) and (/)');

//         if (previousMode && isFirstLoad && gametype !== 'PRACTICE') {
//           if (previousMode === 'Computer') {
//             setSelectedOpponent('Computer');
//           } else if (previousMode === 'Random') {
//             setSelectedOpponent('Random');
//           } else if (previousMode === 'Friend') {
//             setSelectedOpponent('Random');
//           }
//         }

//         if (route.params?.selectedOpponent) {
//           setSelectedOpponent(route.params.selectedOpponent);
//         }

//         setIsFirstLoad(false);
//       } catch (error) {
//         console.error('Error loading settings:', error);
//         setIsFirstLoad(false);
//       }
//     };

//     loadSettingsAndNavigate();
//   }, [isFirstLoad, gametype, navigation]);

//   const renderOption = (label, selected, onPress) => (
//     <TouchableOpacity onPress={onPress}>
//       {selected ? (
//         <LinearGradient
//           colors={theme.buttonGradient || ['#595CFF', '#87AEE9']}
//           style={styles.selectedOptionButton}>
//           <Text style={styles.selectedOptionText}>{t(label)}</Text>
//         </LinearGradient>
//       ) : (
//         <View
//           style={[
//             styles.optionButton,
//             { backgroundColor: theme.cardBackground || '#1E293B' },
//           ]}>
//           <Text style={styles.optionText}>{t(label)}</Text>
//         </View>
//       )}
//     </TouchableOpacity>
//   );

//   useEffect(() => {
//     if (route.params?.selectedOpponent) {
//       setSelectedOpponent(route.params.selectedOpponent);
//     }
//   }, [route.params?.selectedOpponent]);

//   // ✅ Shared helper — resolves timer, symbolValue, storedQm, and diffCode
//   // from current selections so handlePlayPress and the VS navigator stay in sync.
//   const resolveGameConfig = async () => {
//     let timerInSeconds = 60;
//     if (selectedTimer === '2 Minute') timerInSeconds = 120;
//     else if (selectedTimer === '3 Minute') timerInSeconds = 180;

//     let symbolValue = 'sum,difference';
//     if (selectedSymbol === '(+), (-), (x) and (/)')
//       symbolValue = 'sum,difference,product,quotient';

//     let storedQm = '0';
//     if (selectedDifficulty === 'medium') storedQm = '6';
//     else if (selectedDifficulty === 'hard') storedQm = '18';

//     await AsyncStorage.setItem('qm', storedQm);

//     // ✅ NEW — compute diffCode once here and thread it everywhere
//     const diffCode = getDiffCode(selectedDifficulty, symbolValue);

//     return { timerInSeconds, symbolValue, storedQm, diffCode };
//   };

//   const handlePlayPress = async () => {
//     try {
//       const { timerInSeconds, symbolValue, storedQm, diffCode } =
//         await resolveGameConfig();

//       if (gametype === 'PRACTICE') {
//         setTooltipMessage('Practice session starting...');
//         setTooltipVisible(true);

//         setTimeout(() => {
//           setTooltipVisible(false);
//           navigation.navigate('MathInputScreen', {
//             difficulty: selectedDifficulty,
//             symbol: symbolValue,
//             qm: parseInt(storedQm),
//             timer: timerInSeconds,
//             // ✅ NEW — practice screen needs diffCode for endMatch API
//             diffCode,
//           });
//         }, 700);
//         return;
//       }

//       await AsyncStorage.setItem('previousMode', selectedOpponent);

//       const gameConfig = {
//         difficulty: selectedDifficulty,
//         symbol: symbolValue,
//         qm: parseInt(storedQm),
//         timer: timerInSeconds,
//         // ✅ NEW
//         diffCode,
//       };

//       if (selectedOpponent === 'Random') {
//         navigation.navigate('Lobby', {
//           difficulty: selectedDifficulty,
//           // ✅ NEW — send diffCode so Lobby can use it in join-lobby emit
//           diffCode,
//           digit: 2,
//           symbol: symbolValue.split(','),
//           timer: timerInSeconds,
//           qm: parseInt(storedQm),
//         });
//       } else if (selectedOpponent === 'Computer') {
//   // ✅ computerLevel was set by LevelSelectionScreen, go directly to WaitingForOpponent
//   navigation.navigate('WaitingForOpponent', {
//     challengedUser: { username: 'Computer' },
//     diff: selectedDifficulty,
//     diffCode,
//     selectedSymbols: symbolValue.split(','),
//     timer: timerInSeconds,
//     symbol: symbolValue,
//     isComputer: true,
//     selectedLevel: computerLevel,  // ✅ level chosen in LevelSelectionScreen
//   });
// } else if (selectedOpponent === 'Friends') {
//         navigation.navigate('ChallengeFriends', {
//           gameConfig,
//         });
//       }
//     } catch (error) {
//       console.error('❌ Error during handlePlayPress:', error);
//     }
//   };

//   const Content = () => (
//     <View style={{ flex: 1, paddingTop: insets.top + 30 }}>
//       <CustomHeader
//         title={t(gametype === 'PRACTICE' ? 'Practice Game' : 'Play Game')}
//         onBack={() => navigation.goBack()}
//       />
//       <ScrollView
//         contentContainerStyle={[styles.container]}
//         removeClippedSubviews={false}
//       >
//         {tooltipVisible && (
//           <View pointerEvents="none" style={styles.tooltip}>
//             <Text style={styles.tooltipText}>{tooltipMessage}</Text>
//           </View>
//         )}

//         {/* Whole settings block (Difficulty + Timer + Symbol + VS) highlighted
//             together as ONE spotlight under a single tutorial step. */}
//         <TutorialTarget id="playgame:all">
//           {/* Difficulty Section */}
//           <Text style={styles.sectionTitle}>{t('Select Difficulty')}</Text>
//           <View style={styles.row}>
//             {renderOption('Easy', selectedDifficulty === 'easy', async () => {
//               await AsyncStorage.setItem('diff', 'easy');
//               setSelectedDifficulty('easy');
//             })}
//             {renderOption('Medium', selectedDifficulty === 'medium', async () => {
//               await AsyncStorage.setItem('diff', 'medium');
//               setSelectedDifficulty('medium');
//             })}
//             {renderOption('Hard', selectedDifficulty === 'hard', async () => {
//               await AsyncStorage.setItem('diff', 'hard');
//               setSelectedDifficulty('hard');
//             })}
//           </View>

//           {/* Timer Section */}
//           <Text style={styles.sectionTitle}>{t('Timer')}</Text>
//           <View style={styles.row}>
//             {renderOption('1 Minute', selectedTimer === '1 Minute', async () => {
//               await AsyncStorage.setItem('timer', '1 Minute');
//               setSelectedTimer('1 Minute');
//             })}
//             {renderOption('2 Minute', selectedTimer === '2 Minute', async () => {
//               await AsyncStorage.setItem('timer', '2 Minute');
//               setSelectedTimer('2 Minute');
//             })}
//             {renderOption('3 Minute', selectedTimer === '3 Minute', async () => {
//               await AsyncStorage.setItem('timer', '3 Minute');
//               setSelectedTimer('3 Minute');
//             })}
//           </View>

//           {/* Symbol Section */}
//           <Text style={styles.sectionTitle}>{t('Symbol')}</Text>
//           <View style={styles.row1}>
//             {renderOption('(+) and (-)', selectedSymbol === '(+) and (-)', async () => {
//               await AsyncStorage.setItem('symbol', '(+) and (-)');
//               setSelectedSymbol('(+) and (-)');
//             })}
//             {renderOption(
//               '(+), (-), (x) and (/)',
//               selectedSymbol === '(+), (-), (x) and (/)',
//               async () => {
//                 await AsyncStorage.setItem('symbol', '(+), (-), (x) and (/)');
//                 setSelectedSymbol('(+), (-), (x) and (/)');
//               }
//             )}
//           </View>

//           {/* VS / Opponent Section */}
//           {gametype !== 'PRACTICE' && (
//             <>
//               <Text style={styles.sectionTitle}>{t('VS')}</Text>
//               <TouchableOpacity
//                 onPress={async () => {
//                   try {
//                     const { timerInSeconds, symbolValue, storedQm, diffCode } =
//                       await resolveGameConfig();

//                     const gameConfig = {
//                       difficulty: selectedDifficulty,
//                       symbol: symbolValue,
//                       qm: parseInt(storedQm),
//                       timer: timerInSeconds,
//                       // ✅ NEW
//                       diffCode,
//                     };

//                     navigation.navigate('SelectOpponent', {
//                       gametype,
//                       gameConfig,
//                       preSelectedOpponent: selectedOpponent,
//                     });
//                   } catch (error) {
//                     console.error('❌ Error navigating to SelectOpponent:', error);
//                   }
//                 }}
//                 style={[
//                   styles.dropdownButton,
//                   { backgroundColor: theme.cardBackground || '#1E293B' },
//                 ]}>
//                 <Text style={styles.dropdownText}>{t(selectedOpponent)}</Text>
//                 <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
//                   {selectedOpponent === 'Computer' && computerLevel && (
//                     <Text style={[styles.computerLevelSubtitle, { color: theme.primary || '#FB923C' }]}>
//                       Level {computerLevel}
//                     </Text>
//                   )}
//                   <Icon name="chevron-down" size={20} color="#fff" />
//                 </View>
//               </TouchableOpacity>
//             </>
//           )}
//         </TutorialTarget>

//         {/* Play Button */}
//         <TouchableOpacity onPress={handlePlayPress}>
//           <LinearGradient
//             colors={[theme.primary || '#FB923C', theme.primary || '#FF7F50']}
//             style={styles.playButton}>
//             <View style={{ width: '100%', alignItems: 'center' }}>
//               <Text style={styles.playButtonText}>
//                 {t(gametype === 'PRACTICE' ? 'Start Practice' : 'Start Game')}
//               </Text>
//             </View>
//           </LinearGradient>
//         </TouchableOpacity>

//       </ScrollView>
//     </View>
//   );

//   return theme.backgroundGradient ? (
//     <LinearGradient colors={theme.backgroundGradient} style={{ flex: 1 }}>
//       <Content />
//     </LinearGradient>
//   ) : (
//     <View style={{ flex: 1, backgroundColor: '#0B1220' }}>
//       <Content />
//     </View>
//   );
// };

// export default PlayGame;

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: width * 0.06,
//     paddingBottom: height * 0.07,
//   },
//   iconButton: {
//     width: width * 0.06,
//     height: width * 0.07,
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   heading: {
//     fontSize: scaleFont(25),
//     color: '#fff',
//     fontWeight: 'bold',
//     alignSelf: 'center',
//     marginBottom: height * 0.04,
//     marginTop: height * -0.04,
//     fontFamily: 'jaro',
//   },
//   sectionTitle: {
//     fontSize: scaleFont(16),
//     color: '#fff',
//     marginBottom: height * 0.012,
//     fontWeight: '600',
//   },
//   row: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginBottom: height * 0.015,
//     justifyContent: 'space-between',
//   },
//   row1: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: width * 0.025,
//     marginBottom: height * 0.015,
//   },
//   optionButton: {
//     backgroundColor: '#1E293B',
//     paddingVertical: height * 0.015,
//     paddingHorizontal: width * 0.052,
//     borderRadius: 0,
//     marginRight: width * 0.025,
//     marginTop: height * 0.01,
//   },
//   optionText: {
//     color: '#ccc',
//     fontSize: scaleFont(14),
//   },
//   selectedOptionButton: {
//     paddingVertical: height * 0.014,
//     paddingHorizontal: width * 0.04,
//     borderRadius: 0,
//     marginRight: width * 0.020,
//     marginTop: height * 0.01,
//   },
//   selectedOptionText: {
//     color: '#fff',
//     fontWeight: '700',
//     fontSize: scaleFont(14),
//   },
//   dropdownButton: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#1E293B',
//     paddingVertical: height * 0.015,
//     paddingHorizontal: width * 0.04,
//     borderRadius: 8,
//     marginBottom: height * 0.015,
//   },
//   dropdownText: {
//     color: '#fff',
//     fontSize: scaleFont(14),
//     fontWeight: '600',
//   },
//   playButton: {
//     marginTop: height * 0.05,
//     paddingVertical: height * 0.015,
//     borderRadius: 20,
//     width: width * 0.6,
//     alignSelf: 'center',
//     alignItems: 'center',
//     overflow: 'hidden',
//   },
//   tooltip: {
//     position: 'absolute',
//     bottom: height * 0.02,
//     left: width * 0.06,
//     right: width * 0.06,
//     zIndex: 999,
//     backgroundColor: 'rgba(11, 18, 32, 0.92)',
//     borderColor: '#FB923C',
//     borderWidth: 1,
//     borderRadius: 12,
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     alignItems: 'center',
//   },
//   tooltipText: {
//     color: '#fff',
//     fontSize: scaleFont(13),
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   playButtonText: {
//     color: '#fff',
//     fontSize: scaleFont(18),
//     fontWeight: '700',
//   },
//   vsButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: '#1E293B',
//     padding: width * 0.04,
//     borderRadius: 12,
//     marginBottom: height * 0.025,
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.1)',
//   },
//   vsText: {
//     color: '#fff',
//     fontSize: scaleFont(16),
//     fontWeight: '600',
//   },
//   computerLevelSubtitle: {
//     fontSize: scaleFont(12),
//     fontWeight: '600',
//   },
// });

import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  PixelRatio,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Sound from 'react-native-sound';
import {
  playBackgroundMusic,
  stopBackgroundMusic,
} from '../utils/playBackgroundMusic';
import { useTheme } from '../context/ThemeContext';
import CustomHeader from '../components/CustomHeader';
import { useAppTranslation } from '../context/TranslationContext';
import { TutorialTarget } from '../components/TutorialSpot'; // ✅ tutorial coach-marks (per-section targets)

const { width, height } = Dimensions.get('window');
const scaleFont = size => size * PixelRatio.getFontScale();

// ✅ derives a diffCode string from difficulty tier + symbol selection
// Letter: E = easy, M = medium, H = hard
// Number: 2 = 2-symbol mode (sum,difference), 4 = 4-symbol mode (all four)
function getDiffCode(difficulty, symbolValue) {
  const letter =
    difficulty === 'easy' ? 'E' : difficulty === 'hard' ? 'H' : 'M';
  // symbolValue is e.g. "sum,difference" or "sum,difference,product,quotient"
  const symbolCount = symbolValue.split(',').length;
  const num = symbolCount >= 4 ? '4' : '2';
  return `${letter}${num}`;
}

const PlayGame = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();

  const { gametype, computerLevel: routeComputerLevel } = route.params || {};
  const [computerLevel, setComputerLevel] = useState(routeComputerLevel || null);

  useEffect(() => {
    if (routeComputerLevel) {
      setComputerLevel(routeComputerLevel);
    } else {
      AsyncStorage.getItem('mathetics_last_computer_level').then(val => {
        if (val) setComputerLevel(Number(val));
      });
    }
  }, [routeComputerLevel]);

  const { theme } = useTheme();
  const { t } = useAppTranslation();

  const [selectedDifficulty, setSelectedDifficulty] = useState('easy');
  const [selectedTimer, setSelectedTimer] = useState('1 Minute');
  const [selectedSymbol, setSelectedSymbol] = useState('(+), (-), (x) and (/)');
  const [selectedOpponent, setSelectedOpponent] = useState('Random');
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState('');

  const gameMusicRef = useRef(null);

  useEffect(() => {
    const loadSettingsAndNavigate = async () => {
      try {
        const diff = await AsyncStorage.getItem('diff');
        const timer = await AsyncStorage.getItem('timer');
        const symbol = await AsyncStorage.getItem('symbol');
        const previousMode = await AsyncStorage.getItem('previousMode');

        setSelectedDifficulty(diff || 'easy');
        setSelectedTimer(timer || '1 Minute');
        setSelectedSymbol(symbol || '(+), (-), (x) and (/)');

        if (previousMode && isFirstLoad && gametype !== 'PRACTICE') {
          if (previousMode === 'Computer') {
            setSelectedOpponent('Computer');
          } else if (previousMode === 'Random') {
            setSelectedOpponent('Random');
          } else if (previousMode === 'Friend') {
            setSelectedOpponent('Random');
          }
        }

        if (route.params?.selectedOpponent) {
          setSelectedOpponent(route.params.selectedOpponent);
        }

        setIsFirstLoad(false);
      } catch (error) {
        console.error('Error loading settings:', error);
        setIsFirstLoad(false);
      }
    };

    loadSettingsAndNavigate();
  }, [isFirstLoad, gametype, navigation]);

  const renderOption = (label, selected, onPress) => (
    <TouchableOpacity onPress={onPress}>
      {selected ? (
        <LinearGradient
          colors={theme.buttonGradient || ['#595CFF', '#87AEE9']}
          style={styles.selectedOptionButton}>
          <Text style={styles.selectedOptionText}>{t(label)}</Text>
        </LinearGradient>
      ) : (
        <View
          style={[
            styles.optionButton,
            { backgroundColor: theme.cardBackground || '#1E293B' },
          ]}>
          <Text style={styles.optionText}>{t(label)}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  useEffect(() => {
    if (route.params?.selectedOpponent) {
      setSelectedOpponent(route.params.selectedOpponent);
    }
  }, [route.params?.selectedOpponent]);

  // ✅ Shared helper — resolves timer, symbolValue, storedQm, and diffCode
  // from current selections so handlePlayPress and the VS navigator stay in sync.
  const resolveGameConfig = async () => {
    let timerInSeconds = 60;
    if (selectedTimer === '2 Minute') timerInSeconds = 120;
    else if (selectedTimer === '3 Minute') timerInSeconds = 180;

    let symbolValue = 'sum,difference';
    if (selectedSymbol === '(+), (-), (x) and (/)')
      symbolValue = 'sum,difference,product,quotient';

    let storedQm = '0';
    if (selectedDifficulty === 'medium') storedQm = '6';
    else if (selectedDifficulty === 'hard') storedQm = '18';

    await AsyncStorage.setItem('qm', storedQm);

    // ✅ compute diffCode once here and thread it everywhere
    const diffCode = getDiffCode(selectedDifficulty, symbolValue);

    return { timerInSeconds, symbolValue, storedQm, diffCode };
  };

  const handlePlayPress = async () => {
    try {
      const { timerInSeconds, symbolValue, storedQm, diffCode } =
        await resolveGameConfig();

      if (gametype === 'PRACTICE') {
        setTooltipMessage('Practice session starting...');
        setTooltipVisible(true);

        setTimeout(() => {
          setTooltipVisible(false);
          navigation.navigate('MathInputScreen', {
            difficulty: selectedDifficulty,
            symbol: symbolValue,
            qm: parseInt(storedQm),
            timer: timerInSeconds,
            diffCode,
          });
        }, 700);
        return;
      }

      await AsyncStorage.setItem('previousMode', selectedOpponent);

      const gameConfig = {
        difficulty: selectedDifficulty,
        symbol: symbolValue,
        qm: parseInt(storedQm),
        timer: timerInSeconds,
        diffCode,
      };

      if (selectedOpponent === 'Random') {
        navigation.navigate('Lobby', {
          difficulty: selectedDifficulty,
          diffCode,
          digit: 2,
          symbol: symbolValue.split(','),
          timer: timerInSeconds,
          qm: parseInt(storedQm),
        });
      } else if (selectedOpponent === 'Computer') {
        // ✅ computerLevel was set by LevelSelectionScreen, go directly to WaitingForOpponent
        navigation.navigate('WaitingForOpponent', {
          challengedUser: { username: 'Computer' },
          diff: selectedDifficulty,
          diffCode,
          selectedSymbols: symbolValue.split(','),
          timer: timerInSeconds,
          symbol: symbolValue,
          isComputer: true,
          selectedLevel: computerLevel, // ✅ level chosen in LevelSelectionScreen
        });
      } else if (selectedOpponent === 'Friends') {
        navigation.navigate('ChallengeFriends', {
          gameConfig,
        });
      }
    } catch (error) {
      console.error('❌ Error during handlePlayPress:', error);
    }
  };

  const Content = () => (
    <View style={{ flex: 1, paddingTop: insets.top + 30 }}>
      <CustomHeader
        title={t(gametype === 'PRACTICE' ? 'Practice Game' : 'Play Game')}
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={[styles.container]}
        removeClippedSubviews={false}
      >
        {tooltipVisible && (
          <View pointerEvents="none" style={styles.tooltip}>
            <Text style={styles.tooltipText}>{tooltipMessage}</Text>
          </View>
        )}

        {/* Difficulty Section */}
        <TutorialTarget id="playgame:difficultyText">
          <Text style={styles.sectionTitle}>{t('Select Difficulty')}</Text>
        </TutorialTarget>
        <View style={styles.row}>
          {renderOption('Easy', selectedDifficulty === 'easy', async () => {
            await AsyncStorage.setItem('diff', 'easy');
            setSelectedDifficulty('easy');
          })}
          {renderOption('Medium', selectedDifficulty === 'medium', async () => {
            await AsyncStorage.setItem('diff', 'medium');
            setSelectedDifficulty('medium');
          })}
          {renderOption('Hard', selectedDifficulty === 'hard', async () => {
            await AsyncStorage.setItem('diff', 'hard');
            setSelectedDifficulty('hard');
          })}
        </View>

        {/* Timer Section */}
        <TutorialTarget id="playgame:timerText">
          <Text style={styles.sectionTitle}>{t('Timer')}</Text>
        </TutorialTarget>
        <View style={styles.row}>
          {renderOption('1 Minute', selectedTimer === '1 Minute', async () => {
            await AsyncStorage.setItem('timer', '1 Minute');
            setSelectedTimer('1 Minute');
          })}
          {renderOption('2 Minute', selectedTimer === '2 Minute', async () => {
            await AsyncStorage.setItem('timer', '2 Minute');
            setSelectedTimer('2 Minute');
          })}
          {renderOption('3 Minute', selectedTimer === '3 Minute', async () => {
            await AsyncStorage.setItem('timer', '3 Minute');
            setSelectedTimer('3 Minute');
          })}
        </View>

        {/* Symbol Section */}
        <TutorialTarget id="playgame:symbolText">
          <Text style={styles.sectionTitle}>{t('Symbol')}</Text>
        </TutorialTarget>
        <View style={styles.row1}>
          {renderOption('(+) and (-)', selectedSymbol === '(+) and (-)', async () => {
            await AsyncStorage.setItem('symbol', '(+) and (-)');
            setSelectedSymbol('(+) and (-)');
          })}
          {renderOption(
            '(+), (-), (x) and (/)',
            selectedSymbol === '(+), (-), (x) and (/)',
            async () => {
              await AsyncStorage.setItem('symbol', '(+), (-), (x) and (/)');
              setSelectedSymbol('(+), (-), (x) and (/)');
            }
          )}
        </View>

        {/* VS / Opponent Section */}
        {gametype !== 'PRACTICE' && (
          <>
            <TutorialTarget id="playgame:vsText">
              <Text style={styles.sectionTitle}>{t('VS')}</Text>
            </TutorialTarget>
            <TouchableOpacity
              onPress={async () => {
                try {
                  const { timerInSeconds, symbolValue, storedQm, diffCode } =
                    await resolveGameConfig();

                  const gameConfig = {
                    difficulty: selectedDifficulty,
                    symbol: symbolValue,
                    qm: parseInt(storedQm),
                    timer: timerInSeconds,
                    diffCode,
                  };

                  navigation.navigate('SelectOpponent', {
                    gametype,
                    gameConfig,
                    preSelectedOpponent: selectedOpponent,
                  });
                } catch (error) {
                  console.error('❌ Error navigating to SelectOpponent:', error);
                }
              }}
              style={[
                styles.dropdownButton,
                { backgroundColor: theme.cardBackground || '#1E293B' },
              ]}>
              <Text style={styles.dropdownText}>{t(selectedOpponent)}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                {selectedOpponent === 'Computer' && computerLevel && (
                  <Text style={[styles.computerLevelSubtitle, { color: theme.primary || '#FB923C' }]}>
                    Level {computerLevel}
                  </Text>
                )}
                <Icon name="chevron-down" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
          </>
        )}

        {/* Play Button */}
        <TouchableOpacity onPress={handlePlayPress}>
          <LinearGradient
            colors={[theme.primary || '#FB923C', theme.primary || '#FF7F50']}
            style={styles.playButton}>
            <View style={{ width: '100%', alignItems: 'center' }}>
              <Text style={styles.playButtonText}>
                {t(gametype === 'PRACTICE' ? 'Start Practice' : 'Start Game')}
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );

  return theme.backgroundGradient ? (
    <LinearGradient colors={theme.backgroundGradient} style={{ flex: 1 }}>
      <Content />
    </LinearGradient>
  ) : (
    <View style={{ flex: 1, backgroundColor: '#0B1220' }}>
      <Content />
    </View>
  );
};

export default PlayGame;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: width * 0.06,
    paddingBottom: height * 0.07,
  },
  iconButton: {
    width: width * 0.06,
    height: width * 0.07,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: scaleFont(25),
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: height * 0.04,
    marginTop: height * -0.04,
    fontFamily: 'jaro',
  },
  sectionTitle: {
    fontSize: scaleFont(16),
    color: '#fff',
    marginBottom: height * 0.012,
    alignSelf: 'flex-start',
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: height * 0.015,
    justifyContent: 'space-between',
  },
  row1: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: width * 0.025,
    marginBottom: height * 0.015,
  },
  optionButton: {
    backgroundColor: '#1E293B',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.052,
    borderRadius: 0,
    marginRight: width * 0.025,
    marginTop: height * 0.01,
  },
  optionText: {
    color: '#ccc',
    fontSize: scaleFont(14),
  },
  selectedOptionButton: {
    paddingVertical: height * 0.014,
    paddingHorizontal: width * 0.04,
    borderRadius: 0,
    marginRight: width * 0.020,
    marginTop: height * 0.01,
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: scaleFont(14),
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    borderRadius: 8,
    marginBottom: height * 0.015,
  },
  dropdownText: {
    color: '#fff',
    fontSize: scaleFont(14),
    fontWeight: '600',
  },
  playButton: {
    marginTop: height * 0.05,
    paddingVertical: height * 0.015,
    borderRadius: 20,
    width: width * 0.6,
    alignSelf: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  tooltip: {
    position: 'absolute',
    bottom: height * 0.02,
    left: width * 0.06,
    right: width * 0.06,
    zIndex: 999,
    backgroundColor: 'rgba(11, 18, 32, 0.92)',
    borderColor: '#FB923C',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  tooltipText: {
    color: '#fff',
    fontSize: scaleFont(13),
    fontWeight: '600',
    textAlign: 'center',
  },
  playButtonText: {
    color: '#fff',
    fontSize: scaleFont(18),
    fontWeight: '700',
  },
  vsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    padding: width * 0.04,
    borderRadius: 12,
    marginBottom: height * 0.025,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  vsText: {
    color: '#fff',
    fontSize: scaleFont(16),
    fontWeight: '600',
  },
  computerLevelSubtitle: {
    fontSize: scaleFont(12),
    fontWeight: '600',
  },
});