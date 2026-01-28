// import { useFocusEffect, useNavigation } from '@react-navigation/native';
// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   ScrollView,
//   PixelRatio,
//   StatusBar,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/Ionicons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import Sound from 'react-native-sound';
// import {
//   playBackgroundMusic,
//   stopBackgroundMusic,
// } from '../utils/playBackgroundMusic';
// import { useTheme } from '../context/ThemeContext';
// import CustomHeader from '../components/CustomHeader';

// const { width, height } = Dimensions.get('window');
// const scaleFont = size => size * PixelRatio.getFontScale();

// const PlayGame = ({ route }) => {
//   const insets = useSafeAreaInsets();
//   const navigation = useNavigation();
//   const { gametype } = route.params || {};

//   // ✅ Determine if Practice Mode (Check params OR tab name)
//   const isPractice = gametype === 'PRACTICE' || route.name === 'Practise';
//   const { theme } = useTheme(); // ✅ Get current theme
//   const [selectedDifficulty, setSelectedDifficulty] = useState('easy');
//   const [selectedTimer, setSelectedTimer] = useState('1 Minute');
//   const [selectedSymbol, setSelectedSymbol] = useState('(+), (-), (x) and (/)');

//   const gameMusicRef = useRef(null);
//   // useEffect(() => {
//   //   gameMusicRef.current = new Sound(
//   //     'startgame.mp3',
//   //     Sound.MAIN_BUNDLE,
//   //     error => {
//   //       if (error) return console.log('Failed to load game music', error);
//   //       gameMusicRef.current.play(() => gameMusicRef.current.release());
//   //     },
//   //   );

//   //   return () => {
//   //     if (gameMusicRef.current) {
//   //       gameMusicRef.current.stop(() => gameMusicRef.current.release());
//   //     }
//   //   };
//   // }, []);

//   // useFocusEffect(
//   //   useCallback(() => {
//   //     stopBackgroundMusic();
//   //     return () => {};
//   //   }, []),
//   // );

//   AsyncStorage.getItem('diff').then(diff => {
//     setSelectedDifficulty(diff || 'easy');
//     AsyncStorage.getItem('timer').then(t => {
//       setSelectedTimer(t || '1 Minute');
//       AsyncStorage.getItem('symbol').then(s => {
//         setSelectedSymbol(s || '(+), (-), (x) and (/)');
//       });
//     });
//   });

//   // ✅ Dynamic theme-based selected option
//   const renderOption = (label, selected, onPress) => (
//     <TouchableOpacity onPress={onPress}>
//       {selected ? (
//         <LinearGradient
//           colors={theme.buttonGradient || ['#595CFF', '#87AEE9']}
//           style={styles.selectedOptionButton}>
//           <Text style={styles.selectedOptionText}>{label}</Text>
//         </LinearGradient>
//       ) : (
//         <View
//           style={[
//             styles.optionButton,
//             { backgroundColor: theme.cardBackground || '#1E293B' },
//           ]}>
//           <Text style={styles.optionText}>{label}</Text>
//         </View>
//       )}
//     </TouchableOpacity>
//   );

//   const handlePlayPress = async () => {
//     try {
//       let timerInSeconds = 60;
//       if (selectedTimer === '2 Minute') timerInSeconds = 120;
//       else if (selectedTimer === '3 Minute') timerInSeconds = 180;

//       let symbolValue = 'sum,difference';
//       if (selectedSymbol === '(+), (-), (x) and (/)')
//         symbolValue = 'sum,difference,product,quotient';

//       let storedQm = '0';
//       if (selectedDifficulty === 'medium') storedQm = '6';
//       else if (selectedDifficulty === 'hard') storedQm = '18';

//       await AsyncStorage.setItem('qm', storedQm);

//       const params = {
//         difficulty: selectedDifficulty,
//         symbol: symbolValue,
//         qm: parseInt(storedQm),
//         timer: timerInSeconds,
//       };

//       navigation.navigate(
//         isPractice ? 'MathInputScreen' : 'Lobby',
//         params,
//       );
//     } catch (error) {
//       console.error('❌ Error during handlePlayPress:', error);
//     }
//   };

//   const Content = () => (
//     <View style={{ flex: 1, paddingTop: insets.top + 30 }}>
//       <CustomHeader
//         title={isPractice ? 'Practice Game' : 'Play Game'}
//         onBack={() => navigation.goBack()}
//       // style={{ marginTop: -10 }} // Removed manual margin
//       />
//       <ScrollView
//         contentContainerStyle={[styles.container]}>
//         {/* Difficulty Section */}
//         <Text style={styles.sectionTitle}>Select Difficulty</Text>
//         <View style={styles.row}>
//           {renderOption('Easy', selectedDifficulty === 'easy', async () => {
//             await AsyncStorage.setItem('diff', 'easy');
//             setSelectedDifficulty('easy');
//           })}
//           {renderOption('Medium', selectedDifficulty === 'medium', async () => {
//             await AsyncStorage.setItem('diff', 'medium');
//             setSelectedDifficulty('medium');
//           })}
//           {renderOption('Hard', selectedDifficulty === 'hard', async () => {
//             await AsyncStorage.setItem('diff', 'hard');
//             setSelectedDifficulty('hard');
//           })}
//         </View>

//         {/* Timer Section */}
//         <Text style={styles.sectionTitle}>Timer</Text>
//         <View style={styles.row}>
//           {renderOption('1 Minute', selectedTimer === '1 Minute', async () => {
//             await AsyncStorage.setItem('timer', '1 Minute');
//             setSelectedTimer('1 Minute');
//           })}

//           {renderOption('2 Minute', selectedTimer === '2 Minute', async () => {
//             await AsyncStorage.setItem('timer', '2 Minute');
//             setSelectedTimer('2 Minute');
//           })}

//           {renderOption('3 Minute', selectedTimer === '3 Minute', async () => {
//             await AsyncStorage.setItem('timer', '3 Minute');
//             setSelectedTimer('3 Minute');
//           })}
//         </View>

//         {/* Symbol Section */}
//         <Text style={styles.sectionTitle}>Symbol</Text>
//         <View style={styles.row1}>
//           {renderOption('(+) and (-)', selectedSymbol === '(+) and (-)', async () => {
//             await AsyncStorage.setItem('symbol', '(+) and (-)');
//             setSelectedSymbol('(+) and (-)');
//           })}
//           {renderOption(
//             '(+), (-), (x) and (/)',
//             selectedSymbol === '(+), (-), (x) and (/)',
//             async () => {
//               await AsyncStorage.setItem('symbol', '(+), (-), (x) and (/)');
//               setSelectedSymbol('(+) , (-), (x) and (/)');
//             }
//           )}
//         </View>

//         <LinearGradient
//           colors={[theme.primary || '#FB923C', theme.primary || '#FF7F50']}
//           style={styles.playButton}>
//           <TouchableOpacity
//             onPress={handlePlayPress}
//             style={{ width: '100%', alignItems: 'center' }}>
//             <Text style={styles.playButtonText}>Play</Text>
//           </TouchableOpacity>
//         </LinearGradient>
//       </ScrollView>
//     </View>
//   );

//   return theme.backgroundGradient ? (
//     <LinearGradient colors={theme.backgroundGradient} style={{ flex: 1 }}>
//       <Content />
//     </LinearGradient>
//   ) : (
//     <View style={{ flex: 1, backgroundColor: '#0B1220' }}>
//       <Content />
//     </View>
//   );
// };

// export default PlayGame;

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: width * 0.06,
//     paddingBottom: height * 0.07,
//   },
//   iconButton: {
//     width: width * 0.06,
//     height: width * 0.07,
//     // backgroundColor: trapa,
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   heading: {
//     fontSize: scaleFont(25),
//     color: '#fff',
//     fontWeight: 'bold',
//     alignSelf: 'center',
//     marginBottom: height * 0.04,
//     marginTop: height * -0.04,
//     fontFamily: 'jaro',
//   },
//   sectionTitle: {
//     fontSize: scaleFont(16),
//     color: '#fff',
//     marginBottom: height * 0.012,
//     fontWeight: '600',
//   },
//   row: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     // gap: width * 0.024,
//     marginBottom: height * 0.015,
//     justifyContent: 'space-between',
//   },
//   row1: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: width * 0.025,
//     marginBottom: height * 0.015,
//   },
//   optionButton: {
//     backgroundColor: '#1E293B',
//     paddingVertical: height * 0.015,
//     paddingHorizontal: width * 0.052,
//     borderRadius: 0,
//     marginRight: width * 0.025,
//     marginTop: height * 0.01,
//   },
//   optionText: {
//     color: '#ccc',
//     fontSize: scaleFont(14),
//   },
//   selectedOptionButton: {
//     paddingVertical: height * 0.014,
//     paddingHorizontal: width * 0.04,
//     borderRadius: 0,
//     marginRight: width * 0.020,
//     marginTop: height * 0.01,
//   },
//   selectedOptionText: {
//     color: '#fff',
//     fontWeight: '700',
//     fontSize: scaleFont(14),
//   },
//   playButton: {
//     marginTop: height * 0.05,
//     paddingVertical: height * 0.015,
//     borderRadius: 20,
//     width: width * 0.6,
//     alignSelf: 'center',
//     alignItems: 'center',
//     overflow: 'hidden',
//   },
//   playButtonText: {
//     color: '#fff',
//     fontSize: scaleFont(18),
//     fontWeight: '700',
//   },
// });


// import { useFocusEffect, useNavigation } from '@react-navigation/native';
// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   ScrollView,
//   PixelRatio,
//   StatusBar,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/Ionicons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import Sound from 'react-native-sound';
// import {
//   playBackgroundMusic,
//   stopBackgroundMusic,
// } from '../utils/playBackgroundMusic';
// import { useTheme } from '../context/ThemeContext';
// import CustomHeader from '../components/CustomHeader';

// const { width, height } = Dimensions.get('window');
// const scaleFont = size => size * PixelRatio.getFontScale();

// const PlayGame = ({ route }) => {
//   const insets = useSafeAreaInsets();
//   const navigation = useNavigation();
//   const { gametype } = route.params || {};

//   // ✅ Determine if Practice Mode (Check params OR tab name)
//   const isPractice = gametype === 'PRACTICE' || route.name === 'Practise';
//   const { theme } = useTheme(); // ✅ Get current theme
//   const [selectedDifficulty, setSelectedDifficulty] = useState('easy');
//   const [selectedTimer, setSelectedTimer] = useState('1 Minute');
//   const [selectedSymbol, setSelectedSymbol] = useState('(+), (-), (x) and (/)');

//   const gameMusicRef = useRef(null);
//   // useEffect(() => {
//   //   gameMusicRef.current = new Sound(
//   //     'startgame.mp3',
//   //     Sound.MAIN_BUNDLE,
//   //     error => {
//   //       if (error) return console.log('Failed to load game music', error);
//   //       gameMusicRef.current.play(() => gameMusicRef.current.release());
//   //     },
//   //   );

//   //   return () => {
//   //     if (gameMusicRef.current) {
//   //       gameMusicRef.current.stop(() => gameMusicRef.current.release());
//   //     }
//   //   };
//   // }, []);

//   // useFocusEffect(
//   //   useCallback(() => {
//   //     stopBackgroundMusic();
//   //     return () => {};
//   //   }, []),
//   // );

//   AsyncStorage.getItem('diff').then(diff => {
//     setSelectedDifficulty(diff || 'easy');
//     AsyncStorage.getItem('timer').then(t => {
//       setSelectedTimer(t || '1 Minute');
//       AsyncStorage.getItem('symbol').then(s => {
//         setSelectedSymbol(s || '(+), (-), (x) and (/)');
//       });
//     });
//   });

//   // ✅ Dynamic theme-based selected option
//   const renderOption = (label, selected, onPress) => (
//     <TouchableOpacity onPress={onPress}>
//       {selected ? (
//         <LinearGradient
//           colors={theme.buttonGradient || ['#595CFF', '#87AEE9']}
//           style={styles.selectedOptionButton}>
//           <Text style={styles.selectedOptionText}>{label}</Text>
//         </LinearGradient>
//       ) : (
//         <View
//           style={[
//             styles.optionButton,
//             { backgroundColor: theme.cardBackground || '#1E293B' },
//           ]}>
//           <Text style={styles.optionText}>{label}</Text>
//         </View>
//       )}
//     </TouchableOpacity>
//   );

//   const handlePlayPress = async () => {
//     try {
//       let timerInSeconds = 60;
//       if (selectedTimer === '2 Minute') timerInSeconds = 120;
//       else if (selectedTimer === '3 Minute') timerInSeconds = 180;

//       let symbolValue = 'sum,difference';
//       if (selectedSymbol === '(+), (-), (x) and (/)')
//         symbolValue = 'sum,difference,product,quotient';

//       let storedQm = '0';
//       if (selectedDifficulty === 'medium') storedQm = '6';
//       else if (selectedDifficulty === 'hard') storedQm = '18';

//       await AsyncStorage.setItem('qm', storedQm);

//       const params = {
//         difficulty: selectedDifficulty,
//         symbol: symbolValue,
//         qm: parseInt(storedQm),
//         timer: timerInSeconds,
//       };

//       navigation.navigate(
//         isPractice ? 'MathInputScreen' : 'Lobby',
//         params,
//       );
//     } catch (error) {
//       console.error('❌ Error during handlePlayPress:', error);
//     }
//   };

//   const Content = () => (
//     <View style={{ flex: 1, paddingTop: insets.top + 30 }}>
//       <CustomHeader
//         title={isPractice ? 'Practice Game' : 'Play Game'}
//         onBack={() => navigation.goBack()}
//       // style={{ marginTop: -10 }} // Removed manual margin
//       />
//       <ScrollView
//         contentContainerStyle={[styles.container]}>
//         {/* Difficulty Section */}
//         <Text style={styles.sectionTitle}>Select Difficulty</Text>
//         <View style={styles.row}>
//           {renderOption('Easy', selectedDifficulty === 'easy', async () => {
//             await AsyncStorage.setItem('diff', 'easy');
//             setSelectedDifficulty('easy');
//           })}
//           {renderOption('Medium', selectedDifficulty === 'medium', async () => {
//             await AsyncStorage.setItem('diff', 'medium');
//             setSelectedDifficulty('medium');
//           })}
//           {renderOption('Hard', selectedDifficulty === 'hard', async () => {
//             await AsyncStorage.setItem('diff', 'hard');
//             setSelectedDifficulty('hard');
//           })}
//         </View>

//         {/* Timer Section */}
//         <Text style={styles.sectionTitle}>Timer</Text>
//         <View style={styles.row}>
//           {renderOption('1 Minute', selectedTimer === '1 Minute', async () => {
//             await AsyncStorage.setItem('timer', '1 Minute');
//             setSelectedTimer('1 Minute');
//           })}

//           {renderOption('2 Minute', selectedTimer === '2 Minute', async () => {
//             await AsyncStorage.setItem('timer', '2 Minute');
//             setSelectedTimer('2 Minute');
//           })}

//           {renderOption('3 Minute', selectedTimer === '3 Minute', async () => {
//             await AsyncStorage.setItem('timer', '3 Minute');
//             setSelectedTimer('3 Minute');
//           })}
//         </View>

//         {/* Symbol Section */}
//         <Text style={styles.sectionTitle}>Symbol</Text>
//         <View style={styles.row1}>
//           {renderOption('(+) and (-)', selectedSymbol === '(+) and (-)', async () => {
//             await AsyncStorage.setItem('symbol', '(+) and (-)');
//             setSelectedSymbol('(+) and (-)');
//           })}
//           {renderOption(
//             '(+), (-), (x) and (/)',
//             selectedSymbol === '(+), (-), (x) and (/)',
//             async () => {
//               await AsyncStorage.setItem('symbol', '(+), (-), (x) and (/)');
//               setSelectedSymbol('(+) , (-), (x) and (/)');
//             }
//           )}
//         </View>

//         <LinearGradient
//           colors={[theme.primary || '#FB923C', theme.primary || '#FF7F50']}
//           style={styles.playButton}>
//           <TouchableOpacity
//             onPress={handlePlayPress}
//             style={{ width: '100%', alignItems: 'center' }}>
//             <Text style={styles.playButtonText}>Play</Text>
//           </TouchableOpacity>
//         </LinearGradient>
//       </ScrollView>
//     </View>
//   );

//   return theme.backgroundGradient ? (
//     <LinearGradient colors={theme.backgroundGradient} style={{ flex: 1 }}>
//       <Content />
//     </LinearGradient>
//   ) : (
//     <View style={{ flex: 1, backgroundColor: '#0B1220' }}>
//       <Content />
//     </View>
//   );
// };

// export default PlayGame;

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: width * 0.06,
//     paddingBottom: height * 0.07,
//   },
//   iconButton: {
//     width: width * 0.06,
//     height: width * 0.07,
//     // backgroundColor: trapa,
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   heading: {
//     fontSize: scaleFont(25),
//     color: '#fff',
//     fontWeight: 'bold',
//     alignSelf: 'center',
//     marginBottom: height * 0.04,
//     marginTop: height * -0.04,
//     fontFamily: 'jaro',
//   },
//   sectionTitle: {
//     fontSize: scaleFont(16),
//     color: '#fff',
//     marginBottom: height * 0.012,
//     fontWeight: '600',
//   },
//   row: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     // gap: width * 0.024,
//     marginBottom: height * 0.015,
//     justifyContent: 'space-between',
//   },
//   row1: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: width * 0.025,
//     marginBottom: height * 0.015,
//   },
//   optionButton: {
//     backgroundColor: '#1E293B',
//     paddingVertical: height * 0.015,
//     paddingHorizontal: width * 0.052,
//     borderRadius: 0,
//     marginRight: width * 0.025,
//     marginTop: height * 0.01,
//   },
//   optionText: {
//     color: '#ccc',
//     fontSize: scaleFont(14),
//   },
//   selectedOptionButton: {
//     paddingVertical: height * 0.014,
//     paddingHorizontal: width * 0.04,
//     borderRadius: 0,
//     marginRight: width * 0.020,
//     marginTop: height * 0.01,
//   },
//   selectedOptionText: {
//     color: '#fff',
//     fontWeight: '700',
//     fontSize: scaleFont(14),
//   },
//   playButton: {
//     marginTop: height * 0.05,
//     paddingVertical: height * 0.015,
//     borderRadius: 20,
//     width: width * 0.6,
//     alignSelf: 'center',
//     alignItems: 'center',
//     overflow: 'hidden',
//   },
//   playButtonText: {
//     color: '#fff',
//     fontSize: scaleFont(18),
//     fontWeight: '700',
//   },
// });



import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  PixelRatio,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Sound from 'react-native-sound';
import {
  playBackgroundMusic,
  stopBackgroundMusic,
} from '../utils/playBackgroundMusic';
import { useTheme } from '../context/ThemeContext';
import CustomHeader from '../components/CustomHeader';

const { width, height } = Dimensions.get('window');
const scaleFont = size => size * PixelRatio.getFontScale();

const PlayGame = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const { gametype } = route.params || {};
  const { theme } = useTheme();

  const [selectedDifficulty, setSelectedDifficulty] = useState('easy');
  const [selectedTimer, setSelectedTimer] = useState('1 Minute');
  const [selectedSymbol, setSelectedSymbol] = useState('(+), (-), (x) and (/)');
  const [selectedOpponent, setSelectedOpponent] = useState('Random'); // ✅ NEW STATE
  const [isFirstLoad, setIsFirstLoad] = useState(true); // ✅ Track first load

  const gameMusicRef = useRef(null);

  // ✅ Load saved settings and handle auto-navigation based on previous mode
  useEffect(() => {
    const loadSettingsAndNavigate = async () => {
      try {
        // Load settings
        const diff = await AsyncStorage.getItem('diff');
        const timer = await AsyncStorage.getItem('timer');
        const symbol = await AsyncStorage.getItem('symbol');
        const previousMode = await AsyncStorage.getItem('previousMode');

        setSelectedDifficulty(diff || 'easy');
        setSelectedTimer(timer || '1 Minute');
        setSelectedSymbol(symbol || '(+), (-), (x) and (/)');

        // ✅ HANDLE DEFAULT STATE (No manual selection)
        // If previousMode exists and it's the first load
        if (previousMode && isFirstLoad && gametype !== 'PRACTICE') {
          if (previousMode === 'Computer') {
            // Continue in Computer mode with saved difficulty
            setSelectedOpponent('Computer');
          } else if (previousMode === 'Random') {
            // Continue in Random mode
            setSelectedOpponent('Random');
          } else if (previousMode === 'Friend') {
            // ✅ Default to Random if last mode was Friend (User Requirment)
            setSelectedOpponent('Random');
          }
        }

        // ✅ OVERRIDE WITH ROUTE PARAMS IF AVAILABLE (Fix for "Random" always selected)
        if (route.params?.selectedOpponent) {
          setSelectedOpponent(route.params.selectedOpponent);
        }

        setIsFirstLoad(false);
      } catch (error) {
        console.error('Error loading settings:', error);
        setIsFirstLoad(false);
      }
    };

    loadSettingsAndNavigate();
  }, [isFirstLoad, gametype, navigation]);

  const renderOption = (label, selected, onPress) => (
    <TouchableOpacity onPress={onPress}>
      {selected ? (
        <LinearGradient
          colors={theme.buttonGradient || ['#595CFF', '#87AEE9']}
          style={styles.selectedOptionButton}>
          <Text style={styles.selectedOptionText}>{label}</Text>
        </LinearGradient>
      ) : (
        <View
          style={[
            styles.optionButton,
            { backgroundColor: theme.cardBackground || '#1E293B' },
          ]}>
          <Text style={styles.optionText}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  // ✅ Update selected opponent when returning from SelectOpponent
  useEffect(() => {
    if (route.params?.selectedOpponent) {
      setSelectedOpponent(route.params.selectedOpponent);
    }
  }, [route.params?.selectedOpponent]);

  const handlePlayPress = async () => {
    try {
      let timerInSeconds = 60;
      if (selectedTimer === '2 Minute') timerInSeconds = 120;
      else if (selectedTimer === '3 Minute') timerInSeconds = 180;

      let symbolValue = 'sum,difference';
      if (selectedSymbol === '(+), (-), (x) and (/)')
        symbolValue = 'sum,difference,product,quotient';

      let storedQm = '0';
      if (selectedDifficulty === 'medium') storedQm = '6';
      else if (selectedDifficulty === 'hard') storedQm = '18';

      await AsyncStorage.setItem('qm', storedQm);

      // ✅ PRACTICE MODE (UNCHANGED)
      if (gametype === 'PRACTICE') {
        navigation.navigate('MathInputScreen', {
          difficulty: selectedDifficulty,
          symbol: symbolValue,
          qm: parseInt(storedQm),
          timer: timerInSeconds,
        });
        return;
      }

      // ✅ SAVE PREVIOUS MODE
      await AsyncStorage.setItem('previousMode', selectedOpponent);

      const gameConfig = {
        difficulty: selectedDifficulty,
        symbol: symbolValue,
        qm: parseInt(storedQm),
        timer: timerInSeconds,
      };

      // ✅ ROUTING LOGIC
      if (selectedOpponent === 'Random') {
        // Direct to Lobby
        navigation.navigate('Lobby', {
          difficulty: selectedDifficulty,
          digit: 2, // Default or from logic
          symbol: symbolValue.split(','),
          timer: timerInSeconds,
          qm: parseInt(storedQm),
        });
      } else if (selectedOpponent === 'Computer') {
        // To WaitingForOpponent
        navigation.navigate('WaitingForOpponent', {
          challengedUser: { username: 'Computer' }, // Dummy user for UI
          diff: selectedDifficulty,
          timer: timerInSeconds,
          symbol: symbolValue,
          isComputer: true, // Flag to indicate computer mode
        });
      } else {
        // Fallback or Friends logic (Keep existing "SelectOpponent" flow if needed, but user said "VS me gaya to jaise select किया kuch bhi uske bad use vaps select openent ki screen me le jao")
        // Since we are IN PlayGame, and we select opponent via SelectOpponent screen, we just need to handle what happens when we click Play.
        // If "Friends", we might need to go to ChallengeFriends or similar.
        // For now, let's assume standard behavior for random/computer as requested.
        // If it's something else, maybe we go to SelectOpponent again? Or just stay here?
        // User said: "vaps select openent ki screen me le jao and waha se play game button ke click me to vahi rakhan hai jo pahle tha"
        // Wait, "waha se play game button ke click me to vahi rakhan hai jo pahle tha" -> if they go to VS screen, select something, come back, then click Play Game, it should do what it used to do?
        // No, "sidhe play game me click kare to usko render karwao tum sidha lobby screen me lana hai" (Random specific)
        // And "computer agr hai to ek wating for oponent banao"

        // If they didn't implementing Friends flow details, I'll default to Random behavior or existing flow for now.
        // But checking the requested flow for 'Friends' isn't explicitly detailed other than "select kuch bhi... waps select openent ki screen me le jao".
        // The user's prompt implies: "if user went to VS, selected something, bring them BACK to this screen (PlayGame), and THEN when they click Play Game here..."

        // So if Friends is selected, we probably need a ChallengeFriends flow.
        // Existing SelectOpponent had: navigation.navigate('ChallengeFriends', ...)
        // So here, if Friends, we navigate to ChallengeFriends.
        // ✅ FRIENDS MODE
        if (selectedOpponent === 'Friends') {
          navigation.navigate('ChallengeFriends', {
            gameConfig,
          });
        }
      }

    } catch (error) {
      console.error('❌ Error during handlePlayPress:', error);
    }
  };


  const Content = () => (
    <View style={{ flex: 1, paddingTop: insets.top + 30 }}>
      <CustomHeader
        title={gametype === 'PRACTICE' ? 'Practice Game' : 'Play Game'}
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={[styles.container]}>

        {/* Difficulty Section */}
        <Text style={styles.sectionTitle}>Select Difficulty</Text>
        <View style={styles.row}>
          {renderOption('Easy', selectedDifficulty === 'easy', async () => {
            await AsyncStorage.setItem('diff', 'easy');
            setSelectedDifficulty('easy');
          })}
          {renderOption('Medium', selectedDifficulty === 'medium', async () => {
            await AsyncStorage.setItem('diff', 'medium');
            setSelectedDifficulty('medium');
          })}
          {renderOption('Hard', selectedDifficulty === 'hard', async () => {
            await AsyncStorage.setItem('diff', 'hard');
            setSelectedDifficulty('hard');
          })}
        </View>

        {/* Timer Section */}
        <Text style={styles.sectionTitle}>Timer</Text>
        <View style={styles.row}>
          {renderOption('1 Minute', selectedTimer === '1 Minute', async () => {
            await AsyncStorage.setItem('timer', '1 Minute');
            setSelectedTimer('1 Minute');
          })}
          {renderOption('2 Minute', selectedTimer === '2 Minute', async () => {
            await AsyncStorage.setItem('timer', '2 Minute');
            setSelectedTimer('2 Minute');
          })}
          {renderOption('3 Minute', selectedTimer === '3 Minute', async () => {
            await AsyncStorage.setItem('timer', '3 Minute');
            setSelectedTimer('3 Minute');
          })}
        </View>

        {/* Symbol Section */}
        <Text style={styles.sectionTitle}>Symbol</Text>
        <View style={styles.row1}>
          {renderOption('(+) and (-)', selectedSymbol === '(+) and (-)', async () => {
            await AsyncStorage.setItem('symbol', '(+) and (-)');
            setSelectedSymbol('(+) and (-)');
          })}
          {renderOption(
            '(+), (-), (x) and (/)',
            selectedSymbol === '(+), (-), (x) and (/)',
            async () => {
              await AsyncStorage.setItem('symbol', '(+), (-), (x) and (/)');
              setSelectedSymbol('(+), (-), (x) and (/)');
            }
          )}
        </View>

        {/* ✅ OPPONENT DROPDOWN SECTION - Only for Multiplayer */}
        {gametype !== 'PRACTICE' && (
          <>
            <Text style={styles.sectionTitle}>VS</Text>
            <TouchableOpacity
              onPress={async () => {
                // ✅ DIRECTLY NAVIGATE TO SelectOpponent
                try {
                  let timerInSeconds = 60;
                  if (selectedTimer === '2 Minute') timerInSeconds = 120;
                  else if (selectedTimer === '3 Minute') timerInSeconds = 180;

                  let symbolValue = 'sum,difference';
                  if (selectedSymbol === '(+), (-), (x) and (/)')
                    symbolValue = 'sum,difference,product,quotient';

                  let storedQm = '0';
                  if (selectedDifficulty === 'medium') storedQm = '6';
                  else if (selectedDifficulty === 'hard') storedQm = '18';

                  const gameConfig = {
                    difficulty: selectedDifficulty,
                    symbol: symbolValue,
                    qm: parseInt(storedQm),
                    timer: timerInSeconds,
                  };

                  // ✅ DIRECTLY NAVIGATE TO SelectOpponent (No modal shown)
                  navigation.navigate('SelectOpponent', {
                    gametype,
                    gameConfig,
                    preSelectedOpponent: selectedOpponent,
                  });
                } catch (error) {
                  console.error('❌ Error navigating to SelectOpponent:', error);
                }
              }}
              style={[
                styles.dropdownButton,
                { backgroundColor: theme.cardBackground || '#1E293B' },
              ]}>
              <Text style={styles.dropdownText}>{selectedOpponent}</Text>
              <Icon name="chevron-down" size={20} color="#fff" />
            </TouchableOpacity>
          </>
        )}

        {/* Play Button */}
        <TouchableOpacity onPress={handlePlayPress}>
          <LinearGradient
            colors={[theme.primary || '#FB923C', theme.primary || '#FF7F50']}
            style={styles.playButton}>
            <View
              style={{ width: '100%', alignItems: 'center' }}>
              <Text style={styles.playButtonText}>
                {gametype === 'PRACTICE' ? 'Start Practice' : 'Start Game'}
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  return theme.backgroundGradient ? (
    <LinearGradient colors={theme.backgroundGradient} style={{ flex: 1 }}>
      <Content />
    </LinearGradient>
  ) : (
    <View style={{ flex: 1, backgroundColor: '#0B1220' }}>
      <Content />
    </View>
  );
};

export default PlayGame;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: width * 0.06,
    paddingBottom: height * 0.07,
  },
  iconButton: {
    width: width * 0.06,
    height: width * 0.07,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: scaleFont(25),
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: height * 0.04,
    marginTop: height * -0.04,
    fontFamily: 'jaro',
  },
  sectionTitle: {
    fontSize: scaleFont(16),
    color: '#fff',
    marginBottom: height * 0.012,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: height * 0.015,
    justifyContent: 'space-between',
  },
  row1: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: width * 0.025,
    marginBottom: height * 0.015,
  },
  optionButton: {
    backgroundColor: '#1E293B',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.052,
    borderRadius: 0,
    marginRight: width * 0.025,
    marginTop: height * 0.01,
  },
  optionText: {
    color: '#ccc',
    fontSize: scaleFont(14),
  },
  selectedOptionButton: {
    paddingVertical: height * 0.014,
    paddingHorizontal: width * 0.04,
    borderRadius: 0,
    marginRight: width * 0.020,
    marginTop: height * 0.01,
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: scaleFont(14),
  },
  // ✅ DROPDOWN BUTTON STYLES (for VS button)
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    borderRadius: 8,
    marginBottom: height * 0.015,
  },
  dropdownText: {
    color: '#fff',
    fontSize: scaleFont(14),
    fontWeight: '600',
  },
  playButton: {
    marginTop: height * 0.05,
    paddingVertical: height * 0.015,
    borderRadius: 20,
    width: width * 0.6,
    alignSelf: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  playButtonText: {
    color: '#fff',
    fontSize: scaleFont(18),
    fontWeight: '700',
  },
  vsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    padding: width * 0.04,
    borderRadius: 12,
    marginBottom: height * 0.025,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  vsText: {
    color: '#fff',
    fontSize: scaleFont(16),
    fontWeight: '600',
  },
});

