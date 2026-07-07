import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
} from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const AchivementDetailPopup = ({ visible, badge, onClose }) => {
  const { theme } = useTheme();

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 8,
          speed: 14,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!badge) return null;

  const isEarned = badge.isEarned ?? false;
  const earnedDate = badge.earnedAt
    ? new Date(badge.earnedAt).toLocaleDateString()
    : null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={[
            styles.backdrop,
            { opacity: backdropAnim },
          ]}
        />
      </TouchableWithoutFeedback>

      {/* Popup Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          {
            backgroundColor: theme.cardBackground || '#1E293B',
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Drag Handle */}
        <View style={styles.dragHandle} />

        {/* Close Button */}
        <TouchableOpacity style={styles.closeBtn} onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>

        {/* Icon */}
        <View style={styles.iconContainer}>
          {badge.iconUrl ? (
            <SvgUri uri={badge.iconUrl} width={120} height={120} />
          ) : (
            <Text style={styles.placeholderIcon}>🏅</Text>
          )}
        </View>

        {/* Status Badge */}
        <View style={[styles.statusBadge, isEarned ? styles.statusBadgeEarned : styles.statusBadgeLocked]}>
          <Text style={[styles.statusBadgeText, isEarned ? styles.statusBadgeTextEarned : styles.statusBadgeTextLocked]}>
            {isEarned ? '✅ Earned' : '🔒 Locked'}
          </Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>{badge.title}</Text>

        {/* Description */}
        <Text style={styles.desc}>
          {isEarned
            ? badge.description
            : badge.unearnedDescription || badge.description || 'No description available'}
        </Text>

        {/* Progress for unearned badges */}
        {!isEarned && badge.targetCount && (
          <View style={styles.progressSection}>
            <View style={styles.progressLabelRow}>
              <Text style={styles.progressLabel}>Progress</Text>
              <Text style={styles.progressCount}>
                {badge.currentCount || 0}/{badge.targetCount}
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(
                      ((badge.currentCount || 0) / badge.targetCount) * 100,
                      100
                    )}%`,
                  },
                ]}
              />
            </View>
          </View>
        )}

        {/* Earned Date */}
        {earnedDate && (
          <Text style={styles.earnedDate}>Earned on {earnedDate}</Text>
        )}

        {/* Close Button at bottom */}
        <TouchableOpacity style={styles.dismissBtn} onPress={onClose} activeOpacity={0.8}>
          <Text style={styles.dismissBtnText}>Dismiss</Text>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
};

export default AchivementDetailPopup;

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingBottom: 36,
    paddingTop: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 20,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    marginBottom: 16,
  },
  closeBtn: {
    position: 'absolute',
    top: 18,
    right: 20,
  },
  closeBtnText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
  iconContainer: {
    marginTop: 8,
    marginBottom: 16,
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(78,84,200,0.1)',
    borderRadius: 70,
  },
  placeholderIcon: {
    fontSize: 80,
  },
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 14,
  },
  statusBadgeEarned: {
    backgroundColor: 'rgba(34,197,94,0.15)',
  },
  statusBadgeLocked: {
    backgroundColor: 'rgba(100,116,139,0.15)',
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statusBadgeTextEarned: {
    color: '#22c55e',
  },
  statusBadgeTextLocked: {
    color: '#64748b',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  desc: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  progressSection: {
    width: '100%',
    marginBottom: 16,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '500',
  },
  progressCount: {
    color: '#4e54c8',
    fontSize: 13,
    fontWeight: '700',
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4e54c8',
    borderRadius: 3,
  },
  earnedDate: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 24,
  },
  dismissBtn: {
    marginTop: 8,
    width: '100%',
    paddingVertical: 14,
    backgroundColor: '#4e54c8',
    borderRadius: 14,
    alignItems: 'center',
  },
  dismissBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});