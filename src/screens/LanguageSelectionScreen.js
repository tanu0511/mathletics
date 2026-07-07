// // // // // import React, { useState } from 'react';
// // // // // import {
// // // // //   View,
// // // // //   Text,
// // // // //   TouchableOpacity,
// // // // //   StyleSheet,
// // // // //   Dimensions,
// // // // //   PixelRatio,
// // // // //   SafeAreaView,
// // // // //   Image,
// // // // //   ActivityIndicator,
// // // // // } from 'react-native';
// // // // // import LinearGradient from 'react-native-linear-gradient';
// // // // // import { useNavigation } from '@react-navigation/native';
// // // // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // // // import i18n from '../utils/localization/i18n';
// // // // // import { useAppTranslation } from '../context/TranslationContext';

// // // // // const { width, height } = Dimensions.get('window');
// // // // // const scaleFont = size => size * PixelRatio.getFontScale();

// // // // // const LanguageSelectionScreen = () => {
// // // // //   const navigation = useNavigation();
// // // // //   const [selectedLang, setSelectedLang] = useState(null);

// // // // //   // 🌐 Pull from our new global translation context
// // // // //   const { t, applyTranslation, isTranslating } = useAppTranslation();

// // // // //   const primaryColor = '#FB923C';
// // // // //   const bgGradient = ['#0f172a', '#1e293b'];

// // // // //   const languages = [
// // // // //     { id: 1, label: 'English', code: 'en' },
// // // // //     { id: 2, label: 'हिंदी', code: 'hi' },
// // // // //     { id: 3, label: 'Español', code: 'es' },
// // // // //     { id: 4, label: '中文', code: 'zh' },
// // // // //   ];

// // // // //   const handleLanguageSelect = async lang => {
// // // // //     setSelectedLang(lang.id);

// // // // //     // Save language code
// // // // //     await AsyncStorage.setItem('appLanguage', lang.code);

// // // // //     // Also update i18n (for any legacy t() usage)
// // // // //     i18n.changeLanguage(lang.code);

// // // // //     // 🚀 Call the backend translation API and update global strings
// // // // //     await applyTranslation(lang.code);
// // // // //   };

// // // // //   return (
// // // // //     <SafeAreaView style={styles.safeArea}>
// // // // //       <LinearGradient colors={bgGradient} style={styles.container}>

// // // // //         {/* Header */}
// // // // //         <View style={styles.headerContainer}>
// // // // //           <Image
// // // // //             source={require('../assets/language1.png')}
// // // // //             style={styles.languageIcon}
// // // // //           />
// // // // //           <Text style={styles.title}>
// // // // //             {t('Select your preferred language')}
// // // // //           </Text>
// // // // //         </View>

// // // // //         {/* Language List */}
// // // // //         <View style={styles.languageContainer}>
// // // // //           {languages.map(lang => (
// // // // //             <TouchableOpacity
// // // // //               key={lang.id}
// // // // //               onPress={() => handleLanguageSelect(lang)}
// // // // //               activeOpacity={0.7}
// // // // //               disabled={isTranslating}
// // // // //               style={[
// // // // //                 styles.langButton,
// // // // //                 {
// // // // //                   borderColor: selectedLang === lang.id ? primaryColor : '#ffffff40',
// // // // //                   backgroundColor:
// // // // //                     selectedLang === lang.id ? '#ffffff20' : 'transparent',
// // // // //                 },
// // // // //               ]}>
// // // // //               {/* Show spinner on the selected language while translating */}
// // // // //               {isTranslating && selectedLang === lang.id ? (
// // // // //                 <ActivityIndicator color={primaryColor} />
// // // // //               ) : (
// // // // //                 <Text
// // // // //                   style={[
// // // // //                     styles.langText,
// // // // //                     { color: selectedLang === lang.id ? '#fff' : '#e0e0e0' },
// // // // //                   ]}>
// // // // //                   {lang.label}
// // // // //                 </Text>
// // // // //               )}
// // // // //             </TouchableOpacity>
// // // // //           ))}
// // // // //         </View>

// // // // //         {/* Continue Button */}
// // // // //         <TouchableOpacity
// // // // //           disabled={!selectedLang || isTranslating}
// // // // //           activeOpacity={0.8}
// // // // //           onPress={() =>
// // // // //             navigation.navigate('LanguageConfirmationScreen', {
// // // // //               selectedLanguage: languages.find(l => l.id === selectedLang)?.label,
// // // // //             })
// // // // //           }
// // // // //           style={[
// // // // //             styles.continueButton,
// // // // //             {
// // // // //               backgroundColor: primaryColor,
// // // // //               opacity: selectedLang && !isTranslating ? 1 : 0.6,
// // // // //             },
// // // // //           ]}>
// // // // //           {isTranslating ? (
// // // // //             <ActivityIndicator color="#fff" />
// // // // //           ) : (
// // // // //             <Text style={styles.continueText}>{t('Continue')}</Text>
// // // // //           )}
// // // // //         </TouchableOpacity>

// // // // //       </LinearGradient>
// // // // //     </SafeAreaView>
// // // // //   );
// // // // // };

// // // // // export default LanguageSelectionScreen;

// // // // // const styles = StyleSheet.create({
// // // // //   safeArea: {
// // // // //     flex: 1,
// // // // //     backgroundColor: '#0f172a',
// // // // //   },
// // // // //   container: {
// // // // //     flex: 1,
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     paddingHorizontal: width * 0.07,
// // // // //   },
// // // // //   headerContainer: {
// // // // //     alignItems: 'center',
// // // // //     marginBottom: height * 0.05,
// // // // //   },
// // // // //   languageIcon: {
// // // // //     width: width * 0.18,
// // // // //     height: width * 0.18,
// // // // //     resizeMode: 'contain',
// // // // //     marginBottom: height * 0.015,
// // // // //   },
// // // // //   title: {
// // // // //     fontSize: scaleFont(20),
// // // // //     color: '#ffffff',
// // // // //     textAlign: 'center',
// // // // //     fontWeight: '700',
// // // // //     lineHeight: 28,
// // // // //   },
// // // // //   languageContainer: {
// // // // //     width: '100%',
// // // // //     alignItems: 'center',
// // // // //     marginBottom: height * 0.08,
// // // // //   },
// // // // //   langButton: {
// // // // //     width: '90%',
// // // // //     borderWidth: 1,
// // // // //     borderRadius: width * 0.03,
// // // // //     paddingVertical: height * 0.018,
// // // // //     marginVertical: height * 0.012,
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     minHeight: height * 0.065,
// // // // //   },
// // // // //   langText: {
// // // // //     fontSize: scaleFont(18),
// // // // //     fontWeight: '600',
// // // // //   },
// // // // //   continueButton: {
// // // // //     width: width * 0.6,
// // // // //     height: height * 0.065,
// // // // //     borderRadius: width * 0.08,
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //   },
// // // // //   continueText: {
// // // // //     color: '#fff',
// // // // //     fontSize: scaleFont(18),
// // // // //     fontWeight: '700',
// // // // //   },
// // // // // });


// // // // // import React, { useEffect, useState } from 'react';
// // // // // import {
// // // // //   View,
// // // // //   Text,
// // // // //   TouchableOpacity,
// // // // //   StyleSheet,
// // // // //   Dimensions,
// // // // //   PixelRatio,
// // // // //   SafeAreaView,
// // // // //   Image,
// // // // // } from 'react-native';
// // // // // import LinearGradient from 'react-native-linear-gradient';
// // // // // import { useNavigation } from '@react-navigation/native';
// // // // // import { useTranslation } from 'react-i18next';
// // // // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // // // import i18n from '../utils/localization/i18n';

// // // // // const { width, height } = Dimensions.get('window');
// // // // // const scaleFont = size => size * PixelRatio.getFontScale();

// // // // // const LanguageSelectionScreen = () => {
// // // // //   const navigation = useNavigation();
// // // // //   const { t } = useTranslation();
// // // // //   const [selectedLang, setSelectedLang] = useState(null);

// // // // //   // Default Color Setup (Theme remove hone ke baad)
// // // // //   const primaryColor = '#FB923C';
// // // // //   const bgGradient = ['#0f172a', '#1e293b']; // Default dark gradient

// // // // //   const languages = [
// // // // //     { id: 1, label: 'English', code: 'en' },
// // // // //     { id: 2, label: 'हिंदी', code: 'hi' },
// // // // //     { id: 3, label: 'Español', code: 'es' },
// // // // //     { id: 4, label: '中文', code: 'zh' },
// // // // //   ];

// // // // //   // Removed premature firstLaunch setting
// // // // //   // useEffect(() => {
// // // // //   //   const setFirstLaunchFlag = async () => {
// // // // //   //     try {
// // // // //   //       await AsyncStorage.setItem('firstLaunch', 'false');
// // // // //   //     } catch (e) {
// // // // //   //       console.log("Error saving flag", e);
// // // // //   //     }
// // // // //   //   };
// // // // //   //   setFirstLaunchFlag();
// // // // //   // }, []);

// // // // //   const handleLanguageSelect = async lang => {
// // // // //     setSelectedLang(lang.id);
// // // // //     await AsyncStorage.setItem('appLanguage', lang.code);
// // // // //     i18n.changeLanguage(lang.code);
// // // // //   };

// // // // //   return (
// // // // //     <SafeAreaView style={styles.safeArea}>
// // // // //       <LinearGradient colors={bgGradient} style={styles.container}>

// // // // //         {/* 🌍 Header */}
// // // // //         <View style={styles.headerContainer}>
// // // // //           <Image
// // // // //             source={require('../assets/language1.png')}
// // // // //             style={styles.languageIcon}
// // // // //           />
// // // // //           <Text style={styles.title}>{t('Select your preferred language')}</Text>
// // // // //         </View>

// // // // //         {/* 🌐 Language List */}
// // // // //         <View style={styles.languageContainer}>
// // // // //           {languages.map(lang => (
// // // // //             <TouchableOpacity
// // // // //               key={lang.id}
// // // // //               onPress={() => handleLanguageSelect(lang)}
// // // // //               activeOpacity={0.7}
// // // // //               style={[
// // // // //                 styles.langButton,
// // // // //                 {
// // // // //                   borderColor: selectedLang === lang.id ? primaryColor : '#ffffff40',
// // // // //                   backgroundColor: selectedLang === lang.id ? '#ffffff20' : 'transparent',
// // // // //                 },
// // // // //               ]}>
// // // // //               <Text
// // // // //                 style={[
// // // // //                   styles.langText,
// // // // //                   {
// // // // //                     color: selectedLang === lang.id ? '#fff' : '#e0e0e0',
// // // // //                   },
// // // // //                 ]}>
// // // // //                 {lang.label}
// // // // //               </Text>
// // // // //             </TouchableOpacity>
// // // // //           ))}
// // // // //         </View>

// // // // //         {/* 🚀 Continue */}
// // // // //         <TouchableOpacity
// // // // //           disabled={!selectedLang}
// // // // //           activeOpacity={0.8}
// // // // //           onPress={() =>
// // // // //             navigation.navigate('LanguageConfirmationScreen', {
// // // // //               selectedLanguage: languages.find(l => l.id === selectedLang)?.label
// // // // //             })
// // // // //           }
// // // // //           style={[
// // // // //             styles.continueButton,
// // // // //             { backgroundColor: primaryColor, opacity: selectedLang ? 1 : 0.6 },
// // // // //           ]}>
// // // // //           <Text style={styles.continueText}>{t('CONTINUE')}</Text>
// // // // //         </TouchableOpacity>

// // // // //       </LinearGradient>
// // // // //     </SafeAreaView>
// // // // //   );
// // // // // };

// // // // // export default LanguageSelectionScreen;

// // // // // const styles = StyleSheet.create({
// // // // //   safeArea: {
// // // // //     flex: 1,
// // // // //     backgroundColor: '#0f172a',
// // // // //   },
// // // // //   container: {
// // // // //     flex: 1,
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     paddingHorizontal: width * 0.07,
// // // // //   },
// // // // //   headerContainer: {
// // // // //     alignItems: 'center',
// // // // //     marginBottom: height * 0.05,
// // // // //   },
// // // // //   languageIcon: {
// // // // //     width: width * 0.18,
// // // // //     height: width * 0.18,
// // // // //     resizeMode: 'contain',
// // // // //     marginBottom: height * 0.015,
// // // // //   },
// // // // //   title: {
// // // // //     fontSize: scaleFont(20),
// // // // //     color: '#ffffff',
// // // // //     textAlign: 'center',
// // // // //     fontWeight: '700',
// // // // //     lineHeight: 28,
// // // // //   },
// // // // //   languageContainer: {
// // // // //     width: '100%',
// // // // //     alignItems: 'center',
// // // // //     marginBottom: height * 0.08,
// // // // //   },
// // // // //   langButton: {
// // // // //     width: '90%',
// // // // //     borderWidth: 1,
// // // // //     borderRadius: width * 0.03,
// // // // //     paddingVertical: height * 0.018,
// // // // //     marginVertical: height * 0.012,
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   langText: {
// // // // //     fontSize: scaleFont(18),
// // // // //     fontWeight: '600',
// // // // //   },
// // // // //   continueButton: {
// // // // //     width: width * 0.6,
// // // // //     height: height * 0.065,
// // // // //     borderRadius: width * 0.08,
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //   },
// // // // //   continueText: {
// // // // //     color: '#fff',
// // // // //     fontSize: scaleFont(18),
// // // // //     fontWeight: '700',
// // // // //   },
// // // // // });
// // // // // screens/LanguageSelectionScreen.jsx

// // // // import React, { useState } from 'react';
// // // // import {
// // // //   View,
// // // //   Text,
// // // //   TouchableOpacity,
// // // //   StyleSheet,
// // // //   Dimensions,
// // // //   PixelRatio,
// // // //   SafeAreaView,
// // // //   Image,
// // // //   ActivityIndicator,
// // // // } from 'react-native';
// // // // import LinearGradient from 'react-native-linear-gradient';
// // // // import { useNavigation } from '@react-navigation/native';
// // // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // // import i18n from '../utils/localization/i18n';
// // // // import { useAppTranslation } from '../context/TranslationContext';

// // // // const { width, height } = Dimensions.get('window');
// // // // const scaleFont = size => size * PixelRatio.getFontScale();

// // // // const LanguageSelectionScreen = () => {
// // // //   const navigation = useNavigation();
// // // //   const [selectedLang, setSelectedLang] = useState(null);

// // // //   // 🌐 Pull from our new global translation context
// // // //   const { t, applyTranslation, isTranslating } = useAppTranslation();

// // // //   const primaryColor = '#FB923C';
// // // //   const bgGradient = ['#0f172a', '#1e293b'];

// // // //   const languages = [
// // // //     { id: 1, label: 'English', code: 'en' },
// // // //     { id: 2, label: 'हिंदी', code: 'hi' },
// // // //     { id: 3, label: 'Español', code: 'es' },
// // // //     { id: 4, label: '中文', code: 'zh' },
// // // //   ];

// // // //   const handleLanguageSelect = async lang => {
// // // //     setSelectedLang(lang.id);

// // // //     // Save language code
// // // //     await AsyncStorage.setItem('appLanguage', lang.code);

// // // //     // Also update i18n (for any legacy t() usage)
// // // //     i18n.changeLanguage(lang.code);

// // // //     // 🚀 Call the backend translation API and update global strings
// // // //     await applyTranslation(lang.code);
// // // //   };

// // // //   return (
// // // //     <SafeAreaView style={styles.safeArea}>
// // // //       <LinearGradient colors={bgGradient} style={styles.container}>

// // // //         {/* Header */}
// // // //         <View style={styles.headerContainer}>
// // // //           <Image
// // // //             source={require('../assets/language1.png')}
// // // //             style={styles.languageIcon}
// // // //           />
// // // //           <Text style={styles.title}>
// // // //             {t('Select your preferred language')}
// // // //           </Text>
// // // //         </View>

// // // //         {/* Language List */}
// // // //         <View style={styles.languageContainer}>
// // // //           {languages.map(lang => (
// // // //             <TouchableOpacity
// // // //               key={lang.id}
// // // //               onPress={() => handleLanguageSelect(lang)}
// // // //               activeOpacity={0.7}
// // // //               disabled={isTranslating}
// // // //               style={[
// // // //                 styles.langButton,
// // // //                 {
// // // //                   borderColor: selectedLang === lang.id ? primaryColor : '#ffffff40',
// // // //                   backgroundColor:
// // // //                     selectedLang === lang.id ? '#ffffff20' : 'transparent',
// // // //                 },
// // // //               ]}>
// // // //               {/* Show spinner on the selected language while translating */}
// // // //               {isTranslating && selectedLang === lang.id ? (
// // // //                 <ActivityIndicator color={primaryColor} />
// // // //               ) : (
// // // //                 <Text
// // // //                   style={[
// // // //                     styles.langText,
// // // //                     { color: selectedLang === lang.id ? '#fff' : '#e0e0e0' },
// // // //                   ]}>
// // // //                   {lang.label}
// // // //                 </Text>
// // // //               )}
// // // //             </TouchableOpacity>
// // // //           ))}
// // // //         </View>

// // // //         {/* Continue Button */}
// // // //         <TouchableOpacity
// // // //           disabled={!selectedLang || isTranslating}
// // // //           activeOpacity={0.8}
// // // //           onPress={() =>
// // // //             navigation.navigate('LanguageConfirmationScreen', {
// // // //               selectedLanguage: languages.find(l => l.id === selectedLang)?.label,
// // // //             })
// // // //           }
// // // //           style={[
// // // //             styles.continueButton,
// // // //             {
// // // //               backgroundColor: primaryColor,
// // // //               opacity: selectedLang && !isTranslating ? 1 : 0.6,
// // // //             },
// // // //           ]}>
// // // //           {isTranslating ? (
// // // //             <ActivityIndicator color="#fff" />
// // // //           ) : (
// // // //             <Text style={styles.continueText}>{t('Continue')}</Text>
// // // //           )}
// // // //         </TouchableOpacity>

// // // //       </LinearGradient>
// // // //     </SafeAreaView>
// // // //   );
// // // // };

// // // // export default LanguageSelectionScreen;

// // // // const styles = StyleSheet.create({
// // // //   safeArea: {
// // // //     flex: 1,
// // // //     backgroundColor: '#0f172a',
// // // //   },
// // // //   container: {
// // // //     flex: 1,
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     paddingHorizontal: width * 0.07,
// // // //   },
// // // //   headerContainer: {
// // // //     alignItems: 'center',
// // // //     marginBottom: height * 0.05,
// // // //   },
// // // //   languageIcon: {
// // // //     width: width * 0.18,
// // // //     height: width * 0.18,
// // // //     resizeMode: 'contain',
// // // //     marginBottom: height * 0.015,
// // // //   },
// // // //   title: {
// // // //     fontSize: scaleFont(20),
// // // //     color: '#ffffff',
// // // //     textAlign: 'center',
// // // //     fontWeight: '700',
// // // //     lineHeight: 28,
// // // //   },
// // // //   languageContainer: {
// // // //     width: '100%',
// // // //     alignItems: 'center',
// // // //     marginBottom: height * 0.08,
// // // //   },
// // // //   langButton: {
// // // //     width: '90%',
// // // //     borderWidth: 1,
// // // //     borderRadius: width * 0.03,
// // // //     paddingVertical: height * 0.018,
// // // //     marginVertical: height * 0.012,
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     minHeight: height * 0.065,
// // // //   },
// // // //   langText: {
// // // //     fontSize: scaleFont(18),
// // // //     fontWeight: '600',
// // // //   },
// // // //   continueButton: {
// // // //     width: width * 0.6,
// // // //     height: height * 0.065,
// // // //     borderRadius: width * 0.08,
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //   },
// // // //   continueText: {
// // // //     color: '#fff',
// // // //     fontSize: scaleFont(18),
// // // //     fontWeight: '700',
// // // //   },
// // // // });

// // // // screens/LanguageSelectionScreen.jsx
// // // // screens/LanguageSelectionScreen.jsx
// // // // import React, { useState } from 'react';
// // // // import {
// // // //   View,
// // // //   Text,
// // // //   TouchableOpacity,
// // // //   StyleSheet,
// // // //   Dimensions,
// // // //   PixelRatio,
// // // //   SafeAreaView,
// // // //   Image,
// // // //   ActivityIndicator,
// // // // } from 'react-native';
// // // // import LinearGradient from 'react-native-linear-gradient';
// // // // import { useNavigation } from '@react-navigation/native';
// // // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // // import i18n from '../utils/localization/i18n';
// // // // import { useAppTranslation } from '../context/TranslationContext';
// // // // import CustomHeader from '../components/CustomHeader';
// // // // import { useSafeAreaInsets } from 'react-native-safe-area-context';
// // // // const { width, height } = Dimensions.get('window');
// // // // const scaleFont = size => size * PixelRatio.getFontScale();

// // // // const LanguageSelectionScreen = () => {
// // // //   const navigation = useNavigation();
// // // //   const [selectedLang, setSelectedLang] = useState(null);
// // // //   const { t, applyTranslation, isTranslating } = useAppTranslation();
// // // //   const insets = useSafeAreaInsets();

// // // //   const primaryColor = '#FB923C';
// // // //   const bgGradient = ['#0f172a', '#1e293b'];


// // // //   const languages = [
// // // //   { id: 1, label: 'English',  code: 'en' },
// // // //   { id: 2, label: 'हिंदी',    code: 'hi' },
// // // //   { id: 3, label: 'Español',  code: 'es' },
// // // //   { id: 4, label: 'मराठी',    code: 'mr' },  // ← Marathi
// // // //   { id: 5, label: 'ಕನ್ನಡ',    code: 'kn' },  // ← Kannada
// // // //   { id: 6, label: 'తెలుగు',   code: 'te' },  // ← Telugu
// // // // ];
// // // //   const handleLanguageSelect = async lang => {
// // // //     setSelectedLang(lang.id);
// // // //     await AsyncStorage.setItem('appLanguage', lang.code);
// // // //     i18n.changeLanguage(lang.code);
// // // //     await applyTranslation(lang.code);
// // // //   };

// // // //   return (
// // // //     <SafeAreaView style={styles.safeArea}>
// // // //       <LinearGradient colors={bgGradient} style={styles.container}>

// // // //  {/* <View style={{ 
// // // //   position: 'absolute',
// // // //   top: 10,
// // // //   left: 0,
// // // //   right: 0,
// // // //   paddingTop: insets.top,
// // // // }}>
// // // //   <CustomHeader 
// // // //     title={t('Select Language')} 
// // // //     onBack={() => navigation.goBack()} 
// // // //   />
// // // // </View> */}

// // // //         {/* Header */}
// // // //         <View style={styles.headerContainer}>
// // // //           <Image
// // // //             source={require('../assets/language1.png')}
// // // //             style={styles.languageIcon}
// // // //           />
// // // //           <Text style={styles.title}>
// // // //             {t('Select your preferred language')}
// // // //           </Text>
// // // //         </View>

// // // //         {/* Language List */}
// // // //         <View style={styles.languageContainer}>
// // // //           {languages.map(lang => (
// // // //             <TouchableOpacity
// // // //               key={lang.id}
// // // //               onPress={() => handleLanguageSelect(lang)}
// // // //               activeOpacity={0.7}
// // // //               disabled={isTranslating}
// // // //               style={[
// // // //                 styles.langButton,
// // // //                 {
// // // //                   borderColor:
// // // //                     selectedLang === lang.id ? primaryColor : '#ffffff40',
// // // //                   backgroundColor:
// // // //                     selectedLang === lang.id ? '#ffffff20' : 'transparent',
// // // //                 },
// // // //               ]}>
// // // //               {isTranslating && selectedLang === lang.id ? (
// // // //                 <ActivityIndicator color={primaryColor} />
// // // //               ) : (
// // // //                 <Text
// // // //                   style={[
// // // //                     styles.langText,
// // // //                     { color: selectedLang === lang.id ? '#fff' : '#e0e0e0' },
// // // //                   ]}>
// // // //                   {lang.label}
// // // //                 </Text>
// // // //               )}
// // // //             </TouchableOpacity>
// // // //           ))}
// // // //         </View>

// // // //         {/* Continue Button */}
// // // //         <TouchableOpacity
// // // //           disabled={!selectedLang || isTranslating}
// // // //           activeOpacity={0.8}
// // // //           onPress={() =>
// // // //             navigation.navigate('LanguageConfirmationScreen', {
// // // //               selectedLanguage: languages.find(l => l.id === selectedLang)?.label,
// // // //             })
// // // //           }
// // // //           style={[
// // // //             styles.continueButton,
// // // //             {
// // // //               backgroundColor: primaryColor,
// // // //               opacity: selectedLang && !isTranslating ? 1 : 0.6,
// // // //             },
// // // //           ]}>
// // // //           {isTranslating ? (
// // // //             <ActivityIndicator color="#fff" />
// // // //           ) : (
// // // //             <Text style={styles.continueText}>{t('Continue')}</Text>
// // // //           )}
// // // //         </TouchableOpacity>

// // // //       </LinearGradient>
// // // //     </SafeAreaView>
// // // //   );
// // // // };

// // // // export default LanguageSelectionScreen;

// // // // const styles = StyleSheet.create({
// // // //   safeArea: { flex: 1, backgroundColor: '#0f172a' },
// // // //   container: {
// // // //     flex: 1,
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     paddingHorizontal: width * 0.07,
// // // //   },
// // // //   headerContainer: {
// // // //     alignItems: 'center',
// // // //     marginBottom: height * 0.05,
// // // //   },
// // // //   languageIcon: {
// // // //     width: width * 0.18,
// // // //     height: width * 0.18,
// // // //     resizeMode: 'contain',
// // // //     marginBottom: height * 0.015,
// // // //   },
// // // //   title: {
// // // //     fontSize: scaleFont(20),
// // // //     color: '#ffffff',
// // // //     textAlign: 'center',
// // // //     fontWeight: '700',
// // // //     lineHeight: 28,
// // // //   },
// // // //   languageContainer: {
// // // //     width: '100%',
// // // //     alignItems: 'center',
// // // //     marginBottom: height * 0.08,
// // // //   },
// // // //   langButton: {
// // // //     width: '90%',
// // // //     borderWidth: 1,
// // // //     borderRadius: width * 0.03,
// // // //     paddingVertical: height * 0.018,
// // // //     marginVertical: height * 0.012,
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     minHeight: height * 0.065,
// // // //   },
// // // //   langText: {
// // // //     fontSize: scaleFont(18),
// // // //     fontWeight: '600',
// // // //   },
// // // //   continueButton: {
// // // //     width: width * 0.6,
// // // //     height: height * 0.065,
// // // //     borderRadius: width * 0.08,
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //   },
// // // //   continueText: {
// // // //     color: '#fff',
// // // //     fontSize: scaleFont(18),
// // // //     fontWeight: '700',
// // // //   },
// // // // });

// // // import React, { useState } from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   TouchableOpacity,
// // //   StyleSheet,
// // //   Dimensions,
// // //   SafeAreaView,
// // //   Image,
// // //   ActivityIndicator,
// // //   ScrollView,
// // // } from 'react-native';
// // // import LinearGradient from 'react-native-linear-gradient';
// // // import { useNavigation } from '@react-navigation/native';
// // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // import i18n from '../utils/localization/i18n';
// // // import { useAppTranslation } from '../context/TranslationContext';
// // // import CustomHeader from '../components/CustomHeader';
// // // import { useSafeAreaInsets } from 'react-native-safe-area-context';

// // // const { width, height } = Dimensions.get('window');

// // // const LanguageSelectionScreen = () => {
// // //   const navigation = useNavigation();
// // //   const insets = useSafeAreaInsets();

// // //   const [selectedLang, setSelectedLang] = useState(null);
// // //   const { t, applyTranslation, isTranslating } = useAppTranslation();

// // //   const primaryColor = '#FB923C';
// // //   const bgGradient = ['#0f172a', '#1e293b'];

// // //   const languages = [
// // //     { id: 1, label: 'English', code: 'en' },
// // //     { id: 2, label: 'हिंदी', code: 'hi' },
// // //     { id: 3, label: 'Español', code: 'es' },
// // //     { id: 4, label: 'मराठी', code: 'mr' },
// // //     { id: 5, label: 'ಕನ್ನಡ', code: 'kn' },
// // //     { id: 6, label: 'తెలుగు', code: 'te' },
// // //   ];

// // //   const handleLanguageSelect = async lang => {
// // //     setSelectedLang(lang.id);
// // //     await AsyncStorage.setItem('appLanguage', lang.code);
// // //     i18n.changeLanguage(lang.code);
// // //     await applyTranslation(lang.code);
// // //   };

// // //   return (
// // //     <SafeAreaView style={styles.safeArea}>
// // //       <LinearGradient colors={bgGradient} style={{ flex: 1 }}>

// // //         {/* HEADER */}
// // //         <View style={{ paddingTop: 20 }}>
// // //           <CustomHeader
// // //             title={t('Select Language')}
// // //             onBack={() => navigation.goBack()}
// // //           />
// // //         </View>

// // //         {/* SCROLLABLE CONTENT */}
// // //         <ScrollView
// // //           contentContainerStyle={[
// // //             styles.scrollContent,
// // //             { paddingBottom: insets.bottom + 80 }, // 👈 FIX bottom nav overlap
// // //           ]}
// // //           showsVerticalScrollIndicator={false}
// // //         >

// // //           {/* ICON + TITLE */}
// // //           <View style={styles.headerContainer}>
// // //             <Image
// // //               source={require('../assets/language1.png')}
// // //               style={styles.languageIcon}
// // //             />

// // //             <Text
// // //               style={styles.title}
// // //               numberOfLines={2}
// // //               adjustsFontSizeToFit
// // //             >
// // //               {t('Select your preferred language')}
// // //             </Text>
// // //           </View>

// // //           {/* LANGUAGE LIST */}
// // //           <View style={styles.languageContainer}>
// // //             {languages.map(lang => (
// // //               <TouchableOpacity
// // //                 key={lang.id}
// // //                 onPress={() => handleLanguageSelect(lang)}
// // //                 activeOpacity={0.7}
// // //                 disabled={isTranslating}
// // //                 style={[
// // //                   styles.langButton,
// // //                   selectedLang === lang.id && styles.activeLangButton,
// // //                 ]}
// // //               >
// // //                 {isTranslating && selectedLang === lang.id ? (
// // //                   <ActivityIndicator color={primaryColor} />
// // //                 ) : (
// // //                   <Text
// // //                     style={[
// // //                       styles.langText,
// // //                       selectedLang === lang.id && styles.activeLangText,
// // //                     ]}
// // //                     numberOfLines={1}
// // //                     adjustsFontSizeToFit
// // //                   >
// // //                     {lang.label}
// // //                   </Text>
// // //                 )}
// // //               </TouchableOpacity>
// // //             ))}
// // //           </View>

// // //           {/* CONTINUE BUTTON */}
// // //           <TouchableOpacity
// // //             disabled={!selectedLang || isTranslating}
// // //             activeOpacity={0.8}
// // //             onPress={() =>
// // //               navigation.navigate('LanguageConfirmationScreen', {
// // //                 selectedLanguage:
// // //                   languages.find(l => l.id === selectedLang)?.label,
// // //               })
// // //             }
// // //             style={[
// // //               styles.continueButton,
// // //               {
// // //                 opacity: selectedLang && !isTranslating ? 1 : 0.5,
// // //               },
// // //             ]}
// // //           >
// // //             {isTranslating ? (
// // //               <ActivityIndicator color="#fff" />
// // //             ) : (
// // //               <Text
// // //                 style={styles.continueText}
// // //                 numberOfLines={1}
// // //                 adjustsFontSizeToFit
// // //               >
// // //                 {t('Continue')}
// // //               </Text>
// // //             )}
// // //           </TouchableOpacity>

// // //         </ScrollView>

// // //       </LinearGradient>
// // //     </SafeAreaView>
// // //   );
// // // };

// // // export default LanguageSelectionScreen;

// // // /* ================= STYLES ================= */

// // // const styles = StyleSheet.create({
// // //   safeArea: {
// // //     flex: 1,
// // //     backgroundColor: '#0f172a',
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

// // //   languageIcon: {
// // //     width: width * 0.18,
// // //     height: width * 0.18,
// // //     resizeMode: 'contain',
// // //     marginBottom: 10,
// // //   },

// // //   title: {
// // //     fontSize: 20,
// // //     color: '#ffffff',
// // //     textAlign: 'center',
// // //     fontWeight: '700',
// // //     lineHeight: 28,
// // //     flexShrink: 1,
// // //   },

// // //   languageContainer: {
// // //     width: '100%',
// // //     alignItems: 'center',
// // //     marginBottom: 40,
// // //   },

// // //   langButton: {
// // //     width: '90%',
// // //     borderWidth: 1,
// // //     borderColor: '#ffffff40',
// // //     borderRadius: 12,
// // //     paddingVertical: 14,
// // //     marginVertical: 8,
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     minHeight: 50,
// // //   },

// // //   activeLangButton: {
// // //     borderColor: '#FB923C',
// // //     backgroundColor: '#ffffff20',
// // //   },

// // //   langText: {
// // //     fontSize: 18,
// // //     fontWeight: '600',
// // //     color: '#e0e0e0',
// // //     flexShrink: 1,
// // //   },

// // //   activeLangText: {
// // //     color: '#ffffff',
// // //   },

// // //   continueButton: {
// // //     width: width * 0.6,
// // //     minHeight: 50,
// // //     paddingVertical: 12,
// // //     borderRadius: 30,
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     backgroundColor: '#FB923C',
// // //     marginTop: 10,
// // //   },

// // //   continueText: {
// // //     color: '#fff',
// // //     fontSize: 18,
// // //     fontWeight: '700',
// // //     flexShrink: 1,
// // //   },
// // // });





// // import React, { useState, useContext } from 'react';
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   StyleSheet,
// //   Dimensions,
// //   SafeAreaView,
// //   Image,
// //   ActivityIndicator,
// //   ScrollView,
// // } from 'react-native';
// // import LinearGradient from 'react-native-linear-gradient';
// // import { useNavigation } from '@react-navigation/native';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import i18n from '../utils/localization/i18n';
// // import { useAppTranslation } from '../context/TranslationContext';
// // import CustomHeader from '../components/CustomHeader';
// // import { useSafeAreaInsets } from 'react-native-safe-area-context';
// // import { AuthContext } from '../context/AuthProvider';

// // const { width } = Dimensions.get('window');

// // const LanguageSelectionScreen = () => {
// //   const navigation = useNavigation();
// //   const insets = useSafeAreaInsets();
// //   const { token } = useContext(AuthContext);

// //   const [selectedLang, setSelectedLang] = useState(null);
// //   const [isSavingToServer, setIsSavingToServer] = useState(false);
// //   const { t, applyTranslation, isTranslating } = useAppTranslation();

// //   const primaryColor = '#FB923C';
// //   const bgGradient = ['#0f172a', '#1e293b'];

// //   const languages = [
// //     { id: 1, label: 'English', code: 'en' },
// //     { id: 2, label: 'हिंदी', code: 'hi' },
// //     { id: 3, label: 'Español', code: 'es' },
// //     { id: 4, label: 'मराठी', code: 'mr' },
// //     { id: 5, label: 'ಕನ್ನಡ', code: 'kn' },
// //     { id: 6, label: 'తెలుగు', code: 'te' },
// //   ];

// //   /**
// //    * Calls PUT /language to persist the user's language preference on the server.
// //    * Only attempted when a valid auth token is present.
// //    */
// //   const saveLanguageToServer = async (langCode) => {
// //     if (!token) {
// //       console.log('[Lang] No token — skipping server sync');
// //       return;
// //     }

// //     try {
// //       setIsSavingToServer(true);
// //       // const response = await fetch('/language', {
// //       const response = await fetch(`${BASE_URL}/language`, {

// //         method: 'PUT',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           Authorization: `Bearer ${token}`,
// //         },
// //         body: JSON.stringify({ language: langCode }),
// //       });

// //       const result = await response.json();

// //       if (response.ok) {
// //         console.log('[Lang] Server language updated:', result.language);
// //       } else {
// //         console.warn('[Lang] Server returned error:', result.error);
// //       }
// //     } catch (error) {
// //       // Non-blocking — local language still applies even if server sync fails
// //       console.error('[Lang] Failed to sync language with server:', error);
// //     } finally {
// //       setIsSavingToServer(false);
// //     }
// //   };

// //   const handleLanguageSelect = async (lang) => {
// //     setSelectedLang(lang.id);
// //     await AsyncStorage.setItem('appLanguage', lang.code);
// //     i18n.changeLanguage(lang.code);
// //     await applyTranslation(lang.code);

// //     // Sync preference to backend (fire-and-forget, non-blocking)
// //     saveLanguageToServer(lang.code);
// //   };

// //   const isLoading = isTranslating || isSavingToServer;

// //   return (
// //     <SafeAreaView style={styles.safeArea}>
// //       <LinearGradient colors={bgGradient} style={{ flex: 1 }}>

// //         {/* HEADER */}
// //         <View style={{ paddingTop: 20 }}>
// //           <CustomHeader
// //             title={t('Select Language')}
// //             onBack={() => navigation.goBack()}
// //           />
// //         </View>

// //         {/* SCROLLABLE CONTENT */}
// //         <ScrollView
// //           contentContainerStyle={[
// //             styles.scrollContent,
// //             { paddingBottom: insets.bottom + 80 },
// //           ]}
// //           showsVerticalScrollIndicator={false}
// //         >

// //           {/* ICON + TITLE */}
// //           <View style={styles.headerContainer}>
// //             <Image
// //               source={require('../assets/language1.png')}
// //               style={styles.languageIcon}
// //             />
// //             <Text
// //               style={styles.title}
// //               numberOfLines={2}
// //               adjustsFontSizeToFit
// //             >
// //               {t('Select your preferred language')}
// //             </Text>
// //           </View>

// //           {/* LANGUAGE LIST */}
// //           <View style={styles.languageContainer}>
// //             {languages.map(lang => (
// //               <TouchableOpacity
// //                 key={lang.id}
// //                 onPress={() => handleLanguageSelect(lang)}
// //                 activeOpacity={0.7}
// //                 disabled={isLoading}
// //                 style={[
// //                   styles.langButton,
// //                   selectedLang === lang.id && styles.activeLangButton,
// //                 ]}
// //               >
// //                 {isTranslating && selectedLang === lang.id ? (
// //                   <ActivityIndicator color={primaryColor} />
// //                 ) : (
// //                   <Text
// //                     style={[
// //                       styles.langText,
// //                       selectedLang === lang.id && styles.activeLangText,
// //                     ]}
// //                     numberOfLines={1}
// //                     adjustsFontSizeToFit
// //                   >
// //                     {lang.label}
// //                   </Text>
// //                 )}
// //               </TouchableOpacity>
// //             ))}
// //           </View>

// //           {/* CONTINUE BUTTON */}
// //           <TouchableOpacity
// //             disabled={!selectedLang || isLoading}
// //             activeOpacity={0.8}
// //             onPress={() =>
// //               navigation.navigate('LanguageConfirmationScreen', {
// //                 selectedLanguage:
// //                   languages.find(l => l.id === selectedLang)?.label,
// //               })
// //             }
// //             style={[
// //               styles.continueButton,
// //               { opacity: selectedLang && !isLoading ? 1 : 0.5 },
// //             ]}
// //           >
// //             {isLoading ? (
// //               <ActivityIndicator color="#fff" />
// //             ) : (
// //               <Text
// //                 style={styles.continueText}
// //                 numberOfLines={1}
// //                 adjustsFontSizeToFit
// //               >
// //                 {t('Continue')}
// //               </Text>
// //             )}
// //           </TouchableOpacity>

// //         </ScrollView>
// //       </LinearGradient>
// //     </SafeAreaView>
// //   );
// // };

// // export default LanguageSelectionScreen;

// // /* ================= STYLES ================= */

// // const styles = StyleSheet.create({
// //   safeArea: {
// //     flex: 1,
// //     backgroundColor: '#0f172a',
// //   },
// //   scrollContent: {
// //     flexGrow: 1,
// //     alignItems: 'center',
// //     paddingHorizontal: width * 0.07,
// //     paddingTop: 20,
// //   },
// //   headerContainer: {
// //     alignItems: 'center',
// //     marginBottom: 30,
// //     width: '100%',
// //   },
// //   languageIcon: {
// //     width: width * 0.18,
// //     height: width * 0.18,
// //     resizeMode: 'contain',
// //     marginBottom: 10,
// //   },
// //   title: {
// //     fontSize: 20,
// //     color: '#ffffff',
// //     textAlign: 'center',
// //     fontWeight: '700',
// //     lineHeight: 28,
// //     flexShrink: 1,
// //   },
// //   languageContainer: {
// //     width: '100%',
// //     alignItems: 'center',
// //     marginBottom: 40,
// //   },
// //   langButton: {
// //     width: '90%',
// //     borderWidth: 1,
// //     borderColor: '#ffffff40',
// //     borderRadius: 12,
// //     paddingVertical: 14,
// //     marginVertical: 8,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     minHeight: 50,
// //   },
// //   activeLangButton: {
// //     borderColor: '#FB923C',
// //     backgroundColor: '#ffffff20',
// //   },
// //   langText: {
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: '#e0e0e0',
// //     flexShrink: 1,
// //   },
// //   activeLangText: {
// //     color: '#ffffff',
// //   },
// //   continueButton: {
// //     width: width * 0.6,
// //     minHeight: 50,
// //     paddingVertical: 12,
// //     borderRadius: 30,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     backgroundColor: '#FB923C',
// //     marginTop: 10,
// //   },
// //   continueText: {
// //     color: '#fff',
// //     fontSize: 18,
// //     fontWeight: '700',
// //     flexShrink: 1,
// //   },
// // });


// import React, { useState, useContext } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   SafeAreaView,
//   Image,
//   ActivityIndicator,
//   ScrollView,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import i18n from '../utils/localization/i18n';
// import { useAppTranslation } from '../context/TranslationContext';
// import CustomHeader from '../components/CustomHeader';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { AuthContext } from '../context/AuthProvider';

// const { width } = Dimensions.get('window');
// const BASE_URL = 'http://13.203.232.239:3000'; // ✅ ADDED

// const LanguageSelectionScreen = () => {
//   const navigation = useNavigation();
//   const insets = useSafeAreaInsets();
//   const { token } = useContext(AuthContext);

//   const [selectedLang, setSelectedLang] = useState(null);
//   const [isSavingToServer, setIsSavingToServer] = useState(false);
//   const { t, applyTranslation, isTranslating } = useAppTranslation();

//   const primaryColor = '#FB923C';
//   const bgGradient = ['#0f172a', '#1e293b'];

//   const languages = [
//     { id: 1, label: 'English', code: 'en' },
//     { id: 2, label: 'हिंदी', code: 'hi' },
//     { id: 3, label: 'Español', code: 'es' },
//     { id: 4, label: 'मराठी', code: 'mr' },
//     { id: 5, label: 'ಕನ್ನಡ', code: 'kn' },
//     { id: 6, label: 'తెలుగు', code: 'te' },
//   ];

//   const saveLanguageToServer = async (langCode) => {
//     if (!token) {
//       console.log('[Lang] No token — skipping server sync');
//       return;
//     }

//     try {
//       setIsSavingToServer(true);
//       const response = await fetch(`${BASE_URL}/language`, { // ✅ BASE_URL applied
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ language: langCode }),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         console.log('[Lang] Server language updated:', result.language);
//       } else {
//         console.warn('[Lang] Server returned error:', result.error);
//       }
//     } catch (error) {
//       console.error('[Lang] Failed to sync language with server:', error);
//     } finally {
//       setIsSavingToServer(false);
//     }
//   };

//   const handleLanguageSelect = async (lang) => {
//     setSelectedLang(lang.id);
//     await AsyncStorage.setItem('appLanguage', lang.code);
//     i18n.changeLanguage(lang.code);
//     await applyTranslation(lang.code);

//     // Sync preference to backend (fire-and-forget, non-blocking)
//     saveLanguageToServer(lang.code);
//   };

//   const isLoading = isTranslating || isSavingToServer;

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <LinearGradient colors={bgGradient} style={{ flex: 1 }}>

//         {/* HEADER */}
//         <View style={{ paddingTop: 20 }}>
//           <CustomHeader
//             title={t('Select Language')}
//             onBack={() => navigation.goBack()}
//           />
//         </View>

//         {/* SCROLLABLE CONTENT */}
//         <ScrollView
//           contentContainerStyle={[
//             styles.scrollContent,
//             { paddingBottom: insets.bottom + 80 },
//           ]}
//           showsVerticalScrollIndicator={false}
//         >

//           {/* ICON + TITLE */}
//           <View style={styles.headerContainer}>
//             <Image
//               source={require('../assets/language1.png')}
//               style={styles.languageIcon}
//             />
//             <Text
//               style={styles.title}
//               numberOfLines={2}
//               adjustsFontSizeToFit
//             >
//               {t('Select your preferred language')}
//             </Text>
//           </View>

//           {/* LANGUAGE LIST */}
//           <View style={styles.languageContainer}>
//             {languages.map(lang => (
//               <TouchableOpacity
//                 key={lang.id}
//                 onPress={() => handleLanguageSelect(lang)}
//                 activeOpacity={0.7}
//                 disabled={isLoading}
//                 style={[
//                   styles.langButton,
//                   selectedLang === lang.id && styles.activeLangButton,
//                 ]}
//               >
//                 {isTranslating && selectedLang === lang.id ? (
//                   <ActivityIndicator color={primaryColor} />
//                 ) : (
//                   <Text
//                     style={[
//                       styles.langText,
//                       selectedLang === lang.id && styles.activeLangText,
//                     ]}
//                     numberOfLines={1}
//                     adjustsFontSizeToFit
//                   >
//                     {lang.label}
//                   </Text>
//                 )}
//               </TouchableOpacity>
//             ))}
//           </View>

//           {/* CONTINUE BUTTON */}
//           <TouchableOpacity
//             disabled={!selectedLang || isLoading}
//             activeOpacity={0.8}
//             onPress={() =>
//               navigation.navigate('LanguageConfirmationScreen', {
//                 selectedLanguage:
//                   languages.find(l => l.id === selectedLang)?.label,
//               })
//             }
//             style={[
//               styles.continueButton,
//               { opacity: selectedLang && !isLoading ? 1 : 0.5 },
//             ]}
//           >
//             {isLoading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text
//                 style={styles.continueText}
//                 numberOfLines={1}
//                 adjustsFontSizeToFit
//               >
//                 {t('Continue')}
//               </Text>
//             )}
//           </TouchableOpacity>

//         </ScrollView>
//       </LinearGradient>
//     </SafeAreaView>
//   );
// };

// export default LanguageSelectionScreen;

// /* ================= STYLES ================= */

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#0f172a',
//   },
//   scrollContent: {
//     flexGrow: 1,
//     alignItems: 'center',
//     paddingHorizontal: width * 0.07,
//     paddingTop: 20,
//   },
//   headerContainer: {
//     alignItems: 'center',
//     marginBottom: 30,
//     width: '100%',
//   },
//   languageIcon: {
//     width: width * 0.18,
//     height: width * 0.18,
//     resizeMode: 'contain',
//     marginBottom: 10,
//   },
//   title: {
//     fontSize: 20,
//     color: '#ffffff',
//     textAlign: 'center',
//     fontWeight: '700',
//     lineHeight: 28,
//     flexShrink: 1,
//   },
//   languageContainer: {
//     width: '100%',
//     alignItems: 'center',
//     marginBottom: 40,
//   },
//   langButton: {
//     width: '90%',
//     borderWidth: 1,
//     borderColor: '#ffffff40',
//     borderRadius: 12,
//     paddingVertical: 14,
//     marginVertical: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     minHeight: 50,
//   },
//   activeLangButton: {
//     borderColor: '#FB923C',
//     backgroundColor: '#ffffff20',
//   },
//   langText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#e0e0e0',
//     flexShrink: 1,
//   },
//   activeLangText: {
//     color: '#ffffff',
//   },
//   continueButton: {
//     width: width * 0.6,
//     minHeight: 50,
//     paddingVertical: 12,
//     borderRadius: 30,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#FB923C',
//     marginTop: 10,
//   },
//   continueText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '700',
//     flexShrink: 1,
//   },
// });




import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../utils/localization/i18n';
import { useAppTranslation } from '../context/TranslationContext';
import CustomHeader from '../components/CustomHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthProvider';
import { authFetch as fetch } from '../utils/authFetch'; // auto-refresh wrapper for expired access tokens

const { width } = Dimensions.get('window');
const BASE_URL = 'http://13.203.232.239:3000';

const LanguageSelectionScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { token } = useContext(AuthContext);

  const [selectedLang, setSelectedLang] = useState(null);
  const [isSavingToServer, setIsSavingToServer] = useState(false);
  const { t, applyTranslation, isTranslating } = useAppTranslation();

  const primaryColor = '#FB923C';
  const bgGradient = ['#0f172a', '#1e293b'];

  const languages = [
    { id: 1, label: 'English', code: 'en' },
    { id: 2, label: 'हिंदी', code: 'hi' },
    { id: 3, label: 'Español', code: 'es' },
    { id: 4, label: 'मराठी', code: 'mr' },
    { id: 5, label: 'ಕನ್ನಡ', code: 'kn' },
    { id: 6, label: 'తెలుగు', code: 'te' },
  ];

  // ✅ ADDED: Restore saved language preference on mount (per API guide best practice #5)
  useEffect(() => {
    const restoreSavedLanguage = async () => {
      try {
        const savedCode = await AsyncStorage.getItem('appLanguage') || 'en'; // fallback 'en'
        const match = languages.find(l => l.code === savedCode);
        if (match) setSelectedLang(match.id);
      } catch (error) {
        console.warn('[Lang] Failed to restore saved language:', error);
        // fallback: leave unselected, default will be 'en'
      }
    };
    restoreSavedLanguage();
  }, []);

  const saveLanguageToServer = async (langCode) => {
    if (!token) {
      console.log('[Lang] No token — skipping server sync');
      return;
    }

    try {
      setIsSavingToServer(true);
      console.log('[Lang] Sending to server → language:', langCode); // 🔍 DEBUG
      const response = await fetch(`${BASE_URL}/api/auth/language`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ language: langCode }),
      });

      const ct = response.headers.get('content-type');
      console.log('[Lang] Response status:', response.status, '| content-type:', ct); // 🔍 DEBUG
      if (!ct?.includes('application/json')) {
        const raw = await response.text();
        console.warn('[Lang] Non-JSON response from server:', raw.substring(0, 200));
        return;
      }

      const result = await response.json();

      if (response.ok) {
        console.log('[Lang] Server language updated:', result.language);
      } else {
        console.warn('[Lang] Server returned error:', result.error);
      }
    } catch (error) {
      console.error('[Lang] Failed to sync language with server:', error.message);
      // Non-blocking: UI already updated locally, server sync failure is silent
    } finally {
      setIsSavingToServer(false);
    }
  };

  const handleLanguageSelect = async (lang) => {
    setSelectedLang(lang.id);

    // ✅ Save to AsyncStorage (local persistence per API guide best practice #5)
    await AsyncStorage.setItem('appLanguage', lang.code);

    i18n.changeLanguage(lang.code);
    await applyTranslation(lang.code);

    // Sync preference to backend (fire-and-forget, non-blocking)
    saveLanguageToServer(lang.code);
  };

  const isLoading = isTranslating || isSavingToServer;

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={bgGradient} style={{ flex: 1 }}>

        {/* HEADER */}
        <View style={{ paddingTop: 20 }}>
          <CustomHeader
            title={t('Select Language')}
            onBack={() => navigation.goBack()}
          />
        </View>

        {/* SCROLLABLE CONTENT */}
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 80 },
          ]}
          showsVerticalScrollIndicator={false}
        >

          {/* ICON + TITLE */}
          <View style={styles.headerContainer}>
            <Image
              source={require('../assets/language1.png')}
              style={styles.languageIcon}
            />
            <Text
              style={styles.title}
              numberOfLines={2}
              adjustsFontSizeToFit
            >
              {t('Select your preferred language')}
            </Text>
          </View>

          {/* LANGUAGE LIST */}
          <View style={styles.languageContainer}>
            {languages.map(lang => (
              <TouchableOpacity
                key={lang.id}
                onPress={() => handleLanguageSelect(lang)}
                activeOpacity={0.7}
                disabled={isLoading}
                style={[
                  styles.langButton,
                  selectedLang === lang.id && styles.activeLangButton,
                ]}
              >
                {isTranslating && selectedLang === lang.id ? (
                  <ActivityIndicator color={primaryColor} />
                ) : (
                  <Text
                    style={[
                      styles.langText,
                      selectedLang === lang.id && styles.activeLangText,
                    ]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {lang.label}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* CONTINUE BUTTON */}
          <TouchableOpacity
            disabled={!selectedLang || isLoading}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('LanguageConfirmationScreen', {
                selectedLanguage:
                  languages.find(l => l.id === selectedLang)?.label,
              })
            }
            style={[
              styles.continueButton,
              { opacity: selectedLang && !isLoading ? 1 : 0.5 },
            ]}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text
                style={styles.continueText}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {t('Continue')}
              </Text>
            )}
          </TouchableOpacity>

        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default LanguageSelectionScreen;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: width * 0.07,
    paddingTop: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  languageIcon: {
    width: width * 0.18,
    height: width * 0.18,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '700',
    lineHeight: 28,
    flexShrink: 1,
  },
  languageContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  langButton: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#ffffff40',
    borderRadius: 12,
    paddingVertical: 14,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  activeLangButton: {
    borderColor: '#FB923C',
    backgroundColor: '#ffffff20',
  },
  langText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e0e0e0',
    flexShrink: 1,
  },
  activeLangText: {
    color: '#ffffff',
  },
  continueButton: {
    width: width * 0.6,
    minHeight: 50,
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FB923C',
    marginTop: 10,
  },
  continueText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    flexShrink: 1,
  },
});
