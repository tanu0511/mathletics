
// // // // // Screens/ThemeSelectorScreen.js
// // // // import React, { useState } from 'react';
// // // // import {
// // // //   View,
// // // //   Text,
// // // //   TouchableOpacity,
// // // //   ScrollView,
// // // //   StyleSheet,
// // // //   Dimensions,
// // // //   PixelRatio,
// // // // } from 'react-native';
// // // // import LinearGradient from 'react-native-linear-gradient';
// // // // import { useTheme, themes } from '../context/ThemeContext';
// // // // import KeyboardSelector from './KeyboardSelector';
// // // // import { useNavigation, useRoute } from '@react-navigation/native';
// // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // import { useSafeAreaInsets } from 'react-native-safe-area-context';
// // // // import CustomHeader from '../components/CustomHeader';

// // // // const { width, height } = Dimensions.get('window');
// // // // const scale = width / 375;
// // // // const normalize = size =>
// // // //   Math.round(PixelRatio.roundToNearestPixel(size * scale));

// // // // const ThemeSelectorScreen = () => {
// // // //   const navigation = useNavigation();
// // // //   const route = useRoute();
// // // //   const from = route.params?.from || 'settings';
// // // //   const { theme, changeTheme } = useTheme();
// // // //   const [selectedTab, setSelectedTab] = useState('colors');
// // // //   const insets = useSafeAreaInsets(); // ✅ Hook

// // // //   const handleNext = () => {
// // // //     navigation.replace('AddFriendScreen');
// // // //   };

// // // //   return (
// // // //     <LinearGradient colors={theme.backgroundGradient} style={{ flex: 1 }}>
// // // //       <View style={{ width: '100%', alignItems: 'center', flex: 1, paddingTop: insets.top + 30 }}>
// // // //         {/* Custom Header with full width separator */}
// // // //         <View style={{ width: '100%', marginBottom: 10 }}>
// // // //           <CustomHeader
// // // //             title="THEME"
// // // //             onBack={() => {
// // // //               if (from === 'onboarding') {
// // // //                 // unexpected, usually no back here or handle differently
// // // //               } else {
// // // //                 navigation.goBack();
// // // //               }
// // // //             }}
// // // //             showBack={from !== 'onboarding'}
// // // //           />
// // // //         </View>

// // // //         <View style={styles.container}>
// // // //           {/* Toggle Buttons */}
// // // //           <View style={styles.toggleContainer}>
// // // //             <TouchableOpacity
// // // //               style={[
// // // //                 styles.toggleButton,
// // // //                 selectedTab === 'colors' && styles.activeToggle,
// // // //               ]}
// // // //               onPress={() => setSelectedTab('colors')}>
// // // //               <Text
// // // //                 style={[
// // // //                   styles.toggleText,
// // // //                   selectedTab === 'colors' && styles.activeToggleText,
// // // //                 ]}>
// // // //                 Colors
// // // //               </Text>
// // // //             </TouchableOpacity>
// // // //             <TouchableOpacity
// // // //               style={[
// // // //                 styles.toggleButton,
// // // //                 selectedTab === 'keyboard' && styles.activeToggle,
// // // //               ]}
// // // //               onPress={() => setSelectedTab('keyboard')}>
// // // //               <Text
// // // //                 style={[
// // // //                   styles.toggleText,
// // // //                   selectedTab === 'keyboard' && styles.activeToggleText,
// // // //                 ]}>
// // // //                 Numpad
// // // //               </Text>
// // // //             </TouchableOpacity>
// // // //           </View>

// // // //           {/* Theme or Keyboard Section */}
// // // //           {selectedTab === 'colors' ? (
// // // //             <ScrollView
// // // //               contentContainerStyle={styles.scroll}
// // // //               showsVerticalScrollIndicator={true}>
// // // //               {Object.keys(themes).map(key => {
// // // //                 const t = themes[key];
// // // //                 const isSelected = theme.name === t.name;
// // // //                 return (
// // // //                   <TouchableOpacity
// // // //                     key={key}
// // // //                     onPress={() => changeTheme(key)}
// // // //                     activeOpacity={0.8}
// // // //                     style={styles.pillContainer}>
// // // //                     <LinearGradient
// // // //                       colors={t.backgroundGradient}
// // // //                       start={{ x: 0, y: 0 }}
// // // //                       end={{ x: 1, y: 0 }}
// // // //                       style={styles.pillBox}>
// // // //                       <View style={styles.circleOuter}>
// // // //                         {isSelected && <View style={styles.circleInner} />}
// // // //                       </View>
// // // //                       <Text style={[styles.pillText, { color: t.text }]}>
// // // //                         {t.name}
// // // //                       </Text>
// // // //                     </LinearGradient>
// // // //                   </TouchableOpacity>
// // // //                 );
// // // //               })}
// // // //             </ScrollView>
// // // //           ) : (
// // // //             <KeyboardSelector />
// // // //           )}

// // // //           {from === 'onboarding' && (
// // // //             <TouchableOpacity
// // // //               style={[styles.nextButton, { backgroundColor: theme.primary }]}
// // // //               onPress={handleNext}>
// // // //               <Text style={[styles.nextText, { color: theme.buttonText || '#fff' }]}>
// // // //                 Next
// // // //               </Text>
// // // //             </TouchableOpacity>
// // // //           )}
// // // //         </View>
// // // //       </View>
// // // //     </LinearGradient>
// // // //   );
// // // // };

// // // // export default ThemeSelectorScreen;

// // // // const styles = StyleSheet.create({
// // // //   container: { flex: 1, alignItems: 'center', paddingHorizontal: "auto" },
// // // //   title: { fontSize: normalize(18), fontWeight: '700', marginBottom: 15 },
// // // //   toggleContainer: {
// // // //     flexDirection: 'row',
// // // //     backgroundColor: '#1C2433',
// // // //     borderRadius: 5,
// // // //     overflow: 'hidden',
// // // //     marginBottom: 20,
// // // //     width: '90%',
// // // //     justifyContent: 'center',
// // // //     top: "2%"
// // // //   },
// // // //   toggleButton: { paddingVertical: 10, paddingHorizontal: 60 },
// // // //   toggleText: { fontSize: normalize(16), color: '#fff' },
// // // //   activeToggle: {
// // // //     backgroundColor: '#595CFF',
// // // //     width: '60%',
// // // //     alignItems: 'center',
// // // //   },
// // // //   activeToggleText: { fontWeight: '700' },
// // // //   scroll: {
// // // //     alignItems: 'center',
// // // //     paddingBottom: 30,
// // // //     top: "3%"
// // // //   },
// // // //   pillContainer: {
// // // //     width: '90%',
// // // //     marginVertical: 10,
// // // //     alignItems: 'center',
// // // //     marginHorizontal: "25%",
// // // //   },

// // // //   pillBox: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     width: '100%',
// // // //     height: height * 0.08,
// // // //     borderRadius: 20,
// // // //     paddingHorizontal: 15,
// // // //     shadowColor: '#000',
// // // //     shadowOffset: { width: 0, height: 4 },
// // // //     shadowOpacity: 0.15,
// // // //     shadowRadius: 8,
// // // //     elevation: 6,
// // // //   },

// // // //   circleOuter: {
// // // //     width: normalize(22),
// // // //     height: normalize(22),
// // // //     borderRadius: normalize(11),
// // // //     borderWidth: 2,
// // // //     borderColor: '#fff',
// // // //     marginRight: 15,
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //   },

// // // //   circleInner: {
// // // //     width: '80%',
// // // //     height: '80%',
// // // //     borderRadius: 999,
// // // //     backgroundColor: '#fff',
// // // //   },

// // // //   pillText: {
// // // //     fontSize: normalize(14),
// // // //     fontWeight: '600',
// // // //   },
// // // //   nextButton: {
// // // //     marginTop: 20,
// // // //     paddingVertical: 12,
// // // //     paddingHorizontal: 60,
// // // //     borderRadius: 25,
// // // //   },
// // // //   nextText: {
// // // //     fontSize: normalize(16),
// // // //     fontWeight: '700',
// // // //   },
// // // // });


// // // // Screens/ThemeSelectorScreen.js
// // // import React, { useState } from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   TouchableOpacity,
// // //   ScrollView,
// // //   StyleSheet,
// // //   Dimensions,
// // //   PixelRatio,
// // // } from 'react-native';
// // // import LinearGradient from 'react-native-linear-gradient';
// // // import { useTheme, themes } from '../context/ThemeContext';
// // // import KeyboardSelector from './KeyboardSelector';
// // // import { useNavigation, useRoute } from '@react-navigation/native';
// // // import Icon from 'react-native-vector-icons/Ionicons';
// // // import { useSafeAreaInsets } from 'react-native-safe-area-context';
// // // import CustomHeader from '../components/CustomHeader';
// // // import { useAppTranslation } from '../context/TranslationContext';
// // // const { width, height } = Dimensions.get('window');
// // // const scale = width / 375;
// // // const normalize = size =>
// // //   Math.round(PixelRatio.roundToNearestPixel(size * scale));

// // // const ThemeSelectorScreen = () => {
// // //   const navigation = useNavigation();
// // //   const route = useRoute();
// // //   const from = route.params?.from || 'settings';
// // //   const { theme, changeTheme } = useTheme();
// // //   const [selectedTab, setSelectedTab] = useState('colors');
// // //   const insets = useSafeAreaInsets(); // ✅ Hook
// // // const { t } = useAppTranslation();
// // //   const handleNext = () => {
// // //     navigation.replace('AddFriendScreen');
// // //   };

// // //   return (
// // //     <LinearGradient colors={theme.backgroundGradient} style={{ flex: 1 }}>
// // //       <View style={{ width: '100%', alignItems: 'center', flex: 1, paddingTop: insets.top + 30 }}>
// // //         {/* Custom Header with full width separator */}
// // //         <View style={{ width: '100%', marginBottom: 10 }}>
// // //           <CustomHeader
// // //            title={t('THEME')}
// // //             onBack={() => {
// // //               if (from === 'onboarding') {
// // //                 // unexpected, usually no back here or handle differently
// // //               } else {
// // //                 navigation.goBack();
// // //               }
// // //             }}
// // //             showBack={from !== 'onboarding'}
// // //           />
// // //         </View>

// // //         <View style={styles.container}>
// // //           {/* Toggle Buttons */}
// // //           <View style={styles.toggleContainer}>
// // //             <TouchableOpacity
// // //               style={[
// // //                 styles.toggleButton,
// // //                 selectedTab === 'colors' && styles.activeToggle,
// // //               ]}
// // //               onPress={() => setSelectedTab('colors')}>
// // //               <Text
// // //                 style={[
// // //                   styles.toggleText,
// // //                   selectedTab === 'colors' && styles.activeToggleText,
// // //                 ]}>
// // //                {t('Colors')}
// // //               </Text>
// // //             </TouchableOpacity>
// // //             <TouchableOpacity
// // //               style={[
// // //                 styles.toggleButton,
// // //                 selectedTab === 'keyboard' && styles.activeToggle,
// // //               ]}
// // //               onPress={() => setSelectedTab('keyboard')}>
// // //               <Text
// // //                 style={[
// // //                   styles.toggleText,
// // //                   selectedTab === 'keyboard' && styles.activeToggleText,
// // //                 ]}>
// // //               {t('Numpad')}
// // //               </Text>
// // //             </TouchableOpacity>
// // //           </View>

// // //           {/* Theme or Keyboard Section */}
// // //           {selectedTab === 'colors' ? (
// // //             <ScrollView
// // //               contentContainerStyle={styles.scroll}
// // //               showsVerticalScrollIndicator={true}>
// // //               {Object.keys(themes).map(key => {
// // //                 const t = themes[key];
// // //                 const isSelected = theme.name === t.name;
// // //                 return (
// // //                   <TouchableOpacity
// // //                     key={key}
// // //                     onPress={() => changeTheme(key)}
// // //                     activeOpacity={0.8}
// // //                     style={styles.pillContainer}>
// // //                     <LinearGradient
// // //                       colors={t.backgroundGradient}
// // //                       start={{ x: 0, y: 0 }}
// // //                       end={{ x: 1, y: 0 }}
// // //                       style={styles.pillBox}>
// // //                       <View style={styles.circleOuter}>
// // //                         {isSelected && <View style={styles.circleInner} />}
// // //                       </View>
// // //                       <Text style={[styles.pillText, { color: t.text }]}>
// // //                         {t.name}
// // //                       </Text>
// // //                     </LinearGradient>
// // //                   </TouchableOpacity>
// // //                 );
// // //               })}
// // //             </ScrollView>
// // //           ) : (
// // //             <KeyboardSelector />
// // //           )}

// // //           {from === 'onboarding' && (
// // //             <TouchableOpacity
// // //               style={[styles.nextButton, { backgroundColor: theme.primary }]}
// // //               onPress={handleNext}>
// // //               <Text style={[styles.nextText, { color: theme.buttonText || '#fff' }]}>
// // //                 {t('Next')}
// // //               </Text>
// // //             </TouchableOpacity>
// // //           )}
// // //         </View>
// // //       </View>
// // //     </LinearGradient>
// // //   );
// // // };

// // // export default ThemeSelectorScreen;

// // // const styles = StyleSheet.create({
// // //   container: { flex: 1, alignItems: 'center', paddingHorizontal: "auto" },
// // //   title: { fontSize: normalize(18), fontWeight: '700', marginBottom: 15 },
// // //   toggleContainer: {
// // //     flexDirection: 'row',
// // //     backgroundColor: '#1C2433',
// // //     borderRadius: 5,
// // //     overflow: 'hidden',
// // //     marginBottom: 20,
// // //     width: '90%',
// // //     justifyContent: 'center',
// // //     top: "2%"
// // //   },
// // //   toggleButton: { paddingVertical: 10, paddingHorizontal: 60 },
// // //   toggleText: { fontSize: normalize(16), color: '#fff' },
// // //   activeToggle: {
// // //     backgroundColor: '#595CFF',
// // //     width: '60%',
// // //     alignItems: 'center',
// // //   },
// // //   activeToggleText: { fontWeight: '700' },
// // //   scroll: {
// // //     alignItems: 'center',
// // //     paddingBottom: 30,
// // //     top: "3%"
// // //   },
// // //   pillContainer: {
// // //     width: '90%',
// // //     marginVertical: 10,
// // //     alignItems: 'center',
// // //     marginHorizontal: "25%",
// // //   },

// // //   pillBox: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     width: '100%',
// // //     height: height * 0.08,
// // //     borderRadius: 20,
// // //     paddingHorizontal: 15,
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 4 },
// // //     shadowOpacity: 0.15,
// // //     shadowRadius: 8,
// // //     elevation: 6,
// // //   },

// // //   circleOuter: {
// // //     width: normalize(22),
// // //     height: normalize(22),
// // //     borderRadius: normalize(11),
// // //     borderWidth: 2,
// // //     borderColor: '#fff',
// // //     marginRight: 15,
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //   },

// // //   circleInner: {
// // //     width: '80%',
// // //     height: '80%',
// // //     borderRadius: 999,
// // //     backgroundColor: '#fff',
// // //   },

// // //   pillText: {
// // //     fontSize: normalize(14),
// // //     fontWeight: '600',
// // //   },
// // //   nextButton: {
// // //     marginTop: 20,
// // //     paddingVertical: 12,
// // //     paddingHorizontal: 60,
// // //     borderRadius: 25,
// // //   },
// // //   nextText: {
// // //     fontSize: normalize(16),
// // //     fontWeight: '700',
// // //   },
// // // });


// // // Screens/ThemeSelectorScreen.js
// // import React, { useState } from 'react';
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   ScrollView,
// //   StyleSheet,
// //   Dimensions,
// //   PixelRatio,
// // } from 'react-native';
// // import LinearGradient from 'react-native-linear-gradient';
// // import { useTheme, themes } from '../context/ThemeContext';
// // import KeyboardSelector from './KeyboardSelector';
// // import { useNavigation, useRoute } from '@react-navigation/native';
// // import { useSafeAreaInsets } from 'react-native-safe-area-context';
// // import CustomHeader from '../components/CustomHeader';
// // import { useAppTranslation } from '../context/TranslationContext';

// // const { width, height } = Dimensions.get('window');
// // const scale = width / 375;
// // const normalize = size =>
// //   Math.round(PixelRatio.roundToNearestPixel(size * scale));

// // const ThemeSelectorScreen = () => {
// //   const navigation = useNavigation();
// //   const route = useRoute();
// //   const from = route.params?.from || 'settings';
// //   const { theme, changeTheme } = useTheme();
// //   const [selectedTab, setSelectedTab] = useState('colors');
// //   const insets = useSafeAreaInsets();
// //   const { t } = useAppTranslation(); // ✅ never shadowed below

// //   const handleNext = () => {
// //     navigation.replace('AddFriendScreen');
// //   };

// //   return (
// //     <LinearGradient colors={theme.backgroundGradient} style={{ flex: 1 }}>
// //       <View style={{ width: '100%', alignItems: 'center', flex: 1, paddingTop: insets.top + 30 }}>
// //         <View style={{ width: '100%', marginBottom: 10 }}>
// //           <CustomHeader
// //             title={t('THEME')}
// //             onBack={() => {
// //               if (from !== 'onboarding') {
// //                 navigation.goBack();
// //               }
// //             }}
// //             showBack={from !== 'onboarding'}
// //           />
// //         </View>

// //         <View style={styles.container}>
// //           {/* Toggle Buttons */}
// //           <View style={styles.toggleContainer}>
// //             <TouchableOpacity
// //               style={[
// //                 styles.toggleButton,
// //                 selectedTab === 'colors' && styles.activeToggle,
// //               ]}
// //               onPress={() => setSelectedTab('colors')}>
// //               <Text
// //                 style={[
// //                   styles.toggleText,
// //                   selectedTab === 'colors' && styles.activeToggleText,
// //                 ]}>
// //                 {t('Colors')}
// //               </Text>
// //             </TouchableOpacity>
// //             <TouchableOpacity
// //               style={[
// //                 styles.toggleButton,
// //                 selectedTab === 'keyboard' && styles.activeToggle,
// //               ]}
// //               onPress={() => setSelectedTab('keyboard')}>
// //               <Text
// //                 style={[
// //                   styles.toggleText,
// //                   selectedTab === 'keyboard' && styles.activeToggleText,
// //                 ]}>
// //                 {t('Numpad')}
// //               </Text>
// //             </TouchableOpacity>
// //           </View>

// //           {/* Theme or Keyboard Section */}
// //           {selectedTab === 'colors' ? (
// //             <ScrollView
// //               contentContainerStyle={styles.scroll}
// //               showsVerticalScrollIndicator={true}>
// //               {Object.keys(themes).map(key => {
// //                 // ✅ renamed to themeItem — t() is safe throughout this file
// //                 const themeItem = themes[key];
// //                 const isSelected = theme.name === themeItem.name;
// //                 return (
// //                   <TouchableOpacity
// //                     key={key}
// //                     onPress={() => changeTheme(key)}
// //                     activeOpacity={0.8}
// //                     style={styles.pillContainer}>
// //                     <LinearGradient
// //                       colors={themeItem.backgroundGradient}
// //                       start={{ x: 0, y: 0 }}
// //                       end={{ x: 1, y: 0 }}
// //                       style={styles.pillBox}>
// //                       <View style={styles.circleOuter}>
// //                         {isSelected && <View style={styles.circleInner} />}
// //                       </View>
// //                       {/* ✅ t(themeItem.name) translates 'Dark', 'Royal Champ' etc. */}
// //                       <Text style={[styles.pillText, { color: themeItem.text }]}>
// //                         {t(themeItem.name)}
// //                       </Text>
// //                     </LinearGradient>
// //                   </TouchableOpacity>
// //                 );
// //               })}
// //             </ScrollView>
// //           ) : (
// //             <KeyboardSelector />
// //           )}

// //           {from === 'onboarding' && (
// //             <TouchableOpacity
// //               style={[styles.nextButton, { backgroundColor: theme.primary }]}
// //               onPress={handleNext}>
// //               <Text style={[styles.nextText, { color: theme.buttonText || '#fff' }]}>
// //                 {t('Next')}
// //               </Text>
// //             </TouchableOpacity>
// //           )}
// //         </View>
// //       </View>
// //     </LinearGradient>
// //   );
// // };

// // export default ThemeSelectorScreen;

// // const styles = StyleSheet.create({
// //   container: { flex: 1, alignItems: 'center', paddingHorizontal: 'auto' },
// //   title: { fontSize: normalize(18), fontWeight: '700', marginBottom: 15 },
// //   toggleContainer: {
// //     flexDirection: 'row',
// //     backgroundColor: '#1C2433',
// //     borderRadius: 5,
// //     overflow: 'hidden',
// //     marginBottom: 20,
// //     width: '90%',
// //     justifyContent: 'center',
// //     top: '2%',
// //   },
// //   toggleButton: { paddingVertical: 10, paddingHorizontal: 60 },
// //   toggleText: { fontSize: normalize(16), color: '#fff' },
// //   activeToggle: {
// //     backgroundColor: '#595CFF',
// //     width: '60%',
// //     alignItems: 'center',
// //   },
// //   activeToggleText: { fontWeight: '700' },
// //   scroll: {
// //     alignItems: 'center',
// //     paddingBottom: 30,
// //     top: '3%',
// //   },
// //   pillContainer: {
// //     width: '90%',
// //     marginVertical: 10,
// //     alignItems: 'center',
// //     marginHorizontal: '25%',
// //   },
// //   pillBox: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     width: '100%',
// //     height: height * 0.08,
// //     borderRadius: 20,
// //     paddingHorizontal: 15,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.15,
// //     shadowRadius: 8,
// //     elevation: 6,
// //   },
// //   circleOuter: {
// //     width: normalize(22),
// //     height: normalize(22),
// //     borderRadius: normalize(11),
// //     borderWidth: 2,
// //     borderColor: '#fff',
// //     marginRight: 15,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   circleInner: {
// //     width: '80%',
// //     height: '80%',
// //     borderRadius: 999,
// //     backgroundColor: '#fff',
// //   },
// //   pillText: {
// //     fontSize: normalize(14),
// //     fontWeight: '600',
// //   },
// //   nextButton: {
// //     marginTop: 20,
// //     paddingVertical: 12,
// //     paddingHorizontal: 60,
// //     borderRadius: 25,
// //   },
// //   nextText: {
// //     fontSize: normalize(16),
// //     fontWeight: '700',
// //   },
// // });


// // Screens/ThemeSelectorScreen.js
// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
//   Dimensions,
//   PixelRatio,
//   Animated,
//   Image,
// } from 'react-native';
// import { SvgUri } from 'react-native-svg';
// import LinearGradient from 'react-native-linear-gradient';
// import { useTheme, themes } from '../context/ThemeContext';
// import KeyboardSelector from './KeyboardSelector';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import CustomHeader from '../components/CustomHeader';
// import { useAppTranslation } from '../context/TranslationContext';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // ── Badge helpers ────────────────────────────────────────────────────────────

// const BASE_URL = 'http://13.203.232.239:3000';

// /**
//  * Returns true if earnedAt timestamp is within the last `withinSeconds` seconds.
//  */
// const isJustEarned = (earnedAt, withinSeconds = 10) => {
//   if (!earnedAt) return false;
//   const diff = (Date.now() - new Date(earnedAt).getTime()) / 1000;
//   return diff <= withinSeconds;
// };

// /**
//  * Fire POST /api/badges/event/page-visited with page:"theme".
//  * Logs result to console and resolves with newly earned badges array.
//  */
// const fireThemePageVisitBadge = async (token) => {
//   try {
//     const res = await fetch(`${BASE_URL}/api/badges/event/page-visited`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ page: 'theme' }),
//     });

//     const data = await res.json();
//     console.log('[Badge] page-visited "theme" response:', JSON.stringify(data, null, 2));

//     if (data?.newlyEarned?.length > 0) {
//       console.log('[Badge] 🏅 Newly earned badges:', data.newlyEarned);
//       return data.newlyEarned;
//     }

//     return [];
//   } catch (err) {
//     console.error('[Badge] Error calling page-visited theme:', err);
//     return [];
//   }
// };

// // ── Dimensions / scaling ─────────────────────────────────────────────────────

// const { width, height } = Dimensions.get('window');
// const scale = width / 375;
// const normalize = size =>
//   Math.round(PixelRatio.roundToNearestPixel(size * scale));

// // ── Main Screen ──────────────────────────────────────────────────────────────

// const ThemeSelectorScreen = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const from = route.params?.from || 'settings';
//   const { theme, changeTheme } = useTheme();
//   const [selectedTab, setSelectedTab] = useState('colors');
//   const insets = useSafeAreaInsets();
//   const { t } = useAppTranslation();

//   // ── Badge state ──────────────────────────────────────────────────────────
//   const [earnedBadges, setEarnedBadges] = useState([]);
//   const badgeFiredRef = useRef(false); // prevent duplicate calls on re-render

//   useEffect(() => {
//     if (badgeFiredRef.current) return;
//     badgeFiredRef.current = true;

//     const runBadge = async () => {
//       try {
//         const token = await AsyncStorage.getItem('accessToken');
//         if (!token) {
//           console.warn('[Badge] No auth token found in AsyncStorage — skipping page-visit badge.');
//           return;
//         }
//         const newBadges = await fireThemePageVisitBadge(token);
//         if (newBadges.length > 0) {
//           setEarnedBadges(newBadges);
//         }
//       } catch (err) {
//         console.error('[Badge] AsyncStorage error:', err);
//       }
//     };

//     runBadge();
//   }, []); // runs once on mount

//   // ── Navigation ────────────────────────────────────────────────────────────
//   const handleNext = () => {
//     navigation.replace('AddFriendScreen');
//   };

//   return (
//     <LinearGradient colors={theme.backgroundGradient} style={{ flex: 1 }}>
//       <View
//         style={{
//           width: '100%',
//           alignItems: 'center',
//           flex: 1,
//           paddingTop: insets.top + 30,
//         }}>
//         <View style={{ width: '100%', marginBottom: 10 }}>
//           <CustomHeader
//             title={t('THEME')}
//             onBack={() => {
//               if (from !== 'onboarding') {
//                 navigation.goBack();
//               }
//             }}
//             showBack={from !== 'onboarding'}
//           />
//         </View>

//         <View style={styles.container}>
//           {/* Toggle Buttons */}
//           <View style={styles.toggleContainer}>
//             <TouchableOpacity
//               style={[
//                 styles.toggleButton,
//                 selectedTab === 'colors' && styles.activeToggle,
//               ]}
//               onPress={() => setSelectedTab('colors')}>
//               <Text
//                 style={[
//                   styles.toggleText,
//                   selectedTab === 'colors' && styles.activeToggleText,
//                 ]}>
//                 {t('Colors')}
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[
//                 styles.toggleButton,
//                 selectedTab === 'keyboard' && styles.activeToggle,
//               ]}
//               onPress={() => setSelectedTab('keyboard')}>
//               <Text
//                 style={[
//                   styles.toggleText,
//                   selectedTab === 'keyboard' && styles.activeToggleText,
//                 ]}>
//                 {t('Numpad')}
//               </Text>
//             </TouchableOpacity>
//           </View>

//           {/* Theme or Keyboard Section */}
//           {selectedTab === 'colors' ? (
//             <ScrollView
//               contentContainerStyle={styles.scroll}
//               showsVerticalScrollIndicator={true}>
//               {Object.keys(themes).map(key => {
//                 const themeItem = themes[key];
//                 const isSelected = theme.name === themeItem.name;
//                 return (
//                   <TouchableOpacity
//                     key={key}
//                     onPress={() => changeTheme(key)}
//                     activeOpacity={0.8}
//                     style={styles.pillContainer}>
//                     <LinearGradient
//                       colors={themeItem.backgroundGradient}
//                       start={{ x: 0, y: 0 }}
//                       end={{ x: 1, y: 0 }}
//                       style={styles.pillBox}>
//                       <View style={styles.circleOuter}>
//                         {isSelected && <View style={styles.circleInner} />}
//                       </View>
//                       <Text style={[styles.pillText, { color: themeItem.text }]}>
//                         {t(themeItem.name)}
//                       </Text>
//                     </LinearGradient>
//                   </TouchableOpacity>
//                 );
//               })}
//             </ScrollView>
//           ) : (
//             <KeyboardSelector />
//           )}

//           {from === 'onboarding' && (
//             <TouchableOpacity
//               style={[styles.nextButton, { backgroundColor: theme.primary }]}
//               onPress={handleNext}>
//               <Text
//                 style={[
//                   styles.nextText,
//                   { color: theme.buttonText || '#fff' },
//                 ]}>
//                 {t('Next')}
//               </Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>

//       {/* Badge Popup — rendered on top of screen */}
//       {earnedBadges.length > 0 && (
//         <BadgePopupInline
//           badges={earnedBadges}
//           onFinish={() => setEarnedBadges([])}
//         />
//       )}
//     </LinearGradient>
//   );
// };

// // ── Inline Badge Popup (self-contained, no extra import needed) ──────────────

// import Icon from 'react-native-vector-icons/Ionicons';

// const BadgePopupInline = ({ badges = [], onFinish }) => {
//   const scaleAnim = useRef(new Animated.Value(0.6)).current;
//   const opacityAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.parallel([
//       Animated.spring(scaleAnim, {
//         toValue: 1,
//         friction: 6,
//         useNativeDriver: true,
//       }),
//       Animated.timing(opacityAnim, {
//         toValue: 1,
//         duration: 300,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     const timer = setTimeout(() => {
//       Animated.timing(opacityAnim, {
//         toValue: 0,
//         duration: 300,
//         useNativeDriver: true,
//       }).start(() => onFinish && onFinish());
//     }, 2000 + badges.length * 800);

//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <Animated.View style={[popupStyles.overlay, { opacity: opacityAnim }]}>
//       <Animated.View
//         style={[
//           popupStyles.container,
//           { transform: [{ scale: scaleAnim }] },
//         ]}>
//         <Text style={popupStyles.title}>🎉 Badge Earned!</Text>
//         {badges.map((badge, index) => (
//           <BadgeRowInline key={badge.badgeId ?? index} badge={badge} index={index} />
//         ))}
//       </Animated.View>
//     </Animated.View>
//   );
// };

// const BadgeRowInline = ({ badge, index }) => {
//   const translateY = useRef(new Animated.Value(30)).current;
//   const itemOpacity = useRef(new Animated.Value(0)).current;
//   const [svgError, setSvgError] = useState(false);

//   useEffect(() => {
//     Animated.sequence([
//       Animated.delay(index * 300),
//       Animated.parallel([
//         Animated.timing(itemOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
//         Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
//       ]),
//     ]).start();
//   }, []);

//   return (
//     <Animated.View
//       style={[
//         popupStyles.badgeCard,
//         { opacity: itemOpacity, transform: [{ translateY }] },
//       ]}>
//       {badge.iconUrl && !svgError ? (
//         <SvgUri
//           uri={badge.iconUrl}
//           width={36}
//           height={36}
//           onError={() => {
//             console.warn(`[Badge] ❌ SVG load failed for "${badge.title}":`, badge.iconUrl);
//             setSvgError(true);
//           }}
//         />
//       ) : (
//         <Icon name="star" size={28} color="#FFD700" />
//       )}
//       <View style={{ marginLeft: 12, flex: 1 }}>
//         <Text style={popupStyles.badgeTitle}>{badge.title}</Text>
//         <Text style={popupStyles.badgeDesc}>{badge.description}</Text>
//       </View>
//     </Animated.View>
//   );
// };

// const popupStyles = StyleSheet.create({
//   overlay: {
//     position: 'absolute',
//     width: '100%',
//     height: '100%',
//     backgroundColor: 'rgba(0,0,0,0.75)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 999,
//   },
//   container: {
//     width: width * 0.82,
//     backgroundColor: '#0F172A',
//     borderRadius: 20,
//     padding: 20,
//     alignItems: 'center',
//   },
//   title: {
//     color: '#fff',
//     fontSize: 20,
//     fontWeight: '700',
//     marginBottom: 15,
//   },
//   badgeCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#FFD700',
//     padding: 12,
//     borderRadius: 14,
//     marginTop: 10,
//     width: '100%',
//     backgroundColor: '#020617',
//   },
//   badgeImage: { width: 36, height: 36 },
//   badgeTitle: { color: '#fff', fontWeight: '700', fontSize: 14 },
//   badgeDesc: { color: '#94A3B8', fontSize: 12, marginTop: 2 },
// });

// // ── Screen styles ─────────────────────────────────────────────────────────────

// const styles = StyleSheet.create({
//   container: { flex: 1, alignItems: 'center', paddingHorizontal: 'auto' },
//   title: { fontSize: normalize(18), fontWeight: '700', marginBottom: 15 },
//   toggleContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#1C2433',
//     borderRadius: 5,
//     overflow: 'hidden',
//     marginBottom: 20,
//     width: '90%',
//     justifyContent: 'center',
//     top: '2%',
//   },
//   toggleButton: { paddingVertical: 10, paddingHorizontal: 60 },
//   toggleText: { fontSize: normalize(16), color: '#fff' },
//   activeToggle: {
//     backgroundColor: '#595CFF',
//     width: '60%',
//     alignItems: 'center',
//   },
//   activeToggleText: { fontWeight: '700' },
//   scroll: {
//     alignItems: 'center',
//     paddingBottom: 30,
//     top: '3%',
//   },
//   pillContainer: {
//     width: '90%',
//     marginVertical: 10,
//     alignItems: 'center',
//     marginHorizontal: '25%',
//   },
//   pillBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     width: '100%',
//     height: height * 0.08,
//     borderRadius: 20,
//     paddingHorizontal: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   circleOuter: {
//     width: normalize(22),
//     height: normalize(22),
//     borderRadius: normalize(11),
//     borderWidth: 2,
//     borderColor: '#fff',
//     marginRight: 15,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   circleInner: {
//     width: '80%',
//     height: '80%',
//     borderRadius: 999,
//     backgroundColor: '#fff',
//   },
//   pillText: { fontSize: normalize(14), fontWeight: '600' },
//   nextButton: {
//     marginTop: 20,
//     paddingVertical: 12,
//     paddingHorizontal: 60,
//     borderRadius: 25,
//   },
//   nextText: { fontSize: normalize(16), fontWeight: '700' },
// });

// export default ThemeSelectorScreen;


// Screens/ThemeSelectorScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  PixelRatio,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme, themes } from '../context/ThemeContext';
import KeyboardSelector from './KeyboardSelector';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomHeader from '../components/CustomHeader';
import { useAppTranslation } from '../context/TranslationContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authFetch as fetch } from '../utils/authFetch'; // auto-refresh wrapper for expired access tokens
import BadgePopup from './BadgePopup';// ✅ shared component

import { useBadge } from '../context/BadgeContext';

// ── Dimensions / scaling ─────────────────────────────────────────────────────

const { width, height } = Dimensions.get('window');
const scale = width / 375;
const normalize = size =>
  Math.round(PixelRatio.roundToNearestPixel(size * scale));

const BASE_URL = 'http://13.203.232.239:3000';

// ── Main Screen ──────────────────────────────────────────────────────────────

const ThemeSelectorScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const from = route.params?.from || 'settings';
  const { theme, changeTheme } = useTheme();
  const [selectedTab, setSelectedTab] = useState('colors');
  const insets = useSafeAreaInsets();
  const { t } = useAppTranslation();

  // ── Badge state ──────────────────────────────────────────────────────────
  // const [earnedBadges, setEarnedBadges] = useState([]);
  
  const { showBadges } = useBadge();

  const badgeFiredRef = useRef(false);


  useEffect(() => {
    if (badgeFiredRef.current) return;
    badgeFiredRef.current = true;

    const runBadge = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          console.warn('[Badge] No auth token — skipping page-visit badge.');
          return;
        }

        const res = await fetch(`${BASE_URL}/api/badges/event/page-visited`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ page: 'theme' }),
        });

        const data = await res.json();
        console.log('[Badge] page-visited "theme" response:', JSON.stringify(data, null, 2));

        const rawBadges = Array.isArray(data?.newlyEarned) ? data.newlyEarned : [];
        if (rawBadges.length > 0) {
          // Normalize to shape BadgePopup expects
          const normalized = rawBadges.map(b => ({
            badgeId: b.badgeId,
            title: b.title,
            description: b.description,
            icon: b.iconName,
            iconUrl: b.iconUrl,
            color: '#FFD700',
          }));
          // setEarnedBadges(normalized);
showBadges(data.newlyEarned); // feeds the global queue → BadgePopupController shows it

        }
      } catch (err) {
        console.error('[Badge] page-visited theme error:', err);
      }
    };

    runBadge();
  }, []);

  // ── Navigation ────────────────────────────────────────────────────────────
  const handleNext = () => {
    navigation.replace('AddFriendScreen');
  };

  return (
    <LinearGradient colors={theme.backgroundGradient} style={{ flex: 1 }}>
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          flex: 1,
          paddingTop: insets.top + 30,
        }}>
        <View style={{ width: '100%', marginBottom: 10 }}>
          <CustomHeader
            title={t('THEME')}
            onBack={() => {
              if (from !== 'onboarding') {
                navigation.goBack();
              }
            }}
            showBack={from !== 'onboarding'}
          />
        </View>

        <View style={styles.container}>
          {/* Toggle Buttons */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                selectedTab === 'colors' && styles.activeToggle,
              ]}
              onPress={() => setSelectedTab('colors')}>
              <Text
                style={[
                  styles.toggleText,
                  selectedTab === 'colors' && styles.activeToggleText,
                ]}>
                {t('Colors')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                selectedTab === 'keyboard' && styles.activeToggle,
              ]}
              onPress={() => setSelectedTab('keyboard')}>
              <Text
                style={[
                  styles.toggleText,
                  selectedTab === 'keyboard' && styles.activeToggleText,
                ]}>
                {t('Numpad')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Theme or Keyboard Section */}
          {selectedTab === 'colors' ? (
            <ScrollView
              contentContainerStyle={styles.scroll}
              showsVerticalScrollIndicator={true}>
              {Object.keys(themes).map(key => {
                const themeItem = themes[key];
                const isSelected = theme.name === themeItem.name;
                return (
                  <TouchableOpacity
                    key={key}
                    onPress={() => changeTheme(key)}
                    activeOpacity={0.8}
                    style={styles.pillContainer}>
                    <LinearGradient
                      colors={themeItem.backgroundGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.pillBox}>
                      <View style={styles.circleOuter}>
                        {isSelected && <View style={styles.circleInner} />}
                      </View>
                      <Text style={[styles.pillText, { color: themeItem.text }]}>
                        {t(themeItem.name)}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          ) : (
            <KeyboardSelector />
          )}

          {from === 'onboarding' && (
            <TouchableOpacity
              style={[styles.nextButton, { backgroundColor: theme.primary }]}
              onPress={handleNext}>
              <Text style={[styles.nextText, { color: theme.buttonText || '#fff' }]}>
                {t('Next')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ✅ Shared BadgePopup — rendered above everything */}
      {/* {earnedBadges.length > 0 && (
        <BadgePopup
          badges={earnedBadges}
          onFinish={() => setEarnedBadges([])}
        />
      )} */}
    </LinearGradient>
  );
};

export default ThemeSelectorScreen;

// ── Screen styles ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingHorizontal: 'auto' },
  title: { fontSize: normalize(18), fontWeight: '700', marginBottom: 15 },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#1C2433',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 20,
    width: '90%',
    justifyContent: 'center',
    top: '2%',
  },
  toggleButton: { paddingVertical: 10, paddingHorizontal: 60 },
  toggleText: { fontSize: normalize(16), color: '#fff' },
  activeToggle: {
    backgroundColor: '#595CFF',
    width: '60%',
    alignItems: 'center',
  },
  activeToggleText: { fontWeight: '700' },
  scroll: {
    alignItems: 'center',
    paddingBottom: 30,
    top: '3%',
  },
  pillContainer: {
    width: '90%',
    marginVertical: 10,
    alignItems: 'center',
    marginHorizontal: '25%',
  },
  pillBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: height * 0.08,
    borderRadius: 20,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  circleOuter: {
    width: normalize(22),
    height: normalize(22),
    borderRadius: normalize(11),
    borderWidth: 2,
    borderColor: '#fff',
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleInner: {
    width: '80%',
    height: '80%',
    borderRadius: 999,
    backgroundColor: '#fff',
  },
  pillText: { fontSize: normalize(14), fontWeight: '600' },
  nextButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 25,
  },
  nextText: { fontSize: normalize(16), fontWeight: '700' },
});