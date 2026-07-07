import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SvgUri } from 'react-native-svg';
import CustomHeader from '../components/CustomHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

const AchievementDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { badge } = route.params;

  const isEarned = badge.isEarned ?? false;
  const earnedDate = badge.earnedAt ? new Date(badge.earnedAt).toLocaleDateString() : null;

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor || '#0F172A' }]}>
      <View style={{ flex: 1, paddingTop: insets.top + 10 }}>
        <CustomHeader title="Achievement" onBack={() => navigation.goBack()} />

        <View style={styles.content}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            {badge.iconUrl ? (
              <SvgUri
                uri={badge.iconUrl}
                width={100}
                height={100}
              />
            ) : (
              <Text style={styles.placeholderIcon}>🏅</Text>
            )}
          </View>

          {/* Title */}
          <Text style={styles.title}>{badge.title}</Text>

          {/* Description */}
          <Text style={styles.desc}>
            {isEarned ? badge.description : badge.unearnedDescription || badge.description || 'No description available'}
          </Text>

          {/* Progress for unearned badges with targets */}
          {!isEarned && badge.targetCount && (
            <View style={styles.progressSection}>
              <Text style={styles.progressLabel}>
                Progress: {badge.currentCount || 0}/{badge.targetCount}
              </Text>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${((badge.currentCount || 0) / badge.targetCount) * 100}%` },
                  ]}
                />
              </View>
            </View>
          )}

          {/* Status */}
          <View style={styles.statusSection}>
            <Text style={[styles.status, isEarned && styles.statusEarned]}>
              {isEarned ? '✅ Earned' : '🔒 Locked'}
            </Text>
            {earnedDate && (
              <Text style={styles.earnedDate}>Earned on {earnedDate}</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default AchievementDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginBottom: 30,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 80,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center',
  },
  desc: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 20,
  },
  progressSection: {
    width: '100%',
    marginBottom: 20,
  },
  progressLabel: {
    color: '#4e54c8',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4e54c8',
    borderRadius: 3,
  },
  statusSection: {
    alignItems: 'center',
    marginTop: 30,
  },
  status: {
    fontSize: 18,
    color: '#64748b',
    fontWeight: '600',
  },
  statusEarned: {
    color: '#22c55e',
  },
  earnedDate: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 8,
  },
});