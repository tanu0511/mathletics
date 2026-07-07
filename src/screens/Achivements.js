






import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  PixelRatio,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomHeader from '../components/CustomHeader';
import { useAppTranslation } from '../context/TranslationContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SvgUri } from 'react-native-svg';
import AchievementDetailPopup from './AchivementDetail';
import { authFetch as fetch } from '../utils/authFetch'; // auto-refresh wrapper for expired access tokens

const fontScale = PixelRatio.getFontScale();
const scaleFont = size => size / fontScale;

// ── Responsive helpers ─────────────────────────────────────────────────────────
// Returns number of columns based on screen width:
//   < 360  → 3 cols  (small phones)
//   < 600  → 4 cols  (normal phones — original)
//  >= 600  → 5 cols  (large phones / tablets)
const getNumColumns = screenWidth => {
  if (screenWidth < 360) return 3;
  if (screenWidth < 600) return 4;
  return 5;
};

const BASE_URL = 'http://13.203.232.239:3000';
const getToken = () => AsyncStorage.getItem('accessToken');

const CATEGORY_TABS = [
  { key: 'all',      label: 'All'      },
  { key: 'pvp',      label: 'PvP'      },
  { key: 'practice', label: 'Practice' },
  { key: 'streak',   label: 'Streak'   },
  { key: 'social',   label: 'Social'   },
];

const groupByCategory = badges => {
  const map = {};
  badges.forEach(b => {
    const cat = b.category || 'other';
    if (!map[cat]) map[cat] = [];
    map[cat].push(b);
  });
  return map;
};

// ─── BADGE CELL ───────────────────────────────────────────────────────────────
// cellSize is passed in so every cell has the exact same fixed dimensions,
// preventing stretching / misalignment regardless of label length.
const BadgeCell = ({ badge, onPress, cellSize }) => {
  const isEarned  = badge.isEarned  ?? false;
  const progress  = badge.progress  ?? 0;
  const hasTarget = badge.targetCount != null;

  const iconSize = Math.round(cellSize * 0.44);   // ~44% of cell width
  const fontSize = Math.max(8, Math.round(cellSize * 0.11));

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[cellStyles.cell, { width: cellSize, minHeight: cellSize * 1.3 }]}
    >
      {/* Icon */}
      <View style={[cellStyles.iconWrap, { width: iconSize, height: iconSize }, !isEarned && cellStyles.iconDim]}>
        {badge.iconUrl ? (
          <SvgUri uri={badge.iconUrl} width={iconSize} height={iconSize} />
        ) : (
          <Text style={{ fontSize: iconSize * 0.65 }}>🏅</Text>
        )}
      </View>

      {/* Title — fixed 2-line area so all badges are the same height */}
      <Text
        style={[cellStyles.title, { fontSize: scaleFont(fontSize) }, !isEarned && cellStyles.titleDim]}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {badge.title}
      </Text>

      {/* Progress bar — only shown for unearned badges that have a target */}
      {hasTarget && !isEarned ? (
        <View style={cellStyles.progressArea}>
          <View style={[cellStyles.track, { width: cellSize * 0.72 }]}>
            <View style={[cellStyles.fill, { width: `${Math.min(progress, 100)}%` }]} />
          </View>
          <Text style={[cellStyles.countLabel, { fontSize: scaleFont(Math.max(7, fontSize - 2)) }]}>
            {badge.currentCount ?? 0}/{badge.targetCount}
          </Text>
        </View>
      ) : (
        // Placeholder so earned badges occupy the same vertical space
        <View style={cellStyles.progressArea} />
      )}
    </TouchableOpacity>
  );
};

// ─── CATEGORY SECTION ─────────────────────────────────────────────────────────
const CategorySection = ({ category, badges, onBadgePress, theme, numColumns, cellSize }) => {
  const earned = badges.filter(b => b.isEarned).length;
  const label  = category.charAt(0).toUpperCase() + category.slice(1);

  // Pad badges array so the last row is always full (avoids orphan cells stretching)
  const remainder = badges.length % numColumns;
  const padCount  = remainder === 0 ? 0 : numColumns - remainder;
  const padded    = [...badges, ...Array(padCount).fill(null)];

  return (
    <View style={sectionStyles.wrapper}>
      <Text style={[sectionStyles.header, { color: theme.textColor || '#fff' }]}>
        {label} ({earned}/{badges.length})
      </Text>

      {/* Grid built with flex-wrap rows for pixel-perfect alignment */}
      <View style={sectionStyles.grid}>
        {padded.map((badge, idx) => {
          const col        = idx % numColumns;
          const row        = Math.floor(idx / numColumns);
          const totalRows  = Math.ceil(padded.length / numColumns);
          const isLastCol  = col === numColumns - 1;
          const isLastRow  = row === totalRows - 1;

          return (
            <View
              key={badge ? badge.badgeId : `pad-${idx}`}
              style={[
                sectionStyles.cellWrap,
                { width: cellSize },
              ]}
            >
              {badge ? (
                <BadgeCell
                  badge={badge}
                  onPress={() => onBadgePress(badge)}
                  cellSize={cellSize}
                />
              ) : (
                // Empty padding cell — same size, invisible
                <View style={{ width: cellSize, minHeight: cellSize * 1.3 }} />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

// ─── MAIN SCREEN ──────────────────────────────────────────────────────────────
const Achivements = () => {
  const navigation           = useNavigation();
  const { theme }            = useTheme();
  const insets               = useSafeAreaInsets();
  const { t }                = useAppTranslation();
  const { width: screenWidth } = useWindowDimensions();   // ← live, updates on rotation

  const [selectedTab,   setSelectedTab]   = useState('all');
  const [myBadges,      setMyBadges]      = useState([]);
  const [summary,       setSummary]       = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [refreshing,    setRefreshing]    = useState(false);
  const [error,         setError]         = useState(null);
  const [popupVisible,  setPopupVisible]  = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);

  // ── Compute responsive grid dimensions ──────────────────────────────────────
  const HORIZONTAL_PADDING = screenWidth * 0.045 * 2;  // mirrors container paddingHorizontal
  const numColumns = getNumColumns(screenWidth);
  const cellSize   = Math.floor((screenWidth - HORIZONTAL_PADDING) / numColumns);

  const handleBadgePress = badge => { setSelectedBadge(badge); setPopupVisible(true); };
  const handleClosePopup = () => { setPopupVisible(false); setSelectedBadge(null); };

  const fetchBadges = useCallback(async () => {
    try {
      setError(null);
      const token = await getToken();

      const defRes  = await fetch(`${BASE_URL}/api/badges/all`);
      const defData = await defRes.json();
      if (!defData.success) throw new Error('Failed to load badge definitions');

      if (token) {
        const myRes  = await fetch(`${BASE_URL}/api/badges/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const myData = await myRes.json();
        if (myData.success) {
          setMyBadges(myData.badges);
          setSummary(myData.summary);
        } else {
          setMyBadges(defData.badges.map(b => ({ ...b, isEarned: false, progress: 0, currentCount: 0 })));
        }
      } else {
        setMyBadges(defData.badges.map(b => ({ ...b, isEarned: false, progress: 0, currentCount: 0 })));
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchBadges(); }, [fetchBadges]);

  const onRefresh = () => { setRefreshing(true); fetchBadges(); };

  const grouped     = groupByCategory(myBadges);
  const earnedTotal = summary?.earned     ?? myBadges.filter(b => b.isEarned).length;
  const totalCount  = summary?.total      ?? myBadges.length;
  const percentage  = summary?.percentage ?? (totalCount ? Math.round((earnedTotal / totalCount) * 100) : 0);

  const availableCategories = Object.keys(grouped);
  const tabs = CATEGORY_TABS.filter(tab => tab.key === 'all' || availableCategories.includes(tab.key));
  const filteredGroups =
    selectedTab === 'all'
      ? grouped
      : { [selectedTab]: grouped[selectedTab] || [] };

  // ── Theme colors with fallbacks ──────────────────────────────────────────────
  const bgColor     = theme.backgroundColor || '#0F172A';
  const textColor   = theme.textColor       || '#ffffff';
  const subText     = theme.subTextColor    || '#94a3b8';
  const accentColor = theme.primary         || '#4e54c8';
  const cardBg      = theme.cardBackground  || 'rgba(255,255,255,0.05)';
  const borderColor = theme.borderColor     || 'rgba(255,255,255,0.12)';

  const Content = () => (
    <View style={{ flex: 1, paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10 }}>
      <View style={{ paddingTop: 20 }}>
        <CustomHeader title={t('ACHIEVEMENTS')} onBack={() => navigation.goBack()} />
      </View>

      <View style={[styles.container, { paddingHorizontal: screenWidth * 0.045 }]}>

        {/* Overall progress strip */}
        <View style={[styles.summaryRow, { borderColor }]}>
          <Text style={[styles.summaryLabel, { color: textColor }]}>
            🏆 {earnedTotal}/{totalCount}
          </Text>
          <View style={[styles.summaryTrack, { backgroundColor: borderColor }]}>
            <View style={[styles.summaryFill, { width: `${percentage}%`, backgroundColor: accentColor }]} />
          </View>
          <Text style={[styles.summaryPct, { color: subText }]}>{percentage}%</Text>
        </View>

        {/* Category tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabRow}
          style={styles.tabScroll}
        >
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                { backgroundColor: cardBg, borderColor },
                selectedTab === tab.key && { backgroundColor: accentColor, borderColor: accentColor },
              ]}
              onPress={() => setSelectedTab(tab.key)}
            >
              <Text style={[
                styles.tabText,
                { color: subText },
                selectedTab === tab.key && { color: '#fff' },
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Content */}
        {loading ? (
          <View style={styles.centred}>
            <ActivityIndicator size="large" color={accentColor} />
            <Text style={[styles.stateText, { color: subText }]}>Loading badges…</Text>
          </View>
        ) : error ? (
          <View style={styles.centred}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={[styles.retryBtn, { backgroundColor: accentColor }]} onPress={fetchBadges}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={accentColor} />
            }
          >
            {Object.entries(filteredGroups).map(([cat, badges]) =>
              badges.length > 0 ? (
                <CategorySection
                  key={cat}
                  category={cat}
                  badges={badges}
                  onBadgePress={handleBadgePress}
                  theme={theme}
                  numColumns={numColumns}
                  cellSize={cellSize}
                />
              ) : null,
            )}

            {Object.values(filteredGroups).every(arr => arr.length === 0) && (
              <View style={styles.centred}>
                <Text style={[styles.stateText, { color: subText }]}>
                  No badges in this category yet.
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );

  return (
    <>
      {theme.backgroundGradient ? (
        <LinearGradient colors={theme.backgroundGradient} style={{ flex: 1 }}>
          <Content />
        </LinearGradient>
      ) : (
        <View style={{ flex: 1, backgroundColor: bgColor }}>
          <Content />
        </View>
      )}

      <AchievementDetailPopup
        visible={popupVisible}
        badge={selectedBadge}
        onClose={handleClosePopup}
      />
    </>
  );
};

export default Achivements;

// ─── CELL STYLES ──────────────────────────────────────────────────────────────
const cellStyles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    justifyContent: 'flex-start',   // top-align so icons stay fixed at top
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  iconWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  iconDim: { opacity: 0.3 },
  title: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 14,
    // Fixed height: 2 lines × lineHeight — prevents grid row height jitter
    height: 28,
  },
  titleDim: { color: '#94a3b8' },
  progressArea: {
    alignItems: 'center',
    marginTop: 4,
    // Fixed height keeps earned & unearned badges the same total height
    height: 22,
    justifyContent: 'flex-start',
  },
  track: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#4e54c8',
    borderRadius: 2,
  },
  countLabel: {
    color: '#64748b',
    marginTop: 2,
  },
});

// ─── SECTION STYLES ───────────────────────────────────────────────────────────
const sectionStyles = StyleSheet.create({
  wrapper: { marginBottom: 22 },
  header: {
    fontSize: scaleFont(13),
    fontWeight: '600',
    marginBottom: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 6,
    overflow: 'hidden',
  },
  // cellWrap width is set inline (= cellSize) for accuracy
  cellWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// ─── MAIN STYLES ──────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal set inline so it reacts to useWindowDimensions
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    gap: 8,
  },
  summaryLabel: {
    fontSize: scaleFont(11),
    fontWeight: '700',
    minWidth: 64,
  },
  summaryTrack: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
  },
  summaryFill: {
    height: '100%',
    borderRadius: 3,
  },
  summaryPct: {
    fontSize: scaleFont(10),
    minWidth: 32,
    textAlign: 'right',
  },
  tabScroll: {
    maxHeight: 44,
    marginBottom: 14,
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  tabText: {
    fontSize: scaleFont(11),
    fontWeight: '600',
  },
  centred: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  stateText: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: scaleFont(13),
  },
  errorText: {
    color: '#f87171',
    textAlign: 'center',
    fontSize: scaleFont(13),
    marginBottom: 12,
  },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: scaleFont(12),
  },
});
