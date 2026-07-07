import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useSocket } from './Socket';

const ChallengeContext = createContext(null);

export const useChallenge = () => useContext(ChallengeContext);

export const ChallengeProvider = ({ children }) => {
  const socket = useSocket();
  const navigation = useNavigation();

  const [showChallengePopup, setShowChallengePopup] = useState(false);
  const [challengeData, setChallengeData] = useState(null);
  const [waitingForGame, setWaitingForGame] = useState(false);
  const [popupAnimation] = useState(new Animated.Value(0));

  const handleDismissPopup = useCallback(() => {
    Animated.timing(popupAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowChallengePopup(false);
      setChallengeData(null);
    });
  }, [popupAnimation]);

  // ─── Global listeners — mounted ONCE at app root, never torn down per-screen ───
  useEffect(() => {
    if (!socket) return;

    console.log('🔌 [CHALLENGE] Setting up challenge socket listeners');
    const onChallengeReceived = (data) => {
      console.log('🎮 [CHALLENGE] Challenge received:', {
        challengeId: data.challengeId,
        challenger: data.challenger?.username,
        difficulty: data.settings?.diff,
        timer: data.settings?.timer,
        timestamp: new Date().toISOString(),
      });
      setChallengeData(data);
      setShowChallengePopup(true);
      Animated.spring(popupAnimation, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
      console.log('⏰ [CHALLENGE] Challenge will expire in 60 seconds');
      setTimeout(() => handleDismissPopup(), 60000);
    };

    const onChallengeExpired = (data) => {
      console.log('⏱️ [CHALLENGE] Challenge expired:', {
        challengeId: data.challengeId,
        timestamp: new Date().toISOString(),
      });
      setChallengeData((curr) => {
        if (curr?.challengeId === data.challengeId) {
          console.log('🔔 [CHALLENGE] Dismissing expired challenge popup');
          handleDismissPopup();
          Toast.show({ type: 'info', text1: 'Challenge Expired', text2: 'The challenge has expired' });
        }
        return curr;
      });
    };

    const onChallengeCancelled = (data) => {
      console.log('❌ [CHALLENGE] Challenge cancelled:', {
        challengeId: data.challengeId,
        cancelledBy: data.canceller?.username,
        timestamp: new Date().toISOString(),
      });
      setChallengeData((curr) => {
        if (curr?.challengeId === data.challengeId) {
          console.log('🔔 [CHALLENGE] Dismissing cancelled challenge popup');
          handleDismissPopup();
          Toast.show({
            type: 'info',
            text1: 'Challenge Cancelled',
            text2: `${data.canceller?.username || 'Opponent'} cancelled the challenge`,
          });
        }
        return curr;
      });
    };

    socket.on('challenge-received', onChallengeReceived);
    socket.on('challenge-expired', onChallengeExpired);
    socket.on('challenge-cancelled', onChallengeCancelled);

    return () => {
      console.log('🔌 [CHALLENGE] Cleaning up challenge socket listeners');
      socket.off('challenge-received', onChallengeReceived);
      socket.off('challenge-expired', onChallengeExpired);
      socket.off('challenge-cancelled', onChallengeCancelled);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const handleAcceptChallenge = async () => {
    console.log('✅ [CHALLENGE] User accepted challenge:', {
      challengeId: challengeData.challengeId,
      challenger: challengeData.challenger?.username,
      timestamp: new Date().toISOString(),
    });
    if (!socket?.connected) {
      console.error('❌ [CHALLENGE] Socket not connected when accepting challenge');
      Toast.show({ type: 'error', text1: 'Connection Error', text2: 'Please check your connection' });
      return;
    }
    const activeChallenge = challengeData;
    handleDismissPopup();
    setWaitingForGame(true);
    Toast.show({ type: 'success', text1: 'Challenge Accepted!', text2: 'Starting game...', visibilityTime: 2000 });
    console.log('📤 [CHALLENGE] Emitting accept-challenge event');
    socket.emit('accept-challenge', { challengeId: activeChallenge.challengeId });

    const userData = await AsyncStorage.getItem('userData');
    const user = userData ? JSON.parse(userData) : null;
    const myMongoId = user?._id || user?.id;
    console.log('👤 [CHALLENGE] User ID retrieved:', myMongoId);

    const onMatchFound = (data) => {
      console.log('🎮 [CHALLENGE] Match found:', {
        opponent: data.opponent?.username,
        timestamp: new Date().toISOString(),
      });
      const opponent = data.opponent;

      const onGameStarted = (gameData) => {
        console.log('🚀 [CHALLENGE] Game started:', {
          challengeId: activeChallenge.challengeId,
          timestamp: new Date().toISOString(),
        });
        setWaitingForGame(false);
        setTimeout(() => {
          navigation.navigate('MultiPlayerGame', {
            currentQuestion: gameData.currentQuestion,
            timer: activeChallenge.settings.timer,
            difficulty: activeChallenge.settings.diff,
            opponent,
            myMongoId,
            isChallenge: true,
          });
        }, 300);
        socket.off('game-started', onGameStarted);
      };

      socket.once('game-started', onGameStarted);

      setTimeout(() => {
        setWaitingForGame((curr) => {
          if (curr) {
            console.log('⚠️ [CHALLENGE] Timeout: Game did not start within 5 seconds, navigating anyway');
            navigation.navigate('MultiPlayerGame', {
              currentQuestion: null,
              timer: activeChallenge.settings.timer,
              difficulty: activeChallenge.settings.diff,
              opponent,
              myMongoId,
              isChallenge: true,
            });
          }
          return false;
        });
      }, 5000);
    };

    socket.once('match-found', onMatchFound);
    socket.once('challenge-error', (err) => {
      console.error('❌ [CHALLENGE] Error accepting challenge:', err);
      setWaitingForGame(false);
      Toast.show({ type: 'error', text1: 'Challenge Failed', text2: err?.message || 'Something went wrong' });
    });
  };

  const handleDeclineChallenge = () => {
    console.log('🚫 [CHALLENGE] User declined challenge:', {
      challengeId: challengeData.challengeId,
      challenger: challengeData.challenger?.username,
      timestamp: new Date().toISOString(),
    });
    if (!socket?.connected) {
      console.error('❌ [CHALLENGE] Socket not connected when declining challenge');
      Toast.show({ type: 'error', text1: 'Connection Error' });
      return;
    }
    console.log('📤 [CHALLENGE] Emitting decline-challenge event');
    socket.emit('decline-challenge', { challengeId: challengeData.challengeId });
    handleDismissPopup();
    Toast.show({ type: 'info', text1: 'Challenge Declined', text2: 'Challenge has been declined' });
  };

  return (
    <ChallengeContext.Provider
      value={{
        showChallengePopup,
        challengeData,
        waitingForGame,
        popupAnimation,
        handleAcceptChallenge,
        handleDeclineChallenge,
        handleDismissPopup,
      }}
    >
      {children}
    </ChallengeContext.Provider>
  );
};