// // // // import React, { useState, useEffect } from 'react';
// // // // import {
// // // //   View,
// // // //   Text,
// // // //   TouchableOpacity,
// // // //   StyleSheet,
// // // //   Dimensions,
// // // //   PixelRatio,
// // // //   ScrollView,
// // // //   Image,
// // // //   ActivityIndicator,
// // // // } from 'react-native';
// // // // import LinearGradient from 'react-native-linear-gradient';
// // // // import { useNavigation } from '@react-navigation/native';
// // // // import { useSafeAreaInsets } from 'react-native-safe-area-context';
// // // // import { useTheme } from '../context/ThemeContext';
// // // // import { useAppTranslation } from '../context/TranslationContext';
// // // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // // import CustomHeader from '../components/CustomHeader';
// // // // import BadgePopup from './BadgePopup';
// // // // import { useBadge } from '../context/BadgeContext';
// // // // import Icon from 'react-native-vector-icons/Ionicons';

// // // // const { width } = Dimensions.get('window');
// // // // const scale = width / 390;
// // // // const rf = (size) => Math.round(PixelRatio.roundToNearestPixel(size * scale));

// // // // // ── kept for API call, tabs are hidden from UI ──────────────────────────────
// // // // const TIME_FILTERS = ['1 W', '1 M', '3 M', '1 Y', 'All Time'];

// // // // const RESULT_CONFIG = {
// // // //   win:  { icon: 'add', bg: '#16a34a', text: '#fff' },
// // // //   loss: { icon: 'remove',          bg: '#dc2626', text: '#fff' },
// // // //   tie:  { icon: 'reorder-two', bg: '#6b7280', text: '#fff' },
// // // // };

// // // // const DUMMY_HISTORY = [
// // // //   { id: '1',  opponent: 'Imbatmen1',             ratingAfter: 980,  ratingBefore: 1020, opponentScore: 50.9, result: 'loss', avatar: null },
// // // //   { id: '2',  opponent: 'zarim_lolo',             ratingAfter: 960,  ratingBefore: 980,  opponentScore: 61.3, result: 'loss', avatar: null },
// // // //   { id: '3',  opponent: 'bjfff',                  ratingAfter: 960,  ratingBefore: 960,  opponentScore: null, result: 'win',  avatar: null },
// // // //   { id: '4',  opponent: 'MISHA464646',            ratingAfter: 940,  ratingBefore: 960,  opponentScore: null, result: 'loss', avatar: null },
// // // //   { id: '5',  opponent: 'Solomonio10',            ratingAfter: 920,  ratingBefore: 940,  opponentScore: null, result: 'loss', avatar: null },
// // // //   { id: '6',  opponent: 'alb1rl',                 ratingAfter: 950,  ratingBefore: 920,  opponentScore: 51.3, result: 'win',  avatar: null },
// // // //   { id: '7',  opponent: 'KingsShadow1',           ratingAfter: 950,  ratingBefore: 950,  opponentScore: null, result: 'loss',  avatar: null },
// // // //   { id: '8',  opponent: 'TwoDayOldRice',          ratingAfter: 930,  ratingBefore: 950,  opponentScore: null, result: 'loss', avatar: null },
// // // //   { id: '9',  opponent: 'thotakurisanthoshkumar', ratingAfter: 960,  ratingBefore: 930,  opponentScore: 79.5, result: 'win',  avatar: null },
// // // //   { id: '10', opponent: 'ishiee_07',              ratingAfter: 940,  ratingBefore: 960,  opponentScore: null, result: 'loss', avatar: null },
// // // //   { id: '11', opponent: 'MoumenBLK',              ratingAfter: 940,  ratingBefore: 940,  opponentScore: null, result: 'loss',  avatar: null },
// // // //   { id: '12', opponent: 'Adrian324p',             ratingAfter: 970,  ratingBefore: 940,  opponentScore: null, result: 'win',  avatar: null },
// // // // ];

// // // // // ── Single history row ──────────────────────────────────────────────────────
// // // // const TIMER_VALUES = ['E2', 'M2', 'H2', 'H4', 'M4', 'E4'];
// // // // const getRandomTimer = () => TIMER_VALUES[Math.floor(Math.random() * TIMER_VALUES.length)];

// // // // const HistoryRow = ({ item, theme, isLast }) => {
// // // //   const cfg = RESULT_CONFIG[item.result] ?? RESULT_CONFIG.tie;
// // // //   const randomTimer = getRandomTimer();

// // // //   return (
// // // //     <View style={[
// // // //       styles.row,
// // // //       { borderBottomColor: theme.border || 'rgba(255,255,255,0.08)' },
// // // //       !isLast && styles.rowBorder,
// // // //     ]}>

// // // //       {/* Timer value */}
// // // //       <View style={styles.timerIcon}>
// // // //         <Text style={{ fontSize: rf(12), fontWeight: '600', color: theme.textSecondary || '#94a3b8' }}>
// // // //           {randomTimer}
// // // //         </Text>
// // // //       </View>

// // // //       {/* Avatar */}
// // // //       <View style={[styles.rowAvatar, {
// // // //         backgroundColor: theme.surface || 'rgba(255,255,255,0.1)',
// // // //         borderColor: theme.primary || '#FB923C',
// // // //       }]}>
// // // //         {item.avatar ? (
// // // //           <Image source={{ uri: item.avatar }} style={styles.rowAvatarImg} />
// // // //         ) : (
// // // //           <Text style={{ fontSize: rf(18) }}>♟</Text>
// // // //         )}
// // // //       </View>

// // // //       {/* Name + score */}
// // // //       <View style={styles.rowInfo}>
// // // //         <Text style={[styles.rowName, { color: theme.text || '#ffffff' }]} numberOfLines={1}>
// // // //           {item.opponent}
// // // //         </Text>
// // // //         {/* {item.opponentScore != null && (
// // // //           <Text style={[styles.rowScore, { color: theme.textSecondary || '#94a3b8' }]}>
// // // //             {item.opponentScore}
// // // //           </Text>
// // // //         )} */}
// // // //       </View>

// // // //       {/* ✅ Rating block: after rating (top, bold) + before rating (bottom, muted) */}
// // // //       <View style={styles.ratingBlock}>
// // // //         <Text style={[styles.ratingAfter, { color: theme.text || '#ffffff' }]}>
// // // //           {item.ratingAfter}
// // // //         </Text>
// // // //         <Text style={[styles.ratingBefore, { color: theme.textSecondary || '#94a3b8' }]}>
// // // //           {item.ratingBefore}
// // // //         </Text>
// // // //       </View>

// // // //       {/* Result badge */}
// // // //       <View style={[styles.resultBadge, { backgroundColor: cfg.bg }]}>
// // // //         <Icon name={cfg.icon} size={rf(14)} color={cfg.text} />
// // // //       </View>

// // // //       {/* Search button */}
// // // //       <TouchableOpacity
// // // //         style={[styles.starBtn, { backgroundColor: theme.primary || '#FB923C' }]}
// // // //         onPress={() => {}}
// // // //         activeOpacity={0.75}
// // // //       >
// // // //         <Icon name="search" size={rf(18)} color="#fff" />
// // // //       </TouchableOpacity>
// // // //     </View>
// // // //   );
// // // // };

// // // // // ── Main Screen ─────────────────────────────────────────────────────────────
// // // // const GameHistoryScreen = () => {
// // // //   const navigation = useNavigation();
// // // //   const insets = useSafeAreaInsets();
// // // //   const { theme } = useTheme();
// // // //   const { t } = useAppTranslation();
// // // //   const { earnedBadges, setEarnedBadges, showBadges } = useBadge();

// // // //   const [selectedFilter, setSelectedFilter] = useState('1 Y');
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [history, setHistory] = useState([]);

// // // //   // Page-visited badge
// // // //   useEffect(() => {
// // // //     const triggerPageVisitBadge = async () => {
// // // //       try {
// // // //         const token = await AsyncStorage.getItem('accessToken');
// // // //         if (!token) return;

// // // //         const data = await response.json();
// // // //         if (data.success && data.newlyEarned?.length > 0) showBadges(data.newlyEarned);
// // // //       } catch (err) {
// // // //         console.error('Failed to trigger page-visited badge:', err);
// // // //       }
// // // //     };
// // // //     triggerPageVisitBadge();
// // // //   }, []);

// // // //   // History fetch
// // // //   useEffect(() => {
// // // //     const fetchHistory = async () => {
// // // //       setLoading(true);
// // // //       try {
// // // //         const token = await AsyncStorage.getItem('accessToken');
// // // //         if (!token) { setHistory(DUMMY_HISTORY); setLoading(false); return; }

// // // //         const response = await fetch(
// // // //           `http://13.203.232.239:3000/api/game-history?filter=${encodeURIComponent(selectedFilter)}`,
// // // //           {
// // // //             method: 'GET',
// // // //             headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
// // // //           }
// // // //         );
// // // //         const data = await response.json();
// // // //         setHistory(data.success && Array.isArray(data.history) ? data.history : DUMMY_HISTORY);
// // // //       } catch (err) {
// // // //         console.error('Failed to fetch game history:', err);
// // // //         setHistory(DUMMY_HISTORY);
// // // //       } finally {
// // // //         setLoading(false);
// // // //       }
// // // //     };
// // // //     fetchHistory();
// // // //   }, [selectedFilter]);

// // // //   const Content = () => (
// // // //     <View style={{ flex: 1, paddingTop: insets.top + 30 }}>

// // // //       {/* Header */}
// // // //       <CustomHeader title={t('Game History')} onBack={() => navigation.goBack()} />

// // // //       {/* ✅ Filter tabs hidden — selectedFilter still drives the API call */}

// // // //       {/* Legend */}
// // // //       <View style={styles.legendRow}>
// // // //         {Object.entries(RESULT_CONFIG).map(([key, cfg]) => (
// // // //           <View key={key} style={styles.legendItem}>
// // // //             <View style={[styles.legendDot, { backgroundColor: cfg.bg }]} />
// // // //             <Text style={[styles.legendText, { color: theme.textSecondary || '#94a3b8' }]}>
// // // //               {key.charAt(0).toUpperCase() + key.slice(1)}
// // // //             </Text>
// // // //           </View>
// // // //         ))}
// // // //       </View>

// // // //       {/* History list */}
// // // //       <ScrollView
// // // //         contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 20 }}
// // // //         showsVerticalScrollIndicator={false}
// // // //       >
// // // //         {loading ? (
// // // //           <ActivityIndicator size="large" color={theme.primary || '#FB923C'} style={{ marginTop: 40 }} />
// // // //         ) : history.length === 0 ? (
// // // //           <View style={styles.emptyState}>
// // // //             <Text style={{ fontSize: rf(36), marginBottom: rf(12) }}>♟</Text>
// // // //             <Text style={[styles.emptyText, { color: theme.textSecondary || '#94a3b8' }]}>
// // // //               {t('No games found for this period')}
// // // //             </Text>
// // // //           </View>
// // // //         ) : (
// // // //           <View style={[styles.historyCard, {
// // // //             backgroundColor: theme.cardBackground || 'rgba(255,255,255,0.05)',
// // // //             borderTopColor: theme.border || 'rgba(255,255,255,0.1)',
// // // //             borderBottomColor: theme.border || 'rgba(255,255,255,0.1)',
// // // //           }]}>
// // // //             {history.map((item, index) => (
// // // //               <HistoryRow
// // // //                 key={item.id}
// // // //                 item={item}
// // // //                 theme={theme}
// // // //                 isLast={index === history.length - 1}
// // // //               />
// // // //             ))}
// // // //           </View>
// // // //         )}
// // // //       </ScrollView>
// // // //     </View>
// // // //   );

// // // //   return theme.backgroundGradient ? (
// // // //     <LinearGradient colors={theme.backgroundGradient} style={{ flex: 1 }}>
// // // //       <Content />
// // // //       {earnedBadges.length > 0 && <BadgePopup badges={earnedBadges} onFinish={() => setEarnedBadges([])} />}
// // // //     </LinearGradient>
// // // //   ) : (
// // // //     <View style={{ flex: 1, backgroundColor: '#0F172A' }}>
// // // //       <Content />
// // // //       {earnedBadges.length > 0 && <BadgePopup badges={earnedBadges} onFinish={() => setEarnedBadges([])} />}
// // // //     </View>
// // // //   );
// // // // };

// // // // export default GameHistoryScreen;

// // // // // ── Styles ──────────────────────────────────────────────────────────────────
// // // // const styles = StyleSheet.create({

// // // //   legendRow: {
// // // //     flexDirection: 'row',
// // // //     marginHorizontal: width * 0.05,
// // // //     marginBottom: rf(8),
// // // //     marginTop: rf(6),
// // // //     gap: rf(14),
// // // //   },
// // // //   legendItem: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     gap: rf(5),
// // // //   },
// // // //   legendDot: {
// // // //     width: rf(8),
// // // //     height: rf(8),
// // // //     borderRadius: rf(4),
// // // //   },
// // // //   legendText: {
// // // //     fontSize: rf(11),
// // // //     fontWeight: '500',
// // // //   },

// // // //   // Full-width card
// // // //   historyCard: {
// // // //     width: '100%',
// // // //     borderTopWidth: 1,
// // // //     borderBottomWidth: 1,
// // // //   },

// // // //   row: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     paddingVertical: rf(10),
// // // //     paddingHorizontal: rf(12),
// // // //     gap: rf(8),
// // // //   },
// // // //   rowBorder: {
// // // //     borderBottomWidth: 1,
// // // //   },

// // // //   timerIcon: {
// // // //     width: rf(22),
// // // //     alignItems: 'center',
// // // //   },

// // // //   rowAvatar: {
// // // //     width: rf(38),
// // // //     height: rf(38),
// // // //     borderRadius: rf(8),
// // // //     borderWidth: 1.5,
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     overflow: 'hidden',
// // // //   },
// // // //   rowAvatarImg: {
// // // //     width: '100%',
// // // //     height: '100%',
// // // //   },

// // // //   rowInfo: {
// // // //     flex: 1,
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     flexWrap: 'wrap',
// // // //     gap: rf(3),
// // // //   },
// // // //   rowName: {
// // // //     fontSize: rf(13),
// // // //     fontWeight: '600',
// // // //   },
// // // //   rowScore: {
// // // //     fontSize: rf(12),
// // // //     fontWeight: '400',
// // // //   },

// // // //   // ✅ Stacked rating: after (top) + before (bottom)
// // // //   ratingBlock: {
// // // //     alignItems: 'flex-end',
// // // //     justifyContent: 'center',
// // // //     minWidth: rf(44),
// // // //   },
// // // //   ratingAfter: {
// // // //     fontSize: rf(13),
// // // //     fontWeight: '700',
// // // //     lineHeight: rf(17),
// // // //   },
// // // //   ratingBefore: {
// // // //     fontSize: rf(11),
// // // //     fontWeight: '400',
// // // //     lineHeight: rf(15),
// // // //     textDecorationLine: 'line-through',
// // // //   },

// // // //   resultBadge: {
// // // //     width: rf(26),
// // // //     height: rf(26),
// // // //     borderRadius: rf(5),
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //   },

// // // //   starBtn: {
// // // //     width: rf(30),
// // // //     height: rf(30),
// // // //     borderRadius: rf(6),
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //   },

// // // //   emptyState: {
// // // //     flex: 1,
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     paddingTop: rf(60),
// // // //   },
// // // //   emptyText: {
// // // //     fontSize: rf(14),
// // // //     textAlign: 'center',
// // // //   },
// // // // });



// // // // // import React, { useState, useEffect } from 'react';
// // // // // import {
// // // // //   View,
// // // // //   Text,
// // // // //   TouchableOpacity,
// // // // //   StyleSheet,
// // // // //   Dimensions,
// // // // //   PixelRatio,
// // // // //   ScrollView,
// // // // //   Image,
// // // // //   ActivityIndicator,
// // // // // } from 'react-native';
// // // // // import LinearGradient from 'react-native-linear-gradient';
// // // // // import { useNavigation } from '@react-navigation/native';
// // // // // import { useSafeAreaInsets } from 'react-native-safe-area-context';
// // // // // import { useTheme } from '../context/ThemeContext';
// // // // // import { useAppTranslation } from '../context/TranslationContext';
// // // // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // // // import CustomHeader from '../components/CustomHeader';
// // // // // import BadgePopup from './BadgePopup';
// // // // // import { useBadge } from '../context/BadgeContext';
// // // // // import Icon from 'react-native-vector-icons/Ionicons';

// // // // // // ── Responsive scaling ───────────────────────────────────────────────────────
// // // // // const { width } = Dimensions.get('window');
// // // // // const scale = width / 390;
// // // // // const rf = (size) => Math.round(PixelRatio.roundToNearestPixel(size * scale));
// // // // // const rft = (size) => {
// // // // //   const scaled = size * scale;
// // // // //   return Math.round(PixelRatio.roundToNearestPixel(Math.min(Math.max(scaled, size * 0.85), size * 1.25)));
// // // // // };

// // // // // // ── Result config ────────────────────────────────────────────────────────────
// // // // // const RESULT_CONFIG = {
// // // // //   win:  { icon: 'add',         bg: 'rgba(22,163,74,0.18)',  iconColor: '#4ade80', border: 'rgba(22,163,74,0.35)' },
// // // // //   loss: { icon: 'remove',      bg: 'rgba(220,38,38,0.15)',  iconColor: '#f87171', border: 'rgba(220,38,38,0.3)'  },
// // // // //   tie:  { icon: 'reorder-two', bg: 'rgba(107,114,128,0.15)', iconColor: '#9ca3af', border: 'rgba(107,114,128,0.3)' },
// // // // // };

// // // // // const DUMMY_HISTORY = [
// // // // //   { id: '1',  opponent: 'Imbatmen1',             ratingAfter: 980,  ratingBefore: 1020, result: 'loss', avatar: null },
// // // // //   { id: '2',  opponent: 'zarim_lolo',             ratingAfter: 960,  ratingBefore: 980,  result: 'loss', avatar: null },
// // // // //   { id: '3',  opponent: 'bjfff',                  ratingAfter: 960,  ratingBefore: 960,  result: 'win',  avatar: null },
// // // // //   { id: '4',  opponent: 'MISHA464646',            ratingAfter: 940,  ratingBefore: 960,  result: 'loss', avatar: null },
// // // // //   { id: '5',  opponent: 'Solomonio10',            ratingAfter: 920,  ratingBefore: 940,  result: 'loss', avatar: null },
// // // // //   { id: '6',  opponent: 'alb1rl',                 ratingAfter: 950,  ratingBefore: 920,  result: 'win',  avatar: null },
// // // // //   { id: '7',  opponent: 'KingsShadow1',           ratingAfter: 950,  ratingBefore: 950,  result: 'tie',  avatar: null },
// // // // //   { id: '8',  opponent: 'TwoDayOldRice',          ratingAfter: 930,  ratingBefore: 950,  result: 'loss', avatar: null },
// // // // //   { id: '9',  opponent: 'thotakurisanthoshkumar', ratingAfter: 960,  ratingBefore: 930,  result: 'win',  avatar: null },
// // // // //   { id: '10', opponent: 'ishiee_07',              ratingAfter: 940,  ratingBefore: 960,  result: 'loss', avatar: null },
// // // // //   { id: '11', opponent: 'MoumenBLK',              ratingAfter: 940,  ratingBefore: 940,  result: 'tie',  avatar: null },
// // // // //   { id: '12', opponent: 'Adrian324p',             ratingAfter: 970,  ratingBefore: 940,  result: 'win',  avatar: null },
// // // // // ];

// // // // // const TIMER_VALUES = ['E2', 'M2', 'H2', 'H4', 'M4', 'E4'];
// // // // // const getRandomTimer = () => TIMER_VALUES[Math.floor(Math.random() * TIMER_VALUES.length)];

// // // // // // ── Single history row ────────────────────────────────────────────────────────
// // // // // const HistoryRow = ({ item, theme, isLast }) => {
// // // // //   const cfg = RESULT_CONFIG[item.result] ?? RESULT_CONFIG.tie;
// // // // //   const randomTimer = getRandomTimer();

// // // // //   const ratingDiff = item.ratingAfter - item.ratingBefore;
// // // // //   const diffColor =
// // // // //     ratingDiff > 0 ? '#4ade80' : ratingDiff < 0 ? '#f87171' : '#9ca3af';
// // // // //   const diffPrefix = ratingDiff > 0 ? '+' : '';

// // // // //   return (
// // // // //     <View
// // // // //       style={[
// // // // //         styles.row,
// // // // //         {
// // // // //           borderBottomColor: theme.border || 'rgba(255,255,255,0.06)',
// // // // //         },
// // // // //         !isLast && styles.rowBorder,
// // // // //       ]}
// // // // //     >
// // // // //       {/* Timer chip — small and quiet */}
// // // // //       <View
// // // // //         style={[
// // // // //           styles.timerChip,
// // // // //           {
// // // // //             backgroundColor: theme.surface || 'rgba(255,255,255,0.06)',
// // // // //             borderColor: theme.border || 'rgba(255,255,255,0.08)',
// // // // //           },
// // // // //         ]}
// // // // //       >
// // // // //         <Text style={[styles.timerText, { color: theme.textSecondary || '#64748b' }]}>
// // // // //           {randomTimer}
// // // // //         </Text>
// // // // //       </View>

// // // // //       {/* Avatar */}
// // // // //       <View
// // // // //         style={[
// // // // //           styles.rowAvatar,
// // // // //           {
// // // // //             backgroundColor: theme.surface || 'rgba(255,255,255,0.08)',
// // // // //             borderColor: theme.primary ? `${theme.primary}55` : 'rgba(251,146,60,0.35)',
// // // // //           },
// // // // //         ]}
// // // // //       >
// // // // //         {item.avatar ? (
// // // // //           <Image source={{ uri: item.avatar }} style={styles.rowAvatarImg} />
// // // // //         ) : (
// // // // //           <Text style={{ fontSize: rft(17) }}>♟</Text>
// // // // //         )}
// // // // //       </View>

// // // // //       {/* Opponent name */}
// // // // //       <View style={styles.rowInfo}>
// // // // //         <Text
// // // // //           style={[styles.rowName, { color: theme.text || '#f1f5f9' }]}
// // // // //           numberOfLines={1}
// // // // //           ellipsizeMode="tail"
// // // // //         >
// // // // //           {item.opponent}
// // // // //         </Text>
// // // // //         {/* Rating diff shown as small pill under name */}
// // // // //         <Text style={[styles.ratingDiff, { color: diffColor }]}>
// // // // //           {diffPrefix}{ratingDiff}
// // // // //         </Text>
// // // // //       </View>

// // // // //       {/* Rating block: current / previous */}
// // // // //       <View style={styles.ratingBlock}>
// // // // //         <Text style={[styles.ratingAfter, { color: theme.text || '#f1f5f9' }]}>
// // // // //           {item.ratingAfter}
// // // // //         </Text>
// // // // //         <Text style={[styles.ratingBefore, { color: theme.textSecondary || '#64748b' }]}>
// // // // //           {item.ratingBefore}
// // // // //         </Text>
// // // // //       </View>

// // // // //       {/* Result badge — soft tinted background, colored icon, no harsh solid fill */}
// // // // //       <View
// // // // //         style={[
// // // // //           styles.resultBadge,
// // // // //           {
// // // // //             backgroundColor: cfg.bg,
// // // // //             borderColor: cfg.border,
// // // // //           },
// // // // //         ]}
// // // // //       >
// // // // //         <Icon name={cfg.icon} size={rft(14)} color={cfg.iconColor} />
// // // // //       </View>

// // // // //       {/* Search button */}
// // // // //       <TouchableOpacity
// // // // //         style={[
// // // // //           styles.searchBtn,
// // // // //           {
// // // // //             backgroundColor: theme.primary ? `${theme.primary}22` : 'rgba(251,146,60,0.15)',
// // // // //             borderColor: theme.primary ? `${theme.primary}44` : 'rgba(251,146,60,0.3)',
// // // // //           },
// // // // //         ]}
// // // // //         onPress={() => {}}
// // // // //         activeOpacity={0.7}
// // // // //       >
// // // // //         <Icon name="search-outline" size={rft(15)} color={theme.primary || '#FB923C'} />
// // // // //       </TouchableOpacity>
// // // // //     </View>
// // // // //   );
// // // // // };

// // // // // // ── Main Screen ──────────────────────────────────────────────────────────────
// // // // // const GameHistoryScreen = () => {
// // // // //   const navigation = useNavigation();
// // // // //   const insets = useSafeAreaInsets();
// // // // //   const { theme } = useTheme();
// // // // //   const { t } = useAppTranslation();
// // // // //   const { earnedBadges, setEarnedBadges, showBadges } = useBadge();

// // // // //   const [selectedFilter, setSelectedFilter] = useState('1 Y');
// // // // //   const [loading, setLoading] = useState(true);
// // // // //   const [history, setHistory] = useState([]);

// // // // //   // Page-visited badge
// // // // //   useEffect(() => {
// // // // //     const triggerPageVisitBadge = async () => {
// // // // //       try {
// // // // //         const token = await AsyncStorage.getItem('accessToken');
// // // // //         if (!token) return;
// // // // //         const data = await response.json();
// // // // //         if (data.success && data.newlyEarned?.length > 0) showBadges(data.newlyEarned);
// // // // //       } catch (err) {
// // // // //         console.error('Failed to trigger page-visited badge:', err);
// // // // //       }
// // // // //     };
// // // // //     triggerPageVisitBadge();
// // // // //   }, []);

// // // // //   // History fetch
// // // // //   useEffect(() => {
// // // // //     const fetchHistory = async () => {
// // // // //       setLoading(true);
// // // // //       try {
// // // // //         const token = await AsyncStorage.getItem('accessToken');
// // // // //         if (!token) {
// // // // //           setHistory(DUMMY_HISTORY);
// // // // //           setLoading(false);
// // // // //           return;
// // // // //         }
// // // // //         const response = await fetch(
// // // // //           `http://13.203.232.239:3000/api/game-history?filter=${encodeURIComponent(selectedFilter)}`,
// // // // //           {
// // // // //             method: 'GET',
// // // // //             headers: {
// // // // //               Authorization: `Bearer ${token}`,
// // // // //               'Content-Type': 'application/json',
// // // // //             },
// // // // //           }
// // // // //         );
// // // // //         const data = await response.json();
// // // // //         setHistory(
// // // // //           data.success && Array.isArray(data.history) ? data.history : DUMMY_HISTORY
// // // // //         );
// // // // //       } catch (err) {
// // // // //         console.error('Failed to fetch game history:', err);
// // // // //         setHistory(DUMMY_HISTORY);
// // // // //       } finally {
// // // // //         setLoading(false);
// // // // //       }
// // // // //     };
// // // // //     fetchHistory();
// // // // //   }, [selectedFilter]);

// // // // //   // Summary counts
// // // // //   const wins   = history.filter(h => h.result === 'win').length;
// // // // //   const losses = history.filter(h => h.result === 'loss').length;
// // // // //   const ties   = history.filter(h => h.result === 'tie').length;
// // // // //   const total  = history.length;

// // // // //   const Content = () => (
// // // // //     <View style={{ flex: 1, paddingTop: insets.top + 30 }}>

// // // // //       {/* Header */}
// // // // //       <CustomHeader title={t('Game History')} onBack={() => navigation.goBack()} />

// // // // //       {/* Summary bar */}
// // // // //       {!loading && total > 0 && (
// // // // //         <View
// // // // //           style={[
// // // // //             styles.summaryBar,
// // // // //             {
// // // // //               backgroundColor: theme.surface || 'rgba(255,255,255,0.04)',
// // // // //               borderColor: theme.border || 'rgba(255,255,255,0.08)',
// // // // //             },
// // // // //           ]}
// // // // //         >
// // // // //           <SummaryPill label={t('Won')}  count={wins}   color="#4ade80" theme={theme} />
// // // // //           <SummaryPill label={t('Lost')} count={losses} color="#f87171" theme={theme} />
// // // // //           <SummaryPill label={t('Draw')} count={ties}   color="#9ca3af" theme={theme} />
// // // // //           <View style={[styles.summaryTotalPill, { backgroundColor: theme.surface || 'rgba(255,255,255,0.07)', borderColor: theme.border || 'rgba(255,255,255,0.1)' }]}>
// // // // //             <Text style={[styles.summaryTotalNum, { color: theme.text || '#f1f5f9' }]}>{total}</Text>
// // // // //             <Text style={[styles.summaryTotalLbl, { color: theme.textSecondary || '#64748b' }]}>{t('Total')}</Text>
// // // // //           </View>
// // // // //         </View>
// // // // //       )}

// // // // //       {/* History list */}
// // // // //       <ScrollView
// // // // //         contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 24 }}
// // // // //         showsVerticalScrollIndicator={false}
// // // // //       >
// // // // //         {loading ? (
// // // // //           <ActivityIndicator
// // // // //             size="large"
// // // // //             color={theme.primary || '#FB923C'}
// // // // //             style={{ marginTop: 48 }}
// // // // //           />
// // // // //         ) : total === 0 ? (
// // // // //           <View style={styles.emptyState}>
// // // // //             <Text style={{ fontSize: rft(40), marginBottom: rf(12) }}>♟</Text>
// // // // //             <Text style={[styles.emptyText, { color: theme.textSecondary || '#64748b' }]}>
// // // // //               {t('No games found for this period')}
// // // // //             </Text>
// // // // //           </View>
// // // // //         ) : (
// // // // //           <View
// // // // //             style={[
// // // // //               styles.historyCard,
// // // // //               {
// // // // //                 backgroundColor: theme.cardBackground || 'rgba(255,255,255,0.02)',
// // // // //                 borderTopColor: theme.border || 'rgba(255,255,255,0.08)',
// // // // //                 borderBottomColor: theme.border || 'rgba(255,255,255,0.08)',
// // // // //               },
// // // // //             ]}
// // // // //           >
// // // // //             {history.map((item, index) => (
// // // // //               <HistoryRow
// // // // //                 key={item.id}
// // // // //                 item={item}
// // // // //                 theme={theme}
// // // // //                 isLast={index === total - 1}
// // // // //               />
// // // // //             ))}
// // // // //           </View>
// // // // //         )}
// // // // //       </ScrollView>
// // // // //     </View>
// // // // //   );

// // // // //   return theme.backgroundGradient ? (
// // // // //     <LinearGradient colors={theme.backgroundGradient} style={{ flex: 1 }}>
// // // // //       <Content />
// // // // //       {earnedBadges.length > 0 && (
// // // // //         <BadgePopup badges={earnedBadges} onFinish={() => setEarnedBadges([])} />
// // // // //       )}
// // // // //     </LinearGradient>
// // // // //   ) : (
// // // // //     <View style={{ flex: 1, backgroundColor: theme.background || '#0F172A' }}>
// // // // //       <Content />
// // // // //       {earnedBadges.length > 0 && (
// // // // //         <BadgePopup badges={earnedBadges} onFinish={() => setEarnedBadges([])} />
// // // // //       )}
// // // // //     </View>
// // // // //   );
// // // // // };

// // // // // // ── Summary pill sub-component ────────────────────────────────────────────────
// // // // // const SummaryPill = ({ label, count, color, theme }) => (
// // // // //   <View style={styles.summaryItem}>
// // // // //     <Text style={[styles.summaryCount, { color }]}>{count}</Text>
// // // // //     <Text style={[styles.summaryLabel, { color: theme.textSecondary || '#64748b' }]}>{label}</Text>
// // // // //   </View>
// // // // // );

// // // // // export default GameHistoryScreen;

// // // // // // ── Styles ───────────────────────────────────────────────────────────────────
// // // // // const styles = StyleSheet.create({

// // // // //   // Summary bar
// // // // //   summaryBar: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     marginHorizontal: width * 0.05,
// // // // //     marginBottom: rf(14),
// // // // //     borderRadius: rf(14),
// // // // //     borderWidth: 1,
// // // // //     paddingVertical: rf(10),
// // // // //     paddingHorizontal: rf(6),
// // // // //   },
// // // // //   summaryItem: {
// // // // //     flex: 1,
// // // // //     alignItems: 'center',
// // // // //     gap: rf(2),
// // // // //   },
// // // // //   summaryCount: {
// // // // //     fontSize: rft(18),
// // // // //     fontWeight: '800',
// // // // //     lineHeight: rft(22),
// // // // //   },
// // // // //   summaryLabel: {
// // // // //     fontSize: rft(10),
// // // // //     fontWeight: '500',
// // // // //     letterSpacing: 0.3,
// // // // //   },
// // // // //   summaryTotalPill: {
// // // // //     alignItems: 'center',
// // // // //     paddingHorizontal: rf(12),
// // // // //     paddingVertical: rf(4),
// // // // //     borderRadius: rf(8),
// // // // //     borderWidth: 1,
// // // // //     marginRight: rf(6),
// // // // //     gap: rf(1),
// // // // //   },
// // // // //   summaryTotalNum: {
// // // // //     fontSize: rft(16),
// // // // //     fontWeight: '800',
// // // // //     lineHeight: rft(20),
// // // // //   },
// // // // //   summaryTotalLbl: {
// // // // //     fontSize: rft(10),
// // // // //     fontWeight: '500',
// // // // //   },

// // // // //   // History card
// // // // //   historyCard: {
// // // // //     width: '100%',
// // // // //     borderTopWidth: StyleSheet.hairlineWidth,
// // // // //     borderBottomWidth: StyleSheet.hairlineWidth,
// // // // //   },

// // // // //   // Row
// // // // //   row: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     paddingVertical: rf(10),
// // // // //     paddingHorizontal: rf(14),
// // // // //     gap: rf(9),
// // // // //   },
// // // // //   rowBorder: {
// // // // //     borderBottomWidth: StyleSheet.hairlineWidth,
// // // // //   },

// // // // //   // Timer chip
// // // // //   timerChip: {
// // // // //     width: rf(28),
// // // // //     height: rf(20),
// // // // //     borderRadius: rf(4),
// // // // //     borderWidth: 1,
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //   },
// // // // //   timerText: {
// // // // //     fontSize: rft(10),
// // // // //     fontWeight: '600',
// // // // //     letterSpacing: 0.2,
// // // // //   },

// // // // //   // Avatar
// // // // //   rowAvatar: {
// // // // //     width: rf(38),
// // // // //     height: rf(38),
// // // // //     borderRadius: rf(8),
// // // // //     borderWidth: 1,
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     overflow: 'hidden',
// // // // //   },
// // // // //   rowAvatarImg: {
// // // // //     width: '100%',
// // // // //     height: '100%',
// // // // //   },

// // // // //   // Name + diff
// // // // //   rowInfo: {
// // // // //     flex: 1,
// // // // //     justifyContent: 'center',
// // // // //     gap: rf(2),
// // // // //   },
// // // // //   rowName: {
// // // // //     fontSize: rft(13),
// // // // //     fontWeight: '600',
// // // // //     letterSpacing: 0.1,
// // // // //   },
// // // // //   ratingDiff: {
// // // // //     fontSize: rft(11),
// // // // //     fontWeight: '600',
// // // // //     opacity: 0.9,
// // // // //   },

// // // // //   // Rating block
// // // // //   ratingBlock: {
// // // // //     alignItems: 'flex-end',
// // // // //     justifyContent: 'center',
// // // // //     gap: rf(1),
// // // // //     minWidth: rf(48),
// // // // //   },
// // // // //   ratingAfter: {
// // // // //     fontSize: rft(13),
// // // // //     fontWeight: '700',
// // // // //     lineHeight: rft(17),
// // // // //   },
// // // // //   ratingBefore: {
// // // // //     fontSize: rft(11),
// // // // //     fontWeight: '400',
// // // // //     lineHeight: rft(14),
// // // // //     textDecorationLine: 'line-through',
// // // // //     opacity: 0.55,
// // // // //   },

// // // // //   // Result badge — soft, not harsh
// // // // //   resultBadge: {
// // // // //     width: rf(26),
// // // // //     height: rf(26),
// // // // //     borderRadius: rf(6),
// // // // //     borderWidth: 1,
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //   },

// // // // //   // Search button — ghost style
// // // // //   searchBtn: {
// // // // //     width: rf(28),
// // // // //     height: rf(28),
// // // // //     borderRadius: rf(6),
// // // // //     borderWidth: 1,
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //   },

// // // // //   // Empty state
// // // // //   emptyState: {
// // // // //     flex: 1,
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     paddingTop: rf(60),
// // // // //   },
// // // // //   emptyText: {
// // // // //     fontSize: rft(14),
// // // // //     textAlign: 'center',
// // // // //     lineHeight: rft(20),
// // // // //   },
// // // // // });

// // // import React, { useState, useEffect } from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   TouchableOpacity,
// // //   StyleSheet,
// // //   Dimensions,
// // //   PixelRatio,
// // //   ScrollView,
// // //   Image,
// // //   ActivityIndicator,
// // // } from 'react-native';
// // // import LinearGradient from 'react-native-linear-gradient';
// // // import { useNavigation } from '@react-navigation/native';
// // // import { useSafeAreaInsets } from 'react-native-safe-area-context';
// // // import { useTheme } from '../context/ThemeContext';
// // // import { useAppTranslation } from '../context/TranslationContext';
// // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // import CustomHeader from '../components/CustomHeader';
// // // import BadgePopup from './BadgePopup';
// // // import { useBadge } from '../context/BadgeContext';
// // // import Icon from 'react-native-vector-icons/Ionicons';

// // // const { width } = Dimensions.get('window');
// // // const scale = width / 390;
// // // const rf = (size) => Math.round(PixelRatio.roundToNearestPixel(size * scale));

// // // const TIME_FILTERS = ['1 W', '1 M', '3 M', '1 Y', 'All Time'];

// // // const RESULT_CONFIG = {
// // //   win:  { icon: 'add',          bg: '#16a34a', text: '#fff' },
// // //   loss: { icon: 'remove',       bg: '#dc2626', text: '#fff' },
// // //   tie:  { icon: 'reorder-two',  bg: '#6b7280', text: '#fff' },
// // // };

// // // const DUMMY_HISTORY = [
// // //   { id: '1',  opponent: 'Imbatmen1',             ratingAfter: 980,  ratingBefore: 1020, opponentScore: 50.9, result: 'tie', avatar: null },
// // //   { id: '2',  opponent: 'zarim_lolo',             ratingAfter: 960,  ratingBefore: 980,  opponentScore: 61.3, result: 'loss', avatar: null },
// // //   { id: '3',  opponent: 'bjfff',                  ratingAfter: 960,  ratingBefore: 960,  opponentScore: null, result: 'win',  avatar: null },
// // //   { id: '4',  opponent: 'MISHA464646',            ratingAfter: 940,  ratingBefore: 960,  opponentScore: null, result: 'loss', avatar: null },
// // //   { id: '5',  opponent: 'Solomonio10',            ratingAfter: 920,  ratingBefore: 940,  opponentScore: null, result: 'loss', avatar: null },
// // //   { id: '6',  opponent: 'alb1rl',                 ratingAfter: 950,  ratingBefore: 920,  opponentScore: 51.3, result: 'win',  avatar: null },
// // //   { id: '7',  opponent: 'KingsShadow1',           ratingAfter: 950,  ratingBefore: 950,  opponentScore: null, result: 'loss', avatar: null },
// // //   { id: '8',  opponent: 'TwoDayOldRice',          ratingAfter: 930,  ratingBefore: 950,  opponentScore: null, result: 'loss', avatar: null },
// // //   { id: '9',  opponent: 'thotakurisanthoshkumar', ratingAfter: 960,  ratingBefore: 930,  opponentScore: 79.5, result: 'win',  avatar: null },
// // //   { id: '10', opponent: 'ishiee_07',              ratingAfter: 940,  ratingBefore: 960,  opponentScore: null, result: 'loss', avatar: null },
// // //   { id: '11', opponent: 'MoumenBLK',              ratingAfter: 940,  ratingBefore: 940,  opponentScore: null, result: 'loss', avatar: null },
// // //   { id: '12', opponent: 'Adrian324p',             ratingAfter: 970,  ratingBefore: 940,  opponentScore: null, result: 'win',  avatar: null },
// // // ];

// // // const TIMER_VALUES = ['E2', 'M2', 'H2', 'H4', 'M4', 'E4'];
// // // const getRandomTimer = () => TIMER_VALUES[Math.floor(Math.random() * TIMER_VALUES.length)];

// // // // ── Single history row ──────────────────────────────────────────────────────
// // // const HistoryRow = ({ item, theme, isLast }) => {
// // //   const cfg = RESULT_CONFIG[item.result] ?? RESULT_CONFIG.tie;
// // //   const randomTimer = getRandomTimer();

// // //   return (
// // //     <View style={[
// // //       styles.row,
// // //       { borderBottomColor: theme.border || 'rgba(255,255,255,0.08)' },
// // //       !isLast && styles.rowBorder,
// // //     ]}>

// // //       {/* Timer value */}
// // //       <View style={styles.timerIcon}>
// // //         <Text style={{ fontSize: rf(12), fontWeight: '600', color: theme.textSecondary || '#94a3b8' }}>
// // //           {randomTimer}
// // //         </Text>
// // //       </View>

// // //       {/* Avatar */}
// // //       <View style={[styles.rowAvatar, {
// // //         backgroundColor: theme.surface || 'rgba(255,255,255,0.1)',
// // //         borderColor: theme.primary || '#FB923C',
// // //       }]}>
// // //         {item.avatar ? (
// // //           <Image source={{ uri: item.avatar }} style={styles.rowAvatarImg} />
// // //         ) : (
// // //           <Text style={{ fontSize: rf(18) }}>♟</Text>
// // //         )}
// // //       </View>

// // //       {/* Name */}
// // //       <View style={styles.rowInfo}>
// // //         <Text style={[styles.rowName, { color: theme.text || '#ffffff' }]} numberOfLines={1}>
// // //           {item.opponent}
// // //         </Text>
// // //       </View>

// // //       {/* Rating block: before rating only */}
// // //       <View style={styles.ratingBlock}>
// // //         <Text style={[styles.ratingBefore, { color: theme.text || '#ffffff' }]}>
// // //           {item.ratingBefore}
// // //         </Text>
// // //       </View>

// // //       {/* Result badge */}
// // //       <View style={[styles.resultBadge, { backgroundColor: cfg.bg }]}>
// // //         <Icon name={cfg.icon} size={rf(14)} color={cfg.text} />
// // //       </View>

// // //       {/* Search button */}
// // //       <TouchableOpacity
// // //         style={[styles.starBtn, { backgroundColor: theme.primary || '#FB923C' }]}
// // //         onPress={() => {}}
// // //         activeOpacity={0.75}
// // //       >
// // //         <Icon name="search" size={rf(18)} color="#fff" />
// // //       </TouchableOpacity>
// // //     </View>
// // //   );
// // // };

// // // // ── Shared fetch hook ───────────────────────────────────────────────────────
// // // const useGameHistory = (selectedFilter) => {
// // //   const [loading, setLoading] = useState(true);
// // //   const [history, setHistory] = useState([]);

// // //   useEffect(() => {
// // //     const fetchHistory = async () => {
// // //       setLoading(true);
// // //       try {
// // //         const token = await AsyncStorage.getItem('accessToken');
// // //         if (!token) { setHistory(DUMMY_HISTORY); setLoading(false); return; }

// // //         const response = await fetch(
// // //           `http://13.203.232.239:3000/api/game-history?filter=${encodeURIComponent(selectedFilter)}`,
// // //           {
// // //             method: 'GET',
// // //             headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
// // //           }
// // //         );
// // //         const data = await response.json();
// // //         setHistory(data.success && Array.isArray(data.history) ? data.history : DUMMY_HISTORY);
// // //       } catch (err) {
// // //         console.error('Failed to fetch game history:', err);
// // //         setHistory(DUMMY_HISTORY);
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };
// // //     fetchHistory();
// // //   }, [selectedFilter]);

// // //   return { loading, history };
// // // };

// // // // ── Embeddable table-only export for Home ───────────────────────────────────
// // // export const HistoryTable = () => {
// // //   const { theme } = useTheme();
// // //   const { t } = useAppTranslation();
// // //   const [selectedFilter] = useState('1 Y');
// // //   const { loading, history } = useGameHistory(selectedFilter);

// // //   return (
// // //     <View style={{ width: '100%', flex: 1 }}>

// // //       {/* Legend */}
// // //       <View style={styles.legendRow}>
// // //         {Object.entries(RESULT_CONFIG).map(([key, cfg]) => (
// // //           <View key={key} style={styles.legendItem}>
// // //             <View style={[styles.legendDot, { backgroundColor: cfg.bg }]} />
// // //             <Text style={[styles.legendText, { color: theme.textSecondary || '#94a3b8' }]}>
// // //               {key.charAt(0).toUpperCase() + key.slice(1)}
// // //             </Text>
// // //           </View>
// // //         ))}
// // //       </View>

// // //       {/* Table */}
// // //       <ScrollView
// // //         showsVerticalScrollIndicator={false}
// // //         contentContainerStyle={{ paddingBottom: 20 }}
// // //       >
// // //         {loading ? (
// // //           <ActivityIndicator
// // //             size="large"
// // //             color={theme.primary || '#FB923C'}
// // //             style={{ marginTop: 40 }}
// // //           />
// // //         ) : history.length === 0 ? (
// // //           <View style={styles.emptyState}>
// // //             <Text style={{ fontSize: rf(36), marginBottom: rf(12) }}>♟</Text>
// // //             <Text style={[styles.emptyText, { color: theme.textSecondary || '#94a3b8' }]}>
// // //               {t('No games found')}
// // //             </Text>
// // //           </View>
// // //         ) : (
// // //           <View style={[styles.historyCard, {
// // //             backgroundColor: theme.cardBackground || 'rgba(255,255,255,0.05)',
// // //             borderTopColor: theme.border || 'rgba(255,255,255,0.1)',
// // //             borderBottomColor: theme.border || 'rgba(255,255,255,0.1)',
// // //           }]}>
// // //             {history.map((item, index) => (
// // //               <HistoryRow
// // //                 key={item.id}
// // //                 item={item}
// // //                 theme={theme}
// // //                 isLast={index === history.length - 1}
// // //               />
// // //             ))}
// // //           </View>
// // //         )}
// // //       </ScrollView>
// // //     </View>
// // //   );
// // // };

// // // // ── Full standalone screen ──────────────────────────────────────────────────
// // // const GameHistoryScreen = () => {
// // //   const navigation = useNavigation();
// // //   const insets = useSafeAreaInsets();
// // //   const { theme } = useTheme();
// // //   const { t } = useAppTranslation();
// // //   const { earnedBadges, setEarnedBadges, showBadges } = useBadge();

// // //   const [selectedFilter] = useState('1 Y');
// // //   const { loading, history } = useGameHistory(selectedFilter);

// // //   // Page-visited badge
// // //   useEffect(() => {
// // //     const triggerPageVisitBadge = async () => {
// // //       try {
// // //         const token = await AsyncStorage.getItem('accessToken');
// // //         if (!token) return;
// // //         const data = await response.json();
// // //         if (data.success && data.newlyEarned?.length > 0) showBadges(data.newlyEarned);
// // //       } catch (err) {
// // //         console.error('Failed to trigger page-visited badge:', err);
// // //       }
// // //     };
// // //     triggerPageVisitBadge();
// // //   }, []);

// // //   const Content = () => (
// // //     <View style={{ flex: 1, paddingTop: insets.top + 30 }}>

// // //       {/* Header */}
// // //       <CustomHeader title={t('Game History')} onBack={() => navigation.goBack()} />

// // //       {/* Legend */}
// // //       <View style={styles.legendRow}>
// // //         {Object.entries(RESULT_CONFIG).map(([key, cfg]) => (
// // //           <View key={key} style={styles.legendItem}>
// // //             <View style={[styles.legendDot, { backgroundColor: cfg.bg }]} />
// // //             <Text style={[styles.legendText, { color: theme.textSecondary || '#94a3b8' }]}>
// // //               {key.charAt(0).toUpperCase() + key.slice(1)}
// // //             </Text>
// // //           </View>
// // //         ))}
// // //       </View>

// // //       {/* History list */}
// // //       <ScrollView
// // //         contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 20 }}
// // //         showsVerticalScrollIndicator={false}
// // //       >
// // //         {loading ? (
// // //           <ActivityIndicator size="large" color={theme.primary || '#FB923C'} style={{ marginTop: 40 }} />
// // //         ) : history.length === 0 ? (
// // //           <View style={styles.emptyState}>
// // //             <Text style={{ fontSize: rf(36), marginBottom: rf(12) }}>♟</Text>
// // //             <Text style={[styles.emptyText, { color: theme.textSecondary || '#94a3b8' }]}>
// // //               {t('No games found for this period')}
// // //             </Text>
// // //           </View>
// // //         ) : (
// // //           <View style={[styles.historyCard, {
// // //             backgroundColor: theme.cardBackground || 'rgba(255,255,255,0.05)',
// // //             borderTopColor: theme.border || 'rgba(255,255,255,0.1)',
// // //             borderBottomColor: theme.border || 'rgba(255,255,255,0.1)',
// // //           }]}>
// // //             {history.map((item, index) => (
// // //               <HistoryRow
// // //                 key={item.id}
// // //                 item={item}
// // //                 theme={theme}
// // //                 isLast={index === history.length - 1}
// // //               />
// // //             ))}
// // //           </View>
// // //         )}
// // //       </ScrollView>
// // //     </View>
// // //   );

// // //   return theme.backgroundGradient ? (
// // //     <LinearGradient colors={theme.backgroundGradient} style={{ flex: 1 }}>
// // //       <Content />
// // //       {earnedBadges.length > 0 && <BadgePopup badges={earnedBadges} onFinish={() => setEarnedBadges([])} />}
// // //     </LinearGradient>
// // //   ) : (
// // //     <View style={{ flex: 1, backgroundColor: '#0F172A' }}>
// // //       <Content />
// // //       {earnedBadges.length > 0 && <BadgePopup badges={earnedBadges} onFinish={() => setEarnedBadges([])} />}
// // //     </View>
// // //   );
// // // };

// // // export default GameHistoryScreen;

// // // // ── Styles ──────────────────────────────────────────────────────────────────
// // // const styles = StyleSheet.create({

// // //   legendRow: {
// // //     flexDirection: 'row',
// // //     marginHorizontal: width * 0.05,
// // //     marginBottom: rf(8),
// // //     marginTop: rf(6),
// // //     gap: rf(14),
// // //   },
// // //   legendItem: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: rf(5),
// // //   },
// // //   legendDot: {
// // //     width: rf(8),
// // //     height: rf(8),
// // //     borderRadius: rf(4),
// // //   },
// // //   legendText: {
// // //     fontSize: rf(11),
// // //     fontWeight: '500',
// // //   },

// // //   historyCard: {
// // //     width: '100%',
// // //     borderTopWidth: 1,
// // //     borderBottomWidth: 1,
// // //   },

// // //   row: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     paddingVertical: rf(10),
// // //     paddingHorizontal: rf(12),
// // //     gap: rf(8),
// // //   },
// // //   rowBorder: {
// // //     borderBottomWidth: 1,
// // //   },

// // //   timerIcon: {
// // //     width: rf(22),
// // //     alignItems: 'center',
// // //   },

// // //   rowAvatar: {
// // //     width: rf(38),
// // //     height: rf(38),
// // //     borderRadius: rf(8),
// // //     borderWidth: 1.5,
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     overflow: 'hidden',
// // //   },
// // //   rowAvatarImg: {
// // //     width: '100%',
// // //     height: '100%',
// // //   },

// // //   rowInfo: {
// // //     flex: 1,
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     flexWrap: 'wrap',
// // //     gap: rf(3),
// // //   },
// // //   rowName: {
// // //     fontSize: rf(13),
// // //     fontWeight: '600',
// // //   },
// // //   rowScore: {
// // //     fontSize: rf(12),
// // //     fontWeight: '400',
// // //   },

// // //   ratingBlock: {
// // //     alignItems: 'flex-end',
// // //     justifyContent: 'center',
// // //     minWidth: rf(44),
// // //   },
// // //   ratingAfter: {
// // //     fontSize: rf(13),
// // //     fontWeight: '700',
// // //     lineHeight: rf(17),
// // //   },
// // //   ratingBefore: {
// // //     fontSize: rf(11),
// // //     fontWeight: '400',
// // //     lineHeight: rf(15),
// // //     textDecorationLine: 'line-through',
// // //   },

// // //   resultBadge: {
// // //     width: rf(26),
// // //     height: rf(26),
// // //     borderRadius: rf(5),
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //   },

// // //   starBtn: {
// // //     width: rf(30),
// // //     height: rf(30),
// // //     borderRadius: rf(6),
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //   },

// // //   emptyState: {
// // //     flex: 1,
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     paddingTop: rf(60),
// // //   },
// // //   emptyText: {
// // //     fontSize: rf(14),
// // //     textAlign: 'center',
// // //   },
// // // });

// // import React, { useState, useEffect, useCallback } from 'react';
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   StyleSheet,
// //   Dimensions,
// //   PixelRatio,
// //   ScrollView,
// //   Image,
// //   ActivityIndicator,
// // } from 'react-native';
// // import LinearGradient from 'react-native-linear-gradient';
// // import { useNavigation } from '@react-navigation/native';
// // import { useSafeAreaInsets } from 'react-native-safe-area-context';
// // import { useTheme } from '../context/ThemeContext';
// // import { useAppTranslation } from '../context/TranslationContext';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import CustomHeader from '../components/CustomHeader';
// // import BadgePopup from './BadgePopup';
// // import { useBadge } from '../context/BadgeContext';
// // import Icon from 'react-native-vector-icons/Ionicons';

// // const { width } = Dimensions.get('window');
// // const scale = width / 390;
// // const rf = (size) => Math.round(PixelRatio.roundToNearestPixel(size * scale));

// // const BASE_URL = 'http://13.203.232.239:3000';

// // const RESULT_CONFIG = {
// //   win:     { icon: 'add',          bg: '#16a34a', text: '#fff' },
// //   loss:    { icon: 'remove',       bg: '#dc2626', text: '#fff' },
// //   draw:    { icon: 'reorder-two',  bg: '#6b7280', text: '#fff' },
// //   unknown: { icon: 'reorder-two',  bg: '#6b7280', text: '#fff' },
// // };

// // // Deterministic colour from username so same player always gets same colour
// // const AVATAR_COLORS = ['#FB923C', '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];
// // const getAvatarColor = (name) =>
// //   AVATAR_COLORS[(name?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];

// // const getInitials = (name) => {
// //   if (!name) return '?';
// //   const parts = name.trim().split(/[\s_]+/);
// //   return parts.length >= 2
// //     ? (parts[0][0] + parts[1][0]).toUpperCase()
// //     : name.slice(0, 2).toUpperCase();
// // };

// // // ── Avatar with initials fallback ───────────────────────────────────────────
// // const AvatarWithInitials = ({ uri, name }) => {
// //   const [imgError, setImgError] = useState(false);
// //   const size = rf(38);

// //   if (uri && !imgError) {
// //     return (
// //       <Image
// //         source={{ uri }}
// //         style={{ width: size, height: size }}
// //         onError={() => setImgError(true)}
// //       />
// //     );
// //   }

// //   return (
// //     <View style={{
// //       width: size,
// //       height: size,
// //       backgroundColor: getAvatarColor(name),
// //       alignItems: 'center',
// //       justifyContent: 'center',
// //     }}>
// //       <Text style={{ fontSize: rf(13), fontWeight: '700', color: '#fff' }}>
// //         {getInitials(name)}
// //       </Text>
// //     </View>
// //   );
// // };

// // // ── Single history row ──────────────────────────────────────────────────────
// // const HistoryRow = ({ item, theme, isLast }) => {
// //   const outcomeKey = item.outcome ?? 'unknown';
// //   const cfg = RESULT_CONFIG[outcomeKey] ?? RESULT_CONFIG.unknown;

// //   const getOpponentName = () => {
// //     if (item.gameMode === 'computer') return item.computer?.name ?? 'Computer';
// //     if (item.gameMode === 'practice') return 'Practice';
// //     return item.opponent?.username ?? 'Unknown Player';
// //   };

// //   const getOpponentAvatar = () => {
// //     if (item.gameMode === 'pvp' || item.gameMode === 'friend') {
// //       return item.opponent?.profileImage ?? null;
// //     }
// //     return null;
// //   };

// //   const opponentName   = getOpponentName();
// //   const opponentAvatar = getOpponentAvatar();

// //   // ratingBefore = myRatingAtMatch (rating going INTO the game)
// //   // ratingAfter  = myRatingAtMatch + ratingChange
// //   const ratingBefore = item.myRatingAtMatch ?? null;
// //   const ratingAfter  =
// //     ratingBefore != null && item.ratingChange != null
// //       ? ratingBefore + item.ratingChange
// //       : null;

// //   const subLabel = (() => {
// //     if (item.gameMode === 'computer' && item.computer?.label) return item.computer.label;
// //     if (item.gameMode === 'practice')
// //       // return `${item.correctCount ?? 0}/${item.totalQuestions ?? 0} correct`;
// //     return null;
// //   })();

// //   return (
// //     <View style={[
// //       styles.row,
// //       { borderBottomColor: theme.border || 'rgba(255,255,255,0.08)' },
// //       !isLast && styles.rowBorder,
// //     ]}>

// //       {/* Game type label (E2, M4, …) */}
// //       <View style={styles.timerIcon}>
// //         <Text style={{ fontSize: rf(12), fontWeight: '600', color: theme.textSecondary || '#94a3b8' }}>
// //           {item.gameType ?? '—'}
// //         </Text>
// //       </View>

// //       {/* Avatar */}
// //       <View style={[styles.rowAvatar, {
// //         backgroundColor: theme.surface || 'rgba(255,255,255,0.1)',
// //         borderColor: theme.primary || '#FB923C',
// //       }]}>
// //         <AvatarWithInitials uri={opponentAvatar} name={opponentName} />
// //       </View>

// //       {/* Name + sublabel */}
// //       <View style={styles.rowInfo}>
// //         <Text style={[styles.rowName, { color: theme.text || '#ffffff' }]} numberOfLines={1}>
// //           {opponentName}
// //         </Text>
// //         {subLabel ? (
// //           <Text style={[styles.rowScore, { color: theme.textSecondary || '#94a3b8' }]}>
// //             {subLabel}
// //           </Text>
// //         ) : null}
// //       </View>

// //       {/* Rating block — varies by game mode */}
// //       <View style={styles.ratingBlock}>
// //         {item.gameMode === 'practice' ? (
// //           // Practice: show "Practice" label in accent colour
// //           <Text style={[styles.ratingAfter, { color: theme.primary || '#FB923C', fontSize: rf(11) }]}>
// //             Practice
// //           </Text>
// //         ) : item.gameMode === 'computer' ? (
// //           // Computer: show level badge  e.g. "L3" bold + level name below
// //           <>
// //             <Text style={[styles.ratingAfter, { color: theme.primary || '#FB923C' }]}>
// //               {item.computer?.label ?? 'CPU'}
// //             </Text>
// //             <Text style={[styles.ratingBefore, {
// //               color: theme.textSecondary || '#94a3b8',
// //               textDecorationLine: 'none',
// //               fontSize: rf(10),
// //             }]}>
// //               {item.computer?.name ?? ''}
// //             </Text>
// //           </>
// //         ) : ratingAfter != null ? (
// //           // PvP / friend: show after (bold) and before (strikethrough)
// //           <>
// //             <Text style={[styles.ratingBefore, { color: theme.text || '#ffffff' }]}>
// //               {ratingBefore}
// //             </Text>
// //             {/* <Text style={[styles.ratingBefore, { color: theme.textSecondary || '#94a3b8' }]}>
// //               {ratingBefore}
// //             </Text> */}
            
// //           </>
// //         ) : (
// //           <Text style={[styles.ratingAfter, { color: theme.textSecondary || '#94a3b8' }]}>—</Text>
// //         )}
// //       </View>

// //       {/* Result badge */}
// //       <View style={[styles.resultBadge, { backgroundColor: cfg.bg }]}>
// //         <Icon name={cfg.icon} size={rf(14)} color={cfg.text} />
// //       </View>

// //       {/* Search button */}
// //       <TouchableOpacity
// //         style={[styles.starBtn, { backgroundColor: theme.primary || '#FB923C' }]}
// //         onPress={() => {}}
// //         activeOpacity={0.75}
// //       >
// //         <Icon name="search" size={rf(18)} color="#fff" />
// //       </TouchableOpacity>
// //     </View>
// //   );
// // };

// // // ── Shared fetch hook ───────────────────────────────────────────────────────
// // const useGameHistory = (endpoint = '/api/history/feed') => {
// //   const [loading, setLoading] = useState(true);
// //   const [history, setHistory] = useState([]);
// //   const [error, setError]     = useState(null);

// //   const fetchHistory = useCallback(async () => {
// //     setLoading(true);
// //     setError(null);
// //     try {
// //       const token = await AsyncStorage.getItem('accessToken');
// //       if (!token) {
// //         setHistory([]);
// //         setLoading(false);
// //         return;
// //       }

// //       const response = await fetch(
// //         `${BASE_URL}${endpoint}?limit=50&skip=0`,
// //         {
// //           method: 'GET',
// //           headers: { Authorization: `Bearer ${token}` },
// //         }
// //       );

// //       const contentType = response.headers.get('content-type');
// //       if (!contentType || !contentType.includes('application/json')) {
// //         throw new Error('Unexpected response format from server');
// //       }

// //       const data = await response.json();

// //       if (data.success && Array.isArray(data.games)) {
// //         setHistory(data.games);
// //       } else {
// //         setHistory([]);
// //       }
// //     } catch (err) {
// //       console.error('Failed to fetch game history:', err);
// //       setError(err.message ?? 'Failed to load history');
// //       setHistory([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [endpoint]);

// //   useEffect(() => { fetchHistory(); }, [fetchHistory]);

// //   return { loading, history, error, refetch: fetchHistory };
// // };

// // // ── Legend ──────────────────────────────────────────────────────────────────
// // const Legend = ({ theme }) => (
// //   <View style={styles.legendRow}>
// //     {['win', 'loss', 'draw'].map((key) => (
// //       <View key={key} style={styles.legendItem}>
// //         <View style={[styles.legendDot, { backgroundColor: RESULT_CONFIG[key].bg }]} />
// //         <Text style={[styles.legendText, { color: theme.textSecondary || '#94a3b8' }]}>
// //           {key.charAt(0).toUpperCase() + key.slice(1)}
// //         </Text>
// //       </View>
// //     ))}
// //   </View>
// // );

// // // ── History list content ────────────────────────────────────────────────────
// // const HistoryList = ({ loading, history, error, theme, t, bottomPad = 20 }) => {
// //   if (loading) {
// //     return (
// //       <ActivityIndicator
// //         size="large"
// //         color={theme.primary || '#FB923C'}
// //         style={{ marginTop: 40 }}
// //       />
// //     );
// //   }
// //   if (error) {
// //     return (
// //       <View style={styles.emptyState}>
// //         <Text style={{ fontSize: rf(28), marginBottom: rf(12) }}>⚠️</Text>
// //         <Text style={[styles.emptyText, { color: theme.textSecondary || '#94a3b8' }]}>{error}</Text>
// //       </View>
// //     );
// //   }
// //   if (history.length === 0) {
// //     return (
// //       <View style={styles.emptyState}>
// //         <Text style={{ fontSize: rf(36), marginBottom: rf(12) }}>♟</Text>
// //         <Text style={[styles.emptyText, { color: theme.textSecondary || '#94a3b8' }]}>
// //           {t('No games found')}
// //         </Text>
// //       </View>
// //     );
// //   }
// //   return (
// //     <View style={[styles.historyCard, {
// //       backgroundColor: theme.cardBackground || 'rgba(255,255,255,0.05)',
// //       borderTopColor: theme.border || 'rgba(255,255,255,0.1)',
// //       borderBottomColor: theme.border || 'rgba(255,255,255,0.1)',
// //     }]}>
// //       {history.map((item, index) => (
// //         <HistoryRow
// //           key={item.gameId ?? String(index)}
// //           item={item}
// //           theme={theme}
// //           isLast={index === history.length - 1}
// //         />
// //       ))}
// //     </View>
// //   );
// // };

// // // ── Embeddable table-only export for Home ───────────────────────────────────
// // export const HistoryTable = () => {
// //   const { theme } = useTheme();
// //   const { t }     = useAppTranslation();
// //   const { loading, history, error } = useGameHistory('/api/history/feed');

// //   return (
// //     <View style={{ width: '100%', flex: 1 }}>
// //       <Legend theme={theme} />
// //       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
// //         <HistoryList loading={loading} history={history} error={error} theme={theme} t={t} />
// //       </ScrollView>
// //     </View>
// //   );
// // };

// // // ── Full standalone screen ──────────────────────────────────────────────────
// // const GameHistoryScreen = () => {
// //   const navigation = useNavigation();
// //   const insets     = useSafeAreaInsets();
// //   const { theme }  = useTheme();
// //   const { t }      = useAppTranslation();
// //   const { earnedBadges, setEarnedBadges, showBadges } = useBadge();

// //   const { loading, history, error } = useGameHistory('/api/history/feed');

// //   // Page-visited badge
// //   useEffect(() => {
// //     const triggerPageVisitBadge = async () => {
// //       try {
// //         const token = await AsyncStorage.getItem('accessToken');
// //         if (!token) return;
// //         const response = await fetch(`${BASE_URL}/api/badges/page-visit`, {
// //           method: 'POST',
// //           headers: { Authorization: `Bearer ${token}` },
// //         });
// //         const contentType = response.headers.get('content-type');
// //         if (!contentType || !contentType.includes('application/json')) return;
// //         const data = await response.json();
// //         if (data.success && data.newlyEarned?.length > 0) showBadges(data.newlyEarned);
// //       } catch (err) {
// //         console.error('Failed to trigger page-visited badge:', err);
// //       }
// //     };
// //     triggerPageVisitBadge();
// //   }, []);

// //   const Content = () => (
// //     <View style={{ flex: 1, paddingTop: insets.top + 30 }}>
// //       <CustomHeader title={t('Game History')} onBack={() => navigation.goBack()} />
// //       <Legend theme={theme} />
// //       <ScrollView
// //         contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 20 }}
// //         showsVerticalScrollIndicator={false}
// //       >
// //         <HistoryList
// //           loading={loading}
// //           history={history}
// //           error={error}
// //           theme={theme}
// //           t={t}
// //           bottomPad={insets.bottom + 20}
// //         />
// //       </ScrollView>
// //     </View>
// //   );

// //   return theme.backgroundGradient ? (
// //     <LinearGradient colors={theme.backgroundGradient} style={{ flex: 1 }}>
// //       <Content />
// //       {earnedBadges.length > 0 && (
// //         <BadgePopup badges={earnedBadges} onFinish={() => setEarnedBadges([])} />
// //       )}
// //     </LinearGradient>
// //   ) : (
// //     <View style={{ flex: 1, backgroundColor: '#0F172A' }}>
// //       <Content />
// //       {earnedBadges.length > 0 && (
// //         <BadgePopup badges={earnedBadges} onFinish={() => setEarnedBadges([])} />
// //       )}
// //     </View>
// //   );
// // };

// // export default GameHistoryScreen;

// // // ── Styles ──────────────────────────────────────────────────────────────────
// // const styles = StyleSheet.create({
// //   legendRow: {
// //     flexDirection: 'row',
// //     marginHorizontal: width * 0.05,
// //     marginBottom: rf(8),
// //     marginTop: rf(6),
// //     gap: rf(14),
// //   },
// //   legendItem:  { flexDirection: 'row', alignItems: 'center', gap: rf(5) },
// //   legendDot:   { width: rf(8), height: rf(8), borderRadius: rf(4) },
// //   legendText:  { fontSize: rf(11), fontWeight: '500' },

// //   historyCard: { width: '100%', borderTopWidth: 1, borderBottomWidth: 1 },

// //   row: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingVertical: rf(10),
// //     paddingHorizontal: rf(12),
// //     gap: rf(8),
// //   },
// //   rowBorder: { borderBottomWidth: 1 },

// //   timerIcon: { width: rf(22), alignItems: 'center' },

// //   rowAvatar: {
// //     width: rf(38),
// //     height: rf(38),
// //     borderRadius: rf(8),
// //     borderWidth: 1.5,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     overflow: 'hidden',
// //   },

// //   rowInfo: { flex: 1, flexDirection: 'column', justifyContent: 'center', gap: rf(2) },
// //   rowName:  { fontSize: rf(13), fontWeight: '600' },
// //   rowScore: { fontSize: rf(11), fontWeight: '400' },

// //   ratingBlock: { alignItems: 'flex-end', justifyContent: 'center', minWidth: rf(44) },
// //   ratingAfter: { fontSize: rf(13), fontWeight: '700', lineHeight: rf(17) },
// //   ratingBefore: {
// //     fontSize: rf(11),
// //     fontWeight: '400',
// //     lineHeight: rf(15),
// //     // textDecorationLine: 'line-through',
// //   },

// //   resultBadge: {
// //     width: rf(26),
// //     height: rf(26),
// //     borderRadius: rf(5),
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   starBtn: {
// //     width: rf(30),
// //     height: rf(30),
// //     borderRadius: rf(6),
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },

// //   emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: rf(60) },
// //   emptyText:  { fontSize: rf(14), textAlign: 'center' },
// // });






// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   PixelRatio,
//   ScrollView,
//   Image,
//   ActivityIndicator,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import { useNavigation } from '@react-navigation/native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useTheme } from '../context/ThemeContext';
// import { useAppTranslation } from '../context/TranslationContext';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import CustomHeader from '../components/CustomHeader';
// import BadgePopup from './BadgePopup';
// import { useBadge } from '../context/BadgeContext';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { Linking } from 'react-native';

// const { width } = Dimensions.get('window');
// const scale = width / 390;
// const rf = (size) => Math.round(PixelRatio.roundToNearestPixel(size * scale));

// const BASE_URL = 'http://13.203.232.239:3000';

// // Keys kept in English internally; display text translated via t()
// const RESULT_CONFIG = {
//   win:     { icon: 'add',          bg: '#16a34a', text: '#fff', labelKey: 'Win'  },
//   loss:    { icon: 'remove',       bg: '#dc2626', text: '#fff', labelKey: 'Loss' },
//   draw:    { icon: 'reorder-two',  bg: '#6b7280', text: '#fff', labelKey: 'Draw' },
//   unknown: { icon: 'reorder-two',  bg: '#6b7280', text: '#fff', labelKey: 'Draw' },
// };

// const AVATAR_COLORS = ['#FB923C', '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];
// const getAvatarColor = (name) =>
//   AVATAR_COLORS[(name?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];

// const getInitials = (name) => {
//   if (!name) return '?';
//   const parts = name.trim().split(/[\s_]+/);
//   return parts.length >= 2
//     ? (parts[0][0] + parts[1][0]).toUpperCase()
//     : name.slice(0, 2).toUpperCase();
// };

// // ── Avatar with initials fallback ───────────────────────────────────────────
// const AvatarWithInitials = ({ uri, name }) => {
//   const [imgError, setImgError] = useState(false);
//   const size = rf(38);

//   if (uri && !imgError) {
//     return (
//       <Image
//         source={{ uri }}
//         style={{ width: size, height: size }}
//         onError={() => setImgError(true)}
//       />
//     );
//   }

//   return (
//     <View style={{
//       width: size,
//       height: size,
//       backgroundColor: getAvatarColor(name),
//       alignItems: 'center',
//       justifyContent: 'center',
//     }}>
//       <Text style={{ fontSize: rf(13), fontWeight: '700', color: '#fff' }}>
//         {getInitials(name)}
//       </Text>
//     </View>
//   );
// };

// // ── Single history row ──────────────────────────────────────────────────────
// const HistoryRow = ({ item, theme, isLast, t }) => {
//   const outcomeKey = item.outcome ?? 'unknown';
//   const cfg = RESULT_CONFIG[outcomeKey] ?? RESULT_CONFIG.unknown;

//   const getOpponentName = () => {
//     if (item.gameMode === 'computer') return item.computer?.name ?? t('Computer');
//     if (item.gameMode === 'practice') return t('Practice');
//     return item.opponent?.username ?? t('Unknown');
//   };

//   const getOpponentAvatar = () => {
//     if (item.gameMode === 'pvp' || item.gameMode === 'friend') {
//       return item.opponent?.profileImage ?? null;
//     }
//     return null;
//   };

//   const opponentName   = getOpponentName();
//   const opponentAvatar = getOpponentAvatar();

//   const ratingBefore = item.myRatingAtMatch ?? null;
//   const ratingAfter  =
//     ratingBefore != null && item.ratingChange != null
//       ? ratingBefore + item.ratingChange
//       : null;

//   const subLabel = (() => {
//     if (item.gameMode === 'computer' && item.computer?.label) return item.computer.label;
//     if (item.gameMode === 'practice') return null;
//     return null;
//   })();

//   return (
//     <View style={[
//       styles.row,
//       { borderBottomColor: theme.border || 'rgba(255,255,255,0.08)' },
//       !isLast && styles.rowBorder,
//     ]}>

//       {/* Game type label (E2, M4, …) */}
//       <View style={styles.timerIcon}>
//         <Text style={{ fontSize: rf(12), fontWeight: '600', color: theme.textSecondary || '#94a3b8' }}>
//           {item.gameType ? t(item.gameType) : '—'}
//         </Text>
//       </View>

//       {/* Avatar */}
//       <View style={[styles.rowAvatar, {
//         backgroundColor: theme.surface || 'rgba(255,255,255,0.1)',
//         borderColor: theme.primary || '#FB923C',
//       }]}>
//         <AvatarWithInitials uri={opponentAvatar} name={opponentName} />
//       </View>

//       {/* Name + sublabel */}
//       <View style={styles.rowInfo}>
//         <Text style={[styles.rowName, { color: theme.text || '#ffffff' }]} numberOfLines={1}>
//           {opponentName}
//         </Text>
//         {subLabel ? (
//           <Text style={[styles.rowScore, { color: theme.textSecondary || '#94a3b8' }]}>
//             {subLabel}
//           </Text>
//         ) : null}
//       </View>

//       {/* Rating block */}
//       <View style={styles.ratingBlock}>
//         {item.gameMode === 'practice' ? (
//           <Text style={[styles.ratingAfter, { color: theme.primary || '#FB923C', fontSize: rf(11) }]}>
//             {t('Practice')}
//           </Text>
//         ) : item.gameMode === 'computer' ? (
//           <>
//             <Text style={[styles.ratingAfter, { color: theme.primary || '#FB923C' }]}>
//               {item.computer?.label ?? t('CPU')}
//             </Text>
//             <Text style={[styles.ratingBefore, {
//               color: theme.textSecondary || '#94a3b8',
//               textDecorationLine: 'none',
//               fontSize: rf(10),
//             }]}>
//               {item.computer?.name ?? ''}
//             </Text>
//           </>
//         ) : ratingAfter != null ? (
//           <>
//             <Text style={[styles.ratingBefore, { color: theme.text || '#ffffff' }]}>
//               {ratingBefore}
//             </Text>
//           </>
//         ) : (
//           <Text style={[styles.ratingAfter, { color: theme.textSecondary || '#94a3b8' }]}>—</Text>
//         )}
//       </View>

//       {/* Result badge */}
//       <View style={[styles.resultBadge, { backgroundColor: cfg.bg }]}>
//         <Icon name={cfg.icon} size={rf(14)} color={cfg.text} />
//       </View>

//       {/* Search button */}
//       <TouchableOpacity
//         style={[styles.starBtn, { backgroundColor: theme.primary || '#FB923C' }]}
//         onPress={() => {
//   const url = `http://13.203.232.239:3000/api/gameValidation/${item.gameId}`;
//   Linking.openURL(url);
// }}
//         activeOpacity={0.75}
//       >
//         <Icon name="search" size={rf(18)} color="#fff" />
//       </TouchableOpacity>
//     </View>
//   );
// };

// // ── Shared fetch hook ───────────────────────────────────────────────────────
// const useGameHistory = (endpoint = '/api/history/feed') => {
//   const [loading, setLoading] = useState(true);
//   const [history, setHistory] = useState([]);
//   const [error, setError]     = useState(null);

//   const fetchHistory = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = await AsyncStorage.getItem('accessToken');
//       if (!token) {
//         setHistory([]);
//         setLoading(false);
//         return;
//       }

//       const response = await fetch(
//         `${BASE_URL}${endpoint}?limit=50&skip=0`,
//         {
//           method: 'GET',
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       const contentType = response.headers.get('content-type');
//       if (!contentType || !contentType.includes('application/json')) {
//         throw new Error('Unexpected response format from server');
//       }

//       const data = await response.json();

//       if (data.success && Array.isArray(data.games)) {
//         setHistory(data.games);
//       } else {
//         setHistory([]);
//       }
//     } catch (err) {
//       console.error('Failed to fetch game history:', err);
//       setError(err.message ?? 'Failed to load history');
//       setHistory([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [endpoint]);

//   useEffect(() => { fetchHistory(); }, [fetchHistory]);

//   return { loading, history, error, refetch: fetchHistory };
// };

// // ── Legend ──────────────────────────────────────────────────────────────────
// const Legend = ({ theme, t }) => (
//   <View style={styles.legendRow}>
//     {Object.entries(RESULT_CONFIG)
//       .filter(([key]) => key !== 'unknown')
//       .map(([key, cfg]) => (
//         <View key={key} style={styles.legendItem}>
//           <View style={[styles.legendDot, { backgroundColor: cfg.bg }]} />
//           <Text style={[styles.legendText, { color: theme.textSecondary || '#94a3b8' }]}>
//             {t(cfg.labelKey)}
//           </Text>
//         </View>
//       ))}
//   </View>
// );

// // ── History list content ────────────────────────────────────────────────────
// const HistoryList = ({ loading, history, error, theme, t, bottomPad = 20 }) => {
//   if (loading) {
//     return (
//       <ActivityIndicator
//         size="large"
//         color={theme.primary || '#FB923C'}
//         style={{ marginTop: 40 }}
//       />
//     );
//   }
//   if (error) {
//     return (
//       <View style={styles.emptyState}>
//         <Text style={{ fontSize: rf(28), marginBottom: rf(12) }}>⚠️</Text>
//         <Text style={[styles.emptyText, { color: theme.textSecondary || '#94a3b8' }]}>{error}</Text>
//       </View>
//     );
//   }
//   if (history.length === 0) {
//     return (
//       <View style={styles.emptyState}>
//         <Text style={{ fontSize: rf(36), marginBottom: rf(12) }}>♟</Text>
//         <Text style={[styles.emptyText, { color: theme.textSecondary || '#94a3b8' }]}>
//           {t('No games found')}
//         </Text>
//       </View>
//     );
//   }
//   return (
//     <View style={[styles.historyCard, {
//       backgroundColor: theme.cardBackground || 'rgba(255,255,255,0.05)',
//       borderTopColor: theme.border || 'rgba(255,255,255,0.1)',
//       borderBottomColor: theme.border || 'rgba(255,255,255,0.1)',
//     }]}>
//       {history.map((item, index) => (
//         <HistoryRow
//           key={item.gameId ?? String(index)}
//           item={item}
//           theme={theme}
//           t={t}
//           isLast={index === history.length - 1}
//         />
//       ))}
//     </View>
//   );
// };

// // ── Embeddable table-only export for Home ───────────────────────────────────
// export const HistoryTable = () => {
//   const { theme } = useTheme();
//   const { t }     = useAppTranslation();
//   const { loading, history, error } = useGameHistory('/api/history/feed');

//   return (
//     <View style={{ width: '100%', flex: 1 }}>
//       <Legend theme={theme} t={t} />
//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
//         <HistoryList loading={loading} history={history} error={error} theme={theme} t={t} />
//       </ScrollView>
//     </View>
//   );
// };

// // ── Full standalone screen ──────────────────────────────────────────────────
// const GameHistoryScreen = () => {
//   const navigation = useNavigation();
//   const insets     = useSafeAreaInsets();
//   const { theme }  = useTheme();
//   const { t }      = useAppTranslation();
//   const { earnedBadges, setEarnedBadges, showBadges } = useBadge();

//   const { loading, history, error } = useGameHistory('/api/history/feed');

//   // Page-visited badge
//   useEffect(() => {
//     const triggerPageVisitBadge = async () => {
//       try {
//         const token = await AsyncStorage.getItem('accessToken');
//         if (!token) return;
//         const response = await fetch(`${BASE_URL}/api/badges/page-visit`, {
//           method: 'POST',
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const contentType = response.headers.get('content-type');
//         if (!contentType || !contentType.includes('application/json')) return;
//         const data = await response.json();
//         if (data.success && data.newlyEarned?.length > 0) showBadges(data.newlyEarned);
//       } catch (err) {
//         console.error('Failed to trigger page-visited badge:', err);
//       }
//     };
//     triggerPageVisitBadge();
//   }, []);

//   const Content = () => (
//     <View style={{ flex: 1, paddingTop: insets.top + 30 }}>
//       <CustomHeader title={t('Game History')} onBack={() => navigation.goBack()} />
//       <Legend theme={theme} t={t} />
//       <ScrollView
//         contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 20 }}
//         showsVerticalScrollIndicator={false}
//       >
//         <HistoryList
//           loading={loading}
//           history={history}
//           error={error}
//           theme={theme}
//           t={t}
//           bottomPad={insets.bottom + 20}
//         />
//       </ScrollView>
//     </View>
//   );

//   return theme.backgroundGradient ? (
//     <LinearGradient colors={theme.backgroundGradient} style={{ flex: 1 }}>
//       <Content />
//       {earnedBadges.length > 0 && (
//         <BadgePopup badges={earnedBadges} onFinish={() => setEarnedBadges([])} />
//       )}
//     </LinearGradient>
//   ) : (
//     <View style={{ flex: 1, backgroundColor: '#0F172A' }}>
//       <Content />
//       {earnedBadges.length > 0 && (
//         <BadgePopup badges={earnedBadges} onFinish={() => setEarnedBadges([])} />
//       )}
//     </View>
//   );
// };

// export default GameHistoryScreen;

// // ── Styles ──────────────────────────────────────────────────────────────────
// const styles = StyleSheet.create({
//   legendRow: {
//     flexDirection: 'row',
//     marginHorizontal: width * 0.05,
//     marginBottom: rf(8),
//     marginTop: rf(6),
//     gap: rf(14),
//   },
//   legendItem:  { flexDirection: 'row', alignItems: 'center', gap: rf(5) },
//   legendDot:   { width: rf(8), height: rf(8), borderRadius: rf(4) },
//   legendText:  { fontSize: rf(11), fontWeight: '500' },

//   historyCard: { width: '100%', borderTopWidth: 1, borderBottomWidth: 1 },

//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: rf(10),
//     paddingHorizontal: rf(12),
//     gap: rf(8),
//   },
//   rowBorder: { borderBottomWidth: 1 },

//   timerIcon: { width: rf(22), alignItems: 'center' },

//   rowAvatar: {
//     width: rf(38),
//     height: rf(38),
//     borderRadius: rf(8),
//     borderWidth: 1.5,
//     alignItems: 'center',
//     justifyContent: 'center',
//     overflow: 'hidden',
//   },

//   rowInfo: { flex: 1, flexDirection: 'column', justifyContent: 'center', gap: rf(2) },
//   rowName:  { fontSize: rf(13), fontWeight: '600' },
//   rowScore: { fontSize: rf(11), fontWeight: '400' },

//   ratingBlock: { alignItems: 'flex-end', justifyContent: 'center', minWidth: rf(44) },
//   ratingAfter: { fontSize: rf(13), fontWeight: '700', lineHeight: rf(17) },
//   ratingBefore: {
//     fontSize: rf(11),
//     fontWeight: '400',
//     lineHeight: rf(15),
//   },

//   resultBadge: {
//     width: rf(26),
//     height: rf(26),
//     borderRadius: rf(5),
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   starBtn: {
//     width: rf(30),
//     height: rf(30),
//     borderRadius: rf(6),
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: rf(60) },
//   emptyText:  { fontSize: rf(14), textAlign: 'center' },
// });


import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  PixelRatio,
  ScrollView,
  Image,
  ActivityIndicator,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useAppTranslation } from '../context/TranslationContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../components/CustomHeader';
import BadgePopup from './BadgePopup';
import { useBadge } from '../context/BadgeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { authFetch as fetch } from '../utils/authFetch'; // auto-refresh wrapper for expired access tokens

const { width } = Dimensions.get('window');
const scale = width / 390;
const rf = (size) => Math.round(PixelRatio.roundToNearestPixel(size * scale));

const BASE_URL = 'http://13.203.232.239:3000';

const RESULT_CONFIG = {
  win:     { icon: 'add',          bg: '#16a34a', text: '#fff', labelKey: 'Win'  },
  loss:    { icon: 'remove',       bg: '#dc2626', text: '#fff', labelKey: 'Loss' },
  draw:    { icon: 'reorder-two',  bg: '#6b7280', text: '#fff', labelKey: 'Draw' },
  unknown: { icon: 'reorder-two',  bg: '#6b7280', text: '#fff', labelKey: 'Draw' },
};

const AVATAR_COLORS = ['#FB923C', '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];
const getAvatarColor = (name) =>
  AVATAR_COLORS[(name?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];

const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(/[\s_]+/);
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
};

// ── Avatar with initials fallback ───────────────────────────────────────────
const AvatarWithInitials = ({ uri, name }) => {
  const [imgError, setImgError] = useState(false);
  const size = rf(38);

  if (uri && !imgError) {
    return (
      <Image
        source={{ uri }}
        style={{ width: size, height: size }}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <View style={{
      width: size,
      height: size,
      backgroundColor: getAvatarColor(name),
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Text style={{ fontSize: rf(13), fontWeight: '700', color: '#fff' }}>
        {getInitials(name)}
      </Text>
    </View>
  );
};

// ── Single history row ──────────────────────────────────────────────────────
const HistoryRow = ({ item, theme, isLast, t, userId }) => {
  const outcomeKey = item.outcome ?? 'unknown';
  const cfg = RESULT_CONFIG[outcomeKey] ?? RESULT_CONFIG.unknown;

  const getOpponentName = () => {
    if (item.gameMode === 'computer') return item.computer?.name ?? t('Computer');
    if (item.gameMode === 'practice') return t('Practice');
    return item.opponent?.username ?? t('Unknown');
  };

  const getOpponentAvatar = () => {
    if (item.gameMode === 'pvp' || item.gameMode === 'friend') {
      return item.opponent?.profileImage ?? null;
    }
    return null;
  };

  const opponentName   = getOpponentName();
  const opponentAvatar = getOpponentAvatar();

  const ratingBefore = item.myRatingAtMatch ?? null;
  const ratingAfter  =
    ratingBefore != null && item.ratingChange != null
      ? ratingBefore + item.ratingChange
      : null;

  const subLabel = (() => {
    if (item.gameMode === 'computer' && item.computer?.label) return item.computer.label;
    if (item.gameMode === 'practice') return null;
    return null;
  })();

  const handleSearchPress = () => {
    if (!userId) {
      console.warn('userId not available yet');
      return;
    }
    const url = `${BASE_URL}/api/gameValidation/${userId}`;
    Linking.openURL(url);
  };

  return (
    <View style={[
      styles.row,
      { borderBottomColor: theme.border || 'rgba(255,255,255,0.08)' },
      !isLast && styles.rowBorder,
    ]}>

      {/* Game type label (E2, M4, …) */}
      <View style={styles.timerIcon}>
        <Text style={{ fontSize: rf(12), fontWeight: '600', color: theme.textSecondary || '#94a3b8' }}>
          {item.gameType ? t(item.gameType) : '—'}
        </Text>
      </View>

      {/* Avatar */}
      <View style={[styles.rowAvatar, {
        backgroundColor: theme.surface || 'rgba(255,255,255,0.1)',
        borderColor: theme.primary || '#FB923C',
      }]}>
        <AvatarWithInitials uri={opponentAvatar} name={opponentName} />
      </View>

      {/* Name + sublabel */}
      <View style={styles.rowInfo}>
        <Text style={[styles.rowName, { color: theme.text || '#ffffff' }]} numberOfLines={1}>
          {opponentName}
        </Text>
        {subLabel ? (
          <Text style={[styles.rowScore, { color: theme.textSecondary || '#94a3b8' }]}>
            {subLabel}
          </Text>
        ) : null}
      </View>

      {/* Rating block */}
      <View style={styles.ratingBlock}>
        {item.gameMode === 'practice' ? (
          <Text style={[styles.ratingAfter, { color: theme.primary || '#FB923C', fontSize: rf(11) }]}>
            {t('Practice')}
          </Text>
        ) : item.gameMode === 'computer' ? (
          <>
            <Text style={[styles.ratingAfter, { color: theme.primary || '#FB923C' }]}>
              {item.computer?.label ?? t('CPU')}
            </Text>
            <Text style={[styles.ratingBefore, {
              color: theme.textSecondary || '#94a3b8',
              textDecorationLine: 'none',
              fontSize: rf(10),
            }]}>
              {item.computer?.name ?? ''}
            </Text>
          </>
        ) : ratingAfter != null ? (
          <>
            <Text style={[styles.ratingBefore, { color: theme.text || '#ffffff' }]}>
              {ratingBefore}
            </Text>
          </>
        ) : (
          <Text style={[styles.ratingAfter, { color: theme.textSecondary || '#94a3b8' }]}>—</Text>
        )}
      </View>

      {/* Result badge */}
      <View style={[styles.resultBadge, { backgroundColor: cfg.bg }]}>
        <Icon name={cfg.icon} size={rf(14)} color={cfg.text} />
      </View>

      {/* Search button */}
      <TouchableOpacity
        style={[styles.starBtn, { backgroundColor: theme.primary || '#FB923C' }]}
        onPress={handleSearchPress}
        activeOpacity={0.75}
      >
        <Icon name="search" size={rf(18)} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

// ── Shared fetch hook ───────────────────────────────────────────────────────
const useGameHistory = (endpoint = '/api/history/feed') => {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [error, setError]     = useState(null);
  const [userId, setUserId]   = useState(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        setHistory([]);
        setLoading(false);
        return;
      }

      // Load userId from AsyncStorage (same pattern as ProfileScreen)
      let uid = null;
      try {
        const userDataRaw = await AsyncStorage.getItem('userData');
        if (userDataRaw) {
          uid = JSON.parse(userDataRaw)?._id ?? null;
        }
      } catch {}

      if (!uid) {
        try {
          const fullRaw = await AsyncStorage.getItem('fullLoginResponse');
          if (fullRaw) {
            const full = JSON.parse(fullRaw);
            uid = full?.user?._id ?? full?.player?._id ?? null;
          }
        } catch {}
      }

      setUserId(uid);

      const response = await fetch(
        `${BASE_URL}${endpoint}?limit=50&skip=0`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Unexpected response format from server');
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.games)) {
        setHistory(data.games);
      } else {
        setHistory([]);
      }
    } catch (err) {
      console.error('Failed to fetch game history:', err);
      setError(err.message ?? 'Failed to load history');
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  return { loading, history, error, userId, refetch: fetchHistory };
};

// ── Legend ──────────────────────────────────────────────────────────────────
const Legend = ({ theme, t }) => (
  <View style={styles.legendRow}>
    {Object.entries(RESULT_CONFIG)
      .filter(([key]) => key !== 'unknown')
      .map(([key, cfg]) => (
        <View key={key} style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: cfg.bg }]} />
          <Text style={[styles.legendText, { color: theme.textSecondary || '#94a3b8' }]}>
            {t(cfg.labelKey)}
          </Text>
        </View>
      ))}
  </View>
);

// ── History list content ────────────────────────────────────────────────────
const HistoryList = ({ loading, history, error, theme, t, userId, bottomPad = 20 }) => {
  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color={theme.primary || '#FB923C'}
        style={{ marginTop: 40 }}
      />
    );
  }
  if (error) {
    return (
      <View style={styles.emptyState}>
        <Text style={{ fontSize: rf(28), marginBottom: rf(12) }}>⚠️</Text>
        <Text style={[styles.emptyText, { color: theme.textSecondary || '#94a3b8' }]}>{error}</Text>
      </View>
    );
  }
  if (history.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={{ fontSize: rf(36), marginBottom: rf(12) }}>♟</Text>
        <Text style={[styles.emptyText, { color: theme.textSecondary || '#94a3b8' }]}>
          {t('No games found')}
        </Text>
      </View>
    );
  }
  return (
    <View style={[styles.historyCard, {
      backgroundColor: theme.cardBackground || 'rgba(255,255,255,0.05)',
      borderTopColor: theme.border || 'rgba(255,255,255,0.1)',
      borderBottomColor: theme.border || 'rgba(255,255,255,0.1)',
    }]}>
      {history.map((item, index) => (
        <HistoryRow
          key={item.gameId ?? String(index)}
          item={item}
          theme={theme}
          t={t}
          userId={userId}
          isLast={index === history.length - 1}
        />
      ))}
    </View>
  );
};

// ── Embeddable table-only export for Home ───────────────────────────────────
export const HistoryTable = () => {
  const { theme } = useTheme();
  const { t }     = useAppTranslation();
  const { loading, history, error, userId } = useGameHistory('/api/history/feed');

  return (
    <View style={{ width: '100%', flex: 1 }}>
      <Legend theme={theme} t={t} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        <HistoryList loading={loading} history={history} error={error} theme={theme} t={t} userId={userId} />
      </ScrollView>
    </View>
  );
};

// ── Full standalone screen ──────────────────────────────────────────────────
const GameHistoryScreen = () => {
  const navigation = useNavigation();
  const insets     = useSafeAreaInsets();
  const { theme }  = useTheme();
  const { t }      = useAppTranslation();
  const { earnedBadges, setEarnedBadges, showBadges } = useBadge();

  const { loading, history, error, userId } = useGameHistory('/api/history/feed');

  // Page-visited badge
  useEffect(() => {
    const triggerPageVisitBadge = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) return;
        const response = await fetch(`${BASE_URL}/api/badges/page-visit`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) return;
        const data = await response.json();
        if (data.success && data.newlyEarned?.length > 0) showBadges(data.newlyEarned);
      } catch (err) {
        console.error('Failed to trigger page-visited badge:', err);
      }
    };
    triggerPageVisitBadge();
  }, []);

  const Content = () => (
    <View style={{ flex: 1, paddingTop: insets.top + 30 }}>
      <CustomHeader title={t('Game History')} onBack={() => navigation.goBack()} />
      <Legend theme={theme} t={t} />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <HistoryList
          loading={loading}
          history={history}
          error={error}
          theme={theme}
          t={t}
          userId={userId}
          bottomPad={insets.bottom + 20}
        />
      </ScrollView>
    </View>
  );

  return theme.backgroundGradient ? (
    <LinearGradient colors={theme.backgroundGradient} style={{ flex: 1 }}>
      <Content />
      {earnedBadges.length > 0 && (
        <BadgePopup badges={earnedBadges} onFinish={() => setEarnedBadges([])} />
      )}
    </LinearGradient>
  ) : (
    <View style={{ flex: 1, backgroundColor: '#0F172A' }}>
      <Content />
      {earnedBadges.length > 0 && (
        <BadgePopup badges={earnedBadges} onFinish={() => setEarnedBadges([])} />
      )}
    </View>
  );
};

export default GameHistoryScreen;

// ── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  legendRow: {
    flexDirection: 'row',
    marginHorizontal: width * 0.05,
    marginBottom: rf(8),
    marginTop: rf(6),
    gap: rf(14),
  },
  legendItem:  { flexDirection: 'row', alignItems: 'center', gap: rf(5) },
  legendDot:   { width: rf(8), height: rf(8), borderRadius: rf(4) },
  legendText:  { fontSize: rf(11), fontWeight: '500' },

  historyCard: { width: '100%', borderTopWidth: 1, borderBottomWidth: 1 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: rf(10),
    paddingHorizontal: rf(12),
    gap: rf(8),
  },
  rowBorder: { borderBottomWidth: 1 },

  timerIcon: { width: rf(22), alignItems: 'center' },

  rowAvatar: {
    width: rf(38),
    height: rf(38),
    borderRadius: rf(8),
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  rowInfo: { flex: 1, flexDirection: 'column', justifyContent: 'center', gap: rf(2) },
  rowName:  { fontSize: rf(13), fontWeight: '600' },
  rowScore: { fontSize: rf(11), fontWeight: '400' },

  ratingBlock: { alignItems: 'flex-end', justifyContent: 'center', minWidth: rf(44) },
  ratingAfter: { fontSize: rf(13), fontWeight: '700', lineHeight: rf(17) },
  ratingBefore: {
    fontSize: rf(11),
    fontWeight: '400',
    lineHeight: rf(15),
  },

  resultBadge: {
    width: rf(26),
    height: rf(26),
    borderRadius: rf(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  starBtn: {
    width: rf(30),
    height: rf(30),
    borderRadius: rf(6),
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: rf(60) },
  emptyText:  { fontSize: rf(14), textAlign: 'center' },
});