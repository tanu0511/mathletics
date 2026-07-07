// // import React, { useState, useEffect } from 'react';
// // import {
// //   View,
// //   Text,
// //   TextInput,
// //   TouchableOpacity,
// //   FlatList,
// //   StyleSheet,
// //   ActivityIndicator,
// //   StatusBar,
// //   Alert,
// //   Dimensions,
// // } from 'react-native';
// // import LinearGradient from 'react-native-linear-gradient';
// // import { useNavigation, useRoute } from '@react-navigation/native';
// // import { useTheme } from '../context/ThemeContext';
// // import Icon from 'react-native-vector-icons/Ionicons';
// // import { useSafeAreaInsets } from 'react-native-safe-area-context';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import { useSocket } from '../context/Socket';
// // import CustomHeader from '../components/CustomHeader';

// // const { width } = Dimensions.get('window');

// // export default function ChallengeFriends() {
// //   const navigation = useNavigation();
// //   const route = useRoute();
// //   const { theme } = useTheme();
// //   const insets = useSafeAreaInsets();

// //   const { gameConfig } = route.params || {};

// //   const [users, setUsers] = useState([]);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [loading, setLoading] = useState(true);
// //   const [selectedUser, setSelectedUser] = useState(null);
// //   const socket = useSocket()

// //   useEffect(() => {
// //     fetchUsers();
// //   }, []);
// //   useEffect(() => {
// //     if (!socket) return;

// //     const onChallengeSuccess = data => {
// //       console.log('✅ Challenge sent successfully:', data);
// //     };

// //     const onChallengeError = err => {
// //       console.error('❌ Challenge error:', err);
// //       Alert.alert('Challenge Failed', err.message || 'Something went wrong');
// //     };

// //     socket.on('challenge-sent-success', onChallengeSuccess);
// //     socket.on('challenge-error', onChallengeError);

// //     return () => {
// //       socket.off('challenge-sent-success', onChallengeSuccess);
// //       socket.off('challenge-error', onChallengeError);
// //     };
// //   }, [socket]);

// //   const fetchUsers = async () => {
// //     try {
// //       // Get token from AsyncStorage
// //       const token = await AsyncStorage.getItem('accessToken');

// //       if (!token) {
// //         Alert.alert('Error', 'Please login first');
// //         setLoading(false);
// //         return;
// //       }

// //       const response = await fetch(
// //         'https://mataletics-backend.onrender.com/api/friend/my-friend-list',
// //         {
// //           method: 'GET',
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //             'Content-Type': 'application/json',
// //           },
// //         },
// //       );

// //       const data = await response.json();
// //       console.log(data);

// //       if (data.success) {
// //         setUsers(data.friends);
// //       } else {
// //         Alert.alert('Error', data.message || 'Failed to fetch users');
// //       }
// //       setLoading(false);
// //     } catch (error) {
// //       console.error('Error fetching users:', error);
// //       Alert.alert('Error', 'Failed to connect to server');
// //       setLoading(false);
// //     }
// //   };

// //   const filteredUsers = users.filter(
// //     user =>
// //       user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
// //   );

// //   const handleSendChallenge = async () => {
// //     if (!selectedUser) {
// //       Alert.alert('No Player Selected', 'Please select a player to challenge!');
// //       return;
// //     }

// //     if (!socket?.connected) {
// //       Alert.alert('Error', 'Socket not connected');
// //       return;
// //     }

// //     // ✅ BUILD CHALLENGE PAYLOAD
// //     const challengePayload = {
// //       userId: selectedUser._id,
// //       username: selectedUser.username,
// //       diff: gameConfig?.difficulty,
// //       timer: gameConfig?.timer,
// //       symbol: gameConfig?.symbol,
// //     };

// //     console.log('📤 Sending challenge:', challengePayload);

// //     // ✅ SEND SOCKET EVENT
// //     socket.emit('send-challenge', challengePayload);

// //     // ✅ Navigate to waiting screen (don't show alert first)
// //     navigation.navigate('WaitingForOpponent', {
// //       challengedUser: selectedUser,
// //       diff: gameConfig?.difficulty,
// //       timer: gameConfig?.timer,
// //       symbol: gameConfig?.symbol,
// //     });
// //   };



// //   const getStatusColor = status => {
// //     switch (status) {
// //       case 'accepted':
// //         return '#4ade80';
// //       case 'pending':
// //         return '#facc15';
// //       case 'rejected':
// //         return '#ef4444';
// //       case 'blocked':
// //         return '#9ca3af';
// //       default:
// //         return '#60a5fa';
// //     }
// //   };

// //   const getStatusText = status => {
// //     switch (status) {
// //       case 'accepted':
// //         return 'Friend';
// //       case 'pending':
// //         return 'Pending';
// //       case 'rejected':
// //         return 'Rejected';
// //       case 'blocked':
// //         return 'Blocked';
// //       default:
// //         return 'Add Friend';
// //     }
// //   };

// //   const renderUserItem = ({ item }) => {
// //     const isSelected = selectedUser?._id === item._id;
// //     const statusColor = getStatusColor(item.friendshipStatus);
// //     const statusText = getStatusText(item.friendshipStatus);

// //     return (
// //       <TouchableOpacity
// //         onPress={() => setSelectedUser(isSelected ? null : item)}
// //         style={[styles.userCard, isSelected && styles.userCardSelected]}
// //         activeOpacity={0.7}>
// //         <View style={styles.userLeft}>
// //           <View style={styles.avatar}>
// //             <Text style={styles.avatarText}>
// //               {item.username ? item.username.charAt(0).toUpperCase() : '?'}
// //             </Text>
// //           </View>
// //           <View style={styles.userInfo}>
// //             <Text style={styles.userName}>{item.username}</Text>
// //             <Text style={styles.userEmail}>{item.email}</Text>
// //             {item.country && (
// //               <Text style={styles.userCountry}>🌍 {item.country}</Text>
// //             )}
// //           </View>
// //         </View>

// //         <View style={styles.userRight}>
// //           <View style={styles.statsContainer}>
// //             <View
// //               style={[
// //                 styles.statusBadge,
// //                 { backgroundColor: statusColor + '20' },
// //               ]}>
// //               <View
// //                 style={[styles.statusDot, { backgroundColor: statusColor }]}
// //               />
// //               <Text style={[styles.statusText, { color: statusColor }]}>
// //                 {statusText}
// //               </Text>
// //             </View>
// //           </View>

// //           {isSelected && (
// //             <View style={styles.selectedBadge}>
// //               <Text style={styles.selectedBadgeText}>⚡</Text>
// //             </View>
// //           )}
// //         </View>
// //       </TouchableOpacity>
// //     );
// //   };

// //   const Wrapper = theme.backgroundGradient ? LinearGradient : View;
// //   const wrapperProps = theme.backgroundGradient
// //     ? { colors: theme.backgroundGradient }
// //     : { style: { backgroundColor: theme.background || '#0B1220' } };

// //   return (
// //     <Wrapper style={styles.container} {...wrapperProps}>
// //       {/* Header */}
// //       <CustomHeader
// //         title="Challenge Friends"
// //         onBack={() => navigation.goBack()}
// //         style={{ marginTop: insets.top + 20 }}
// //       />

// //       {/* Search Box */}
// //       <View style={styles.searchContainer}>
// //         <Icon
// //           name="search-outline"
// //           size={20}
// //           color="#9ca3af"
// //           style={styles.searchIcon}
// //         />
// //         <TextInput
// //           style={styles.searchInput}
// //           placeholder="Search by username or email..."
// //           placeholderTextColor="#9ca3af"
// //           value={searchTerm}
// //           onChangeText={setSearchTerm}
// //         />
// //       </View>

// //       {/* Users List */}
// //       <View style={styles.listContainer}>
// //         {loading ? (
// //           <View style={styles.loadingContainer}>
// //             <ActivityIndicator size="large" color="#f8630dff" />
// //             <Text style={styles.loadingText}>Loading players...</Text>
// //           </View>
// //         ) : filteredUsers.length === 0 ? (
// //           <View style={styles.emptyContainer}>
// //             <Text style={styles.emptyText}>
// //               {searchTerm ? 'No players found' : 'No players available'}
// //             </Text>
// //           </View>
// //         ) : (
// //           <FlatList
// //             data={filteredUsers}
// //             renderItem={renderUserItem}
// //             keyExtractor={item => item._id}
// //             contentContainerStyle={styles.listContent}
// //             showsVerticalScrollIndicator={false}
// //           />
// //         )}
// //       </View>

// //       {/* Challenge Button */}
// //       {selectedUser && (
// //         <View style={styles.buttonContainer}>
// //           <TouchableOpacity onPress={handleSendChallenge} activeOpacity={0.8}>
// //             <LinearGradient
// //               colors={['#f8630dff', '#fb8a08ff']}
// //               style={styles.challengeButton}
// //               start={{ x: 0, y: 0 }}
// //               end={{ x: 1, y: 0 }}>
// //               <Text style={styles.challengeButtonText}>
// //                 ⚡ Send Challenge to {selectedUser.username} ⚡
// //               </Text>
// //             </LinearGradient>
// //           </TouchableOpacity>
// //         </View>
// //       )}
// //     </Wrapper>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //   },
// //   // Header styles removed as CustomHeader is used
// //   searchContainer: {
// //     marginHorizontal: 20,
// //     marginBottom: 20,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(255, 255, 255, 0.1)',
// //     borderRadius: 12,
// //     borderWidth: 1,
// //     borderColor: 'rgba(255, 255, 255, 0.2)',
// //     paddingHorizontal: 16,
// //   },
// //   searchIcon: {
// //     marginRight: 8,
// //   },
// //   searchInput: {
// //     flex: 1,
// //     color: '#fff',
// //     fontSize: 16,
// //     paddingVertical: 14,
// //   },
// //   listContainer: {
// //     flex: 1,
// //     marginHorizontal: 20,
// //   },
// //   listContent: {
// //     paddingBottom: 20,
// //   },
// //   loadingContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     paddingVertical: 60,
// //   },
// //   loadingText: {
// //     color: '#fff',
// //     fontSize: 16,
// //     marginTop: 16,
// //   },
// //   emptyContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     paddingVertical: 60,
// //   },
// //   emptyText: {
// //     color: '#d1d5db',
// //     fontSize: 18,
// //   },
// //   userCard: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(255, 255, 255, 0.05)',
// //     borderRadius: 12,
// //     padding: 16,
// //     marginBottom: 12,
// //     borderWidth: 1,
// //     borderColor: 'rgba(255, 255, 255, 0.1)',
// //   },
// //   userCardSelected: {
// //     backgroundColor: 'rgba(248, 99, 13, 0.2)',
// //     borderColor: '#f8630dff',
// //     borderWidth: 2,
// //   },
// //   userLeft: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     flex: 1,
// //   },
// //   avatar: {
// //     width: 56,
// //     height: 56,
// //     borderRadius: 28,
// //     backgroundColor: '#f8630dff',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: 16,
// //   },
// //   avatarText: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //     color: '#fff',
// //   },
// //   userInfo: {
// //     flex: 1,
// //   },
// //   userName: {
// //     color: '#fff',
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //   },
// //   userEmail: {
// //     color: '#d1d5db',
// //     fontSize: 13,
// //     marginTop: 2,
// //   },
// //   userCountry: {
// //     color: '#9ca3af',
// //     fontSize: 12,
// //     marginTop: 4,
// //   },
// //   userRight: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 12,
// //   },
// //   statsContainer: {
// //     alignItems: 'flex-end',
// //   },
// //   statusBadge: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingHorizontal: 10,
// //     paddingVertical: 6,
// //     borderRadius: 12,
// //   },
// //   statusDot: {
// //     width: 8,
// //     height: 8,
// //     borderRadius: 4,
// //     marginRight: 6,
// //   },
// //   statusText: {
// //     fontSize: 12,
// //     fontWeight: '600',
// //   },
// //   selectedBadge: {
// //     width: 32,
// //     height: 32,
// //     borderRadius: 16,
// //     backgroundColor: '#f8630dff',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   selectedBadgeText: {
// //     fontSize: 18,
// //   },
// //   buttonContainer: {
// //     paddingHorizontal: 20,
// //     paddingBottom: 20,
// //   },
// //   challengeButton: {
// //     paddingVertical: 18,
// //     borderRadius: 12,
// //     alignItems: 'center',
// //     shadowColor: '#f8630dff',
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.5,
// //     shadowRadius: 8,
// //     elevation: 8,
// //   },
// //   challengeButtonText: {
// //     color: '#fff',
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //   },
// // });


// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   ActivityIndicator,
//   StatusBar,
//   Alert,
//   Dimensions,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { useTheme } from '../context/ThemeContext';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useSocket } from '../context/Socket';
// import CustomHeader from '../components/CustomHeader';
// import { useAppTranslation } from '../context/TranslationContext';
// import { authFetch as fetch } from '../utils/authFetch'; // auto-refresh wrapper for expired access tokens

// const { width } = Dimensions.get('window');

// export default function ChallengeFriends() {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { theme } = useTheme();
//   const insets = useSafeAreaInsets();
//   const { t } = useAppTranslation();

//   const { gameConfig } = route.params || {};

//   const [users, setUsers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [sending, setSending] = useState(false);
//   const socket = useSocket();

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   useEffect(() => {
//   if (!socket) return;

//   // ✅ remove old listeners FIRST
//   socket.off('challenge-sent-success');
//   socket.off('challenge-error');

//   const onChallengeSuccess = data => {
//   console.log('✅ Challenge sent successfully:', data);
//   setSending(false); // 🔥 IMPORTANT
// };

//   const onChallengeError = err => {
//     // console.error('❌ Challenge error:', err);
//     // Alert.alert('Error', err.message || 'Something went wrong');
//     setSending(false); // 🔥 reset sending
//   };

//   socket.on('challenge-sent-success', onChallengeSuccess);
//   socket.on('challenge-error', onChallengeError);

//   return () => {
//     socket.off('challenge-sent-success');
//     socket.off('challenge-error');
//   };
// }, [socket]);
//   const fetchUsers = async () => {
//     try {
//       const token = await AsyncStorage.getItem('accessToken');

//       if (!token) {
//         Alert.alert(t('Error'), t('Please wait while we load your content.'));
//         setLoading(false);
//         return;
//       }

//       const response = await fetch(
//         'http://13.203.232.239:3000/api/friend/my-friend-list',
//         {
//           method:'GET',
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         },
//       );

//       const data = await response.json();
//       console.log(data);

//       if (data.success) {
//         setUsers(data.friends);
//       } else {
//         Alert.alert(t('Error'), data.message || t('Something went wrong. Please try again.'));
//       }
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       Alert.alert(t('Error'), t('No internet connection. Please check your network.'));
//       setLoading(false);
//     }
//   };

//   const filteredUsers = users.filter(
//     user =>
//       user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//  useEffect(() => {
//   if (!socket) return;

//   socket.off('challenge-sent-success');
//   socket.off('challenge-error');

//   const onChallengeSuccess = data => {
//     console.log('✅ Challenge sent successfully:', data);
//     setSending(false);
//   };

//   const onChallengeError = err => {
//     console.log('❌ Challenge error:', err);
//     setSending(false);
//     Alert.alert(t('Error'), err?.message || 'Could not send challenge, try again');
//   };

//   socket.on('challenge-sent-success', onChallengeSuccess);
//   socket.on('challenge-error', onChallengeError);

//   return () => {
//     socket.off('challenge-sent-success', onChallengeSuccess);
//     socket.off('challenge-error', onChallengeError);
//   };
// }, [socket]);

// const handleSendChallenge = async () => {
//   if (sending) return;

//   if (!selectedUser) {
//     Alert.alert(t('Error'), 'Select a friend first');
//     return;
//   }

//   if (!socket || !socket.connected) {
//     Alert.alert(t('Error'), 'Connecting... please wait a moment and try again');
//     return;
//   }

//   setSending(true);

//   const challengePayload = {
//     userId: selectedUser._id,
//     username: selectedUser.username,
//     diff: gameConfig?.difficulty,
//     timer: gameConfig?.timer,
//     symbol: gameConfig?.symbol,
//   };

//   console.log('📤 [CHALLENGE] Sending challenge:', challengePayload);

//   socket.emit('send-challenge', challengePayload);

//   // safety timeout in case server never responds with success/error
//   const timeoutId = setTimeout(() => {
//     console.warn('⚠️ [CHALLENGE] Challenge sent timeout - no response from server');
//     setSending(false);
//   }, 8000);

//   socket.once('challenge-sent-success', (data) => {
//     clearTimeout(timeoutId);
//     console.log('✅ [CHALLENGE] Challenge sent successfully:', {
//       challengeId: data.challengeId,
//       targetUser: selectedUser.username,
//       timestamp: new Date().toISOString(),
//     });
//     // ✅ CRITICAL: Pass the real challengeId from server, not derived from params
//     navigation.navigate('WaitingForOpponent', {
//       challengeId: data.challengeId,  // ✅ SAVE THIS for cancel later
//       challengedUser: selectedUser,
//       diff: gameConfig?.difficulty,
//       timer: gameConfig?.timer,
//       symbol: gameConfig?.symbol,
//     });
//   });

//   socket.once('challenge-error', (err) => {
//     clearTimeout(timeoutId);
//     console.error('❌ [CHALLENGE] Challenge error:', {
//       message: err?.message,
//       timestamp: new Date().toISOString(),
//     });
//     setSending(false);
//   });
// };
//   const getStatusColor = status => {
//     switch (status) {
//       case 'accepted':
//         return '#4ade80';
//       case 'pending':
//         return '#facc15';
//       case 'rejected':
//         return '#ef4444';
//       case 'blocked':
//         return '#9ca3af';
//       default:
//         return '#60a5fa';
//     }
//   };

//   const getStatusText = status => {
//     switch (status) {
//       case 'accepted':
//         return t('Friends');
//       case 'pending':
//         return t('Preparing your match');
//       case 'rejected':
//         return t('Challenge Declined');
//       case 'blocked':
//         return t('Cancel');
//       default:
//         return t('FRIENDS');
//     }
//   };

//   const renderUserItem = ({ item }) => {
//     const isSelected = selectedUser?._id === item._id;
//     const statusColor = getStatusColor(item.friendshipStatus);
//     const statusText = getStatusText(item.friendshipStatus);

//     return (
//       <TouchableOpacity
//         onPress={() => setSelectedUser(isSelected ? null : item)}
//         style={[styles.userCard, isSelected && styles.userCardSelected]}
//         activeOpacity={0.7}>
//         <View style={styles.userLeft}>
//           <View style={styles.avatar}>
//             <Text style={styles.avatarText}>
//               {item.username ? item.username.charAt(0).toUpperCase() : '?'}
//             </Text>
//           </View>
//           <View style={styles.userInfo}>
//             <Text style={styles.userName}>{item.username}</Text>
//             <Text style={styles.userEmail}>{item.email}</Text>
//             {item.country && (
//               <Text style={styles.userCountry}>🌍 {item.country}</Text>
//             )}
//           </View>
//         </View>

//         <View style={styles.userRight}>
//           <View style={styles.statsContainer}>
//             <View
//               style={[
//                 styles.statusBadge,
//                 { backgroundColor: statusColor + '20' },
//               ]}>
//               <View
//                 style={[styles.statusDot, { backgroundColor: statusColor }]}
//               />
//               <Text style={[styles.statusText, { color: statusColor }]}>
//                 {statusText}
//               </Text>
//             </View>
//           </View>

//           {isSelected && (
//             <View style={styles.selectedBadge}>
//               <Text style={styles.selectedBadgeText}>⚡</Text>
//             </View>
//           )}
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const Wrapper = theme.backgroundGradient ? LinearGradient : View;
//   const wrapperProps = theme.backgroundGradient
//     ? { colors: theme.backgroundGradient }
//     : { style: { backgroundColor: theme.background || '#0B1220' } };

//   return (
//     <Wrapper style={styles.container} {...wrapperProps}>
//       {/* Header */}
//       <CustomHeader
//         title={t('Challenge Received!')}
//         onBack={() => navigation.goBack()}
//         style={{ marginTop: insets.top + 20 }}
//       />

//       {/* Search Box */}
//       <View style={styles.searchContainer}>
//         <Icon
//           name="search-outline"
//           size={20}
//           color="#9ca3af"
//           style={styles.searchIcon}
//         />
//         <TextInput
//           style={styles.searchInput}
//           placeholder={t('Search')}
//           placeholderTextColor="#9ca3af"
//           value={searchTerm}
//           onChangeText={setSearchTerm}
//         />
//       </View>

//       {/* Users List */}
//       <View style={styles.listContainer}>
//         {loading ? (
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" color="#f8630dff" />
//             <Text style={styles.loadingText}>{t('Loading...')}</Text>
//           </View>
//         ) : filteredUsers.length === 0 ? (
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyText}>
//               {searchTerm ? t('Network Error') : t('Please try again later.')}
//             </Text>
//           </View>
//         ) : (
//           <FlatList
//             data={filteredUsers}
//             renderItem={renderUserItem}
//             keyExtractor={item => item._id}
//             contentContainerStyle={styles.listContent}
//             showsVerticalScrollIndicator={false}
//           />
//         )}
//       </View>

//       {/* Challenge Button */}
//       {selectedUser && (
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity onPress={handleSendChallenge} activeOpacity={0.8}>
//             <LinearGradient
//               colors={['#f8630dff', '#fb8a08ff']}
//               style={styles.challengeButton}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 0 }}>
//               <Text style={styles.challengeButtonText}>
//                 ⚡ {t('Start Game')} {selectedUser.username} ⚡
//               </Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         </View>
//       )}
//     </Wrapper>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   searchContainer: {
//     marginHorizontal: 20,
//     marginBottom: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.2)',
//     paddingHorizontal: 16,
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchInput: {
//     flex: 1,
//     color: '#fff',
//     fontSize: 16,
//     paddingVertical: 14,
//   },
//   listContainer: {
//     flex: 1,
//     marginHorizontal: 20,
//   },
//   listContent: {
//     paddingBottom: 20,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 60,
//   },
//   loadingText: {
//     color: '#fff',
//     fontSize: 16,
//     marginTop: 16,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 60,
//   },
//   emptyText: {
//     color: '#d1d5db',
//     fontSize: 18,
//   },
//   userCard: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.05)',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.1)',
//   },
//   userCardSelected: {
//     backgroundColor: 'rgba(248, 99, 13, 0.2)',
//     borderColor: '#f8630dff',
//     borderWidth: 2,
//   },
//   userLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   avatar: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: '#f8630dff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   avatarText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   userInfo: {
//     flex: 1,
//   },
//   userName: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   userEmail: {
//     color: '#d1d5db',
//     fontSize: 13,
//     marginTop: 2,
//   },
//   userCountry: {
//     color: '#9ca3af',
//     fontSize: 12,
//     marginTop: 4,
//   },
//   userRight: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   statsContainer: {
//     alignItems: 'flex-end',
//   },
//   statusBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 12,
//   },
//   statusDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     marginRight: 6,
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   selectedBadge: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: '#f8630dff',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   selectedBadgeText: {
//     fontSize: 18,
//   },
//   buttonContainer: {
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//   },
//   challengeButton: {
//     paddingVertical: 18,
//     borderRadius: 12,
//     alignItems: 'center',
//     shadowColor: '#f8630dff',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.5,
//     shadowRadius: 8,
//     elevation: 8,
//   },
//   challengeButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });



// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   ActivityIndicator,
//   StatusBar,
//   Alert,
//   Dimensions,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { useTheme } from '../context/ThemeContext';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useSocket } from '../context/Socket';
// import CustomHeader from '../components/CustomHeader';

// const { width } = Dimensions.get('window');

// export default function ChallengeFriends() {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { theme } = useTheme();
//   const insets = useSafeAreaInsets();

//   const { gameConfig } = route.params || {};

//   const [users, setUsers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const socket = useSocket()

//   useEffect(() => {
//     fetchUsers();
//   }, []);
//   useEffect(() => {
//     if (!socket) return;

//     const onChallengeSuccess = data => {
//       console.log('✅ Challenge sent successfully:', data);
//     };

//     const onChallengeError = err => {
//       console.error('❌ Challenge error:', err);
//       Alert.alert('Challenge Failed', err.message || 'Something went wrong');
//     };

//     socket.on('challenge-sent-success', onChallengeSuccess);
//     socket.on('challenge-error', onChallengeError);

//     return () => {
//       socket.off('challenge-sent-success', onChallengeSuccess);
//       socket.off('challenge-error', onChallengeError);
//     };
//   }, [socket]);

//   const fetchUsers = async () => {
//     try {
//       // Get token from AsyncStorage
//       const token = await AsyncStorage.getItem('accessToken');

//       if (!token) {
//         Alert.alert('Error', 'Please login first');
//         setLoading(false);
//         return;
//       }

//       const response = await fetch(
//         'https://mataletics-backend.onrender.com/api/friend/my-friend-list',
//         {
//           method: 'GET',
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         },
//       );

//       const data = await response.json();
//       console.log(data);

//       if (data.success) {
//         setUsers(data.friends);
//       } else {
//         Alert.alert('Error', data.message || 'Failed to fetch users');
//       }
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       Alert.alert('Error', 'Failed to connect to server');
//       setLoading(false);
//     }
//   };

//   const filteredUsers = users.filter(
//     user =>
//       user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   const handleSendChallenge = async () => {
//     if (!selectedUser) {
//       Alert.alert('No Player Selected', 'Please select a player to challenge!');
//       return;
//     }

//     if (!socket?.connected) {
//       Alert.alert('Error', 'Socket not connected');
//       return;
//     }

//     // ✅ BUILD CHALLENGE PAYLOAD
//     const challengePayload = {
//       userId: selectedUser._id,
//       username: selectedUser.username,
//       diff: gameConfig?.difficulty,
//       timer: gameConfig?.timer,
//       symbol: gameConfig?.symbol,
//     };

//     console.log('📤 Sending challenge:', challengePayload);

//     // ✅ SEND SOCKET EVENT
//     socket.emit('send-challenge', challengePayload);

//     // ✅ Navigate to waiting screen (don't show alert first)
//     navigation.navigate('WaitingForOpponent', {
//       challengedUser: selectedUser,
//       diff: gameConfig?.difficulty,
//       timer: gameConfig?.timer,
//       symbol: gameConfig?.symbol,
//     });
//   };



//   const getStatusColor = status => {
//     switch (status) {
//       case 'accepted':
//         return '#4ade80';
//       case 'pending':
//         return '#facc15';
//       case 'rejected':
//         return '#ef4444';
//       case 'blocked':
//         return '#9ca3af';
//       default:
//         return '#60a5fa';
//     }
//   };

//   const getStatusText = status => {
//     switch (status) {
//       case 'accepted':
//         return 'Friend';
//       case 'pending':
//         return 'Pending';
//       case 'rejected':
//         return 'Rejected';
//       case 'blocked':
//         return 'Blocked';
//       default:
//         return 'Add Friend';
//     }
//   };

//   const renderUserItem = ({ item }) => {
//     const isSelected = selectedUser?._id === item._id;
//     const statusColor = getStatusColor(item.friendshipStatus);
//     const statusText = getStatusText(item.friendshipStatus);

//     return (
//       <TouchableOpacity
//         onPress={() => setSelectedUser(isSelected ? null : item)}
//         style={[styles.userCard, isSelected && styles.userCardSelected]}
//         activeOpacity={0.7}>
//         <View style={styles.userLeft}>
//           <View style={styles.avatar}>
//             <Text style={styles.avatarText}>
//               {item.username ? item.username.charAt(0).toUpperCase() : '?'}
//             </Text>
//           </View>
//           <View style={styles.userInfo}>
//             <Text style={styles.userName}>{item.username}</Text>
//             <Text style={styles.userEmail}>{item.email}</Text>
//             {item.country && (
//               <Text style={styles.userCountry}>🌍 {item.country}</Text>
//             )}
//           </View>
//         </View>

//         <View style={styles.userRight}>
//           <View style={styles.statsContainer}>
//             <View
//               style={[
//                 styles.statusBadge,
//                 { backgroundColor: statusColor + '20' },
//               ]}>
//               <View
//                 style={[styles.statusDot, { backgroundColor: statusColor }]}
//               />
//               <Text style={[styles.statusText, { color: statusColor }]}>
//                 {statusText}
//               </Text>
//             </View>
//           </View>

//           {isSelected && (
//             <View style={styles.selectedBadge}>
//               <Text style={styles.selectedBadgeText}>⚡</Text>
//             </View>
//           )}
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const Wrapper = theme.backgroundGradient ? LinearGradient : View;
//   const wrapperProps = theme.backgroundGradient
//     ? { colors: theme.backgroundGradient }
//     : { style: { backgroundColor: theme.background || '#0B1220' } };

//   return (
//     <Wrapper style={styles.container} {...wrapperProps}>
//       {/* Header */}
//       <CustomHeader
//         title="Challenge Friends"
//         onBack={() => navigation.goBack()}
//         style={{ marginTop: insets.top + 20 }}
//       />

//       {/* Search Box */}
//       <View style={styles.searchContainer}>
//         <Icon
//           name="search-outline"
//           size={20}
//           color="#9ca3af"
//           style={styles.searchIcon}
//         />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search by username or email..."
//           placeholderTextColor="#9ca3af"
//           value={searchTerm}
//           onChangeText={setSearchTerm}
//         />
//       </View>

//       {/* Users List */}
//       <View style={styles.listContainer}>
//         {loading ? (
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" color="#f8630dff" />
//             <Text style={styles.loadingText}>Loading players...</Text>
//           </View>
//         ) : filteredUsers.length === 0 ? (
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyText}>
//               {searchTerm ? 'No players found' : 'No players available'}
//             </Text>
//           </View>
//         ) : (
//           <FlatList
//             data={filteredUsers}
//             renderItem={renderUserItem}
//             keyExtractor={item => item._id}
//             contentContainerStyle={styles.listContent}
//             showsVerticalScrollIndicator={false}
//           />
//         )}
//       </View>

//       {/* Challenge Button */}
//       {selectedUser && (
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity onPress={handleSendChallenge} activeOpacity={0.8}>
//             <LinearGradient
//               colors={['#f8630dff', '#fb8a08ff']}
//               style={styles.challengeButton}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 0 }}>
//               <Text style={styles.challengeButtonText}>
//                 ⚡ Send Challenge to {selectedUser.username} ⚡
//               </Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         </View>
//       )}
//     </Wrapper>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   // Header styles removed as CustomHeader is used
//   searchContainer: {
//     marginHorizontal: 20,
//     marginBottom: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.2)',
//     paddingHorizontal: 16,
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchInput: {
//     flex: 1,
//     color: '#fff',
//     fontSize: 16,
//     paddingVertical: 14,
//   },
//   listContainer: {
//     flex: 1,
//     marginHorizontal: 20,
//   },
//   listContent: {
//     paddingBottom: 20,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 60,
//   },
//   loadingText: {
//     color: '#fff',
//     fontSize: 16,
//     marginTop: 16,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 60,
//   },
//   emptyText: {
//     color: '#d1d5db',
//     fontSize: 18,
//   },
//   userCard: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.05)',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.1)',
//   },
//   userCardSelected: {
//     backgroundColor: 'rgba(248, 99, 13, 0.2)',
//     borderColor: '#f8630dff',
//     borderWidth: 2,
//   },
//   userLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   avatar: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: '#f8630dff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   avatarText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   userInfo: {
//     flex: 1,
//   },
//   userName: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   userEmail: {
//     color: '#d1d5db',
//     fontSize: 13,
//     marginTop: 2,
//   },
//   userCountry: {
//     color: '#9ca3af',
//     fontSize: 12,
//     marginTop: 4,
//   },
//   userRight: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   statsContainer: {
//     alignItems: 'flex-end',
//   },
//   statusBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 12,
//   },
//   statusDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     marginRight: 6,
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   selectedBadge: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: '#f8630dff',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   selectedBadgeText: {
//     fontSize: 18,
//   },
//   buttonContainer: {
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//   },
//   challengeButton: {
//     paddingVertical: 18,
//     borderRadius: 12,
//     alignItems: 'center',
//     shadowColor: '#f8630dff',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.5,
//     shadowRadius: 8,
//     elevation: 8,
//   },
//   challengeButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });


import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Alert,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSocket, useSocketState } from '../context/Socket';
import CustomHeader from '../components/CustomHeader';
import { useAppTranslation } from '../context/TranslationContext';
import { authFetch as fetch } from '../utils/authFetch'; // auto-refresh wrapper for expired access tokens

const { width } = Dimensions.get('window');

export default function ChallengeFriends() {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useAppTranslation();

  const { gameConfig } = route.params || {};

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sending, setSending] = useState(false);
  const socket = useSocket();
  const { isRegistered } = useSocketState();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
  if (!socket) return;

  // ✅ remove old listeners FIRST
  socket.off('challenge-sent-success');
  socket.off('challenge-error');

  const onChallengeSuccess = data => {
  console.log('✅ Challenge sent successfully:', data);
  setSending(false); // 🔥 IMPORTANT
};

  const onChallengeError = err => {
    // console.error('❌ Challenge error:', err);
    // Alert.alert('Error', err.message || 'Something went wrong');
    setSending(false); // 🔥 reset sending
  };

  socket.on('challenge-sent-success', onChallengeSuccess);
  socket.on('challenge-error', onChallengeError);

  return () => {
    socket.off('challenge-sent-success');
    socket.off('challenge-error');
  };
}, [socket]);
  const fetchUsers = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');

      if (!token) {
        Alert.alert(t('Error'), t('Please wait while we load your content.'));
        setLoading(false);
        return;
      }

      const response = await fetch(
        'http://13.203.232.239:3000/api/friend/my-friend-list',
        {
          method:'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const data = await response.json();
      console.log(data);

      if (data.success) {
        setUsers(data.friends);
      } else {
        Alert.alert(t('Error'), data.message || t('Something went wrong. Please try again.'));
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert(t('Error'), t('No internet connection. Please check your network.'));
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    user =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

 useEffect(() => {
  if (!socket) return;

  socket.off('challenge-sent-success');
  socket.off('challenge-error');

  const onChallengeSuccess = data => {
    console.log('✅ Challenge sent successfully:', data);
    setSending(false);
  };

  const onChallengeError = err => {
    console.log('❌ Challenge error:', err);
    setSending(false);
    Alert.alert(t('Error'), err?.message || 'Could not send challenge, try again');
  };

  socket.on('challenge-sent-success', onChallengeSuccess);
  socket.on('challenge-error', onChallengeError);

  return () => {
    socket.off('challenge-sent-success', onChallengeSuccess);
    socket.off('challenge-error', onChallengeError);
  };
}, [socket]);

const handleSendChallenge = async () => {
  if (sending) return;

  if (!selectedUser) {
    Alert.alert(t('Error'), 'Select a friend first');
    return;
  }

  if (!socket || !socket.connected) {
    Alert.alert(t('Error'), 'Connecting... please wait a moment and try again');
    return;
  }

  if (!isRegistered) {
    Alert.alert(t('Error'), 'Still connecting, please wait a moment and try again');
    return;
  }

  setSending(true);

  const challengePayload = {
    userId: selectedUser._id,
    username: selectedUser.username,
    diff: gameConfig?.difficulty,
    timer: gameConfig?.timer,
    symbol: gameConfig?.symbol,
  };

  console.log('📤 [CHALLENGE] Sending challenge:', challengePayload);

  socket.emit('send-challenge', challengePayload);

  // safety timeout in case server never responds with success/error
  const timeoutId = setTimeout(() => {
    console.warn('⚠️ [CHALLENGE] Challenge sent timeout - no response from server');
    setSending(false);
  }, 8000);

  socket.once('challenge-sent-success', (data) => {
    clearTimeout(timeoutId);
    console.log('✅ [CHALLENGE] Challenge sent successfully:', {
      challengeId: data.challengeId,
      targetUser: selectedUser.username,
      timestamp: new Date().toISOString(),
    });
    // ✅ CRITICAL: Pass the real challengeId from server, not derived from params
    navigation.navigate('WaitingForOpponent', {
      challengeId: data.challengeId,  // ✅ SAVE THIS for cancel later
      challengedUser: selectedUser,
      diff: gameConfig?.difficulty,
      timer: gameConfig?.timer,
      symbol: gameConfig?.symbol,
    });
  });

  socket.once('challenge-error', (err) => {
    clearTimeout(timeoutId);
    console.error('❌ [CHALLENGE] Challenge error:', {
      message: err?.message,
      timestamp: new Date().toISOString(),
    });
    setSending(false);
  });
};
  const getStatusColor = status => {
    switch (status) {
      case 'accepted':
        return '#4ade80';
      case 'pending':
        return '#facc15';
      case 'rejected':
        return '#ef4444';
      case 'blocked':
        return '#9ca3af';
      default:
        return '#60a5fa';
    }
  };

  const getStatusText = status => {
    switch (status) {
      case 'accepted':
        return t('Friends');
      case 'pending':
        return t('Preparing your match');
      case 'rejected':
        return t('Challenge Declined');
      case 'blocked':
        return t('Cancel');
      default:
        return t('FRIENDS');
    }
  };

  const renderUserItem = ({ item }) => {
    const isSelected = selectedUser?._id === item._id;
    const statusColor = getStatusColor(item.friendshipStatus);
    const statusText = getStatusText(item.friendshipStatus);

    return (
      <TouchableOpacity
        onPress={() => setSelectedUser(isSelected ? null : item)}
        style={[styles.userCard, isSelected && styles.userCardSelected]}
        activeOpacity={0.7}>
        <View style={styles.userLeft}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.username ? item.username.charAt(0).toUpperCase() : '?'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.username}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
            {item.country && (
              <Text style={styles.userCountry}>🌍 {item.country}</Text>
            )}
          </View>
        </View>

        <View style={styles.userRight}>
          <View style={styles.statsContainer}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: statusColor + '20' },
              ]}>
              <View
                style={[styles.statusDot, { backgroundColor: statusColor }]}
              />
              <Text style={[styles.statusText, { color: statusColor }]}>
                {statusText}
              </Text>
            </View>
          </View>

          {isSelected && (
            <View style={styles.selectedBadge}>
              <Text style={styles.selectedBadgeText}>⚡</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const Wrapper = theme.backgroundGradient ? LinearGradient : View;
  const wrapperProps = theme.backgroundGradient
    ? { colors: theme.backgroundGradient }
    : { style: { backgroundColor: theme.background || '#0B1220' } };

  return (
    <Wrapper style={styles.container} {...wrapperProps}>
      {/* Header */}
      <CustomHeader
        title={t('Challenge Received!')}
        onBack={() => navigation.goBack()}
        style={{ marginTop: insets.top + 20 }}
      />

      {/* Search Box */}
      <View style={styles.searchContainer}>
        <Icon
          name="search-outline"
          size={20}
          color="#9ca3af"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder={t('Search')}
          placeholderTextColor="#9ca3af"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      {/* Users List */}
      <View style={styles.listContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#f8630dff" />
            <Text style={styles.loadingText}>{t('Loading...')}</Text>
          </View>
        ) : filteredUsers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchTerm ? t('Network Error') : t('Please try again later.')}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredUsers}
            renderItem={renderUserItem}
            keyExtractor={item => item._id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Challenge Button */}
      {selectedUser && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleSendChallenge} activeOpacity={0.8}>
            <LinearGradient
              colors={['#f8630dff', '#fb8a08ff']}
              style={styles.challengeButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}>
              <Text style={styles.challengeButtonText}>
                ⚡ {t('Start Game')} {selectedUser.username} ⚡
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 14,
  },
  listContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#d1d5db',
    fontSize: 18,
  },
  userCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  userCardSelected: {
    backgroundColor: 'rgba(248, 99, 13, 0.2)',
    borderColor: '#f8630dff',
    borderWidth: 2,
  },
  userLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f8630dff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#d1d5db',
    fontSize: 13,
    marginTop: 2,
  },
  userCountry: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 4,
  },
  userRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statsContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  selectedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8630dff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBadgeText: {
    fontSize: 18,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  challengeButton: {
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#f8630dff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  challengeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});