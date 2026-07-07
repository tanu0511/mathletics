

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  StyleSheet,
  Dimensions,
  PixelRatio,
  Animated,
} from 'react-native';
import Svg, {
  Polyline,
  Line,
  Text as SvgText,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Polygon,
  Circle,
} from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useAppTranslation } from '../context/TranslationContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../components/CustomHeader';
// import BadgePopup from './BadgePopup';
import { useBadge } from '../context/BadgeContext';
import api from '../api/axiosInstance';

const { width, height } = Dimensions.get('window');
const BASE_WIDTH  = 390;
const BASE_HEIGHT = 844;
const scaleW = width  / BASE_WIDTH;
const scaleH = height / BASE_HEIGHT;
const scale  = Math.min(scaleW, scaleH);

const rf = (size) =>
  Math.round(PixelRatio.roundToNearestPixel(size * scale));

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

const TIME_FILTERS   = ['1 W', '1 M', '3 M', '1 Y', 'All Time'];
const TIME_PARAM_MAP = {
  '1 W':      '1week',
  '1 M':      '1month',
  '3 M':      '3months',
  '1 Y':      '1year',
  'All Time': 'alltime',
};
const DIFF_CODES = ['E2', 'E4', 'M2', 'M4', 'H2', 'H4'];
const BASE_URL   = 'http://13.203.232.239:3000/api';

const getDiffLabel = (diff, t, currentLanguage) => {
  if (currentLanguage === 'en') return diff;
  const map = { E: t('Easy'), M: t('Medium'), H: t('Hard') };
  return `${map[diff[0]]} ${diff[1]}`;
};

const TIME_LABEL_MAP = {
  '1 W':      '1 Week',
  '1 M':      '1 Month',
  '3 M':      '3 Months',
  '1 Y':      '1 Year',
  'All Time': 'All Time',
};
const getTimeLabel = (filter, t, currentLanguage) => {
  if (currentLanguage === 'en') return filter;
  return t(TIME_LABEL_MAP[filter] || filter);
};

const getDiffColor = (diffCode, theme) => {
  const map = {
    E2: '#22c55e', E4: '#16a34a',
    M2: '#f59e0b', M4: '#d97706',
    H2: '#ef4444', H4: '#b91c1c',
  };
  return map[diffCode] || theme?.primary || '#FB923C';
};

// ── Rating Header Card ───────────────────────────────────────────────────────
const RatingHeaderCard = ({ statsData, theme, t }) => {
  if (!statsData) return null;
  if (statsData.highestRating == null) return null;

  const cardBg   = theme.cardBackground || 'rgba(255,255,255,0.06)';
  const border   = theme.border         || 'rgba(255,255,255,0.12)';
  const textMain = theme.text           || '#ffffff';
  const textSub  = theme.textSecondary  || '#94a3b8';

  const rating  = statsData.highestRating;
  const correct = statsData.correctPercent   != null ? `${statsData.correctPercent}%`   : '—';
  const wrong   = statsData.incorrectPercent != null ? `${statsData.incorrectPercent}%` : '—';
  const skipped = statsData.skippedPercent   != null ? `${statsData.skippedPercent}%`   : '—';

  const statBoxes = [
    { label: t('Correct'),   value: correct, color: '#22c55e' },
    { label: t('Incorrect'), value: wrong,   color: '#ef4444' },
    { label: t('Skipped'),   value: skipped, color: '#f59e0b' },
  ];

  return (
    <View style={[hStyles.card, { backgroundColor: cardBg, borderColor: border }]}>
      <Text style={[hStyles.label, { color: textSub }]}>{t('Rating')}</Text>
      <View style={hStyles.ratingRow}>
        <Text style={[hStyles.ratingValue, { color: textMain }]}>{rating}</Text>
      </View>
      <View style={hStyles.boxRow}>
        {statBoxes.map((b, i) => (
          <View
            key={i}
            style={[hStyles.box, { backgroundColor: theme.surface || 'rgba(255,255,255,0.07)', borderColor: border }]}
          >
            <Text style={[hStyles.boxLabel, { color: textSub }]}>{b.label}</Text>
            <Text style={[hStyles.boxValue, { color: b.color }]}>{b.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const hStyles = StyleSheet.create({
  card: {
    borderRadius: rf(14),
    borderWidth: 1,
    paddingVertical: rf(14),
    paddingHorizontal: rf(16),
    marginBottom: rf(10),
    alignItems: 'center',
  },
  label:       { fontSize: rf(12), marginBottom: rf(2), letterSpacing: 0.5 },
  ratingRow:   { flexDirection: 'row', alignItems: 'center', gap: rf(8), marginBottom: rf(14) },
  ratingValue: { fontSize: clamp(rf(36), 28, 52), fontWeight: '800', letterSpacing: -1 },
  ratingDelta: { fontSize: rf(14), fontWeight: '700' },
  boxRow:      { flexDirection: 'row', gap: rf(8), width: '100%' },
  box: {
    flex: 1,
    borderRadius: rf(10),
    borderWidth: 1,
    paddingVertical: rf(10),
    alignItems: 'center',
  },
  boxLabel: { fontSize: rf(11), marginBottom: rf(4) },
  boxValue: { fontSize: clamp(rf(16), 13, 22), fontWeight: '700' },
});

// ── Rating Line Chart ────────────────────────────────────────────────────────
const RatingChart = ({ ratingHistory = [], theme, t }) => {
  const chartWidth  = width - rf(64);
  const chartHeight = clamp(rf(150), 120, 200);
  const padL  = rf(40);
  const padR  = rf(8);
  const padT  = rf(10);
  const padB  = rf(28);
  const innerW = chartWidth - padL - padR;
  const innerH = chartHeight - padT - padB;

  const accent  = theme.primary        || '#FB923C';
  const textSub = theme.textSecondary  || '#94a3b8';

  if (!ratingHistory || ratingHistory.length < 2) {
    return (
      <View style={{ height: chartHeight, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: textSub, fontSize: rf(12) }}>{t('No rating history available')}</Text>
      </View>
    );
  }

  const ratings = ratingHistory.map(p => p.rating);
  const minR    = Math.min(...ratings);
  const maxR    = Math.max(...ratings);
  const range   = maxR - minR || 1;
  const n       = ratingHistory.length;

  const toX = (i) => n <= 1 ? padL + innerW / 2 : padL + (i / (n - 1)) * innerW;
  const toY = (r) => padT + innerH - ((r - minR) / range) * innerH;

  const linePoints = ratingHistory.map((p, i) => `${toX(i)},${toY(p.rating)}`).join(' ');
  const botY       = padT + innerH;
  const areaPoints = `${toX(0)},${botY} ${linePoints} ${toX(n - 1)},${botY}`;

  const mid     = Math.round((minR + maxR) / 2);
  const yLabels = [maxR, mid, minR];

  const xCount   = Math.min(n, 5);
  const xIndices = Array.from({ length: xCount }, (_, k) =>
    Math.round((k / (xCount - 1)) * (n - 1)),
  );

  const lastX = toX(n - 1);
  const lastY = toY(ratings[n - 1]);

  return (
    <Svg width={chartWidth} height={chartHeight}>
      <Defs>
        <SvgLinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%"   stopColor={accent} stopOpacity="0.35" />
          <Stop offset="100%" stopColor={accent} stopOpacity="0.02" />
        </SvgLinearGradient>
      </Defs>

      {yLabels.map((_, idx) => {
        const y = padT + (idx / (yLabels.length - 1)) * innerH;
        return (
          <Line
            key={idx}
            x1={padL} y1={y} x2={padL + innerW} y2={y}
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="1"
            strokeDasharray="3,4"
          />
        );
      })}

      <Polygon points={areaPoints} fill="url(#areaGrad)" />

      <Polyline
        points={linePoints}
        fill="none"
        stroke={accent}
        strokeWidth={rf(2.2)}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      <Circle cx={lastX} cy={lastY} r={rf(4)} fill={accent} />
      <Circle cx={lastX} cy={lastY} r={rf(7)} fill={accent} fillOpacity="0.25" />

      {yLabels.map((val, idx) => {
        const y = padT + (idx / (yLabels.length - 1)) * innerH;
        return (
          <SvgText key={idx} x={padL - rf(4)} y={y + rf(4)}
            fontSize={rf(9)} fill={textSub} textAnchor="end">
            {val}
          </SvgText>
        );
      })}

      {xIndices.map((i) => {
        const p = ratingHistory[i];
        return (
          <SvgText key={i} x={toX(i)} y={chartHeight - rf(3)}
            fontSize={rf(8)} fill={textSub} textAnchor="middle">
            {p.label || String(i + 1)}
          </SvgText>
        );
      })}
    </Svg>
  );
};

// ── Win / Loss / Draw animated bar ──────────────────────────────────────────
const WinLossDrawBar = ({ wins, losses, ties, winPercent, lossPercent, tiePercent, theme, t }) => {
  const barAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    barAnim.setValue(0);
    Animated.timing(barAnim, { toValue: 1, duration: 800, useNativeDriver: false }).start();
  }, [wins, losses, ties]);

  const total = (wins || 0) + (losses || 0) + (ties || 0);
  if (!total) return null;

  const wPct = wins   ? (wins   / total) * 100 : 0;
  const lPct = losses ? (losses / total) * 100 : 0;
  const dPct = ties   ? (ties   / total) * 100 : 0;

  const segments = [
    { color: '#22c55e', animPct: wPct,  label: t('Win'),  count: wins   ?? 0, pct: winPercent   ?? 0 },
    { color: '#ef4444', animPct: lPct,  label: t('Loss'), count: losses ?? 0, pct: lossPercent  ?? 0 },
    { color: '#f59e0b', animPct: dPct,  label: t('Draw'), count: ties   ?? 0, pct: tiePercent   ?? 0 },
  ];

  const textSub = theme.textSecondary || '#94a3b8';

  return (
    <View>
      <View style={wldStyles.barTrack}>
        {segments.map((seg, i) => {
          const animW = barAnim.interpolate({
            inputRange:  [0, 1],
            outputRange: ['0%', `${seg.animPct}%`],
          });
          return (
            <Animated.View
              key={i}
              style={[
                wldStyles.segment,
                {
                  width: animW,
                  backgroundColor: seg.color,
                  borderTopLeftRadius:     i === 0 ? rf(6) : 0,
                  borderBottomLeftRadius:  i === 0 ? rf(6) : 0,
                  borderTopRightRadius:    i === segments.length - 1 ? rf(6) : 0,
                  borderBottomRightRadius: i === segments.length - 1 ? rf(6) : 0,
                },
              ]}
            />
          );
        })}
      </View>
      <View style={wldStyles.labelRow}>
        {segments.map((seg, i) => (
          <View key={i} style={wldStyles.labelItem}>
            <View style={[wldStyles.dot, { backgroundColor: seg.color }]} />
            <Text style={[wldStyles.labelTxt, { color: textSub }]}>{seg.label} </Text>
            <Text style={[wldStyles.countTxt, { color: seg.color }]}>{seg.count}</Text>
            <Text style={[wldStyles.pctTxt, { color: textSub }]}> ({seg.pct}%)</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const wldStyles = StyleSheet.create({
  barTrack: {
    flexDirection: 'row',
    height: clamp(rf(11), 8, 16),
    borderRadius: rf(6),
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginBottom: rf(12),
  },
  segment:   { height: '100%' },
  labelRow:  { flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap', gap: rf(4) },
  labelItem: { flexDirection: 'row', alignItems: 'center' },
  dot:       { width: rf(7), height: rf(7), borderRadius: rf(4), marginRight: rf(3) },
  labelTxt:  { fontSize: clamp(rf(11), 9, 14) },
  countTxt:  { fontSize: clamp(rf(11), 9, 14), fontWeight: '700' },
  pctTxt:    { fontSize: clamp(rf(10), 8, 13) },
});

const Divider = ({ theme }) => (
  <View style={{ height: 1, backgroundColor: theme.border || 'rgba(255,255,255,0.08)' }} />
);

const StatRow = ({ label, value, theme }) => (
  <View style={sStyles.statRow}>
    <Text style={[sStyles.statLabel, { color: theme.text || '#e0e0e0' }]}>{label}</Text>
    <Text style={[sStyles.statValue, { color: theme.primary || '#FB923C' }]}>{value ?? '—'}</Text>
  </View>
);

const sStyles = StyleSheet.create({
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: clamp(rf(13), 10, 18),
  },
  statLabel: { fontSize: clamp(rf(14), 11, 18), fontWeight: '500', flex: 1, flexWrap: 'wrap' },
  statValue: { fontSize: clamp(rf(14), 11, 18), fontWeight: '700', marginLeft: rf(8), textAlign: 'right' },
});

const renderStats = (statsData, t, theme) => {
  if (!statsData) return null;

  const D  = () => <Divider theme={theme} />;
  const R  = ({ label, value }) => <StatRow label={label} value={value} theme={theme} />;

  const fmtQps     = (v) => v != null ? Number(v).toFixed(2) : null;
  const fmtPct     = (v) => v != null ? `${v}%` : null;
  const fmtBestWin = (u, r) => u ? `${u}${r ? ` (${r})` : ''}` : null;

  if (statsData.mode === 'pvp' && statsData.isAllTime) {
    return (
      <>
        <R label={t('Highest Rating')}      value={statsData.highestRating} />
        <D /><R label={t('Longest Win Streak')}  value={statsData.bestStreak} />
        <D /><R label={t('Best Win (Opponent)')} value={fmtBestWin(statsData.bestWin, statsData.bestWinRating)} />
        <D /><R label={t('Ques/Sec')}            value={fmtQps(statsData.questionsPerSecond)} />
      </>
    );
  }

  if (statsData.mode === 'pvp' && !statsData.isAllTime) {
    return (
      <>
        <R label={t('No. of Games Played')} value={statsData.gamesPlayed} />
        <D /><R label={t('Best Streak')}         value={statsData.bestStreak} />
        <D /><R label={t('Best Win (Opponent)')} value={fmtBestWin(statsData.bestWin, statsData.bestWinRating)} />
        <D /><R label={t('Ques/Sec')}            value={fmtQps(statsData.questionsPerSecond)} />
      </>
    );
  }

  if (statsData.mode === 'practice' && statsData.isAllTime) {
    return (
      <>
        <R label={t('Best Streak')}   value={statsData.bestStreak} />
        <D /><R label={t('Best Accuracy')} value={fmtPct(statsData.bestAccuracy)} />
        <D /><R label={t('Best Q/s')}      value={fmtQps(statsData.questionsPerSecond)} />
      </>
    );
  }

  if (statsData.mode === 'practice' && !statsData.isAllTime) {
    return (
      <>
        <R label={t('Top Score')}   value={statsData.topScore} />
        <D /><R label={t('Best Streak')} value={statsData.bestStreak} />
        <D /><R label={t('Accuracy %')}  value={fmtPct(statsData.correctPercent)} />
        <D /><R label={t('Best Q/s')}    value={fmtQps(statsData.questionsPerSecond)} />
      </>
    );
  }

  return null;
};

// ── Main Screen ──────────────────────────────────────────────────────────────
const StatsScreen = () => {
  const navigation = useNavigation();
  const insets     = useSafeAreaInsets();
  const { theme }  = useTheme();
  const { t, currentLanguage } = useAppTranslation();
  const {  showBadges } = useBadge();

  const [selectedFilter, setSelectedFilter] = useState('1 Y');
  const [selectedDiff,   setSelectedDiff]   = useState('M2');
  const [selectedMode,   setSelectedMode]   = useState('pvp');
  const [loading,        setLoading]        = useState(true);
  const [userProfile,    setUserProfile]    = useState(null);
  const [statsData,      setStatsData]      = useState(null);
  const [ratingHistory,  setRatingHistory]  = useState([]);
  const [error,          setError]          = useState(null);

  // Page-visited badge
  useEffect(() => {
    const triggerPageVisitBadge = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) return;
        const res = await fetch(`http://13.203.232.239:3000/api/badges/event/page-visited`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ page: 'stats' }),
        });
        const ct = res.headers.get('content-type');
        if (!ct?.includes('application/json')) return;
        const data = await res.json();
        if (data.success && data.newlyEarned?.length > 0) showBadges(data.newlyEarned);
      } catch (err) {
        console.error('Badge trigger failed:', err);
      }
    };
    triggerPageVisitBadge();
  }, []);

  // Stats fetch — uses api instance with /api prefix on path
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        setRatingHistory([]);

        let playerId =
          (await AsyncStorage.getItem('playerId')) ||
          (await AsyncStorage.getItem('userId'))   ||
          (await AsyncStorage.getItem('user_id'));

        if (!playerId) {
          const userJson =
            (await AsyncStorage.getItem('user'))        ||
            (await AsyncStorage.getItem('userData'))    ||
            (await AsyncStorage.getItem('userProfile'));
          if (userJson) {
            try {
              const parsed = JSON.parse(userJson);
              playerId = parsed._id || parsed.id || parsed.playerId || parsed.userId;
            } catch (_) {}
          }
        }

        if (!playerId) {
          const allKeys = await AsyncStorage.getAllKeys();
          console.warn('⚠️ playerId not found. Keys:', allKeys);
          setError(t('Player ID not found. Please log out and log in again.'));
          return;
        }

        const timeParam = TIME_PARAM_MAP[selectedFilter] ?? 'alltime';

        // axiosInstance baseURL is http://13.203.232.239:3000 (no /api)
        // so we prefix /api manually on every path here
        console.log('[Stats] fetching /api/stats/' + playerId, { time: timeParam, mode: selectedMode, diffCode: selectedDiff });

        const response = await api.get(`/api/stats/${playerId}`, {
          params: {
            time:           timeParam,
            mode:           selectedMode,
            diffCode:       selectedDiff,
            targetLanguage: currentLanguage,
          },
        });

        const data = response.data;
        console.log('[Stats] raw data:', JSON.stringify(data, null, 2));
console.log('[Stats] best.pvp:', JSON.stringify(data.best?.pvp, null, 2));
console.log('[Stats] current.pvp:', JSON.stringify(data.current?.pvp, null, 2));

        setUserProfile({ username: data.username || null, avatar: data.profileImage || null });

        if (selectedMode === 'pvp') {
          const history = data.ratingHistory ?? data.rating_history;
          if (!history) {
            console.warn('ratingHistory missing from API response');
            setRatingHistory([]);
          } else {
            setRatingHistory(Array.isArray(history) ? history : []);
          }
        } else {
          setRatingHistory([]);
        }

        const isAllTime = selectedFilter === 'All Time';
        const pvpRating = data.ratings?.pvp?.[selectedDiff] ?? null;

        if (selectedMode === 'pvp') {
          const current = data.current?.pvp?.[selectedDiff] ?? {};
          const best    = data.best?.pvp?.[selectedDiff]    ?? {};

          if (isAllTime) {
  setStatsData({
    mode: 'pvp', isAllTime: true,
    highestRating:      pvpRating ?? best.highestRating?.value ?? null,
    bestStreak:         best.bestStreak                        ?? null, // was best.longestStreak?.value
    bestWin:            best.bestWin?.username                 ?? null,
    bestWinRating:      best.bestWin?.rating                   ?? null,
    questionsPerSecond: best.bestQuestionsPerSecond?.value      ?? null,
    correctPercent:     null,
    incorrectPercent:   null,
    skippedPercent:     null,
  });
} else {
  setStatsData({
    mode: 'pvp', isAllTime: false,
    gamesPlayed:        current.gamesPlayed        || null,
    wins:               current.wins                ?? null,
    winPercent:         current.winRate              ?? null,
    losses:             current.losses                ?? null,
    lossPercent:        current.lossRate              ?? null,
    ties:               current.draws                 ?? null,
    tiePercent:         current.drawRate               ?? null,
    correctPercent:     current.accuracy               ?? null,
    skippedPercent:     current.skippedPercentage      ?? null,
    incorrectPercent:   current.incorrectPercentage    ?? null,
    bestStreak:         current.bestStreak             ?? null, // unchanged, already correct key
    highestRating:      pvpRating                      ?? null,
    questionsPerSecond: current.questionsPerSecond     ?? null,
    bestWin:            current.bestWin?.username      ?? null,
    bestWinRating:      current.bestWin?.rating        ?? null,
  });
}
        } else {
          const current = data.current?.practice?.[selectedDiff] ?? {};
          const best    = data.best?.practice?.[selectedDiff]    ?? {};

          if (isAllTime) {
            setStatsData({
              mode: 'practice', isAllTime: true,
              bestStreak:         best.bestStreak?.value             ?? null,
              bestAccuracy:       best.bestAccuracy?.value           ?? null,
              questionsPerSecond: best.bestQuestionsPerSecond?.value ?? null,
            });
          } else {
            setStatsData({
              mode: 'practice', isAllTime: false,
              topScore:           current.topScore           ?? null,
              bestStreak:         current.bestStreak         ?? null,
              correctPercent:     current.accuracy           ?? null,
              questionsPerSecond: current.questionsPerSecond ?? null,
            });
          }
        }
      } catch (err) {
        console.error('❌ StatsScreen fetch failed:', err);
        console.log('[Stats] error detail:', err.response?.status, err.response?.data, err.config?.url);
        setError(err.response?.data?.message || err.message || t('Something went wrong. Please try again.'));
        setStatsData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [selectedFilter, selectedDiff, selectedMode, currentLanguage]);

  const showWLD =
    selectedMode === 'pvp' &&
    statsData &&
    !statsData.isAllTime &&
    (statsData.wins != null || statsData.losses != null || statsData.ties != null);

  const accent   = theme.primary        || '#FB923C';
  const cardBg   = theme.cardBackground || 'rgba(255,255,255,0.06)';
  const border   = theme.border         || 'rgba(255,255,255,0.12)';
  const textMain = theme.text           || '#ffffff';
  const textSub  = theme.textSecondary  || '#94a3b8';
  const surface  = theme.surface        || 'rgba(255,255,255,0.05)';

  const Content = () => (
    <View style={{ flex: 1, paddingTop: insets.top + rf(30) }}>

      <CustomHeader title={t('STATS')} onBack={() => navigation.goBack()} />

      <View style={[styles.profileCard, { backgroundColor: cardBg, borderColor: border }]}>
        <View style={[styles.avatar, { backgroundColor: surface, borderColor: accent }]}>
          {userProfile?.avatar
            ? <Image source={{ uri: userProfile.avatar }} style={styles.avatarImage} />
            : <Text style={[styles.avatarPlaceholder, { color: textSub }]}>👤</Text>
          }
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { color: textMain }]} numberOfLines={1}>
            {userProfile?.username || t('User Name')}
          </Text>
          <Text style={[styles.profileSub, { color: textSub }]}>
            {selectedMode === 'pvp' ? t('PVP Stats') : t('Practice Stats')} · {getDiffLabel(selectedDiff, t, currentLanguage)}
          </Text>
        </View>
      </View>

      <View style={[styles.diffRow, { backgroundColor: surface, borderColor: border }]}>
        {DIFF_CODES.map((d) => {
          const isActive  = selectedDiff === d;
          const diffColor = getDiffColor(d, theme);
          return (
            <TouchableOpacity
              key={d}
              onPress={() => setSelectedDiff(d)}
              style={[styles.diffTab, isActive && { backgroundColor: diffColor, borderRadius: rf(6) }]}
              hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
            >
              <Text style={[
                styles.diffText,
                { color: isActive ? '#fff' : textSub, fontWeight: isActive ? '700' : '500' },
              ]}>
                {getDiffLabel(d, t, currentLanguage)}
              </Text>
            </TouchableOpacity>
          );
        })}
        <View style={[styles.modeSeparator, { backgroundColor: border }]} />
        <TouchableOpacity
          onPress={() => setSelectedMode(prev => prev === 'pvp' ? 'practice' : 'pvp')}
          style={[styles.modeToggle, {
            backgroundColor: selectedMode === 'practice' ? accent : 'transparent',
            borderColor:     selectedMode === 'practice' ? accent : border,
          }]}
          hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
        >
          <Text style={[styles.modeToggleText, {
            color:      selectedMode === 'practice' ? '#fff' : textSub,
            fontWeight: selectedMode === 'practice' ? '700' : '500',
          }]}>{currentLanguage === 'en' ? 'P' : t('Practice')}</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.filterRow, { backgroundColor: surface, borderColor: border }]}>
        {TIME_FILTERS.map((f) => {
          const isActive = selectedFilter === f;
          return (
            <TouchableOpacity
              key={f}
              onPress={() => setSelectedFilter(f)}
              style={[styles.filterTab, isActive && { backgroundColor: accent, borderRadius: rf(6) }]}
              hitSlop={{ top: 6, bottom: 6, left: 2, right: 2 }}
            >
              <Text style={[
                styles.filterText,
                { color: isActive ? '#fff' : textSub, fontWeight: isActive ? '700' : '500' },
              ]}>
                {getTimeLabel(f, t, currentLanguage)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + rf(20) }]}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator size="large" color={accent} style={{ marginTop: rf(40) }} />
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: textSub }]}>{error}</Text>
          </View>
        ) : (
          <>
            {selectedMode === 'pvp' && (
              <RatingHeaderCard statsData={statsData} theme={theme} t={t} />
            )}

            {selectedMode === 'pvp' && (
              <View style={[styles.sectionCard, { backgroundColor: cardBg, borderColor: border }]}>
                <RatingChart ratingHistory={ratingHistory} theme={theme} t={t} />
                {showWLD && (
                  <View style={styles.wldWrapper}>
                    <WinLossDrawBar
                      wins={statsData.wins}
                      losses={statsData.losses}
                      ties={statsData.ties}
                      winPercent={statsData.winPercent}
                      lossPercent={statsData.lossPercent}
                      tiePercent={statsData.tiePercent}
                      theme={theme}
                      t={t}
                    />
                  </View>
                )}
              </View>
            )}

            <View style={[styles.statsCard, { backgroundColor: cardBg, borderColor: border }]}>
              {renderStats(statsData, t, theme)}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );

  return theme.backgroundGradient ? (
  <LinearGradient colors={theme.backgroundGradient} style={{ flex: 1 }}>
    <Content />
  </LinearGradient>
) : (
  <View style={{ flex: 1, backgroundColor: '#0F172A' }}>
    <Content />
  </View>
);


};

export default StatsScreen;

const styles = StyleSheet.create({
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: rf(16),
    marginBottom: rf(12),
    padding: rf(12),
    borderRadius: rf(14),
    borderWidth: 1,
  },
  avatar: {
    width: rf(48),
    height: rf(48),
    borderRadius: rf(24),
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginRight: rf(12),
  },
  avatarImage:       { width: '100%', height: '100%' },
  avatarPlaceholder: { fontSize: rf(22) },
  profileInfo:       { flex: 1 },
  profileName:       { fontSize: clamp(rf(16), 13, 20), fontWeight: '700', marginBottom: rf(2) },
  profileSub:        { fontSize: clamp(rf(12), 10, 15) },

  diffRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: rf(16),
    marginBottom: rf(8),
    borderRadius: rf(10),
    borderWidth: 1,
    padding: rf(4),
  },
  diffTab:  { flex: 1, alignItems: 'center', paddingVertical: rf(6) },
  diffText: { fontSize: clamp(rf(11), 9, 14) },

  modeSeparator: { width: 1, height: rf(20), marginHorizontal: rf(4) },
  modeToggle: {
    paddingHorizontal: rf(10),
    paddingVertical: rf(6),
    borderRadius: rf(6),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeToggleText: { fontSize: clamp(rf(12), 10, 15) },

  filterRow: {
    flexDirection: 'row',
    marginHorizontal: rf(16),
    marginBottom: rf(12),
    borderRadius: rf(10),
    borderWidth: 1,
    padding: rf(4),
  },
  filterTab:  { flex: 1, alignItems: 'center', paddingVertical: rf(6) },
  filterText: { fontSize: clamp(rf(11), 9, 13) },

  scrollContent: { paddingHorizontal: rf(16), paddingTop: rf(4) },

  sectionCard: {
    borderRadius: rf(14),
    borderWidth: 1,
    padding: rf(14),
    marginBottom: rf(10),
    alignItems: 'center',
  },
  wldWrapper: { width: '100%', marginTop: rf(14) },

  statsCard: {
    borderRadius: rf(14),
    borderWidth: 1,
    paddingHorizontal: rf(16),
    marginBottom: rf(10),
  },

  errorContainer: { alignItems: 'center', marginTop: rf(40), paddingHorizontal: rf(20) },
  errorText:      { fontSize: clamp(rf(14), 11, 18), textAlign: 'center', lineHeight: rf(22) },
});