


import { React, useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  PixelRatio,
  Animated,
  Easing,
  Image, // ✅ NEW: added Image import
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import BadgePopup from './BadgePopup';
import OfflineBadgesModal from './OfflineBadgesModal';
import { useBadge } from '../context/BadgeContext';

const { width, height } = Dimensions.get('window');
const scale = size => (width / 375) * size;
const scaleFont = size => size * PixelRatio.getFontScale();

const MultiplayerResultScreen = ({ route }) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { theme } = useTheme();

  const { earnedBadges, setEarnedBadges, showBadges } = useBadge();
  console.log('[🏅 MultiplayerResultScreen] Badge context loaded:', { earnedBadges, showBadges });

  // State
  const [gameResult, setGameResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [user, setUser] = useState(null);

  const [rematchRequested, setRematchRequested] = useState(false);
  const [rematchAccepted, setRematchAccepted] = useState(false);
  const [opponentName, setOpponentName] = useState('Opponent');

  const [offlineBadges, setOfflineBadges] = useState([]);
  console.log('[🏅 MultiplayerResultScreen] Offline badges state:', offlineBadges);

  const [resultAnimationDone, setResultAnimationDone] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  /* ================= ROUTE PARAMS ================= */
  const {
    totalScore,
    opponentScore,
    player2Id,
    durationSeconds,
    correctCount,
    inCorrectCount,
    skippedQuestions,
    correctPercentage,
    opponentUsername,
    // ✅ NEW: destructure profileImage fields passed from MultiPlayerGame
    opponentProfileImage,
  } = route.params;

  /* ================= GET LOGIN DATA ================= */
  useEffect(() => {
    const getLoginData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userData');
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        setUser(parsedUser);
        if (opponentUsername) setOpponentName(opponentUsername);
      } catch (err) {
        console.log('AsyncStorage Error:', err?.message);
        setIsProcessing(false);
      }
    };
    getLoginData();
  }, [opponentUsername]);

  /* ================= RESULT + ANIMATION ================= */
  useEffect(() => {
    const determineResult = () => {
      if (totalScore > opponentScore) return 'win';
      if (totalScore < opponentScore) return 'lose';
      return 'draw';
    };

    const result = determineResult();
    setGameResult(result);
    setIsProcessing(false);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5)),
      }),
    ]).start(() => {
      console.log('[🏅 MultiplayerResultScreen] Result animation complete, waiting for badge processing...');
      setTimeout(() => {
        console.log('[🏅 MultiplayerResultScreen] Setting resultAnimationDone = true, current earnedBadges:', earnedBadges);
        setResultAnimationDone(true);
      }, 800);
    });
  }, [totalScore, opponentScore]);

  /* ================= OFFLINE BADGES FROM CONTEXT ================= */
  useEffect(() => {
    console.log('[🏅 MultiplayerResultScreen] Earned badges updated:', earnedBadges);
  }, [earnedBadges]);

  useEffect(() => {
    console.log('[🏅 MultiplayerResultScreen] Result animation done:', resultAnimationDone);
    console.log('[🏅 MultiplayerResultScreen] Should show badge popup?', resultAnimationDone && earnedBadges.length > 0);
  }, [resultAnimationDone]);

  /* ================= REMATCH HANDLERS ================= */
  const handleRequestRematch = () => {
    navigation.replace('WaitingForOpponent', {
      challengedUser: {
        username: opponentName,
        id: player2Id,
        _id: player2Id,
      },
      diff: route.params.difficulty,
      timer: route.params.durationSeconds || route.params.timer || 60,
      symbol: route.params.symbol,
    });
  };

  /* ================= UI HELPERS ================= */
  const getResultColor = () => {
    switch (gameResult) {
      case 'win': return '#4ade80';
      case 'lose': return '#f87171';
      case 'draw': return '#fbbf24';
      default: return '#ffffff';
    }
  };

  const getResultEmoji = () => {
    switch (gameResult) {
      case 'win': return '🏆';
      case 'lose': return '😥';
      case 'draw': return '🤝';
      default: return '🎮';
    }
  };

  /* ================= LOADING STATE ================= */
  if (!gameResult) {
    return (
      <View style={[styles.mainContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#fff', fontSize: 16 }}>Loading result...</Text>
      </View>
    );
  }

  /* ================= RENDER ================= */
  return (
    <View style={styles.mainContainer}>
      <LinearGradient
        colors={theme.backgroundGradient || ['#0B1220', '#0B1220']}
        style={styles.background}
      />

      {/* FULL SCREEN RESULT UI */}
      <View style={styles.newModalContainer}>

        {/* Header: Close & Share */}
        <View style={styles.modalHeader}>
          <TouchableOpacity
            onPress={() => navigation.navigate('BottomTab')}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Icon name="close" size={28} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => console.log('Share pressed')}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Icon name="share-social-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Result Content */}
        <Animated.View
          style={[
            styles.newResultContent,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <View style={[styles.resultBadge, { backgroundColor: getResultColor(), marginTop: 40 }]}>
            <Text style={styles.resultBadgeText}>
              {gameResult === 'win' ? 'VICTORY' : gameResult === 'lose' ? 'DEFEAT' : 'DRAW'}
            </Text>
          </View>

          <Text style={[styles.resultTitle, { color: getResultColor(), fontSize: 32 }]}>
            {gameResult === 'win' ? 'You Won!' : gameResult === 'lose' ? 'You Lost!' : 'Draw!'}
          </Text>

          <Text style={{ fontSize: 60, marginTop: 20 }}>{getResultEmoji()}</Text>

          {/* Scores Row */}
          <View style={[styles.playersRow, { marginTop: 40, justifyContent: 'space-around' }]}>
            {/* Player */}
            <View style={styles.playerSide}>
              <View style={styles.playerHeader}>
                <Text style={styles.starIcon}>⭐</Text>
                <Text style={styles.labelTitle}>YOU</Text>
              </View>
              {/* ✅ NEW: show my profile pic if available */}
              {user?.profilePic ? (
                <Image
                  source={{ uri: user.profilePic }}
                  style={styles.playerAvatar}
                  onError={() => {}}
                />
              ) : null}
              <Text
                style={[
                  styles.mainScore,
                  gameResult === 'win' && { color: '#4ade80' },
                  gameResult === 'draw' && { color: '#fbbf24' },
                ]}
              >
                {totalScore}
              </Text>
            </View>

            {/* VS Badge */}
            <View
              style={[
                styles.vsBadge,
                gameResult === 'draw' && { backgroundColor: '#fbbf24', borderColor: '#fbbf24' },
              ]}
            >
              <Text style={styles.vsText}>{gameResult === 'draw' ? '=' : 'VS'}</Text>
            </View>

            {/* Opponent */}
            <View style={styles.opponentSide}>
              <View style={styles.playerHeader}>
                <Text style={styles.labelTitle}>OPPONENT</Text>
              </View>
              {/* ✅ NEW: show opponent profile image from socket event data */}
              {opponentProfileImage ? (
                <Image
                  source={{ uri: opponentProfileImage }}
                  style={styles.playerAvatar}
                  onError={() => {}}
                />
              ) : null}
              <Text
                style={[
                  styles.mainScore,
                  gameResult === 'lose' && { color: '#f87171' },
                  gameResult === 'draw' && { color: '#fbbf24' },
                ]}
              >
                {opponentScore}
              </Text>
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{correctCount || 0}</Text>
              <Text style={styles.statLabel}>Correct</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{inCorrectCount || 0}</Text>
              <Text style={styles.statLabel}>Wrong</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{skippedQuestions || 0}</Text>
              <Text style={styles.statLabel}>Skipped</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{correctPercentage || 0}%</Text>
              <Text style={styles.statLabel}>Accuracy</Text>
            </View>
          </View>
        </Animated.View>

        {/* Bottom Buttons */}
        <View style={styles.bottomButtonsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.rematchButton]}
            onPress={handleRequestRematch}
          >
            <Text style={styles.actionButtonText}>Rematch</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.newGameButton]}
            onPress={() => navigation.navigate('ChallengeScreen')}
          >
            <Text style={styles.actionButtonText}>New Game</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ================= BADGE POPUP ================= */}
      {resultAnimationDone && earnedBadges.length > 0 && (
        <>
          {console.log('[🏅 MultiplayerResultScreen] Rendering BadgePopup with badges:', earnedBadges)}
          <BadgePopup
            badges={earnedBadges}
            onFinish={() => {
              console.log('[🏅 MultiplayerResultScreen] Badge popup finished, clearing badges');
              setEarnedBadges([]);
            }}
          />
        </>
      )}

      {/* ================= OFFLINE BADGES MODAL ================= */}
      {offlineBadges.length > 0 && (
        <>
          {console.log('[🏅 MultiplayerResultScreen] Rendering OfflineBadgesModal with badges:', offlineBadges)}
          <OfflineBadgesModal
            badges={offlineBadges}
            onDismiss={() => {
              console.log('[🏅 MultiplayerResultScreen] Offline badges dismissed');
              setOfflineBadges([]);
            }}
          />
        </>
      )}
    </View>
  );
};

export default MultiplayerResultScreen;

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },

  // ✅ NEW: avatar style for player/opponent images in scores row
  playerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 6,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
  },

  // Result badge (VICTORY / DEFEAT / DRAW pill)
  resultBadge: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
    marginTop: -10,
  },
  resultBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
  },

  // Players row
  playersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 30,
  },
  playerSide: { flex: 1, alignItems: 'center' },
  opponentSide: { flex: 1, alignItems: 'center' },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  starIcon: { fontSize: 12, marginRight: 4, color: '#FFD700' },
  labelTitle: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  mainScore: { fontSize: 32, fontWeight: '700', color: '#fff' },
  vsBadge: {
    position: 'absolute',
    left: '50%',
    top: 10,
    marginLeft: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  vsText: { color: '#fff', fontWeight: '900', fontSize: 14 },

  // Stats
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginTop: 10,
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: '#fff',
    fontSize: scaleFont(16),
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    color: '#64748b',
    fontSize: scaleFont(10),
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#334155',
  },

  // Result title
  resultTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },

  // New modal layout
  newModalContainer: {
    flex: 1,
    paddingTop: 50,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  newResultContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 15,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rematchButton: {
    backgroundColor: '#8B5CF6',
  },
  newGameButton: {
    backgroundColor: '#3B82F6',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});