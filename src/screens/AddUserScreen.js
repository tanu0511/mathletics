// // import React, { useState, useEffect } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   TextInput,
// //   Image,
// //   TouchableOpacity,
// //   FlatList,
// //   ScrollView,
// //   Dimensions,
// //   ActivityIndicator,
// //   RefreshControl,
// // } from 'react-native';
// // import Icon from 'react-native-vector-icons/Ionicons';
// // import FontAwesome from 'react-native-vector-icons/FontAwesome';
// // import axios from 'axios';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import { useIsFocused, useNavigation } from '@react-navigation/native';
// // import Toast from 'react-native-toast-message';
// // import messaging from '@react-native-firebase/messaging';
// // import LinearGradient from 'react-native-linear-gradient';
// // import { useTheme } from '../context/ThemeContext';
// // import CustomHeader from '../components/CustomHeader';
// // import { useAppTranslation } from '../context/TranslationContext';
// // import Share from 'react-native-share';
// // import { Linking } from 'react-native';

// // const shareMessenger = () => {
// //   const link = "https://drive.google.com/uc?export=download&id=1vY-9jbQaAvqtedlOogSUOQbo2BOzn6gc";

// //   const url = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(
// //     link
// //   )}&app_id=123456789&redirect_uri=https://www.facebook.com/`;

// //   Linking.openURL(url).catch(() => {
// //     alert("Something went wrong");
// //   });
// // };

// // const shareOnWhatsApp = async () => {
// //   const appLink = "https://drive.google.com/uc?export=download&id=1vY-9jbQaAvqtedlOogSUOQbo2BOzn6gc";

// //   const options = {
// //     title: "Join my app",
// //     message: `🔥 Hey! Try my new game\n\n📥 Download here:\n${appLink}`,
// //   };

// //   try {
// //     await Share.open(options); // ✅ IMPORTANT CHANGE
// //   } catch (error) {
// //     console.log("Error sharing:", error);
// //   }
// // };

// // const shareOnFacebook = async () => {
// //   const appLink = "https://drive.google.com/uc?export=download&id=1vY-9jbQaAvqtedlOogSUOQbo2BOzn6gc";

// //   try {
// //     await Share.open({
// //       url: appLink,
// //       message: "Download my app", // ✅ prevents null crash
// //     });
// //   } catch (error) {
// //     console.log("Error:", error);
// //   }
// // };

// // const { width, height } = Dimensions.get('window');
// // const scale = size => (width / 375) * size;
// // const scaleFont = size => size * (width / 375);

// // const AddUserScreen = () => {
// //   const navigation = useNavigation();
// //   const isFocused = useIsFocused();
// //   const { theme } = useTheme();
// //   const { t } = useAppTranslation();

// //   const [refreshing, setRefreshing] = useState(false);
// //   const [myFriends, setMyFriends] = useState([]);
// //   const [displayedUsers, setDisplayedUsers] = useState([]);
// //   const [searchText, setSearchText] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [pendingCount, setPendingCount] = useState(0);

// //   const onRefresh = () => {
// //     setRefreshing(true);
// //     fetchPendingCount();
// //     if (searchText.trim() !== '') {
// //       fetchSearchedUsers(searchText);
// //     } else {
// //       fetchMyFriends();
// //     }
// //     setTimeout(() => {
// //       setRefreshing(false);
// //     }, 2000);
// //   };

// //   /* ================= API CALLS ================= */

// //   const fetchPendingCount = async () => {
// //     try {
// //       const token = await AsyncStorage.getItem('accessToken');
// //       const response = await axios.get(
// //         'http://13.203.232.239:3000/api/friend/friend-request',
// //         { headers: { Authorization: `Bearer ${token}` } },
// //       );
// //       setPendingCount(response.data.total);
// //     } catch (error) {
// //       console.log('❌ Error fetching pending count:', error.message);
// //     }
// //   };

// //   const fetchMyFriends = async () => {
// //     try {
// //       setLoading(true);
// //       const token = await AsyncStorage.getItem('accessToken');
// //       if (!token) {
// //         setLoading(false);
// //         return;
// //       }
// //       const response = await axios.get(
// //         'http://13.203.232.239:3000/api/friend/my-friend-list',
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //             'Content-Type': 'application/json',
// //             Accept: 'application/json',
// //           },
// //         },
// //       );
// //       if (response.data.success) {
// //         const friendsList = response.data.friends || [];
// //         const formattedFriends = friendsList.map(f => ({
// //           ...f,
// //           friendshipStatus: 'accepted',
// //         }));
// //         setMyFriends(formattedFriends);
// //         if (searchText.trim() === '') {
// //           setDisplayedUsers(formattedFriends);
// //         }
// //       }
// //     } catch (error) {
// //       console.log('❌ Error fetching friends:', error.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const fetchSearchedUsers = async text => {
// //     try {
// //       setLoading(true);
// //       const token = await AsyncStorage.getItem('accessToken');
// //       const response = await axios.post(
// //         'http://13.203.232.239:3000/api/friend/search-user-list',
// //         { searchText: text },
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //             'Content-Type': 'application/json',
// //           },
// //         },
// //       );
// //       if (response.data.success) {
// //         setDisplayedUsers(response.data.users);
// //       }
// //     } catch (error) {
// //       console.log('❌ Error searching users:', error.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   /* ================= ACTIONS ================= */

// //   const handleAddFriend = async recipientId => {
// //     try {
// //       const token = await AsyncStorage.getItem('accessToken');
// //       const user = await AsyncStorage.getItem('userData');
// //       if (!token || !user) return;

// //       const parsedUser = JSON.parse(user);
// //       const requesterId = parsedUser?.id || parsedUser?._id;
// //       if (!requesterId || !recipientId) return;

// //       const response = await fetch(
// //         'http://13.203.232.239:3000/api/friend/add-friend',
// //         {
// //           method: 'POST',
// //           headers: {
// //             'Content-Type': 'application/json',
// //             Authorization: `Bearer ${token}`,
// //           },
// //           body: JSON.stringify({ requester: requesterId, recipient: recipientId }),
// //         },
// //       );
// //       const data = await response.json();

// //       if (data.success) {
// //         Toast.show({ type: 'success', text1: t('Friend Request Sent') });
// //         setDisplayedUsers(prev =>
// //           prev.map(u =>
// //             u._id === recipientId ? { ...u, friendshipStatus: 'pending' } : u,
// //           ),
// //         );
// //       } else {
// //         Toast.show({ type: 'error', text1: t('Request Failed'), text2: data.message });
// //       }
// //     } catch (error) {
// //       console.log('Error sending friend request:', error);
// //     }
// //   };

// //   const handleCancelRequest = async friendId => {
// //     try {
// //       setDisplayedUsers(prev =>
// //         prev.map(u =>
// //           u._id === friendId ? { ...u, friendshipStatus: 'none' } : u,
// //         ),
// //       );
// //       const token = await AsyncStorage.getItem('accessToken');
// //       const response = await axios.delete(
// //         'http://13.203.232.239:3000/api/friend/deleteFriendShipByUser',
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //             'Content-Type': 'application/json',
// //           },
// //           data: { friendId },
// //         },
// //       );
// //       if (response.data.success) {
// //         Toast.show({ type: 'success', text1: t('Request Cancelled') });
// //       } else {
// //         Toast.show({ type: 'error', text1: t('Failed to cancel') });
// //         fetchSearchedUsers(searchText);
// //       }
// //     } catch (error) {
// //       console.log('❌ Error cancelling request:', error);
// //       Toast.show({ type: 'error', text1: t('Error cancelling request') });
// //     }
// //   };

// //   const handleSearch = text => setSearchText(text);

// //   useEffect(() => {
// //     const delayDebounceFn = setTimeout(() => {
// //       if (searchText.trim() === '') {
// //         fetchMyFriends();
// //       } else {
// //         fetchSearchedUsers(searchText);
// //       }
// //     }, 500);
// //     return () => clearTimeout(delayDebounceFn);
// //   }, [searchText]);

// //   useEffect(() => {
// //     if (isFocused) {
// //       if (searchText.trim() === '') {
// //         fetchMyFriends();
// //       } else {
// //         fetchSearchedUsers(searchText);
// //       }
// //       fetchPendingCount();
// //     }
// //   }, [isFocused]);

// //   useEffect(() => {
// //     const auth = messaging();
// //     const unsubscribe = auth.onMessage(async remoteMessage => {
// //       const { data } = remoteMessage;
// //       if (!data) return;

// //       const userData = await AsyncStorage.getItem('fullLoginResponse');
// //       const parsedData = userData ? JSON.parse(userData) : null;
// //       const myUserId = parsedData?.player?.id;
// //       if (!myUserId) return;

// //       const { recipient, type } = data;

// //       if (type === 'FRIEND_ACCEPTED' || type === 'FRIEND_REJECTED') {
// //         if (searchText.trim() !== '') fetchSearchedUsers(searchText);
// //         else fetchMyFriends();
// //         fetchPendingCount();
// //       }
// //       if (type === 'FRIEND_REQUEST' && recipient === myUserId) {
// //         fetchPendingCount();
// //       }
// //     });
// //     return () => unsubscribe();
// //   }, []);

// //   /* ================= UI RENDER ================= */

// //   const renderItem = ({ item }) => {
// //     const status = item.friendshipStatus;

// //     const fullName =
// //       item.firstName || item.lastName
// //         ? `${item.firstName || ''} ${item.lastName || ''}`.trim()
// //         : 'null';

// //     return (
// //       <View
// //         style={[
// //           styles.friendRow,
// //           { backgroundColor: theme.backgroundGradient || '#1E293B' },
// //         ]}>
// //         <TouchableOpacity
// //           style={styles.friendInfo}
// //           onPress={() => navigation.navigate('UserProfile', { userId: item._id })}>
// //           <Image
// //             source={
// //               item.profileImage
// //                 ? { uri: item.profileImage }
// //                 : require('../assets/avater.png')
// //             }
// //             style={styles.avatar}
// //           />

// //           <View>
// //             <View style={{ flexDirection: 'row' }}>
// //               <Text style={[styles.usernameText, { color: theme.subText }]}>
// //                 {t('Username:')}{' '}
// //               </Text>
// //               <Text style={[styles.usernameText1, { color: theme.text }]}>
// //                 {item.username}
// //               </Text>
// //             </View>

// //             <View style={{ flexDirection: 'row' }}>
// //               <Text style={[styles.nameText, { color: theme.subText }]}>
// //                 {t('Name:')}{' '}
// //               </Text>
// //               <Text style={[styles.usernameText1, { color: theme.text }]}>
// //                 {fullName}
// //               </Text>
// //             </View>

// //             {(() => {
// //               const pvpStats = item.pr?.find(p => p.mode === 'pvp');
// //               const pvpRating = pvpStats?.medium || 'N/A';
// //               return (
// //                 <View style={{ flexDirection: 'row' }}>
// //                   <Text style={[styles.ratingText, { color: theme.subText }]}>
// //                     {t('PvP Rating:')}{' '}
// //                   </Text>
// //                   <Text style={[styles.usernameText1, { color: theme.text }]}>
// //                     {pvpRating}
// //                   </Text>
// //                 </View>
// //               );
// //             })()}
// //           </View>
// //         </TouchableOpacity>

// //         {/* BUTTON ACTIONS */}
// //         {status === 'accepted' ? (
// //           <View style={styles.statusButton}>
// //             <Text style={[styles.statusText, { color: '#4ADE80' }]}>
// //               {t('Friend')}
// //             </Text>
// //           </View>
// //         ) : status === 'pending' ? (
// //           <TouchableOpacity
// //             style={[
// //               styles.addButton,
// //               { backgroundColor: theme.secondary || '#64748B' },
// //             ]}
// //             onPress={() => handleCancelRequest(item._id)}>
// //             <Text style={styles.addText}>{t('Pending')}</Text>
// //           </TouchableOpacity>
// //         ) : (
// //           <TouchableOpacity
// //             style={[
// //               styles.addButton,
// //               { backgroundColor: theme.primary || '#17677F' },
// //             ]}
// //             onPress={() => handleAddFriend(item._id)}>
// //             <Text style={styles.addText}>+</Text>
// //           </TouchableOpacity>
// //         )}
// //       </View>
// //     );
// //   };

// //   return (
// //     <LinearGradient
// //       colors={theme.backgroundGradient || ['#0F172A', '#1E293B']}
// //       style={{ flex: 1 }}>
// //       <View style={{ flex: 1, paddingTop: height * 0.03 }}>
// //         <CustomHeader
// //           title={t('FRIENDS')}
// //           onBack={() => navigation.goBack()}
// //           rightIcon={
// //             <View style={styles.notificationContainer}>
// //               <TouchableOpacity
// //                 onPress={() => navigation.navigate('FriendRequestScreen')}>
// //                 <Icon
// //                   name="notifications-outline"
// //                   size={scale(22)}
// //                   color={theme.text || '#fff'}
// //                 />
// //               </TouchableOpacity>
// //               <View
// //                 style={[
// //                   styles.badge,
// //                   { backgroundColor: theme.error || '#EF4444' },
// //                 ]}>
// //                 <Text style={styles.badgeText}>{pendingCount || 0}</Text>
// //               </View>
// //             </View>
// //           }
// //         />

// //         <View style={[styles.container, { paddingTop: 0 }]}>
// //           <View style={{ top: 20, flex: 1 }}>
// //             {/* Search bar */}
// //             <View
// //               style={[
// //                 styles.searchContainer,
// //                 { backgroundColor: theme.cardBackground || '#1E293B' },
// //               ]}>
// //               <Icon
// //                 name="search"
// //                 size={scale(22)}
// //                 color={theme.subText || '#94A3B8'}
// //               />
// //               <TextInput
// //                 placeholder={t('Search Contacts')}
// //                 placeholderTextColor={theme.subText || '#94A3B8'}
// //                 style={[styles.searchInput, { color: theme.text }]}
// //                 value={searchText}
// //                 onChangeText={handleSearch}
// //               />
// //             </View>

// //             {loading ? (
// //               <ActivityIndicator
// //                 size="large"
// //                 color={theme.primary || '#FB923C'}
// //                 style={{ marginTop: height * 0.05 }}
// //               />
// //             ) : (
// //               <>
// //                 {searchText.trim() === '' && (
// //                   <View
// //                     style={[
// //                       styles.inviteSection,
// //                       { backgroundColor: theme.cardBackground || '#1E293B' },
// //                     ]}>
// //                     <Text style={[styles.sectionTitle, { color: theme.text }]}>
// //                       {t('Invite & Connect')}
// //                     </Text>

// //                     <TouchableOpacity
// //                     onPress={shareOnWhatsApp}
// //                       style={[
// //                         styles.inviteButton1,
// //                         { backgroundColor: '#25D366' },
// //                       ]}>
// //                       <FontAwesome
// //                         name="whatsapp"
// //                         size={scale(20)}
// //                         color="#fff"
// //                         style={styles.iconLeft}
// //                       />
// //                       <Text style={styles.inviteText}>
// //                         {t('Invite Friends via WhatsApp or SMS')}
// //                       </Text>
// //                     </TouchableOpacity>

// //                     <TouchableOpacity onPress={shareOnFacebook}
// //                       style={[
// //                         styles.inviteButton,
// //                         { backgroundColor: theme.cardBackground || '#1E293B' },
// //                       ]}>
// //                       <View style={styles.fbIconCircle}>
// //                         <FontAwesome
// //                           name="facebook"
// //                           size={scale(22)}
// //                           color="#fff"
// //                         />
// //                       </View>
// //                       <Text style={[styles.inviteText, { color: theme.text }]}>
// //                         {t('Facebook Friends')}
// //                       </Text>
// //                     </TouchableOpacity>
// //                   </View>
// //                 )}

// //                 <Text style={[styles.sectionTitle, { color: theme.text }]}>
// //                   {searchText.trim() !== ''
// //                     ? t('Search Results')
// //                     : `${t('My Friends')} (${displayedUsers.length})`}
// //                 </Text>

// //                 <ScrollView
// //                   refreshControl={
// //                     <RefreshControl
// //                       refreshing={refreshing}
// //                       onRefresh={onRefresh}
// //                     />
// //                   }
// //                   showsVerticalScrollIndicator={false}>
// //                   <FlatList
// //                     data={displayedUsers}
// //                     keyExtractor={item => item._id}
// //                     renderItem={renderItem}
// //                     scrollEnabled={false}
// //                     contentContainerStyle={{ paddingBottom: height * 0.1 }}
// //                     ListEmptyComponent={
// //                       <View style={{ alignItems: 'center', marginTop: 20 }}>
// //                         <Text style={{ color: theme.subText }}>
// //                           {t('No users found.')}
// //                         </Text>
// //                       </View>
// //                     }
// //                   />
// //                 </ScrollView>
// //               </>
// //             )}
// //           </View>
// //         </View>
// //       </View>
// //     </LinearGradient>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     paddingHorizontal: width * 0.04,
// //     paddingTop: height * 0.03,
// //   },
// //   notificationContainer: {
// //     position: 'relative',
// //   },
// //   badge: {
// //     position: 'absolute',
// //     top: -6,
// //     right: -8,
// //     borderRadius: 8,
// //     paddingHorizontal: 4,
// //     minWidth: 16,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   badgeText: {
// //     color: '#fff',
// //     fontSize: scaleFont(10),
// //     fontWeight: '700',
// //   },
// //   searchContainer: {
// //     borderRadius: 8,
// //     marginBottom: height * 0.02,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingStart: '3%',
// //   },
// //   searchInput: {
// //     height: height * 0.055,
// //     paddingHorizontal: 12,
// //     flex: 1,
// //   },
// //   inviteSection: {
// //     borderRadius: 10,
// //     padding: width * 0.03,
// //     marginBottom: height * 0.03,
// //   },
// //   sectionTitle: {
// //     fontSize: scaleFont(16),
// //     fontWeight: '700',
// //     marginBottom: height * 0.015,
// //   },
// //   inviteButton1: {
// //     borderRadius: 8,
// //     paddingVertical: height * 0.012,
// //     paddingHorizontal: width * 0.03,
// //     alignItems: 'center',
// //     flexDirection: 'row',
// //     marginBottom: height * 0.012,
// //   },
// //   inviteButton: {
// //     borderRadius: 8,
// //     paddingVertical: height * 0.012,
// //     paddingHorizontal: width * 0.03,
// //     alignItems: 'center',
// //     flexDirection: 'row',
// //   },
// //   iconLeft: {
// //     marginRight: width * 0.03,
// //   },
// //   inviteText: {
// //     color: '#fff',
// //     fontWeight: '600',
// //     fontSize: scaleFont(14),
// //   },
// //   fbIconCircle: {
// //     backgroundColor: '#1877F2',
// //     width: scale(34),
// //     height: scale(34),
// //     borderRadius: 12,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     marginRight: width * 0.03,
// //   },
// //   friendRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     borderRadius: 8,
// //     padding: width * 0.03,
// //     marginBottom: height * 0.015,
// //   },
// //   friendInfo: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   avatar: {
// //     width: scale(50),
// //     height: scale(50),
// //     marginRight: width * 0.03,
// //     borderRadius: 10,
// //   },
// //   addButton: {
// //     borderRadius: 6,
// //     paddingHorizontal: width * 0.05,
// //     paddingVertical: height * 0.006,
// //   },
// //   statusButton: {
// //     borderRadius: 6,
// //     paddingHorizontal: width * 0.02,
// //     paddingVertical: height * 0.006,
// //   },
// //   addText: {
// //     color: '#fff',
// //     fontWeight: 'bold',
// //     fontSize: scaleFont(14),
// //   },
// //   statusText: {
// //     fontWeight: 'bold',
// //     fontSize: scaleFont(14),
// //   },
// //   usernameText: {
// //     fontSize: scaleFont(13),
// //     fontWeight: '600',
// //   },
// //   usernameText1: {
// //     fontSize: scaleFont(13),
// //     fontWeight: 'bold',
// //   },
// //   nameText: {
// //     fontSize: scaleFont(12),
// //     marginTop: 2,
// //   },
// //   ratingText: {
// //     fontSize: scaleFont(11),
// //     marginTop: 2,
// //   },
// // });

// // export default AddUserScreen;

// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   Image,
//   TouchableOpacity,
//   FlatList,
//   ScrollView,
//   Dimensions,
//   ActivityIndicator,
//   RefreshControl,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useIsFocused, useNavigation } from '@react-navigation/native';
// import Toast from 'react-native-toast-message';
// import messaging from '@react-native-firebase/messaging';
// import LinearGradient from 'react-native-linear-gradient';
// import { useTheme } from '../context/ThemeContext';
// import CustomHeader from '../components/CustomHeader';
// import { useAppTranslation } from '../context/TranslationContext';
// import Share from 'react-native-share';
// import { Linking, Alert } from 'react-native';

// const APP_LINK = "https://drive.google.com/uc?export=download&id=1vY-9jbQaAvqtedlOogSUOQbo2BOzn6gc";

// const MESSAGE = `🔥 Hey! Try my new game 🎮

// 📥 Download here:
// ${APP_LINK}`;

// const shareOnWhatsApp = async () => {
//   const message = `🔥 Hey! Try my new game\n\n📥 Download here:\nhttps://drive.google.com/uc?export=download&id=1vY-9jbQaAvqtedlOogSUOQbo2BOzn6gc`;

//   const url = `whatsapp://send?text=${encodeURIComponent(message)}`;

//   try {
//     await Linking.openURL(url); // ✅ direct open (no chooser)
//   } catch (error) {
//     console.log("Error:", error);

//     // fallback
//     Linking.openURL(`https://wa.me/?text=${encodeURIComponent(message)}`);
//   }
// };
// const shareOnFacebook = async () => {
//   try {
//     await Share.open({
//       message: MESSAGE,
//       url: APP_LINK,
//       social: Share.Social.FACEBOOK,
//     });
//   } catch (error) {
//     console.log("Facebook Share Error:", error);
//   }
// };

// const shareMessenger = async () => {
//   try {
//     await Share.open({
//       message: MESSAGE,
//       social: Share.Social.FACEBOOK_MESSENGER,
//     });
//   } catch (error) {
//     console.log("Messenger Error:", error);
//   }
// };
// const shareViaSMS = async () => {
//   try {
//     const smsUrl = `sms:?body=${encodeURIComponent(MESSAGE)}`;
//     await Linking.openURL(smsUrl);
//   } catch (error) {
//     console.log("SMS Error:", error);
//   }
// };
// const { width, height } = Dimensions.get('window');
// const scale = size => (width / 375) * size;
// const scaleFont = size => size * (width / 375);

// const AddUserScreen = () => {
//   const navigation = useNavigation();
//   const isFocused = useIsFocused();
//   const { theme } = useTheme();
//   const { t } = useAppTranslation();

//   const [refreshing, setRefreshing] = useState(false);
//   const [myFriends, setMyFriends] = useState([]);
//   const [displayedUsers, setDisplayedUsers] = useState([]);
//   const [searchText, setSearchText] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [pendingCount, setPendingCount] = useState(0);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchPendingCount();
//     if (searchText.trim() !== '') {
//       fetchSearchedUsers(searchText);
//     } else {
//       fetchMyFriends();
//     }
//     setTimeout(() => {
//       setRefreshing(false);
//     }, 2000);
//   };

//   /* ================= API CALLS ================= */

//   const fetchPendingCount = async () => {
//     try {
//       const token = await AsyncStorage.getItem('accessToken');
//       const response = await axios.get(
//         'http://13.203.232.239:3000/api/friend/friend-request',
//         { headers: { Authorization: `Bearer ${token}` } },
//       );
//       setPendingCount(response.data.total);
//     } catch (error) {
//       console.log('❌ Error fetching pending count:', error.message);
//     }
//   };

//   const fetchMyFriends = async () => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem('accessToken');
//       if (!token) {
//         setLoading(false);
//         return;
//       }
//       const response = await axios.get(
//         'http://13.203.232.239:3000/api/friend/my-friend-list',
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//             Accept: 'application/json',
//           },
//         },
//       );
//       if (response.data.success) {
//         const friendsList = response.data.friends || [];
//         const formattedFriends = friendsList.map(f => ({
//           ...f,
//           friendshipStatus: 'accepted',
//         }));
//         setMyFriends(formattedFriends);
//         if (searchText.trim() === '') {
//           setDisplayedUsers(formattedFriends);
//         }
//       }
//     } catch (error) {
//       console.log('❌ Error fetching friends:', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSearchedUsers = async text => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem('accessToken');
//       const response = await axios.post(
//         'http://13.203.232.239:3000/api/friend/search-user-list',
//         { searchText: text },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         },
//       );
//       if (response.data.success) {
//         setDisplayedUsers(response.data.users);
//       }
//     } catch (error) {
//       console.log('❌ Error searching users:', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= ACTIONS ================= */

//   const handleAddFriend = async recipientId => {
//     try {
//       const token = await AsyncStorage.getItem('accessToken');
//       const user = await AsyncStorage.getItem('userData');
//       if (!token || !user) return;

//       const parsedUser = JSON.parse(user);
//       const requesterId = parsedUser?.id || parsedUser?._id;
//       if (!requesterId || !recipientId) return;

//       const response = await fetch(
//         'http://13.203.232.239:3000/api/friend/add-friend',
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ requester: requesterId, recipient: recipientId }),
//         },
//       );
//       const data = await response.json();

//       if (data.success) {
//         Toast.show({ type: 'success', text1: t('Friend Request Sent') });
//         setDisplayedUsers(prev =>
//           prev.map(u =>
//             u._id === recipientId ? { ...u, friendshipStatus: 'pending' } : u,
//           ),
//         );
//       } else {
//         Toast.show({ type: 'error', text1: t('Request Failed'), text2: data.message });
//       }
//     } catch (error) {
//       console.log('Error sending friend request:', error);
//     }
//   };

//   const handleCancelRequest = async friendId => {
//     try {
//       setDisplayedUsers(prev =>
//         prev.map(u =>
//           u._id === friendId ? { ...u, friendshipStatus: 'none' } : u,
//         ),
//       );
//       const token = await AsyncStorage.getItem('accessToken');
//       const response = await axios.delete(
//         'http://13.203.232.239:3000/api/friend/deleteFriendShipByUser',
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//           data: { friendId },
//         },
//       );
//       if (response.data.success) {
//         Toast.show({ type: 'success', text1: t('Request Cancelled') });
//       } else {
//         Toast.show({ type: 'error', text1: t('Failed to cancel') });
//         fetchSearchedUsers(searchText);
//       }
//     } catch (error) {
//       console.log('❌ Error cancelling request:', error);
//       Toast.show({ type: 'error', text1: t('Error cancelling request') });
//     }
//   };

//   const handleSearch = text => setSearchText(text);

//   useEffect(() => {
//     const delayDebounceFn = setTimeout(() => {
//       if (searchText.trim() === '') {
//         fetchMyFriends();
//       } else {
//         fetchSearchedUsers(searchText);
//       }
//     }, 500);
//     return () => clearTimeout(delayDebounceFn);
//   }, [searchText]);

//   useEffect(() => {
//     if (isFocused) {
//       if (searchText.trim() === '') {
//         fetchMyFriends();
//       } else {
//         fetchSearchedUsers(searchText);
//       }
//       fetchPendingCount();
//     }
//   }, [isFocused]);

//   useEffect(() => {
//     const auth = messaging();
//     const unsubscribe = auth.onMessage(async remoteMessage => {
//       const { data } = remoteMessage;
//       if (!data) return;

//       const userData = await AsyncStorage.getItem('fullLoginResponse');
//       const parsedData = userData ? JSON.parse(userData) : null;
//       const myUserId = parsedData?.player?.id;
//       if (!myUserId) return;

//       const { recipient, type } = data;

//       if (type === 'FRIEND_ACCEPTED' || type === 'FRIEND_REJECTED') {
//         if (searchText.trim() !== '') fetchSearchedUsers(searchText);
//         else fetchMyFriends();
//         fetchPendingCount();
//       }
//       if (type === 'FRIEND_REQUEST' && recipient === myUserId) {
//         fetchPendingCount();
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   /* ================= UI RENDER ================= */

//   const renderItem = ({ item }) => {
//     const status = item.friendshipStatus;

//     const fullName =
//       item.firstName || item.lastName
//         ? `${item.firstName || ''} ${item.lastName || ''}`.trim()
//         : 'null';

//     return (
//       <View
//         style={[
//           styles.friendRow,
//           { backgroundColor: theme.backgroundGradient || '#1E293B' },
//         ]}>
//         <TouchableOpacity
//           style={styles.friendInfo}
//           onPress={() => navigation.navigate('UserProfile', { userId: item._id })}>
//           <Image
//             source={
//               item.profileImage
//                 ? { uri: item.profileImage }
//                 : require('../assets/avater.png')
//             }
//             style={styles.avatar}
//           />

//           <View>
//             <View style={{ flexDirection: 'row' }}>
//               <Text style={[styles.usernameText, { color: theme.subText }]}>
//                 {t('Username:')}{' '}
//               </Text>
//               <Text style={[styles.usernameText1, { color: theme.text }]}>
//                 {item.username}
//               </Text>
//             </View>

//             <View style={{ flexDirection: 'row' }}>
//               <Text style={[styles.nameText, { color: theme.subText }]}>
//                 {t('Name:')}{' '}
//               </Text>
//               <Text style={[styles.usernameText1, { color: theme.text }]}>
//                 {fullName}
//               </Text>
//             </View>

//             {(() => {
//               const pvpStats = item.pr?.find(p => p.mode === 'pvp');
//               const pvpRating = pvpStats?.medium || 'N/A';
//               return (
//                 <View style={{ flexDirection: 'row' }}>
//                   <Text style={[styles.ratingText, { color: theme.subText }]}>
//                     {t('PvP Rating:')}{' '}
//                   </Text>
//                   <Text style={[styles.usernameText1, { color: theme.text }]}>
//                     {pvpRating}
//                   </Text>
//                 </View>
//               );
//             })()}
//           </View>
//         </TouchableOpacity>

//         {/* BUTTON ACTIONS */}
//         {status === 'accepted' ? (
//           <View style={styles.statusButton}>
//             <Text style={[styles.statusText, { color: '#4ADE80' }]}>
//               {t('Friend')}
//             </Text>
//           </View>
//         ) : status === 'pending' ? (
//           <TouchableOpacity
//             style={[
//               styles.addButton,
//               { backgroundColor: theme.secondary || '#64748B' },
//             ]}
//             onPress={() => handleCancelRequest(item._id)}>
//             <Text style={styles.addText}>{t('Pending')}</Text>
//           </TouchableOpacity>
//         ) : (
//           <TouchableOpacity
//             style={[
//               styles.addButton,
//               { backgroundColor: theme.primary || '#17677F' },
//             ]}
//             onPress={() => handleAddFriend(item._id)}>
//             <Text style={styles.addText}>+</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     );
//   };

//   return (
//     <LinearGradient
//       colors={theme.backgroundGradient || ['#0F172A', '#1E293B']}
//       style={{ flex: 1 }}>
//       <View style={{ flex: 1, paddingTop: height * 0.03 }}>
//         <CustomHeader
//           title={t('FRIENDS')}
//           onBack={() => navigation.goBack()}
//           rightIcon={
//             <View style={styles.notificationContainer}>
//               <TouchableOpacity
//                 onPress={() => navigation.navigate('FriendRequestScreen')}>
//                 <Icon
//                   name="notifications-outline"
//                   size={scale(22)}
//                   color={theme.text || '#fff'}
//                 />
//               </TouchableOpacity>
//               <View
//                 style={[
//                   styles.badge,
//                   { backgroundColor: theme.error || '#EF4444' },
//                 ]}>
//                 <Text style={styles.badgeText}>{pendingCount || 0}</Text>
//               </View>
//             </View>
//           }
//         />

//         <View style={[styles.container, { paddingTop: 0 }]}>
//           <View style={{ top: 20, flex: 1 }}>
//             {/* Search bar */}
//             <View
//               style={[
//                 styles.searchContainer,
//                 { backgroundColor: theme.cardBackground || '#1E293B' },
//               ]}>
//               <Icon
//                 name="search"
//                 size={scale(22)}
//                 color={theme.subText || '#94A3B8'}
//               />
//               <TextInput
//                 placeholder={t('Search Contacts')}
//                 placeholderTextColor={theme.subText || '#94A3B8'}
//                 style={[styles.searchInput, { color: theme.text }]}
//                 value={searchText}
//                 onChangeText={handleSearch}
//               />
//             </View>

//             {loading ? (
//               <ActivityIndicator
//                 size="large"
//                 color={theme.primary || '#FB923C'}
//                 style={{ marginTop: height * 0.05 }}
//               />
//             ) : (
//               <>
//                 {searchText.trim() === '' && (
//                   <View
//                     style={[
//                       styles.inviteSection,
//                       { backgroundColor: theme.cardBackground || '#1E293B' },
//                     ]}>
//                     <Text style={[styles.sectionTitle, { color: theme.text }]}>
//                       {t('Invite & Connect')}
//                     </Text>

//                     <TouchableOpacity
//                     onPress={shareOnWhatsApp}
//                       style={[
//                         styles.inviteButton1,
//                         { backgroundColor: '#25D366' },
//                       ]}>
//                       <FontAwesome
//                         name="whatsapp"
//                         size={scale(20)}
//                         color="#fff"
//                         style={styles.iconLeft}
//                       />
//                       <Text style={styles.inviteText}>
//                         {t('Invite Friends via WhatsApp or SMS')}
//                       </Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity onPress={shareOnFacebook}
//                       style={[
//                         styles.inviteButton,
//                         { backgroundColor: theme.cardBackground || '#1E293B' },
//                       ]}>
//                       <View style={styles.fbIconCircle}>
//                         <FontAwesome
//                           name="facebook"
//                           size={scale(22)}
//                           color="#fff"
//                         />
//                       </View>
//                       <Text style={[styles.inviteText, { color: theme.text }]}>
//                         {t('Facebook Friends')}
//                       </Text>
//                     </TouchableOpacity>
//                   </View>
//                 )}

//                 <Text style={[styles.sectionTitle, { color: theme.text }]}>
//                   {searchText.trim() !== ''
//                     ? t('Search Results')
//                     : `${t('My Friends')} (${displayedUsers.length})`}
//                 </Text>

//                 <ScrollView
//                   refreshControl={
//                     <RefreshControl
//                       refreshing={refreshing}
//                       onRefresh={onRefresh}
//                     />
//                   }
//                   showsVerticalScrollIndicator={false}>
//                   <FlatList
//                     data={displayedUsers}
//                     keyExtractor={item => item._id}
//                     renderItem={renderItem}
//                     scrollEnabled={false}
//                     contentContainerStyle={{ paddingBottom: height * 0.1 }}
//                     ListEmptyComponent={
//                       <View style={{ alignItems: 'center', marginTop: 20 }}>
//                         <Text style={{ color: theme.subText }}>
//                           {t('No users found.')}
//                         </Text>
//                       </View>
//                     }
//                   />
//                 </ScrollView>
//               </>
//             )}
//           </View>
//         </View>
//       </View>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: width * 0.04,
//     paddingTop: height * 0.03,
//   },
//   notificationContainer: {
//     position: 'relative',
//   },
//   badge: {
//     position: 'absolute',
//     top: -6,
//     right: -8,
//     borderRadius: 8,
//     paddingHorizontal: 4,
//     minWidth: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   badgeText: {
//     color: '#fff',
//     fontSize: scaleFont(10),
//     fontWeight: '700',
//   },
//   searchContainer: {
//     borderRadius: 8,
//     marginBottom: height * 0.02,
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingStart: '3%',
//   },
//   searchInput: {
//     height: height * 0.055,
//     paddingHorizontal: 12,
//     flex: 1,
//   },
//   inviteSection: {
//     borderRadius: 10,
//     padding: width * 0.03,
//     marginBottom: height * 0.03,
//   },
//   sectionTitle: {
//     fontSize: scaleFont(16),
//     fontWeight: '700',
//     marginBottom: height * 0.015,
//   },
//   inviteButton1: {
//     borderRadius: 8,
//     paddingVertical: height * 0.012,
//     paddingHorizontal: width * 0.03,
//     alignItems: 'center',
//     flexDirection: 'row',
//     marginBottom: height * 0.012,
//   },
//   inviteButton: {
//     borderRadius: 8,
//     paddingVertical: height * 0.012,
//     paddingHorizontal: width * 0.03,
//     alignItems: 'center',
//     flexDirection: 'row',
//   },
//   iconLeft: {
//     marginRight: width * 0.03,
//   },
//   inviteText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: scaleFont(14),
//   },
//   fbIconCircle: {
//     backgroundColor: '#1877F2',
//     width: scale(34),
//     height: scale(34),
//     borderRadius: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: width * 0.03,
//   },
//   friendRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     borderRadius: 8,
//     padding: width * 0.03,
//     marginBottom: height * 0.015,
//   },
//   friendInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   avatar: {
//     width: scale(50),
//     height: scale(50),
//     marginRight: width * 0.03,
//     borderRadius: 10,
//   },
//   addButton: {
//     borderRadius: 6,
//     paddingHorizontal: width * 0.05,
//     paddingVertical: height * 0.006,
//   },
//   statusButton: {
//     borderRadius: 6,
//     paddingHorizontal: width * 0.02,
//     paddingVertical: height * 0.006,
//   },
//   addText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: scaleFont(14),
//   },
//   statusText: {
//     fontWeight: 'bold',
//     fontSize: scaleFont(14),
//   },
//   usernameText: {
//     fontSize: scaleFont(13),
//     fontWeight: '600',
//   },
//   usernameText1: {
//     fontSize: scaleFont(13),
//     fontWeight: 'bold',
//   },
//   nameText: {
//     fontSize: scaleFont(12),
//     marginTop: 2,
//   },
//   ratingText: {
//     fontSize: scaleFont(11),
//     marginTop: 2,
//   },
// });

// export default AddUserScreen;



// BADGE

// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   Image,
//   TouchableOpacity,
//   FlatList,
//   ScrollView,
//   Dimensions,
//   ActivityIndicator,
//   RefreshControl,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useIsFocused, useNavigation } from '@react-navigation/native';
// import Toast from 'react-native-toast-message';
// import messaging from '@react-native-firebase/messaging';
// import LinearGradient from 'react-native-linear-gradient';
// import { useTheme } from '../context/ThemeContext';
// import CustomHeader from '../components/CustomHeader';
// import { useAppTranslation } from '../context/TranslationContext';
// import { useBadge } from '../context/BadgeContext';
// import BadgePopup from './BadgePopup';
// import Share from 'react-native-share';
// import { Linking } from 'react-native';

// const APP_LINK = "https://drive.google.com/uc?export=download&id=1vY-9jbQaAvqtedlOogSUOQbo2BOzn6gc";

// const MESSAGE = `🔥 Hey! Try my new game 🎮\n\n📥 Download here:\n${APP_LINK}`;

// const shareOnWhatsApp = async () => {
//   const message = `🔥 Hey! Try my new game\n\n📥 Download here:\nhttps://drive.google.com/uc?export=download&id=1vY-9jbQaAvqtedlOogSUOQbo2BOzn6gc`;
//   const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
//   try {
//     await Linking.openURL(url);
//   } catch (error) {
//     Linking.openURL(`https://wa.me/?text=${encodeURIComponent(message)}`);
//   }
// };

// const shareOnFacebook = async () => {
//   try {
//     await Share.open({ message: MESSAGE, url: APP_LINK, social: Share.Social.FACEBOOK });
//   } catch (error) {
//     console.log("Facebook Share Error:", error);
//   }
// };

// const shareMessenger = async () => {
//   try {
//     await Share.open({ message: MESSAGE, social: Share.Social.FACEBOOK_MESSENGER });
//   } catch (error) {
//     console.log("Messenger Error:", error);
//   }
// };

// const shareViaSMS = async () => {
//   try {
//     await Linking.openURL(`sms:?body=${encodeURIComponent(MESSAGE)}`);
//   } catch (error) {
//     console.log("SMS Error:", error);
//   }
// };

// const { width, height } = Dimensions.get('window');
// const scale = size => (width / 375) * size;
// const scaleFont = size => size * (width / 375);

// const AddUserScreen = () => {
//   const navigation = useNavigation();
//   const isFocused = useIsFocused();
//   const { theme } = useTheme();
//   const { t } = useAppTranslation();

//   // ✅ Pull all needed badge functions
//   const {
//     earnedBadges,
//     setEarnedBadges,
//     showBadges,
//     snapshotBadgeIds,
//     checkBadgesDiff,
//   } = useBadge();

//   const [refreshing, setRefreshing] = useState(false);
//   const [myFriends, setMyFriends] = useState([]);
//   const [displayedUsers, setDisplayedUsers] = useState([]);
//   const [searchText, setSearchText] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [pendingCount, setPendingCount] = useState(0);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchPendingCount();
//     if (searchText.trim() !== '') {
//       fetchSearchedUsers(searchText);
//     } else {
//       fetchMyFriends();
//     }
//     setTimeout(() => setRefreshing(false), 2000);
//   };

//   /* ================= API CALLS ================= */

//   const fetchPendingCount = async () => {
//     try {
//       const token = await AsyncStorage.getItem('accessToken');
//       const response = await axios.get(
//         'http://13.203.232.239:3000/api/friend/friend-request',
//         { headers: { Authorization: `Bearer ${token}` } },
//       );
//       setPendingCount(response.data.total);
//     } catch (error) {
//       console.log('❌ Error fetching pending count:', error.message);
//     }
//   };

//   const fetchMyFriends = async () => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem('accessToken');
//       if (!token) { setLoading(false); return; }
//       const response = await axios.get(
//         'http://13.203.232.239:3000/api/friend/my-friend-list',
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//             Accept: 'application/json',
//           },
//         },
//       );
//       if (response.data.success) {
//         const friendsList = response.data.friends || [];
//         const formattedFriends = friendsList.map(f => ({
//           ...f,
//           friendshipStatus: 'accepted',
//         }));
//         setMyFriends(formattedFriends);
//         if (searchText.trim() === '') {
//           setDisplayedUsers(formattedFriends);
//         }
//       }
//     } catch (error) {
//       console.log('❌ Error fetching friends:', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSearchedUsers = async text => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem('accessToken');
//       const response = await axios.post(
//         'http://13.203.232.239:3000/api/friend/search-user-list',
//         { searchText: text },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         },
//       );
//       if (response.data.success) {
//         setDisplayedUsers(response.data.users);
//       }
//     } catch (error) {
//       console.log('❌ Error searching users:', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= ACTIONS ================= */

//   const handleAddFriend = async recipientId => {
//     try {
//       const token = await AsyncStorage.getItem('accessToken');
//       const user = await AsyncStorage.getItem('userData');
//       if (!token || !user) return;

//       const parsedUser = JSON.parse(user);
//       const requesterId = parsedUser?.id || parsedUser?._id;
//       if (!requesterId || !recipientId) return;

//       // ✅ Step 1: Snapshot badge IDs BEFORE sending request
//       const prevBadgeIds = await snapshotBadgeIds();
//       console.log('[Badge] 📸 Pre-action snapshot:', prevBadgeIds.size, 'badges');

//       const response = await fetch(
//         'http://13.203.232.239:3000/api/friend/add-friend',
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ requester: requesterId, recipient: recipientId }),
//         },
//       );
//       const data = await response.json();

//       if (data.success) {
//         Toast.show({ type: 'success', text1: t('Friend Request Sent') });
//         setDisplayedUsers(prev =>
//           prev.map(u =>
//             u._id === recipientId ? { ...u, friendshipStatus: 'pending' } : u,
//           ),
//         );

//         // ✅ Step 2: Poll for new badges via diff
//         // checkBadgesDiff handles polling internally with delays
//         try {
//           console.log('[Badge] 📡 Polling for new badges via diff...');
//           await checkBadgesDiff(prevBadgeIds); // polling handles the wait internally
//         } catch (e) {
//           console.log('[Badge] Error during badge diff:', e.message);
//         }
//       } else {
//         Toast.show({ type: 'error', text1: t('Request Failed'), text2: data.message });
//       }
//     } catch (error) {
//       console.log('Error sending friend request:', error);
//     }
//   };

//   const handleCancelRequest = async friendId => {
//     try {
//       setDisplayedUsers(prev =>
//         prev.map(u =>
//           u._id === friendId ? { ...u, friendshipStatus: 'none' } : u,
//         ),
//       );
//       const token = await AsyncStorage.getItem('accessToken');
//       const response = await axios.delete(
//         'http://13.203.232.239:3000/api/friend/deleteFriendShipByUser',
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//           data: { friendId },
//         },
//       );
//       if (response.data.success) {
//         Toast.show({ type: 'success', text1: t('Request Cancelled') });
//       } else {
//         Toast.show({ type: 'error', text1: t('Failed to cancel') });
//         fetchSearchedUsers(searchText);
//       }
//     } catch (error) {
//       console.log('❌ Error cancelling request:', error);
//       Toast.show({ type: 'error', text1: t('Error cancelling request') });
//     }
//   };

//   const handleSearch = text => setSearchText(text);

//   /* ================= EFFECTS ================= */

//   useEffect(() => {
//     const delayDebounceFn = setTimeout(() => {
//       if (searchText.trim() === '') {
//         fetchMyFriends();
//       } else {
//         fetchSearchedUsers(searchText);
//       }
//     }, 500);
//     return () => clearTimeout(delayDebounceFn);
//   }, [searchText]);

//   useEffect(() => {
//     if (isFocused) {
//       if (searchText.trim() === '') {
//         fetchMyFriends();
//       } else {
//         fetchSearchedUsers(searchText);
//       }
//       fetchPendingCount();
//     }
//   }, [isFocused]);

//   useEffect(() => {
//     const unsubscribe = messaging().onMessage(async remoteMessage => {
//       const { data } = remoteMessage;
//       if (!data) return;

//       const userData = await AsyncStorage.getItem('fullLoginResponse');
//       const parsedData = userData ? JSON.parse(userData) : null;
//       const myUserId = parsedData?.player?.id;
//       if (!myUserId) return;

//       const { recipient, type } = data;

//       if (type === 'FRIEND_ACCEPTED' || type === 'FRIEND_REJECTED') {
//         if (searchText.trim() !== '') fetchSearchedUsers(searchText);
//         else fetchMyFriends();
//         fetchPendingCount();

//         // ✅ FIXED: Use showBadges (properly imported) + snapshot diff
//         // When the OTHER user accepts YOUR request → check if YOU earned a badge
//         if (type === 'FRIEND_ACCEPTED') {
//           try {
//             console.log('[Badge] 🔔 My request was accepted! Checking for new badge...');
//             const token = await AsyncStorage.getItem('accessToken');

//             // Take a snapshot of badges right now (before polling)
//             const beforeIds = new Set();
//             const initialRes = await axios.get(
//               'http://13.203.232.239:3000/api/badges/my/earned',
//               { headers: { Authorization: `Bearer ${token}` } }
//             );
//             (initialRes?.data?.badges || []).forEach(b => beforeIds.add(b.badgeId));
//             console.log('[Badge] 📸 Snapshot before polling:', beforeIds.size, 'badges');

//             // Poll up to 5 times for a new badge to appear
//             let newBadge = null;
//             for (let attempt = 1; attempt <= 5; attempt++) {
//               await new Promise(r => setTimeout(r, 800));

//               const badgeRes = await axios.get(
//                 'http://13.203.232.239:3000/api/badges/my/earned',
//                 { headers: { Authorization: `Bearer ${token}` } }
//               );

//               const allBadges = badgeRes?.data?.badges || [];
//               // Find any badge not in our snapshot
//               newBadge = allBadges.find(b => !beforeIds.has(b.badgeId));

//               console.log(`[Badge] 🔄 Poll attempt ${attempt}: ${newBadge ? 'found new badge!' : 'no new badge yet'}`);
//               if (newBadge) break;
//             }

//             if (newBadge) {
//               console.log('[Badge] 🎉 Showing badge popup:', newBadge.title);
//               showBadges([newBadge]); // ✅ correctly imported from useBadge
//             } else {
//               console.log('[Badge] ℹ️ No new badge found after polling');
//             }
//           } catch (e) {
//             console.log('[Badge] Error checking badge on FRIEND_ACCEPTED:', e.message);
//           }
//         }
//       }

//       if (type === 'FRIEND_REQUEST' && recipient === myUserId) {
//         fetchPendingCount();
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   /* ================= UI RENDER ================= */

//   const renderItem = ({ item }) => {
//     const status = item.friendshipStatus;
//     const fullName =
//       item.firstName || item.lastName
//         ? `${item.firstName || ''} ${item.lastName || ''}`.trim()
//         : 'null';

//     return (
//       <View
//         style={[
//           styles.friendRow,
//           { backgroundColor: theme.backgroundGradient || '#1E293B' },
//         ]}>
//         <TouchableOpacity
//           style={styles.friendInfo}
//           onPress={() => navigation.navigate('UserProfile', { userId: item._id })}>
//           <Image
//             source={
//               item.profileImage
//                 ? { uri: item.profileImage }
//                 : require('../assets/avater.png')
//             }
//             style={styles.avatar}
//           />
//           <View>
//             <View style={{ flexDirection: 'row' }}>
//               <Text style={[styles.usernameText, { color: theme.subText }]}>
//                 {t('Username:')}{' '}
//               </Text>
//               <Text style={[styles.usernameText1, { color: theme.text }]}>
//                 {item.username}
//               </Text>
//             </View>
//             <View style={{ flexDirection: 'row' }}>
//               <Text style={[styles.nameText, { color: theme.subText }]}>
//                 {t('Name:')}{' '}
//               </Text>
//               <Text style={[styles.usernameText1, { color: theme.text }]}>
//                 {fullName}
//               </Text>
//             </View>
//             {(() => {
//               const pvpStats = item.pr?.find(p => p.mode === 'pvp');
//               const pvpRating = pvpStats?.medium || 'N/A';
//               return (
//                 <View style={{ flexDirection: 'row' }}>
//                   <Text style={[styles.ratingText, { color: theme.subText }]}>
//                     {t('PvP Rating:')}{' '}
//                   </Text>
//                   <Text style={[styles.usernameText1, { color: theme.text }]}>
//                     {pvpRating}
//                   </Text>
//                 </View>
//               );
//             })()}
//           </View>
//         </TouchableOpacity>

//         {status === 'accepted' ? (
//           <View style={styles.statusButton}>
//             <Text style={[styles.statusText, { color: '#4ADE80' }]}>
//               {t('Friend')}
//             </Text>
//           </View>
//         ) : status === 'pending' ? (
//           <TouchableOpacity
//             style={[styles.addButton, { backgroundColor: theme.secondary || '#64748B' }]}
//             onPress={() => handleCancelRequest(item._id)}>
//             <Text style={styles.addText}>{t('Pending')}</Text>
//           </TouchableOpacity>
//         ) : (
//           <TouchableOpacity
//             style={[styles.addButton, { backgroundColor: theme.primary || '#17677F' }]}
//             onPress={() => handleAddFriend(item._id)}>
//             <Text style={styles.addText}>+</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     );
//   };

//   return (
//     <LinearGradient
//       colors={theme.backgroundGradient || ['#0F172A', '#1E293B']}
//       style={{ flex: 1 }}>
//       <View style={{ flex: 1, paddingTop: height * 0.03 }}>
//         <CustomHeader
//           title={t('FRIENDS')}
//           onBack={() => navigation.goBack()}
//           rightIcon={
//             <View style={styles.notificationContainer}>
//               <TouchableOpacity
//                 onPress={() => navigation.navigate('FriendRequestScreen')}>
//                 <Icon
//                   name="notifications-outline"
//                   size={scale(22)}
//                   color={theme.text || '#fff'}
//                 />
//               </TouchableOpacity>
//               <View
//                 style={[
//                   styles.badge,
//                   { backgroundColor: theme.error || '#EF4444' },
//                 ]}>
//                 <Text style={styles.badgeText}>{pendingCount || 0}</Text>
//               </View>
//             </View>
//           }
//         />

//         <View style={[styles.container, { paddingTop: 0 }]}>
//           <View style={{ top: 20, flex: 1 }}>
//             <View
//               style={[
//                 styles.searchContainer,
//                 { backgroundColor: theme.cardBackground || '#1E293B' },
//               ]}>
//               <Icon
//                 name="search"
//                 size={scale(22)}
//                 color={theme.subText || '#94A3B8'}
//               />
//               <TextInput
//                 placeholder={t('Search Contacts')}
//                 placeholderTextColor={theme.subText || '#94A3B8'}
//                 style={[styles.searchInput, { color: theme.text }]}
//                 value={searchText}
//                 onChangeText={handleSearch}
//               />
//             </View>

//             {loading ? (
//               <ActivityIndicator
//                 size="large"
//                 color={theme.primary || '#FB923C'}
//                 style={{ marginTop: height * 0.05 }}
//               />
//             ) : (
//               <>
//                 {searchText.trim() === '' && (
//                   <View
//                     style={[
//                       styles.inviteSection,
//                       { backgroundColor: theme.cardBackground || '#1E293B' },
//                     ]}>
//                     <Text style={[styles.sectionTitle, { color: theme.text }]}>
//                       {t('Invite & Connect')}
//                     </Text>
//                     <TouchableOpacity
//                       onPress={shareOnWhatsApp}
//                       style={[styles.inviteButton1, { backgroundColor: '#25D366' }]}>
//                       <FontAwesome
//                         name="whatsapp"
//                         size={scale(20)}
//                         color="#fff"
//                         style={styles.iconLeft}
//                       />
//                       <Text style={styles.inviteText}>
//                         {t('Invite Friends via WhatsApp or SMS')}
//                       </Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                       onPress={shareOnFacebook}
//                       style={[
//                         styles.inviteButton,
//                         { backgroundColor: theme.cardBackground || '#1E293B' },
//                       ]}>
//                       <View style={styles.fbIconCircle}>
//                         <FontAwesome name="facebook" size={scale(22)} color="#fff" />
//                       </View>
//                       <Text style={[styles.inviteText, { color: theme.text }]}>
//                         {t('Facebook Friends')}
//                       </Text>
//                     </TouchableOpacity>
//                   </View>
//                 )}

//                 <Text style={[styles.sectionTitle, { color: theme.text }]}>
//                   {searchText.trim() !== ''
//                     ? t('Search Results')
//                     : `${t('My Friends')} (${displayedUsers.length})`}
//                 </Text>

//                 <ScrollView
//                   refreshControl={
//                     <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//                   }
//                   showsVerticalScrollIndicator={false}>
//                   <FlatList
//                     data={displayedUsers}
//                     keyExtractor={item => item._id}
//                     renderItem={renderItem}
//                     scrollEnabled={false}
//                     contentContainerStyle={{ paddingBottom: height * 0.1 }}
//                     ListEmptyComponent={
//                       <View style={{ alignItems: 'center', marginTop: 20 }}>
//                         <Text style={{ color: theme.subText }}>
//                           {t('No users found.')}
//                         </Text>
//                       </View>
//                     }
//                   />
//                 </ScrollView>
//               </>
//             )}
//           </View>
//         </View>
//       </View>

//       {/* ✅ Badge Popup */}
//       {earnedBadges.length > 0 && (
//         <BadgePopup
//           badges={earnedBadges}
//           onFinish={() => setEarnedBadges([])}
//         />
//       )}
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: width * 0.04,
//     paddingTop: height * 0.03,
//   },
//   notificationContainer: {
//     position: 'relative',
//   },
//   badge: {
//     position: 'absolute',
//     top: -6,
//     right: -8,
//     borderRadius: 8,
//     paddingHorizontal: 4,
//     minWidth: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   badgeText: {
//     color: '#fff',
//     fontSize: scaleFont(10),
//     fontWeight: '700',
//   },
//   searchContainer: {
//     borderRadius: 8,
//     marginBottom: height * 0.02,
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingStart: '3%',
//   },
//   searchInput: {
//     height: height * 0.055,
//     paddingHorizontal: 12,
//     flex: 1,
//   },
//   inviteSection: {
//     borderRadius: 10,
//     padding: width * 0.03,
//     marginBottom: height * 0.03,
//   },
//   sectionTitle: {
//     fontSize: scaleFont(16),
//     fontWeight: '700',
//     marginBottom: height * 0.015,
//   },
//   inviteButton1: {
//     borderRadius: 8,
//     paddingVertical: height * 0.012,
//     paddingHorizontal: width * 0.03,
//     alignItems: 'center',
//     flexDirection: 'row',
//     marginBottom: height * 0.012,
//   },
//   inviteButton: {
//     borderRadius: 8,
//     paddingVertical: height * 0.012,
//     paddingHorizontal: width * 0.03,
//     alignItems: 'center',
//     flexDirection: 'row',
//   },
//   iconLeft: {
//     marginRight: width * 0.03,
//   },
//   inviteText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: scaleFont(14),
//   },
//   fbIconCircle: {
//     backgroundColor: '#1877F2',
//     width: scale(34),
//     height: scale(34),
//     borderRadius: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: width * 0.03,
//   },
//   friendRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     borderRadius: 8,
//     padding: width * 0.03,
//     marginBottom: height * 0.015,
//   },
//   friendInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   avatar: {
//     width: scale(50),
//     height: scale(50),
//     marginRight: width * 0.03,
//     borderRadius: 10,
//   },
//   addButton: {
//     borderRadius: 6,
//     paddingHorizontal: width * 0.05,
//     paddingVertical: height * 0.006,
//   },
//   statusButton: {
//     borderRadius: 6,
//     paddingHorizontal: width * 0.02,
//     paddingVertical: height * 0.006,
//   },
//   addText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: scaleFont(14),
//   },
//   statusText: {
//     fontWeight: 'bold',
//     fontSize: scaleFont(14),
//   },
//   usernameText: {
//     fontSize: scaleFont(13),
//     fontWeight: '600',
//   },
//   usernameText1: {
//     fontSize: scaleFont(13),
//     fontWeight: 'bold',
//   },
//   nameText: {
//     fontSize: scaleFont(12),
//     marginTop: 2,
//   },
//   ratingText: {
//     fontSize: scaleFont(11),
//     marginTop: 2,
//   },
// });

// export default AddUserScreen;


import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import messaging from '@react-native-firebase/messaging';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import CustomHeader from '../components/CustomHeader';
import { useAppTranslation } from '../context/TranslationContext';
import { useBadge } from '../context/BadgeContext';
import BadgePopup from './BadgePopup';
import Share from 'react-native-share';
import { Linking } from 'react-native';
import { authFetch as fetch } from '../utils/authFetch'; // auto-refresh wrapper for expired access tokens

const APP_LINK = "https://drive.google.com/uc?export=download&id=1vY-9jbQaAvqtedlOogSUOQbo2BOzn6gc";

const MESSAGE = `🔥 Hey! Try my new game 🎮\n\n📥 Download here:\n${APP_LINK}`;

const shareOnWhatsApp = async () => {
  const message = `🔥 Hey! Try my new game\n\n📥 Download here:\nhttps://drive.google.com/uc?export=download&id=1vY-9jbQaAvqtedlOogSUOQbo2BOzn6gc`;
  const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
  try {
    await Linking.openURL(url);
  } catch (error) {
    Linking.openURL(`https://wa.me/?text=${encodeURIComponent(message)}`);
  }
};

const shareOnFacebook = async () => {
  try {
    await Share.open({ message: MESSAGE, url: APP_LINK, social: Share.Social.FACEBOOK });
  } catch (error) {
    console.log("Facebook Share Error:", error);
  }
};

const shareMessenger = async () => {
  try {
    await Share.open({ message: MESSAGE, social: Share.Social.FACEBOOK_MESSENGER });
  } catch (error) {
    console.log("Messenger Error:", error);
  }
};

const shareViaSMS = async () => {
  try {
    await Linking.openURL(`sms:?body=${encodeURIComponent(MESSAGE)}`);
  } catch (error) {
    console.log("SMS Error:", error);
  }
};

const { width, height } = Dimensions.get('window');
const scale = size => (width / 375) * size;
const scaleFont = size => size * (width / 375);

const AddUserScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { theme } = useTheme();
  const { t } = useAppTranslation();

  const {
    earnedBadges,
    setEarnedBadges,
    showBadges,
  } = useBadge();

  const [refreshing, setRefreshing] = useState(false);
  const [myFriends, setMyFriends] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPendingCount();
    if (searchText.trim() !== '') {
      fetchSearchedUsers(searchText);
    } else {
      fetchMyFriends();
    }
    setTimeout(() => setRefreshing(false), 2000);
  };

  /* ================= API CALLS ================= */

  const fetchPendingCount = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.get(
        'http://13.203.232.239:3000/api/friend/friend-request',
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setPendingCount(response.data.total);
    } catch (error) {
      console.log('❌ Error fetching pending count:', error.message);
    }
  };

  const fetchMyFriends = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) { setLoading(false); return; }
      const response = await axios.get(
        'http://13.203.232.239:3000/api/friend/my-friend-list',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );
      if (response.data.success) {
        const friendsList = response.data.friends || [];
        const formattedFriends = friendsList.map(f => ({
          ...f,
          friendshipStatus: 'accepted',
        }));
        setMyFriends(formattedFriends);
        if (searchText.trim() === '') {
          setDisplayedUsers(formattedFriends);
        }
      }
    } catch (error) {
      console.log('❌ Error fetching friends:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchedUsers = async text => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.post(
        'http://13.203.232.239:3000/api/friend/search-user-list',
        { searchText: text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      if (response.data.success) {
        setDisplayedUsers(response.data.users);
      }
    } catch (error) {
      console.log('❌ Error searching users:', error.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= ACTIONS ================= */

  const handleAddFriend = async recipientId => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const user = await AsyncStorage.getItem('userData');
      if (!token || !user) return;

      const parsedUser = JSON.parse(user);
      const requesterId = parsedUser?.id || parsedUser?._id;
      if (!requesterId || !recipientId) return;

      // ✅ NO badge check here — badge is only earned when the OTHER user ACCEPTS,
      // which arrives via FCM FRIEND_ACCEPTED. Checking here causes wrong badges to show.

      const response = await fetch(
        'http://13.203.232.239:3000/api/friend/add-friend',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ requester: requesterId, recipient: recipientId }),
        },
      );
      const data = await response.json();

      if (data.success) {
        Toast.show({ type: 'success', text1: t('Friend Request Sent') });
        setDisplayedUsers(prev =>
          prev.map(u =>
            u._id === recipientId ? { ...u, friendshipStatus: 'pending' } : u,
          ),
        );
      } else {
        Toast.show({ type: 'error', text1: t('Request Failed'), text2: data.message });
      }
    } catch (error) {
      console.log('Error sending friend request:', error);
    }
  };

  const handleCancelRequest = async friendId => {
    try {
      setDisplayedUsers(prev =>
        prev.map(u =>
          u._id === friendId ? { ...u, friendshipStatus: 'none' } : u,
        ),
      );
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.delete(
        'http://13.203.232.239:3000/api/friend/deleteFriendShipByUser',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          data: { friendId },
        },
      );
      if (response.data.success) {
        Toast.show({ type: 'success', text1: t('Request Cancelled') });
      } else {
        Toast.show({ type: 'error', text1: t('Failed to cancel') });
        fetchSearchedUsers(searchText);
      }
    } catch (error) {
      console.log('❌ Error cancelling request:', error);
      Toast.show({ type: 'error', text1: t('Error cancelling request') });
    }
  };

  const handleSearch = text => setSearchText(text);

  /* ================= EFFECTS ================= */

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchText.trim() === '') {
        fetchMyFriends();
      } else {
        fetchSearchedUsers(searchText);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchText]);

  useEffect(() => {
    if (isFocused) {
      if (searchText.trim() === '') {
        fetchMyFriends();
      } else {
        fetchSearchedUsers(searchText);
      }
      fetchPendingCount();
    }
  }, [isFocused]);

  // ✅ FIX: added showBadges to dep array to avoid stale closure
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const { data } = remoteMessage;
      if (!data) return;

      const userData = await AsyncStorage.getItem('fullLoginResponse');
      const parsedData = userData ? JSON.parse(userData) : null;
      const myUserId = parsedData?.player?.id;
      if (!myUserId) return;

      const { recipient, type } = data;

      if (type === 'FRIEND_ACCEPTED' || type === 'FRIEND_REJECTED') {
        // Refresh lists immediately
        if (searchText.trim() !== '') fetchSearchedUsers(searchText);
        else fetchMyFriends();
        fetchPendingCount();

        if (type === 'FRIEND_ACCEPTED') {
          // ✅ Show the toast FIRST so user sees "Friend Accepted" clearly
          Toast.show({ type: 'success', text1: t('Friend request accepted!') });

          // ✅ Wait 1.5s (toast is visible), THEN poll for the badge
          // This prevents the badge popup from competing with the toast visually
          setTimeout(async () => {
            try {
              console.log('[Badge] 🔔 Request accepted — checking for new badge after toast...');
              const token = await AsyncStorage.getItem('accessToken');
              if (!token) return;

              // Snapshot current badges BEFORE polling
              const beforeIds = new Set();
              const initialRes = await axios.get(
                'http://13.203.232.239:3000/api/badges/my/earned',
                { headers: { Authorization: `Bearer ${token}` } }
              );
              (initialRes?.data?.badges || []).forEach(b => beforeIds.add(b.badgeId));
              console.log('[Badge] 📸 Snapshot before polling:', beforeIds.size, 'badge(s)');

              // Poll up to 5 times for a newly earned badge
              let newBadge = null;
              for (let attempt = 1; attempt <= 5; attempt++) {
                await new Promise(r => setTimeout(r, 800));

                const badgeRes = await axios.get(
                  'http://13.203.232.239:3000/api/badges/my/earned',
                  { headers: { Authorization: `Bearer ${token}` } }
                );

                const allBadges = badgeRes?.data?.badges || [];
                newBadge = allBadges.find(b => !beforeIds.has(b.badgeId));

                console.log(`[Badge] 🔄 Poll attempt ${attempt}: ${newBadge ? 'found — ' + newBadge.title : 'not yet'}`);
                if (newBadge) break;
              }

              if (newBadge) {
                console.log('[Badge] 🎉 Showing badge popup:', newBadge.title);
                showBadges([newBadge]);
              } else {
                console.log('[Badge] ℹ️ No new badge found after polling');
              }
            } catch (e) {
              console.log('[Badge] Error checking badge on FRIEND_ACCEPTED:', e.message);
            }
          }, 1500); // ← 1.5s delay so toast renders first
        }
      }

      if (type === 'FRIEND_REQUEST' && recipient === myUserId) {
        fetchPendingCount();
      }
    });
    return () => unsubscribe();
  }, [showBadges]); // ✅ FIX: showBadges in deps prevents stale closure

  /* ================= UI RENDER ================= */

  const renderItem = ({ item }) => {
    const status = item.friendshipStatus;
    const fullName =
      item.firstName || item.lastName
        ? `${item.firstName || ''} ${item.lastName || ''}`.trim()
        : 'null';

    return (
      <View
        style={[
          styles.friendRow,
          { backgroundColor: theme.backgroundGradient || '#1E293B' },
        ]}>
        <TouchableOpacity
          style={styles.friendInfo}
          onPress={() => navigation.navigate('UserProfile', { userId: item._id })}>
          <Image
            source={
              item.profileImage
                ? { uri: item.profileImage }
                : require('../assets/avater.png')
            }
            style={styles.avatar}
          />
          <View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.usernameText, { color: theme.subText }]}>
                {t('Username:')}{' '}
              </Text>
              <Text style={[styles.usernameText1, { color: theme.text }]}>
                {item.username}
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.nameText, { color: theme.subText }]}>
                {t('Name:')}{' '}
              </Text>
              <Text style={[styles.usernameText1, { color: theme.text }]}>
                {fullName}
              </Text>
            </View>
            {(() => {
              const pvpStats = item.pr?.find(p => p.mode === 'pvp');
              const pvpRating = pvpStats?.medium || 'N/A';
              return (
                <View style={{ flexDirection: 'row' }}>
                  <Text style={[styles.ratingText, { color: theme.subText }]}>
                    {t('PvP Rating:')}{' '}
                  </Text>
                  <Text style={[styles.usernameText1, { color: theme.text }]}>
                    {pvpRating}
                  </Text>
                </View>
              );
            })()}
          </View>
        </TouchableOpacity>

        {status === 'accepted' ? (
          <View style={styles.statusButton}>
            <Text style={[styles.statusText, { color: '#4ADE80' }]}>
              {t('Friend')}
            </Text>
          </View>
        ) : status === 'pending' ? (
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.secondary || '#64748B' }]}
            onPress={() => handleCancelRequest(item._id)}>
            <Text style={styles.addText}>{t('Pending')}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.primary || '#17677F' }]}
            onPress={() => handleAddFriend(item._id)}>
            <Text style={styles.addText}>+</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <LinearGradient
      colors={theme.backgroundGradient || ['#0F172A', '#1E293B']}
      style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingTop: height * 0.03 }}>
        <CustomHeader
          title={t('FRIENDS')}
          onBack={() => navigation.goBack()}
          rightIcon={
            <View style={styles.notificationContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate('FriendRequestScreen')}>
                <Icon
                  name="notifications-outline"
                  size={scale(22)}
                  color={theme.text || '#fff'}
                />
              </TouchableOpacity>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: theme.error || '#EF4444' },
                ]}>
                <Text style={styles.badgeText}>{pendingCount || 0}</Text>
              </View>
            </View>
          }
        />

        <View style={[styles.container, { paddingTop: 0 }]}>
          <View style={{ top: 20, flex: 1 }}>
            <View
              style={[
                styles.searchContainer,
                { backgroundColor: theme.cardBackground || '#1E293B' },
              ]}>
              <Icon
                name="search"
                size={scale(22)}
                color={theme.subText || '#94A3B8'}
              />
              <TextInput
                placeholder={t('Search Contacts')}
                placeholderTextColor={theme.subText || '#94A3B8'}
                style={[styles.searchInput, { color: theme.text }]}
                value={searchText}
                onChangeText={handleSearch}
              />
            </View>

            {loading ? (
              <ActivityIndicator
                size="large"
                color={theme.primary || '#FB923C'}
                style={{ marginTop: height * 0.05 }}
              />
            ) : (
              <>
                {searchText.trim() === '' && (
                  <View
                    style={[
                      styles.inviteSection,
                      { backgroundColor: theme.cardBackground || '#1E293B' },
                    ]}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>
                      {t('Invite & Connect')}
                    </Text>
                    <TouchableOpacity
                      onPress={shareOnWhatsApp}
                      style={[styles.inviteButton1, { backgroundColor: '#25D366' }]}>
                      <FontAwesome
                        name="whatsapp"
                        size={scale(20)}
                        color="#fff"
                        style={styles.iconLeft}
                      />
                      <Text style={styles.inviteText}>
                        {t('Invite Friends via WhatsApp or SMS')}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={shareOnFacebook}
                      style={[
                        styles.inviteButton,
                        { backgroundColor: theme.cardBackground || '#1E293B' },
                      ]}>
                      <View style={styles.fbIconCircle}>
                        <FontAwesome name="facebook" size={scale(22)} color="#fff" />
                      </View>
                      <Text style={[styles.inviteText, { color: theme.text }]}>
                        {t('Facebook Friends')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  {searchText.trim() !== ''
                    ? t('Search Results')
                    : `${t('My Friends')} (${displayedUsers.length})`}
                </Text>

                <ScrollView
                  refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                  }
                  showsVerticalScrollIndicator={false}>
                  <FlatList
                    data={displayedUsers}
                    keyExtractor={item => item._id}
                    renderItem={renderItem}
                    scrollEnabled={false}
                    contentContainerStyle={{ paddingBottom: height * 0.1 }}
                    ListEmptyComponent={
                      <View style={{ alignItems: 'center', marginTop: 20 }}>
                        <Text style={{ color: theme.subText }}>
                          {t('No users found.')}
                        </Text>
                      </View>
                    }
                  />
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </View>

      {/* ✅ Badge Popup */}
      {earnedBadges.length > 0 && (
        <BadgePopup
          badges={earnedBadges}
          onFinish={() => setEarnedBadges([])}
        />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.04,
    paddingTop: height * 0.03,
  },
  notificationContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    borderRadius: 8,
    paddingHorizontal: 4,
    minWidth: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: scaleFont(10),
    fontWeight: '700',
  },
  searchContainer: {
    borderRadius: 8,
    marginBottom: height * 0.02,
    flexDirection: 'row',
    alignItems: 'center',
    paddingStart: '3%',
  },
  searchInput: {
    height: height * 0.055,
    paddingHorizontal: 12,
    flex: 1,
  },
  inviteSection: {
    borderRadius: 10,
    padding: width * 0.03,
    marginBottom: height * 0.03,
  },
  sectionTitle: {
    fontSize: scaleFont(16),
    fontWeight: '700',
    marginBottom: height * 0.015,
  },
  inviteButton1: {
    borderRadius: 8,
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.03,
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: height * 0.012,
  },
  inviteButton: {
    borderRadius: 8,
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.03,
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconLeft: {
    marginRight: width * 0.03,
  },
  inviteText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: scaleFont(14),
  },
  fbIconCircle: {
    backgroundColor: '#1877F2',
    width: scale(34),
    height: scale(34),
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: width * 0.03,
  },
  friendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    padding: width * 0.03,
    marginBottom: height * 0.015,
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: scale(50),
    height: scale(50),
    marginRight: width * 0.03,
    borderRadius: 10,
  },
  addButton: {
    borderRadius: 6,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.006,
  },
  statusButton: {
    borderRadius: 6,
    paddingHorizontal: width * 0.02,
    paddingVertical: height * 0.006,
  },
  addText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: scaleFont(14),
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: scaleFont(14),
  },
  usernameText: {
    fontSize: scaleFont(13),
    fontWeight: '600',
  },
  usernameText1: {
    fontSize: scaleFont(13),
    fontWeight: 'bold',
  },
  nameText: {
    fontSize: scaleFont(12),
    marginTop: 2,
  },
  ratingText: {
    fontSize: scaleFont(11),
    marginTop: 2,
  },
});

export default AddUserScreen;