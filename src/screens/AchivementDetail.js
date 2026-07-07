import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

const AchievementDetailPopup = ({ visible, badge, onClose }) => {
  const { theme } = useTheme();

  if (!badge) return null;

  const isEarned = badge.isEarned ?? false;
  const earnedDate = badge.earnedAt
    ? new Date(badge.earnedAt).toLocaleDateString()
    : null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.popup, { backgroundColor: theme.backgroundColor || '#1e293b' }]}>

          {/* Close Button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          {/* Icon */}
          <View style={styles.iconContainer}>
            {badge.iconUrl ? (
              <SvgUri uri={badge.iconUrl} width={70} height={70} />
            ) : (
              <Text style={styles.placeholderIcon}>🏅</Text>
            )}
          </View>

          {/* Title */}
          <Text style={styles.title}>{badge.title}</Text>

          {/* Description */}
          <Text style={styles.desc}>
            {isEarned
              ? badge.description
              : badge.unearnedDescription || badge.description || 'No description available'}
          </Text>

          {/* Progress */}
          {!isEarned && badge.targetCount && (
            <View style={styles.progressSection}>
              <Text style={styles.progressLabel}>
                {badge.currentCount || 0}/{badge.targetCount}
              </Text>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${((badge.currentCount || 0) / badge.targetCount) * 100}%`,
                    },
                  ]}
                />
              </View>
            </View>
          )}

          {/* Status */}
          <Text style={[styles.status, isEarned && styles.statusEarned]}>
            {isEarned ? '✅ Earned' : '🔒 Locked'}
          </Text>

          {earnedDate && (
            <Text style={styles.date}>Earned on {earnedDate}</Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default AchievementDetailPopup;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  popup: {
    width: '85%',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },

  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
  },

  closeText: {
    fontSize: 18,
    color: '#fff',
  },

  iconContainer: {
    marginBottom: 15,
  },

  placeholderIcon: {
    fontSize: 60,
  },

  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },

  desc: {
    color: '#cbd5f5',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 15,
  },

  progressSection: {
    width: '100%',
    marginBottom: 15,
  },

  progressLabel: {
    color: '#4e54c8',
    textAlign: 'center',
    marginBottom: 5,
  },

  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#4e54c8',
  },

  status: {
    fontSize: 16,
    color: '#94a3b8',
    fontWeight: '600',
  },

  statusEarned: {
    color: '#22c55e',
  },

  date: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 5,
  },
});
