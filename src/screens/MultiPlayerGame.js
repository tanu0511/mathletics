import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  PixelRatio,
  SafeAreaView,
  StatusBar,
  Animated,
  AppState,
  Alert,
  BackHandler,
  ScrollView,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { useSocket } from '../context/Socket';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useSound } from '../context/SoundContext';
import { KEYPAD_LAYOUTS } from '../utils/keyboardLayouts';
import { initSound, playEffect, stopEffect } from '../utils/SoundManager';

const { width, height } = Dimensions.get('window');
const scaleFont = size => size * PixelRatio.getFontScale();

const REACTIONS = ['', '', '🎯', '�', '�', '�', '⚡', '�'];

const getMathSymbol = word => {
  const symbolMap = {
    Sum: '+',
    Difference: '-',
    Product: '*',
    Quotient: '/',
    Modulus: '%',
    Exponent: '^',
  };
  return symbolMap[word] || word;
};

const MultiPlayerGame = () => {
  /* ================= HOOKS & CONTEXT ================= */
  const socket = useSocket();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const { theme, keyboardTheme } = useTheme();
  const { isSoundOn, toggleSound } = useSound();

  /* ================= PARAMS ================= */
  const { currentQuestion, timer, difficulty, opponent, myMongoId } =
    route.params || {};

  console.log('🎮 Game Screen Params:', {
    myMongoId,
    opponent,
    difficulty,
    timer,
  });

  const currentLayout = KEYPAD_LAYOUTS[keyboardTheme] || KEYPAD_LAYOUTS.type1;

  /* ================= STATE ================= */
  const [input, setInput] = useState('');
  const [question, setQuestion] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isReverse, setIsReverse] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [awaitingResult, setAwaitingResult] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [gameEnded, setGameEnded] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(1);
  const [bonusText, setBonusText] = useState('');

  // Timer State
  const [minutes, setMinutes] = useState(Math.floor((timer ?? 60) / 60));
  const [seconds, setSeconds] = useState((timer ?? 60) % 60);
  const [animateWatch] = useState(new Animated.Value(1));
  const [isThirtySecPhase, setIsThirtySecPhase] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Local Stats State
  const [score, setScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [answerHistory, setAnswerHistory] = useState([]);
  const [opponentEmoji, setOpponentEmoji] = useState(null);
  const [isReactionPickerOpen, setIsReactionPickerOpen] = useState(false);
  const [opponentHistory, setOpponentHistory] = useState([]); // ✅ Opponent History State

  // ✅ RESULT MODAL STATE
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [resultFadeAnim] = useState(new Animated.Value(0));
  const [resultScaleAnim] = useState(new Animated.Value(0.8));

  /* ================= REFS ================= */
  const socketRef = useRef(null);
  const totalTimeRef = useRef(timer ?? 60);
  const scoreRef = useRef(0);
  const correctAnswersRef = useRef(0);
  const incorrectCountRef = useRef(0);
  const skippedCountRef = useRef(0);
  const opponentScoreRef = useRef(0);
  const isSoundOnRef = useRef(isSoundOn);
  const last10PlayedRef = useRef(false);
  const appState = useRef(AppState.currentState);
  const hasNavigatedToResultRef = useRef(false);

  // MongoDB ID refs
  const myMongoIdRef = useRef(myMongoId);
  const opponentMongoIdRef = useRef(opponent?.id);
  const revScale = useRef(new Animated.Value(1)).current;

  /* ================= DIAGNOSTIC LOGGING ================= */
  useEffect(() => {
    console.log('=== GAME SCREEN DIAGNOSTIC ===');
    console.log('1. My MongoDB ID (from params):', myMongoId);
    console.log('2. Opponent MongoDB ID:', opponent?.id);
    console.log('3. Opponent Username:', opponent?.username);
    console.log('4. Difficulty:', difficulty);
    console.log('5. Timer:', timer);
    console.log('==============================');
  }, []);

  // ADD THIS NEW useEffect at the top
  useEffect(() => {
    return () => {
      if (
        socketRef.current &&
        socketRef.current.connected &&
        !hasNavigatedToResultRef.current
      ) {
        console.log('🧹 Cleaning up game - emitting game-ended');
        socketRef.current.emit('game-ended');
      }
      stopEffect('ticktock');
    };
  }, []);
  /* ================= EFFECTS: SOUND & APP STATE ================= */
  useEffect(() => {
    isSoundOnRef.current = isSoundOn;
    if (!isSoundOn) {
      stopEffect('ticktock');
      stopEffect('timer');
      last10PlayedRef.current = false;
    }
  }, [isSoundOn]);

  useFocusEffect(
    useCallback(() => {
      initSound('correct', 'rightanswer.mp3');
      initSound('incorrect', 'wronganswerr.mp3');
      initSound('skipped', 'skip.mp3');
      initSound('timer', 'every30second.wav');
      initSound('ticktock', 'ticktock.mp3');
    }, []),
  );

  useEffect(() => {
    const sub = AppState.addEventListener('change', state => {
      if (state !== 'active') {
        stopEffect('ticktock');
      } else {
        if (totalTimeRef.current <= 10 && totalTimeRef.current > 0) {
          playEffect('ticktock', isSoundOnRef.current);
        }
      }
      appState.current = state;
    });
    return () => sub.remove();
  }, []);

  /* ================= BACK BUTTON HANDLER ================= */
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (!gameEnded) {
          Alert.alert(
            'Leave Game?',
            'Are you sure you want to leave? You will lose the match.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Leave',
                style: 'destructive',
                onPress: handleGameExit,
              },
            ],
          );
          return true;
        }
        return false;
      },
    );

    return () => backHandler.remove();
  }, [gameEnded]);

  useEffect(() => {
    if (isReverse) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(revScale, { toValue: 1.05, duration: 800, useNativeDriver: true }),
          Animated.timing(revScale, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    } else {
      revScale.setValue(1);
    }
  }, [isReverse]);

  /* ================= EFFECTS: USER & SOCKET ================= */
  useEffect(() => {
    AsyncStorage.getItem('userData')
      .then(stored => {
        if (stored) {
          const userData = JSON.parse(stored);
          console.log('✅ User Data Loaded:', {
            id: userData.id || userData._id,
            username: userData.username,
          });
          setUser(userData);

          if (!myMongoIdRef.current) {
            myMongoIdRef.current = userData.id || userData._id;
            console.log('⚠️ Using fallback MongoDB ID:', myMongoIdRef.current);
          }
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!socket) return;
    socketRef.current = socket;

    console.log('🔌 Setting up socket listeners...');

    if (opponent?.id) {
      opponentMongoIdRef.current = opponent.id;
      console.log('✅ Opponent MongoDB ID stored:', opponent.id);
    }

    // ✅ CONNECTION STATUS HANDLERS
    const handleConnect = () => {
      console.log('🟢 Reconnected to server');
      setIsConnected(true);
    };

    const handleDisconnect = reason => {
      console.log('🔴 Disconnected from server:', reason);
      setIsConnected(false);

      if (!gameEnded && !hasNavigatedToResultRef.current) {
        Alert.alert(
          'Connection Lost',
          'You have been disconnected from the server.',
          [
            {
              text: 'OK',
              onPress: () => {
                stopEffect('ticktock');
                navigation.replace('BottomTab');
              },
            },
          ],
        );
      }
    };

    const handleConnectError = error => {
      console.error('❌ Connection error:', error);
      setIsConnected(false);
    };

    // --- Socket Listeners ---
    const handleNewQuestion = q => {
      console.log('📥 new-question:', q);
      const mathSymbol = getMathSymbol(q.symbol);
      setQuestion(`${q.input1} ${mathSymbol} ${q.input2}`);
      setCorrectAnswer(String(q.answer));
      setInput('');
      setLoading(false);
      setFeedback(null);
      setAwaitingResult(false);
      setQuestionIndex(prev => prev + 1);
    };

    const handleNextQuestion = data => {
      console.log('📥 next-question:', data);
      const q = data.question;
      const mathSymbol = getMathSymbol(q.symbol);
      setQuestion(`${q.input1} ${mathSymbol} ${q.input2}`);
      setCorrectAnswer(String(q.answer));
      setInput('');
      setLoading(false);
      setFeedback(null);
      setAwaitingResult(false);
      setQuestionIndex(prev => prev + 1);

      if (data.gameState && data.gameState.playerScores) {
        const pScores = data.gameState.playerScores;
        console.log('📊 Player Scores from server:', pScores);

        if (
          opponentMongoIdRef.current &&
          pScores[opponentMongoIdRef.current] !== undefined
        ) {
          const opData = pScores[opponentMongoIdRef.current];
          const opScore = typeof opData === 'object' ? opData.score : opData;
          console.log('📊 Opponent score update:', opScore);
          setOpponentScore(opScore);
          opponentScoreRef.current = opScore;
        }

        if (
          myMongoIdRef.current &&
          pScores[myMongoIdRef.current] !== undefined
        ) {
          const myData = pScores[myMongoIdRef.current];
          const myScore = typeof myData === 'object' ? myData.score : myData;
          if (myScore !== scoreRef.current) {
            console.log('📊 My score update:', myScore);
            scoreRef.current = myScore;
            setScore(myScore);
          }
        }
      }
    };

    const handleOpponentScoreUpdate = data => {
      console.log('📊 opponent-score-update:', data);

      if (data.opponentId === opponentMongoIdRef.current) {
        console.log('✅ Updating opponent score to:', data.score);
        setOpponentScore(data.score);
        opponentScoreRef.current = data.score;

        if (data.history && Array.isArray(data.history)) {
          console.log("Opponent history synced:", data.history);
          setOpponentHistory(data.history);
        }
      }
    };

    const handleGameEnded = data => {
      console.log('🏁 game-ended:', data);

      if (hasNavigatedToResultRef.current) {
        console.log('🛑 Already navigated to results, ignoring duplicate');
        return;
      }

      hasNavigatedToResultRef.current = true;
      setGameEnded(true);
      stopEffect('ticktock');

      // ✅ NO need to emit game-ended here - server already knows

      // ✅ SHOW MODAL INSTEAD OF NAVIGATING
      const attempts = correctAnswersRef.current + incorrectCountRef.current;
      const acc = attempts > 0 ? Math.round((correctAnswersRef.current / attempts) * 100) : 0;

      // Determine result
      let gameResult = 'draw';
      if (scoreRef.current > (opponentScoreRef.current || 0)) gameResult = 'win';
      else if (scoreRef.current < (opponentScoreRef.current || 0)) gameResult = 'lose';

      setResultData({
        gameResult,
        totalScore: scoreRef.current,
        opponentScore: opponentScoreRef.current || 0,
        correctCount: correctAnswersRef.current,
        inCorrectCount: incorrectCountRef.current,
        skippedQuestions: skippedCountRef.current,
        correctPercentage: acc,
        durationSeconds: timer,
        winner: data.winner
      });
      setShowResultModal(true);

      Animated.parallel([
        Animated.timing(resultFadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(resultScaleAnim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    };


    const handleOpponentDisconnected = data => {
      console.log('👋 opponent-disconnected:', data);

      if (hasNavigatedToResultRef.current) {
        console.log('🛑 Already navigated to results, ignoring');
        return;
      }

      hasNavigatedToResultRef.current = true;
      setGameEnded(true);
      stopEffect('ticktock');

      // ✅ NO need to emit - server already handled cleanup

      Alert.alert(
        'Opponent Disconnected',
        'Your opponent has left the game. You win!',
        [
          {
            text: 'OK',
            onPress: () => {
              const attempts = correctAnswersRef.current + incorrectCountRef.current;
              const acc = attempts > 0 ? Math.round((correctAnswersRef.current / attempts) * 100) : 0;

              setResultData({
                gameResult: 'win', // Auto win on disconnect
                totalScore: scoreRef.current,
                opponentScore: opponentScoreRef.current || 0,
                correctCount: correctAnswersRef.current,
                inCorrectCount: incorrectCountRef.current,
                skippedQuestions: skippedCountRef.current,
                correctPercentage: acc,
                durationSeconds: timer,
                opponentDisconnected: true,
                winner: myMongoIdRef.current,
              });
              setShowResultModal(true);

              Animated.parallel([
                Animated.timing(resultFadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
                Animated.spring(resultScaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
              ]).start();
            },
          },
        ],
      );
    };
    const handleError = data => {
      console.error('❌ Socket error:', data);
      Alert.alert('Error', data.message || 'An error occurred');
    };

    const handleOpponentEmoji = data => {
      console.log('😄 opponent-emoji-received:', data);
      if (data.emoji) {
        setOpponentEmoji(data.emoji);
        // Clear previous timeout if exists (optional but good)
        setTimeout(() => setOpponentEmoji(null), 3000);
      }
    };

    const handleGracePeriod = data => {
      console.log('⏳ game-in-grace-period:', data);
      Alert.alert(
        'Opponent Disconnected',
        data.message || 'Waiting for opponent to reconnect...',
      );
      // Set a state to show a "Waiting..." banner?
    };

    const handleOpponentReconnected = data => {
      console.log('♻️ opponent-reconnected:', data);
      Alert.alert('Reconnected', data.message || 'Opponent has reconnected!');
    };

    const handleGracePeriodExpired = data => {
      console.log('⏰ grace-period-expired:', data);
      // Treat this like a disconnect win
      handleOpponentDisconnected(data);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('new-question', handleNewQuestion);
    socket.on('next-question', handleNextQuestion);
    socket.on('opponent-score-update', handleOpponentScoreUpdate);
    socket.on('game-ended', handleGameEnded);
    socket.on('opponent-disconnected', handleOpponentDisconnected);
    // ✅ NEW LISTENERS
    socket.on('opponent-emoji-received', handleOpponentEmoji);
    socket.on('game-in-grace-period', handleGracePeriod);
    socket.on('grace-period-expired', handleGracePeriodExpired);
    socket.on('opponent-reconnected', handleOpponentReconnected);
    socket.on('error', handleError);

    if (currentQuestion) {
      console.log('📝 Setting initial question:', currentQuestion);
      const mathSymbol = getMathSymbol(currentQuestion.symbol);
      setQuestion(
        `${currentQuestion.input1} ${mathSymbol} ${currentQuestion.input2}`,
      );
      setCorrectAnswer(String(currentQuestion.answer));
      setLoading(false);
      setQuestionIndex(1);
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('new-question', handleNewQuestion);
      socket.off('next-question', handleNextQuestion);
      socket.off('opponent-score-update', handleOpponentScoreUpdate);
      socket.off('game-ended', handleGameEnded);
      socket.off('opponent-disconnected', handleOpponentDisconnected);
      // ✅ REMOVE LISTENERS
      socket.off('opponent-emoji-received', handleOpponentEmoji);
      socket.off('game-in-grace-period', handleGracePeriod);
      socket.off('grace-period-expired', handleGracePeriodExpired);
      socket.off('opponent-reconnected', handleOpponentReconnected);
      socket.off('error', handleError);
    };
  }, [
    socket,
    currentQuestion,
    opponent,
    difficulty,
    timer,
    navigation,
    gameEnded,
  ]);

  /* ================= TIMER LOGIC ================= */
  useEffect(() => {
    if (gameEnded) return;

    const interval = setInterval(() => {
      if (!isPaused) {
        totalTimeRef.current -= 1;
        const remaining = totalTimeRef.current;
        setMinutes(Math.floor(remaining / 60));
        setSeconds(remaining % 60);

        if (remaining <= 10 && remaining > 0) {
          if (!last10PlayedRef.current) {
            playEffect('ticktock', isSoundOnRef.current);
            last10PlayedRef.current = true;
          }
          Animated.sequence([
            Animated.timing(animateWatch, {
              toValue: 1.4,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(animateWatch, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start();
        }

        if (remaining % 30 === 0 && remaining !== timer && remaining > 0) {
          setIsThirtySecPhase(true);
          playEffect('timer', isSoundOnRef.current);
          Animated.sequence([
            Animated.timing(animateWatch, {
              toValue: 1.4,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(animateWatch, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(() => setIsThirtySecPhase(false));
        }

        if (remaining <= 0) {
          clearInterval(interval);
          handleTimeUp();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, timer, difficulty, navigation, socket, opponent, gameEnded]);

  /* ================= HANDLERS ================= */
  const handleTimeUp = () => {
    if (hasNavigatedToResultRef.current || gameEnded) return;

    hasNavigatedToResultRef.current = true;
    setGameEnded(true);
    stopEffect('ticktock');

    console.log('⏰ Time up! Final score:', scoreRef.current);

    // ✅ EMIT game-ended to trigger server cleanup
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('game-ended');
    }

    // ✅ SHOW MODAL INSTEAD OF NAVIGATING
    const attempts = correctAnswersRef.current + incorrectCountRef.current;
    const acc = attempts > 0 ? Math.round((correctAnswersRef.current / attempts) * 100) : 0;

    let gameResult = 'draw';
    if (scoreRef.current > (opponentScoreRef.current || 0)) gameResult = 'win';
    else if (scoreRef.current < (opponentScoreRef.current || 0)) gameResult = 'lose';

    setResultData({
      gameResult,
      totalScore: scoreRef.current,
      opponentScore: opponentScoreRef.current || 0,
      correctCount: correctAnswersRef.current,
      inCorrectCount: incorrectCountRef.current,
      skippedQuestions: skippedCountRef.current,
      correctPercentage: acc,
      durationSeconds: timer,
    });
    setShowResultModal(true);

    Animated.parallel([
      Animated.timing(resultFadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(resultScaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();
  };

  /* ================= REPLACE handleGameExit FUNCTION ================= */

  const handleGameExit = () => {
    stopEffect('ticktock');

    // ✅ EMIT game-ended to trigger server cleanup
    if (socketRef.current && socketRef.current.connected) {
      console.log('🚪 Player exiting - emitting game-ended');
      socketRef.current.emit('game-ended');
    }

    hasNavigatedToResultRef.current = true;
    setGameEnded(true);
    navigation.replace('BottomTab');
  };



  const handleToggleSound = () => {
    toggleSound();
    const newVal = !isSoundOn;
    isSoundOnRef.current = newVal;
    if (!newVal) {
      stopEffect('ticktock');
    } else {
      if (totalTimeRef.current <= 10 && totalTimeRef.current > 0) {
        last10PlayedRef.current = false;
        playEffect('ticktock', true);
      }
    }
  };

  const handleToggleReactions = () => {
    setIsReactionPickerOpen(prev => !prev);
  };

  const handleSelectReaction = emoji => {
    setIsReactionPickerOpen(false);
    if (socketRef.current && socketRef.current.connected) {
      // ✅ Updated to match Front-End Guide
      socketRef.current.emit('send-emoji', {
        emoji,
      });
      // OPTIONAL: Show my own emoji locally too?
    }
  };

  // ✅ NEW MODAL ACTIONS
  const handleRematch = () => {
    navigation.replace('WaitingForOpponent', {
      challengedUser: {
        username: opponent?.username || 'Opponent',
        id: opponentMongoIdRef.current,
        _id: opponentMongoIdRef.current,
      },
      diff: difficulty,
      timer: timer,
      symbol: currentQuestion?.symbol,
    });
  };

  const handleNewGame = () => {
    navigation.navigate('ChallengeScreen');
  };

  const handleCloseResults = () => {
    navigation.navigate('BottomTab');
  };

  const handlePress = async value => {
    if (
      loading ||
      awaitingResult ||
      totalTimeRef.current <= 0 ||
      feedback ||
      gameEnded
    )
      return;

    const key = value.toString().toLowerCase();

    if (key === 'clear' || key === 'clr') return setInput('');

    if (key === '⌫' || key === 'del') {
      return setInput(prev => prev.slice(0, -1));
    }

    if (key === 'reverse' || key === 'rev') {
      return setIsReverse(prev => !prev);
    }

    if (key === 'pm') {
      return setInput(prev => {
        if (prev.startsWith('-')) return prev.slice(1);
        return '-' + prev;
      });
    }

    if (key === 'skip') {
      skippedCountRef.current += 1;
      setSkippedCount(skippedCountRef.current);
      setFeedback('skipped');
      playEffect('skipped', isSoundOnRef.current);

      console.log('⏭️ Skipping question');

      setAnswerHistory(prev => [{ isCorrect: null }, ...prev].slice(0, 8));

      socketRef.current?.emit('submit-answer', {
        answer: null,
        playerId: myMongoIdRef.current,
        timeSpent: 0,
        skipped: true,
      });

      setTimeout(() => setFeedback(null), 900);
      return;
    }

    const newInput = isReverse ? value + input : input + value;
    setInput(newInput);

    if (newInput.length >= correctAnswer.length) {
      const isCorrect = newInput === correctAnswer;
      setFeedback(isCorrect ? 'correct' : 'incorrect');
      playEffect(isCorrect ? 'correct' : 'incorrect', isSoundOnRef.current);

      setAnswerHistory(prev => [{ isCorrect }, ...prev].slice(0, 8));

      if (isCorrect) {
        setBonusText('+4 Bonus');
      } else {
        setBonusText('');
      }

      if (isCorrect) {
        scoreRef.current += 1;
        setScore(scoreRef.current);
        correctAnswersRef.current += 1;
        setCorrectAnswers(correctAnswersRef.current);
      } else {
        incorrectCountRef.current += 1;
      }

      console.log('📤 Submitting answer:', {
        playerId: myMongoIdRef.current,
        answer: newInput,
        isCorrect,
      });

      socketRef.current?.emit('submit-answer', {
        answer: newInput,
        playerId: myMongoIdRef.current,
        timeSpent: 0,
      });

      setAwaitingResult(true);
      setTimeout(() => {
        setAwaitingResult(false);
        if (feedback) setFeedback(null);
        setBonusText('');
      }, 5000);
    }
  };

  const getKeyButtonWidth = () => width * 0.2;
  const getKeyButtonHeight = () => height * 0.1;

  const Content = () => (
    <View style={[styles.container, { paddingTop: insets.top + 30 }]}>
      {/* 1. TOP BAR (Synced with MathInputScreen) */}
      <View style={[styles.topBar, { backgroundColor: theme.cardBackground || '#1E293B' }]}>
        <TouchableOpacity
          onPress={() => {
            if (!gameEnded) {
              Alert.alert(
                'Leave Game?',
                'Are you sure you want to leave? You will lose the match.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Leave', style: 'destructive', onPress: handleGameExit },
                ],
              );
            } else {
              stopEffect('ticktock');
              navigation.goBack();
            }
          }}
          style={styles.iconButton}
          hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
        >
          <Icon name="caret-back-outline" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.timerContainer}>
          <Animated.Image
            source={require('../assets/Stopwatch.png')}
            style={[
              styles.timerIcon,
              {
                transform: [{ scale: animateWatch }],
                tintColor: minutes * 60 + seconds <= 10 || isThirtySecPhase ? 'red' : '#fff'
              }
            ]}
          />
          <Text style={styles.timerText}>{`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}</Text>
        </View>

        <TouchableOpacity onPress={handleToggleSound} style={styles.iconButton1}>
          <Icon name={isSoundOn ? 'volume-high' : 'volume-mute'} size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* 2. OPPONENT HEADER (Existing) */}
      <View style={styles.opponentHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.opponentAvatarContainer}>
            <View style={[styles.avatarCircle, { backgroundColor: '#0F766E', width: 40, height: 40 }]}>
              {opponent?.profilePic ? (
                <Image source={{ uri: opponent.profilePic }} style={{ width: 40, height: 40, borderRadius: 20 }} />
              ) : (
                <Text style={styles.avatarInitial}>
                  {opponent?.username?.charAt(0).toUpperCase() || 'O'}
                </Text>
              )}
            </View>
            <View style={styles.onlineDot} />
          </View>

          <View style={styles.opponentInfo}>
            <Text style={styles.opponentName} numberOfLines={1}>
              {opponent?.username || 'Opponent'}
            </Text>

            <View style={styles.historyContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.historyScrollContent}
              >
                {opponentHistory.map((item, index) => {
                  const isRight = typeof item === 'object' && item !== null ? item.isCorrect : item;
                  return (
                    <Icon
                      key={index}
                      name={isRight ? "checkmark" : "close"}
                      size={16}
                      color={isRight ? "#10B981" : "#EF4444"}
                      style={{ marginRight: 4 }}
                    />
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </View>

        <View style={styles.headerRight}>
          <Text style={styles.scoreLabel}>Pts</Text>
          <Text style={styles.scoreValue}>{opponentScore}</Text>
        </View>
      </View>

      {/* ⚠️ Disconnected Banner */}
      {!isConnected && (
        <View style={styles.disconnectedBanner}>
          <Text style={styles.disconnectedText}>⚠️ Reconnecting...</Text>
        </View>
      )}

      {/* 3. MY DATA (New Minimal "You" Section) */}
      <View style={styles.myDataContainer}>
        <View style={styles.headerLeft}>
          <View style={styles.opponentAvatarContainer}>
            <View style={[styles.avatarCircle, { width: 42, height: 42, backgroundColor: '#4F46E5' }]}>
              {user?.profilePic ? (
                <Image source={{ uri: user.profilePic }} style={{ width: 42, height: 42, borderRadius: 21 }} />
              ) : (
                <Text style={styles.avatarInitial}>{user?.username?.charAt(0).toUpperCase() || 'Y'}</Text>
              )}
            </View>
            <View style={styles.youBadge}>
              <Text style={styles.youBadgeText}>YOU</Text>
            </View>
          </View>

          <View style={styles.opponentInfo}>
            <Text style={styles.playerName} numberOfLines={1}>
              {user?.username || 'You'}
            </Text>

            {/* My History */}
            <View style={styles.historyContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.historyScrollContent}
              >
                {answerHistory.map((item, index) => (
                  <Icon
                    key={index}
                    name={item.isCorrect === null ? "close" : (item.isCorrect ? "checkmark" : "close")}
                    size={16}
                    color={item.isCorrect === null ? "#FF6B6B" : (item.isCorrect ? "#10B981" : "#EF4444")}
                    style={{ marginRight: 4 }}
                  />
                ))}
              </ScrollView>
            </View>
          </View>
        </View>

        <View style={styles.headerRight}>
          <Text style={styles.scoreLabel}>Pts</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>
      </View>


      {/* 4. Question & Answer Area (Synced) */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <Text style={styles.question}>{loading ? '...' : question}</Text>

        <View style={[styles.answerBox, { backgroundColor: theme.cardBackground || '#1E293B' }, feedback === 'correct' ? { borderColor: 'green', borderWidth: 2 } : feedback === 'incorrect' ? { borderColor: 'red', borderWidth: 2 } : feedback === 'skipped' ? { borderColor: 'orange', borderWidth: 2 } : {}]}>
          <Text style={[styles.answerText, feedback === 'correct' ? { color: 'green' } : feedback === 'incorrect' ? { color: 'red' } : feedback === 'skipped' ? { color: 'orange' } : {}]}>
            {input || (feedback === 'correct' ? 'Correct' : feedback === 'incorrect' ? 'Incorrect' : feedback === 'skipped' ? 'Skipped' : '')}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.speechBubble, { position: 'absolute', right: width * 0.1, top: '40%' }]}
          onPress={handleToggleReactions}
          activeOpacity={0.8}
        >
          <Icon name="chatbubble-ellipses" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {isReactionPickerOpen && (
        <View style={styles.reactionPanel}>
          {REACTIONS.map((emoji, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelectReaction(emoji)}
              style={styles.reactionItem}>
              <Text style={styles.reactionText}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}


      {/* 5. Keypad (Synced) */}
      <View style={styles.keypadContainer}>
        {currentLayout.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keypadRow}>
            {row.map((item, index) => {
              const strItem = item.toString().toLowerCase();
              const isSpecial = ['clear', 'clr', '⌫', 'del', 'ref', 'pm', 'skip', '.', 'reverse'].includes(strItem);
              const isNa = strItem === 'na';

              if (isNa) return <View key={index} style={{ width: getKeyButtonWidth(), height: getKeyButtonHeight() }} />;

              let content;
              if (strItem === 'del' || strItem === '⌫') {
                content = <MaterialIcons name="backspace" size={24} color="#fff" />;
              } else if (strItem === 'ref' || strItem === 'reverse') {
                content = (
                  <Text style={[styles.keyText, { fontSize: 16, fontWeight: '800', fontStyle: 'italic' }]}>REV</Text>
                );
              } else if (strItem === 'pm') {
                content = <Text style={[styles.keyText, { color: '#fff' }]}>+/-</Text>;
              } else if (strItem === 'clr' || strItem === 'clear') {
                content = <Text style={[styles.keyText, { color: '#fff' }]}>Clear</Text>;
              } else if (strItem === 'skip') {
                content = (
                  <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                    <Text style={[styles.keyText, { fontSize: 14 }]}>Skip</Text>
                    <MaterialIcons name="skip-next" size={24} color="#fff" />
                  </View>
                );
              } else {
                content = <Text style={styles.keyText}>{item.toUpperCase()}</Text>;
              }

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handlePress(strItem === 'ref' ? 'reverse' : item)}
                  disabled={gameEnded}
                  style={[
                    styles.keyButton,
                    {
                      width: getKeyButtonWidth(),
                      height: getKeyButtonHeight(),
                      borderBottomWidth: 4,
                      borderBottomColor: 'rgba(0,0,0,0.3)',
                    },
                    (isSpecial || strItem === '-') ? styles.specialKey : null,
                    ((strItem === 'ref' || strItem === 'reverse') && isReverse) && {
                      borderBottomColor: 'rgba(0,0,0,0.5)',
                      borderWidth: 0,
                      borderBottomWidth: 4,
                      elevation: 10,
                      shadowColor: theme.primaryColor || '#595CFF',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.5,
                      shadowRadius: 8,
                      transform: [{ scale: revScale }], // Using ref for animation
                    },
                    gameEnded && { opacity: 0.5 },
                  ]}
                >
                  {(strItem === 'ref' || strItem === 'reverse') && isReverse ? (
                    <LinearGradient
                      colors={theme.buttonGradient || [theme.primaryColor || '#595CFF', theme.secondaryColor || '#87AEE9']}
                      style={styles.gradientButton}
                    >
                      {content}
                    </LinearGradient>
                  ) : !isSpecial && strItem !== '-' ? (
                    <LinearGradient
                      colors={theme.buttonGradient || [theme.primaryColor || '#595CFF', theme.secondaryColor || '#87AEE9']}
                      style={styles.gradientButton}
                    >
                      {content}
                    </LinearGradient>
                  ) : (
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                      {content}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      {/* ✅ RESULT MODAL OVERLAY */}
      {showResultModal && resultData && (
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.resultCard,
              {
                opacity: resultFadeAnim,
                transform: [{ scale: resultScaleAnim }],
                borderColor: resultData.gameResult === 'win' ? '#4ade80' : resultData.gameResult === 'lose' ? '#f87171' : '#fbbf24',
              },
            ]}
          >
            {/* Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={handleCloseResults} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                <Icon name="close" size={28} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => console.log('Share')} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                <Icon name="share-social-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.resultContent}>
              <View style={[styles.resultBadge, { backgroundColor: resultData.gameResult === 'win' ? '#4ade80' : resultData.gameResult === 'lose' ? '#f87171' : '#fbbf24' }]}>
                <Text style={styles.resultBadgeText}>
                  {resultData.gameResult === 'win' ? 'VICTORY' : resultData.gameResult === 'lose' ? 'DEFEAT' : 'DRAW'}
                </Text>
              </View>

              <Text style={[styles.resultTitle, { color: resultData.gameResult === 'win' ? '#4ade80' : resultData.gameResult === 'lose' ? '#f87171' : '#fbbf24' }]}>
                {resultData.gameResult === 'win' ? 'You Won!' : resultData.gameResult === 'lose' ? 'You Lost!' : 'Draw!'}
              </Text>

              {/* ✅ Players Avatar Row */}
              <View style={styles.modalPlayersContainer}>
                {/* YOU */}
                <View style={styles.modalPlayer}>
                  <View style={[styles.avatarCircle, { width: 60, height: 60, backgroundColor: '#4F46E5', marginBottom: 8 }]}>
                    {user?.profilePic ? (
                      <Image source={{ uri: user.profilePic }} style={{ width: 60, height: 60, borderRadius: 30 }} />
                    ) : (
                      <Text style={[styles.avatarInitial, { fontSize: 24 }]}>{user?.username?.charAt(0).toUpperCase() || 'Y'}</Text>
                    )}
                  </View>
                  <Text style={styles.modalPlayerName}>You</Text>
                  <Text style={[styles.mainScore, { fontSize: 28 }]}>{resultData.totalScore}</Text>
                </View>

                <View style={styles.vsContainer}>
                  <Text style={styles.modalVsText}>VS</Text>
                </View>

                {/* OPPONENT */}
                <View style={styles.modalPlayer}>
                  <View style={[styles.avatarCircle, { width: 60, height: 60, backgroundColor: '#0F766E', marginBottom: 8 }]}>
                    {opponent?.profilePic ? (
                      <Image source={{ uri: opponent.profilePic }} style={{ width: 60, height: 60, borderRadius: 30 }} />
                    ) : (
                      <Text style={[styles.avatarInitial, { fontSize: 24 }]}>{opponent?.username?.charAt(0).toUpperCase() || 'O'}</Text>
                    )}
                  </View>
                  <Text style={styles.modalPlayerName}>{opponent?.username || 'Opponent'}</Text>
                  <Text style={[styles.mainScore, { fontSize: 28 }]}>{resultData.opponentScore}</Text>
                </View>
              </View>

              <Text style={{ fontSize: 40, marginTop: 10 }}>
                {resultData.gameResult === 'win' ? '🏆' : resultData.gameResult === 'lose' ? '😥' : '🤝'}
              </Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.actionButton, styles.rematchButton]} onPress={handleRematch}>
                <Text style={styles.actionButtonText}>Rematch</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.newGameButton]} onPress={handleNewGame}>
                <Text style={styles.actionButtonText}>New Game</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}
    </View>
  );

  return theme.backgroundGradient ? (
    <LinearGradient colors={theme.backgroundGradient} style={{ flex: 1 }}>
      <Content />
    </LinearGradient>
  ) : (
    <View
      style={{ flex: 1, backgroundColor: theme.backgroundColor || '#0B1220' }}>
      <Content />
    </View>
  );
};

export default MultiPlayerGame;

const styles = StyleSheet.create({
  container: { flex: 1 },
  // ✅ TOP BAR (Synced with MathInputScreen)
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.04,
    borderBottomEndRadius: 15,
    borderBottomStartRadius: 15,
    height: 60,
  },
  iconButton: {
    width: width * 0.35,
    height: width * 0.12,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  iconButton1: {
    width: width * 0.35,
    height: width * 0.12,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  timerContainer: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  timerText: {
    color: '#fff',
    fontSize: scaleFont(13),
    fontWeight: '600',
    opacity: 0.7,
  },
  timerIcon: { width: 18, height: 18 },

  // ✅ MULTIPLAYER SPECIFIC HEADER STYLES
  opponentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // Removed background/border as requested to match player section
    marginHorizontal: width * 0.04,
    marginTop: height * 0.01,
    padding: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  backButton: {
    padding: 4,
  },
  opponentAvatarContainer: {
    position: 'relative',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#fff',
  },
  opponentInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  opponentName: {
    fontSize: scaleFont(14),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  historyContainer: {
    height: 20,
    width: '100%',
  },
  historyScrollContent: {
    alignItems: 'center',
  },
  headerRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  scoreLabel: {
    fontSize: scaleFont(10),
    color: '#CBD5E1',
    fontWeight: '600',
  },
  scoreValue: {
    fontSize: scaleFont(18),
    fontWeight: 'bold',
    color: '#fff',
  },
  avatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 4,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: '#fff',
    fontSize: scaleFont(14),
    fontWeight: '700',
  },

  // ✅ NEW: My Data Section (Matches Opponent Header)
  // ✅ NEW: My Data Section (Minimal, no box)
  myDataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // Removed background/border as requested
    marginHorizontal: width * 0.04,
    marginTop: height * 0.02,
    marginBottom: height * 0.02,
    padding: 10, // Keep padding for touch area/spacing
  },
  playerName: {
    fontSize: scaleFont(16),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  youBadge: {
    position: 'absolute',
    bottom: -8,
    right: -10,
    backgroundColor: '#F59E0B', // Amber color for visibility
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#0F172A',
  },
  youBadgeText: {
    fontSize: 8,
    color: '#000',
    fontWeight: '900',
  },

  // ✅ QUESTION & ANSWER AREA (Synced with MathInputScreen)
  question: {
    fontSize: scaleFont(22),
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  answerBox: {
    width: width * 0.6,
    height: height * 0.06,
    backgroundColor: '#1E293B',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  answerText: { fontSize: scaleFont(18), color: '#fff', fontWeight: '600' },

  // ✅ KEYPAD (Synced with MathInputScreen)
  keypadContainer: {
    width: '100%',
    paddingBottom: height * 0.02,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.02,
    paddingHorizontal: width * 0.05,
  },
  keyButton: {
    width: width * 0.2, // Will be overridden dynamically
    height: height * 0.1, // Will be overridden dynamically
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#1C2433',
  },
  specialKey: { backgroundColor: '#1C2433' },
  gradientButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  keyText: { fontSize: scaleFont(18), color: '#fff', fontWeight: '600' },

  // ✅ EXTRAS
  disconnectedBanner: {
    backgroundColor: '#EF4444',
    padding: 4,
    alignItems: 'center',
    marginHorizontal: width * 0.04,
    marginTop: 8,
    borderRadius: 4,
  },
  disconnectedText: {
    color: '#fff',
    fontSize: scaleFont(12),
    fontWeight: '600',
  },
  reactionPanel: {
    position: 'absolute',
    right: width * 0.08,
    top: height * 0.17,
    backgroundColor: '#0F172A',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    maxWidth: width * 0.6,
    zIndex: 20,
    elevation: 8,
  },
  reactionItem: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  reactionText: {
    fontSize: scaleFont(18),
  },

  // ✅ MODAL STYLES
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  resultCard: {
    width: '90%',
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 20,
    borderWidth: 2,
    alignItems: 'center',
  },
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  resultContent: {
    alignItems: 'center',
    width: '100%',
  },
  resultBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 10,
  },
  resultBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  playersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  playerSide: {
    alignItems: 'center',
  },
  labelTitle: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 5,
  },
  mainScore: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  vsText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#64748b',
  },
  modalActions: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  rematchButton: {
    backgroundColor: '#8B5CF6',
  },
  newGameButton: {
    backgroundColor: '#3B82F6',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // ✅ NEW MODAL SUB-COMPONENTS
  modalPlayersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
    marginVertical: 15,
  },
  modalPlayer: {
    alignItems: 'center',
    width: '35%',
  },
  modalPlayerName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    textAlign: 'center',
  },
  vsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalVsText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#64748b',
    fontStyle: 'italic',
  },
});
