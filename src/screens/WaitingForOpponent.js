// // // // // import React, { useEffect, useRef, useState } from 'react';
// // // // // import {
// // // // //   View,
// // // // //   Text,
// // // // //   StyleSheet,
// // // // //   ActivityIndicator,
// // // // //   Animated,
// // // // //   Alert,
// // // // //   TouchableOpacity,
// // // // // } from 'react-native';
// // // // // import { useNavigation, useRoute } from '@react-navigation/native';
// // // // // import { useSocket } from '../context/Socket';
// // // // // import LinearGradient from 'react-native-linear-gradient';
// // // // // import AsyncStorage from '@react-native-async-storage/async-storage';

// // // // // const WaitingForOpponent = () => {
// // // // //   const socket = useSocket();
// // // // //   const navigation = useNavigation();
// // // // //   const route = useRoute();

// // // // //   const { challengedUser, diff, timer, symbol } = route.params;

// // // // //   const [challengeId, setChallengeId] = useState(null);
// // // // //   const pulseAnim = useRef(new Animated.Value(1)).current;

// // // // //   // 🔄 Pulse animation
// // // // //   useEffect(() => {
// // // // //     Animated.loop(
// // // // //       Animated.sequence([
// // // // //         Animated.timing(pulseAnim, {
// // // // //           toValue: 1.05,
// // // // //           duration: 800,
// // // // //           useNativeDriver: true,
// // // // //         }),
// // // // //         Animated.timing(pulseAnim, {
// // // // //           toValue: 1,
// // // // //           duration: 800,
// // // // //           useNativeDriver: true,
// // // // //         }),
// // // // //       ]),
// // // // //     ).start();
// // // // //   }, []);

// // // // //   // 🎧 SOCKET LISTENERS
// // // // //   useEffect(() => {
// // // // //     if (!socket) return;

// // // // //     // ✅ EMIT CHALLENGE ON MOUNT
// // // // //     // if (challengedUser?._id && !challengeId && !route.params?.isComputer) {
// // // // //     //   console.log('📤 Sending challenge to:', challengedUser.username);
// // // // //     //   socket.emit('send-challenge', {
// // // // //     //     userId: challengedUser._id,
// // // // //     //     diff: diff,
// // // // //     //     timer: timer,
// // // // //     //     // message: 'Rematch?',
// // // // //     //     symbol: symbol,
// // // // //     //   });
// // // // //     // }

// // // // //     // ✅ When challenge is successfully sent
// // // // //     const onChallengeSent = data => {
// // // // //       console.log('✅ Challenge sent successfully:', data);
// // // // //       setChallengeId(data.challengeId);
// // // // //     };

// // // // //     // ✅ LISTEN FOR MATCH-FOUND (sent by backend when challenge accepted)
// // // // //     const onMatchFound = async data => {
// // // // //       console.log('🎮 Match found (challenger):', data);

// // // // //       // Get user data
// // // // //       const userData = await AsyncStorage.getItem('userData');
// // // // //       const user = userData ? JSON.parse(userData) : null;
// // // // //       const myMongoId = user?._id || user?.id;

// // // // //       // Wait for game-started event
// // // // //       const onGameStarted = gameData => {
// // // // //         console.log('🚀 Game started (challenger):', gameData);

// // // // //         // Navigate to game
// // // // //         setTimeout(() => {
// // // // //           navigation.replace('MultiPlayerGame', {
// // // // //             currentQuestion: gameData.currentQuestion,
// // // // //             timer: timer,
// // // // //             difficulty: diff,
// // // // //             opponent: {
// // // // //               ...data.opponent,
// // // // //               stats: data.opponent?.stats || {
// // // // //                 wins: 0,
// // // // //                 losses: 0,
// // // // //                 winRate: 0,
// // // // //                 currentStreak: 0,
// // // // //               },
// // // // //             },
// // // // //             myMongoId: myMongoId,
// // // // //             isChallenge: true,
// // // // //           });
// // // // //         }, 300);
// // // // //       };

// // // // //       socket.once('game-started', onGameStarted);
// // // // //     };

// // // // //     // ❌ When opponent declines the challenge
// // // // //     const onChallengeDeclined = data => {
// // // // //       console.log('❌ Challenge declined:', data);
// // // // //       Alert.alert(
// // // // //         'Challenge Declined',
// // // // //         `${challengedUser.username} declined your challenge`,
// // // // //         [{ text: 'OK', onPress: () => navigation.goBack() }],
// // // // //       );
// // // // //     };

// // // // //     // 🚫 When challenge is cancelled by you
// // // // //     const onChallengeCancelledByYou = data => {
// // // // //       console.log('🚫 You cancelled the challenge');
// // // // //       navigation.goBack();
// // // // //     };

// // // // //     // ⏰ When challenge expires
// // // // //     const onChallengeExpired = data => {
// // // // //       console.log('⏱️ Challenge expired:', data);
// // // // //       Alert.alert(
// // // // //         'Challenge Expired',
// // // // //         `${challengedUser.username} did not respond in time`,
// // // // //         [{ text: 'OK', onPress: () => navigation.goBack() }],
// // // // //       );
// // // // //     };

// // // // //     // ❌ When challenge fails
// // // // //     const onChallengeError = error => {
// // // // //       console.error('❌ Challenge error:', error);
// // // // //       Alert.alert(
// // // // //         'Challenge Failed',
// // // // //         error.message || 'Could not send challenge',
// // // // //         [{ text: 'OK', onPress: () => navigation.goBack() }],
// // // // //       );
// // // // //     };

// // // // //     socket.on('challenge-sent', onChallengeSent);
// // // // //     socket.on('match-found', onMatchFound); // ✅ THIS IS THE KEY!
// // // // //     socket.on('challenge-declined', onChallengeDeclined);
// // // // //     socket.on('challenge-cancelled-by-you', onChallengeCancelledByYou);
// // // // //     socket.on('challenge-expired', onChallengeExpired);
// // // // //     socket.on('challenge-error', onChallengeError);

// // // // //     return () => {
// // // // //       socket.off('challenge-sent-success', onChallengeSent);
// // // // //       socket.off('match-found', onMatchFound);
// // // // //       socket.off('challenge-declined', onChallengeDeclined);
// // // // //       socket.off('challenge-cancelled-by-you', onChallengeCancelledByYou);
// // // // //       socket.off('challenge-expired', onChallengeExpired);
// // // // //       socket.off('challenge-error', onChallengeError);
// // // // //     };
// // // // //   }, [socket, challengedUser, navigation, diff, timer]);

// // // // //   // ✅ SIMULATE COMPUTER OPPONENT
// // // // //   useEffect(() => {
// // // // //     if (route.params?.isComputer) {
// // // // //       console.log('🤖 Starting Computer Match Simulation...');

// // // // //       const startComputerGame = async () => {
// // // // //         // Get user data
// // // // //         const userData = await AsyncStorage.getItem('userData');
// // // // //         const user = userData ? JSON.parse(userData) : null;
// // // // //         const myMongoId = user?._id || user?.id;

// // // // //         // Simulate delay
// // // // //         setTimeout(() => {
// // // // //           navigation.replace('MultiPlayerGame', {
// // // // //             currentQuestion: null, // Game screen should handle generating questions if null or we generate here
// // // // //             timer: timer,
// // // // //             difficulty: diff,
// // // // //             opponent: {
// // // // //               username: 'Computer',
// // // // //               _id: 'computer-bot',
// // // // //               isComputer: true,
// // // // //               stats: {
// // // // //                 wins: 999,
// // // // //                 losses: 0,
// // // // //                 winRate: 100,
// // // // //                 currentStreak: 10
// // // // //               }
// // // // //             },
// // // // //             myMongoId: myMongoId,
// // // // //             isChallenge: true,
// // // // //             isComputer: true // Pass flag to game screen
// // // // //           });
// // // // //         }, 2000);
// // // // //       };

// // // // //       startComputerGame();
// // // // //     }
// // // // //   }, [route.params?.isComputer]);

// // // // //   // Cancel challenge
// // // // //   const handleCancel = () => {
// // // // //     if (challengeId && socket) {
// // // // //       console.log('🚫 Cancelling challenge:', challengeId);
// // // // //       socket.emit('cancel-challenge', { challengeId });
// // // // //     }
// // // // //     navigation.goBack();
// // // // //   };

// // // // //   return (
// // // // //     <LinearGradient colors={['#0B0F1A', '#1a1f2e']} style={styles.container}>
// // // // //       <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
// // // // //         <ActivityIndicator size="large" color="#00e0ff" />
// // // // //       </Animated.View>

// // // // //       <Text style={styles.title}>Waiting for {challengedUser.username}</Text>

// // // // //       <Text style={styles.subtitle}>
// // // // //         Difficulty: {diff?.toUpperCase()} | Timer: {timer}s
// // // // //       </Text>

// // // // //       <Text style={styles.note}>Challenge sent…</Text>

// // // // //       <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
// // // // //         <Text style={styles.cancelText}>Cancel Challenge</Text>
// // // // //       </TouchableOpacity>
// // // // //     </LinearGradient>
// // // // //   );
// // // // // };

// // // // // export default WaitingForOpponent;

// // // // // const styles = StyleSheet.create({
// // // // //   container: {
// // // // //     flex: 1,
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     padding: 20,
// // // // //   },
// // // // //   title: {
// // // // //     marginTop: 20,
// // // // //     fontSize: 20,
// // // // //     color: '#fff',
// // // // //     fontWeight: '600',
// // // // //     textAlign: 'center',
// // // // //   },
// // // // //   subtitle: {
// // // // //     marginTop: 6,
// // // // //     fontSize: 14,
// // // // //     color: '#aaa',
// // // // //     textAlign: 'center',
// // // // //   },
// // // // //   note: {
// // // // //     marginTop: 14,
// // // // //     fontSize: 13,
// // // // //     color: '#00e0ff',
// // // // //   },
// // // // //   cancelButton: {
// // // // //     marginTop: 40,
// // // // //     paddingHorizontal: 30,
// // // // //     paddingVertical: 12,
// // // // //     backgroundColor: 'rgba(239, 68, 68, 0.2)',
// // // // //     borderRadius: 8,
// // // // //     borderWidth: 1,
// // // // //     borderColor: '#ef4444',
// // // // //   },
// // // // //   cancelText: {
// // // // //     color: '#ef4444',
// // // // //     fontSize: 16,
// // // // //     fontWeight: '600',
// // // // //   },
// // // // // });

// // // // import React, { useEffect, useRef, useState } from 'react';
// // // // import {
// // // //   View,
// // // //   Text,
// // // //   StyleSheet,
// // // //   ActivityIndicator,
// // // //   Animated,
// // // //   TouchableOpacity,
// // // // } from 'react-native';
// // // // import { useNavigation, useRoute } from '@react-navigation/native';
// // // // import LinearGradient from 'react-native-linear-gradient';
// // // // import AsyncStorage from '@react-native-async-storage/async-storage';

// // // // const WaitingForOpponent = () => {
// // // //   console.log('🔴 ========== WaitingForOpponent MOUNTED ==========');
  
// // // //   const navigation = useNavigation();
// // // //   const route = useRoute();

// // // //   const { challengedUser, diff, timer } = route.params;

// // // //   console.log('📍 Route params received:');
// // // //   console.log('  - challengedUser:', challengedUser?.username || 'N/A');
// // // //   console.log('  - diff:', diff);
// // // //   console.log('  - timer:', timer);
// // // //   console.log('  - isComputer:', route.params?.isComputer);

// // // //   const pulseAnim = useRef(new Animated.Value(1)).current;

// // // //   // 🔄 Animation
// // // //   useEffect(() => {
// // // //     Animated.loop(
// // // //       Animated.sequence([
// // // //         Animated.timing(pulseAnim, {
// // // //           toValue: 1.05,
// // // //           duration: 800,
// // // //           useNativeDriver: true,
// // // //         }),
// // // //         Animated.timing(pulseAnim, {
// // // //           toValue: 1,
// // // //           duration: 800,
// // // //           useNativeDriver: true,
// // // //         }),
// // // //       ])
// // // //     ).start();
// // // //   }, []);

// // // //   // ✅ API: Get Question
// // // //   const getQuestion = async () => {
// // // //     console.log('� [CRITICAL] getQuestion() STARTING - ' + Date.now());
// // // //     console.warn('⚡⚡⚡ getQuestion INVOKED ⚡⚡⚡');
// // // //     try {
// // // //       console.log('🔵 [CRITICAL] Getting token from AsyncStorage');
// // // //       const token = await AsyncStorage.getItem('accessToken');
// // // //       console.log('🔵 [CRITICAL] Token:', token ? `EXISTS (${token.substring(0, 20)}...)` : 'NULL or MISSING');
// // // //       console.warn('⚡⚡⚡ TOKEN CHECK: ' + (token ?  'HAS TOKEN' : 'NO TOKEN'));
      
// // // //       if (!token) {
// // // //         console.error('🔴 CRITICAL ERROR: NO TOKEN IN ASYNC STORAGE');
// // // //         return null;
// // // //       }

// // // //       const url = 'http://13.203.232.239:3000/api/question';
// // // //       console.log('🔵 [CRITICAL] API URL: ' + url);
// // // //       console.warn('⚡⚡⚡ MAKING FETCH REQUEST ⚡⚡⚡');

// // // //       const response = await fetch(url, {
// // // //         method: 'GET',
// // // //         headers: {
// // // //           Authorization: `Bearer ${token}`,
// // // //           'Content-Type': 'application/json',
// // // //         },
// // // //       });

// // // //       console.log('🔵 [CRITICAL] Response received - Status: ' + response.status);
// // // //       console.log('🔵 [CRITICAL] Response.ok: ' + response.ok);
// // // //       console.warn('⚡⚡⚡ RESPONSE STATUS: ' + response.status + ' ⚡⚡⚡');

// // // //       const questionData =
// // // //   data?.question ||
// // // //   data?.nextQuestion ||
// // // //   data?.data?.question ||
// // // //   null;

// // // // if (response.ok && questionData) {
// // // //   console.log('✅ FINAL QUESTION OBJECT:', questionData);
// // // //   return questionData;
// // // // } else {
// // // //   console.error('❌ No valid question found in response');
// // // //   return null;
// // // // }

// // // //   // 🤖 COMPUTER MODE
// // // //   useEffect(() => {
// // // //     console.warn('🟡🟡🟡 COMPUTER MODE EFFECT TRIGGERED 🟡🟡🟡');
// // // //     console.log('🤖 COMPUTER MODE EFFECT FIRED');
// // // //     console.log('route:', route);
// // // //     console.log('route.name:', route.name);
// // // //     console.log('route.params:', route.params);
// // // //     console.log('route.params?.isComputer:', route.params?.isComputer);
// // // //     console.warn('⚡⚡⚡ isComputer VALUE: ' + route.params?.isComputer);

// // // //     if (route.params?.isComputer) {
// // // //       console.warn('✅✅✅ CONDITION MET - STARTING COMPUTER MODE ✅✅✅');
// // // //       console.log('✅ STARTING COMPUTER GAME MODE');
// // // //       const startGame = async () => {
// // // //         console.warn('🟢 startGame() FUNCTION STARTED 🟢');
// // // //         console.log('🎮 startGame() CALLED');
        
// // // //         console.log('Getting user data from AsyncStorage...');
// // // //         const userData = await AsyncStorage.getItem('userData');
// // // //         const user = userData ? JSON.parse(userData) : null;
// // // //         console.log('👤 User data:', user);
// // // //         console.warn('🟢 USER DATA RETRIEVED: ' + (user ? JSON.stringify(user) : 'NULL'));

// // // //         console.warn('🟢 ABOUT TO CALL getQuestion() 🟢');
// // // //         console.log('📝 Calling getQuestion()...');
// // // //         const question = await getQuestion();
// // // //         console.warn('🟢 getQuestion() RETURNED 🟢');
// // // //         console.log('📝 Question returned:', question);
// // // //         console.warn('🟢 QUESTION VALUE: ' + (question ? JSON.stringify(question) : 'NULL'));

// // // //         if (!question) {
// // // //           console.error('🔴 NO QUESTION RECEIVED - null returned');
// // // //           console.log('❌ NO QUESTION - Still navigating with null');
// // // //         } else {
// // // //           console.log('✅✅✅ QUESTION FOUND - Proceeding');
// // // //         }

// // // //         console.log('🚀 Navigating to MultiPlayerGame with:');
// // // //         console.log('  - currentQuestion:', question);
// // // //         console.log('  - timer:', timer);
// // // //         console.log('  - difficulty:', diff);
// // // //         console.log('  - isComputer: true');
// // // //         console.warn('🟢 NAVIGATION PARAMS: currentQuestion=' + (question ? 'SET' : 'NULL') + ', timer=' + timer + ', diff=' + diff);

// // // //         setTimeout(() => {
// // // //           console.warn('🟢 setTimeout FIRED - NOW NAVIGATING 🟢');
// // // //           navigation.replace('MultiPlayerGame', {
// // // //             currentQuestion: question,
// // // //             timer,
// // // //             difficulty: diff,
// // // //             opponent: {
// // // //               username: 'Computer',
// // // //               _id: 'bot',
// // // //               isComputer: true,
// // // //             },
// // // //             myMongoId: user?._id,
// // // //             isComputer: true,
// // // //           });
// // // //         }, 1500);
// // // //       };

// // // //       console.warn('🟢 CALLING startGame() 🟢');
// // // //       startGame();
// // // //     } else {
// // // //       console.error('❌❌❌ CONDITION NOT MET - NOT STARTING COMPUTER MODE ❌❌❌');
// // // //       console.log('❌ NOT COMPUTER MODE - Skipping computer game setup');
// // // //       console.warn('⚡⚡⚡ isComputer is: ' + route.params?.isComputer);
// // // //     }
// // // //   }, []);

// // // //   return (
// // // //     <LinearGradient colors={['#0B0F1A', '#1a1f2e']} style={styles.container}>
// // // //       <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
// // // //         <ActivityIndicator size="large" color="#00e0ff" />
// // // //       </Animated.View>

// // // //       <Text style={styles.title}>
// // // //         {route.params?.isComputer
// // // //           ? 'Starting Computer Match 🤖'
// // // //           : `Waiting for ${challengedUser?.username}`}
// // // //       </Text>

// // // //       <Text style={styles.subtitle}>
// // // //         Difficulty: {diff?.toUpperCase()} | Timer: {timer}s
// // // //       </Text>

// // // //       <Text style={styles.note}>
// // // //         {route.params?.isComputer
// // // //           ? 'Preparing AI opponent...'
// // // //           : 'Challenge sent…'}
// // // //       </Text>

// // // //       {!route.params?.isComputer && (
// // // //         <TouchableOpacity style={styles.cancelButton}>
// // // //           <Text style={styles.cancelText}>Cancel</Text>
// // // //         </TouchableOpacity>
// // // //       )}
// // // //     </LinearGradient>
// // // //   );
// // // // };

// // // // export default WaitingForOpponent;

// // // // const styles = StyleSheet.create({
// // // //   container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
// // // //   title: { color: '#fff', fontSize: 18, marginTop: 20 },
// // // //   subtitle: { color: '#aaa', marginTop: 5 },
// // // //   note: { color: '#00e0ff', marginTop: 10 },
// // // //   cancelButton: {
// // // //     marginTop: 30,
// // // //     padding: 10,
// // // //     borderColor: 'red',
// // // //     borderWidth: 1,
// // // //   },
// // // //   cancelText: { color: 'red' },
// // // // });




// // // import React, { useEffect, useRef } from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   StyleSheet,
// // //   ActivityIndicator,
// // //   Animated,
// // //   TouchableOpacity,
// // //   Alert,
// // // } from 'react-native';
// // // import { useNavigation, useRoute } from '@react-navigation/native';
// // // import LinearGradient from 'react-native-linear-gradient';
// // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // import { useSocket } from '../context/Socket';

// // // const WaitingForOpponent = () => {
// // //   console.log('🔴 ========== WaitingForOpponent MOUNTED ==========');

// // //   const navigation = useNavigation();
// // //   const route = useRoute();
// // //   const socket = useSocket();

// // //   const { challengedUser, diff, timer } = route.params;

// // //   console.log('📍 Route params received:');
// // //   console.log('  - challengedUser:', challengedUser?.username || 'N/A');
// // //   console.log('  - diff:', diff);
// // //   console.log('  - timer:', timer);
// // //   console.log('  - isComputer:', route.params?.isComputer);

// // //   const pulseAnim = useRef(new Animated.Value(1)).current;

// // //   // 🔄 Animation
// // //   useEffect(() => {
// // //     Animated.loop(
// // //       Animated.sequence([
// // //         Animated.timing(pulseAnim, {
// // //           toValue: 1.05,
// // //           duration: 800,
// // //           useNativeDriver: true,
// // //         }),
// // //         Animated.timing(pulseAnim, {
// // //           toValue: 1,
// // //           duration: 800,
// // //           useNativeDriver: true,
// // //         }),
// // //       ])
// // //     ).start();
// // //   }, []);

// // //   // 🎧 SOCKET LISTENERS FOR REAL OPPONENT
// // //   useEffect(() => {
// // //     if (!socket || route.params?.isComputer) return; // Skip for computer mode

// // //     console.log('🔵 Setting up socket listeners for real opponent...');

// // //     // ✅ When opponent accepts and match is found
// // //     const handleMatchFound = async (data) => {
// // //       console.log('🎮 Match found!', data);
      
// // //       const userData = await AsyncStorage.getItem('userData');
// // //       const user = userData ? JSON.parse(userData) : null;
// // //       const myMongoId = user?._id || user?.id;

// // //       // Wait for game-started event
// // //       socket.once('game-started', (gameData) => {
// // //         console.log('🚀 Game started!', gameData);
        
// // //         setTimeout(() => {
// // //           navigation.replace('MultiPlayerGame', {
// // //             currentQuestion: gameData.currentQuestion,
// // //             timer: timer,
// // //             difficulty: diff,
// // //             opponent: {
// // //               ...data.opponent,
// // //               stats: data.opponent?.stats || {
// // //                 wins: 0,
// // //                 losses: 0,
// // //                 winRate: 0,
// // //                 currentStreak: 0,
// // //               },
// // //             },
// // //             myMongoId: myMongoId,
// // //             isChallenge: true,
// // //           });
// // //         }, 300);
// // //       });
// // //     };

// // //     // ❌ When opponent declines
// // //     const handleChallengeDeclined = (data) => {
// // //       console.log('❌ Challenge declined:', data);
// // //       Alert.alert(
// // //         'Challenge Declined',
// // //         `${challengedUser?.username} declined your challenge`,
// // //         [{ text: 'OK', onPress: () => navigation.goBack() }]
// // //       );
// // //     };

// // //     // ⏰ Challenge expired
// // //     const handleChallengeExpired = (data) => {
// // //       console.log('⏱️ Challenge expired');
// // //       Alert.alert(
// // //         'Challenge Expired',
// // //         `${challengedUser?.username} did not respond in time`,
// // //         [{ text: 'OK', onPress: () => navigation.goBack() }]
// // //       );
// // //     };

// // //     socket.on('match-found', handleMatchFound);
// // //     socket.on('challenge-declined', handleChallengeDeclined);
// // //     socket.on('challenge-expired', handleChallengeExpired);

// // //     return () => {
// // //       socket.off('match-found', handleMatchFound);
// // //       socket.off('challenge-declined', handleChallengeDeclined);
// // //       socket.off('challenge-expired', handleChallengeExpired);
// // //     };
// // //   }, [socket, route.params?.isComputer, navigation, diff, timer, challengedUser?.username]);

// // //   // ✅ API: Get Question (FIXED - WITH QUERY PARAMS)
// // //   const getQuestion = async () => {
// // //     try {
// // //       const token = await AsyncStorage.getItem('accessToken');

// // //       if (!token) {
// // //         console.error('🔴 NO TOKEN FOUND');
// // //         return null;
// // //       }

// // //       // 🎯 API REQUIRES: difficulty, symbol (and optional qm)
// // //       const queryParams = new URLSearchParams({
// // //         difficulty: diff || 'easy',
// // //         symbol: 'Sum', // Default symbol - can be Sum, Difference, Product, Quotient, Modulus, Exponent
// // //       });

// // //       const url = `http://13.203.232.239:3000/api/question?${queryParams.toString()}`;
// // //       console.log('📡 Fetching from:', url);
// // //       console.warn('⚡⚡⚡ API URL WITH PARAMS: ' + url);

// // //       const response = await fetch(url, {
// // //         method: 'GET',
// // //         headers: {
// // //           Authorization: `Bearer ${token}`,
// // //           'Content-Type': 'application/json',
// // //         },
// // //       });

// // //       console.log('📥 Response status:', response.status);
// // //       const data = await response.json();
// // //       console.log('🔥 RAW API RESPONSE:', JSON.stringify(data, null, 2));

// // //       // ✅ HANDLE ALL POSSIBLE RESPONSE FORMATS
// // //       const questionData =
// // //         data?.question ||
// // //         data?.nextQuestion ||
// // //         data?.data?.question ||
// // //         null;

// // //       if (response.ok && questionData) {
// // //         console.warn('✅✅✅ QUESTION RECEIVED ✅✅✅');
// // //         console.log('✅ FINAL QUESTION:', questionData);
// // //         return questionData;
// // //       } else {
// // //         console.error('❌ No valid question found in response');
// // //         console.error('Response message:', data?.message);
// // //         return null;
// // //       }
// // //     } catch (err) {
// // //       console.error('❌ ERROR FETCHING QUESTION:', err);
// // //       return null;
// // //     }
// // //   };

// // //   // 🤖 COMPUTER MODE
// // //   useEffect(() => {
// // //     if (route.params?.isComputer) {
// // //       const startGame = async () => {
// // //         const userData = await AsyncStorage.getItem('userData');
// // //         const user = userData ? JSON.parse(userData) : null;

// // //         const question = await getQuestion();

// // //         // 🚨 CRITICAL FIX: STOP IF NULL
// // //         if (!question) {
// // //           console.error('🚨 STOP: No question received. NOT navigating.');
// // //           return;
// // //         }

// // //         console.log('🚀 Navigating with question:', question);

// // //         navigation.replace('MultiPlayerGame', {
// // //           currentQuestion: question,
// // //           timer,
// // //           difficulty: diff,
// // //           opponent: {
// // //             username: 'Computer',
// // //             _id: 'bot',
// // //             isComputer: true,
// // //           },
// // //           myMongoId: user?._id,
// // //           isComputer: true,
// // //         });
// // //       };

// // //       startGame();
// // //     } else if (socket && challengedUser?._id) {
// // //       // 👥 REAL OPPONENT MODE - Emit challenge
// // //       console.log('📤 Sending challenge to real opponent:', challengedUser.username);
// // //       socket.emit('send-challenge', {
// // //         userId: challengedUser._id,
// // //         diff: diff,
// // //         timer: timer,
// // //         symbol: route.params?.symbol,
// // //       });
// // //     }
// // //   }, [socket, route.params?.isComputer, challengedUser?._id, diff, timer]);

// // //   return (
// // //     <LinearGradient colors={['#0B0F1A', '#1a1f2e']} style={styles.container}>
// // //       <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
// // //         <ActivityIndicator size="large" color="#00e0ff" />
// // //       </Animated.View>

// // //       <Text style={styles.title}>
// // //         {route.params?.isComputer
// // //           ? 'Starting Computer Match 🤖'
// // //           : `Waiting for ${challengedUser?.username}`}
// // //       </Text>

// // //       <Text style={styles.subtitle}>
// // //         Difficulty: {diff?.toUpperCase()} | Timer: {timer}s
// // //       </Text>

// // //       <Text style={styles.note}>
// // //         {route.params?.isComputer
// // //           ? 'Preparing AI opponent...'
// // //           : 'Challenge sent…'}
// // //       </Text>

// // //       {!route.params?.isComputer && (
// // //         <TouchableOpacity style={styles.cancelButton}>
// // //           <Text style={styles.cancelText}>Cancel</Text>
// // //         </TouchableOpacity>
// // //       )}
// // //     </LinearGradient>
// // //   );
// // // };

// // // export default WaitingForOpponent;

// // // const styles = StyleSheet.create({
// // //   container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
// // //   title: { color: '#fff', fontSize: 18, marginTop: 20 },
// // //   subtitle: { color: '#aaa', marginTop: 5 },
// // //   note: { color: '#00e0ff', marginTop: 10 },
// // //   cancelButton: {
// // //     marginTop: 30,
// // //     padding: 10,
// // //     borderColor: 'red',
// // //     borderWidth: 1,
// // //   },
// // //   cancelText: { color: 'red' },
// // // });




// // import React, { useEffect, useRef } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   ActivityIndicator,
// //   Animated,
// //   TouchableOpacity,
// //   Alert,
// // } from 'react-native';
// // import { useNavigation, useRoute } from '@react-navigation/native';
// // import LinearGradient from 'react-native-linear-gradient';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import { useSocket } from '../context/Socket';

// // // ✅ Map API symbol key → display label (for subtitle)
// // const SYMBOL_DISPLAY_MAP = {
// //   Sum: '+',
// //   Difference: '-',
// //   Product: '×',
// //   Quotient: '÷',
// //   Modulus: '%',
// //   Exponent: '^',
// // };

// // // ✅ Pick one random symbol from a comma-separated list like 'sum,difference,product'
// // // Normalises capitalisation to match API keys: 'sum' → 'Sum'
// // const pickRandomSymbol = (symbolString) => {
// //   if (!symbolString) return 'Sum';
// //   const parts = symbolString.split(',').map(s => {
// //     const trimmed = s.trim();
// //     // capitalise first letter, lowercase rest
// //     return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
// //   });
// //   return parts[Math.floor(Math.random() * parts.length)];
// // };

// // const WaitingForOpponent = () => {
// //   const navigation = useNavigation();
// //   const route = useRoute();
// //   const socket = useSocket();

// //   // ✅ FIX: also destructure `symbol` from route params
// //   const { challengedUser, diff, timer, symbol, isComputer } = route.params || {};

// //   // ✅ FIX: `symbol` from PlayGame can be a comma-separated list like 'sum,difference,product'
// //   //         Pick ONE random symbol for the API call each game session
// //   //         e.g. 'sum,difference,product,quotient' → 'Product'
// //   const resolvedApiSymbol = pickRandomSymbol(symbol);

// //   const pulseAnim = useRef(new Animated.Value(1)).current;

// //   // 🔄 Animation
// //   useEffect(() => {
// //     Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(pulseAnim, {
// //           toValue: 1.05,
// //           duration: 800,
// //           useNativeDriver: true,
// //         }),
// //         Animated.timing(pulseAnim, {
// //           toValue: 1,
// //           duration: 800,
// //           useNativeDriver: true,
// //         }),
// //       ])
// //     ).start();
// //   }, []);

// //   // 🎧 SOCKET LISTENERS FOR REAL OPPONENT
// //   useEffect(() => {
// //     if (!socket || isComputer) return;

// //     const handleMatchFound = async (data) => {
// //       const userData = await AsyncStorage.getItem('userData');
// //       const user = userData ? JSON.parse(userData) : null;
// //       const myMongoId = user?._id || user?.id;

// //       socket.once('game-started', (gameData) => {
// //         setTimeout(() => {
// //           navigation.replace('MultiPlayerGame', {
// //             currentQuestion: gameData.currentQuestion,
// //             timer: timer,
// //             difficulty: diff,
// //             opponent: {
// //               ...data.opponent,
// //               stats: data.opponent?.stats || {
// //                 wins: 0,
// //                 losses: 0,
// //                 winRate: 0,
// //                 currentStreak: 0,
// //               },
// //             },
// //             myMongoId: myMongoId,
// //             isChallenge: true,
// //           });
// //         }, 300);
// //       });
// //     };

// //     const handleChallengeDeclined = () => {
// //       Alert.alert(
// //         'Challenge Declined',
// //         `${challengedUser?.username} declined your challenge`,
// //         [{ text: 'OK', onPress: () => navigation.goBack() }]
// //       );
// //     };

// //     const handleChallengeExpired = () => {
// //       Alert.alert(
// //         'Challenge Expired',
// //         `${challengedUser?.username} did not respond in time`,
// //         [{ text: 'OK', onPress: () => navigation.goBack() }]
// //       );
// //     };

// //     socket.on('match-found', handleMatchFound);
// //     socket.on('challenge-declined', handleChallengeDeclined);
// //     socket.on('challenge-expired', handleChallengeExpired);

// //     return () => {
// //       socket.off('match-found', handleMatchFound);
// //       socket.off('challenge-declined', handleChallengeDeclined);
// //       socket.off('challenge-expired', handleChallengeExpired);
// //     };
// //   }, [socket, isComputer, navigation, diff, timer, challengedUser?.username]);

// //   // ✅ FIX: getQuestion now accepts the symbol so it never hardcodes 'Sum'
// //   const getQuestion = async (questionSymbol) => {
// //     try {
// //       const token = await AsyncStorage.getItem('accessToken');
// //       if (!token) {
// //         console.error('NO TOKEN FOUND');
// //         return null;
// //       }

// //       // ✅ FIX: use the symbol passed in — falls back to 'Sum' only if nothing provided
// //       const resolvedSymbol = questionSymbol || 'Sum';

// //       const queryParams = new URLSearchParams({
// //         difficulty: diff || 'easy',
// //         symbol: resolvedSymbol,
// //       });

// //       const url = `http://13.203.232.239:3000/api/question?${queryParams.toString()}`;
// //       console.log('Fetching question:', url);

// //       const response = await fetch(url, {
// //         method: 'GET',
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //           'Content-Type': 'application/json',
// //         },
// //       });

// //       const data = await response.json();

// //       const questionData =
// //         data?.question ||
// //         data?.nextQuestion ||
// //         data?.data?.question ||
// //         null;

// //       if (response.ok && questionData) {
// //         // ✅ ensure the question carries the symbol forward for MultiPlayerGame
// //         return { ...questionData, symbol: questionData.symbol || resolvedSymbol };
// //       } else {
// //         console.error('No valid question in response:', data?.message);
// //         return null;
// //       }
// //     } catch (err) {
// //       console.error('ERROR FETCHING QUESTION:', err);
// //       return null;
// //     }
// //   };

// //   // 🤖 COMPUTER MODE
// //   useEffect(() => {
// //     if (isComputer) {
// //       const startGame = async () => {
// //         const userData = await AsyncStorage.getItem('userData');
// //         const user = userData ? JSON.parse(userData) : null;

// //         // ✅ FIX: use resolvedApiSymbol — a single clean symbol like 'Product', 'Sum' etc.
// //         //         NOT the raw comma-separated string from PlayGame
// //         const question = await getQuestion(resolvedApiSymbol);

// //         if (!question) {
// //           console.error('No question received. NOT navigating.');
// //           Alert.alert(
// //             'Error',
// //             'Could not load a question. Please try again.',
// //             [{ text: 'OK', onPress: () => navigation.goBack() }]
// //           );
// //           return;
// //         }

// //         navigation.replace('MultiPlayerGame', {
// //           currentQuestion: question,
// //           timer,
// //           difficulty: diff,
// //           // ✅ pass the ORIGINAL comma-separated symbol so MultiPlayerGame can pick random for EACH question
// //           symbol: symbol,
// //           opponent: {
// //             username: 'Computer',
// //             _id: 'bot',
// //             isComputer: true,
// //           },
// //           myMongoId: user?._id || user?.id,
// //           isComputer: true,
// //         });
// //       };

// //       startGame();
// //     } else if (socket && challengedUser?._id) {
// //       // 👥 REAL OPPONENT MODE
// //       socket.emit('send-challenge', {
// //         userId: challengedUser._id,
// //         diff: diff,
// //         timer: timer,
// //         symbol: symbol,
// //       });
// //     }
// //   }, []);  // runs once on mount

// //   return (
// //     <LinearGradient colors={['#0B0F1A', '#1a1f2e']} style={styles.container}>
// //       <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
// //         <ActivityIndicator size="large" color="#00e0ff" />
// //       </Animated.View>

// //       <Text style={styles.title}>
// //         {isComputer
// //           ? 'Starting Computer Match 🤖'
// //           : `Waiting for ${challengedUser?.username}`}
// //       </Text>

// //       <Text style={styles.subtitle}>
// //         Difficulty: {diff?.toUpperCase()} | Timer: {timer}s
// //         {resolvedApiSymbol ? ` | ${resolvedApiSymbol} (${SYMBOL_DISPLAY_MAP[resolvedApiSymbol] || resolvedApiSymbol})` : ''}
// //       </Text>

// //       <Text style={styles.note}>
// //         {isComputer
// //           ? 'Preparing AI opponent...'
// //           : 'Challenge sent…'}
// //       </Text>

// //       {!isComputer && (
// //         <TouchableOpacity
// //           style={styles.cancelButton}
// //           onPress={() => navigation.goBack()}
// //         >
// //           <Text style={styles.cancelText}>Cancel</Text>
// //         </TouchableOpacity>
// //       )}
// //     </LinearGradient>
// //   );
// // };

// // export default WaitingForOpponent;

// // const styles = StyleSheet.create({
// //   container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
// //   title: { color: '#fff', fontSize: 18, marginTop: 20 },
// //   subtitle: { color: '#aaa', marginTop: 5, textAlign: 'center', paddingHorizontal: 20 },
// //   note: { color: '#00e0ff', marginTop: 10 },
// //   cancelButton: {
// //     marginTop: 30,
// //     padding: 10,
// //     borderColor: 'red',
// //     borderWidth: 1,
// //   },
// //   cancelText: { color: 'red' },
// // });



// // WORKING QUES WITHH COMPUTER MODE - FULL FEATURED, WITH SYMBOL SUPPORT, FIXED API CALL, AND ROBUST ERROR HANDLING
// // import React, { useEffect, useRef } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   ActivityIndicator,
// //   Animated,
// //   TouchableOpacity,
// //   Alert,
// // } from 'react-native';
// // import { useNavigation, useRoute } from '@react-navigation/native';
// // import LinearGradient from 'react-native-linear-gradient';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import { io } from 'socket.io-client';
// // import { useSocket } from '../context/Socket';
// // import ComputerGameSocket from '../utils/ComputerGameSocket';

// // const timerToGameMode = (timer) => {
// //   const t = parseInt(timer, 10);
// //   if (t >= 180) return '3-minute';
// //   if (t >= 120) return '2-minute';
// //   return '1-minute';
// // };

// // const COMPUTER_GAME_NAMESPACE = 'http://13.203.232.239:3000/computer-game';

// // const WaitingForOpponent = () => {
// //   const navigation  = useNavigation();
// //   const route       = useRoute();
// //   const mainSocket  = useSocket();

// //   const {
// //     challengedUser,
// //     diff,
// //     timer,
// //     symbol,
// //     isComputer,
// //     selectedLevel,
// //   } = route.params || {};

// //   const pulseAnim        = useRef(new Animated.Value(1)).current;
// //   const computerSocketRef = useRef(null);
// //   const cancelledRef     = useRef(false);

// //   // ─── Pulse animation ───
// //   useEffect(() => {
// //     Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(pulseAnim, { toValue: 1.05, duration: 800, useNativeDriver: true }),
// //         Animated.timing(pulseAnim, { toValue: 1,    duration: 800, useNativeDriver: true }),
// //       ])
// //     ).start();
// //   }, [pulseAnim]);

// //   // ─── COMPUTER MODE ───
// //   useEffect(() => {
// //     if (!isComputer) return;

// //     cancelledRef.current = false;

// //     const startComputerGame = async () => {
// //       try {
// //         const token = await AsyncStorage.getItem('accessToken');
// //         if (!token) {
// //           Alert.alert('Error', 'Not authenticated. Please log in again.', [
// //             { text: 'OK', onPress: () => navigation.goBack() },
// //           ]);
// //           return;
// //         }

// //         const userData = await AsyncStorage.getItem('userData');
// //         const user     = userData ? JSON.parse(userData) : null;

// //         // Clear any stale socket left over from a previous game session
// //         ComputerGameSocket.clear();

// //         const socket = io(COMPUTER_GAME_NAMESPACE, {
// //           transports: ['websocket'],
// //         });

// //         computerSocketRef.current = socket;

// //         socket.on('connect', () => {
// //           if (cancelledRef.current) { socket.disconnect(); return; }

// //           // Step 1: Authenticate
// //           socket.emit('authenticate', token, (ack) => {
// //             if (cancelledRef.current) return;

// //             if (!ack?.success) {
// //               console.error('Computer game auth failed:', ack?.error);
// //               Alert.alert('Error', 'Authentication failed. Please try again.', [
// //                 { text: 'OK', onPress: () => navigation.goBack() },
// //               ]);
// //               socket.disconnect();
// //               return;
// //             }

// //             // Step 2: Start game
// //             const gameMode      = timerToGameMode(timer);
// //             const computerLevel = selectedLevel || 1;

// //             const attemptStart = (isRetry) => {
// //               socket.emit('startGame', { computerLevel, gameMode }, (startAck) => {
// //                 if (cancelledRef.current) return;

// //                 if (!startAck?.success) {
// //                   const errMsg = startAck?.error || 'Could not start game.';

// //                   // Active game already running — leave it then retry once
// //                   if (!isRetry && errMsg === 'Player already has an active game') {
// //                     console.warn('[WaitingForOpponent] Active game found — leaving before retry');
// //                     socket.emit('leaveGame', '');   // server resolves active game by player auth
// //                     setTimeout(() => attemptStart(true), 1000);
// //                     return;
// //                   }

// //                   Alert.alert('Error', errMsg, [
// //                     { text: 'OK', onPress: () => navigation.goBack() },
// //                   ]);
// //                   return;
// //                 }

// //                 navigateToComputerGame(startAck, socket, user);
// //               });
// //             };

// //             attemptStart(false);
// //           });
// //         });

// //         socket.on('connect_error', (err) => {
// //           console.error('[WaitingForOpponent] Computer socket error:', err.message);
// //           if (!cancelledRef.current) {
// //             Alert.alert('Connection Error', 'Could not connect to game server.', [
// //               { text: 'OK', onPress: () => navigation.goBack() },
// //             ]);
// //           }
// //         });

// //       } catch (err) {
// //         console.error('[WaitingForOpponent] startComputerGame threw:', err);
// //         if (!cancelledRef.current) {
// //           Alert.alert('Error', 'Something went wrong. Please try again.', [
// //             { text: 'OK', onPress: () => navigation.goBack() },
// //           ]);
// //         }
// //       }
// //     };

// //     /**
// //      * ⚠️ ORDER MATTERS:
// //      * ComputerGameSocket.set(socket) MUST be called BEFORE navigation.replace().
// //      * navigation.replace() can synchronously trigger ComputerGame to mount and
// //      * call ComputerGameSocket.get() — if the singleton isn't set yet, it returns
// //      * null and the screen shows "Game session lost".
// //      */
// //     const navigateToComputerGame = (ackData, socket, user) => {
// //       ComputerGameSocket.set(socket);  // ← set FIRST

// //       navigation.replace('ComputerGame', {
// //         gameId:              ackData.gameId,
// //         gameMode:            ackData.gameMode,
// //         computerLevel:       ackData.computerLevel,
// //         computerDisplayName: ackData.computerDisplayName,
// //         difficulty:          ackData.difficulty,
// //         firstQuestion:       ackData.question,    // { index, question, input1, input2, symbol, finalLevel }
// //         initialGameState:    ackData.gameState,   // { playerScore, playerMeter, computerScore, ... }
// //         timer,
// //         diff,
// //         symbol,
// //         myMongoId: user?._id || user?.id,
// //       });
// //     };

// //     startComputerGame();

// //     return () => {
// //       cancelledRef.current = true;
// //       // Only disconnect if we never transitioned to ComputerGame.
// //       // If we did, ComputerGame owns the socket now (via the singleton).
// //       if (computerSocketRef.current && !ComputerGameSocket.get()) {
// //         computerSocketRef.current.disconnect();
// //         computerSocketRef.current = null;
// //       }
// //     };
// //   // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []); // intentionally run once on mount — params are captured in closure

// //   // ─── REAL OPPONENT MODE ───
// //   useEffect(() => {
// //     if (isComputer || !mainSocket || !challengedUser?._id) return;

// //     const handleMatchFound = async (data) => {
// //       const userData  = await AsyncStorage.getItem('userData');
// //       const user      = userData ? JSON.parse(userData) : null;
// //       const myMongoId = user?._id || user?.id;

// //       mainSocket.once('game-started', (gameData) => {
// //         setTimeout(() => {
// //           navigation.replace('MultiPlayerGame', {
// //             currentQuestion: gameData.currentQuestion,
// //             timer,
// //             difficulty: diff,
// //             opponent: {
// //               ...data.opponent,
// //               stats: data.opponent?.stats || {
// //                 wins: 0, losses: 0, winRate: 0, currentStreak: 0,
// //               },
// //             },
// //             myMongoId,
// //             isChallenge: true,
// //           });
// //         }, 300);
// //       });
// //     };

// //     const handleChallengeDeclined = () =>
// //       Alert.alert('Challenge Declined', `${challengedUser?.username} declined your challenge`, [
// //         { text: 'OK', onPress: () => navigation.goBack() },
// //       ]);

// //     const handleChallengeExpired = () =>
// //       Alert.alert('Challenge Expired', `${challengedUser?.username} did not respond in time`, [
// //         { text: 'OK', onPress: () => navigation.goBack() },
// //       ]);

// //     mainSocket.on('match-found',         handleMatchFound);
// //     mainSocket.on('challenge-declined',  handleChallengeDeclined);
// //     mainSocket.on('challenge-expired',   handleChallengeExpired);

// //     mainSocket.emit('send-challenge', {
// //       userId: challengedUser._id,
// //       diff,
// //       timer,
// //       symbol,
// //     });

// //     return () => {
// //       mainSocket.off('match-found',        handleMatchFound);
// //       mainSocket.off('challenge-declined', handleChallengeDeclined);
// //       mainSocket.off('challenge-expired',  handleChallengeExpired);
// //     };
// //   }, [isComputer, mainSocket, challengedUser, diff, timer, symbol, navigation]);

// //   return (
// //     <LinearGradient colors={['#0B0F1A', '#1a1f2e']} style={styles.container}>
// //       <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
// //         <ActivityIndicator size="large" color="#00e0ff" />
// //       </Animated.View>

// //       <Text style={styles.title}>
// //         {isComputer ? 'Starting Computer Match 🤖' : `Waiting for ${challengedUser?.username}`}
// //       </Text>

// //       <Text style={styles.subtitle}>
// //         {isComputer
// //           ? `Level ${selectedLevel} · ${timerToGameMode(timer)}`
// //           : `Difficulty: ${diff?.toUpperCase()} | Timer: ${timer}s`}
// //       </Text>

// //       <Text style={styles.note}>
// //         {isComputer ? 'Connecting to AI opponent...' : 'Challenge sent…'}
// //       </Text>

// //       {!isComputer && (
// //         <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
// //           <Text style={styles.cancelText}>Cancel</Text>
// //         </TouchableOpacity>
// //       )}
// //     </LinearGradient>
// //   );
// // };

// // export default WaitingForOpponent;

// // const styles = StyleSheet.create({
// //   container:    { flex: 1, alignItems: 'center', justifyContent: 'center' },
// //   title:        { color: '#fff', fontSize: 18, marginTop: 20, fontWeight: '700' },
// //   subtitle:     { color: '#aaa', marginTop: 5, textAlign: 'center', paddingHorizontal: 20 },
// //   note:         { color: '#00e0ff', marginTop: 10 },
// //   cancelButton: { marginTop: 30, padding: 10, borderColor: 'red', borderWidth: 1, borderRadius: 6 },
// //   cancelText:   { color: 'red' },
// // });

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
  Alert,
} from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from 'socket.io-client';
import { useSocket } from '../context/Socket';
import ComputerGameSocket from '../utils/ComputerGameSocket';

// ─── Helpers ────────────────────────────────────────────────────────────────

const timerToGameMode = (timer) => {
  const t = parseInt(timer, 10);
  if (t >= 180) return '3-minute';
  if (t >= 120) return '2-minute';
  return '1-minute';
};

const parseSymbols = (symbolStr) => {
  if (!symbolStr) return ['sum', 'difference', 'product', 'quotient'];

  const s = symbolStr.trim();

  if (s === '(+) and (-)') return ['sum', 'difference'];
  if (s === '(+), (-), (x) and (/)') return ['sum', 'difference', 'product', 'quotient'];

  const parts = s.split(',').map(p => p.trim().toLowerCase()).filter(Boolean);

  const tokenMap = {
    'sum':        'sum',
    'difference': 'difference',
    'product':    'product',
    'quotient':   'quotient',
    '(+)':        'sum',
    '(-)':        'difference',
    '(x)':        'product',
    '(/)':        'quotient',
  };

  return parts.map(p => tokenMap[p] || p);
};

const getSymbolLabel = (symbolStr) => {
  const parsed = parseSymbols(symbolStr);
  return parsed.length <= 2 ? '(+) and (-)' : '(+), (−), (×) and (÷)';
};

/**
 * Build the full diffCode from difficulty + symbol string.
 *
 * ✅ FIX: now accepts a pre-computed diffCode as an override so we never
 *         re-derive it from params that might be undefined at this screen.
 *
 * Letter: E = easy, M = medium, H = hard
 * Number: 2 = 2 symbols selected, 4 = 4 symbols selected
 *
 * Examples:
 *   buildDiffCode('easy',   'sum,difference')                  → 'E2'
 *   buildDiffCode('medium', 'sum,difference,product,quotient') → 'M4'
 *   buildDiffCode('hard',   'sum,difference')                  → 'H2'
 */
const buildDiffCode = (diff, symbolStr) => {
  // ✅ FIX: guard against undefined/null diff — default to 'easy' not silently 'E'
  const safeDiff = (diff || 'easy').toLowerCase();
  const tier = safeDiff === 'hard' ? 'H' : safeDiff === 'medium' ? 'M' : 'E';
  const symbols = parseSymbols(symbolStr);
  const num = symbols.length >= 4 ? '4' : '2';
  return `${tier}${num}`;
};

const COMPUTER_GAME_NAMESPACE = 'http://13.203.232.239:3000/computer-game';

// ────────────────────────────────────────────────────────────────────────────

const WaitingForOpponent = () => {
  const navigation = useNavigation();
  const route      = useRoute();
  const mainSocket = useSocket();

  const {
    challengeId,  // ✅ CRITICAL: challengeId from challenge-sent-success, needed for cancel
    challengedUser,
    diff,
    timer,
    symbol,
    isComputer,
    selectedLevel,
    // ✅ FIX: accept the pre-computed diffCode forwarded from LevelSelectionScreen
    diffCode: passedDiffCode,
  } = route.params || {};

  // ✅ FIX: log ALL incoming params so we can diagnose future issues
  console.warn('🎮 [WaitingForOpponent] PARAMS RECEIVED:', JSON.stringify({
    diff,
    timer,
    symbol,
    isComputer,
    selectedLevel,
    passedDiffCode,
  }, null, 2));

  const pulseAnim         = useRef(new Animated.Value(1)).current;
  const computerSocketRef = useRef(null);
  const cancelledRef      = useRef(false);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, [pulseAnim]);

  // ─── COMPUTER MODE ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isComputer) return;

    console.log('🎮 [COMPUTER MODE] ========== STARTING COMPUTER GAME FLOW ==========');
    console.warn('🎮 [COMPUTER MODE] PARAMS: selectedLevel=' + selectedLevel + ', diff=' + diff + ', timer=' + timer + ', symbol=' + symbol);
    console.warn('🎮 [COMPUTER MODE] passedDiffCode from LevelSelectionScreen:', passedDiffCode);

    cancelledRef.current = false;

    const startComputerGame = async () => {
      try {
        console.log('🎮 [COMPUTER MODE] Step 1: Fetching accessToken from AsyncStorage');
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          console.error('🎮 [COMPUTER MODE] ❌ NO TOKEN FOUND IN ASYNC STORAGE');
          Alert.alert('Error', 'Not authenticated. Please log in again.', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
          return;
        }
        console.log('🎮 [COMPUTER MODE] ✅ Token retrieved:', token.substring(0, 30) + '...');

        console.log('🎮 [COMPUTER MODE] Step 2: Fetching userData from AsyncStorage');
        const userData = await AsyncStorage.getItem('userData');
        const user     = userData ? JSON.parse(userData) : null;
        console.log('🎮 [COMPUTER MODE] User data retrieved:', {
          userId: user?._id,
          username: user?.username,
          rating: user?.rating,
        });
        console.warn('🎮 [COMPUTER MODE] 📊 INITIAL USER RATING:', user?.rating || 'NO RATING');

        ComputerGameSocket.clear();

        const socket = io(COMPUTER_GAME_NAMESPACE, {
          transports: ['websocket'],
        });

        computerSocketRef.current = socket;

        socket.on('connect', () => {
          console.log('🎮 [COMPUTER MODE] ✅ Socket CONNECTED! Socket ID:', socket.id);
          console.warn('🎮 [COMPUTER MODE] SOCKET CONNECTED:', socket.id);

          if (cancelledRef.current) {
            console.log('🎮 [COMPUTER MODE] ⚠️ Cancelled flag is true, disconnecting socket');
            socket.disconnect();
            return;
          }

          console.log('🎮 [COMPUTER MODE] Step 3: Emitting authenticate event with token');
          socket.emit('authenticate', token, async (ack) => {
  if (cancelledRef.current) return;

  // ── TOKEN EXPIRED → refresh and retry ──
  if (!ack?.success && ack?.code === 'TOKEN_EXPIRED') {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      const res = await axios.post('http://13.203.232.239:3000/api/auth/refresh-token', { refreshToken });

      const { accessToken, refreshToken: newRefresh } = res.data;
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', newRefresh);

      // retry auth with new token
      socket.emit('authenticate', accessToken, (retryAck) => {
        if (!retryAck?.success) {
          Alert.alert('Error', 'Session expired. Please log in again.', [
            { text: 'OK', onPress: () => navigation.replace('Login') },
          ]);
          socket.disconnect();
        }
        // else falls through to startGame below
      });
    } catch {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
      navigation.replace('Login');
    }
    return;
  }

  if (!ack?.success) {
              console.error('🎮 [COMPUTER MODE] ❌ Authentication FAILED:', ack?.error);
              Alert.alert('Error', 'Authentication failed. Please try again.', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
              socket.disconnect();
              return;
            }

            console.log('🎮 [COMPUTER MODE] ✅ Authentication SUCCESS');

            const gameMode      = timerToGameMode(timer);
            const computerLevel = selectedLevel || 1;

            console.log('🎮 [COMPUTER MODE] Parsed values:', {
              gameMode,
              computerLevel,
              diff,
              timer,
              symbol,
            });

            const selectedSymbols = parseSymbols(symbol);
            console.log('🎮 [COMPUTER MODE] Selected symbols:', selectedSymbols);

            // ✅ FIX: prefer the diffCode passed from PlayGame/LevelSelectionScreen.
            // Only re-derive it as a fallback — this prevents medium-always bug
            // when diff arrives as undefined.
            const diffCode = passedDiffCode || buildDiffCode(diff, symbol);

            console.warn('🎮 [COMPUTER MODE] ✅ FINAL DIFF CODE:', diffCode, '(passed:', passedDiffCode, ', derived:', buildDiffCode(diff, symbol), ')');
            console.warn('🎮 [COMPUTER MODE] ✅ DIFFICULTY (diff param):', diff);
            console.warn('🎮 [COMPUTER MODE] ✅ SYMBOL (symbol param):', symbol);

            console.log('[WaitingForOpponent] startGame payload:', {
              computerLevel,
              gameMode,
              selectedSymbols,
              difficulty: diffCode,
            });

            const attemptStart = (isRetry) => {
              console.log('🎮 [COMPUTER MODE] Step 4: Emitting startGame (isRetry=' + isRetry + ')');
              console.warn('🎮 [COMPUTER MODE] START GAME ATTEMPT - Level:', computerLevel, 'Mode:', gameMode, 'DiffCode:', diffCode, 'Retry:', isRetry);

              socket.emit(
                'startGame',
                {
                  computerLevel,
                  gameMode,
                  selectedSymbols,
                 diffCode,  // ✅ now always correct
                },
                (startAck) => {
                  console.log('🎮 [COMPUTER MODE] startGame callback received:', startAck);
                  console.warn('🎮 [COMPUTER MODE] GAME START ACK:', JSON.stringify(startAck, null, 2));
                  console.warn('🎮 [COMPUTER MODE] 📊 RATING FROM ACK:', startAck?.playerRating || startAck?.initialRating || 'N/A');

                  if (cancelledRef.current) {
                    console.log('🎮 [COMPUTER MODE] ⚠️ Cancelled during game start callback');
                    return;
                  }

                  if (!startAck?.success) {
                    const errMsg = startAck?.error || 'Could not start game.';
                    console.error('🎮 [COMPUTER MODE] ❌ Game start FAILED:', errMsg);
                    console.warn('🎮 [COMPUTER MODE] GAME START FAILED:', errMsg);

                    if (!isRetry && errMsg === 'Player already has an active game') {
                      console.warn('🎮 [COMPUTER MODE] Active game found — leaving and retrying...');
                      socket.emit('leaveGame', '');
                      setTimeout(() => attemptStart(true), 1000);
                      return;
                    }

                    Alert.alert('Error', errMsg, [
                      { text: 'OK', onPress: () => navigation.goBack() },
                    ]);
                    return;
                  }

                  console.log('🎮 [COMPUTER MODE] ✅ Game start SUCCESS!');
                  console.warn('🎮 [COMPUTER MODE] FULL GAME DATA:', JSON.stringify(startAck, null, 2));

                  navigateToComputerGame(startAck, socket, user, diffCode);
                }
              );
            };

            attemptStart(false);
          });
        });

        socket.on('connect_error', (err) => {
          console.error('🎮 [COMPUTER MODE] ❌ Socket connection error:', err.message);
          console.warn('🎮 [COMPUTER MODE] CONNECT ERROR:', err.message);
          if (!cancelledRef.current) {
            Alert.alert('Connection Error', 'Could not connect to game server.', [
              { text: 'OK', onPress: () => navigation.goBack() },
            ]);
          }
        });

      } catch (err) {
        console.error('🎮 [COMPUTER MODE] ❌ startComputerGame threw exception:', err);
        console.warn('🎮 [COMPUTER MODE] EXCEPTION:', err.message);
        if (!cancelledRef.current) {
          Alert.alert('Error', 'Something went wrong. Please try again.', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        }
      }
    };

    // ✅ FIX: diffCode is now computed inside the closure above (after auth),
    //         but we also capture it here for the UI subtitle below.
    const navigateToComputerGame = (ackData, socket, user, resolvedDiffCode) => {
      console.log('🎮 [COMPUTER MODE] navigateToComputerGame called');
      ComputerGameSocket.set(socket, () => {
  AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
  navigation.replace('Login');
});

      console.warn('🎮 [COMPUTER MODE] NAVIGATING TO GAME - User Rating:', user?.rating);
      console.warn('🎮 [COMPUTER MODE] 📊 GAME STATE AT NAVIGATION:', JSON.stringify(ackData.gameState, null, 2));

      navigation.replace('ComputerGame', {
        gameId:              ackData.gameId,
        gameMode:            ackData.gameMode,
        computerLevel:       ackData.computerLevel,
        computerDisplayName: ackData.computerDisplayName,
        difficulty:          ackData.difficulty,
        diffCode:            ackData.diffCode || resolvedDiffCode,
        selectedSymbols:     ackData.selectedSymbols,
        firstQuestion:       ackData.question,
        initialGameState:    ackData.gameState,
        timer,
        diff,                // ✅ original difficulty string for display
        symbol,
        myMongoId:           user?._id || user?.id,
      });
    };

    startComputerGame();

    return () => {
      console.log('🎮 [COMPUTER MODE] useEffect cleanup - cancelledRef set to true');
      console.warn('🎮 [COMPUTER MODE] CLEANUP CALLED');
      cancelledRef.current = true;
      if (computerSocketRef.current && !ComputerGameSocket.get()) {
        console.log('🎮 [COMPUTER MODE] Disconnecting socket in cleanup');
        computerSocketRef.current.disconnect();
        computerSocketRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── REAL OPPONENT MODE ───────────────────────────────────────────────────
  useEffect(() => {
    if (isComputer || !mainSocket || !challengedUser?._id) return;

    const handleMatchFound = async (data) => {
      const userData  = await AsyncStorage.getItem('userData');
      const user      = userData ? JSON.parse(userData) : null;
      const myMongoId = user?._id || user?.id;

      mainSocket.once('game-started', (gameData) => {
        setTimeout(() => {
          navigation.replace('MultiPlayerGame', {
            currentQuestion: gameData.currentQuestion,
            timer,
            difficulty: diff,
            gameStartedAt: gameData.gameState?.gameStartedAt,
            totalGameTime: gameData.gameState?.totalGameTime,
            opponent: {
              ...data.opponent,
              stats: data.opponent?.stats || {
                wins: 0, losses: 0, winRate: 0, currentStreak: 0,
              },
            },
            myMongoId,
            isChallenge: true,
          });
        }, 300);
      });
    };

    const handleChallengeDeclined = () =>
      Alert.alert('Challenge Declined', `${challengedUser?.username} declined your challenge`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);

    const handleChallengeExpired = () =>
      Alert.alert('Challenge Expired', `${challengedUser?.username} did not respond in time`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);

    mainSocket.on('match-found',        handleMatchFound);
    mainSocket.on('challenge-declined', handleChallengeDeclined);
    mainSocket.on('challenge-expired',  handleChallengeExpired);

    // mainSocket.emit('send-challenge', {
    //   userId: challengedUser._id,
    //   diff,
    //   timer,
    //   symbol,
    // });

    return () => {
      mainSocket.off('match-found',        handleMatchFound);
      mainSocket.off('challenge-declined', handleChallengeDeclined);
      mainSocket.off('challenge-expired',  handleChallengeExpired);
    };
  }, [isComputer, mainSocket, challengedUser, diff, timer, symbol, navigation]);

  // ✅ FIX: for the subtitle, use passedDiffCode with same fallback
  const displayDiffCode = passedDiffCode || buildDiffCode(diff, symbol);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <LinearGradient colors={['#0B0F1A', '#1a1f2e']} style={styles.container}>
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <ActivityIndicator size="large" color="#00e0ff" />
      </Animated.View>

      <Text style={styles.title}>
        {isComputer ? 'Starting Computer Match 🤖' : `Waiting for ${challengedUser?.username}`}
      </Text>

      <Text style={styles.subtitle}>
        {isComputer
          ? `Level ${selectedLevel} · ${displayDiffCode} · ${timerToGameMode(timer)} · ${getSymbolLabel(symbol)}`
          : `Difficulty: ${diff?.toUpperCase()} | Timer: ${timer}s`}
      </Text>

      <Text style={styles.note}>
        {isComputer ? 'Connecting to AI opponent...' : 'Challenge sent…'}
      </Text>

      {!isComputer && (
  <TouchableOpacity
    style={styles.cancelButton}
    onPress={() => {
      console.log('🚫 [CHALLENGE] User cancelling challenge:', {
        challengeId,
        targetUser: challengedUser?.username,
        timestamp: new Date().toISOString(),
      });
      // ✅ CORRECT: send challengeId, NOT userId
      mainSocket?.emit('cancel-challenge', { challengeId });
      console.log('📤 [CHALLENGE] Emitted cancel-challenge event');
      navigation.goBack();
    }}>
    <Text style={styles.cancelText}>Cancel</Text>
  </TouchableOpacity>
)}
    </LinearGradient>
  );
};

export default WaitingForOpponent;

const styles = StyleSheet.create({
  container:    { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title:        { color: '#fff', fontSize: 18, marginTop: 20, fontWeight: '700' },
  subtitle:     { color: '#aaa', marginTop: 5, textAlign: 'center', paddingHorizontal: 20 },
  note:         { color: '#00e0ff', marginTop: 10 },
  cancelButton: { marginTop: 30, padding: 10, borderColor: 'red', borderWidth: 1, borderRadius: 6 },
  cancelText:   { color: 'red' },
});