import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  PixelRatio,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useAppTranslation } from '../context/TranslationContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BadgePopup from './BadgePopup';
import { authFetch as fetch } from '../utils/authFetch'; // auto-refresh wrapper for expired access tokens

const { width, height } = Dimensions.get('window');
const scale = size => (width / 375) * size;
const scaleFont = size => size * PixelRatio.getFontScale();

const BASE_URL = 'http://13.203.232.239:3000';

// ─── Badge Helpers ────────────────────────────────────────────────────────────

/**
 * Returns true if earnedAt is within the last `withinSeconds` seconds.
 */
const isJustEarned = (earnedAt, withinSeconds = 60) => {
  if (!earnedAt) return false;
  const diff = (Date.now() - new Date(earnedAt).getTime()) / 1000;
  return diff <= withinSeconds;
};

// Practice badge IDs: 9, 10, 11, 12, 13
const PRACTICE_BADGE_IDS = [9, 10, 11, 12, 13];

// ✅ CHANGED: No longer POSTs to endMatch — MathInputScreen already did that.
// This only fetches the earned badge list and returns any recently-earned
// practice badges to display in the popup.
const checkPracticeBadges = async () => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      console.warn('[Badge] No auth token — skipping practice badge check.');
      return [];
    }

    // GET /api/badges/my/earned
    const badgeRes = await fetch(`${BASE_URL}/api/badges/my/earned`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const myBadges = await badgeRes.json();
    console.log('[Badge] my/earned response:', JSON.stringify(myBadges, null, 2));
    console.log('[Badge] Total badge count:', myBadges?.badges?.length || 0);

    if (!myBadges?.badges || myBadges.badges.length === 0) {
      console.log('[Badge] No badges in response');
      return [];
    }

    // Keep only badges that were just earned AND are practice badge IDs
    const recentBadges = myBadges.badges.filter(b => {
      const recent = isJustEarned(b.earnedAt);
      const isPracticeBadge = PRACTICE_BADGE_IDS.includes(b.badgeId);
      console.log(
        `[Badge] ID ${b.badgeId} ("${b.title}") | earnedAt: ${b.earnedAt} | isJustEarned: ${recent} | isPracticeBadge: ${isPracticeBadge}`
      );
      return recent && isPracticeBadge;
    });

    console.log(
      `[Badge] Checked: ${myBadges.badges.length} | Recent practice badges: ${recentBadges.length}`
    );

    if (recentBadges.length > 0) {
      console.log('[Badge] 🏅 Badges to show:', recentBadges.map(b => b.title));
    } else {
      console.log('[Badge] ℹ️ No recent practice badges earned.');
    }

    // Normalize to shape BadgePopup expects
    return recentBadges.map(b => ({
      id:          b.badgeId,
      title:       b.title,
      description: b.description,
      icon:        b.iconName,
      iconUrl:     b.iconUrl,
      color:       '#FFD700',
    }));

  } catch (err) {
    console.error('[Badge] Practice badge check error:', err.message);
    return [];
  }
};

// ─────────────────────────────────────────────────────────────────────────────

const WellDoneScreen = ({ route }) => {
  const insets     = useSafeAreaInsets();
  const navigation = useNavigation();
  const { theme }  = useTheme();
  const { t }      = useAppTranslation();

  const {
    totalScore,
    correctCount,
    inCorrectCount,
    skippedQuestions,
    correctPercentage,
    difficulty,
    incorrectCount,
    skippedCount,
  } = route.params;

  // ── Badge state ─────────────────────────────────────────────────────────
  const [earnedBadges,   setEarnedBadges]   = useState([]);
  const [showBadgePopup, setShowBadgePopup] = useState(false);
  const badgeFiredRef = useRef(false); // fire only once per screen mount

  // ✅ CHANGED: only checks for badges — endMatch was already called by
  // MathInputScreen before navigation.replace('WellDoneScreen', ...).
  // Calling it again here would double-count the match in the backend.
  useEffect(() => {
    if (badgeFiredRef.current) return;
    badgeFiredRef.current = true;

    console.log('[Badge] WellDoneScreen mounted — checking for newly earned practice badges...');

    checkPracticeBadges()
      .then(badges => {
        if (badges.length > 0) {
          setEarnedBadges(badges);
          setShowBadgePopup(true);
        }
      })
      .catch(err => console.error('[Badge] Error in badge check:', err));
  }, []);

  // ── Stat rows ────────────────────────────────────────────────────────────
  const stats = [
    { label: t('Total Score'),        value: totalScore },
    { label: t('Correct Count'),      value: correctCount },
    { label: t('Incorrect Count'),    value: inCorrectCount },
    { label: t('Skipped Questions'),  value: skippedQuestions },
    { label: t('Correct Percentage'), value: `${correctPercentage}%` },
  ];

  // ── UI ───────────────────────────────────────────────────────────────────
  const Content = () => (
    <ScrollView
      contentContainerStyle={[styles.container, { paddingTop: insets.top + 20 }]}
    >
      <ConfettiCannon
        count={150}
        origin={{ x: width / 2, y: 0 }}
        fadeOut
        autoStart
        fallSpeed={4000}
      />

      <Text style={styles.title}>{t('Well Done')}</Text>

      {stats.map((stat, i) => (
        <View
          key={i}
          style={[styles.scoreBox, { backgroundColor: theme.cardBackground || '#1E293B' }]}
        >
          <Text style={styles.label}>{stat.label}</Text>
          <Text style={styles.value}>{stat.value}</Text>
        </View>
      ))}

      <LinearGradient
        colors={[theme.primary || '#FB923C', theme.primary || '#FF7F50']}
        style={styles.newGameBtn}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('BottomTab', {
              screen: 'Home',
              params: { screen: 'PlayGame', params: { gametype: 'PRACTICE' } },
            })
          }
          style={{ width: '100%', alignItems: 'center' }}
        >
          <Text style={styles.newGameText}>{t('New Game')}</Text>
        </TouchableOpacity>
      </LinearGradient>

      <TouchableOpacity
        onPress={() => navigation.navigate('BottomTab')}
        style={[styles.homeBtn, { backgroundColor: theme.cardBackground || '#fff' }]}
      >
        <Text style={[styles.homeText, { color: '#fff' }]}>{t('Home')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Badge popup — renders above everything */}
      {showBadgePopup && earnedBadges.length > 0 && (
        <BadgePopup
          badges={earnedBadges}
          onFinish={() => {
            setShowBadgePopup(false);
            setEarnedBadges([]);
          }}
        />
      )}

      {theme.backgroundGradient ? (
        <LinearGradient colors={theme.backgroundGradient} style={{ flex: 1 }}>
          <Content />
        </LinearGradient>
      ) : (
        <View style={{ flex: 1, backgroundColor: '#0B1220' }}>
          <Content />
        </View>
      )}
    </View>
  );
};

export default WellDoneScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow:        1,
    alignItems:      'center',
    paddingVertical: height * 0.08,
  },
  title: {
    fontSize:     scaleFont(30),
    color:        '#fff',
    fontWeight:   '700',
    marginBottom: height * 0.1,
    marginTop:    height * 0.1,
  },
  scoreBox: {
    width:             '80%',
    borderRadius:      scale(12),
    paddingVertical:   height * 0.015,
    paddingHorizontal: width * 0.05,
    flexDirection:     'row',
    justifyContent:    'space-between',
    marginBottom:      height * 0.015,
  },
  label: {
    color:      '#B0BEC5',
    fontSize:   scaleFont(14),
    fontWeight: '600',
  },
  value: {
    color:      '#fff',
    fontSize:   scaleFont(16),
    fontWeight: '700',
  },
  newGameBtn: {
    width:           '60%',
    borderRadius:    scale(30),
    paddingVertical: height * 0.012,
    alignItems:      'center',
    marginTop:       height * 0.06,
    overflow:        'hidden',
  },
  newGameText: {
    color:      '#fff',
    fontSize:   scaleFont(18),
    fontWeight: 'bold',
  },
  homeBtn: {
    width:           '60%',
    borderRadius:    scale(30),
    paddingVertical: height * 0.015,
    alignItems:      'center',
    marginTop:       height * 0.02,
  },
  homeText: {
    fontSize:   scaleFont(18),
    fontWeight: 'bold',
  },
});