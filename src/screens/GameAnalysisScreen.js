import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  PixelRatio,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useAppTranslation } from '../context/TranslationContext';
import CustomHeader from '../components/CustomHeader';

const { width, height } = Dimensions.get('window');
const fontScale = PixelRatio.getFontScale();
const scaleFont = size => size / fontScale;

const GameAnalysisScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useAppTranslation();
  const route = useRoute();

  const params = route.params || {};
  const analysisData = useMemo(() => [
    {
      label: t('Correct (Acc %)'),
      winner: params.winnerCorrect ?? params.yourCorrect ?? 9,
      loser: params.loserCorrect ?? params.playerCorrect ?? 10,
      diff: params.diffCorrect ?? (params.yourCorrect != null && params.playerCorrect != null ? params.yourCorrect - params.playerCorrect : -1),
      diffLabel: params.diffLabelCorrect ?? '-1 (In Red)',
    },
    {
      label: t('Incorrect'),
      winner: params.winnerIncorrect ?? params.yourIncorrect ?? 0,
      loser: params.loserIncorrect ?? params.playerIncorrect ?? 2,
      diff: params.diffIncorrect ?? (params.yourIncorrect != null && params.playerIncorrect != null ? params.yourIncorrect - params.playerIncorrect : -2),
      diffLabel: params.diffLabelIncorrect ?? '-2 (In Green)',
    },
    {
      label: t('Skipped'),
      winner: params.winnerSkipped ?? params.yourSkipped ?? 0,
      loser: params.loserSkipped ?? params.playerSkipped ?? 1,
      diff: params.diffSkipped ?? (params.yourSkipped != null && params.playerSkipped != null ? params.yourSkipped - params.playerSkipped : -1),
      diffLabel: params.diffLabelSkipped ?? '-1 (In Green)',
    },
    {
      label: t('Streak Bonus Points'),
      winner: params.winnerStreak ?? params.yourStreak ?? '+8',
      loser: params.loserStreak ?? params.playerStreak ?? 0,
      diff: params.diffStreak ?? (params.yourStreak != null && params.playerStreak != null ? params.yourStreak - params.playerStreak : '+8'),
      diffLabel: params.diffLabelStreak ?? '(+8) In Green',
    },
    {
      label: t('Time per Qs'),
      winner: params.winnerTimePerQs ?? params.yourTimePerQs ?? '1.2',
      loser: params.loserTimePerQs ?? params.playerTimePerQs ?? '1',
      diff: params.diffTimePerQs ?? (params.yourTimePerQs != null && params.playerTimePerQs != null ? params.yourTimePerQs - params.playerTimePerQs : -0.2),
      diffLabel: params.diffLabelTimePerQs ?? '-0.2 (In Red)',
    },
    {
      label: t('Vs (Lifetime)'),
      winner: params.winnerVsLifetime ?? params.yourVs ?? 4,
      loser: params.loserVsLifetime ?? params.playerVs ?? 2,
      diff: params.diffVsLifetime ?? (params.yourVs != null && params.playerVs != null ? params.yourVs - params.playerVs : 2),
      diffLabel: params.diffLabelVsLifetime ?? '+2 (In Green)',
    },
  ], [params, t]);

  const bgColor = theme.backgroundColor || '#0F172A';
  const cardBg = theme.cardBackground || 'rgba(255,255,255,0.06)';
  const textColor = theme.textColor || '#ffffff';
  const accent = theme.primary || '#4E54C8';
  const borderColor = theme.borderColor || 'rgba(255,255,255,0.18)';

  return (
    <View style={[styles.screen, { paddingTop: insets.top, backgroundColor: bgColor }]}> 
      <CustomHeader title={t('Analysis Summary')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.summaryCard, { backgroundColor: cardBg, borderColor }]}> 
          <Text style={[styles.heading, { color: textColor }]}>{t('Analysis Summary')}</Text>
          <Text style={[styles.subHeading, { color: textColor }]}> {t('Detailed comparison of player performance')} </Text>
        </View>

        <View style={[styles.table, { borderColor }]}> 
          <View style={[styles.tableRow, styles.tableHeader, { backgroundColor: accent }]}> 
            <Text style={[styles.cell, styles.headerCell, { color: '#fff' }]}>{t('Winner')}</Text>
            <Text style={[styles.cell, styles.headerCell, { color: '#fff' }]}>{t('Looser')}</Text>
            <Text style={[styles.cell, styles.headerCell, { color: '#fff' }]}>{t('Difference')}</Text>
          </View>

          {analysisData.map((row, index) => (
            <View
              key={`${row.label}-${index}`}
              style={[styles.tableRow, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}
            >
              <Text style={[styles.cell, { color: textColor }]}>{row.label}</Text>
              <Text style={[styles.cell, { color: textColor }]}>{row.winner}</Text>
              <Text style={[styles.cell, { color: textColor }]}>{row.diffLabel ?? row.diff}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: accent }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>{t('Back')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.04,
  },
  summaryCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    marginBottom: 18,
  },
  heading: {
    fontSize: scaleFont(22),
    fontWeight: '800',
    marginBottom: 8,
  },
  subHeading: {
    fontSize: scaleFont(14),
    lineHeight: 20,
    opacity: 0.8,
  },
  table: {
    borderWidth: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tableHeader: {
    minHeight: 46,
  },
  headerCell: {
    fontWeight: '700',
  },
  rowEven: {
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  rowOdd: {
    backgroundColor: 'transparent',
  },
  cell: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: scaleFont(13),
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.08)',
  },
  button: {
    marginTop: 22,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: scaleFont(15),
    fontWeight: '700',
  },
});

export default GameAnalysisScreen;
