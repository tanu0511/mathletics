import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SvgUri } from 'react-native-svg';

const { width } = Dimensions.get('window');

const OfflineBadgesModal = ({ badges = [], onDismiss }) => {
  const [svgErrors, setSvgErrors] = useState({});

  return (
    <Modal visible={badges.length > 0} transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={offlineStyles.overlay}>
        <View style={offlineStyles.card}>

          <View style={offlineStyles.header}>
            <Text style={offlineStyles.title}>🏅 Badges earned while offline!</Text>
            <TouchableOpacity onPress={onDismiss}>
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={offlineStyles.subtitle}>
            You earned {badges.length} badge{badges.length !== 1 ? 's' : ''} while you were away.
          </Text>

          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 320 }}>
            {badges.map((badge, index) => (
              <View
                key={badge.badgeId ?? badge.id ?? index}
                style={offlineStyles.badgeRow}
              >
                <View style={offlineStyles.iconWrap}>
                  {badge.iconUrl && !svgErrors[index] ? (
                    <SvgUri
                      uri={badge.iconUrl}
                      width={36}
                      height={36}
                      onError={() =>
                        setSvgErrors(prev => ({ ...prev, [index]: true }))
                      }
                    />
                  ) : (
                    <Icon name="star" size={30} color={badge.color || '#FFD700'} />
                  )}
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={offlineStyles.badgeTitle}>{badge.title}</Text>
                  <Text style={offlineStyles.badgeDesc}>{badge.description}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity style={offlineStyles.dismissBtn} onPress={onDismiss}>
            <Text style={offlineStyles.dismissText}>Dismiss</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

export default OfflineBadgesModal;

const offlineStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: width * 0.88,
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 13,
    marginBottom: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#020617',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 12,
    marginBottom: 10,
  },
  iconWrap: {
    marginRight: 12,
    width: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  badgeDesc: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  dismissBtn: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 14,
  },
  dismissText: {
    color: '#9CA3AF',
    fontWeight: '600',
    fontSize: 14,
  },
});