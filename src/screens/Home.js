// import { useNavigation, useFocusEffect } from '@react-navigation/native';
// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   Dimensions,
//   PixelRatio,
//   Modal,
//   ScrollView,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import LinearGradient from 'react-native-linear-gradient';
// import { useTheme } from '../context/ThemeContext';
// import { useAppTranslation } from '../context/TranslationContext';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import BadgePopup from './BadgePopup';
// import { SvgUri } from 'react-native-svg';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { useBadge } from '../context/BadgeContext';
// import GameHistoryScreen, { HistoryTable } from './GameHistoryScreen';
// import { useSocket } from '../context/Socket'; // ✅ NEW
// import TutorialSpot from '../components/TutorialSpot'; // ✅ tutorial coach-marks

// const { width, height } = Dimensions.get('window');
// const scaleFont = size => size * PixelRatio.getFontScale();

// // ✅ Helper: derive difficulty from diffCode (e.g. "E2" → "easy")
// const getDifficultyFromDiffCode = (diffCode) => {
//   if (!diffCode) return 'easy';
//   const letter = diffCode[0]?.toUpperCase();
//   if (letter === 'E') return 'easy';
//   if (letter === 'M') return 'medium';
//   if (letter === 'H') return 'hard';
//   return 'easy';
// };

// const Home = () => {
//   const navigation = useNavigation();
//   const insets     = useSafeAreaInsets();
//   const { theme }  = useTheme();
//   const { t }      = useAppTranslation();
//   const socket     = useSocket(); // ✅ NEW

//   // ─── Badge context ─────────────────────────────────────────────────────────
//   // const {
//   //   earnedBadges       = [],
//   //   setEarnedBadges    = () => {},
//   // } = useBadge() || {};
//   const {} = useBadge() || {};


//   // app-opened now fired once inside BadgeContext.reinitSocket() (called from
//   // Login on auth). Home does nothing here — popups arrive purely via socket.

//   // ─── Auth check ───────────────────────────────────────────────────────────
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const token = await AsyncStorage.getItem('accessToken');
//         if (!token) navigation.replace('Login');
//       } catch (err) {
//         console.error('❌ Auth check error:', err);
//       }
//     };
//     checkAuth();
//   }, [navigation]);

//   // ✅ NEW — Rejoin active PVP game on app open
//   // Handles two cases:
//   // 1. rejoin-game fires AFTER Home mounts → caught by socket.on listener
//   // 2. rejoin-game fired BEFORE Home mounted (during Splash) → caught by _pendingRejoinData stored in Socket.js
//   useEffect(() => {
//     if (!socket) return;

//     const handleRejoinGame = (data) => {
//       console.log('[HOME] 🔄 rejoin-game received:', data);

//       const myPlayerId = data?.myPlayerId;
//       const currentQuestion = data?.currentQuestion;
//       const gameState = data?.gameState || {};
//       const diffCode = gameState?.diffCode || null;
//       const difficulty = getDifficultyFromDiffCode(diffCode);
//       const totalGameTime = gameState?.totalGameTime || 60000;
//       const timerSeconds = Math.round(totalGameTime / 1000);

//       if (!currentQuestion || !myPlayerId) {
//         console.warn('[HOME] ⚠️ rejoin-game missing required data, skipping navigation');
//         return;
//       }

//       // Find opponent ID from playerScores
//       const opponentId = Object.keys(gameState?.playerScores || {}).find(
//         id => id !== myPlayerId,
//       ) || 'unknown';

//       console.log('[HOME] 🚀 Navigating to MultiPlayerGame via rejoin');
//       navigation.navigate('MultiPlayerGame', {
//         currentQuestion,
//         myMongoId: myPlayerId,
//         timer: timerSeconds,
//         difficulty,
//         diffCode,
//         opponent: {
//           id: opponentId,
//           username: 'Opponent',
//           rating: 1000,
//           profilePic: null,
//         },
//         gameRoomId: data?.gameId || null,
//         gameStartedAt: gameState?.gameStartedAt || null,
//         totalGameTime,
//         restoredMyScore: gameState?.playerScores?.[myPlayerId]?.score ?? 0,
//         restoredOpponentScore: gameState?.playerScores?.[opponentId]?.score ?? 0,
//       });
//     };

//     // ✅ Case 1: Listen for future rejoin-game events (Home already mounted)
//     socket.on('rejoin-game', handleRejoinGame);

//     // ✅ Case 2: Handle rejoin-game that fired before Home mounted (Splash → Home race condition)
//     // Socket.js stores it in _pendingRejoinData for exactly this scenario
//     if (socket._pendingRejoinData) {
//       console.log('[HOME] 🔄 Found pending rejoin-game data from before Home mounted');
//       const pendingData = socket._pendingRejoinData;
//       socket._pendingRejoinData = null; // clear so it doesn't fire again
//       handleRejoinGame(pendingData);
//     }

//     return () => {
//       socket.off('rejoin-game', handleRejoinGame);
//     };
//   }, [socket]); // ✅ END NEW

//   // ─── Main Content ──────────────────────────────────────────────────────────
//   const Content = () => (
//     <View style={[styles.contentContainer, { paddingTop: insets.top + 30 }]}>

//       {/* Header */}
//       <View style={[styles.headerRow, { paddingHorizontal: width * 0.04 }]}>
//         <TouchableOpacity onPress={() => navigation.navigate('CommingSoon')}>
//           <Image source={require('../assets/funcation.png')} style={styles.gridIcon} />
//         </TouchableOpacity>
//         <View style={styles.rightIcons}>
//           <TouchableOpacity onPress={() => navigation.navigate('')}>
//             <Image source={require('../assets/setting.png')} style={styles.gridIcon} />
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
//             <Image source={require('../assets/profile.png')} style={styles.gridIcon} />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* PRACTICE Button */}
//       <View style={styles.buttonsWrapper}>
//       <TutorialSpot screenKey="HOME" stepKey="practice" text="Practice solo to chase your high score">
//       <TouchableOpacity
//         onPress={() => navigation.navigate('PlayGame', { gametype: 'PRACTICE' })}
//         style={[styles.newButton1, { backgroundColor: theme.primary || '#FB923C' }]}>
//         <Image source={require('../assets/pluse.png')} style={styles.ticketIcon} />
//         <Text style={styles.newText} numberOfLines={1} adjustsFontSizeToFit>
//           {t('PRACTICE')}
//         </Text>
//       </TouchableOpacity>
//       </TutorialSpot>

//       {/* PLAY Button */}
//       <TutorialSpot screenKey="HOME" stepKey="play" text="Play to compete against others">
//       <TouchableOpacity
//         onPress={() => navigation.navigate('PlayGame', { gametype: 'PLAY' })}
//         style={[styles.newButton, { backgroundColor: theme.primary || '#FB923C' }]}>
//         <Image source={require('../assets/pluse.png')} style={styles.ticketIcon} />
//         <Text style={styles.newText} numberOfLines={1} adjustsFontSizeToFit>
//           {t('PLAY')}
//         </Text>
//       </TouchableOpacity>
//       </TutorialSpot>
// </View>

//       {/* Full-width history table */}
//       <View style={styles.tableWrapper}>
//         <HistoryTable />
//       </View>

//     </View>
//   );

//   // ─── Render ────────────────────────────────────────────────────────────────
//   return (
//     <View style={styles.safeArea}>
//       {theme.backgroundGradient ? (
//         <LinearGradient colors={theme.backgroundGradient} style={styles.container}>
//           <Content />
//         </LinearGradient>
//       ) : (
//         <View style={[styles.container, { backgroundColor: theme.backgroundColor || '#0B1220' }]}>
//           <Content />
//         </View>
//       )}

//       {/* {earnedBadges.length > 0 && (
//         <BadgePopup
//           badges={[earnedBadges[0]]}
//           onFinish={() => {
//             console.log('[Home] BadgePopup finished — shifting earnedBadges');
//             setEarnedBadges((prev) => prev.slice(1));
//           }}
//         />
//       )} */}


//     </View>
//   );
// };

// export default Home;

// const styles = StyleSheet.create({
//   safeArea:  { flex: 1 },
//   container: { flex: 1 },

//   contentContainer: {
//     flex: 1,
//   },

//   headerRow: {
//     flexDirection:  'row',
//     justifyContent: 'space-between',
//     alignItems:     'center',
//     marginBottom:   height * 0.02,
//   },
//   rightIcons: { flexDirection: 'row', alignItems: 'center', gap: width * 0.04 },
//   gridIcon: {
//     width:        width * 0.08,
//     height:       width * 0.08,
//     resizeMode:   'contain',
//     marginBottom: height * 0.015,
//   },

//   newButton: {
//     flexDirection:     'row',
//     alignItems:        'center',
//     alignSelf:         'center',
//     paddingVertical:   height * 0.018,
//     paddingHorizontal: width * 0.06,
//     marginTop:         height * 0.02,
//     width:             width * 0.8,
//     minHeight:         height * 0.07,
//     borderRadius:      width * 0.053,
//     justifyContent:    'center',
//   },
//   newButton1: {
//     flexDirection:     'row',
//     alignItems:        'center',
//     alignSelf:         'center',
//     paddingVertical:   height * 0.018,
//     paddingHorizontal: width * 0.06,
//     width:             width * 0.8,
//     minHeight:         height * 0.07,
//     borderRadius:      width * 0.053,
//     justifyContent:    'center',
//   },
//   newText: {
//     fontSize:   scaleFont(18),
//     color:      '#fff',
//     fontWeight: '700',
//     flexShrink: 1,
//     textAlign:  'center',
//     flexWrap:   'nowrap',
//   },
//   ticketIcon: {
//     width:       width * 0.07,
//     height:      width * 0.07,
//     resizeMode:  'contain',
//     marginRight: width * 0.03,
//     flexShrink:  0,
//   },

//   buttonsWrapper: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     // 0.15 (original wrapper gap) + 0.08 (moved out of newButton1's own
//     // marginTop) — keeps the same visual spacing above PRACTICE, but now the
//     // gap lives outside the TutorialSpot-wrapped button so the highlight box
//     // hugs the button instead of including empty space above it.
//     marginTop: height * 0.23,
//   },

//   tableWrapper: {
//     flex:      1,
//     width:     '100%',
//     marginTop: height * 0.02,
//   },

//   offlineOverlay: {
//     flex:            1,
//     backgroundColor: 'rgba(0,0,0,0.82)',
//     justifyContent:  'center',
//     alignItems:      'center',
//   },
//   offlineModal:      { width: width * 0.88, borderRadius: 16, padding: 20 },
//   offlineTitle:      { color: '#fff', fontSize: scaleFont(18), fontWeight: '700', marginBottom: 16, textAlign: 'center' },
//   offlineBadgeCard: {
//     flexDirection:   'row',
//     alignItems:      'center',
//     backgroundColor: '#020617',
//     borderRadius:    12,
//     padding:         12,
//     marginBottom:    10,
//     borderWidth:     1,
//   },
//   offlineBadgeIcon:  { marginRight: 12, justifyContent: 'center', alignItems: 'center', width: 40 },
//   offlineBadgeTitle: { color: '#fff', fontWeight: '700', fontSize: scaleFont(14) },
//   offlineBadgeDesc:  { color: '#9CA3AF', fontSize: scaleFont(12), marginTop: 2 },
//   offlineBadgeClose: { padding: 4, marginLeft: 8 },
//   dismissAllBtn:     { marginTop: 14, backgroundColor: '#334155', borderRadius: 10, paddingVertical: 13, alignItems: 'center' },
//   dismissAllText:    { color: '#fff', fontWeight: '600', fontSize: scaleFont(15) },
// });


import { useNavigation, useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  PixelRatio,
  Modal,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useAppTranslation } from '../context/TranslationContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BadgePopup from './BadgePopup';
import { SvgUri } from 'react-native-svg';
import Icon from 'react-native-vector-icons/Ionicons';
import { useBadge } from '../context/BadgeContext';
import GameHistoryScreen, { HistoryTable } from './GameHistoryScreen';
import { useSocket } from '../context/Socket'; // ✅ NEW
import { TutorialTarget } from '../components/TutorialSpot'; // ✅ tutorial coach-marks (registry target)

const { width, height } = Dimensions.get('window');
const scaleFont = size => size * PixelRatio.getFontScale();

// ✅ Helper: derive difficulty from diffCode (e.g. "E2" → "easy")
const getDifficultyFromDiffCode = (diffCode) => {
  if (!diffCode) return 'easy';
  const letter = diffCode[0]?.toUpperCase();
  if (letter === 'E') return 'easy';
  if (letter === 'M') return 'medium';
  if (letter === 'H') return 'hard';
  return 'easy';
};

const Home = () => {
  const navigation = useNavigation();
  const insets     = useSafeAreaInsets();
  const { theme }  = useTheme();
  const { t }      = useAppTranslation();
  const socket     = useSocket(); // ✅ NEW

  // ─── Badge context ─────────────────────────────────────────────────────────
  const {} = useBadge() || {};

  // app-opened now fired once inside BadgeContext.reinitSocket() (called from
  // Login on auth). Home does nothing here — popups arrive purely via socket.

  // ─── Auth check ───────────────────────────────────────────────────────────
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) navigation.replace('Login');
      } catch (err) {
        console.error('❌ Auth check error:', err);
      }
    };
    checkAuth();
  }, [navigation]);

  // ✅ NEW — Rejoin active PVP game on app open
  // Handles two cases:
  // 1. rejoin-game fires AFTER Home mounts → caught by socket.on listener
  // 2. rejoin-game fired BEFORE Home mounted (during Splash) → caught by _pendingRejoinData stored in Socket.js
  useEffect(() => {
    if (!socket) return;

    const handleRejoinGame = (data) => {
      console.log('[HOME] 🔄 rejoin-game received:', data);

      const myPlayerId = data?.myPlayerId;
      const currentQuestion = data?.currentQuestion;
      const gameState = data?.gameState || {};
      const diffCode = gameState?.diffCode || null;
      const difficulty = getDifficultyFromDiffCode(diffCode);
      const totalGameTime = gameState?.totalGameTime || 60000;
      const timerSeconds = Math.round(totalGameTime / 1000);

      if (!currentQuestion || !myPlayerId) {
        console.warn('[HOME] ⚠️ rejoin-game missing required data, skipping navigation');
        return;
      }

      // Find opponent ID from playerScores
      const opponentId = Object.keys(gameState?.playerScores || {}).find(
        id => id !== myPlayerId,
      ) || 'unknown';

      console.log('[HOME] 🚀 Navigating to MultiPlayerGame via rejoin');
      navigation.navigate('MultiPlayerGame', {
        currentQuestion,
        myMongoId: myPlayerId,
        timer: timerSeconds,
        difficulty,
        diffCode,
        opponent: {
          id: opponentId,
          username: 'Opponent',
          rating: 1000,
          profilePic: null,
        },
        gameRoomId: data?.gameId || null,
        gameStartedAt: gameState?.gameStartedAt || null,
        totalGameTime,
        restoredMyScore: gameState?.playerScores?.[myPlayerId]?.score ?? 0,
        restoredOpponentScore: gameState?.playerScores?.[opponentId]?.score ?? 0,
      });
    };

    // ✅ Case 1: Listen for future rejoin-game events (Home already mounted)
    socket.on('rejoin-game', handleRejoinGame);

    // ✅ Case 2: Handle rejoin-game that fired before Home mounted (Splash → Home race condition)
    // Socket.js stores it in _pendingRejoinData for exactly this scenario
    if (socket._pendingRejoinData) {
      console.log('[HOME] 🔄 Found pending rejoin-game data from before Home mounted');
      const pendingData = socket._pendingRejoinData;
      socket._pendingRejoinData = null; // clear so it doesn't fire again
      handleRejoinGame(pendingData);
    }

    return () => {
      socket.off('rejoin-game', handleRejoinGame);
    };
  }, [socket]); // ✅ END NEW

  // ─── Main Content ──────────────────────────────────────────────────────────
  const Content = () => (
    <View style={[styles.contentContainer, { paddingTop: insets.top + 30 }]}>

      {/* Header */}
      <View style={[styles.headerRow, { paddingHorizontal: width * 0.04 }]}>
        <TouchableOpacity onPress={() => navigation.navigate('CommingSoon')}>
          <Image source={require('../assets/funcation.png')} style={styles.gridIcon} />
        </TouchableOpacity>
        <View style={styles.rightIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('')}>
            <Image source={require('../assets/setting.png')} style={styles.gridIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
            <Image source={require('../assets/profile.png')} style={styles.gridIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* PRACTICE Button — own tutorial step */}
      <View style={styles.buttonsWrapper}>
        <TutorialTarget id="home:practice">
          <TouchableOpacity
            onPress={() => navigation.navigate('PlayGame', { gametype: 'PRACTICE' })}
            style={[styles.newButton1, { backgroundColor: theme.primary || '#FB923C' }]}>
            <Image source={require('../assets/pluse.png')} style={styles.ticketIcon} />
            <Text style={styles.newText} numberOfLines={1} adjustsFontSizeToFit>
              {t('PRACTICE')}
            </Text>
          </TouchableOpacity>
        </TutorialTarget>

        {/* PLAY Button — highlighted together with BottomTab's Play-tab icon
            (same tutorial step, cross-component, via the registry) */}
        <TutorialTarget id="home:play">
          <TouchableOpacity
            onPress={() => navigation.navigate('PlayGame', { gametype: 'PLAY' })}
            style={[styles.newButton, { backgroundColor: theme.primary || '#FB923C' }]}>
            <Image source={require('../assets/pluse.png')} style={styles.ticketIcon} />
            <Text style={styles.newText} numberOfLines={1} adjustsFontSizeToFit>
              {t('PLAY')}
            </Text>
          </TouchableOpacity>
        </TutorialTarget>
      </View>

      {/* Full-width history table */}
      <View style={styles.tableWrapper}>
        <HistoryTable />
      </View>

    </View>
  );

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <View style={styles.safeArea}>
      {theme.backgroundGradient ? (
        <LinearGradient colors={theme.backgroundGradient} style={styles.container}>
          <Content />
        </LinearGradient>
      ) : (
        <View style={[styles.container, { backgroundColor: theme.backgroundColor || '#0B1220' }]}>
          <Content />
        </View>
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  safeArea:  { flex: 1 },
  container: { flex: 1 },

  contentContainer: {
    flex: 1,
  },

  headerRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginBottom:   height * 0.02,
  },
  rightIcons: { flexDirection: 'row', alignItems: 'center', gap: width * 0.04 },
  gridIcon: {
    width:        width * 0.08,
    height:       width * 0.08,
    resizeMode:   'contain',
    marginBottom: height * 0.015,
  },

  newButton: {
    flexDirection:     'row',
    alignItems:        'center',
    alignSelf:         'center',
    paddingVertical:   height * 0.018,
    paddingHorizontal: width * 0.06,
    marginTop:         height * 0.02,
    width:             width * 0.8,
    minHeight:         height * 0.07,
    borderRadius:      width * 0.053,
    justifyContent:    'center',
  },
  newButton1: {
    flexDirection:     'row',
    alignItems:        'center',
    alignSelf:         'center',
    paddingVertical:   height * 0.018,
    paddingHorizontal: width * 0.06,
    width:             width * 0.8,
    minHeight:         height * 0.07,
    borderRadius:      width * 0.053,
    justifyContent:    'center',
  },
  newText: {
    fontSize:   scaleFont(18),
    color:      '#fff',
    fontWeight: '700',
    flexShrink: 1,
    textAlign:  'center',
    flexWrap:   'nowrap',
  },
  ticketIcon: {
    width:       width * 0.07,
    height:      width * 0.07,
    resizeMode:  'contain',
    marginRight: width * 0.03,
    flexShrink:  0,
  },

  buttonsWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.23,
  },

  tableWrapper: {
    flex:      1,
    width:     '100%',
    marginTop: height * 0.02,
  },

  offlineOverlay: {
    flex:            1,
    backgroundColor: 'rgba(0,0,0,0.82)',
    justifyContent:  'center',
    alignItems:      'center',
  },
  offlineModal:      { width: width * 0.88, borderRadius: 16, padding: 20 },
  offlineTitle:      { color: '#fff', fontSize: scaleFont(18), fontWeight: '700', marginBottom: 16, textAlign: 'center' },
  offlineBadgeCard: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: '#020617',
    borderRadius:    12,
    padding:         12,
    marginBottom:    10,
    borderWidth:     1,
  },
  offlineBadgeIcon:  { marginRight: 12, justifyContent: 'center', alignItems: 'center', width: 40 },
  offlineBadgeTitle: { color: '#fff', fontWeight: '700', fontSize: scaleFont(14) },
  offlineBadgeDesc:  { color: '#9CA3AF', fontSize: scaleFont(12), marginTop: 2 },
  offlineBadgeClose: { padding: 4, marginLeft: 8 },
  dismissAllBtn:     { marginTop: 14, backgroundColor: '#334155', borderRadius: 10, paddingVertical: 13, alignItems: 'center' },
  dismissAllText:    { color: '#fff', fontWeight: '600', fontSize: scaleFont(15) },
});