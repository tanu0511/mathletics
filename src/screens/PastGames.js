import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  PixelRatio,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppTranslation } from '../context/TranslationContext';

const { width, height } = Dimensions.get('window');
const scaleFont = size => size * PixelRatio.getFontScale();

// ─── Table Header ────────────────────────────────────────────────────────────
const TableHeader = ({ t }) => (
  <View style={styles.headerRow}>
    <Text style={[styles.headerCell, styles.colIndex]}>#</Text>
    <Text style={[styles.headerCell, styles.colName]}>{t('Name')}</Text>
    <Text style={[styles.headerCell, styles.colDetail]}>{t('Game Detail')}</Text>
    <Text style={[styles.headerCell, styles.colResult]}>{t('Result')}</Text>
  </View>
);

// ─── Table Row ────────────────────────────────────────────────────────────────
const TableRow = ({ item, index, isEven }) => {
  const isWin = item.result === 'Win';
  return (
    <View style={[styles.tableRow, isEven && styles.tableRowEven]}>
      {/* # */}
      <Text style={[styles.cell, styles.colIndex, styles.cellMuted]}>
        {index + 1}
      </Text>

      {/* Name */}
      <Text style={[styles.cell, styles.colName]} numberOfLines={1}>
        {item.name ?? item.mode}
      </Text>

      {/* Game Detail */}
      <View style={[styles.colDetail, styles.detailCell]}>
        <Text style={styles.detailMode}>{item.mode}</Text>
        <Text style={styles.detailDate}>{item.date}</Text>
      </View>

      {/* Result */}
      <View style={[styles.colResult, { alignItems: 'center' }]}>
        <View style={[
          styles.resultBadge,
          { backgroundColor: isWin ? '#064E3B' : '#450A0A' },
        ]}>
          <Text style={[
            styles.resultText,
            { color: isWin ? '#10B981' : '#EF4444' },
          ]}>
            {item.result}
          </Text>
        </View>
      </View>
    </View>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const PastGames = ({ games = [] }) => {
  const { t } = useAppTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t('Past Games')}</Text>

      <View style={styles.table}>
        <TableHeader t={t} />

        {games.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="gamepad-off" size={36} color="#334155" />
            <Text style={styles.emptyText}>{t('No games played yet')}</Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
            style={styles.scroll}>
            {games.map((item, index) => (
              <TableRow
                key={`${item.id}-${item.date}-${index}`}
                item={item}
                index={index}
                isEven={index % 2 === 0}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default PastGames;

const styles = StyleSheet.create({
  container: {
    marginTop:         height * 0.025,
    paddingHorizontal: width * 0.00,
  },

  sectionTitle: {
    color:          '#94A3B8',
    fontSize:       scaleFont(13),
    fontWeight:     '600',
    letterSpacing:  0.8,
    marginBottom:   10,
    textTransform:  'uppercase',
  },

  // ── Table shell ──────────────────────────────────────────────────────────
  table: {
    borderRadius: 12,
    overflow:     'hidden',
    borderWidth:  1,
    borderColor:  'rgba(255,255,255,0.08)',
  },

  scroll: {
    maxHeight: height * 0.35,
  },

  // ── Header ───────────────────────────────────────────────────────────────
  headerRow: {
    flexDirection:     'row',
    alignItems:        'center',
    backgroundColor:   '#1E293B',
    paddingVertical:   10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },

  headerCell: {
    color:          '#64748B',
    fontSize:       scaleFont(12),
    fontWeight:     '700',
    textTransform:  'uppercase',
    letterSpacing:  0.5,
  },

  // ── Rows ─────────────────────────────────────────────────────────────────
  tableRow: {
    flexDirection:     'row',
    alignItems:        'center',
    paddingVertical:   12,
    paddingHorizontal: 12,
    backgroundColor:   'rgba(255,255,255,0.02)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },

  tableRowEven: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },

  cell: {
    color:      '#E2E8F0',
    fontSize:   scaleFont(13),
    fontWeight: '500',
  },

  cellMuted: {
    color: '#475569',
  },

  // ── Column widths ─────────────────────────────────────────────────────────
  colIndex:  { width: width * 0.07 },
  colName:   { flex: 1 },
  colDetail: { width: width * 0.28 },
  colResult: { width: width * 0.18 },

  // ── Detail cell ───────────────────────────────────────────────────────────
  detailCell: {
    justifyContent: 'center',
  },

  detailMode: {
    color:      '#CBD5E1',
    fontSize:   scaleFont(12),
    fontWeight: '600',
  },

  detailDate: {
    color:     '#475569',
    fontSize:  scaleFont(11),
    marginTop: 2,
  },

  // ── Result badge ──────────────────────────────────────────────────────────
  resultBadge: {
    paddingHorizontal: 8,
    paddingVertical:   3,
    borderRadius:      20,
  },

  resultText: {
    fontSize:   scaleFont(12),
    fontWeight: '700',
  },

  // ── Empty state ───────────────────────────────────────────────────────────
  emptyState: {
    alignItems:      'center',
    justifyContent:  'center',
    paddingVertical: height * 0.04,
    gap:             8,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },

  emptyText: {
    color:    '#334155',
    fontSize: scaleFont(13),
  },
});