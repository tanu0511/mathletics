import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  Dimensions,
  PixelRatio,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useChallenge } from '../context/ChallengeContext';
import { useAppTranslation } from '../context/TranslationContext';

const { width } = Dimensions.get('window');
const scaleFont = size => size * PixelRatio.getFontScale();

const ChallengePopup = () => {
  const { t } = useAppTranslation();
  const {
    showChallengePopup,
    challengeData,
    waitingForGame,
    popupAnimation,
    handleAcceptChallenge,
    handleDeclineChallenge,
    handleDismissPopup,
  } = useChallenge() || {};

  return (
    <>
      {challengeData && (
        <Modal visible={showChallengePopup} transparent animationType="fade" onRequestClose={handleDismissPopup}>
          <TouchableWithoutFeedback onPress={handleDismissPopup}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <Animated.View
                  style={[
                    styles.popupContainer,
                    {
                      transform: [{ scale: popupAnimation.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }],
                      opacity: popupAnimation.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
                    },
                  ]}>
                  <LinearGradient colors={['#1E293B', '#0F172A']} style={styles.popupGradient}>
                    <TouchableOpacity style={styles.closeButton} onPress={handleDismissPopup}>
                      <Ionicons name="close" size={24} color="#94A3B8" />
                    </TouchableOpacity>

                    <View style={styles.iconContainer}>
                      <LinearGradient colors={['#F59E0B', '#EF4444']} style={styles.iconGradient}>
                        <MaterialCommunityIcons name="sword-cross" size={40} color="#fff" />
                      </LinearGradient>
                    </View>

                    <Text style={styles.popupTitle}>⚔️ {t('Challenge Received!')}</Text>

                    <View style={styles.challengerInfo}>
                      <View style={styles.challengerAvatar}>
                        <Text style={styles.avatarText}>
                          {challengeData.challenger.username.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.challengerDetails}>
                        <Text style={styles.challengerName}>{challengeData.challenger.username}</Text>
                        <Text style={styles.challengerRating}>⭐ Rating: {challengeData.challenger.rating}</Text>
                      </View>
                    </View>

                    <View style={styles.settingsContainer}>
                      <View style={styles.settingItem}>
                        <MaterialCommunityIcons name="speedometer" size={20} color="#10B981" />
                        <Text style={styles.settingText}>{challengeData.settings.diff.toUpperCase()}</Text>
                      </View>
                      <View style={styles.settingItem}>
                        <MaterialCommunityIcons name="timer-outline" size={20} color="#3B82F6" />
                        <Text style={styles.settingText}>{challengeData.settings.timer}s</Text>
                      </View>
                    </View>

                    <Text style={styles.popupMessage}>{t('wants to challenge you to a match!')}</Text>

                    <View style={styles.actionButtons}>
                      <TouchableOpacity style={styles.declineButton} onPress={handleDeclineChallenge} activeOpacity={0.8}>
                        <MaterialCommunityIcons name="close-circle" size={22} color="#fff" />
                        <Text style={styles.declineButtonText}>{t('Decline')}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.acceptButton} onPress={handleAcceptChallenge} activeOpacity={0.8}>
                        <LinearGradient colors={['#10B981', '#059669']} style={styles.acceptButtonGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                          <MaterialCommunityIcons name="check-circle" size={22} color="#fff" />
                          <Text style={styles.acceptButtonText}>{t('Accept')}</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.expirationText}>⏱️ {t('Challenge expires in 60 seconds')}</Text>
                  </LinearGradient>
                </Animated.View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}

      <Modal visible={waitingForGame} transparent animationType="fade">
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <LinearGradient colors={['#1E293B', '#0F172A']} style={styles.loadingGradient}>
              <MaterialCommunityIcons name="gamepad-variant" size={60} color="#10B981" />
              <Text style={styles.loadingTitle}>{t('Starting Game...')}</Text>
              <Text style={styles.loadingSubtext}>{t('Preparing your match')}</Text>
              <View style={styles.dotsContainer}>
                <View style={[styles.dot, styles.dot1]} />
                <View style={[styles.dot, styles.dot2]} />
                <View style={[styles.dot, styles.dot3]} />
              </View>
            </LinearGradient>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  // ── Challenge Popup ───────────────────────────────────────────────────────
  modalOverlay: {
    flex:            1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent:  'center',
    alignItems:      'center',
  },
  popupContainer: {
    width:         width * 0.9,
    maxWidth:      400,
    borderRadius:  20,
    overflow:      'hidden',
    elevation:     10,
    shadowColor:   '#000',
    shadowOffset:  { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius:  20,
  },
  popupGradient:    { padding: 24, alignItems: 'center' },
  closeButton:      { position: 'absolute', top: 12, right: 12, padding: 8, zIndex: 10 },
  iconContainer:    { marginBottom: 16 },
  iconGradient:     { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center' },
  popupTitle:       { fontSize: scaleFont(24), fontWeight: 'bold', color: '#fff', marginBottom: 16, textAlign: 'center' },
  challengerInfo: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding:         12,
    borderRadius:    12,
    width:           '100%',
    marginBottom:    16,
  },
  challengerAvatar: {
    width:           50,
    height:          50,
    borderRadius:    25,
    backgroundColor: '#F59E0B',
    justifyContent:  'center',
    alignItems:      'center',
    marginRight:     12,
  },
  avatarText:        { fontSize: scaleFont(20), fontWeight: 'bold', color: '#fff' },
  challengerDetails: { flex: 1 },
  challengerName:    { fontSize: scaleFont(18), fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  challengerRating:  { fontSize: scaleFont(14), color: '#94A3B8' },
  settingsContainer: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  settingItem: {
    flexDirection:     'row',
    alignItems:        'center',
    backgroundColor:   'rgba(255,255,255,0.05)',
    paddingHorizontal: 16,
    paddingVertical:   8,
    borderRadius:      20,
    gap:               6,
  },
  settingText:          { color: '#fff', fontSize: scaleFont(14), fontWeight: '600' },
  popupMessage:         { fontSize: scaleFont(16), color: '#94A3B8', textAlign: 'center', marginBottom: 24 },
  actionButtons:        { flexDirection: 'row', gap: 12, width: '100%', marginBottom: 12 },
  declineButton: {
    flex:            1,
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'center',
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    borderRadius:    12,
    gap:             6,
  },
  declineButtonText:    { color: '#fff', fontSize: scaleFont(16), fontWeight: 'bold' },
  acceptButton:         { flex: 1, borderRadius: 12, overflow: 'hidden' },
  acceptButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, gap: 6 },
  acceptButtonText:     { color: '#fff', fontSize: scaleFont(16), fontWeight: 'bold' },
  expirationText:       { fontSize: scaleFont(12), color: '#64748B', textAlign: 'center' },

  // ── Loading Modal ─────────────────────────────────────────────────────────
  loadingOverlay:   { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  loadingContainer: { width: width * 0.7, borderRadius: 20, overflow: 'hidden', elevation: 10 },
  loadingGradient:  { padding: 30, alignItems: 'center' },
  loadingTitle:     { fontSize: scaleFont(20), fontWeight: 'bold', color: '#fff', marginTop: 16, marginBottom: 8 },
  loadingSubtext:   { fontSize: scaleFont(14), color: '#94A3B8', marginBottom: 20 },
  dotsContainer:    { flexDirection: 'row', gap: 8 },
  dot:              { width: 10, height: 10, borderRadius: 5, backgroundColor: '#10B981' },
  dot1:             { opacity: 0.4 },
  dot2:             { opacity: 0.7 },
  dot3:             { opacity: 1.0 },
});

export default ChallengePopup;
