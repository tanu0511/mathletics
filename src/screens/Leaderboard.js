import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  PixelRatio,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomHeader from '../components/CustomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppTranslation } from '../context/TranslationContext';
// import BadgePopup from './BadgePopup';
import { useBadge } from '../context/BadgeContext';

import { authFetch as fetch } from '../utils/authFetch'; // auto-refresh wrapper for expired access tokens

const { width, height } = Dimensions.get('window');
const fontScale = PixelRatio.getFontScale();
const scaleFont = size => size * fontScale;
const scaleSize = size => Math.round(size * Math.max(1, fontScale * 0.75));

const BASE_URL = 'http://13.203.232.239:3000';

// ─── Page-Visited Helper ──────────────────────────────────────────────────────
export const trackPageVisit = async (page) => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    await fetch(`${BASE_URL}/api/badges/event/page-visited`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ page }),
    });
  } catch (err) {
    console.warn('[trackPageVisit] failed:', err.message);
  }
};
// ─────────────────────────────────────────────────────────────────────────────

// Filter keys are always English internally — translation is display-only
const FILTER_KEYS = ['Global', 'Country', 'Friends'];

// ────────────────────────────────────────────────────────────────────────────

const Leaderboard = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { t, currentLanguage } = useAppTranslation();

  const [selectedTab, setSelectedTab] = useState('E2');
  const [selectedFilter, setSelectedFilter] = useState('Friends'); // always English key
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // ── Badge state ─────────────────────────────────────────────────────────────
  // const [earnedBadges, setEarnedBadges] = useState([]);
  const badgeFiredRef = useRef(false); // fire only once per screen lifetime
const { showBadges } = useBadge();

  /* ================= API ================= */

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('accessToken');

      if (!token) {
        console.warn('[Leaderboard] No auth token — aborting fetch.');
        setLeaderboardData([]);
        return;
      }

      let url = '';

      if (selectedFilter === 'Friends') {
        url = `${BASE_URL}/api/leaderboard/friends?diffCode=${selectedTab}`;
      } else if (selectedFilter === 'Country') {
        url = `${BASE_URL}/api/leaderboard/country?diffCode=${selectedTab}`;
      } else {
        url = `${BASE_URL}/api/leaderboard/global?diffCode=${selectedTab}&limit=10`;
      }

      console.log('[Leaderboard] Fetching:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      // ── Debug: log the full response so you can verify field names ──
      console.log('[Leaderboard] Raw response:', JSON.stringify(result, null, 2));

      if (response.ok && result?.success) {
        let combined = [];

        if (selectedFilter === 'Friends') {
          combined = result?.leaderboard?.friends || [];
          setCurrentUser(result?.leaderboard?.currentPlayer || null);
        } else {
          // Global & Country both use leaderboard.top
          combined = result?.leaderboard?.top || [];
          setCurrentUser(result?.leaderboard?.currentPlayer || null);
        }

        console.log('[Leaderboard] Parsed rows:', combined.length, combined[0]);
        setLeaderboardData(combined);
      } else {
        console.warn('[Leaderboard] API error:', result?.message, 'status:', response.status);
        setLeaderboardData([]);
      }
    } catch (error) {
      console.log('[Leaderboard] Network error:', error);
      setLeaderboardData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedFilter, selectedTab]); // ← both deps here so closure is never stale

  // Re-fetch whenever filter or tab changes
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  // ── Badge: fire page-visited "leaderboard" once on first mount ───────────────
  useEffect(() => {
    if (badgeFiredRef.current) return;
    badgeFiredRef.current = true;

    const runBadge = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          console.warn('[Badge] No auth token found — skipping leaderboard badge.');
          return;
        }

        const response = await fetch(`${BASE_URL}/api/badges/event/page-visited`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ page: 'leaderboard' }),
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        console.log('[Badge] page-visited "leaderboard" response:', JSON.stringify(data, null, 2));

        const rawBadges = Array.isArray(data?.newlyEarned) ? data.newlyEarned : [];
          showBadges(rawBadges);

      } catch (err) {
        console.warn('[Badge] leaderboard page-visited error:', err.message);
      }
    };

    runBadge();
  }, []);

  /* ================= TAB BAR ================= */
  useEffect(() => {
    navigation.setOptions({
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
  }, [navigation]);

  /* ================= HELPERS ================= */

  const getInitial = name => name?.charAt(0)?.toUpperCase() || '?';

  // New API returns rating directly per diffCode — no need to map from user.pr
  const getUserRating = user => user?.rating ?? 0;

  const getTabLabel = tab => {
    if (currentLanguage === 'en') return tab;
    const map = { E: t('Easy'), M: t('Medium'), H: t('Hard') };
    return `${map[tab[0]]} ${tab[1]}`;
  };

  /* ================= UI ================= */

  const Content = () => (
    <View style={{ flex: 1, paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10 }}>
       <View style={{ paddingTop: 20 }}>
          <CustomHeader
            title={'LEADERBOARD'}
            onBack={() => navigation.goBack()}
          />
        </View>
      <View
        style={[
          styles.container,
          { backgroundColor: theme.backgroundColor || '#0F172A' },
        ]}
      >
        {/* Tabs */}
        <View style={styles.tabRow}>
          {['E2', 'E4', 'M2', 'M4', 'H2', 'H4'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, selectedTab === tab && styles.activeTab]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text style={styles.tabText} numberOfLines={1} adjustsFontSizeToFit>
                {getTabLabel(tab)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Filters */}
        <View
          style={[
            styles.filterContainer,
            { backgroundColor: theme.cardBackground || '#1E293B' },
          ]}
        >
          {FILTER_KEYS.map(filterKey => (
            <TouchableOpacity
              key={filterKey}
              style={[
                styles.filterBtn,
                selectedFilter === filterKey && {
                  backgroundColor: theme.primaryColor || '#FB923C',
                },
              ]}
              onPress={() => setSelectedFilter(filterKey)}
            >
              <Text style={styles.filterText} numberOfLines={1} adjustsFontSizeToFit>
                {t(filterKey)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Table Header */}
        <View
          style={[
            styles.tableHeader,
            { backgroundColor: theme.primaryColor || '#0369A1' },
          ]}
        >
          <Text style={[styles.headerCell, { flex: 0.2 }]}>{t('Rank')}</Text>
          <Text style={[styles.headerCell, { flex: 0.55, textAlign: 'center', paddingLeft: 40 }]}>
            {t('User Name')}
          </Text>
          <Text style={[styles.headerCell, { flex: 0.3 }]}>{t('Rating')}</Text>
        </View>

        {/* Table Body */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {loading ? (
            <Text style={styles.loadingText}>{t('Loading...')}</Text>
          ) : leaderboardData.length === 0 ? (
            <Text style={styles.loadingText}>{t('No data found')}</Text>
          ) : (
            leaderboardData.map((user, index) => (
              <View
                key={`${user.userId}-${index}`}
                style={[
                  styles.tableRow,
                  {
                    backgroundColor:
                      index % 2 === 0
                        ? theme.cardBackground
                        : theme.backgroundColor,
                  },
                ]}
              >
                {/* Rank */}
                <Text style={[styles.cell, { flex: 0.2 }]} numberOfLines={1}>
                  {user.rank}
                </Text>

                {/* Username */}
                <TouchableOpacity
                  style={{
                    flex: 0.55,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => navigation.navigate('UserProfile', { userId: user.userId })}
                >
                  {user.profileImage ? (
                    <Image
                      source={{ uri: user.profileImage }}
                      style={styles.avatar}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{getInitial(user.username)}</Text>
                    </View>
                  )}

                  <View
                    style={{
                      flex: 0.55,
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingHorizontal: 4,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => navigation.navigate('UserProfile', { userId: user.userId })}
                    >
                      <Text style={styles.usernameText} numberOfLines={1}>
                        {user.username}
                      </Text>
                    </TouchableOpacity>
                    <Text style={styles.countryText} numberOfLines={1}>
                      {user.country || '—'}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Rating */}
                <Text style={[styles.cell, { flex: 0.3 }]}>{getUserRating(user)}</Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );

  const MainContent = () =>
    theme.backgroundGradient ? (
      <LinearGradient colors={theme.backgroundGradient} style={{ flex: 1 }}>
        <Content />
      </LinearGradient>
    ) : (
      <View style={{ flex: 1 }}>
        <Content />
      </View>
    );

  return (
    <View style={{ flex: 1 }}>
      
      <MainContent />
    </View>
  );
};

export default Leaderboard;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: height * 0.02,
  },
  tab: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: scaleSize(10),
    backgroundColor: '#1b1b3a',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: scaleSize(36),
  },
  activeTab: {
    backgroundColor: '#4e54c8',
  },
  tabText: {
    color: '#fff',
    fontSize: scaleFont(12),
    fontWeight: '600',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: scaleSize(12),
    paddingHorizontal: 8,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  filterBtn: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: scaleSize(6),
    borderRadius: 20,
    minHeight: scaleSize(32),
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterText: {
    fontSize: scaleFont(11),
    color: '#fff',
    fontWeight: '600',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: scaleSize(12),
    borderRadius: 6,
    marginBottom: 6,
    alignItems: 'center',
    minHeight: scaleSize(40),
  },
  headerCell: {
    fontSize: scaleFont(12),
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: scaleSize(12),
    alignItems: 'center',
    minHeight: scaleSize(52),
  },
  cell: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: scaleFont(12),
  },
  avatar: {
    width: scaleSize(36),
    height: scaleSize(36),
    borderRadius: scaleSize(18),
    backgroundColor: '#4e54c8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: scaleFont(14),
  },
  usernameText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: scaleFont(12),
  },
  countryText: {
    color: '#fff',
    opacity: 0.7,
    fontSize: scaleFont(10),
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
    fontSize: scaleFont(13),
  },
});