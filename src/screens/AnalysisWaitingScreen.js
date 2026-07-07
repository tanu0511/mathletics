import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  PixelRatio,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useAppTranslation } from '../context/TranslationContext';
import CustomHeader from '../components/CustomHeader';

const { width, height } = Dimensions.get('window');
const fontScale = PixelRatio.getFontScale();
const scaleFont = size => size / fontScale;

const AnalysisWaitingScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useAppTranslation();

  const background = theme.backgroundGradient || [theme.backgroundColor || '#0F172A', theme.backgroundColor || '#0F172A'];
  const textColor = theme.textColor || '#ffffff';
  const cardBg = theme.cardBackground || 'rgba(255,255,255,0.08)';
  const borderColor = theme.borderColor || 'rgba(255,255,255,0.16)';

  return (
    <View style={[styles.screen, { paddingTop: insets.top, backgroundColor: background[0] }]}> 
      <CustomHeader title={t('PVP ANALYSIS')} onBack={() => navigation.goBack()} />

      <View style={styles.contentArea}>
        <View style={[styles.badge, { backgroundColor: '#FFD23F', borderColor: borderColor }]}> 
          <Text style={styles.badgeText}>5</Text>
        </View>

        <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}> 
          <Text style={[styles.title, { color: textColor }]}>{t('Please wait while we are analyzing your game')}</Text>
          <Text style={[styles.subtitle, { color: textColor }]}>{t('We are ready..')}</Text>
          <Text style={[styles.subtitle, { color: textColor }]}>{t('Lets Start')}</Text>
        </View>

        <View style={[styles.adSection, { backgroundColor: '#FDE68A', borderColor: theme.borderColor || '#e2d7a1' }]}> 
          <Text style={styles.adText}>{t('ADS SECTION 7')}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  contentArea: {
    flex: 1,
    paddingHorizontal: width * 0.06,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  badge: {
    alignSelf: 'center',
    width: 42,
    height: 42,
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  badgeText: {
    fontSize: scaleFont(16),
    fontWeight: '700',
    color: '#1F2937',
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 22,
    minHeight: height * 0.32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },
  title: {
    fontSize: scaleFont(20),
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 28,
  },
  subtitle: {
    fontSize: scaleFont(16),
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 24,
  },
  adSection: {
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 24,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  adText: {
    fontSize: scaleFont(17),
    fontWeight: '800',
    color: '#0F172A',
  },
});

export default AnalysisWaitingScreen;
