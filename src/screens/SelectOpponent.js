import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Search, Users, Cpu } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import CustomHeader from '../components/CustomHeader';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function SelectOpponent() {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();

  const { gameConfig, preSelectedOpponent } = route.params || {};

  const [currentScreen, setCurrentScreen] = useState('select');
  const [selectedOpponent, setSelectedOpponent] = useState(
    preSelectedOpponent || 'Random',
  );

  const navigateBack = () => {
    if (currentScreen === 'difficulty') {
      setCurrentScreen('select');
    } else {
      navigation.goBack();
    }
  };

  // 🔹 helper for Random direct lobby
  const navigateToLobbyForRandom = () => {
    const symbolArray = gameConfig?.symbol?.split(',') || ['sum', 'difference'];

    const payload = {
      difficulty: gameConfig?.difficulty || 'easy',
      digit: 2,
      symbol: symbolArray,
      timer: gameConfig?.timer || 60,
      qm: gameConfig?.qm || 0,
    };

    navigation.navigate('Lobby', payload);
  };

  const handleDifficultySelect = level => {
    const symbolArray = gameConfig?.symbol?.split(',') || ['sum', 'difference'];

    const payload = {
      difficulty: gameConfig?.difficulty || 'easy',
      digit: 2,
      symbol: symbolArray,
      timer: gameConfig?.timer || 60,
      qm: gameConfig?.qm || 0,
    };

    if (selectedOpponent === 'Computer') {
      payload.computerLevel = level;
    }

    navigation.navigate('Lobby', payload);
  };

  const Wrapper = theme.backgroundGradient ? LinearGradient : View;
  const wrapperProps = theme.backgroundGradient
    ? { colors: theme.backgroundGradient }
    : { style: { backgroundColor: theme.background || '#0B1220' } };

  return (
    <Wrapper style={styles.container} {...wrapperProps}>
      <ScreenContent
        currentScreen={currentScreen}
        selectedOpponent={selectedOpponent}
        setSelectedOpponent={setSelectedOpponent}
        setCurrentScreen={setCurrentScreen}
        navigateBack={navigateBack}
        handleDifficultySelect={handleDifficultySelect}
        navigateToLobbyForRandom={navigateToLobbyForRandom}
        navigation={navigation}
        gameConfig={gameConfig}
      />
    </Wrapper>
  );
}

/* ================= SCREEN CONTENT ================= */

function ScreenContent({
  currentScreen,
  selectedOpponent,
  setSelectedOpponent,
  setCurrentScreen,
  navigateBack,
  navigation,
  gameConfig,
}) {
  const insets = useSafeAreaInsets();
  const route = useRoute(); // ✅ Fix: Access route directly via hook

  const handleSelection = (opponentType) => {
    setSelectedOpponent(opponentType);
    navigation.navigate('PlayGame', {
      selectedOpponent: opponentType,
      gametype: route.params?.gametype
    });
  };

  return (
    <>
      {/* ================= SELECT OPPONENT ================= */}
      {currentScreen === 'select' && (
        <View style={[styles.screenContainer, { paddingTop: insets.top + 30 }]}>
          <CustomHeader title="Select Opponent" onBack={navigateBack} />

          <View style={styles.content}>
            <OpponentCard
              title="Random Opponent"
              subtitle="Match with any available player"
              icon={<Users size={32} color="#f8630dff" />}
              selected={selectedOpponent === 'Random'}
              onPress={() => handleSelection('Random')}
            />

            <OpponentCard
              title="Computer"
              subtitle="Play against AI"
              icon={<Cpu size={32} color="#4ade80" />}
              selected={selectedOpponent === 'Computer'}
              onPress={() => handleSelection('Computer')}
            />

            <OpponentCard
              title="Friends"
              subtitle="Search and challenge friends"
              icon={<Search size={32} color="#ffd700" />}
              selected={selectedOpponent === 'Friends'}
              onPress={() => handleSelection('Friends')}
            />
          </View>
        </View>
      )}

      {/* ================= DIFFICULTY (ROW DESIGN) - KEPT FOR REFERENCE IF NEEDED, BUT CURRENTLY UNUSED AS WE RETURN TO PLAYGAME ================= */}
      {currentScreen === 'difficulty' && (
        <View style={[styles.screenContainer, { paddingTop: insets.top + 30 }]}>
          <CustomHeader title="Choose Level" onBack={navigateBack} />
          {/* If we wanted to handle difficulty here, we would pass it back to PlayGame too. For now, ignoring as PlayGame has difficulty. */}
        </View>
      )}
    </>
  );
}

/* ================= HEADER ================= */

/* ================= CARD ================= */

const OpponentCard = ({ title, subtitle, icon, selected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.card,
      {
        borderColor: selected ? '#fb8a08ff' : 'rgba(255,255,255,0.1)',
        borderWidth: selected ? 2 : 1,
      },
    ]}>
    <View style={styles.cardContent}>
      <View style={styles.iconCircle}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.cardTitle, selected && { fontWeight: 'bold' }]}>
          {title}
        </Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1 },
  screenContainer: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 18,
    marginTop: -40,
  },
  headerText: { color: '#fff', fontSize: 22, fontWeight: '700' },
  iconButton: { padding: 6 },

  headerLine: {
    height: 1,
    backgroundColor: '#fff',
    marginHorizontal: 4,
    marginBottom: 22,
  },

  content: { flex: 1, padding: 20 },

  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    backgroundColor: 'rgba(92, 19, 237, 0.05)',
  },
  cardContent: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  cardTitle: { fontSize: 18, color: '#fff', marginBottom: 4 },
  cardSubtitle: { fontSize: 14, color: '#90caf9' },

  /* ===== LEVEL ROW DESIGN ===== */

  levelList: {
    padding: 20,
  },

  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 16,
    marginBottom: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },

  levelCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#4ade80',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  levelCircleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0B1220',
  },

  levelText: {
    flex: 1,
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
});
