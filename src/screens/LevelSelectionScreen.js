// // // import React, { useState } from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   TouchableOpacity,
// // //   StyleSheet,
// // //   Dimensions,
// // //   SafeAreaView,
// // //   ScrollView,
// // // } from 'react-native';
// // // import LinearGradient from 'react-native-linear-gradient';
// // // import { useNavigation, useRoute } from '@react-navigation/native';
// // // import CustomHeader from '../components/CustomHeader';
// // // import { useSafeAreaInsets } from 'react-native-safe-area-context';
// // // import { useTheme } from '../context/ThemeContext';

// // // const { width } = Dimensions.get('window');

// // // const LevelSelectionScreen = () => {
// // //   const navigation = useNavigation();
// // //   const route = useRoute();
// // //   const insets = useSafeAreaInsets();
// // //   const { theme } = useTheme();

// // //   const [selectedLevel, setSelectedLevel] = useState(null);

// // //   // Get parameters from navigation
// // //   const { diff, timer, symbol, challengedUser, isComputer } = route.params || {};

// // //   const bgGradient = theme.backgroundGradient || ['#0f172a', '#1e293b'];

// // //   const levels = Array.from({ length: 5 }, (_, i) => i + 1 );

// // //   const handleLevelSelect = level => {
// // //     setSelectedLevel(level);
// // //   };

// // //   const Content = () => (
// // //     <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background || '#0f172a' }]}>
// // //       <LinearGradient colors={bgGradient} style={{ flex: 1 }}>

// // //         {/* HEADER */}
// // //         <View style={{ paddingTop: 20 }}>
// // //           <CustomHeader
// // //             title={'Select Level'}
// // //             onBack={() => navigation.goBack()}
// // //           />
// // //         </View>

// // //         <ScrollView
// // //           contentContainerStyle={[
// // //             styles.scrollContent,
// // //             { paddingBottom: insets.bottom + 80 },
// // //           ]}
// // //           showsVerticalScrollIndicator={false}
// // //         >

// // //           {/* TITLE */}
// // //           <View style={styles.headerContainer}>
// // //             <Text style={[styles.title, { color: theme.text || '#ffffff' }]}>
// // //               Choose your level
// // //             </Text>
// // //           </View>

// // //           {/* LEVEL GRID */}
// // //           <View style={styles.levelContainer}>
// // //             {levels.map(level => (
// // //               <TouchableOpacity
// // //                 key={level}
// // //                 onPress={() => handleLevelSelect(level)}
// // //                 activeOpacity={0.8}
// // //                 style={[
// // //                   styles.levelButton,
// // //                   { borderColor: 'rgba(255,255,255,0.25)' },
// // //                   selectedLevel === level && {
// // //                     borderColor: theme.primary || '#FB923C',
// // //                     backgroundColor: 'rgba(255,255,255,0.12)',
// // //                   },
// // //                 ]}
// // //               >
// // //                 <Text
// // //                   style={[
// // //                     styles.levelText,
// // //                     { color: theme.text || '#e0e0e0' },
// // //                     selectedLevel === level && { color: theme.text || '#ffffff' },
// // //                   ]}
// // //                 >
// // //                   Level {level}
// // //                 </Text>
// // //               </TouchableOpacity>
// // //             ))}
// // //           </View>

// // //           {/* CONTINUE BUTTON */}
// // //           <TouchableOpacity
// // //             disabled={!selectedLevel}
// // //             activeOpacity={0.8}
// // //             onPress={() =>
// // //               navigation.navigate('WaitingForOpponent', {
// // //                 selectedLevel,
// // //                 challengedUser,
// // //                 diff,
// // //                 timer,
// // //                 symbol,
// // //                 isComputer,
// // //               })
// // //             }
// // //             style={[
// // //               styles.continueButton,
// // //               { backgroundColor: theme.primary || '#FB923C', opacity: selectedLevel ? 1 : 0.5 },
// // //             ]}
// // //           >
// // //             <Text style={styles.continueText}>
// // //               Start Game
// // //             </Text>
// // //           </TouchableOpacity>

// // //         </ScrollView>

// // //       </LinearGradient>
// // //     </SafeAreaView>
// // //   );

// // //   return <Content />;
// // // };

// // // export default LevelSelectionScreen;

// // // const styles = StyleSheet.create({
// // //   safeArea: {
// // //     flex: 1,
// // //   },

// // //   scrollContent: {
// // //     flexGrow: 1,
// // //     alignItems: 'center',
// // //     paddingHorizontal: width * 0.07,
// // //     paddingTop: 20,
// // //   },

// // //   headerContainer: {
// // //     alignItems: 'center',
// // //     marginBottom: 30,
// // //     width: '100%',
// // //   },

// // //   title: {
// // //     fontSize: 22,
// // //     textAlign: 'center',
// // //     fontWeight: '700',
// // //   },

// // //   levelContainer: {
// // //     flexDirection: 'column',
// // //     justifyContent: 'flex-start',
// // //     width: '100%',
// // //     marginBottom: 40,
// // //   },

// // //   levelButton: {
// // //     width: '100%',
// // //     paddingVertical: 15,
// // //     borderWidth: 1,
// // //     borderRadius: 12,
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     marginBottom: 12,
// // //   },

// // //   levelText: {
// // //     fontSize: 22,
// // //     fontWeight: '700',
// // //   },

// // //   continueButton: {
// // //     width: width * 0.6,
// // //     minHeight: 50,
// // //     paddingVertical: 12,
// // //     borderRadius: 30,
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //   },

// // //   continueText: {
// // //     color: '#fff',
// // //     fontSize: 18,
// // //     fontWeight: '700',
// // //   },
// // // });


// // import React, { useState, useEffect } from 'react';
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   StyleSheet,
// //   Dimensions,
// //   PixelRatio,
// //   SafeAreaView,
// //   ScrollView,
// //   ActivityIndicator,
// // } from 'react-native';
// // import LinearGradient from 'react-native-linear-gradient';
// // import { useNavigation, useRoute } from '@react-navigation/native';
// // import CustomHeader from '../components/CustomHeader';
// // import { useSafeAreaInsets } from 'react-native-safe-area-context';
// // import { useTheme } from '../context/ThemeContext';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import { useAppTranslation } from '../context/TranslationContext';

// // const { width } = Dimensions.get('window');
// // const scale = width / 390;
// // const rf = (size) => Math.round(PixelRatio.roundToNearestPixel(size * scale));

// // const LEVEL_META = {
// //   1: { label: 'Beginner',  desc: 'Slow, frequent mistakes',       emoji: '🌱' },
// //   2: { label: 'Amateur',   desc: 'Struggles on harder questions',  emoji: '📚' },
// //   3: { label: 'Skilled',   desc: 'Solid, occasional slumps',      emoji: '⚡' },
// //   4: { label: 'Expert',    desc: 'Fast, high accuracy',            emoji: '🎯' },
// //   5: { label: 'Pro',       desc: 'Near-perfect',                   emoji: '🏆' },
// // };

// // const LevelSelectionScreen = () => {
// //   const navigation = useNavigation();
// //   const route = useRoute();
// //   const insets = useSafeAreaInsets();
// //   const { theme } = useTheme();
// //   const { t } = useAppTranslation();

// //   const [selectedLevel, setSelectedLevel] = useState(null);
// //   const [ratings, setRatings] = useState({});
// //   const [stats, setStats] = useState({});
// //   const [loadingRatings, setLoadingRatings] = useState(true);

// //   const { diff, timer, symbol, challengedUser, isComputer } = route.params || {};
// //   const bgGradient = theme.backgroundGradient || ['#0f172a', '#1e293b'];

// //   useEffect(() => {
// //     const fetchStats = async () => {
// //       try {
// //         const token = await AsyncStorage.getItem('accessToken');
// //         if (!token) return;

// //         const response = await fetch('http://13.203.232.239:3000/api/computer-game/stats', {
// //           method: 'GET',
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //             'Content-Type': 'application/json',
// //           },
// //         });

// //         const data = await response.json();
// //         if (data.success) {
// //           setRatings(data.computerRatings || {});
// //           setStats(data.computerStats || {});
// //         }
// //       } catch (err) {
// //         console.error('Failed to fetch computer stats:', err);
// //       } finally {
// //         setLoadingRatings(false);
// //       }
// //     };

// //     fetchStats();
// //   }, []);

// //   const handleLevelSelect = level => setSelectedLevel(level);

// //   const handleStartGame = () => {
// //     if (!selectedLevel) return;
// //     navigation.navigate('WaitingForOpponent', {
// //       selectedLevel,
// //       challengedUser,
// //       diff,
// //       timer,
// //       symbol,
// //       isComputer: true,
// //     });
// //   };

// //   const Content = () => (
// //     <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background || '#0f172a' }]}>
// //       <LinearGradient colors={bgGradient} style={{ flex: 1 }}>

// //         <View style={{ paddingTop: 20 }}>
// //           <CustomHeader
// //             title={t('Select Level')}
// //             onBack={() => navigation.goBack()}
// //           />
// //         </View>

// //         <ScrollView
// //           contentContainerStyle={[
// //             styles.scrollContent,
// //             { paddingBottom: insets.bottom + 80 },
// //           ]}
// //           showsVerticalScrollIndicator={false}
// //         >

// //           <View style={styles.headerContainer}>
// //             <Text style={[styles.title, { color: theme.text || '#ffffff' }]}>
// //               {t('Choose your level')}
// //             </Text>
// //             <Text style={[styles.subtitle, { color: theme.textSecondary || '#94a3b8' }]}>
// //               {t('Select a difficulty to play against the AI')}
// //             </Text>
// //           </View>

// //           {loadingRatings ? (
// //             <ActivityIndicator
// //               size="large"
// //               color={theme.primary || '#FB923C'}
// //               style={{ marginTop: 40 }}
// //             />
// //           ) : (
// //             <View style={styles.levelContainer}>
// //               {[1, 2, 3, 4, 5].map(level => {
// //                 const meta = LEVEL_META[level];
// //                 const levelKey = `level${level}`;
// //                 const rating = ratings[levelKey] ?? 1000;
// //                 const levelStats = stats[levelKey];
// //                 const isSelected = selectedLevel === level;

// //                 return (
// //                   <TouchableOpacity
// //                     key={level}
// //                     onPress={() => handleLevelSelect(level)}
// //                     activeOpacity={0.8}
// //                     style={[
// //                       styles.levelButton,
// //                       {
// //                         borderColor: isSelected
// //                           ? theme.primary || '#FB923C'
// //                           : 'rgba(255,255,255,0.15)',
// //                         backgroundColor: isSelected
// //                           ? 'rgba(251,146,60,0.12)'
// //                           : 'rgba(255,255,255,0.05)',
// //                       },
// //                     ]}
// //                   >
// //                     <View style={styles.levelLeft}>
// //                       <Text style={styles.levelEmoji}>{meta.emoji}</Text>
// //                       <View style={styles.levelTextGroup}>
// //                         <Text style={[
// //                           styles.levelName,
// //                           { color: isSelected ? (theme.primary || '#FB923C') : (theme.text || '#e0e0e0') },
// //                         ]}>
// //                           {t('Level')} {level} — {t(meta.label)}
// //                         </Text>
// //                         <Text style={[styles.levelDesc, { color: theme.textSecondary || '#94a3b8' }]}>
// //                           {t(meta.desc)}
// //                         </Text>
// //                       </View>
// //                     </View>

// //                     <View style={styles.levelRight}>
// //                       <Text style={[styles.ratingValue, { color: theme.text || '#fff' }]}>
// //                         {rating}
// //                       </Text>
// //                       <Text style={[styles.ratingLabel, { color: theme.textSecondary || '#94a3b8' }]}>
// //                         {t('Rating')}
// //                       </Text>
// //                       {/* {levelStats && (
// //                         <Text style={[styles.winRate, { color: '#10B981' }]}>
// //                           {levelStats.winRate ?? 0}% {t('W')}
// //                         </Text>
// //                       )} */}
// //                     </View>

// //                     {isSelected && (
// //                       <View style={[styles.selectedDot, { backgroundColor: theme.primary || '#FB923C' }]} />
// //                     )}
// //                   </TouchableOpacity>
// //                 );
// //               })}
// //             </View>
// //           )}

// //           <TouchableOpacity
// //             disabled={!selectedLevel}
// //             activeOpacity={0.8}
// //             onPress={handleStartGame}
// //             style={[
// //               styles.continueButton,
// //               {
// //                 backgroundColor: theme.primary || '#FB923C',
// //                 opacity: selectedLevel ? 1 : 0.4,
// //               },
// //             ]}
// //           >
// //             <Text style={styles.continueText}>
// //               {t('Start Game')}
// //             </Text>
// //           </TouchableOpacity>

// //         </ScrollView>

// //       </LinearGradient>
// //     </SafeAreaView>
// //   );

// //   return <Content />;
// // };

// // export default LevelSelectionScreen;

// // const styles = StyleSheet.create({
// //   safeArea: {
// //     flex: 1,
// //   },
// //   scrollContent: {
// //     flexGrow: 1,
// //     alignItems: 'center',
// //     alignSelf: 'center',          // ✅ centers the scroll content block itself
// //     width: '100%',                // ✅ ensures full width
// //     paddingHorizontal: width * 0.07,
// //     paddingTop: 20,
// //   },
// //   headerContainer: {
// //     alignItems: 'center',
// //     marginBottom: 24,
// //     width: '100%',
// //   },
// //   title: {
// //     fontSize: rf(22),             // ✅ responsive
// //     textAlign: 'center',
// //     fontWeight: '700',
// //     marginBottom: 6,
// //   },
// //   subtitle: {
// //     fontSize: rf(14),             // ✅ responsive
// //     textAlign: 'center',
// //   },
// //   levelContainer: {
// //     flexDirection: 'column',
// //     justifyContent: 'flex-start',
// //     width: '100%',
// //     marginBottom: 32,
// //     alignItems: 'center',         // ✅ centers each card
// //   },
// //   levelButton: {
// //     width: '100%',
// //     paddingVertical: rf(14),      // ✅ responsive padding
// //     paddingHorizontal: rf(16),
// //     borderWidth: 1.5,
// //     borderRadius: 14,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     marginBottom: 12,
// //     position: 'relative',
// //     overflow: 'hidden',
// //   },
// //   levelLeft: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     flex: 1,
// //   },
// //   levelEmoji: {
// //     fontSize: rf(26),             // ✅ responsive
// //     marginRight: 12,
// //   },
// //   levelTextGroup: {
// //     flex: 1,
// //   },
// //   levelName: {
// //     fontSize: rf(15),             // ✅ responsive
// //     fontWeight: '700',
// //     marginBottom: 2,
// //   },
// //   levelDesc: {
// //     fontSize: rf(12),             // ✅ responsive
// //   },
// //   levelRight: {
// //     alignItems: 'flex-end',
// //     minWidth: rf(56),             // ✅ responsive
// //   },
// //   ratingValue: {
// //     fontSize: rf(16),             // ✅ responsive
// //     fontWeight: '800',
// //   },
// //   ratingLabel: {
// //     fontSize: rf(10),             // ✅ responsive
// //     fontWeight: '600',
// //     marginTop: 1,
// //   },
// //   winRate: {
// //     fontSize: rf(11),             // ✅ responsive
// //     fontWeight: '700',
// //     marginTop: 3,
// //   },
// //   selectedDot: {
// //     position: 'absolute',
// //     top: 10,
// //     right: 10,
// //     width: 8,
// //     height: 8,
// //     borderRadius: 4,
// //   },
// //   continueButton: {
// //     width: width * 0.6,
// //     minHeight: rf(52),            // ✅ responsive
// //     paddingVertical: rf(14),      // ✅ responsive
// //     borderRadius: 30,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     alignSelf: 'center',          // ✅ centers the button
// //   },
// //   continueText: {
// //     color: '#fff',
// //     fontSize: rf(18),             // ✅ responsive
// //     fontWeight: '700',
// //     textAlign: 'center',          // ✅ centers button text
// //   },
// // });





// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   PixelRatio,
//   SafeAreaView,
//   ScrollView,
//   ActivityIndicator,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import CustomHeader from '../components/CustomHeader';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useTheme } from '../context/ThemeContext';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useAppTranslation } from '../context/TranslationContext';

// const { width } = Dimensions.get('window');
// const scale = width / 390;
// const rf = (size) => Math.round(PixelRatio.roundToNearestPixel(size * scale));

// const LEVEL_META = {
//   1: { label: 'Beginner',  desc: 'Slow, frequent mistakes',       emoji: '🌱' },
//   2: { label: 'Amateur',   desc: 'Struggles on harder questions',  emoji: '📚' },
//   3: { label: 'Skilled',   desc: 'Solid, occasional slumps',      emoji: '⚡' },
//   4: { label: 'Expert',    desc: 'Fast, high accuracy',            emoji: '🎯' },
//   5: { label: 'Pro',       desc: 'Near-perfect',                   emoji: '🏆' },
// };

// /**
//  * Given the new nested ratings object for a level and the selected symbols,
//  * return the most relevant rating to display.
//  *
//  * diffCode = difficulty letter + symbol count
//  * e.g. symbol count 2 → E2/M2/H2, symbol count 4 → E4/M4/H4
//  *
//  * We show the best rating across all diffCodes for that level so the card
//  * always has a meaningful number even before the player picks a difficulty.
//  */
// const getBestRating = (levelRatings) => {
//   if (!levelRatings || typeof levelRatings !== 'object') return 1000;
//   const values = Object.values(levelRatings).filter(v => typeof v === 'number');
//   if (values.length === 0) return 1000;
//   return Math.max(...values);
// };

// /**
//  * Derive the diffCode from the route params so we can show the
//  * most relevant rating for the player's current selection.
//  *
//  * symbol param examples: 'sum,difference' | 'sum,difference,product,quotient'
//  * diff   param examples: 'easy' | 'medium' | 'hard'
//  */
// const getDiffCode = (diff, symbol) => {
//   const tier = (diff || 'easy')[0].toUpperCase(); // 'E' | 'M' | 'H'
//   const parts = (symbol || '').split(',').map(s => s.trim()).filter(Boolean);
//   const count = parts.length <= 2 ? 2 : 4;
//   return `${tier}${count}`; // e.g. 'M2', 'H4'
// };

// const LevelSelectionScreen = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const insets = useSafeAreaInsets();
//   const { theme } = useTheme();
//   const { t } = useAppTranslation();

//   const [selectedLevel, setSelectedLevel] = useState(null);
//   const [ratings, setRatings] = useState({});
//   const [stats, setStats] = useState({});
//   const [loadingRatings, setLoadingRatings] = useState(true);

//   const { diff, timer, symbol, challengedUser, isComputer } = route.params || {};
//   const bgGradient = theme.backgroundGradient || ['#0f172a', '#1e293b'];

//   // The diffCode for the player's current selection — used to show the
//   // most relevant rating on each level card.
//   const diffCode = getDiffCode(diff, symbol);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const token = await AsyncStorage.getItem('accessToken');
//         if (!token) return;

//         const response = await fetch('http://13.203.232.239:3000/api/computer-game/stats', {
//           method: 'GET',
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });

//         const data = await response.json();
//         if (data.success) {
//           // NEW: ratings are now nested objects { E2: 1000, M2: 1020, ... }
//           setRatings(data.computerRatings || {});
//           setStats(data.computerStats || {});
//         }
//       } catch (err) {
//         console.error('Failed to fetch computer stats:', err);
//       } finally {
//         setLoadingRatings(false);
//       }
//     };

//     fetchStats();
//   }, []);

//   const handleLevelSelect = level => setSelectedLevel(level);

//   const handleStartGame = () => {
//     if (!selectedLevel) return;
//     navigation.navigate('WaitingForOpponent', {
//       selectedLevel,
//       challengedUser,
//       diff,
//       timer,
//       symbol,
//       isComputer: true,
//     });
//   };

//   /**
//    * Get the rating to display on a level card.
//    * Priority: exact diffCode match → best across all diffCodes → 1000
//    */
//   const getRatingForLevel = (level) => {
//     const levelKey = `level${level}`;
//     const levelRatings = ratings[levelKey];
//     if (!levelRatings || typeof levelRatings !== 'object') return 1000;

//     // Show rating for the player's exact current diffCode if available
//     if (levelRatings[diffCode] !== undefined) return levelRatings[diffCode];

//     // Fallback: show best rating across all diffCodes
//     return getBestRating(levelRatings);
//   };

//   const Content = () => (
//     <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background || '#0f172a' }]}>
//       <LinearGradient colors={bgGradient} style={{ flex: 1 }}>

//         <View style={{ paddingTop: 20 }}>
//           <CustomHeader
//             title={t('Select Level')}
//             onBack={() => navigation.goBack()}
//           />
//         </View>

//         <ScrollView
//           contentContainerStyle={[
//             styles.scrollContent,
//             { paddingBottom: insets.bottom + 80 },
//           ]}
//           showsVerticalScrollIndicator={false}
//         >

//           <View style={styles.headerContainer}>
//             <Text style={[styles.title, { color: theme.text || '#ffffff' }]}>
//               {t('Choose your level')}
//             </Text>
//             <Text style={[styles.subtitle, { color: theme.textSecondary || '#94a3b8' }]}>
//               {t('Select a difficulty to play against the AI')}
//             </Text>
//           </View>

//           {loadingRatings ? (
//             <ActivityIndicator
//               size="large"
//               color={theme.primary || '#FB923C'}
//               style={{ marginTop: 40 }}
//             />
//           ) : (
//             <View style={styles.levelContainer}>
//               {[1, 2, 3, 4, 5].map(level => {
//                 const meta = LEVEL_META[level];
//                 const levelKey = `level${level}`;
//                 const rating = getRatingForLevel(level);
//                 const levelStats = stats[levelKey]?.[diffCode]; // stats for exact diffCode
//                 const isSelected = selectedLevel === level;

//                 return (
//                   <TouchableOpacity
//                     key={level}
//                     onPress={() => handleLevelSelect(level)}
//                     activeOpacity={0.8}
//                     style={[
//                       styles.levelButton,
//                       {
//                         borderColor: isSelected
//                           ? theme.primary || '#FB923C'
//                           : 'rgba(255,255,255,0.15)',
//                         backgroundColor: isSelected
//                           ? 'rgba(251,146,60,0.12)'
//                           : 'rgba(255,255,255,0.05)',
//                       },
//                     ]}
//                   >
//                     <View style={styles.levelLeft}>
//                       <Text style={styles.levelEmoji}>{meta.emoji}</Text>
//                       <View style={styles.levelTextGroup}>
//                         <Text style={[
//                           styles.levelName,
//                           { color: isSelected ? (theme.primary || '#FB923C') : (theme.text || '#e0e0e0') },
//                         ]}>
//                           {t('Level')} {level} — {t(meta.label)}
//                         </Text>
//                         <Text style={[styles.levelDesc, { color: theme.textSecondary || '#94a3b8' }]}>
//                           {t(meta.desc)}
//                         </Text>
//                       </View>
//                     </View>

//                     <View style={styles.levelRight}>
//                       <Text style={[styles.ratingValue, { color: theme.text || '#fff' }]}>
//                         {rating}
//                       </Text>
//                       <Text style={[styles.ratingLabel, { color: theme.textSecondary || '#94a3b8' }]}>
//                         {/* Show diffCode so player knows which bucket the rating is for */}
//                         {t('Rating')} ({diffCode})
//                       </Text>
//                       {levelStats && (
//                         <Text style={[styles.winRate, { color: '#10B981' }]}>
//                           {levelStats.winRate ?? 0}% {t('W')}
//                         </Text>
//                       )}
//                     </View>

//                     {isSelected && (
//                       <View style={[styles.selectedDot, { backgroundColor: theme.primary || '#FB923C' }]} />
//                     )}
//                   </TouchableOpacity>
//                 );
//               })}
//             </View>
//           )}

//           <TouchableOpacity
//             disabled={!selectedLevel}
//             activeOpacity={0.8}
//             onPress={handleStartGame}
//             style={[
//               styles.continueButton,
//               {
//                 backgroundColor: theme.primary || '#FB923C',
//                 opacity: selectedLevel ? 1 : 0.4,
//               },
//             ]}
//           >
//             <Text style={styles.continueText}>
//               {t('Start Game')}
//             </Text>
//           </TouchableOpacity>

//         </ScrollView>

//       </LinearGradient>
//     </SafeAreaView>
//   );

//   return <Content />;
// };

// export default LevelSelectionScreen;

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//   },
//   scrollContent: {
//     flexGrow: 1,
//     alignItems: 'center',
//     alignSelf: 'center',
//     width: '100%',
//     paddingHorizontal: width * 0.07,
//     paddingTop: 20,
//   },
//   headerContainer: {
//     alignItems: 'center',
//     marginBottom: 24,
//     width: '100%',
//   },
//   title: {
//     fontSize: rf(22),
//     textAlign: 'center',
//     fontWeight: '700',
//     marginBottom: 6,
//   },
//   subtitle: {
//     fontSize: rf(14),
//     textAlign: 'center',
//   },
//   levelContainer: {
//     flexDirection: 'column',
//     justifyContent: 'flex-start',
//     width: '100%',
//     marginBottom: 32,
//     alignItems: 'center',
//   },
//   levelButton: {
//     width: '100%',
//     paddingVertical: rf(14),
//     paddingHorizontal: rf(16),
//     borderWidth: 1.5,
//     borderRadius: 14,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//     position: 'relative',
//     overflow: 'hidden',
//   },
//   levelLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   levelEmoji: {
//     fontSize: rf(26),
//     marginRight: 12,
//   },
//   levelTextGroup: {
//     flex: 1,
//   },
//   levelName: {
//     fontSize: rf(15),
//     fontWeight: '700',
//     marginBottom: 2,
//   },
//   levelDesc: {
//     fontSize: rf(12),
//   },
//   levelRight: {
//     alignItems: 'flex-end',
//     minWidth: rf(70),
//   },
//   ratingValue: {
//     fontSize: rf(16),
//     fontWeight: '800',
//   },
//   ratingLabel: {
//     fontSize: rf(10),
//     fontWeight: '600',
//     marginTop: 1,
//   },
//   winRate: {
//     fontSize: rf(11),
//     fontWeight: '700',
//     marginTop: 3,
//   },
//   selectedDot: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//   },
//   continueButton: {
//     width: width * 0.6,
//     minHeight: rf(52),
//     paddingVertical: rf(14),
//     borderRadius: 30,
//     alignItems: 'center',
//     justifyContent: 'center',
//     alignSelf: 'center',
//   },
//   continueText: {
//     color: '#fff',
//     fontSize: rf(18),
//     fontWeight: '700',
//     textAlign: 'center',
//   },
// });


import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  PixelRatio,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomHeader from '../components/CustomHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppTranslation } from '../context/TranslationContext';
import { authFetch as fetch } from '../utils/authFetch'; // auto-refresh wrapper for expired access tokens

const { width } = Dimensions.get('window');
const scale = width / 390;
const rf = (size) => Math.round(PixelRatio.roundToNearestPixel(size * scale));

const LEVEL_META = {
  1: { label: 'Beginner',  desc: 'Everyone starts somewhere',       emoji: '🌱' },
  2: { label: 'Amateur',   desc: 'Rising through the tanks',  emoji: '📚' },
  3: { label: 'Skilled',   desc: 'Bring your A-game',      emoji: '⚡' },
  4: { label: 'Expert',    desc: 'Think fast. Very fast',            emoji: '🎯' },
  5: { label: 'Pro',       desc: 'Beat me if you can',                   emoji: '🏆' },
};

const getBestRating = (levelRatings) => {
  if (!levelRatings || typeof levelRatings !== 'object') return 1000;
  const values = Object.values(levelRatings).filter(v => typeof v === 'number');
  if (values.length === 0) return 1000;
  return Math.max(...values);
};

/**
 * Derive diffCode from diff + symbol.
 * Used ONLY as a fallback when diffCode is not passed from PlayGame.
 */
const getDiffCode = (diff, symbol) => {
  const tier = ((diff || 'easy')[0] || 'e').toUpperCase(); // 'E' | 'M' | 'H'
  const parts = (symbol || '').split(',').map(s => s.trim()).filter(Boolean);
  const count = parts.length <= 2 ? 2 : 4;
  return `${tier}${count}`;
};

const LevelSelectionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useAppTranslation();

  const [selectedLevel, setSelectedLevel] = useState(null);
  const [ratings, setRatings] = useState({});
  const [stats, setStats] = useState({});
  const [loadingRatings, setLoadingRatings] = useState(true);

  const LEVEL_STORAGE_KEY = 'mathetics_last_computer_level';

useEffect(() => {
  AsyncStorage.getItem(LEVEL_STORAGE_KEY).then(val => {
    if (val) setSelectedLevel(Number(val));
  });
}, []);

  // ✅ FIX: also destructure diffCode passed from PlayGame
  const {
    diff,
    timer,
    symbol,
    challengedUser,
    isComputer,
    diffCode: passedDiffCode,   // ← PlayGame now sends this directly
    selectedSymbols,            // ← array form, also from PlayGame
  } = route.params || {};

  const bgGradient = theme.backgroundGradient || ['#0f172a', '#1e293b'];

  // ✅ FIX: prefer the pre-computed diffCode from PlayGame; only derive if missing
  const diffCode = passedDiffCode || getDiffCode(diff, symbol);

  console.log('[LevelSelectionScreen] route.params:', {
    diff,
    timer,
    symbol,
    passedDiffCode,
    resolvedDiffCode: diffCode,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) return;

        const response = await fetch('http://13.203.232.239:3000/api/computer-game/stats', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (data.success) {
          setRatings(data.computerRatings || {});
          setStats(data.computerStats || {});
        }
      } catch (err) {
        console.error('Failed to fetch computer stats:', err);
      } finally {
        setLoadingRatings(false);
      }
    };

    fetchStats();
  }, []);

  const handleLevelSelect = (level) => {
  setSelectedLevel(level);
  AsyncStorage.setItem(LEVEL_STORAGE_KEY, String(level));

  navigation.navigate('PlayGame', {
    selectedOpponent: 'Computer',
    computerLevel: level,
    diff,
    diffCode,
    selectedSymbols: selectedSymbols || symbol?.split(',') || ['sum', 'difference'],
    timer,
    symbol,
    isComputer: true,
    gametype: route.params?.gametype,
  });
};

  const handleStartGame = () => {
    if (!selectedLevel) return;

    console.log('[LevelSelectionScreen] handleStartGame — forwarding params:', {
      selectedLevel,
      diff,
      timer,
      symbol,
      diffCode,
      isComputer: true,
    });

    navigation.navigate('WaitingForOpponent', {
      selectedLevel,
      challengedUser,
      diff,                   // ✅ always forwarded
      timer,                  // ✅ seconds value from PlayGame
      symbol,                 // ✅ comma-separated string e.g. 'sum,difference'
      isComputer: true,
      // ✅ FIX: forward the resolved diffCode so WaitingForOpponent never
      //         has to re-derive it from potentially-undefined params
      diffCode,
    });
  };

  const getRatingForLevel = (level) => {
    const levelKey = `level${level}`;
    const levelRatings = ratings[levelKey];
    if (!levelRatings || typeof levelRatings !== 'object') return 1000;
    if (levelRatings[diffCode] !== undefined) return levelRatings[diffCode];
    return getBestRating(levelRatings);
  };

  const Content = () => (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background || '#0f172a' }]}>
      <LinearGradient colors={bgGradient} style={{ flex: 1 }}>

        <View style={{ paddingTop: 20 }}>
          <CustomHeader
            title={t('Select Level')}
            onBack={() => navigation.goBack()}
          />
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 80 },
          ]}
          showsVerticalScrollIndicator={false}
        >

          <View style={styles.headerContainer}>
            <Text style={[styles.title, { color: theme.text || '#ffffff' }]}>
              {t('Choose your level')}
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary || '#94a3b8' }]}>
              {t('Select a difficulty to play against the AI')}
            </Text>
          </View>

          {loadingRatings ? (
            <ActivityIndicator
              size="large"
              color={theme.primary || '#FB923C'}
              style={{ marginTop: 40 }}
            />
          ) : (
            <View style={styles.levelContainer}>
              {[1, 2, 3, 4, 5].map(level => {
                const meta = LEVEL_META[level];
                const levelKey = `level${level}`;
                const rating = getRatingForLevel(level);
                const levelStats = stats[levelKey]?.[diffCode];
                const isSelected = selectedLevel === level;

                return (
                  <TouchableOpacity
                    key={level}
                    onPress={() => handleLevelSelect(level)}
                    activeOpacity={0.8}
                    style={[
                      styles.levelButton,
                      {
                        borderColor: isSelected
                          ? theme.primary || '#FB923C'
                          : 'rgba(255,255,255,0.15)',
                        backgroundColor: isSelected
                          ? 'rgba(251,146,60,0.12)'
                          : 'rgba(255,255,255,0.05)',
                      },
                    ]}
                  >
                    <View style={styles.levelLeft}>
                      <Text style={styles.levelEmoji}>{meta.emoji}</Text>
                      <View style={styles.levelTextGroup}>
                        <Text style={[
                          styles.levelName,
                          { color: isSelected ? (theme.primary || '#FB923C') : (theme.text || '#e0e0e0') },
                        ]}>
                          {t('Level')} {level} — {t(meta.label)}
                        </Text>
                        <Text style={[styles.levelDesc, { color: theme.textSecondary || '#94a3b8' }]}>
                          {t(meta.desc)}
                        </Text>
                      </View>
                    </View>

                    {/* <View style={styles.levelRight}>
                      <Text style={[styles.ratingValue, { color: theme.text || '#fff' }]}>
                        {rating}
                      </Text>
                      <Text style={[styles.ratingLabel, { color: theme.textSecondary || '#94a3b8' }]}>
                        {t('Rating')} ({diffCode})
                      </Text>
                      {levelStats && (
                        <Text style={[styles.winRate, { color: '#10B981' }]}>
                          {levelStats.winRate ?? 0}% {t('W')}
                        </Text>
                      )}
                    </View> */}
{/* 
                    {isSelected && (
                      <View style={[styles.selectedDot, { backgroundColor: theme.primary || '#FB923C' }]} />
                    )} */}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* <TouchableOpacity
            disabled={!selectedLevel}
            activeOpacity={0.8}
            onPress={handleStartGame}
            style={[
              styles.continueButton,
              {
                backgroundColor: theme.primary || '#FB923C',
                opacity: selectedLevel ? 1 : 0.4,
              },
            ]}
          >
            <Text style={styles.continueText}>
              {t('Start Game')}
            </Text>
          </TouchableOpacity> */}

        </ScrollView>

      </LinearGradient>
    </SafeAreaView>
  );

  return <Content />;
};

export default LevelSelectionScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: width * 0.07,
    paddingTop: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  title: {
    fontSize: rf(22),
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: rf(14),
    textAlign: 'center',
  },
  levelContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%',
    marginBottom: 32,
    alignItems: 'center',
  },
  levelButton: {
    width: '100%',
    paddingVertical: rf(14),
    paddingHorizontal: rf(16),
    borderWidth: 1.5,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  levelLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  levelEmoji: {
    fontSize: rf(26),
    marginRight: 12,
  },
  levelTextGroup: {
    flex: 1,
  },
  levelName: {
    fontSize: rf(15),
    fontWeight: '700',
    marginBottom: 2,
  },
  levelDesc: {
    fontSize: rf(12),
  },
  levelRight: {
    alignItems: 'flex-end',
    minWidth: rf(70),
  },
  ratingValue: {
    fontSize: rf(16),
    fontWeight: '800',
  },
  ratingLabel: {
    fontSize: rf(10),
    fontWeight: '600',
    marginTop: 1,
  },
  winRate: {
    fontSize: rf(11),
    fontWeight: '700',
    marginTop: 3,
  },
  selectedDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  continueButton: {
    width: width * 0.6,
    minHeight: rf(52),
    paddingVertical: rf(14),
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  continueText: {
    color: '#fff',
    fontSize: rf(18),
    fontWeight: '700',
    textAlign: 'center',
  },
});