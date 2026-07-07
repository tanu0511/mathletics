
// // import { useNavigation, useIsFocused } from '@react-navigation/native';
// // import React, { useEffect, useState } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   Image,
// //   TouchableOpacity,
// //   Dimensions,
// //   PixelRatio,
// //   ScrollView,
// //   ActivityIndicator,
// //   Platform,
// //   Alert,
// // } from 'react-native';
// // import { useSafeAreaInsets } from 'react-native-safe-area-context';
// // import LinearGradient from 'react-native-linear-gradient';
// // import Icon from 'react-native-vector-icons/Ionicons';
// // import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import { useTheme } from '../context/ThemeContext';
// // import Geolocation from 'react-native-geolocation-service';
// // import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
// // import { CountryList } from '../utils/CountryList';
// // import CustomHeader from '../components/CustomHeader';

// // const { width, height } = Dimensions.get('window');
// // const scale = width / 375;
// // const normalize = size =>
// //   Math.round(PixelRatio.roundToNearestPixel(size * scale));

// // const ProfileScreen = () => {
// //   const Navigation = useNavigation();
// //   const isFocused = useIsFocused();
// //   const { theme } = useTheme();

// //   const [userData, setUserData] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   /* ================= FETCH USER ================= */
// //   useEffect(() => {
// //     const fetchUserData = async () => {
// //       try {
// //         const token = await AsyncStorage.getItem('accessToken');
// //         if (!token) {
// //           setLoading(false);
// //           return;
// //         }

// //         const response = await fetch(
// //           'http://13.203.232.239:3000/api/auth/getUser',
// //           {
// //             headers: { Authorization: `Bearer ${token}` },
// //           },
// //         );

// //         const result = await response.json();
// //         if (result.success) {
// //           setUserData(result.user);
// //         }
// //       } catch (e) {
// //         console.log(e);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     if (isFocused) {
// //       fetchUserData();
// //     }
// //   }, [isFocused]);


// //   /* ================= HELPERS ================= */
// //   const formatDate = d => {
// //     if (!d) return 'N/A';
// //     const date = new Date(d);
// //     return `${date.getDate().toString().padStart(2, '0')}-${date.toLocaleString(
// //       'en',
// //       { month: 'short' },
// //     )}-${date.getFullYear().toString().slice(-2)}`;
// //   };

// //   const getFlagFromCountryName = name => {
// //     if (!name) return '';
// //     // Normalize comparison (case-insensitive) just in case
// //     const country = CountryList.find(c => c.name.toLowerCase() === name.toLowerCase() || c.code.toLowerCase() === name.toLowerCase());
// //     return country ? country.flag : '🏳️'; // Return flag or a default if not found
// //   };

// //   // ✅ Main screen content separated for cleaner theme wrapping
// //   const Content = () => {
// //     const insets = useSafeAreaInsets(); // ✅ Hook moved here
// //     return (
// //       <View style={{ flex: 1, paddingTop: insets.top + 30 }}>
// //         {/* Header - Outside Padding */}
// //         <CustomHeader
// //           title="PROFILE"
// //           onBack={() => Navigation.goBack()}
// //           rightIcon={
// //             <TouchableOpacity
// //               onPress={() => {
// //                 Navigation.navigate("UpdateProfile")
// //               }}>
// //               <FontAwesome5 name="user-edit" size={normalize(16)} color="#fff" />
// //             </TouchableOpacity>
// //           }
// //         />

// //         <ScrollView
// //           contentContainerStyle={styles.scrollContent}
// //           showsVerticalScrollIndicator={false}>

// //           {loading ? (
// //             <ActivityIndicator
// //               size="large"
// //               color="#fff"
// //               style={{ marginTop: 50 }}
// //             />
// //           ) : (
// //             <View style={styles.profileSection}>
// //               {/* Profile Section */}
// //               <View style={styles.profileTop}>
// //                 <View style={styles.imageContainer}>
// //                   <Image
// //                     source={
// //                       userData?.profileImage
// //                         ? { uri: userData.profileImage }
// //                         : require('../assets/dummyProfile.jpg')
// //                     }
// //                     style={styles.profileImage}
// //                   />

// //                 </View>
// //                 <View style={styles.profileText}>
// //                   <Text style={styles.userName}>
// //                     {userData?.username || 'Unknown'}
// //                   </Text>
// //                   <Text style={styles.joinDate}>
// //                     Joined: {formatDate(userData?.createdAt)}
// //                   </Text>
// //                 </View>
// //               </View>

// //               {/* Info */}
// //               <View style={styles.userInfo}>
// //                 <Text style={styles.email}>
// //                   Email:{' '}
// //                   <Text style={styles.emailText}>{userData?.email || 'N/A'}</Text>
// //                 </Text>
// //                 <Text style={styles.detail}>
// //                   First Name: {userData?.firstName || 'N/A'}
// //                 </Text>
// //                 <Text style={styles.detail}>
// //                   Last Name: {userData?.lastName || 'N/A'}
// //                 </Text>
// //                 <Text style={styles.detail}>
// //                   <Text style={styles.detail}>
// //                     Year of Birth : {userData?.dateOfBirth ? new Date(userData.dateOfBirth).getFullYear() : 'N/A'}
// //                   </Text>

// //                 </Text>
// //                 <Text style={styles.detail}>
// //                   Gender: {userData?.gender ? (userData.gender === 'other' ? 'Others' : userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1)) : 'N/A'}
// //                 </Text>
// //                 {/* 🔥 LOCATION DISPLAY (ADDED) */}
// //                 <View style={{ flexDirection: 'row', alignItems: 'center' }}>
// //                   <Text style={styles.detail}>Country:</Text>

// //                   {userData?.country ? (
// //                     <View style={{ marginStart: 12, marginTop: -6 }}>
// //                       <Text style={{ fontSize: normalize(22) }}>
// //                         {getFlagFromCountryName(userData.country)}
// //                       </Text>
// //                     </View>
// //                   ) : (
// //                     <Text style={{ color: '#777', marginStart: 10 }}>
// //                       Not Set
// //                     </Text>
// //                   )}
// //                 </View>

// //               </View>

// //               {/* Rank Tabs */}
// //               <View style={styles.tabRow}>
// //                 {['E2', 'E4', 'M2', 'M4', 'H2', 'H4'].map((item, index) => (
// //                   <TouchableOpacity
// //                     key={index}
// //                     style={[styles.tab, item === 'M4' && styles.activeTab]}>
// //                     <Text
// //                       style={[
// //                         styles.tabText,
// //                         item === 'M4' && styles.activeTabText,
// //                       ]}>
// //                       {item}
// //                     </Text>
// //                   </TouchableOpacity>
// //                 ))}
// //               </View>

// //               {/* Rank Bar */}
// //               <View style={styles.rankContainer}>
// //                 <Text style={styles.rankText}>Current Rank: 10,456</Text>
// //                 <View style={styles.rankBar}>
// //                   <View style={[styles.rankBarFillGreen, { width: '50%' }]} />
// //                   <View style={[styles.rankBarFillRed, { width: '45%' }]} />
// //                 </View>
// //               </View>

// //               {/* Achievements */}
// //               <View style={styles.achievementsContainer}>
// //                 <Text style={styles.achievementTitle}>Achievements</Text>
// //                 <View style={styles.achievementRow}>
// //                   {['Ach. 1', 'Ach. 2', 'Ach. 3', 'Ach. 4'].map((item, index) => (
// //                     <View key={index} style={styles.achievementBox}>
// //                       <Text style={styles.achievementText}>{item}</Text>
// //                     </View>
// //                   ))}
// //                 </View>
// //               </View>
// //             </View>
// //           )}
// //         </ScrollView>
// //       </View >
// //     );
// //   };

// //   // ✅ Apply theme background here
// //   return theme.backgroundGradient ? (
// //     <LinearGradient colors={theme.backgroundGradient} style={{ flex: 1 }}>
// //       <Content />
// //     </LinearGradient>
// //   ) : (
// //     <View
// //       style={{
// //         flex: 1,
// //         backgroundColor: theme.backgroundColor || '#0D0D26',
// //       }}>
// //       <Content />
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: { flex: 1, padding: normalize(10) },
// //   scrollContent: {
// //     paddingBottom: normalize(30),
// //     paddingHorizontal: normalize(16),
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: normalize(15),
// //   },
// //   headerTitle: { color: '#fff', fontSize: normalize(18), fontWeight: '700' },
// //   headerSeparator: {
// //     height: 1,
// //     backgroundColor: '#94A3B8',
// //     opacity: 0.5,
// //     top: 10,
// //     marginHorizontal: -width * 0.05,
// //     marginBottom: height * 0.02,
// //     bottom: '1%',
// //   },
// //   profileSection: { marginVertical: normalize(10) },
// //   profileTop: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: normalize(12),
// //   },
// //   imageContainer: {
// //     borderWidth: 2,
// //     borderColor: '#444',
// //     borderRadius: normalize(30),
// //     overflow: 'hidden',
// //   },
// //   profileImage: {
// //     width: normalize(70),
// //     height: normalize(70),
// //   },
// //   profileText: { marginLeft: normalize(30) },
// //   userName: {
// //     color: '#fff',
// //     fontSize: normalize(18),
// //     fontWeight: '600',
// //     marginBottom: normalize(4),
// //   },
// //   joinDate: { color: '#999', fontSize: normalize(12) },
// //   userInfo: { marginTop: normalize(10), alignItems: 'flex-start' },
// //   email: { color: '#bbb', fontSize: normalize(14), marginBottom: normalize(2) },
// //   emailText: { color: '#4da6ff' },
// //   detail: {
// //     color: '#ccc',
// //     fontSize: normalize(14),
// //     marginVertical: normalize(2),
// //   },
// //   tabRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     marginTop: normalize(35),
// //   },
// //   tab: {
// //     flex: 1,
// //     paddingVertical: normalize(8),
// //     alignItems: 'center',
// //     marginHorizontal: normalize(2),
// //     backgroundColor: '#1b1b3a',
// //     borderRadius: normalize(6),
// //   },
// //   activeTab: { backgroundColor: '#4e54c8' },
// //   tabText: { color: '#bbb', fontSize: normalize(14) },
// //   activeTabText: { color: '#fff', fontWeight: '600' },
// //   rankContainer: { marginTop: normalize(28) },
// //   rankText: {
// //     color: '#fff',
// //     fontSize: normalize(13),
// //     textAlign: 'center',
// //     marginBottom: normalize(20),
// //   },
// //   rankBar: {
// //     flexDirection: 'row',
// //     height: normalize(8),
// //     borderRadius: 6,
// //     overflow: 'hidden',
// //   },
// //   rankBarFillGreen: { backgroundColor: '#4CAF50' },
// //   rankBarFillRed: { backgroundColor: '#F44336' },
// //   achievementsContainer: { marginTop: normalize(25) },
// //   achievementTitle: {
// //     color: '#fff',
// //     fontSize: normalize(14),
// //     marginBottom: normalize(10),
// //     textAlign: 'center',
// //   },
// //   achievementRow: { flexDirection: 'row', justifyContent: 'space-between' },
// //   achievementBox: {
// //     flex: 1,
// //     backgroundColor: '#1e1e40',
// //     paddingVertical: normalize(10),
// //     marginHorizontal: normalize(4),
// //     borderRadius: normalize(8),
// //     alignItems: 'center',
// //   },
// //   achievementText: { color: '#ddd', fontSize: normalize(12) },
// // });

// // export default ProfileScreen;

// // import { useNavigation, useIsFocused } from '@react-navigation/native';
// // import React, { useEffect, useState } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   Image,
// //   TouchableOpacity,
// //   Dimensions,
// //   PixelRatio,
// //   ScrollView,
// //   ActivityIndicator,
// // } from 'react-native';
// // import { useSafeAreaInsets } from 'react-native-safe-area-context';
// // import LinearGradient from 'react-native-linear-gradient';
// // import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import { useTheme } from '../context/ThemeContext';
// // import { CountryList } from '../utils/CountryList';
// // import CustomHeader from '../components/CustomHeader';
// // import { useAppTranslation } from '../context/TranslationContext'; // ✅

// // const { width, height } = Dimensions.get('window');
// // const scale = width / 375;
// // const normalize = size =>
// //   Math.round(PixelRatio.roundToNearestPixel(size * scale));

// // const ProfileScreen = () => {
// //   const Navigation = useNavigation();
// //   const isFocused = useIsFocused();
// //   const { theme } = useTheme();
// //   const { t } = useAppTranslation(); // ✅

// //   const [userData, setUserData] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [selectedTab, setSelectedTab] = useState('E2');
// //   const [leaderboardRank, setLeaderboardRank] = useState(null);

// //   /* ─── Fetch user ─────────────────────────────────────────────────────────── */
// //   useEffect(() => {
// //     const fetchUserData = async () => {
// //       try {
// //         const token = await AsyncStorage.getItem('accessToken');
// //         if (!token) { setLoading(false); return; }

// //         const response = await fetch(
// //           'http://13.203.232.239:3000/api/auth/getUser',
// //           { headers: { Authorization: `Bearer ${token}` } },
// //         );
// //         const result = await response.json();
// //         if (result.success) setUserData(result.user);
// //       } catch (e) {
// //         console.log(e);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     if (isFocused) fetchUserData();
// //   }, [isFocused]);

// //   /* ================= EFFECT TO SHOW TAB BAR ================= */
// //   useEffect(() => {
// //     // Ensure tab bar remains visible when ProfileScreen is active
// //     Navigation.setOptions({
// //       tabBarStyle: {
// //         display: 'flex',
// //         backgroundColor: '#1E293B',
// //         borderTopLeftRadius: 20,
// //         borderTopRightRadius: 20,
// //         borderTopWidth: 0,
// //         height: 60,
// //         paddingTop: 9,
// //       },
// //     });
// //   }, [Navigation]);

// //   /* ================= FETCH USER'S RANK FROM LEADERBOARD ================= */
// //   useEffect(() => {
// //     const fetchUserRank = async () => {
// //       try {
// //         const token = await AsyncStorage.getItem('accessToken');
// //         const language = (await AsyncStorage.getItem('appLanguage')) || 'en';
        
// //         if (!token) return;

// //         let url = '';
// //         if (selectedTab === 'E2') {
// //           url = `http://13.203.232.239:3000/api/friend/top100-friend-list?targetLanguage=${language}`;
// //         } else if (selectedTab === 'E4') {
// //           url = `http://13.203.232.239:3000/api/friend/top100-friend-list?targetLanguage=${language}`;
// //         } else if (selectedTab === 'M2') {
// //           url = `http://13.203.232.239:3000/api/friend/top100-friend-list?targetLanguage=${language}`;
// //         } else if (selectedTab === 'M4') {
// //           url = `http://13.203.232.239:3000/api/friend/top100-friend-list?targetLanguage=${language}`;
// //         } else if (selectedTab === 'H2') {
// //           url = `http://13.203.232.239:3000/api/friend/top100-friend-list?targetLanguage=${language}`;
// //         } else {
// //           url = `http://13.203.232.239:3000/api/friend/top100-friend-list?targetLanguage=${language}`;
// //         }

// //         const response = await fetch(url, {
// //           method: 'GET',
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //             'Content-Type': 'application/json',
// //           },
// //         });

// //         const result = await response.json();

// //         if (response.ok && Array.isArray(result?.data)) {
// //           // Find current user's rank position in the leaderboard
// //           const rankIndex = result.data.findIndex(user => user.username === userData?.username);
// //           if (rankIndex !== -1) {
// //             setLeaderboardRank(rankIndex + 1); // Rank is 1-indexed
// //           } else {
// //             setLeaderboardRank(null);
// //           }
// //         }
// //       } catch (error) {
// //         console.log('Rank fetch error:', error);
// //       }
// //     };

// //     if (selectedTab && userData?.username) {
// //       fetchUserRank();
// //     }
// //   }, [selectedTab, userData?.username]);

// //   /* ─── Helpers ────────────────────────────────────────────────────────────── */
// //   const formatDate = d => {
// //     if (!d) return t('N/A');                                               // ✅
// //     const date = new Date(d);
// //     return `${date.getDate().toString().padStart(2, '0')}-${date.toLocaleString(
// //       'en', { month: 'short' },
// //     )}-${date.getFullYear().toString().slice(-2)}`;
// //   };

// //   const getFlagFromCountryName = name => {
// //     if (!name) return '';
// //     const country = CountryList.find(
// //       c =>
// //         c.name.toLowerCase() === name.toLowerCase() ||
// //         c.code.toLowerCase() === name.toLowerCase(),
// //     );
// //     return country ? country.flag : '🏳️';
// //   };

// //   // ✅ Translated gender display
// //   const getGenderLabel = value => {
// //     if (!value) return t('N/A');
// //     if (value === 'other') return t('Others');
// //     return value.charAt(0).toUpperCase() + value.slice(1);
// //   };

// //   /* ─── Content ────────────────────────────────────────────────────────────── */
// //   const Content = () => {
// //     const insets = useSafeAreaInsets();
// //     return (
// //       <View style={{ flex: 1, paddingTop: insets.top + 30, paddingBottom: 75 }}>
// //         <CustomHeader
// //           title={t('PROFILE')}                                            // ✅
// //           onBack={() => Navigation.goBack()}
// //           rightIcon={
// //             <TouchableOpacity onPress={() => Navigation.navigate('UpdateProfile')}>
// //               <FontAwesome5 name="user-edit" size={normalize(16)} color="#fff" />
// //             </TouchableOpacity>
// //           }
// //         />

// //         <ScrollView
// //           contentContainerStyle={styles.scrollContent}
// //           showsVerticalScrollIndicator={false}>

// //           {loading ? (
// //             <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />
// //           ) : (
// //             <View style={styles.profileSection}>

// //               {/* Profile top: avatar + name + join date */}
// //               <View style={styles.profileTop}>
// //                 <View style={styles.imageContainer}>
// //                   <Image
// //                     source={
// //                       userData?.profileImage
// //                         ? { uri: userData.profileImage }
// //                         : require('../assets/dummyProfile.jpg')
// //                     }
// //                     style={styles.profileImage}
// //                   />
// //                 </View>
// //                 <View style={styles.profileText}>
// //                   <Text style={styles.userName}>
// //                     {userData?.username || t('Unknown')}                   {/* ✅ */}
// //                   </Text>
// //                   <Text style={styles.joinDate}>
// //                     {t('Joined:')} {formatDate(userData?.createdAt)}       {/* ✅ */}
// //                   </Text>
// //                 </View>
// //               </View>

// //               {/* Info rows */}
// //               <View style={styles.row}>
// //   <Text style={styles.label}>{t('Email:')}</Text>
// //   <Text style={styles.valueEmail}>
// //     {userData?.email || t('N/A')}
// //   </Text>
// // </View>

// // <View style={styles.row}>
// //   <Text style={styles.label}>{t('First Name:')}</Text>
// //   <Text style={styles.value}>
// //     {userData?.firstName || t('N/A')}
// //   </Text>
// // </View>

// // <View style={styles.row}>
// //   <Text style={styles.label}>{t('Last Name:')}</Text>
// //   <Text style={styles.value}>
// //     {userData?.lastName || t('N/A')}
// //   </Text>
// // </View>

// // <View style={styles.row}>
// //   <Text style={styles.label}>{t('Year of Birth:')}</Text>
// //   <Text style={styles.value}>
// //     {userData?.dateOfBirth
// //       ? new Date(userData.dateOfBirth).getFullYear()
// //       : t('N/A')}
// //   </Text>
// // </View>

// // <View style={styles.row}>
// //   <Text style={styles.label}>{t('Gender:')}</Text>
// //   <Text style={styles.value}>
// //     {getGenderLabel(userData?.gender)}
// //   </Text>
// // </View>

// //               {/* Rank tabs */}
// //               <View style={styles.tabRow}>
// //                 {['E2', 'E4', 'M2', 'M4', 'H2', 'H4'].map((item, index) => (
// //                   <TouchableOpacity
// //                     key={index}
// //                     style={[styles.tab, selectedTab === item && styles.activeTab]}
// //                     onPress={() => setSelectedTab(item)}>
// //                     <Text style={[styles.tabText, selectedTab === item && styles.activeTabText]}>
// //                       {item}
// //                     </Text>
// //                   </TouchableOpacity>
// //                 ))}
// //               </View>

// //               {/* Rank bar */}
// //               <View style={styles.rankContainer}>
// //                 <Text style={styles.rankText}>
// //                   {t('Current Rank:')} {leaderboardRank || 'N/A'}
// //                 </Text>
// //               </View>

// //               {/* Achievements */}
// //               <View style={styles.achievementsContainer}>
// //                 <Text style={styles.achievementTitle}>
// //                   {t('Achievements')}                                      {/* ✅ */}
// //                 </Text>
// //                 <View style={styles.achievementRow}>
// //                   {['Ach. 1', 'Ach. 2', 'Ach. 3', 'Ach. 4'].map((item, index) => (
// //                     <View key={index} style={styles.achievementBox}>
// //                       <Text style={styles.achievementText}>{item}</Text>
// //                     </View>
// //                   ))}
// //                 </View>
// //               </View>

// //             </View>
// //           )}
// //         </ScrollView>
// //       </View>
// //     );
// //   };

// //   return theme.backgroundGradient ? (
// //     <LinearGradient colors={theme.backgroundGradient} style={{ flex: 1 }}>
// //       <Content />
// //     </LinearGradient>
// //   ) : (
// //     <View style={{ flex: 1, backgroundColor: theme.backgroundColor || '#0D0D26' }}>
// //       <Content />
// //     </View>
// //   );
// // };

// // export default ProfileScreen;

// // const styles = StyleSheet.create({
// //   container: { flex: 1, padding: normalize(10) },
// //   scrollContent: {
// //     paddingBottom: normalize(30),
// //     paddingHorizontal: normalize(16),
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: normalize(15),
// //   },
// //   headerTitle: { color: '#fff', fontSize: normalize(18), fontWeight: '700' },
// //   headerSeparator: {
// //     height: 1,
// //     backgroundColor: '#94A3B8',
// //     opacity: 0.5,
// //     top: 10,
// //     marginHorizontal: -width * 0.05,
// //     marginBottom: height * 0.02,
// //     bottom: '1%',
// //   },
// //   profileSection: { marginVertical: normalize(10) },
// //   profileTop: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: normalize(12),
// //   },
// //   imageContainer: {
// //     borderWidth: 2,
// //     borderColor: '#444',
// //     borderRadius: normalize(30),
// //     overflow: 'hidden',
// //   },
// //   profileImage: {
// //     width: normalize(70),
// //     height: normalize(70),
// //   },
// //   profileText: { marginLeft: normalize(30) },
// //   userName: {
// //     color: '#fff',
// //     fontSize: normalize(18),
// //     fontWeight: '600',
// //     marginBottom: normalize(4),
// //   },
// //   joinDate: { color: '#999', fontSize: normalize(12) },
// //   userInfo: { marginTop: normalize(10), alignItems: 'flex-start' },
// //   email: { color: '#bbb', fontSize: normalize(14), marginBottom: normalize(2) },
// //   emailText: { color: '#4da6ff' },
// //   detail: {
// //     color: '#ccc',
// //     fontSize: normalize(14),
// //     marginVertical: normalize(2),
// //   },
// //   row: {
// //   flexDirection: 'row',
// //   justifyContent: 'space-between',
// //   alignItems: 'center',
// //   width: '100%',
// //   marginVertical: normalize(4),
// // },

// // label: {
// //   color: '#bbb',
// //   fontSize: normalize(14),
// // },

// // value: {
// //   color: '#ccc',
// //   fontSize: normalize(14),
// //   textAlign: 'left',
// //   flex: 1,
// // },

// // valueEmail: {
// //   color: '#4da6ff',
// //   fontSize: normalize(14),
// //   textAlign: 'left',
// //   flex: 1,
// // },
// //   tabRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     marginTop: normalize(35),
// //   },
// //   tab: {
// //     flex: 1,
// //     paddingVertical: normalize(8),
// //     alignItems: 'center',
// //     marginHorizontal: normalize(2),
// //     backgroundColor: '#1b1b3a',
// //     borderRadius: normalize(6),
// //   },
// //   activeTab: { backgroundColor: '#4e54c8' },
// //   tabText: { color: '#bbb', fontSize: normalize(14) },
// //   activeTabText: { color: '#fff', fontWeight: '600' },
// //   rankContainer: { marginTop: normalize(28) },
// //   rankText: {
// //     color: '#fff',
// //     fontSize: normalize(13),
// //     textAlign: 'center',
// //     marginBottom: normalize(20),
// //   },
// //   rankBar: {
// //     flexDirection: 'row',
// //     height: normalize(8),
// //     borderRadius: 6,
// //     overflow: 'hidden',
// //   },
// //   rankBarFillGreen: { backgroundColor: '#4CAF50' },
// //   rankBarFillRed: { backgroundColor: '#F44336' },
// //   achievementsContainer: { marginTop: normalize(25) },
// //   achievementTitle: {
// //     color: '#fff',
// //     fontSize: normalize(14),
// //     marginBottom: normalize(10),
// //     textAlign: 'center',
// //   },
// //   achievementRow: { flexDirection: 'row', justifyContent: 'space-between' },
// //   achievementBox: {
// //     flex: 1,
// //     backgroundColor: '#1e1e40',
// //     paddingVertical: normalize(10),
// //     marginHorizontal: normalize(4),
// //     borderRadius: normalize(8),
// //     alignItems: 'center',
// //   },
// //   achievementText: { color: '#ddd', fontSize: normalize(12) },
// // });

// import { useNavigation, useIsFocused } from '@react-navigation/native';
// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   Dimensions,
//   PixelRatio,
//   ScrollView,
//   ActivityIndicator,
// } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import LinearGradient from 'react-native-linear-gradient';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useTheme } from '../context/ThemeContext';
// import { CountryList } from '../utils/CountryList';
// import CustomHeader from '../components/CustomHeader';
// import { useAppTranslation } from '../context/TranslationContext';

// const { width, height } = Dimensions.get('window');
// const scale = width / 375;
// const normalize = size =>
//   Math.round(PixelRatio.roundToNearestPixel(size * scale));

// const ProfileScreen = () => {
//   const Navigation = useNavigation();
//   const isFocused = useIsFocused();
//   const { theme } = useTheme();
//   const { t } = useAppTranslation();

//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedTab, setSelectedTab] = useState('E2');
//   const [leaderboardRank, setLeaderboardRank] = useState(null);

//   /* ─── Load user from AsyncStorage (no broken API call) ──────────────────── */
//   useEffect(() => {
//     const loadUserData = async () => {
//       try {
//         // The full login response is already stored locally — use it directly.
//         // Your backend's /api/auth/getUser route does not exist (404), so we
//         // read from the stored keys that AuthProvider saves on login.

//         // Try 'userData' key first, then fall back to 'fullLoginResponse'
//         const userDataRaw = await AsyncStorage.getItem('userData');
//         const fullResponseRaw = await AsyncStorage.getItem('fullLoginResponse');

//         console.log('📦 [ProfileScreen] userData key raw:', userDataRaw ? userDataRaw.substring(0, 80) + '...' : 'NULL');
//         console.log('📦 [ProfileScreen] fullLoginResponse key raw:', fullResponseRaw ? fullResponseRaw.substring(0, 80) + '...' : 'NULL');

//         let user = null;

//         if (userDataRaw) {
//           try {
//             user = JSON.parse(userDataRaw);
//             console.log('✅ [ProfileScreen] Loaded user from "userData" key:', user?.username);
//           } catch (e) {
//             console.log('❌ [ProfileScreen] Failed to parse "userData":', e.message);
//           }
//         }

//         // If userData key didn't give us a user, try fullLoginResponse
//         if (!user && fullResponseRaw) {
//           try {
//             const full = JSON.parse(fullResponseRaw);
//             // fullLoginResponse structure: { token, user } or { token, player }
//             user = full?.user || full?.player || null;
//             console.log('✅ [ProfileScreen] Loaded user from "fullLoginResponse" key:', user?.username);
//           } catch (e) {
//             console.log('❌ [ProfileScreen] Failed to parse "fullLoginResponse":', e.message);
//           }
//         }

//         if (user) {
//           console.log('✅ [ProfileScreen] Final userData:', JSON.stringify(user, null, 2));
//           setUserData(user);
//         } else {
//           console.log('❌ [ProfileScreen] Could not load user from any AsyncStorage key');
//         }
//       } catch (e) {
//         console.log('❌ [ProfileScreen] loadUserData exception:', e.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (isFocused) loadUserData();
//   }, [isFocused]);

//   /* ─── Show tab bar ───────────────────────────────────────────────────────── */
//   useEffect(() => {
//     Navigation.setOptions({
//       tabBarStyle: {
//         display: 'flex',
//         backgroundColor: '#1E293B',
//         borderTopLeftRadius: 20,
//         borderTopRightRadius: 20,
//         borderTopWidth: 0,
//         height: 60,
//         paddingTop: 9,
//       },
//     });
//   }, [Navigation]);

//   /* ─── Fetch leaderboard rank ─────────────────────────────────────────────── */
//   useEffect(() => {
//     const fetchUserRank = async () => {
//       try {
//         const token = await AsyncStorage.getItem('accessToken');
//         const language = (await AsyncStorage.getItem('appLanguage')) || 'en';

//         console.log('🏆 [ProfileScreen] Fetching rank for tab:', selectedTab);

//         if (!token) {
//           console.log('❌ [ProfileScreen] fetchUserRank: no token');
//           return;
//         }

//         // NOTE: All tabs currently use the same URL — update these when you have
//         // tab-specific endpoints (e.g. add difficulty/timer params)
//         const url = `http://13.203.232.239:3000/api/friend/top100-friend-list?targetLanguage=${language}`;
//         console.log('📡 [ProfileScreen] Rank API URL:', url);

//         const response = await fetch(url, {
//           method: 'GET',
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });

//         // 🔍 LOG: Check rank API response
//         const contentType = response.headers.get('content-type');
//         console.log('📥 [ProfileScreen] Rank response status:', response.status);
//         console.log('📥 [ProfileScreen] Rank content-type:', contentType);

//         if (!contentType || !contentType.includes('application/json')) {
//           const rawText = await response.text();
//           console.log('❌ [ProfileScreen] Rank API returned non-JSON:', rawText.substring(0, 200));
//           return;
//         }

//         const result = await response.json();
//         console.log('📦 [ProfileScreen] Rank result (first 3 users):', JSON.stringify(result?.data?.slice(0, 3), null, 2));

//         if (response.ok && Array.isArray(result?.data)) {
//           const rankIndex = result.data.findIndex(
//             user => user.username === userData?.username,
//           );
//           console.log(
//             '🏆 [ProfileScreen] Rank search for username:',
//             userData?.username,
//             '→ found at index:',
//             rankIndex,
//           );
//           if (rankIndex !== -1) {
//             setLeaderboardRank(rankIndex + 1);
//           } else {
//             console.log('ℹ️ [ProfileScreen] User not found in top-100 list');
//             setLeaderboardRank(null);
//           }
//         } else {
//           console.log('❌ [ProfileScreen] Rank API unexpected structure:', JSON.stringify(result));
//         }
//       } catch (error) {
//         console.log('❌ [ProfileScreen] Rank fetch error:', error.message);
//       }
//     };

//     if (selectedTab && userData?.username) {
//       fetchUserRank();
//     }
//   }, [selectedTab, userData?.username]);

//   /* ─── Helpers ────────────────────────────────────────────────────────────── */
//   const formatDate = d => {
//     if (!d) return t('N/A');
//     const date = new Date(d);
//     return `${date.getDate().toString().padStart(2, '0')}-${date.toLocaleString(
//       'en',
//       { month: 'short' },
//     )}-${date.getFullYear().toString().slice(-2)}`;
//   };

//   const getFlagFromCountryName = name => {
//     if (!name) return '';
//     const country = CountryList.find(
//       c =>
//         c.name.toLowerCase() === name.toLowerCase() ||
//         c.code.toLowerCase() === name.toLowerCase(),
//     );
//     return country ? country.flag : '🏳️';
//   };

//   const getGenderLabel = value => {
//     if (!value) return t('N/A');
//     if (value === 'other') return t('Others');
//     return value.charAt(0).toUpperCase() + value.slice(1);
//   };

//   /* ─── Content ────────────────────────────────────────────────────────────── */
//   const Content = () => {
//     const insets = useSafeAreaInsets();
//     return (
//       <View style={{ flex: 1, paddingTop: insets.top + 30, paddingBottom: 75 }}>
//         <CustomHeader
//           title={t('PROFILE')}
//           onBack={() => Navigation.goBack()}
//           rightIcon={
//             <TouchableOpacity onPress={() => Navigation.navigate('UpdateProfile')}>
//               <FontAwesome5 name="user-edit" size={normalize(16)} color="#fff" />
//             </TouchableOpacity>
//           }
//         />

//         <ScrollView
//           contentContainerStyle={styles.scrollContent}
//           showsVerticalScrollIndicator={false}>

//           {loading ? (
//             <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />
//           ) : (
//             <View style={styles.profileSection}>

//               {/* Profile top: avatar + name + join date */}
//               <View style={styles.profileTop}>
//                 <View style={styles.imageContainer}>
//                   <Image
//                     source={
//                       userData?.profileImage
//                         ? { uri: userData.profileImage }
//                         : require('../assets/dummyProfile.jpg')
//                     }
//                     style={styles.profileImage}
//                   />
//                 </View>
//                 <View style={styles.profileText}>
//                   <Text style={styles.userName}>
//                     {userData?.username || t('Unknown')}
//                   </Text>
//                   <Text style={styles.joinDate}>
//                     {t('Joined:')} {formatDate(userData?.createdAt)}
//                   </Text>
//                 </View>
//               </View>

//               {/* Info rows */}
//               <View style={styles.row}>
//                 <Text style={styles.label}>{t('Email:')}</Text>
//                 <Text style={styles.valueEmail}>
//                   {userData?.email || t('N/A')}
//                 </Text>
//               </View>

//               <View style={styles.row}>
//                 <Text style={styles.label}>{t('First Name:')}</Text>
//                 <Text style={styles.value}>
//                   {userData?.firstName || t('N/A')}
//                 </Text>
//               </View>

//               <View style={styles.row}>
//                 <Text style={styles.label}>{t('Last Name:')}</Text>
//                 <Text style={styles.value}>
//                   {userData?.lastName || t('N/A')}
//                 </Text>
//               </View>

//               <View style={styles.row}>
//                 <Text style={styles.label}>{t('Year of Birth:')}</Text>
//                 <Text style={styles.value}>
//                   {userData?.dateOfBirth
//                     ? new Date(userData.dateOfBirth).getFullYear()
//                     : t('N/A')}
//                 </Text>
//               </View>

//               <View style={styles.row}>
//                 <Text style={styles.label}>{t('Gender:')}</Text>
//                 <Text style={styles.value}>
//                   {getGenderLabel(userData?.gender)}
//                 </Text>
//               </View>

//               {/* Rank tabs */}
//               <View style={styles.tabRow}>
//                 {['E2', 'E4', 'M2', 'M4', 'H2', 'H4'].map((item, index) => (
//                   <TouchableOpacity
//                     key={index}
//                     style={[styles.tab, selectedTab === item && styles.activeTab]}
//                     onPress={() => setSelectedTab(item)}>
//                     <Text
//                       style={[
//                         styles.tabText,
//                         selectedTab === item && styles.activeTabText,
//                       ]}>
//                       {item}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>

//               {/* Rank display */}
//               <View style={styles.rankContainer}>
//                 <Text style={styles.rankText}>
//                   {t('Current Rank:')} {leaderboardRank || 'N/A'}
//                 </Text>
//               </View>

//               {/* Achievements */}
//               <View style={styles.achievementsContainer}>
//                 <Text style={styles.achievementTitle}>
//                   {t('Achievements')}
//                 </Text>
//                 <View style={styles.achievementRow}>
//                   {['Ach. 1', 'Ach. 2', 'Ach. 3', 'Ach. 4'].map(
//                     (item, index) => (
//                       <View key={index} style={styles.achievementBox}>
//                         <Text style={styles.achievementText}>{item}</Text>
//                       </View>
//                     ),
//                   )}
//                 </View>
//               </View>

//             </View>
//           )}
//         </ScrollView>
//       </View>
//     );
//   };

//   return theme.backgroundGradient ? (
//     <LinearGradient colors={theme.backgroundGradient} style={{ flex: 1 }}>
//       <Content />
//     </LinearGradient>
//   ) : (
//     <View
//       style={{ flex: 1, backgroundColor: theme.backgroundColor || '#0D0D26' }}>
//       <Content />
//     </View>
//   );
// };

// export default ProfileScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: normalize(10) },
//   scrollContent: {
//     paddingBottom: normalize(30),
//     paddingHorizontal: normalize(16),
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: normalize(15),
//   },
//   headerTitle: { color: '#fff', fontSize: normalize(18), fontWeight: '700' },
//   headerSeparator: {
//     height: 1,
//     backgroundColor: '#94A3B8',
//     opacity: 0.5,
//     top: 10,
//     marginHorizontal: -width * 0.05,
//     marginBottom: height * 0.02,
//     bottom: '1%',
//   },
//   profileSection: { marginVertical: normalize(10) },
//   profileTop: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: normalize(12),
//   },
//   imageContainer: {
//     borderWidth: 2,
//     borderColor: '#444',
//     borderRadius: normalize(30),
//     overflow: 'hidden',
//   },
//   profileImage: {
//     width: normalize(70),
//     height: normalize(70),
//   },
//   profileText: { marginLeft: normalize(30) },
//   userName: {
//     color: '#fff',
//     fontSize: normalize(18),
//     fontWeight: '600',
//     marginBottom: normalize(4),
//   },
//   joinDate: { color: '#999', fontSize: normalize(12) },
//   userInfo: { marginTop: normalize(10), alignItems: 'flex-start' },
//   email: { color: '#bbb', fontSize: normalize(14), marginBottom: normalize(2) },
//   emailText: { color: '#4da6ff' },
//   detail: {
//     color: '#ccc',
//     fontSize: normalize(14),
//     marginVertical: normalize(2),
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     width: '100%',
//     marginVertical: normalize(4),
//   },
//   label: {
//     color: '#bbb',
//     fontSize: normalize(14),
//   },
//   value: {
//     color: '#ccc',
//     fontSize: normalize(14),
//     textAlign: 'left',
//     flex: 1,
//   },
//   valueEmail: {
//     color: '#4da6ff',
//     fontSize: normalize(14),
//     textAlign: 'left',
//     flex: 1,
//   },
//   tabRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: normalize(35),
//   },
//   tab: {
//     flex: 1,
//     paddingVertical: normalize(8),
//     alignItems: 'center',
//     marginHorizontal: normalize(2),
//     backgroundColor: '#1b1b3a',
//     borderRadius: normalize(6),
//   },
//   activeTab: { backgroundColor: '#4e54c8' },
//   tabText: { color: '#bbb', fontSize: normalize(14) },
//   activeTabText: { color: '#fff', fontWeight: '600' },
//   rankContainer: { marginTop: normalize(28) },
//   rankText: {
//     color: '#fff',
//     fontSize: normalize(13),
//     textAlign: 'center',
//     marginBottom: normalize(20),
//   },
//   rankBar: {
//     flexDirection: 'row',
//     height: normalize(8),
//     borderRadius: 6,
//     overflow: 'hidden',
//   },
//   rankBarFillGreen: { backgroundColor: '#4CAF50' },
//   rankBarFillRed: { backgroundColor: '#F44336' },
//   achievementsContainer: { marginTop: normalize(25) },
//   achievementTitle: {
//     color: '#fff',
//     fontSize: normalize(14),
//     marginBottom: normalize(10),
//     textAlign: 'center',
//   },
//   achievementRow: { flexDirection: 'row', justifyContent: 'space-between' },
//   achievementBox: {
//     flex: 1,
//     backgroundColor: '#1e1e40',
//     paddingVertical: normalize(10),
//     marginHorizontal: normalize(4),
//     borderRadius: normalize(8),
//     alignItems: 'center',
//   },
//   achievementText: { color: '#ddd', fontSize: normalize(12) },
// });


import { useNavigation, useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  PixelRatio,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { CountryList } from '../utils/CountryList';
import CustomHeader from '../components/CustomHeader';
import { useAppTranslation } from '../context/TranslationContext';
import { SvgUri } from 'react-native-svg';
import AchivementDetailPopup from './AchivementDetail';
import { authFetch as fetch } from '../utils/authFetch'; // auto-refresh wrapper for expired access tokens

const { width, height } = Dimensions.get('window');
const scale = width / 375;
const normalize = size =>
  Math.round(PixelRatio.roundToNearestPixel(size * scale));

const ProfileScreen = () => {
  const Navigation = useNavigation();
  const isFocused = useIsFocused();
  const { theme } = useTheme();
  const { t } = useAppTranslation();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('E2');
  const [leaderboardRank, setLeaderboardRank] = useState(null);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [selectedBadge, setSelectedBadge] = useState(null);
const [popupVisible, setPopupVisible] = useState(false);

  /* ─── Load user from AsyncStorage ───────────────────────────────────────── */
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userDataRaw = await AsyncStorage.getItem('userData');
        const fullResponseRaw = await AsyncStorage.getItem('fullLoginResponse');

        console.log('📦 [ProfileScreen] userData key raw:', userDataRaw ? userDataRaw.substring(0, 80) + '...' : 'NULL');
        console.log('📦 [ProfileScreen] fullLoginResponse key raw:', fullResponseRaw ? fullResponseRaw.substring(0, 80) + '...' : 'NULL');

        let user = null;

        if (userDataRaw) {
          try {
            user = JSON.parse(userDataRaw);
            console.log('✅ [ProfileScreen] Loaded user from "userData" key:', user?.username);
          } catch (e) {
            console.log('❌ [ProfileScreen] Failed to parse "userData":', e.message);
          }
        }

        if (!user && fullResponseRaw) {
          try {
            const full = JSON.parse(fullResponseRaw);
            user = full?.user || full?.player || null;
            console.log('✅ [ProfileScreen] Loaded user from "fullLoginResponse" key:', user?.username);
          } catch (e) {
            console.log('❌ [ProfileScreen] Failed to parse "fullLoginResponse":', e.message);
          }
        }

        if (user) {
          console.log('✅ [ProfileScreen] Final userData:', JSON.stringify(user, null, 2));
          setUserData(user);
        } else {
          console.log('❌ [ProfileScreen] Could not load user from any AsyncStorage key');
        }
      } catch (e) {
        console.log('❌ [ProfileScreen] loadUserData exception:', e.message);
      } finally {
        setLoading(false);
      }
    };

    if (isFocused) loadUserData();
  }, [isFocused]);

  /* ─── Fetch earned badges ────────────────────────────────────────────────── */
  useEffect(() => {
    const fetchEarnedBadges = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) return;

        const response = await fetch('http://13.203.232.239:3000/api/badges/my', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const rawText = await response.text();
          console.log('❌ [ProfileScreen] Badges API non-JSON:', rawText.substring(0, 200));
          return;
        }

        const result = await response.json();
        if (result.success && Array.isArray(result.badges)) {
          const earned = result.badges.filter(b => b.isEarned);
          console.log('🏅 [ProfileScreen] Earned badges count:', earned.length);
          setEarnedBadges(earned);
        }
      } catch (e) {
        console.log('❌ [ProfileScreen] fetchEarnedBadges error:', e.message);
      }
    };

    if (isFocused) fetchEarnedBadges();
  }, [isFocused]);

  /* ─── Show tab bar ───────────────────────────────────────────────────────── */
  useEffect(() => {
    Navigation.setOptions({
      tabBarStyle: {
        display: 'flex',
        backgroundColor: '#1E293B',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderTopWidth: 0,
        height: 60,
        paddingTop: 9,
      },
    });
  }, [Navigation]);

  /* ─── Fetch leaderboard rank ─────────────────────────────────────────────── */
  useEffect(() => {
    const fetchUserRank = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const language = (await AsyncStorage.getItem('appLanguage')) || 'en';

        console.log('🏆 [ProfileScreen] Fetching rank for tab:', selectedTab);

        if (!token) {
          console.log('❌ [ProfileScreen] fetchUserRank: no token');
          return;
        }

        const url = `http://13.203.232.239:3000/api/friend/top100-friend-list?targetLanguage=${language}`;
        console.log('📡 [ProfileScreen] Rank API URL:', url);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const contentType = response.headers.get('content-type');
        console.log('📥 [ProfileScreen] Rank response status:', response.status);
        console.log('📥 [ProfileScreen] Rank content-type:', contentType);

        if (!contentType || !contentType.includes('application/json')) {
          const rawText = await response.text();
          console.log('❌ [ProfileScreen] Rank API returned non-JSON:', rawText.substring(0, 200));
          return;
        }

        const result = await response.json();
        console.log('📦 [ProfileScreen] Rank result (first 3 users):', JSON.stringify(result?.data?.slice(0, 3), null, 2));

        if (response.ok && Array.isArray(result?.data)) {
          const rankIndex = result.data.findIndex(
            user => user.username === userData?.username,
          );
          console.log(
            '🏆 [ProfileScreen] Rank search for username:',
            userData?.username,
            '→ found at index:',
            rankIndex,
          );
          if (rankIndex !== -1) {
            setLeaderboardRank(rankIndex + 1);
          } else {
            console.log('ℹ️ [ProfileScreen] User not found in top-100 list');
            setLeaderboardRank(null);
          }
        } else {
          console.log('❌ [ProfileScreen] Rank API unexpected structure:', JSON.stringify(result));
        }
      } catch (error) {
        console.log('❌ [ProfileScreen] Rank fetch error:', error.message);
      }
    };

    if (selectedTab && userData?.username) {
      fetchUserRank();
    }
  }, [selectedTab, userData?.username]);

  /* ─── Helpers ────────────────────────────────────────────────────────────── */
  const formatDate = d => {
    if (!d) return t('N/A');
    const date = new Date(d);
    return `${date.getDate().toString().padStart(2, '0')}-${date.toLocaleString(
      'en',
      { month: 'short' },
    )}-${date.getFullYear().toString().slice(-2)}`;
  };

  const getFlagFromCountryName = name => {
    if (!name) return '';
    const country = CountryList.find(
      c =>
        c.name.toLowerCase() === name.toLowerCase() ||
        c.code.toLowerCase() === name.toLowerCase(),
    );
    return country ? country.flag : '🏳️';
  };

  const getGenderLabel = value => {
    if (!value) return t('N/A');
    if (value === 'other') return t('Others');
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  /* ─── Content ────────────────────────────────────────────────────────────── */
  const Content = () => {
    const insets = useSafeAreaInsets();
    return (
      <View style={{ flex: 1, paddingTop: insets.top + 30, paddingBottom: 75 }}>
        <CustomHeader
          title={t('PROFILE')}
          onBack={() => Navigation.goBack()}
          rightIcon={
            <TouchableOpacity onPress={() => Navigation.navigate('UpdateProfile')}>
              <FontAwesome5 name="user-edit" size={normalize(16)} color="#fff" />
            </TouchableOpacity>
          }
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>

          {loading ? (
            <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />
          ) : (
            <View style={styles.profileSection}>

              {/* Profile top: avatar + name + join date */}
              <View style={styles.profileTop}>
                <View style={styles.imageContainer}>
                  <Image
                    source={
                      userData?.profileImage
                        ? { uri: userData.profileImage }
                        : require('../assets/dummyProfile.jpg')
                    }
                    style={styles.profileImage}
                  />
                </View>
                <View style={styles.profileText}>
                  <Text style={styles.userName}>
                    {userData?.username || t('Unknown')}
                  </Text>
                  <Text style={styles.joinDate}>
                    {t('Joined:')} {formatDate(userData?.createdAt)}
                  </Text>
                </View>
              </View>

              {/* Info rows */}
              <View style={styles.row}>
                <Text style={styles.label}>{t('Email:')}</Text>
                <Text style={styles.valueEmail}>
                  {userData?.email || t('N/A')}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>{t('First Name:')}</Text>
                <Text style={styles.value}>
                  {userData?.firstName || t('N/A')}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>{t('Last Name:')}</Text>
                <Text style={styles.value}>
                  {userData?.lastName || t('N/A')}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>{t('Year of Birth:')}</Text>
                <Text style={styles.value}>
                  {userData?.dateOfBirth
                    ? new Date(userData.dateOfBirth).getFullYear()
                    : t('N/A')}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>{t('Gender:')}</Text>
                <Text style={styles.value}>
                  {getGenderLabel(userData?.gender)}
                </Text>
              </View>

              {/* Rank tabs */}
              <View style={styles.tabRow}>
                {['E2', 'E4', 'M2', 'M4', 'H2', 'H4'].map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.tab, selectedTab === item && styles.activeTab]}
                    onPress={() => setSelectedTab(item)}>
                    <Text
                      style={[
                        styles.tabText,
                        selectedTab === item && styles.activeTabText,
                      ]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Rank display */}
              <View style={styles.rankContainer}>
                <Text style={styles.rankText}>
                  {t('Current Rank:')} {leaderboardRank || 'N/A'}
                </Text>
              </View>

              {/* ── Achievements (earned badges from API) ── */}
              <View style={styles.achievementsContainer}>
                <Text style={styles.achievementTitle}>
                  {t('Achievements')} ({earnedBadges.length})
                </Text>

                {earnedBadges.length === 0 ? (
                  <Text style={styles.noBadgesText}>
                    {t('No achievements yet')}
                  </Text>
                ) : (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.badgeScrollContent}>
                    {earnedBadges.map((badge, index) => (
                      <TouchableOpacity
  key={badge.badgeId || index}
  style={styles.achievementBox}
  activeOpacity={0.8}
  onPress={() => {
    setSelectedBadge(badge);
    setPopupVisible(true);
  }}
>
                        {badge.iconUrl ? (
                          <SvgUri
                            uri={badge.iconUrl}
                            width={normalize(28)}
                            height={normalize(28)}
                          />
                        ) : (
                          <Text style={styles.badgeFallbackIcon}>🏅</Text>
                        )}
                        <Text style={styles.achievementText} numberOfLines={2}>
                          {badge.title}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>

            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  return theme.backgroundGradient ? (
    <LinearGradient colors={theme.backgroundGradient} style={{ flex: 1 }}>
      <Content />
      <AchivementDetailPopup
        visible={popupVisible}
        badge={selectedBadge}
        onClose={() => setPopupVisible(false)}
      />
    </LinearGradient>
  ) : (
    <View
      style={{ flex: 1, backgroundColor: theme.backgroundColor || '#0D0D26' }}>
      <Content />
      <AchivementDetailPopup
        visible={popupVisible}
        badge={selectedBadge}
        onClose={() => setPopupVisible(false)}
      />
      <AchivementDetailPopup
  visible={popupVisible}
  badge={selectedBadge}
  onClose={() => setPopupVisible(false)}
/>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: normalize(10) },
  scrollContent: {
    paddingBottom: normalize(30),
    paddingHorizontal: normalize(16),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(15),
  },
  headerTitle: { color: '#fff', fontSize: normalize(18), fontWeight: '700' },
  headerSeparator: {
    height: 1,
    backgroundColor: '#94A3B8',
    opacity: 0.5,
    top: 10,
    marginHorizontal: -width * 0.05,
    marginBottom: height * 0.02,
    bottom: '1%',
  },
  profileSection: { marginVertical: normalize(10) },
  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(12),
  },
  imageContainer: {
    borderWidth: 2,
    borderColor: '#444',
    borderRadius: normalize(30),
    overflow: 'hidden',
  },
  profileImage: {
    width: normalize(70),
    height: normalize(70),
  },
  profileText: { marginLeft: normalize(30) },
  userName: {
    color: '#fff',
    fontSize: normalize(18),
    fontWeight: '600',
    marginBottom: normalize(4),
  },
  joinDate: { color: '#999', fontSize: normalize(12) },
  userInfo: { marginTop: normalize(10), alignItems: 'flex-start' },
  email: { color: '#bbb', fontSize: normalize(14), marginBottom: normalize(2) },
  emailText: { color: '#4da6ff' },
  detail: {
    color: '#ccc',
    fontSize: normalize(14),
    marginVertical: normalize(2),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginVertical: normalize(4),
  },
  label: {
    color: '#bbb',
    fontSize: normalize(14),
  },
  value: {
    color: '#ccc',
    fontSize: normalize(14),
    textAlign: 'left',
    flex: 1,
  },
  valueEmail: {
    color: '#4da6ff',
    fontSize: normalize(14),
    textAlign: 'left',
    flex: 1,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: normalize(35),
  },
  tab: {
    flex: 1,
    paddingVertical: normalize(8),
    alignItems: 'center',
    marginHorizontal: normalize(2),
    backgroundColor: '#1b1b3a',
    borderRadius: normalize(6),
  },
  activeTab: { backgroundColor: '#4e54c8' },
  tabText: { color: '#bbb', fontSize: normalize(14) },
  activeTabText: { color: '#fff', fontWeight: '600' },
  rankContainer: { marginTop: normalize(28) },
  rankText: {
    color: '#fff',
    fontSize: normalize(13),
    textAlign: 'center',
    marginBottom: normalize(20),
  },
  rankBar: {
    flexDirection: 'row',
    height: normalize(8),
    borderRadius: 6,
    overflow: 'hidden',
  },
  rankBarFillGreen: { backgroundColor: '#4CAF50' },
  rankBarFillRed: { backgroundColor: '#F44336' },

  /* ── Achievements ── */
  achievementsContainer: { marginTop: normalize(25) },
  achievementTitle: {
    color: '#fff',
    fontSize: normalize(14),
    marginBottom: normalize(10),
    textAlign: 'center',
  },
  noBadgesText: {
    color: '#888',
    textAlign: 'center',
    fontSize: normalize(12),
    marginTop: normalize(4),
  },
  badgeScrollContent: {
    paddingVertical: normalize(4),
    paddingHorizontal: normalize(2),
  },
  achievementBox: {
    width: normalize(72),
    backgroundColor: '#1e1e40',
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(6),
    marginHorizontal: normalize(4),
    borderRadius: normalize(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeFallbackIcon: {
    fontSize: normalize(22),
    marginBottom: normalize(4),
  },
  achievementText: {
    color: '#ddd',
    fontSize: normalize(10),
    textAlign: 'center',
    marginTop: normalize(4),
    lineHeight: normalize(13),
  },
});